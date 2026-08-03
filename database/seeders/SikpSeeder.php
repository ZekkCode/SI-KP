<?php

namespace Database\Seeders;

use App\Models\BeritaAcara;
use App\Models\DokumenAkhir;
use App\Models\DokumenPendaftaran;
use App\Models\Instansi;
use App\Models\KuotaDosen;
use App\Models\Logbook;
use App\Models\Nilai;
use App\Models\NilaiAkhir;
use App\Models\Notifikasi;
use App\Models\Pendaftaran;
use App\Models\ProgramStudi;
use App\Models\Proposal;
use App\Models\ProposalFeedback;
use App\Models\SuratPengantar;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SikpSeeder extends Seeder
{
    public function run(): void
    {
        // ═══════════════════════════════════════════════════════════
        // 1. Program Studi (5 data)
        // ═══════════════════════════════════════════════════════════
        $prodiData = [
            ['nama' => 'Teknik Informatika', 'kode' => 'TI', 'fakultas' => 'Fakultas Ilmu Komputer'],
            ['nama' => 'Sistem Informasi', 'kode' => 'SI', 'fakultas' => 'Fakultas Ilmu Komputer'],
            ['nama' => 'Teknik Elektro', 'kode' => 'TE', 'fakultas' => 'Fakultas Teknik'],
            ['nama' => 'Teknik Industri', 'kode' => 'TIN', 'fakultas' => 'Fakultas Teknik'],
            ['nama' => 'Manajemen Informatika', 'kode' => 'MI', 'fakultas' => 'Fakultas Ilmu Komputer'],
        ];

        $prodis = collect();
        foreach ($prodiData as $p) {
            $prodis->push(ProgramStudi::create($p));
        }

        // ═══════════════════════════════════════════════════════════
        // 2. Users — Multiple roles
        // ═══════════════════════════════════════════════════════════
        $password = Hash::make('password');

        // --- Mahasiswa (30 users) ---
        $mahasiswaNames = [
            'Budi Santoso', 'Siti Aminah', 'Ahmad Hidayat', 'Diana Putri', 'Eko Prabowo',
            'Fitri Handayani', 'Galih Pratama', 'Hana Safira', 'Irfan Maulana', 'Joko Widodo',
            'Kartika Sari', 'Lukman Hakim', 'Maya Anggraini', 'Naufal Rizky', 'Olivia Dewi',
            'Putra Ramadhan', 'Qori Aisyah', 'Rendi Saputra', 'Sari Wulandari', 'Teguh Firmansyah',
            'Ulfa Maharani', 'Vino Pratama', 'Winda Kusuma', 'Xavier Aditya', 'Yuni Rahayu',
            'Zahra Amelia', 'Bagus Dwi Cahyo', 'Citra Lestari', 'Dimas Ardiansyah', 'Elsa Permata',
        ];

        $mahasiswas = collect();
        foreach ($mahasiswaNames as $i => $name) {
            $mahasiswas->push(User::create([
                'name' => $name,
                'email' => strtolower(str_replace(' ', '.', $name)) . '@student.utn.ac.id',
                'password' => $password,
                'role' => 'mahasiswa',
                'nim' => '2004111' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'nip' => null,
                'program_studi_id' => $prodis->random()->id,
                'no_telepon' => '08' . fake()->numerify('##########'),
                'total_sks' => fake()->numberBetween(100, 140),
                'semester' => fake()->randomElement([
                    'Ganjil 2024/2025', 'Genap 2024/2025',
                    'Ganjil 2025/2026', 'Genap 2025/2026',
                    'Ganjil 2026/2027', 'Genap 2026/2027'
                ]),
                'ipk' => fake()->randomFloat(2, 3.00, 4.00),
                'angkatan' => fake()->randomElement([2020, 2021, 2022]),
            ]));
        }

        // --- Dosen (10 users) ---
        $dosenNames = [
            'Dr. Wahyudi, S.T., M.Kom.', 'Rina Fitriana, S.Kom., M.Cs.',
            'Prof. Dr. Ir. Budi Santoso', 'Dr. Andi Budianto, S.T., M.Kom.',
            'Citra Sari, S.Kom., M.T.', 'Dr. Hendra Wijaya, S.T., M.T.',
            'Dewi Sartika, S.Kom., M.Kom.', 'Dr. Farhan Azhari, S.T., M.Eng.',
            'Lina Marlina, S.Si., M.Kom.', 'Dr. Surya Darma, S.Kom., M.M.',
        ];

        $dosens = collect();
        foreach ($dosenNames as $i => $name) {
            $dosens->push(User::create([
                'name' => $name,
                'email' => 'dosen' . ($i + 1) . '@utn.ac.id',
                'password' => $password,
                'role' => 'dosen',
                'nim' => null,
                'nip' => '19' . fake()->numerify('########') . ' ' . fake()->numerify('200501') . ' 1 ' . fake()->numerify('0##'),
                'program_studi_id' => $prodis->random()->id,
                'no_telepon' => '08' . fake()->numerify('##########'),
            ]));
        }

        // --- TU (3 users) ---
        $tuNames = ['Agus Supriyanto', 'Sri Wahyuni', 'Bambang Hermawan'];
        $tus = collect();
        foreach ($tuNames as $i => $name) {
            $tus->push(User::create([
                'name' => $name,
                'email' => 'tu' . ($i + 1) . '@utn.ac.id',
                'password' => $password,
                'role' => 'tu',
                'nip' => '19' . fake()->numerify('########') . ' ' . fake()->numerify('200601') . ' 2 ' . fake()->numerify('0##'),
            ]));
        }

        // --- Instansi users (5 users) ---
        $instansiUserNames = ['Jane Doe', 'Rudi Hartono', 'Maria Tanoto', 'Hendra Wijaya', 'Sinta Puspita'];
        $instansiUsers = collect();
        foreach ($instansiUserNames as $i => $name) {
            $instansiUsers->push(User::create([
                'name' => $name,
                'email' => 'instansi' . ($i + 1) . '@company.com',
                'password' => $password,
                'role' => 'instansi',
                'no_telepon' => '08' . fake()->numerify('##########'),
            ]));
        }

        // --- Prodi (2 users) ---
        $prodiUsers = collect();
        foreach (['Koordinator KP TI', 'Koordinator KP SI'] as $i => $name) {
            $prodiUsers->push(User::create([
                'name' => $name,
                'email' => 'prodi' . ($i + 1) . '@utn.ac.id',
                'password' => $password,
                'role' => 'prodi',
                'nip' => '19' . fake()->numerify('########') . ' ' . fake()->numerify('200701') . ' 1 ' . fake()->numerify('0##'),
                'program_studi_id' => $prodis[$i]->id,
            ]));
        }

        // ═══════════════════════════════════════════════════════════
        // 3. Instansis (30 data)
        // ═══════════════════════════════════════════════════════════
        $companyNames = [
            'PT. Teknologi Nusantara Sejahtera', 'PT. Digital Inovasi Indonesia', 'CV. Maju Bersama Jaya',
            'PT. Solusi Data Nusantara', 'PT. Global Informatika Mandiri', 'PT. Karya Teknik Utama',
            'PT. Inovasi AgriTech Nusantara', 'PT. Cyber Security Indonesia', 'PT. Cloud Nine Technology',
            'PT. Aplikasi Pintar Bangsa', 'PT. Telematika Sukses', 'CV. Bina Karya Digital',
            'PT. Nexus Software House', 'PT. Prima Coding Studio', 'CV. Alfa Data Konsultan',
            'PT. Sentral Teknologi Asia', 'PT. Gemilang IT Solutions', 'PT. Sinergi Digital Pratama',
            'PT. Maestro Inovasi Tech', 'PT. Quantum Computing ID', 'PT. Cakrawala Digital Nusantara',
            'PT. Rajawali Informatika', 'PT. Nusantara Cloud Services', 'PT. Indomedia Kreatif',
            'PT. Surya Data Teknologi', 'CV. Berdikari Software', 'PT. Kreatifitas Digital',
            'PT. Andalan Tekno Mandiri', 'PT. Mitra Solusi Teknologi', 'PT. Elang Digital Utama',
        ];

        $cities = [
            'Jakarta Selatan', 'Jakarta Pusat', 'Bandung', 'Surabaya', 'Yogyakarta',
            'Semarang', 'Malang', 'Medan', 'Makassar', 'Tangerang', 'Bekasi', 'Depok', 'Bogor',
        ];

        $instansis = collect();
        foreach ($companyNames as $i => $company) {
            $instansis->push(Instansi::create([
                'user_id' => $i < $instansiUsers->count() ? $instansiUsers[$i]->id : null,
                'nama' => $company,
                'alamat' => fake()->streetAddress() . "\n" . fake()->randomElement($cities),
                'kota' => fake()->randomElement($cities),
                'no_telepon' => fake()->phoneNumber(),
                'email' => strtolower(str_replace([' ', '.', ','], '', $company)) . '@mail.com',
                'website' => 'https://www.' . strtolower(str_replace([' ', '.', ','], '', explode(' ', $company)[1] ?? 'company')) . '.co.id',
                'nama_pj' => fake()->name(),
                'jabatan_pj' => fake()->randomElement(['HR Manager', 'CTO', 'Lead Developer', 'IT Manager', 'Direktur']),
            ]));
        }

        // ═══════════════════════════════════════════════════════════
        // 4. Pendaftarans (30 data)
        // ═══════════════════════════════════════════════════════════
        $statuses = [
            'draft', 'diajukan', 'verifikasi_tu', 'disetujui_tu', 'surat_terbit',
            'diterima_instansi', 'aktif', 'aktif', 'aktif', 'selesai',
        ];

        $bidangMinat = [
            'Software Engineering', 'Backend Development', 'Frontend Development',
            'Data Science', 'Machine Learning', 'Cloud Infrastructure',
            'Mobile Development', 'DevOps', 'Cyber Security', 'UI/UX Design',
        ];

        $pendaftarans = collect();
        for ($i = 0; $i < 30; $i++) {
            $status = $statuses[$i % count($statuses)];
            $startDate = fake()->dateTimeBetween('-6 months', '+1 month');
            $endDate = (clone $startDate)->modify('+3 months');

            $pendaftaran = Pendaftaran::create([
                'mahasiswa_id' => $mahasiswas[$i]->id,
                'instansi_id' => $instansis[$i]->id,
                'dosen_pembimbing_id' => in_array($status, ['aktif', 'selesai', 'diterima_instansi', 'surat_terbit'])
                    ? $dosens->random()->id : null,
                'tanggal_mulai' => $startDate,
                'tanggal_selesai' => $endDate,
                'status' => $status,
                'bidang_minat' => $bidangMinat[$i % count($bidangMinat)],
                'catatan_tu' => in_array($status, ['perlu_perbaikan']) ? 'Dokumen KRS belum terlihat jelas.' : null,
                'diverifikasi_oleh' => in_array($status, ['disetujui_tu', 'surat_terbit', 'diterima_instansi', 'aktif', 'selesai'])
                    ? $tus->random()->id : null,
                'diverifikasi_pada' => in_array($status, ['disetujui_tu', 'surat_terbit', 'diterima_instansi', 'aktif', 'selesai'])
                    ? now()->subDays(fake()->numberBetween(1, 60)) : null,
            ]);
            $pendaftarans->push($pendaftaran);
        }

        // ═══════════════════════════════════════════════════════════
        // 5. Dokumen Pendaftarans (30 data — 1 per pendaftaran)
        // ═══════════════════════════════════════════════════════════
        foreach ($pendaftarans as $p) {
            DokumenPendaftaran::create([
                'pendaftaran_id' => $p->id,
                'jenis' => 'krs',
                'nama_file' => 'KRS_Semester_' . fake()->randomElement(['5', '6', '7']) . '.pdf',
                'path' => 'dokumen/pendaftaran/' . fake()->uuid() . '.pdf',
                'ukuran' => fake()->numberBetween(500_000, 3_000_000),
                'uploaded_at' => now()->subDays(fake()->numberBetween(1, 90)),
            ]);
        }

        // Add 30 transkrip documents
        foreach ($pendaftarans as $p) {
            DokumenPendaftaran::create([
                'pendaftaran_id' => $p->id,
                'jenis' => 'transkrip',
                'nama_file' => 'Transkrip_Nilai_Akademik.pdf',
                'path' => 'dokumen/pendaftaran/' . fake()->uuid() . '.pdf',
                'ukuran' => fake()->numberBetween(1_000_000, 5_000_000),
                'uploaded_at' => now()->subDays(fake()->numberBetween(1, 90)),
            ]);
        }

        // ═══════════════════════════════════════════════════════════
        // 6. Surat Pengantars (30 data — for approved+ pendaftaran)
        // ═══════════════════════════════════════════════════════════
        $suratPendaftarans = $pendaftarans->filter(fn ($p) => in_array($p->status, [
            'surat_terbit', 'diterima_instansi', 'aktif', 'selesai',
        ]));

        $suratCount = 0;
        foreach ($suratPendaftarans as $p) {
            SuratPengantar::create([
                'pendaftaran_id' => $p->id,
                'nomor_surat' => str_pad(++$suratCount, 4, '0', STR_PAD_LEFT) . '/UN.XX/AK.KP/' . now()->year,
                'tanggal_terbit' => now()->subDays(fake()->numberBetween(10, 60)),
                'tanggal_berlaku' => now()->addMonths(6),
                'path_file' => 'surat/pengantar/' . fake()->uuid() . '.pdf',
                'ditandatangani_oleh' => 'Dr. Budi Santoso, M.Kom.',
                'nip_penandatangan' => '19800101 200501 1 001',
                'verification_id' => strtoupper(fake()->bothify('??##-??##-####')),
                'generated_by' => $tus->random()->id,
            ]);
        }

        // Fill remaining to reach 30
        $remaining = 30 - $suratCount;
        $otherPendaftarans = $pendaftarans->filter(fn ($p) => !in_array($p->status, [
            'surat_terbit', 'diterima_instansi', 'aktif', 'selesai',
        ]))->take($remaining);

        foreach ($otherPendaftarans as $p) {
            SuratPengantar::create([
                'pendaftaran_id' => $p->id,
                'nomor_surat' => str_pad(++$suratCount, 4, '0', STR_PAD_LEFT) . '/UN.XX/AK.KP/' . now()->year,
                'tanggal_terbit' => now()->subDays(fake()->numberBetween(10, 60)),
                'tanggal_berlaku' => now()->addMonths(6),
                'path_file' => 'surat/pengantar/' . fake()->uuid() . '.pdf',
                'ditandatangani_oleh' => 'Dr. Budi Santoso, M.Kom.',
                'nip_penandatangan' => '19800101 200501 1 001',
                'verification_id' => strtoupper(fake()->bothify('??##-??##-####')),
                'generated_by' => $tus->random()->id,
            ]);
        }

        // ═══════════════════════════════════════════════════════════
        // 7. Proposals (30 data)
        // ═══════════════════════════════════════════════════════════
        $judulList = [
            'Pengembangan Sistem Informasi Manajemen Inventaris Berbasis Web',
            'Analisis Sentimen Pelanggan E-commerce Menggunakan NLP',
            'Rancang Bangun Aplikasi Mobile untuk Monitoring IoT',
            'Implementasi Machine Learning untuk Prediksi Harga Saham',
            'Perancangan Sistem Keamanan Jaringan Menggunakan IDS',
            'Pengembangan Dashboard Analitik Real-Time untuk Big Data',
            'Sistem Deteksi Penyakit Daun Jagung Menggunakan CNN',
            'Aplikasi Manajemen Proyek Agile Berbasis Cloud',
            'Optimasi Database dan Query Performance untuk Sistem ERP',
            'Pengembangan REST API Gateway untuk Microservices Architecture',
            'Implementasi CI/CD Pipeline untuk Automasi Deployment',
            'Analisis dan Visualisasi Data Penjualan Menggunakan Python',
            'Rancang Bangun Chatbot Customer Service Berbasis AI',
            'Perancangan UI/UX Aplikasi Fintech dengan Design Thinking',
            'Studi Implementasi Blockchain untuk Supply Chain Management',
            'Pengembangan Sistem Rekomendasi Produk Collaborative Filtering',
            'Aplikasi Absensi Karyawan Berbasis Face Recognition',
            'Optimasi Algoritma Routing pada Jaringan SDN',
            'Pengembangan Prototipe Smart Home Menggunakan Arduino',
            'Implementasi Data Warehouse dan ETL pada Sistem Pelaporan',
            'Analisis Performa Kubernetes Cluster untuk Container Orchestration',
            'Pengembangan Progressive Web App untuk Layanan Kesehatan',
            'Sistem Monitoring Server dengan Grafana dan Prometheus',
            'Implementasi GraphQL API untuk Aplikasi Sosial Media',
            'Perancangan Arsitektur Serverless untuk Aplikasi Skala Besar',
            'Pengembangan Plugin WordPress untuk E-Learning',
            'Analisis Keamanan Aplikasi Web dengan Metode OWASP',
            'Implementasi Computer Vision untuk Sortir Produk Manufaktur',
            'Rancang Bangun Sistem Informasi Geografis Potensi Wisata',
            'Pengembangan Game Edukasi Matematika Berbasis Unity',
        ];

        $proposalStatuses = ['draft', 'diajukan', 'revisi', 'disetujui'];

        foreach ($pendaftarans as $i => $p) {
            $status = $proposalStatuses[$i % count($proposalStatuses)];
            Proposal::create([
                'pendaftaran_id' => $p->id,
                'judul' => $judulList[$i],
                'abstrak' => fake()->paragraphs(2, true),
                'path_file' => 'proposal/' . fake()->uuid() . '.pdf',
                'versi' => fake()->numberBetween(1, 3),
                'status' => $status,
                'submitted_at' => $status !== 'draft' ? now()->subDays(fake()->numberBetween(5, 40)) : null,
                'reviewed_by' => in_array($status, ['revisi', 'disetujui']) ? $dosens->random()->id : null,
                'reviewed_at' => in_array($status, ['revisi', 'disetujui']) ? now()->subDays(fake()->numberBetween(1, 20)) : null,
            ]);
        }

        // ═══════════════════════════════════════════════════════════
        // 8. Proposal Feedbacks (30 data)
        // ═══════════════════════════════════════════════════════════
        $proposals = Proposal::all();
        $feedbackComments = [
            'Judul sudah cukup baik, namun perlu diperjelas scope-nya.',
            'Abstrak perlu ditambahkan metodologi yang digunakan.',
            'Saya setujui proposal ini. Silakan lanjutkan ke tahap implementasi.',
            'Tolong tambahkan referensi jurnal terbaru minimal 3 tahun terakhir.',
            'Rumusan masalah belum spesifik. Tolong revisi.',
            'Sistematika penulisan sudah bagus, perbaiki tata bahasa.',
            'Topik menarik, pastikan data yang digunakan valid.',
            'Perlu ditambahkan batasan masalah agar tidak terlalu luas.',
            'Revisi minor: perbaiki format penulisan daftar pustaka.',
            'Proposal sudah memenuhi standar. Approved.',
        ];

        for ($i = 0; $i < 30; $i++) {
            ProposalFeedback::create([
                'proposal_id' => $proposals[$i % $proposals->count()]->id,
                'user_id' => $dosens->random()->id,
                'komentar' => $feedbackComments[$i % count($feedbackComments)],
                'status_setelah' => fake()->optional(0.5)->randomElement(['revisi', 'disetujui']),
            ]);
        }

        // ═══════════════════════════════════════════════════════════
        // 9. Logbooks (30 data)
        // ═══════════════════════════════════════════════════════════
        $activities = [
            'Setup environment development dan konfigurasi project',
            'Meeting dengan tim untuk pembagian tugas sprint',
            'Implementasi fitur autentikasi dan otorisasi user',
            'Desain database schema dan ERD untuk modul baru',
            'Code review bersama senior developer',
            'Debugging dan fixing bug pada modul reporting',
            'Membuat unit test untuk API endpoint',
            'Integrasi API pihak ketiga untuk payment gateway',
            'Optimasi query database untuk mempercepat loading',
            'Deployment aplikasi ke staging server',
            'Mengikuti daily standup meeting',
            'Mempelajari arsitektur microservices perusahaan',
            'Menulis dokumentasi teknis untuk API endpoint',
            'Melakukan load testing menggunakan JMeter',
            'Refactoring kode legacy untuk clean architecture',
            'Presentasi progress mingguan ke supervisor',
            'Setup monitoring dan alerting menggunakan Grafana',
            'Implementasi caching dengan Redis untuk optimasi performa',
            'Kolaborasi dengan tim QA untuk testing integrasi',
            'Evaluasi dan review arsitektur sistem',
            'Membuat UI mockup menggunakan Figma',
            'Implementasi responsive design untuk mobile view',
            'Migrasi data dari sistem legacy ke sistem baru',
            'Melakukan security audit pada codebase',
            'Setup CI/CD pipeline menggunakan GitHub Actions',
            'Membuat fitur notifikasi real-time dengan WebSocket',
            'Analisis dan optimasi performa front-end',
            'Konfigurasi Nginx sebagai reverse proxy',
            'Implementasi middleware untuk rate limiting',
            'Penyusunan laporan progress bulanan',
        ];

        $logbookStatuses = ['menunggu', 'disetujui', 'revisi'];

        $activePendaftarans = $pendaftarans->filter(fn ($p) => in_array($p->status, ['aktif', 'selesai']));
        $logbookIdx = 0;

        foreach ($activePendaftarans as $p) {
            $logsPerPendaftaran = min(intdiv(30 - $logbookIdx, max($activePendaftarans->count(), 1)) + 1, 30 - $logbookIdx);
            if ($logsPerPendaftaran <= 0) break;

            for ($j = 0; $j < $logsPerPendaftaran && $logbookIdx < 30; $j++) {
                $status = $logbookStatuses[$logbookIdx % 3];
                Logbook::create([
                    'pendaftaran_id' => $p->id,
                    'tanggal' => now()->subDays(fake()->numberBetween(1, 90)),
                    'jam_mulai' => fake()->time('H:i', '09:30'),
                    'jam_selesai' => fake()->time('H:i', '17:30'),
                    'deskripsi' => $activities[$logbookIdx % count($activities)],
                    'path_foto' => fake()->optional(0.3)->passthrough('logbook/foto/' . fake()->uuid() . '.jpg'),
                    'status' => $status,
                    'catatan_dosen' => $status === 'disetujui' ? 'Bagus, lanjutkan!' : ($status === 'revisi' ? 'Perlu lebih detail.' : null),
                    'divalidasi_oleh' => $status !== 'menunggu' ? $p->dosen_pembimbing_id : null,
                    'divalidasi_pada' => $status !== 'menunggu' ? now()->subDays(fake()->numberBetween(1, 30)) : null,
                ]);
                $logbookIdx++;
            }
        }

        // Fill remaining logbooks if needed
        while ($logbookIdx < 30) {
            $p = $pendaftarans->random();
            $status = $logbookStatuses[$logbookIdx % 3];
            Logbook::create([
                'pendaftaran_id' => $p->id,
                'tanggal' => now()->subDays(fake()->numberBetween(1, 90)),
                'jam_mulai' => fake()->time('H:i', '09:00'),
                'jam_selesai' => fake()->time('H:i', '17:00'),
                'deskripsi' => $activities[$logbookIdx % count($activities)],
                'status' => $status,
                'catatan_dosen' => $status !== 'menunggu' ? 'OK.' : null,
                'divalidasi_oleh' => $status !== 'menunggu' ? $dosens->random()->id : null,
                'divalidasi_pada' => $status !== 'menunggu' ? now()->subDays(fake()->numberBetween(1, 30)) : null,
            ]);
            $logbookIdx++;
        }

        // ═══════════════════════════════════════════════════════════
        // 10. Berita Acaras (30 data)
        // ═══════════════════════════════════════════════════════════
        $baStatuses = ['menunggu', 'disetujui', 'revisi'];
        for ($i = 0; $i < 30; $i++) {
            $status = $baStatuses[$i % 3];
            BeritaAcara::create([
                'pendaftaran_id' => $pendaftarans[$i]->id,
                'path_file' => 'berita_acara/' . fake()->uuid() . '.pdf',
                'catatan' => fake()->optional(0.4)->sentence(),
                'status' => $status,
                'catatan_revisi' => $status === 'revisi' ? 'Cap perusahaan kurang jelas, harap scan ulang.' : null,
                'divalidasi_oleh' => $status !== 'menunggu' ? $tus->random()->id : null,
                'divalidasi_pada' => $status !== 'menunggu' ? now()->subDays(fake()->numberBetween(1, 30)) : null,
            ]);
        }

        // ═══════════════════════════════════════════════════════════
        // 11. Nilais (30 data — component scores)
        // ═══════════════════════════════════════════════════════════
        $komponenInstansi = ['Kedisiplinan', 'Tanggung Jawab', 'Kerja Sama Tim', 'Pencapaian Target'];
        $komponenPembimbing = ['Bimbingan Rutin', 'Kualitas Logbook', 'Keaktifan Konsultasi', 'Progres Kerja'];
        $komponenUjian = ['Presentasi', 'Penguasaan Materi', 'Laporan Akhir', 'Tanya Jawab'];

        $nilaiIdx = 0;
        $selesaiPendaftarans = $pendaftarans->filter(fn ($p) => $p->status === 'selesai');
        foreach ($selesaiPendaftarans as $p) {
            if ($nilaiIdx >= 30) break;
            // 1 instansi score
            Nilai::create([
                'pendaftaran_id' => $p->id,
                'penilai_id' => $instansiUsers->random()->id,
                'tipe' => 'instansi',
                'komponen' => $komponenInstansi[$nilaiIdx % 4],
                'bobot' => 25.00,
                'nilai' => fake()->randomFloat(2, 65, 98),
            ]);
            $nilaiIdx++;
        }

        // Fill remaining with mixed types
        while ($nilaiIdx < 30) {
            $p = $pendaftarans->random();
            $tipe = ['ujian_kp', 'pembimbing', 'instansi'][$nilaiIdx % 3];
            $komponen = match ($tipe) {
                'ujian_kp' => $komponenUjian[$nilaiIdx % 4],
                'pembimbing' => $komponenPembimbing[$nilaiIdx % 4],
                'instansi' => $komponenInstansi[$nilaiIdx % 4],
            };
            Nilai::create([
                'pendaftaran_id' => $p->id,
                'penilai_id' => $tipe === 'instansi' ? $instansiUsers->random()->id : $dosens->random()->id,
                'tipe' => $tipe,
                'komponen' => $komponen,
                'bobot' => 25.00,
                'nilai' => fake()->randomFloat(2, 60, 100),
            ]);
            $nilaiIdx++;
        }

        // ═══════════════════════════════════════════════════════════
        // 12. Nilai Akhirs (30 data — summary per pendaftaran)
        // ═══════════════════════════════════════════════════════════
        foreach ($pendaftarans as $p) {
            $nu = fake()->randomFloat(2, 60, 100);
            $np = fake()->randomFloat(2, 60, 100);
            $ni = fake()->randomFloat(2, 60, 100);
            $total = round(($nu * 0.4) + ($np * 0.3) + ($ni * 0.3), 2);

            $huruf = match (true) {
                $total >= 85 => 'A',
                $total >= 80 => 'B+',
                $total >= 75 => 'B',
                $total >= 70 => 'C+',
                $total >= 65 => 'C',
                $total >= 50 => 'D',
                default => 'E',
            };

            NilaiAkhir::create([
                'pendaftaran_id' => $p->id,
                'nilai_ujian' => $nu,
                'nilai_pembimbing' => $np,
                'nilai_instansi' => $ni,
                'nilai_total' => $total,
                'nilai_huruf' => $huruf,
                'status' => $total >= 65 ? 'lulus' : 'proses',
                'catatan' => fake()->optional(0.2)->sentence(),
            ]);
        }

        // ═══════════════════════════════════════════════════════════
        // 13. Kuota Dosens (30 data)
        // ═══════════════════════════════════════════════════════════
        $keahlianList = [
            'Artificial Intelligence', 'Machine Learning', 'Computer Vision',
            'Software Engineering', 'Data Mining', 'Cloud Computing',
            'Cyber Security', 'IoT', 'Database Systems', 'Mobile Development',
            'Web Development', 'Network Engineering', 'NLP', 'Robotics', 'Big Data',
        ];

        $periodes = ['2023/2024', '2024/2025', '2025/2026'];
        $kuotaIdx = 0;
        foreach ($dosens as $dosen) {
            foreach ($periodes as $periode) {
                if ($kuotaIdx >= 30) break 2;
                KuotaDosen::create([
                    'dosen_id' => $dosen->id,
                    'periode' => $periode,
                    'kuota_max' => fake()->randomElement([8, 10, 12, 15]),
                    'keahlian' => $keahlianList[$kuotaIdx % count($keahlianList)],
                ]);
                $kuotaIdx++;
            }
        }

        // ═══════════════════════════════════════════════════════════
        // 14. Dokumen Akhirs (30 data)
        // ═══════════════════════════════════════════════════════════
        $jenisDoc = ['laporan_akhir', 'lpj', 'sertifikat_nilai', 'transkrip_kp'];
        for ($i = 0; $i < 30; $i++) {
            $jenis = $jenisDoc[$i % 4];
            DokumenAkhir::create([
                'pendaftaran_id' => $pendaftarans[$i]->id,
                'jenis' => $jenis,
                'nama_file' => match ($jenis) {
                    'laporan_akhir' => 'Laporan_Akhir_KP_' . ($i + 1) . '.pdf',
                    'lpj' => 'LPJ_Kerja_Praktik_' . ($i + 1) . '.pdf',
                    'sertifikat_nilai' => 'Sertifikat_Nilai_KP_' . ($i + 1) . '.pdf',
                    'transkrip_kp' => 'Transkrip_KP_' . ($i + 1) . '.pdf',
                },
                'path' => 'dokumen/akhir/' . fake()->uuid() . '.pdf',
                'uploaded_at' => now()->subDays(fake()->numberBetween(1, 60)),
            ]);
        }

        // ═══════════════════════════════════════════════════════════
        // 15. Notifikasis (30 data)
        // ═══════════════════════════════════════════════════════════
        $allUsers = User::all();
        $notifTemplates = [
            ['judul' => 'Pendaftaran KP Berhasil', 'pesan' => 'Pendaftaran kerja praktik Anda telah berhasil disubmit.', 'tipe' => 'sukses'],
            ['judul' => 'Verifikasi Berkas Diperlukan', 'pesan' => 'Ada berkas pendaftaran baru yang memerlukan verifikasi.', 'tipe' => 'info'],
            ['judul' => 'Proposal Perlu Revisi', 'pesan' => 'Dosen pembimbing memberikan catatan revisi pada proposal Anda.', 'tipe' => 'peringatan'],
            ['judul' => 'Logbook Disetujui', 'pesan' => 'Logbook harian Anda telah disetujui oleh dosen pembimbing.', 'tipe' => 'sukses'],
            ['judul' => 'Surat Pengantar Terbit', 'pesan' => 'Surat pengantar KP Anda telah diterbitkan.', 'tipe' => 'sukses'],
            ['judul' => 'Deadline Logbook', 'pesan' => 'Anda belum mengisi logbook harian minggu ini.', 'tipe' => 'peringatan'],
            ['judul' => 'Plotting Dosen Berhasil', 'pesan' => 'Dosen pembimbing telah ditetapkan.', 'tipe' => 'info'],
            ['judul' => 'Nilai Akhir Tersedia', 'pesan' => 'Nilai akhir kerja praktik Anda telah dipublikasikan.', 'tipe' => 'sukses'],
            ['judul' => 'Berita Acara Ditolak', 'pesan' => 'Berita acara memerlukan perbaikan.', 'tipe' => 'error'],
            ['judul' => 'Kuota Bimbingan Penuh', 'pesan' => 'Kuota bimbingan telah mencapai batas maksimal.', 'tipe' => 'peringatan'],
        ];

        for ($i = 0; $i < 30; $i++) {
            $tmpl = $notifTemplates[$i % count($notifTemplates)];
            Notifikasi::create([
                'user_id' => $allUsers->random()->id,
                'judul' => $tmpl['judul'],
                'pesan' => $tmpl['pesan'],
                'tipe' => $tmpl['tipe'],
                'is_read' => fake()->boolean(40),
                'link' => null,
            ]);
        }
    }
}
