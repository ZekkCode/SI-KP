<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Reader\XLSX\Reader as XLSXReader;
use OpenSpout\Writer\XLSX\Writer as XLSXWriter;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AdminDashboardController extends Controller
{
    /**
     * Halaman Dashboard Utama Super User / Super Admin.
     */
    public function index(Request $request): Response
    {
        $currentUser = $request->user();

        // 1. Data Pegawai (Dosen & Staff digabung menjadi satu dataset)
        $pegawais = User::where(function ($q) {
            $q->whereIn('user_type', ['dosen', 'staff'])
              ->orWhereIn('role', ['dosen', 'prodi', 'tu']);
        })
        ->orderBy('name')
        ->get()
        ->map(function ($u) {
            $roles = is_array($u->roles_assignment) ? $u->roles_assignment : [];
            if ($u->role === 'prodi' && !in_array('koor_prodi', $roles)) {
                $roles[] = 'koor_prodi';
            }
            if ($u->role === 'tu' && !in_array('tu', $roles)) {
                $roles[] = 'tu';
            }
            if ($u->user_type === 'dosen' && empty($roles)) {
                $roles[] = 'dosen_pembimbing';
            }

            $type = $u->user_type;
            if (!$type) {
                $type = in_array($u->role, ['dosen', 'prodi']) ? 'dosen' : 'staff';
            }

            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'avatar' => $u->avatar,
                'nip' => $u->nip ?? '-',
                'user_type' => $type,
                'bidang_keahlian' => $u->bidang_keahlian ?? [],
                'no_telepon' => $u->no_telepon ?? '-',
                'roles_assignment' => array_values(array_unique($roles)),
                'is_dekan' => (bool) $u->is_dekan,
                'is_superadmin' => $u->isSuperAdmin(),
                'is_root' => (bool) $u->is_root,
                'status_akun' => $u->status_akun ?? 'aktif',
            ];
        });

        $dosens = $pegawais->where('user_type', 'dosen')->values();
        $staffs = $pegawais->where('user_type', 'staff')->values();

        // 2. Data Akun Baru SSO yang belum di-assign peran/tugas
        $unassignedUsers = User::where(function ($q) {
            $q->whereNull('user_type')
              ->orWhere('user_type', '');
        })
        ->where(function ($q) {
            $q->whereNull('role')
              ->orWhere('role', '');
        })
        ->where(function ($q) {
            $q->whereNull('roles_assignment')
              ->orWhere('roles_assignment', '[]')
              ->orWhere('roles_assignment', '');
        })
        ->orderByDesc('created_at')
        ->get()
        ->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'avatar' => $u->avatar,
                'created_at' => $u->created_at?->diffForHumans() ?? '-',
            ];
        });

        // 3. Dekan Aktif
        $dekanAktif = User::where('is_dekan', true)->first(['id', 'name', 'nip', 'email']);

        // 4. Statistik
        $stats = [
            'total_users' => User::count(),
            'total_pegawai' => $pegawais->count(),
            'total_dosen' => $dosens->count(),
            'total_staff' => $staffs->count(),
            'total_unassigned' => $unassignedUsers->count(),
            'total_mahasiswa' => User::where('user_type', 'mahasiswa')->orWhere('role', 'mahasiswa')->count(),
            'total_instansi' => User::where('user_type', 'instansi')->orWhere('role', 'instansi')->count(),
            'total_superadmin' => User::where('is_root', true)->orWhereJsonContains('roles_assignment', 'superadmin')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'pegawais' => $pegawais,
            'dosens' => $dosens,
            'staffs' => $staffs,
            'unassigned_users' => $unassignedUsers,
            'dekan_aktif' => $dekanAktif,
            'is_root' => (bool) $currentUser->is_root,
        ]);
    }

    /**
     * Simpan / Tambah Akun Pegawai Baru (Dosen atau Staff).
     */
    public function storePegawai(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'user_type' => ['required', Rule::in(['dosen', 'staff'])],
            'password' => ['nullable', 'string', 'min:6'],
            'nip' => ['nullable', 'string', 'max:50'],
            'no_telepon' => ['nullable', 'string', 'max:25'],
            'bidang_keahlian' => ['nullable'],
            'roles' => ['required', 'array', 'min:1'],
            'is_superadmin' => ['nullable', 'boolean'],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Email kampus wajib diisi.',
            'email.unique' => 'Email ini sudah terdaftar di sistem.',
            'user_type.required' => 'Pilih jenis akun (Dosen atau Staff).',
            'roles.required' => 'Pilih minimal satu penugasan peran.',
            'roles.min' => 'Pilih minimal satu penugasan peran.',
        ]);

        $roles = $validated['roles'] ?? [];
        if ($request->user()->is_root && !empty($validated['is_superadmin'])) {
            $roles[] = 'superadmin';
        }
        $roles = array_values(array_unique($roles));

        $bidang = $validated['bidang_keahlian'] ?? [];
        if (is_string($bidang)) {
            $bidang = array_filter(array_map('trim', explode(',', $bidang)));
        }

        $password = !empty($validated['password']) ? $validated['password'] : 'password';
        $userType = $validated['user_type'];

        $role = $userType === 'dosen'
            ? (in_array('koor_prodi', $roles) ? 'prodi' : 'dosen')
            : (in_array('tu', $roles) ? 'tu' : 'staff');

        User::create([
            'name' => $validated['name'],
            'email' => strtolower($validated['email']),
            'password' => Hash::make($password),
            'nip' => !empty($validated['nip']) ? $validated['nip'] : null,
            'no_telepon' => !empty($validated['no_telepon']) ? $validated['no_telepon'] : null,
            'bidang_keahlian' => $bidang,
            'user_type' => $userType,
            'role' => $role,
            'roles_assignment' => $roles,
            'active_role' => $role,
            'status_akun' => 'aktif',
            'must_change_password' => true,
        ]);

        $label = $userType === 'dosen' ? 'Dosen' : 'Staff';
        return back()->with('success', "Akun {$label} {$validated['name']} berhasil dibuat!");
    }

    /**
     * Perbarui data & penugasan Pegawai (Dosen atau Staff).
     */
    public function updatePegawai(Request $request, $id): RedirectResponse
    {
        $pegawai = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($pegawai->id)],
            'user_type' => ['required', Rule::in(['dosen', 'staff'])],
            'password' => ['nullable', 'string', 'min:6'],
            'nip' => ['nullable', 'string', 'max:50'],
            'no_telepon' => ['nullable', 'string', 'max:25'],
            'bidang_keahlian' => ['nullable'],
            'roles' => ['required', 'array', 'min:1'],
            'is_superadmin' => ['nullable', 'boolean'],
        ]);

        $roles = $validated['roles'] ?? [];

        // Pengaturan hak superadmin hanya boleh diubah oleh Root Administrator
        if ($request->user()->is_root) {
            if (!empty($validated['is_superadmin'])) {
                $roles[] = 'superadmin';
            } else {
                $roles = array_diff($roles, ['superadmin']);
            }
        } else {
            if ($pegawai->isSuperAdmin() && !in_array('superadmin', $roles)) {
                $roles[] = 'superadmin';
            }
        }
        $roles = array_values(array_unique($roles));

        $bidang = $validated['bidang_keahlian'] ?? [];
        if (is_string($bidang)) {
            $bidang = array_filter(array_map('trim', explode(',', $bidang)));
        }

        $userType = $validated['user_type'];
        $pegawai->name = $validated['name'];
        $pegawai->email = strtolower($validated['email']);
        $pegawai->nip = !empty($validated['nip']) ? $validated['nip'] : null;
        $pegawai->no_telepon = !empty($validated['no_telepon']) ? $validated['no_telepon'] : null;
        $pegawai->bidang_keahlian = $bidang;
        $pegawai->user_type = $userType;
        $pegawai->roles_assignment = $roles;
        $pegawai->role = $userType === 'dosen'
            ? (in_array('koor_prodi', $roles) ? 'prodi' : 'dosen')
            : (in_array('tu', $roles) ? 'tu' : 'staff');

        if (!empty($validated['password'])) {
            $pegawai->password = Hash::make($validated['password']);
            $pegawai->must_change_password = true;
        }

        $pegawai->save();

        return back()->with('success', "Data dan penugasan {$pegawai->name} berhasil diperbarui!");
    }

    /**
     * Simpan / Tambah Akun Dosen Baru secara manual.
     */
    public function storeDosen(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['nullable', 'string', 'min:6'],
            'nip' => ['nullable', 'string', 'max:50'],
            'bidang_keahlian' => ['nullable'],
            'roles' => ['nullable', 'array'],
            'is_superadmin' => ['nullable', 'boolean'],
        ]);

        $roles = $validated['roles'] ?? ['dosen_pembimbing'];
        if ($request->user()->is_root && !empty($validated['is_superadmin'])) {
            $roles[] = 'superadmin';
        }
        $roles = array_values(array_unique($roles));

        $bidang = $validated['bidang_keahlian'] ?? [];
        if (is_string($bidang)) {
            $bidang = array_filter(array_map('trim', explode(',', $bidang)));
        }

        $password = !empty($validated['password']) ? $validated['password'] : 'password';

        User::create([
            'name' => $validated['name'],
            'email' => strtolower($validated['email']),
            'password' => Hash::make($password),
            'nip' => $validated['nip'] ?? null,
            'bidang_keahlian' => $bidang,
            'user_type' => 'dosen',
            'role' => in_array('koor_prodi', $roles) ? 'prodi' : 'dosen',
            'roles_assignment' => $roles,
            'active_role' => in_array('koor_prodi', $roles) ? 'prodi' : 'dosen',
            'status_akun' => 'aktif',
            'must_change_password' => true,
        ]);

        return back()->with('success', "Akun dosen {$validated['name']} berhasil dibuat!");
    }

    /**
     * Perbarui data & tugas Dosen.
     */
    public function updateDosen(Request $request, $id): RedirectResponse
    {
        $dosen = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($dosen->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'nip' => ['nullable', 'string', 'max:50'],
            'bidang_keahlian' => ['nullable'],
            'roles' => ['nullable', 'array'],
            'is_superadmin' => ['nullable', 'boolean'],
        ]);

        $roles = $validated['roles'] ?? ['dosen_pembimbing'];

        // Pengaturan hak superadmin hanya boleh diubah oleh Root Administrator
        if ($request->user()->is_root) {
            if (!empty($validated['is_superadmin'])) {
                $roles[] = 'superadmin';
            } else {
                $roles = array_diff($roles, ['superadmin']);
            }
        } else {
            // Pertahankan status superadmin yang sudah ada jika bukan root yang mengedit
            if ($dosen->isSuperAdmin() && !in_array('superadmin', $roles)) {
                $roles[] = 'superadmin';
            }
        }
        $roles = array_values(array_unique($roles));

        $bidang = $validated['bidang_keahlian'] ?? [];
        if (is_string($bidang)) {
            $bidang = array_filter(array_map('trim', explode(',', $bidang)));
        }

        $dosen->name = $validated['name'];
        $dosen->email = strtolower($validated['email']);
        $dosen->nip = $validated['nip'] ?? null;
        $dosen->bidang_keahlian = $bidang;
        $dosen->roles_assignment = $roles;
        $dosen->role = in_array('koor_prodi', $roles) ? 'prodi' : 'dosen';

        if (!empty($validated['password'])) {
            $dosen->password = Hash::make($validated['password']);
            $dosen->must_change_password = true;
        }

        $dosen->save();

        return back()->with('success', "Data dan penugasan Dosen {$dosen->name} berhasil diperbarui!");
    }

    /**
     * Simpan / Tambah Akun Staff Baru secara manual.
     */
    public function storeStaff(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['nullable', 'string', 'min:6'],
            'nip' => ['nullable', 'string', 'max:50'],
            'no_telepon' => ['nullable', 'string', 'max:25'],
            'roles' => ['nullable', 'array'],
            'is_superadmin' => ['nullable', 'boolean'],
        ]);

        $roles = $validated['roles'] ?? ['tu'];
        if ($request->user()->is_root && !empty($validated['is_superadmin'])) {
            $roles[] = 'superadmin';
        }
        $roles = array_values(array_unique($roles));

        $password = !empty($validated['password']) ? $validated['password'] : 'password';

        User::create([
            'name' => $validated['name'],
            'email' => strtolower($validated['email']),
            'password' => Hash::make($password),
            'nip' => $validated['nip'] ?? null,
            'no_telepon' => $validated['no_telepon'] ?? null,
            'user_type' => 'staff',
            'role' => 'tu',
            'roles_assignment' => $roles,
            'active_role' => 'tu',
            'status_akun' => 'aktif',
            'must_change_password' => true,
        ]);

        return back()->with('success', "Akun Staff {$validated['name']} berhasil dibuat!");
    }

    /**
     * Perbarui data & tugas Staff.
     */
    public function updateStaff(Request $request, $id): RedirectResponse
    {
        $staff = User::findOrFail($id);

        // Jangan izinkan mengubah akun root jika bukan root itu sendiri
        if ($staff->is_root && !$request->user()->is_root) {
            return back()->withErrors(['error' => 'Anda tidak memiliki wewenang untuk mengubah Akun Root Utama.']);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($staff->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'nip' => ['nullable', 'string', 'max:50'],
            'no_telepon' => ['nullable', 'string', 'max:25'],
            'roles' => ['nullable', 'array'],
            'is_superadmin' => ['nullable', 'boolean'],
        ]);

        $roles = $validated['roles'] ?? ['tu'];

        if ($request->user()->is_root) {
            if (!empty($validated['is_superadmin']) || $staff->is_root) {
                $roles[] = 'superadmin';
            } else {
                $roles = array_diff($roles, ['superadmin']);
            }
        } else {
            if ($staff->isSuperAdmin() && !in_array('superadmin', $roles)) {
                $roles[] = 'superadmin';
            }
        }
        $roles = array_values(array_unique($roles));

        $staff->name = $validated['name'];
        $staff->email = strtolower($validated['email']);
        $staff->nip = $validated['nip'] ?? null;
        $staff->no_telepon = $validated['no_telepon'] ?? null;
        $staff->roles_assignment = $roles;

        if (!empty($validated['password'])) {
            $staff->password = Hash::make($validated['password']);
            $staff->must_change_password = true;
        }

        $staff->save();

        return back()->with('success', "Data Staff {$staff->name} berhasil diperbarui!");
    }

    /**
     * Hapus Akun Dosen / Staff (Protected Root).
     */
    public function destroyUser(Request $request, $id): RedirectResponse
    {
        $targetUser = User::findOrFail($id);

        if ($targetUser->is_root) {
            return back()->withErrors(['error' => 'Akun Root Utama dilindungi sistem dan tidak dapat dihapus!']);
        }

        if ($targetUser->id === $request->user()->id) {
            return back()->withErrors(['error' => 'Anda tidak dapat menghapus akun Anda sendiri saat sedang login!']);
        }

        $targetUser->delete();

        return back()->with('success', "Akun {$targetUser->name} berhasil dihapus.");
    }

    /**
     * Penetapan Jabatan Dekan (Single Dekan Switcher).
     */
    public function setDekan(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'dosen_id' => ['required', 'exists:users,id'],
        ]);

        $dosen = User::findOrFail($validated['dosen_id']);

        DB::transaction(function () use ($dosen) {
            $dosen->assignAsDekan();
        });

        return back()->with('success', "Jabatan Dekan berhasil ditetapkan kepada {$dosen->name}!");
    }

    /**
     * Import Data Pegawai (Dosen & Staff) dari satu file Excel / CSV.
     * Kolom: Nama Lengkap, Email, Jenis Akun (dosen / staff), NIP (opsional), Password (opsional).
     */
    public function importUsers(Request $request): RedirectResponse
    {
        $request->validate([
            'file_excel' => ['required', 'file', 'mimes:xlsx,csv,xls', 'max:5120'],
        ], [
            'file_excel.required' => 'Pilih file Excel yang akan diunggah.',
            'file_excel.mimes' => 'Format file harus berupa .xlsx, .xls, atau .csv.',
        ]);

        $file = $request->file('file_excel');

        try {
            $reader = new XLSXReader();
            $reader->open($file->getRealPath());

            $imported = 0;
            $updated = 0;
            $isHeader = true;

            foreach ($reader->getSheetIterator() as $sheet) {
                foreach ($sheet->getRowIterator() as $row) {
                    $cells = $row->toArray();
                    if ($isHeader) {
                        $isHeader = false;
                        continue;
                    }

                    // Struktur Kolom Sederhana:
                    // Kolom 0: Nama Lengkap
                    // Kolom 1: Email
                    // Kolom 2: Jenis Akun (dosen atau staff, default: dosen)
                    // Kolom 3: NIP (opsional)
                    // Kolom 4: Password Sementara (opsional, default: 'password')
                    $nama = trim((string) ($cells[0] ?? ''));
                    $email = strtolower(trim((string) ($cells[1] ?? '')));
                    $typeInput = strtolower(trim((string) ($cells[2] ?? 'dosen')));
                    $nip = trim((string) ($cells[3] ?? ''));
                    $tempPass = trim((string) ($cells[4] ?? ''));

                    if (empty($nama) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        continue;
                    }

                    $userType = in_array($typeInput, ['staff', 'tu', 'staf', 'kependidikan']) ? 'staff' : 'dosen';
                    $passwordToUse = !empty($tempPass) ? $tempPass : 'password';

                    $user = User::where('email', $email)->first();

                    if ($user) {
                        $user->name = $nama;
                        if (!empty($nip)) {
                            $user->nip = $nip;
                        }
                        $user->user_type = $userType;
                        $user->password = Hash::make($passwordToUse);
                        $user->must_change_password = true;
                        $user->status_akun = 'aktif';
                        $user->save();
                        $updated++;
                    } else {
                        $defaultRoles = $userType === 'dosen' ? ['dosen_pembimbing'] : ['tu'];
                        $role = $userType === 'dosen' ? 'dosen' : 'tu';

                        User::create([
                            'name' => $nama,
                            'email' => $email,
                            'nip' => !empty($nip) ? $nip : null,
                            'password' => Hash::make($passwordToUse),
                            'user_type' => $userType,
                            'role' => $role,
                            'roles_assignment' => $defaultRoles,
                            'active_role' => $role,
                            'status_akun' => 'aktif',
                            'must_change_password' => true,
                        ]);
                        $imported++;
                    }
                }
            }

            $reader->close();

            return back()->with('success', "Import data Pegawai (Dosen & Staff) berhasil! ({$imported} baru, {$updated} diperbarui). Password sementara diset dan wajib diubah saat login pertama.");
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Gagal membaca file Excel/CSV: ' . $e->getMessage()]);
        }
    }

    /**
     * Download Template Excel Pegawai Tunggal (Dosen & Staff).
     */
    public function downloadTemplate(Request $request): BinaryFileResponse
    {
        $fileName = "Template_Import_Pegawai_SIKP.xlsx";
        $tempPath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . $fileName;

        $writer = new XLSXWriter();
        $writer->openToFile($tempPath);

        // Header baris 1
        $writer->addRow(Row::fromValues([
            'Nama Lengkap',
            'Email',
            'Jenis Akun (dosen / staff)',
            'NIP (Opsional)',
            'Password Sementara (Opsional, Default: password)',
        ]));

        // Baris contoh 1: Dosen
        $writer->addRow(Row::fromValues([
            'Dr. Ahmad Fauzi, M.T.',
            'ahmad.fauzi@trunojoyo.ac.id',
            'dosen',
            '198001012005011001',
            'password',
        ]));

        // Baris contoh 2: Staff
        $writer->addRow(Row::fromValues([
            'Budi Santoso, S.Kom.',
            'budi.santoso@trunojoyo.ac.id',
            'staff',
            '198505052010011002',
            'password',
        ]));

        $writer->close();

        return response()->download($tempPath, $fileName)->deleteFileAfterSend(true);
    }

    /**
     * Penetapan Role & Tugas Fungsional untuk Akun Baru SSO (yang sebelumnya role kosong).
     */
    public function assignRole(Request $request, $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'user_type' => ['required', Rule::in(['dosen', 'staff'])],
            'nip' => ['nullable', 'string', 'max:50'],
            'no_telepon' => ['nullable', 'string', 'max:25'],
            'bidang_keahlian' => ['nullable'],
            'roles' => ['required', 'array', 'min:1'],
            'is_superadmin' => ['nullable', 'boolean'],
        ], [
            'user_type.required' => 'Pilih jenis akun (Dosen atau Staff).',
            'roles.required' => 'Pilih minimal satu penugasan peran.',
            'roles.min' => 'Pilih minimal satu penugasan peran.',
        ]);

        $roles = $validated['roles'] ?? [];
        if ($request->user()->is_root && !empty($validated['is_superadmin'])) {
            $roles[] = 'superadmin';
        }
        $roles = array_values(array_unique($roles));

        $userType = $validated['user_type'];
        $user->user_type = $userType;

        if ($userType === 'dosen') {
            $user->nip = $validated['nip'] ?? $user->nip;
            $bidang = $validated['bidang_keahlian'] ?? [];
            if (is_string($bidang)) {
                $bidang = array_filter(array_map('trim', explode(',', $bidang)));
            }
            $user->bidang_keahlian = $bidang;
            $user->role = in_array('koor_prodi', $roles) ? 'prodi' : 'dosen';
            $user->active_role = in_array('koor_prodi', $roles) ? 'prodi' : 'dosen';
        } else {
            $user->nip = $validated['nip'] ?? $user->nip;
            $user->no_telepon = $validated['no_telepon'] ?? $user->no_telepon;
            $user->role = in_array('tu', $roles) ? 'tu' : 'staff';
            $user->active_role = in_array('tu', $roles) ? 'tu' : 'staff';
        }

        $user->roles_assignment = $roles;
        $user->status_akun = 'aktif';
        // User diarahkan mengganti password saat login pertama
        $user->must_change_password = true;
        $user->save();

        return back()->with('success', "Akun {$user->name} berhasil ditetapkan sebagai " . ucfirst($userType) . " beserta tugas fungsinya!");
    }

    /**
     * Fitur Impersonate / Login As (Troubleshooting).
     */
    public function impersonate(Request $request, $id): RedirectResponse
    {
        $currentUser = $request->user();
        $targetUser = User::findOrFail($id);

        if ($targetUser->id === $currentUser->id) {
            return back()->withErrors(['error' => 'Anda tidak bisa impersonate akun Anda sendiri!']);
        }

        // Simpan ID Super Admin di session sebelum switch login
        $request->session()->put('impersonator_id', $currentUser->id);

        Auth::login($targetUser);

        return redirect($targetUser->dashboardRoute())->with('success', "Mode Troubleshooting Aktif: Anda login sebagai {$targetUser->name}.");
    }

    /**
     * Keluar dari mode impersonate dan kembali ke Super Admin.
     */
    public function leaveImpersonate(Request $request): RedirectResponse
    {
        $impersonatorId = $request->session()->get('impersonator_id');

        if (!$impersonatorId) {
            return redirect()->route('dashboard');
        }

        $superAdmin = User::findOrFail($impersonatorId);

        $request->session()->forget('impersonator_id');
        Auth::login($superAdmin);

        return redirect()->route('admin.dashboard')->with('success', 'Kembali ke Panel Super Administrator.');
    }
}
