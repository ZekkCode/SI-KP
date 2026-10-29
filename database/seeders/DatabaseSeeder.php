<?php

namespace Database\Seeders;

use App\Models\DokumenAkhir;
use App\Models\DokumenPendaftaran;
use App\Models\Instansi;
use App\Models\Logbook;
use App\Models\MasterMahasiswa;
use App\Models\PembimbingLapangan;
use App\Models\Pendaftaran;
use App\Models\PeriodeKp;
use App\Models\ProgramStudi;
use App\Models\Proposal;
use App\Models\SuratPengantar;
use App\Models\Sidang;
use App\Models\Nilai;
use App\Models\NilaiAkhir;
use App\Models\BeritaAcara;
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
        // 0. Pastikan direktori storage public dokumen ada dan terisi file template
        $storageDokumen = storage_path('app/public/dokumen');
        if (!file_exists($storageDokumen)) {
            mkdir($storageDokumen, 0755, true);
        }
        $publicDokumen = public_path('dokumen');
        if (file_exists($publicDokumen)) {
            foreach (glob($publicDokumen . '/*.pdf') as $pdfFile) {
                $dest = $storageDokumen . '/' . basename($pdfFile);
                if (!file_exists($dest)) {
                    copy($pdfFile, $dest);
                }
            }
        }

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
        $getPassword = fn(string $envKey) => Hash::make(env($envKey, $initialPassword));

        // 1. Tata Usaha (TU)
        $tuEmail = env('ADMIN_TU_EMAIL', 'tu@admin.com');
        $tuNip = (string) env('ADMIN_TU_NIP', '198501012010');
        $tuName = env('ADMIN_TU_NAME', 'Admin TU');
        $tuPassword = $getPassword('ADMIN_TU_PASSWORD');
        $tuUser = User::updateOrCreate(
            ['email' => $tuEmail],
            [
                'name' => $tuName,
                'password' => $tuPassword,
                'role' => 'tu',
                'status_akun' => 'aktif',
                'nip' => $tuNip,
            ]
        );

        // 2. Koordinator Program Studi (Prodi)
        $prodiEmail = env('KOORDINATOR_PRODI_EMAIL', 'prodi@admin.com');
        $prodiNip = (string) env('KOORDINATOR_PRODI_NIP', '197001012000');
        $prodiName = env('KOORDINATOR_PRODI_NAME', 'Koordinator KP');
        $prodiPassword = $getPassword('KOORDINATOR_PRODI_PASSWORD');
        $prodiUser = User::updateOrCreate(
            ['email' => $prodiEmail],
            [
                'name' => $prodiName,
                'password' => $prodiPassword,
                'role' => 'prodi',
                'status_akun' => 'aktif',
                'nip' => $prodiNip,
                'program_studi_id' => $prodiId,
            ]
        );

        // 3. Dosen Pembimbing Bawaan / Demo 1
        $dosenRikaEmail = env('DEMO_DOSEN_EMAIL', 'rika@dosen.com');
        $dosenRikaNip = (string) env('DEMO_DOSEN_NIP', '198002022001');
        $dosenRikaName = env('DEMO_DOSEN_NAME', 'Rika Yunitarini, S.T., M.T.');
        $dosenRikaPassword = $getPassword('DEMO_DOSEN_PASSWORD');
        $dosenRika = User::updateOrCreate(
            ['email' => $dosenRikaEmail],
            [
                'name' => $dosenRikaName,
                'password' => $dosenRikaPassword,
                'role' => 'dosen',
                'status_akun' => 'aktif',
                'nip' => $dosenRikaNip,
                'program_studi_id' => $prodiId,
            ]
        );

        // 4. Dosen Pembimbing 2 (Alternatif)
        $dosenFifinEmail = env('DEMO_DOSEN_2_EMAIL', 'fifin@dosen.com');
        $dosenFifinNip = (string) env('DEMO_DOSEN_2_NIP', '198203032002');
        $dosenFifinName = env('DEMO_DOSEN_2_NAME', 'Fifin, S.Kom., M.Cs.');
        $dosenFifinPassword = $getPassword('DEMO_DOSEN_2_PASSWORD');
        $dosenFifin = User::updateOrCreate(
            ['email' => $dosenFifinEmail],
            [
                'name' => $dosenFifinName,
                'password' => $dosenFifinPassword,
                'role' => 'dosen',
                'status_akun' => 'aktif',
                'nip' => $dosenFifinNip,
                'program_studi_id' => $prodiId,
            ]
        );
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

                    $reservedMitraEmails = [
                        'akunduabangkit2@gmail.com',
                        'rendydevanodanendra@gmail.com',
                        'zakariamujur6@gmail.com',
                        'nabiilahrizqiamal@gmail.com',
                    ];
                    if (in_array($email, $reservedMitraEmails)) {
                        $email = "{$nip}@trunojoyo.ac.id";
                    }

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

        // 7. Mitra / Pembimbing Lapangan (4 Instansi Demo Realistis)
        $mitrasConfig = [
            [
                'email' => env('DEMO_MITRA_EMAIL', 'akunduabangkit2@gmail.com'),
                'name' => env('DEMO_MITRA_NAME', 'Ir. Bangkit Danuarta, S.T.'),
                'company' => env('DEMO_MITRA_COMPANY', 'PT Petrokimia Gresik'),
                'password' => $getPassword('DEMO_MITRA_PASSWORD'),
                'alamat' => 'Jl. Jenderal Ahmad Yani, Gresik',
                'kota' => 'Gresik',
                'telepon' => '031-3981811',
                'website' => 'https://petrokimia-gresik.com',
                'nama_pj' => 'Ir. Hendro Prasetyo',
                'jabatan_pj' => 'Manager IT & Digital Solution',
            ],
            [
                'email' => env('DEMO_MITRA_2_EMAIL', 'rendydevanodanendra@gmail.com'),
                'name' => env('DEMO_MITRA_2_NAME', 'Rendy Devano Danendra, S.Kom.'),
                'company' => env('DEMO_MITRA_2_COMPANY', 'PT Telkom Indonesia (Witel Jatim)'),
                'password' => $getPassword('DEMO_MITRA_2_PASSWORD'),
                'alamat' => 'Jl. Ketintang No. 156, Surabaya',
                'kota' => 'Surabaya',
                'telepon' => '031-8281000',
                'website' => 'https://telkom.co.id',
                'nama_pj' => 'Budi Santoso, S.T.',
                'jabatan_pj' => 'Senior Manager Enterprise Service',
            ],
            [
                'email' => env('DEMO_MITRA_3_EMAIL', 'zakariamujur6@gmail.com'),
                'name' => env('DEMO_MITRA_3_NAME', 'Zakaria Mujur Prasetyo, M.T.'),
                'company' => env('DEMO_MITRA_3_COMPANY', 'PT Barata Indonesia'),
                'password' => $getPassword('DEMO_MITRA_3_PASSWORD'),
                'alamat' => 'Jl. Veteran No. 241, Gresik',
                'kota' => 'Gresik',
                'telepon' => '031-3981234',
                'website' => 'https://barata.id',
                'nama_pj' => 'Drs. Agus Hariyanto',
                'jabatan_pj' => 'Kepala Divisi Teknologi & Enjiniring',
            ],
            [
                'email' => env('DEMO_MITRA_4_EMAIL', 'nabiilahrizqiamal@gmail.com'),
                'name' => env('DEMO_MITRA_4_NAME', 'Nabiilah Rizqi Amalia, S.T.'),
                'company' => env('DEMO_MITRA_4_COMPANY', 'Diskominfo Provinsi Jawa Timur'),
                'password' => $getPassword('DEMO_MITRA_4_PASSWORD'),
                'alamat' => 'Jl. Ahmad Yani No. 242-244, Gayungan, Surabaya',
                'kota' => 'Surabaya',
                'telepon' => '031-8294608',
                'website' => 'https://kominfo.jatimprov.go.id',
                'nama_pj' => 'Dra. Hj. Wahyuni, M.Si.',
                'jabatan_pj' => 'Kepala Bidang Aplikasi Informatika',
            ],
        ];

        $seededPls = [];
        $instansi = null;
        $pl = null;

        foreach ($mitrasConfig as $idx => $mCfg) {
            $mInstansi = Instansi::firstOrCreate(
                ['nama' => $mCfg['company']],
                [
                    'alamat' => $mCfg['alamat'],
                    'kota' => $mCfg['kota'],
                    'no_telepon' => $mCfg['telepon'],
                    'email' => $mCfg['email'],
                    'website' => $mCfg['website'],
                    'nama_pj' => $mCfg['nama_pj'],
                    'jabatan_pj' => $mCfg['jabatan_pj'],
                ]
            );

            $mUser = User::updateOrCreate(
                ['email' => $mCfg['email']],
                [
                    'name' => $mCfg['name'],
                    'password' => $mCfg['password'],
                    'role' => 'instansi',
                    'status_akun' => 'aktif',
                    'nip' => null,
                    'nim' => null,
                ]
            );

            $mPl = PembimbingLapangan::updateOrCreate(
                ['instansi_id' => $mInstansi->id, 'nama' => $mCfg['name']],
                ['user_id' => $mUser->id]
            );

            $mInstansi->update(['user_id' => $mUser->id]);

            if ($idx === 0) {
                $instansi = $mInstansi;
                $pl = $mPl;
            }

            $seededPls[$idx] = [
                'instansi' => $mInstansi,
                'user' => $mUser,
                'pl' => $mPl,
                'config' => $mCfg,
            ];
        }

        // 7. Akun Mahasiswa Khusus Google Workspace UTM (Dikonfigurasi via .env)
        $googleUserEmail = env('GOOGLE_TEST_USER_EMAIL');
        $googleUserName = env('GOOGLE_TEST_USER_NAME', 'Mahasiswa Google Demo');
        $googleUserNim = (string) env('GOOGLE_TEST_USER_NIM', '');
        $googleUserPassword = $getPassword('GOOGLE_TEST_USER_PASSWORD');

        if ($googleUserEmail) {
            User::updateOrCreate(
                ['email' => $googleUserEmail],
                [
                    'name' => $googleUserName,
                    'nim' => $googleUserNim ?: null,
                    'password' => $googleUserPassword,
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
        $demoMhsNama = env('DEMO_MHS_NAMA', env('DEMO_MHS_NAME', 'Nabiilah Rizqi Amalia'));
        $demoMhsEmail = env('DEMO_MHS_EMAIL', "{$demoMhsNim}@student.trunojoyo.ac.id");
        $demoMhsPassword = $getPassword('DEMO_MHS_PASSWORD');

        $mhsDemo = User::updateOrCreate(
            ['nim' => $demoMhsNim],
            [
                'name' => $demoMhsNama,
                'email' => $demoMhsEmail,
                'password' => $demoMhsPassword,
                'role' => 'mahasiswa',
                'status_akun' => 'aktif',
                'program_studi_id' => $prodiId,
                'angkatan' => 2023,
                'dosen_wali_id' => $dosenRika->id,
            ]
        );

        MasterMahasiswa::updateOrCreate(
            ['nim' => $demoMhsNim],
            [
                'nama' => $demoMhsNama,
                'email' => $demoMhsEmail,
                'program_studi' => 'Teknik Informatika',
                'angkatan' => '2023',
                'nip_dosen_wali' => $dosenRika->nip,
                'sumber_data' => 'system_seed',
            ]
        );

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
                    'deskripsi' => "Orientasi lingkungan kerja praktik di PT Petrokimia Gresik dan pengenalan arsitektur sistem IT internal.",
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
            // Dokumen Pendaftaran (KRS & Transkrip)
            DokumenPendaftaran::updateOrCreate(
                ['pendaftaran_id' => $pendaftaranAktif->id, 'jenis' => 'krs'],
                [
                    'nama_file' => 'KRS_Semester_6_Muhammad_Devano.pdf',
                    'path' => 'dokumen/template_proposal.pdf',
                    'ukuran' => 704174,
                    'uploaded_at' => now()->subDays(35),
                ]
            );
            DokumenPendaftaran::updateOrCreate(
                ['pendaftaran_id' => $pendaftaranAktif->id, 'jenis' => 'transkrip'],
                [
                    'nama_file' => 'Transkrip_Akademik_Muhammad_Devano.pdf',
                    'path' => 'dokumen/template_berita_acara.pdf',
                    'ukuran' => 581335,
                    'uploaded_at' => now()->subDays(35),
                ]
            );

            // Surat Pengantar Resmi
            SuratPengantar::updateOrCreate(
                ['pendaftaran_id' => $pendaftaranAktif->id],
                [
                    'nomor_surat' => '0142/UN46.3.4/AK.KP/2026',
                    'tanggal_terbit' => '2026-07-28',
                    'tanggal_berlaku' => '2026-11-30',
                    'path_file' => 'dokumen/buku_panduan_kp.pdf',
                    'ditandatangani_oleh' => 'Dr. Budi Santoso, M.Kom.',
                    'nip_penandatangan' => '19800101 200501 1 001',
                    'verification_id' => 'UTM-KP-2026-0092',
                    'confirmation_status' => 'accepted',
                    'generated_by' => $tuUser->id,
                    'status' => 'terverifikasi',
                ]
            );

            // Proposal KP
            Proposal::updateOrCreate(
                ['pendaftaran_id' => $pendaftaranAktif->id],
                [
                    'judul' => 'Rancang Bangun Sistem Informasi Logistik dan Monitoring Distribusi Pupuk Berbasis Web',
                    'abstrak' => 'Kerja praktik ini berfokus pada implementasi arsitektur RESTful API dan dashboard pelaporan distribusi logistik di PT Petrokimia Gresik untuk meningkatkan efisiensi pemantauan pengiriman antar gudang.',
                    'path_file' => 'dokumen/template_proposal.pdf',
                    'versi' => 1,
                    'status' => 'disetujui',
                    'submitted_at' => now()->subDays(25),
                    'reviewed_by' => $dosenRika->id,
                    'reviewed_at' => now()->subDays(20),
                ]
            );

            // Dokumen Akhir (Laporan Akhir)
            DokumenAkhir::updateOrCreate(
                ['pendaftaran_id' => $pendaftaranAktif->id, 'jenis' => 'laporan_akhir'],
                [
                    'nama_file' => 'Laporan_Akhir_KP_Devano.pdf',
                    'path' => 'dokumen/buku_panduan_kp.pdf',
                    'uploaded_at' => now()->subDays(5),
                ]
            );
        }

        // 9. Demo Pendaftaran untuk Verifikasi TU (Firly Ramadhani - Antrean Menunggu Verifikasi)
        $firlyNim = (string) env('DEMO_MHS_2_NIM', '230411100080');
        $firlyNama = env('DEMO_MHS_2_NAMA', env('DEMO_MHS_2_NAME', 'Firly Ramadhani'));
        $firlyEmail = env('DEMO_MHS_2_EMAIL', "{$firlyNim}@student.trunojoyo.ac.id");
        $firlyPassword = $getPassword('DEMO_MHS_2_PASSWORD');

        $mhsFirly = User::updateOrCreate(
            ['nim' => $firlyNim],
            [
                'name' => $firlyNama,
                'email' => $firlyEmail,
                'password' => $firlyPassword,
                'role' => 'mahasiswa',
                'status_akun' => 'aktif',
                'program_studi_id' => $prodiId,
                'angkatan' => 2023,
                'semester' => 'Semester Ganjil 2026/2027',
                'no_telepon' => '081234567880',
                'total_sks' => 88,
                'ipk' => 3.25,
                'dosen_wali_id' => $dosenRika->id,
            ]
        );

        MasterMahasiswa::updateOrCreate(
            ['nim' => $firlyNim],
            [
                'nama' => $firlyNama,
                'email' => $firlyEmail,
                'program_studi' => 'Teknik Informatika',
                'angkatan' => '2023',
                'nip_dosen_wali' => $dosenRika->nip,
                'sumber_data' => 'system_seed',
            ]
        );

        if ($mhsFirly) {
            $pendaftaranFirly = Pendaftaran::updateOrCreate(
                ['mahasiswa_id' => $mhsFirly->id],
                [
                    'instansi_id' => $instansi->id,
                    'dosen_pembimbing_id' => $dosenRika->id,
                    'bidang_minat' => 'Data Analytics & Enterprise Network Infrastructure',
                    'tanggal_mulai' => '2026-09-01',
                    'tanggal_selesai' => '2026-11-30',
                    'status' => 'diajukan',
                ]
            );

            DokumenPendaftaran::updateOrCreate(
                ['pendaftaran_id' => $pendaftaranFirly->id, 'jenis' => 'krs'],
                [
                    'nama_file' => 'KRS_Semester_6_Firly.pdf',
                    'path' => 'dokumen/template_proposal.pdf',
                    'ukuran' => 704174,
                    'uploaded_at' => now()->subDays(3),
                ]
            );
            DokumenPendaftaran::updateOrCreate(
                ['pendaftaran_id' => $pendaftaranFirly->id, 'jenis' => 'transkrip'],
                [
                    'nama_file' => 'Transkrip_Nilai_Firly.pdf',
                    'path' => 'dokumen/template_berita_acara.pdf',
                    'ukuran' => 581335,
                    'uploaded_at' => now()->subDays(3),
                ]
            );
        }

        // 9b. Mahasiswa Bangkit Rizky Lillah (NIM 230411100085 - Status: disetujui_tu)
        $bangkitNim = '230411100085';
        $bangkitNama = 'BANGKIT RIZKY LILLAH';
        $bangkitEmail = '230411100085@student.trunojoyo.ac.id';

        $mhsBangkit = User::updateOrCreate(
            ['nim' => $bangkitNim],
            [
                'name' => $bangkitNama,
                'email' => $bangkitEmail,
                'password' => $password,
                'role' => 'mahasiswa',
                'status_akun' => 'aktif',
                'program_studi_id' => $prodiId,
                'angkatan' => 2023,
                'semester' => 'Semester Ganjil 2026/2027',
                'total_sks' => 120,
                'ipk' => 3.36,
                'no_telepon' => '081234567885',
                'dosen_wali_id' => $dosenRika->id,
            ]
        );

        MasterMahasiswa::updateOrCreate(
            ['nim' => $bangkitNim],
            [
                'nama' => $bangkitNama,
                'email' => $bangkitEmail,
                'program_studi' => 'Teknik Informatika',
                'angkatan' => '2023',
                'nip_dosen_wali' => $dosenRika->nip,
                'sumber_data' => 'system_seed',
            ]
        );

        if ($mhsBangkit) {
            $pendaftaranBangkit = Pendaftaran::updateOrCreate(
                ['mahasiswa_id' => $mhsBangkit->id],
                [
                    'instansi_id' => $instansi->id,
                    'bidang_minat' => 'Rekayasa Perangkat Lunak & Sistem Terdistribusi',
                    'tanggal_mulai' => '2026-08-01',
                    'tanggal_selesai' => '2026-10-31',
                    'status' => 'disetujui_tu',
                    'dosen_pembimbing_id' => $dosenRika->id,
                    'diverifikasi_oleh' => $tuUser->id,
                    'diverifikasi_pada' => now()->subDays(2),
                ]
            );

            DokumenPendaftaran::updateOrCreate(
                ['pendaftaran_id' => $pendaftaranBangkit->id, 'jenis' => 'transkrip'],
                [
                    'nama_file' => 'Transkrip_Nilai_Bangkit_Rizky_Lillah.pdf',
                    'path' => 'dokumen/template_berita_acara.pdf',
                    'ukuran' => 581335,
                    'uploaded_at' => now()->subDays(2),
                ]
            );
        }

        // 10. Demo Pendaftaran untuk Akun Mahasiswa 3 (Zakaria Mujur) -> Mitra 3 (PT Barata Indonesia)
        $mhsZakaria = User::where('email', $googleUserEmail)->first();
        if ($mhsZakaria) {
            Pendaftaran::updateOrCreate(
                ['mahasiswa_id' => $mhsZakaria->id],
                [
                    'instansi_id' => $seededPls[2]['instansi']->id,
                    'pembimbing_lapangan_id' => $seededPls[2]['pl']->id,
                    'dosen_pembimbing_id' => $dosenRika->id,
                    'bidang_minat' => 'Industrial Internet of Things & Embedded Systems',
                    'tanggal_mulai' => '2026-08-15',
                    'tanggal_selesai' => '2026-11-15',
                    'status' => 'aktif',
                    'diverifikasi_oleh' => $tuUser->id,
                    'diverifikasi_pada' => now()->subDays(15),
                ]
            );
        }

        // 11. Demo Mahasiswa 4 -> Mitra 4 (Diskominfo Provinsi Jawa Timur)
        $mhs4 = User::updateOrCreate(
            ['nim' => '230411100001'],
            [
                'name' => 'Achmad Farhan Ramadhan',
                'email' => '230411100001@student.trunojoyo.ac.id',
                'password' => $password,
                'role' => 'mahasiswa',
                'status_akun' => 'aktif',
                'program_studi_id' => $prodiId,
                'angkatan' => 2023,
                'dosen_wali_id' => $dosenFifin->id,
            ]
        );
        MasterMahasiswa::updateOrCreate(
            ['nim' => '230411100001'],
            [
                'nama' => 'Achmad Farhan Ramadhan',
                'email' => '230411100001@student.trunojoyo.ac.id',
                'program_studi' => 'Teknik Informatika',
                'angkatan' => '2023',
                'nip_dosen_wali' => $dosenFifin->nip,
                'sumber_data' => 'system_seed',
            ]
        );
        Pendaftaran::updateOrCreate(
            ['mahasiswa_id' => $mhs4->id],
            [
                'instansi_id' => $seededPls[3]['instansi']->id,
                'pembimbing_lapangan_id' => $seededPls[3]['pl']->id,
                'dosen_pembimbing_id' => $dosenFifin->id,
                'bidang_minat' => 'Smart City Application & Public Service Integration',
                'tanggal_mulai' => '2026-08-01',
                'tanggal_selesai' => '2026-10-31',
                'status' => 'aktif',
                'diverifikasi_oleh' => $tuUser->id,
                'diverifikasi_pada' => now()->subDays(20),
            ]
        );

        // 12. Demo Mahasiswa 5 (Tahap Sidang KP Dijadwalkan) -> Dinda Ayu Lestari
        $mhs5Nim = '230411100010';
        $mhs5 = User::updateOrCreate(
            ['nim' => $mhs5Nim],
            [
                'name' => 'Dinda Ayu Lestari',
                'email' => "{$mhs5Nim}@student.trunojoyo.ac.id",
                'password' => $password,
                'role' => 'mahasiswa',
                'status_akun' => 'aktif',
                'program_studi_id' => $prodiId,
                'angkatan' => 2023,
                'dosen_wali_id' => $dosenRika->id,
            ]
        );
        MasterMahasiswa::updateOrCreate(
            ['nim' => $mhs5Nim],
            [
                'nama' => 'Dinda Ayu Lestari',
                'email' => "{$mhs5Nim}@student.trunojoyo.ac.id",
                'program_studi' => 'Teknik Informatika',
                'angkatan' => '2023',
                'nip_dosen_wali' => $dosenRika->nip,
                'sumber_data' => 'system_seed',
            ]
        );
        $pendaftaran5 = Pendaftaran::updateOrCreate(
            ['mahasiswa_id' => $mhs5->id],
            [
                'instansi_id' => $seededPls[1]['instansi']->id,
                'pembimbing_lapangan_id' => $seededPls[1]['pl']->id,
                'dosen_pembimbing_id' => $dosenRika->id,
                'bidang_minat' => 'Cloud Computing & Infrastructure Engineering',
                'tanggal_mulai' => '2026-07-01',
                'tanggal_selesai' => '2026-09-30',
                'status' => 'seminar',
                'diverifikasi_oleh' => $tuUser->id,
                'diverifikasi_pada' => now()->subDays(60),
            ]
        );
        Proposal::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran5->id],
            [
                'judul' => 'Otomasi Monitoring Pipeline Serverless Microservices pada Cloud Platform',
                'abstrak' => 'Implementasi sistem pemantauan otomatis berbasis cloud platform untuk meningkatkan keandalan infrastruktur serverless.',
                'path_file' => 'dokumen/template_proposal.pdf',
                'versi' => 1,
                'status' => 'disetujui',
                'submitted_at' => now()->subDays(50),
                'reviewed_by' => $dosenRika->id,
                'reviewed_at' => now()->subDays(45),
            ]
        );
        DokumenAkhir::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran5->id, 'jenis' => 'laporan_akhir'],
            [
                'nama_file' => 'Laporan_Akhir_KP_Dinda_Ayu.pdf',
                'path' => 'dokumen/buku_panduan_kp.pdf',
                'uploaded_at' => now()->subDays(10),
            ]
        );
        Sidang::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran5->id],
            [
                'status' => 'dijadwalkan',
                'ruangan' => 'Lab Komputer & Rekayasa Perangkat Lunak 1',
                'tanggal_sidang' => now()->addDays(2)->setHour(9)->setMinute(30),
                'dosen_penguji_id' => $dosenRika->id,
                'catatan' => 'Harap hadir 15 menit sebelum sidang dengan pakaian rapi dan membawa draf laporan.',
            ]
        );

        // 13. Demo Mahasiswa 6 (Tahap Selesai KP & Yudisium Lulus) -> Rizky Pratama
        $mhs6Nim = '230411100020';
        $mhs6 = User::updateOrCreate(
            ['nim' => $mhs6Nim],
            [
                'name' => 'Rizky Pratama',
                'email' => "{$mhs6Nim}@student.trunojoyo.ac.id",
                'password' => $password,
                'role' => 'mahasiswa',
                'status_akun' => 'aktif',
                'program_studi_id' => $prodiId,
                'angkatan' => 2023,
                'dosen_wali_id' => $dosenFifin->id,
            ]
        );
        MasterMahasiswa::updateOrCreate(
            ['nim' => $mhs6Nim],
            [
                'nama' => 'Rizky Pratama',
                'email' => "{$mhs6Nim}@student.trunojoyo.ac.id",
                'program_studi' => 'Teknik Informatika',
                'angkatan' => '2023',
                'nip_dosen_wali' => $dosenFifin->nip,
                'sumber_data' => 'system_seed',
            ]
        );
        $pendaftaran6 = Pendaftaran::updateOrCreate(
            ['mahasiswa_id' => $mhs6->id],
            [
                'instansi_id' => $seededPls[0]['instansi']->id,
                'pembimbing_lapangan_id' => $seededPls[0]['pl']->id,
                'dosen_pembimbing_id' => $dosenFifin->id,
                'bidang_minat' => 'Cyber Security & Network Defense',
                'tanggal_mulai' => '2026-06-01',
                'tanggal_selesai' => '2026-08-31',
                'status' => 'selesai',
                'diverifikasi_oleh' => $tuUser->id,
                'diverifikasi_pada' => now()->subDays(90),
            ]
        );
        Proposal::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran6->id],
            [
                'judul' => 'Audit Keamanan Sistem Jaringan dan Manajemen Hak Akses Pengguna',
                'abstrak' => 'Penerapan framework keamanan ISO 27001 pada infrastruktur jaringan enterprise.',
                'path_file' => 'dokumen/template_proposal.pdf',
                'versi' => 1,
                'status' => 'disetujui',
                'submitted_at' => now()->subDays(80),
                'reviewed_by' => $dosenFifin->id,
                'reviewed_at' => now()->subDays(75),
            ]
        );
        DokumenAkhir::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran6->id, 'jenis' => 'laporan_akhir'],
            [
                'nama_file' => 'Laporan_Akhir_KP_Rizky_Pratama.pdf',
                'path' => 'dokumen/buku_panduan_kp.pdf',
                'uploaded_at' => now()->subDays(20),
            ]
        );
        Sidang::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran6->id],
            [
                'status' => 'selesai',
                'ruangan' => 'Ruang Sidang 2 Lt. 2',
                'tanggal_sidang' => now()->subDays(15)->setHour(10)->setMinute(0),
                'dosen_penguji_id' => $dosenFifin->id,
                'catatan' => 'Sidang selesai dengan hasil memuaskan.',
            ]
        );
        // Nilai Dosen Pembimbing
        Nilai::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran6->id, 'tipe' => 'pembimbing', 'komponen' => 'sistematika'],
            ['penilai_id' => $dosenFifin->id, 'bobot' => 20, 'nilai' => 88]
        );
        Nilai::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran6->id, 'tipe' => 'pembimbing', 'komponen' => 'kedalaman'],
            ['penilai_id' => $dosenFifin->id, 'bobot' => 30, 'nilai' => 90]
        );
        Nilai::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran6->id, 'tipe' => 'pembimbing', 'komponen' => 'penguasaan'],
            ['penilai_id' => $dosenFifin->id, 'bobot' => 30, 'nilai' => 86]
        );
        Nilai::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran6->id, 'tipe' => 'pembimbing', 'komponen' => 'presentasi'],
            ['penilai_id' => $dosenFifin->id, 'bobot' => 20, 'nilai' => 92]
        );
        // Nilai Instansi
        Nilai::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran6->id, 'tipe' => 'instansi', 'komponen' => 'kedisiplinan'],
            ['penilai_id' => $seededPls[0]['user']->id, 'bobot' => 30, 'nilai' => 95]
        );
        Nilai::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran6->id, 'tipe' => 'instansi', 'komponen' => 'kerjasama'],
            ['penilai_id' => $seededPls[0]['user']->id, 'bobot' => 30, 'nilai' => 90]
        );
        Nilai::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran6->id, 'tipe' => 'instansi', 'komponen' => 'kinerja'],
            ['penilai_id' => $seededPls[0]['user']->id, 'bobot' => 40, 'nilai' => 92]
        );
        NilaiAkhir::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran6->id],
            [
                'nilai_pembimbing' => 88.8,
                'nilai_instansi' => 92.3,
                'nilai_ujian' => 89.0,
                'nilai_total' => 90.1,
                'nilai_huruf' => 'A',
                'status' => 'lulus',
                'catatan' => 'Lulus Kerja Praktik dengan predikat Sangat Baik (A).',
            ]
        );
        BeritaAcara::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran6->id],
            [
                'status' => 'disetujui',
                'path_file' => 'dokumen/template_berita_acara.pdf',
                'catatan' => 'Telah divalidasi dan disetujui oleh Program Studi.',
                'divalidasi_oleh' => $prodiUser->id,
                'divalidasi_pada' => now()->subDays(10),
            ]
        );

        $this->command->info('===============================================================');
        $this->command->info('✅ DATABASE INISIALISASI SUKSES - DATA KREDENSIAL DARI ENV!');
        $this->command->info('===============================================================');

        $tableRows = [];
        if ($mhsDemo) {
            $tableRows[] = [
                'Mahasiswa 1 (Aktif KP)',
                "{$mhsDemo->nim} ({$mhsDemo->email})",
                env('DEMO_MHS_PASSWORD', $initialPassword),
                "{$mhsDemo->name} (PT Petrokimia Gresik)",
            ];
        }
        if ($mhsFirly) {
            $tableRows[] = [
                'Mahasiswa 2 (Aktif KP)',
                "{$mhsFirly->nim} ({$mhsFirly->email})",
                env('DEMO_MHS_2_PASSWORD', $initialPassword),
                "{$mhsFirly->name} (PT Telkom Indonesia)",
            ];
        }
        if ($googleUserEmail) {
            $tableRows[] = [
                'Mahasiswa 3 (SSO Google)',
                $googleUserEmail,
                env('GOOGLE_TEST_USER_PASSWORD', $initialPassword),
                "{$googleUserName} (PT Barata Indonesia)",
            ];
        }
        $tableRows[] = [
            'Mahasiswa 5 (Tahap Sidang)',
            "{$mhs5->nim} ({$mhs5->email})",
            $initialPassword,
            "{$mhs5->name} (Sidang Dijadwalkan)",
        ];
        $tableRows[] = [
            'Mahasiswa 6 (Lulus & Berita Acara)',
            "{$mhs6->nim} ({$mhs6->email})",
            $initialPassword,
            "{$mhs6->name} (Lulus KP Nilai A)",
        ];
        $tableRows[] = [
            'Dosen Pembimbing 1',
            "{$dosenRikaEmail} / {$dosenRikaNip}",
            env('DEMO_DOSEN_PASSWORD', $initialPassword),
            $dosenRikaName,
        ];
        $tableRows[] = [
            'Dosen Pembimbing 2',
            "{$dosenFifinEmail} / {$dosenFifinNip}",
            env('DEMO_DOSEN_2_PASSWORD', $initialPassword),
            $dosenFifinName,
        ];
        $tableRows[] = [
            'Tata Usaha (TU)',
            "{$tuEmail} / {$tuNip}",
            env('ADMIN_TU_PASSWORD', $initialPassword),
            $tuName,
        ];
        $tableRows[] = [
            'Koordinator KP (Prodi)',
            "{$prodiEmail} / {$prodiNip}",
            env('KOORDINATOR_PRODI_PASSWORD', $initialPassword),
            $prodiName,
        ];

        // 4 Real Mitra
        foreach ($seededPls as $spl) {
            $tableRows[] = [
                'Mitra (Pembimbing Lapangan)',
                $spl['config']['email'],
                $spl['config']['plain_password'] ?? env('INITIAL_DEMO_PASSWORD', 'password'),
                "{$spl['config']['company']} - {$spl['config']['name']}",
            ];
        }

        // Super User Root
        $this->call(SuperUserRootSeeder::class);

        $tableRows[] = [
            'Super User Root',
            env('ROOT_EMAIL', 'root@trunojoyo.ac.id'),
            env('ROOT_PASSWORD', 'password'),
            env('ROOT_NAME', 'Root Administrator') . ' (Otoritas Tertinggi)',
        ];

        $this->command->table(
            ['Peran', 'Email / NIM / NIP', 'Password', 'Keterangan'],
            $tableRows
        );
    }
}