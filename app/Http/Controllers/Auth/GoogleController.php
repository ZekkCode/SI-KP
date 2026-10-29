<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\MasterMahasiswa;
use App\Models\PermohonanAkun;
use App\Models\ProgramStudi;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     * Restricts account selection prompt to student domain if supported by browser/client.
     */
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')
            ->with([
                'prompt' => 'select_account',
                'hd' => 'student.trunojoyo.ac.id',
            ])
            ->redirect();
    }

    /**
     * Obtain the user information from Google and log them directly into the system.
     */
    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            $email = strtolower(trim($googleUser->getEmail() ?? ''));
            $googleName = trim($googleUser->getName() ?? '');

            // 1. Cari apakah user sudah ada di database (berdasarkan google_id atau email)
            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $email)
                ->first();

            // 2. Jika user belum ada di tabel users, otomatis daftarkan jika menggunakan email kampus
            if (! $user) {
                // Skenario A: Mahasiswa Kampus (@student.trunojoyo.ac.id)
                if (str_ends_with($email, '@student.trunojoyo.ac.id')) {
                    // Ekstrak NIM dari email (contoh: 240411100001@student.trunojoyo.ac.id -> 240411100001)
                    preg_match('/^([a-zA-Z0-9]+)@/', $email, $matches);
                    $nim = $matches[1] ?? '';

                    // Bersihkan nama jika ada awalan format kampus (misal '24-001 Nama Mahasiswa' -> 'Nama Mahasiswa')
                    $cleanedName = preg_replace('/^\d+-\d+\s+/', '', $googleName);
                    $name = $cleanedName ?: ($googleName ?: "Mahasiswa {$nim}");

                    // Cek di master_mahasiswas jika sudah terdata
                    $master = MasterMahasiswa::where('email', $email)
                        ->orWhere('nim', $nim)
                        ->first();

                    $progStudiNama = $master?->program_studi ?? 'Teknik Informatika';
                    $angkatan = $master?->angkatan;
                    if (! $angkatan && strlen($nim) >= 2) {
                        $prefix = substr($nim, 0, 2);
                        $angkatan = is_numeric($prefix) ? (2000 + (int)$prefix) : (int)date('Y');
                    }

                    // Tentukan Program Studi
                    $prodi = ProgramStudi::where('nama', 'like', "%{$progStudiNama}%")->first()
                        ?? ProgramStudi::first();

                    // Cari dosen wali jika ada
                    $dosenWali = null;
                    if ($master && $master->nip_dosen_wali) {
                        $dosenWali = User::where('nip', $master->nip_dosen_wali)->where('role', 'dosen')->first();
                    }

                    // Simpan / sinkronkan ke master_mahasiswas
                    if (! $master && $nim) {
                        MasterMahasiswa::create([
                            'nim' => $nim,
                            'nama' => $name,
                            'email' => $email,
                            'program_studi' => $prodi?->nama ?? 'Teknik Informatika',
                            'angkatan' => (string)($angkatan ?? date('Y')),
                            'sumber_data' => 'google_oauth',
                        ]);
                    }

                    // Buat akun user mahasiswa langsung aktif
                    $user = User::create([
                        'name' => $master?->nama ?? $name,
                        'email' => $email,
                        'avatar' => $googleUser->getAvatar(),
                        'google_id' => $googleUser->getId(),
                        'google_token' => $googleUser->token,
                        'password' => Hash::make(Str::random(32)),
                        'role' => 'mahasiswa',
                        'status_akun' => 'aktif',
                        'nim' => $nim,
                        'angkatan' => (int)($angkatan ?? date('Y')),
                        'program_studi_id' => $prodi?->id,
                        'dosen_wali_id' => $dosenWali?->id,
                        'must_change_password' => false,
                        'has_set_password' => false,
                    ]);

                    // Jika ada permohonan akun pending, tandai disetujui
                    PermohonanAkun::where('email', $email)->update([
                        'status' => 'disetujui',
                        'diverifikasi_pada' => now(),
                    ]);
                }
                // Skenario B: Pegawai/Dosen/Staff Kampus (@trunojoyo.ac.id)
                elseif (str_ends_with($email, '@trunojoyo.ac.id')) {
                    // Buat akun baru resmi kampus tapi role & tugas kosong.
                    // Akun ini aktif secara otoritas kampus (tidak butuh persetujuan permohonan),
                    // namun belum bisa login sebelum di-assign peran & tugas oleh Administrator.
                    User::create([
                        'name' => $googleName ?: 'Pegawai UTM',
                        'email' => $email,
                        'avatar' => $googleUser->getAvatar(),
                        'google_id' => $googleUser->getId(),
                        'google_token' => $googleUser->token,
                        'password' => Hash::make(Str::random(32)),
                        'user_type' => null,
                        'role' => null,
                        'roles_assignment' => [],
                        'active_role' => null,
                        'status_akun' => 'aktif',
                        'must_change_password' => true,
                        'has_set_password' => false,
                    ]);

                    return redirect()->route('login')->withErrors([
                        'email' => "Akun Google resmi kampus Anda ({$email}) berhasil didaftarkan. Namun akun Anda belum memiliki penugasan peran (Dosen / Staff) dan tugas dari Administrator. Silakan hubungi Administrator untuk penetapan peran dan tugas Anda sebelum dapat masuk ke sistem.",
                    ]);
                }
                // Skenario C: Email Luar / Non-Kampus yang belum didaftarkan oleh admin
                else {
                    return redirect()->route('login')->withErrors([
                        'email' => "Autentikasi Google hanya diperbolehkan menggunakan akun resmi kampus (@student.trunojoyo.ac.id atau @trunojoyo.ac.id). Email {$email} tidak diizinkan.",
                    ]);
                }
            }

            // 3. Jika user sudah ada di database, periksa apakah akun sudah memiliki penugasan role/tugas
            if (! $user->hasAssignedRole()) {
                // Hubungkan info Google agar profil terupdate
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'google_token' => $googleUser->token,
                    'avatar' => $googleUser->getAvatar() ?? $user->avatar,
                ]);

                return redirect()->route('login')->withErrors([
                    'email' => "Akun Anda ({$email}) belum memiliki penugasan peran (Dosen / Staff) dan tugas dari Administrator. Silakan hubungi Administrator untuk penetapan peran dan tugas Anda sebelum dapat masuk ke sistem.",
                ]);
            }

            // 4. Pastikan google_id, avatar, dan token terhubung
            $updateData = [
                'google_id' => $googleUser->getId(),
                'google_token' => $googleUser->token,
                'status_akun' => 'aktif',
            ];
            if ($googleUser->getAvatar()) {
                $updateData['avatar'] = $googleUser->getAvatar();
            }
            $user->update($updateData);

            // 5. Buat sesi login langsung (Direct Login)
            Auth::login($user, true);
            request()->session()->regenerate();

            // 6. Jika akun bukan mahasiswa dan wajib ganti password (atau belum mengatur kata sandi pribadi),
            // arahkan langsung ke halaman ganti kata sandi pertama kali.
            if ($user->role !== 'mahasiswa' && ($user->must_change_password || ! $user->has_set_password)) {
                if (! $user->must_change_password) {
                    $user->update(['must_change_password' => true]);
                }
                return redirect()->route('password.force_change')
                    ->with('info', 'Selamat datang! Silakan buat kata sandi akun Anda terlebih dahulu sebelum melanjutkan ke dashboard.');
            }

            // 7. Arahkan langsung ke dashboard sesuai role
            return redirect()->intended($user->dashboardRoute());

        } catch (Exception $e) {
            logger()->error('Google Login Error: ' . $e->getMessage(), ['exception' => $e]);
            return redirect()->route('login')->withErrors([
                'email' => 'Terjadi kendala saat masuk dengan Google. Silakan coba kembali atau gunakan login kredensial.',
            ]);
        }
    }
}
