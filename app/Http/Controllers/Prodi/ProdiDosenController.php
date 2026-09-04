<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Mail\AkunDosenAnnouncementMail;
use App\Models\User;
use App\Models\KuotaDosen;
use App\Models\Pendaftaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Reader\XLSX\Reader as XLSXReader;
use OpenSpout\Writer\XLSX\Writer as XLSXWriter;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ProdiDosenController extends Controller
{
    /**
     * Menampilkan daftar dosen dan kuotanya.
     */
    public function index()
    {
        $dosens = User::where('role', 'dosen')
            ->orderBy('name')
            ->get()
            ->map(function ($dosen) {
                $kuotaModel = KuotaDosen::where('dosen_id', $dosen->id)->first();
                $kuotaMax = $kuotaModel ? $kuotaModel->kuota_max : 10;

                // Hitung mahasiswa aktif
                $bimbinganAktif = Pendaftaran::where('dosen_pembimbing_id', $dosen->id)
                    ->whereIn('status', ['aktif', 'diterima_instansi', 'verifikasi_surat_balasan', 'plotting_dosen'])
                    ->count();
                    
                return [
                    'id' => $dosen->id,
                    'avatar_id' => substr($dosen->name, 0, 2),
                    'name' => $dosen->name,
                    'nip' => $dosen->nip ?? 'NIP Belum Diatur',
                    'email' => $dosen->email,
                    'quota' => $bimbinganAktif . ' / ' . $kuotaMax,
                    'status' => 'Aktif',
                    'statusStyle' => 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]',
                    'indicatorColor' => $bimbinganAktif >= $kuotaMax ? 'bg-error' : 'bg-primary'
                ];
            });

        return Inertia::render('Prodi/Dosen/Index', [
            'lecturers' => $dosens
        ]);
    }

    /**
     * Download sample Excel (.xlsx) template for dosen import.
     */
    public function downloadTemplate(): BinaryFileResponse
    {
        $tempPath = tempnam(sys_get_temp_dir(), 'template_dosen_') . '.xlsx';

        $writer = new XLSXWriter();
        $writer->openToFile($tempPath);

        // Header (4 Kolom: ID, NIP, Nama, Email)
        $writer->addRow(Row::fromValues(['id', 'nip', 'nama', 'email']));

        // Sample Data Rows
        $writer->addRow(Row::fromValues([
            1,
            '198501012010121001',
            'Dr. Aris Sudarmaji, S.T., M.Kom.',
            'aris.sudarmaji@utm.ac.id',
        ]));
        $writer->addRow(Row::fromValues([
            2,
            '198904122019032014',
            'Rina Fitriana, S.Kom., M.Cs.',
            'rina.fitriana@utm.ac.id',
        ]));

        $writer->close();

        return response()->download($tempPath, 'template_import_dosen.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Import master dosen from Excel (.xlsx / .xls) and dispatch announcement email.
     */
    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls'],
        ], [
            'file.required' => 'File Excel (.xlsx / .xls) wajib diunggah.',
            'file.mimes' => 'Format file harus berupa file Excel (.xlsx atau .xls).',
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();

        $rows = [];

        try {
            $reader = new XLSXReader();
            $reader->open($path);

            $rowNum = 0;
            $colMap = ['id' => 0, 'nip' => 1, 'nama' => 2, 'email' => 3];

            foreach ($reader->getSheetIterator() as $sheet) {
                foreach ($sheet->getRowIterator() as $row) {
                    $rowNum++;
                    $rawValues = $row->toArray();
                    $rowValues = array_map(function ($val) {
                        if ($val instanceof \DateTimeInterface) {
                            return $val->format('Y-m-d');
                        }
                        return trim((string) $val);
                    }, $rawValues);

                    if (empty(array_filter($rowValues))) {
                        continue;
                    }

                    if ($rowNum === 1) {
                        $isHeader = false;
                        foreach ($rowValues as $idx => $headerText) {
                            $clean = strtolower(trim((string) $headerText));
                            if ($clean === 'id' || $clean === 'no' || $clean === 'nomor') {
                                $colMap['id'] = $idx;
                                $isHeader = true;
                            } elseif ($clean === 'nip') {
                                $colMap['nip'] = $idx;
                                $isHeader = true;
                            } elseif (str_contains($clean, 'nama') || $clean === 'name') {
                                $colMap['nama'] = $idx;
                                $isHeader = true;
                            } elseif (str_contains($clean, 'email') || str_contains($clean, 'surel')) {
                                $colMap['email'] = $idx;
                                $isHeader = true;
                            }
                        }
                        if ($isHeader) {
                            continue;
                        }
                    }

                    $idVal = isset($colMap['id']) ? ($rowValues[$colMap['id']] ?? null) : null;
                    $nip = $rowValues[$colMap['nip']] ?? '';
                    $nama = $rowValues[$colMap['nama']] ?? '';
                    $email = $rowValues[$colMap['email']] ?? '';

                    if (strtolower($nip) === 'nip' || empty($nip) || empty($nama) || empty($email)) {
                        continue;
                    }

                    $rows[] = [
                        'id' => is_numeric($idVal) ? (int)$idVal : null,
                        'nip' => $nip,
                        'nama' => $nama,
                        'email' => $email,
                        'kuota' => 10,
                    ];
                }
            }
            $reader->close();
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal membaca file Excel: ' . $e->getMessage());
        }

        if (empty($rows)) {
            return back()->with('error', 'Tidak ada data dosen yang valid untuk di-import dari file tersebut.');
        }

        $imported = 0;
        $updated = 0;
        $emailsSent = 0;

        foreach ($rows as $item) {
            $tempPassword = Str::random(8);

            // Cek apakah dosen sudah ada berdasarkan ID (jika ada), email, atau nip
            $user = null;
            if (!empty($item['id'])) {
                $user = User::where('id', $item['id'])->where('role', 'dosen')->first();
            }
            if (!$user) {
                $user = User::where('email', $item['email'])
                    ->orWhere('nip', $item['nip'])
                    ->first();
            }

            if ($user) {
                $user->update([
                    'name' => $item['nama'],
                    'email' => $item['email'],
                    'nip' => $item['nip'],
                    'password' => Hash::make($tempPassword),
                    'must_change_password' => true,
                    'status_akun' => 'aktif',
                    'role' => 'dosen',
                ]);
                $updated++;
            } else {
                $userData = [
                    'name' => $item['nama'],
                    'email' => $item['email'],
                    'nip' => $item['nip'],
                    'password' => Hash::make($tempPassword),
                    'role' => 'dosen',
                    'status_akun' => 'aktif',
                    'must_change_password' => true,
                ];

                if (!empty($item['id']) && !User::where('id', $item['id'])->exists()) {
                    $userData['id'] = $item['id'];
                }

                $user = User::create($userData);
                $imported++;
            }

            KuotaDosen::updateOrCreate(
                ['dosen_id' => $user->id],
                [
                    'kuota_max' => $item['kuota'],
                    'periode' => date('Y'),
                ]
            );

            // Kirim email kredensial / announcement
            try {
                Mail::to($item['email'])->send(new AkunDosenAnnouncementMail(
                    nama: $item['nama'],
                    nip: $item['nip'],
                    email: $item['email'],
                    tempPassword: $tempPassword
                ));
                $emailsSent++;
                Log::info("Kredensial Dosen dikirim ke {$item['email']} - NIP: {$item['nip']} | Password: {$tempPassword}");
            } catch (\Throwable $e) {
                Log::error("Gagal mengirim email kredensial dosen ke {$item['email']}: {$e->getMessage()}");
            }
        }

        return back()->with('success', "Proses import berhasil! {$imported} dosen baru ditambahkan, {$updated} diperbarui. {$emailsSent} email kredensial & pengumuman berhasil dikirim ke dosen.");
    }

    /**
     * Kirim ulang kredensial dan pengumuman akun dosen secara individual.
     */
    public function kirimKredensial(User $dosen): RedirectResponse
    {
        if ($dosen->role !== 'dosen') {
            return back()->with('error', 'User bukan merupakan dosen.');
        }

        if (empty($dosen->nip) || empty($dosen->email)) {
            return back()->with('error', 'Data NIP atau email dosen tidak lengkap.');
        }

        $tempPassword = Str::random(8);

        $dosen->update([
            'password' => Hash::make($tempPassword),
            'must_change_password' => true,
            'status_akun' => 'aktif',
        ]);

        try {
            Mail::to($dosen->email)->send(new AkunDosenAnnouncementMail(
                nama: $dosen->name,
                nip: $dosen->nip,
                email: $dosen->email,
                tempPassword: $tempPassword
            ));
            Log::info("Kredensial Dosen dikirim ulang ke {$dosen->email} - NIP: {$dosen->nip} | Password: {$tempPassword}");
            return back()->with('success', "Email kredensial & pengumuman berhasil dikirimkan ke {$dosen->email}! Password sementara: {$tempPassword}");
        } catch (\Throwable $e) {
            Log::error("Gagal mengirim email kredensial ke {$dosen->email}: {$e->getMessage()}");
            return back()->with('error', "Gagal mengirim email ke {$dosen->email}: {$e->getMessage()}");
        }
    }

    /**
     * Menampilkan form tambah dosen.
     */
    public function create()
    {
        return Inertia::render('Prodi/Dosen/Create');
    }

    /**
     * Menyimpan data dosen baru secara manual.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'nip' => 'nullable|string|max:50',
            'kuota' => 'required|integer|min:1|max:50',
        ]);

        try {
            DB::beginTransaction();

            $tempPassword = Str::random(8);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($tempPassword),
                'role' => 'dosen',
                'nip' => $request->nip,
                'status_akun' => 'aktif',
                'must_change_password' => true,
            ]);

            KuotaDosen::create([
                'dosen_id' => $user->id,
                'kuota_max' => $request->kuota,
                'periode' => date('Y'),
            ]);

            DB::commit();

            // Kirim email pengumuman & kredensial
            try {
                Mail::to($user->email)->send(new AkunDosenAnnouncementMail(
                    nama: $user->name,
                    nip: $user->nip ?? '-',
                    email: $user->email,
                    tempPassword: $tempPassword
                ));
            } catch (\Throwable $e) {
                Log::error("Gagal mengirim email kredensial dosen baru: {$e->getMessage()}");
            }

            return redirect()->route('prodi.dosen.index')->with('success', "Dosen berhasil ditambahkan! Kredensial sementara ({$tempPassword}) telah dikirimkan ke {$user->email}.");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Terjadi kesalahan saat menambahkan dosen: ' . $e->getMessage());
        }
    }

    /**
     * Menampilkan form edit dosen.
     */
    public function edit($id)
    {
        $dosen = User::where('role', 'dosen')->findOrFail($id);
        $kuotaModel = KuotaDosen::where('dosen_id', $dosen->id)->first();

        return Inertia::render('Prodi/Dosen/Edit', [
            'dosen' => [
                'id' => $dosen->id,
                'name' => $dosen->name,
                'email' => $dosen->email,
                'nip' => $dosen->nip,
                'kuota' => $kuotaModel ? $kuotaModel->kuota_max : 10,
            ]
        ]);
    }

    /**
     * Memperbarui data dosen.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $user = User::where('role', 'dosen')->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'nip' => 'nullable|string|max:50',
            'kuota' => 'required|integer|min:1|max:50',
        ]);

        try {
            DB::beginTransaction();

            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'nip' => $request->nip,
            ]);

            KuotaDosen::updateOrCreate(
                ['dosen_id' => $user->id],
                [
                    'kuota_max' => $request->kuota,
                    'periode' => date('Y'), 
                ]
            );

            DB::commit();
            return redirect()->route('prodi.dosen.index')->with('success', 'Data dosen berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Terjadi kesalahan saat memperbarui data dosen: ' . $e->getMessage());
        }
    }

    /**
     * Menghapus data dosen.
     */
    public function destroy($id): RedirectResponse
    {
        $user = User::where('role', 'dosen')->findOrFail($id);

        try {
            DB::beginTransaction();

            $activePendaftaran = Pendaftaran::where('dosen_pembimbing_id', $user->id)
                ->whereNotIn('status', ['selesai', 'batal'])
                ->exists();
                
            if ($activePendaftaran) {
                return back()->with('error', 'Tidak dapat menghapus dosen karena masih memiliki mahasiswa bimbingan aktif.');
            }

            KuotaDosen::where('dosen_id', $user->id)->delete();
            $user->delete();

            DB::commit();
            return redirect()->route('prodi.dosen.index')->with('success', 'Data dosen berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Terjadi kesalahan saat menghapus data dosen: ' . $e->getMessage());
        }
    }
}
