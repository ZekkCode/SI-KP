<?php

namespace Database\Seeders;

use App\Models\Instansi;
use App\Models\Logbook;
use App\Models\MasterMahasiswa;
use App\Models\PembimbingLapangan;
use App\Models\Pendaftaran;
use App\Models\PeriodeKp;
use App\Models\ProgramStudi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use OpenSpout\Reader\XLSX\Reader;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Setup Program Studi (Khusus Teknik Informatika)
        $prodi = ProgramStudi::firstOrCreate(
            ['nama' => 'Teknik Informatika'],
            [
                'kode' => 'TI',
                'fakultas' => 'Fakultas Teknik',
            ]
        );

        $prodiId = $prodi->id;

        // 2. Setup Periode KP
        $periode = PeriodeKp::firstOrCreate(
            ['semester' => 'Gasal 2026/2027'],
            [
                'tanggal_pendaftaran' => '2026-07-26',
                'tanggal_batas_pendaftaran' => '2026-12-01',
                'tanggal_batas_pengajuan_surat' => '2026-12-01',
            ]
        );

        // 3. Setup Core System Users dari Environment (.env)
        $initialPassword = env('INITIAL_DEMO_PASSWORD', 'password');
        $password = Hash::make($initialPassword);

        // Admin TU
        $tuEmail = env('ADMIN_TU_EMAIL', 'tu@admin.com');
        $tuNip = (string) env('ADMIN_TU_NIP', '198501012010');
        $tuName = env('ADMIN_TU_NAME', 'Admin TU');
        $tuUser = User::updateOrCreate(
            ['email' => $tuEmail],
            [
                'name' => $tuName,
                'password' => $password,
                'role' => 'tu',
                'status_akun' => 'aktif',
                'nip' => $tuNip,
            ]
        );

        // Koordinator Prodi
        $prodiEmail = env('KOORDINATOR_PRODI_EMAIL', 'prodi@admin.com');
        $prodiNip = (string) env('KOORDINATOR_PRODI_NIP', '197001012000');
        $prodiName = env('KOORDINATOR_PRODI_NAME', 'Koordinator Prodi');
        $prodiUser = User::updateOrCreate(
            ['email' => $prodiEmail],
            [
                'name' => $prodiName,
                'password' => $password,
                'role' => 'prodi',
                'status_akun' => 'aktif',
                'nip' => $prodiNip,
                'program_studi_id' => $prodiId,
            ]
        );

        // Dosen Pembimbing Bawaan / Demo
        $dosenRikaEmail = env('DEMO_DOSEN_EMAIL', 'rika@dosen.com');
        $dosenRikaNip = (string) env('DEMO_DOSEN_NIP', '198002022001');
        $dosenRikaName = env('DEMO_DOSEN_NAME', 'Rika Yunitarini, S.T., M.T.');
        $dosenRika = User::updateOrCreate(
            ['email' => $dosenRikaEmail],
            [
                'name' => $dosenRikaName,
                'password' => $password,
                'role' => 'dosen',
                'status_akun' => 'aktif',
                'nip' => $dosenRikaNip,
                'program_studi_id' => $prodiId,
            ]
        );

        $dosenFifin = User::updateOrCreate(
            ['email' => 'fifin@dosen.com'],
            [
                'name' => 'Fifin, S.Kom., M.Cs.',
                'password' => $password,
                'role' => 'dosen',
                'status_akun' => 'aktif',
                'nip' => '198203032002',
                'program_studi_id' => $prodiId,
            ]
        );

        // 4. Mitra / Pembimbing Lapangan (Instansi)
        $mitraEmail = env('DEMO_MITRA_EMAIL', 'mitra@demo.com');
        $mitraName = env('DEMO_MITRA_NAME', 'Bambang Sudarmono, S.T.');
        $mitraCompany = env('DEMO_MITRA_COMPANY', 'PT Petrokimia Gresik');

        $instansi = Instansi::firstOrCreate(
            ['nama' => $mitraCompany],
            [
                'alamat' => 'Jl. Jenderal Ahmad Yani, Gresik',
                'kota' => 'Gresik',
                'no_telepon' => '031-3981811',
                'email' => 'info@petrokimia-gresik.com',
                'website' => 'https://petrokimia-gresik.com',
                'nama_pj' => 'Ir. Hendro Prasetyo',
                'jabatan_pj' => 'Manager IT & Digital Solution',
            ]
        );

        $mitraUser = User::updateOrCreate(
            ['email' => $mitraEmail],
            [
                'name' => $mitraName,
                'password' => $password,
                'role' => 'instansi',
                'status_akun' => 'aktif',
            ]
        );

        $pl = PembimbingLapangan::updateOrCreate(
            ['instansi_id' => $instansi->id, 'nama' => $mitraName],
            ['user_id' => $mitraUser->id]
        );

        $instansi->update(['user_id' => $mitraUser->id]);

        // 5. Import Master Dosen dari master_dosen.xlsx
        $dosenFile = base_path('master_dosen.xlsx');
        if (file_exists($dosenFile)) {
            $reader = new Reader();
            $reader->open($dosenFile);
            $rowIndex = 0;
            foreach ($reader->getSheetIterator() as $sheet) {
                foreach ($sheet->getRowIterator() as $row) {
                    $cells = $row->toArray();
                    $rowIndex++;
                    if ($rowIndex === 1) continue; // Skip header

                    $nip = trim((string)($cells[1] ?? ''));
                    $nama = trim((string)($cells[2] ?? ''));
                    $email = strtolower(trim((string)($cells[3] ?? '')));

                    if ($nip && $nama) {
                        User::updateOrCreate(
                            ['nip' => $nip],
                            [
                                'name' => $nama,
                                'email' => $email ?: "{$nip}@trunojoyo.ac.id",
                                'password' => $password,
                                'role' => 'dosen',
                                'status_akun' => 'aktif',
                                'program_studi_id' => $prodiId,
                            ]
                        );
                    }
                }
            }
            $reader->close();
        }

        // 6. Import Master Mahasiswa dari master_mahasiswa.xlsx
        $mhsFile = base_path('master_mahasiswa.xlsx');
        if (file_exists($mhsFile)) {
            $reader = new Reader();
            $reader->open($mhsFile);
            $rowIndex = 0;
            foreach ($reader->getSheetIterator() as $sheet) {
                foreach ($sheet->getRowIterator() as $row) {
                    $cells = $row->toArray();
                    $rowIndex++;
                    if ($rowIndex === 1) continue; // Skip header

                    $nim = trim((string)($cells[1] ?? ''));
                    $nama = trim((string)($cells[2] ?? ''));
                    $email = strtolower(trim((string)($cells[3] ?? '')));
                    $progStudi = trim((string)($cells[4] ?? 'Teknik Informatika'));
                    $angkatan = trim((string)($cells[5] ?? '2023'));
                    $nipWaliRaw = (string)($cells[6] ?? '');

                    if (is_numeric($nipWaliRaw)) {
                        $nipWali = sprintf('%.0f', (float)$nipWaliRaw);
                    } else {
                        $nipWali = trim($nipWaliRaw);
                    }

                    if ($nim && $nama) {
                        MasterMahasiswa::updateOrCreate(
                            ['nim' => $nim],
                            [
                                'nama' => $nama,
                                'email' => $email ?: "{$nim}@student.trunojoyo.ac.id",
                                'program_studi' => $progStudi,
                                'angkatan' => $angkatan,
                                'nip_dosen_wali' => $nipWali ?: null,
                                'sumber_data' => 'import_excel',
                            ]
                        );

                        $dosenWali = $nipWali ? User::where('nip', $nipWali)->where('role', 'dosen')->first() : null;

                        User::updateOrCreate(
                            ['nim' => $nim],
                            [
                                'name' => $nama,
                                'email' => $email ?: "{$nim}@student.trunojoyo.ac.id",
                                'password' => $password,
                                'role' => 'mahasiswa',
                                'status_akun' => 'aktif',
                                'program_studi_id' => $prodiId,
                                'angkatan' => (int)$angkatan,
                                'dosen_wali_id' => $dosenWali?->id,
                            ]
                        );
                    }
                }
            }
            $reader->close();
        }

        // 7. Akun Mahasiswa Khusus Google Workspace UTM (Dikonfigurasi via .env)
        $googleUserEmail = env('GOOGLE_TEST_USER_EMAIL');
        $googleUserName = env('GOOGLE_TEST_USER_NAME', 'Mahasiswa Google Demo');
        $googleUserNim = (string) env('GOOGLE_TEST_USER_NIM', '');

        if ($googleUserEmail) {
            User::updateOrCreate(
                ['email' => $googleUserEmail],
                [
                    'name' => $googleUserName,
                    'nim' => $googleUserNim ?: null,
                    'password' => $password,
                    'role' => 'mahasiswa',
                    'status_akun' => 'aktif',
                    'program_studi_id' => $prodiId,
                    'angkatan' => 2024,
                ]
            );

            if ($googleUserNim) {
                MasterMahasiswa::updateOrCreate(
                    ['nim' => $googleUserNim],
                    [
                        'nama' => $googleUserName,
                        'email' => $googleUserEmail,
                        'program_studi' => 'Teknik Informatika',
                        'angkatan' => '2024',
                        'sumber_data' => 'google_oauth',
                    ]
                );
            }
        }

        // 8. Demo Pendaftaran KP Aktif & Logbook Realistis untuk Mahasiswa Demo
        $demoMhsNim = (string) env('DEMO_MHS_NIM', '230411100092');
        $mhsDemo = User::where('nim', $demoMhsNim)->first()
            ?? User::where('role', 'mahasiswa')->whereNotNull('nim')->first();

        if ($mhsDemo) {
            $pendaftaranAktif = Pendaftaran::updateOrCreate(
                ['mahasiswa_id' => $mhsDemo->id],
                [
                    'instansi_id' => $instansi->id,
                    'dosen_pembimbing_id' => $dosenRika->id,
                    'pembimbing_lapangan_id' => $pl->id,
                    'bidang_minat' => 'Rekayasa Perangkat Lunak & Sistem Terdistribusi',
                    'tanggal_mulai' => '2026-08-01',
                    'tanggal_selesai' => '2026-10-31',
                    'status' => 'aktif',
                    'diverifikasi_oleh' => $tuUser->id,
                    'diverifikasi_pada' => now()->subDays(30),
                ]
            );

            // Logbooks
            Logbook::updateOrCreate(
                [
                    'pendaftaran_id' => $pendaftaranAktif->id,
                    'tanggal' => '2026-08-03',
                ],
                [
                    'jam_mulai' => '08:00:00',
                    'jam_selesai' => '16:00:00',
                    'deskripsi' => "Orientasi lingkungan kerja praktik di {$mitraCompany} dan pengenalan arsitektur sistem IT internal.",
                    'status_dosen' => 'disetujui',
                    'status_instansi' => 'disetujui',
                    'catatan_dosen' => 'Bagus, lanjutkan adaptasi dengan tim IT instansi.',
                    'catatan_instansi' => 'Mahasiswa hadir tepat waktu dan aktif berdiskusi saat sesi pengenalan sistem.',
                ]
            );

            Logbook::updateOrCreate(
                [
                    'pendaftaran_id' => $pendaftaranAktif->id,
                    'tanggal' => '2026-08-10',
                ],
                [
                    'jam_mulai' => '08:00:00',
                    'jam_selesai' => '16:30:00',
                    'deskripsi' => 'Analisis kebutuhan modul dashboard monitoring distribusi logistik dan perancangan database relasional.',
                    'status_dosen' => 'disetujui',
                    'status_instansi' => 'disetujui',
                    'catatan_dosen' => 'Pastikan skema database mengikuti standar normalisasi yang baik.',
                    'catatan_instansi' => 'Rancangan skema ERD sudah dipresentasikan ke tim database.',
                ]
            );

            Logbook::updateOrCreate(
                [
                    'pendaftaran_id' => $pendaftaranAktif->id,
                    'tanggal' => '2026-08-17',
                ],
                [
                    'jam_mulai' => '08:00:00',
                    'jam_selesai' => '17:00:00',
                    'deskripsi' => 'Implementasi API backend dan integrasi endpoint autentikasi pengguna menggunakan REST API.',
                    'status_dosen' => 'menunggu',
                    'status_instansi' => 'disetujui',
                    'catatan_instansi' => 'Progres pengkodean backend berjalan sesuai target sprint mingguan.',
                ]
            );
        }

        // 9. Demo Pendaftaran untuk Verifikasi TU
        $mhsFirly = User::where('nim', '230411100080')->first();
        if ($mhsFirly) {
            Pendaftaran::updateOrCreate(
                ['mahasiswa_id' => $mhsFirly->id],
                [
                    'instansi_id' => $instansi->id,
                    'bidang_minat' => 'Data Analytics & Business Intelligence',
                    'tanggal_mulai' => '2026-09-01',
                    'tanggal_selesai' => '2026-11-30',
                    'status' => 'verifikasi_tu',
                ]
            );
        }

        $this->command->info('===============================================================');
        $this->command->info('✅ DATABASE INISIALISASI SUKSES - DATA KREDENSIAL DARI ENV!');
        $this->command->info('===============================================================');

        $tableRows = [];
        if ($mhsDemo) {
            $tableRows[] = [
                'Mahasiswa (Aktif KP)',
                "{$mhsDemo->nim} ({$mhsDemo->email})",
                $initialPassword,
                "{$mhsDemo->name} (KP Aktif + Logbook)",
            ];
        }
        if ($googleUserEmail) {
            $tableRows[] = [
                'Mahasiswa (SSO Google)',
                $googleUserEmail,
                $initialPassword,
                $googleUserName,
            ];
        }
        $tableRows[] = [
            'Dosen Pembimbing',
            "{$dosenRikaEmail} / {$dosenRikaNip}",
            $initialPassword,
            $dosenRikaName,
        ];
        $tableRows[] = [
            'Dosen Pembimbing',
            'fifin@dosen.com / 198203032002',
            $initialPassword,
            'Fifin, S.Kom., M.Cs.',
        ];
        $tableRows[] = [
            'Tata Usaha (TU)',
            "{$tuEmail} / {$tuNip}",
            $initialPassword,
            $tuName,
        ];
        $tableRows[] = [
            'Koordinator KP (Prodi)',
            "{$prodiEmail} / {$prodiNip}",
            $initialPassword,
            $prodiName,
        ];
        $tableRows[] = [
            'Mitra (Instansi)',
            $mitraEmail,
            $initialPassword,
            "{$mitraCompany} ({$mitraName})",
        ];

        $this->command->table(
            ['Peran', 'Email / NIM / NIP', 'Password', 'Keterangan'],
            $tableRows
        );
    }
}