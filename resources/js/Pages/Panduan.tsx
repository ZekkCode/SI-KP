import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

import PdfViewerModal from '@/Components/PdfViewerModal';
import { 
    FileText, 
    Download, 
    BookOpen, 
    ExternalLink, 
    MapPin, 
    Phone, 
    Mail, 
    ArrowRight, 
    CheckCircle2, 
    Clock, 
    ShieldCheck, 
    GraduationCap, 
    Building2, 
    Award,
    HelpCircle,
    Info,
    FileCheck2,
    Search,
    Filter,
    Layers,
    FileDown,
    Table,
    LayoutGrid,
    FileSpreadsheet,
    Sparkles,
    UserCheck
} from 'lucide-react';

interface DocumentItem {
    title: string;
    category: string;
    badgeColor: string;
    description: string;
    filename: string;
    url: string;
    filesize: string;
}

const DOCUMENTS: DocumentItem[] = [
    {
        title: 'Buku Panduan Kerja Praktik',
        category: 'Pedoman Utama',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
        description: 'Pedoman alur, tata tertib, hak & kewajiban, serta petunjuk teknis penulisan laporan KP.',
        filename: 'buku_panduan_kp.pdf',
        url: '/dokumen/buku_panduan_kp.pdf',
        filesize: '1.3 MB',
    },
    {
        title: 'Template Proposal KP',
        category: 'Tahap Pengajuan',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        description: 'Format baku proposal pengajuan KP ke koordinator dan calon dosen pembimbing.',
        filename: 'template_proposal.pdf',
        url: '/dokumen/template_proposal.pdf',
        filesize: '704 KB',
    },
    {
        title: 'Template Berita Acara Seminar',
        category: 'Tahap Seminar',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        description: 'Formulir penilaian kelulusan seminar hasil dan lembar pengesahan penguji.',
        filename: 'template_berita_acara.pdf',
        url: '/dokumen/template_berita_acara.pdf',
        filesize: '581 KB',
    },
    {
        title: 'Bundel Lengkap Seluruh Lampiran (Form KP-1 s.d. KP-8)',
        category: 'Lampiran Lengkap',
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        description: 'Koleksi lengkap 21 format formulir resmi KP (Halaman 47 s.d. 68) dalam satu berkas PDF gabungan.',
        filename: 'lampiran_lengkap_buku_panduan_kp.pdf',
        url: '/dokumen/lampiran_lengkap_buku_panduan_kp.pdf',
        filesize: '2.5 MB',
    },
    {
        title: 'Referensi Laporan Akhir (Studi Kasus)',
        category: 'Format Laporan',
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
        description: 'Rujukan sistematika dan tata letak penulisan naskah laporan ilmiah akhir KP.',
        filename: 'Optimasi Model BiLSTM Berbasis FastText pada Data Augmentasi.pdf',
        url: '/dokumen/Optimasi%20Model%20BiLSTM%20Berbasis%20FastText%20pada%20Data%20Augmentasi.pdf',
        filesize: '783 KB',
    },
];

interface LampiranItem {
    id: string;
    kode: string;
    lampiranNo: number;
    title: string;
    category: 'Pengajuan' | 'Pelaksanaan' | 'Seminar & Nilai' | 'Format Naskah' | 'SOP';
    tahapAlur: string;
    kegunaan: string;
    pihak: string;
    desc: string;
    filename: string;
    url: string;
    filesize: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    highlight?: boolean;
}

const LAMPIRAN_ITEMS: LampiranItem[] = [
    {
        id: 'lampiran-1',
        kode: 'Form KP-1',
        lampiranNo: 1,
        title: 'Format Bidang Minat dan Usulan Judul (Form KP-1)',
        category: 'Pengajuan',
        tahapAlur: 'Tahap 1: Pengajuan & Pendaftaran',
        kegunaan: 'Menggantikan lembar pengajuan usulan judul manual. Digunakan mahasiswa untuk mengusulkan bidang minat (RPL, AI, Jaringan, Multimedia), 3 pilihan judul KP, dan data instansi mitra kepada Koordinator Program Studi.',
        pihak: 'Mahasiswa, Dosen Wali & Koordinator KP',
        desc: 'Formulir usulan bidang minat, 3 alternatif judul topik KP, dan identitas tempat magang untuk disetujui Dosen Wali & Koordinator KP.',
        filename: 'Lampiran_01_Format_Bidang_Minat_Usulan_Judul_Form_KP-1.pdf',
        url: '/dokumen/lampiran/Lampiran_01_Format_Bidang_Minat_Usulan_Judul_Form_KP-1.pdf',
        filesize: '314 KB',
        badgeBg: 'bg-blue-50',
        badgeText: 'text-[#00288e]',
        badgeBorder: 'border-blue-200',
        highlight: true,
    },
    {
        id: 'lampiran-2',
        kode: 'Form KP-2',
        lampiranNo: 2,
        title: 'Format Kesediaan Menerima Kerja Praktik (Form KP-2)',
        category: 'Pengajuan',
        tahapAlur: 'Tahap 1: Pendaftaran & Konfirmasi Mitra',
        kegunaan: 'Menggantikan surat konfirmasi manual dari mitra instansi. Bukti legal kesediaan pimpinan lembaga/perusahaan menerima mahasiswa melaksanakan magang KP selama periode waktu yang ditentukan.',
        pihak: 'Pimpinan / HRD Instansi Mitra & Mahasiswa',
        desc: 'Formulir persetujuan dan kesediaan dari pimpinan perusahaan/instansi mitra untuk menerima mahasiswa kerja praktik.',
        filename: 'Lampiran_02_Kesediaan_Menerima_KP_Form_KP-2.pdf',
        url: '/dokumen/lampiran/Lampiran_02_Kesediaan_Menerima_KP_Form_KP-2.pdf',
        filesize: '247 KB',
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200',
        highlight: true,
    },
    {
        id: 'lampiran-3',
        kode: 'Logbook',
        lampiranNo: 3,
        title: 'Format Rekap Absensi Harian KP (Logbook)',
        category: 'Pelaksanaan',
        tahapAlur: 'Tahap 2: Pelaksanaan & Monitoring Lapangan',
        kegunaan: 'Menggantikan lembar presensi manual di lapangan. Merekam absensi hadir fisik harian dan uraian pekerjaan mahasiswa di lokasi mitra selama minimal 1 s.d. 2 bulan sebagai bukti keabsahan pelaksanaan kerja praktik.',
        pihak: 'Mahasiswa & Pembimbing Lapangan (Paraf/Stempel)',
        desc: 'Lembar rekapitulasi daftar hadir harian dan ringkasan aktivitas kerja mahasiswa selama berada di tempat magang.',
        filename: 'Lampiran_03_Format_Absensi_Harian_Logbook.pdf',
        url: '/dokumen/lampiran/Lampiran_03_Format_Absensi_Harian_Logbook.pdf',
        filesize: '120 KB',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200',
    },
    {
        id: 'lampiran-4',
        kode: 'Form KP-3a',
        lampiranNo: 4,
        title: 'Format Lembar Konsultasi Dosen Pembimbing (Form KP-3a)',
        category: 'Pelaksanaan',
        tahapAlur: 'Tahap 2: Bimbingan Akademik Kampus',
        kegunaan: 'Menggantikan kartu kendali bimbingan fisik. Bukti asistensi materi laporan dan penugasan berkala bersama Dosen Pembimbing KP (wajib minimal 4 s.d. 8 kali bimbingan sebagai syarat maju seminar).',
        pihak: 'Mahasiswa & Dosen Pembimbing KP',
        desc: 'Kartu kendali asistensi, bimbingan berkala, dan verifikasi progres kegiatan bersama Dosen Pembimbing KP.',
        filename: 'Lampiran_04_Lembar_Konsultasi_Dosen_Pembimbing_Form_KP-3a.pdf',
        url: '/dokumen/lampiran/Lampiran_04_Lembar_Konsultasi_Dosen_Pembimbing_Form_KP-3a.pdf',
        filesize: '352 KB',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200',
    },
    {
        id: 'lampiran-5',
        kode: 'Form KP-3b',
        lampiranNo: 5,
        title: 'Format Lembar Konsultasi Pembimbing Lapangan (Form KP-3b)',
        category: 'Pelaksanaan',
        tahapAlur: 'Tahap 2: Supervisi Mitra Industri',
        kegunaan: 'Menggantikan lembar supervisi industri manual. Bukti konsultasi teknis, pengarahan operasional tugas, dan evaluasi berkala oleh pembimbing di tempat magang.',
        pihak: 'Mahasiswa & Pembimbing Lapangan Mitra',
        desc: 'Kartu kendali catatan pengarahan teknis operasional dan monitoring harian bersama Pembimbing Lapangan di instansi mitra.',
        filename: 'Lampiran_05_Lembar_Konsultasi_Pembimbing_Lapangan_Form_KP-3b.pdf',
        url: '/dokumen/lampiran/Lampiran_05_Lembar_Konsultasi_Pembimbing_Lapangan_Form_KP-3b.pdf',
        filesize: '352 KB',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200',
    },
    {
        id: 'lampiran-6',
        kode: 'Form KP-8',
        lampiranNo: 6,
        title: 'Format Lembar Persetujuan Seminar KP (Form KP-8)',
        category: 'Seminar & Nilai',
        tahapAlur: 'Tahap 3: Pendaftaran Ujian / Seminar KP',
        kegunaan: 'Menggantikan lembar persetujuan ujian (ACC Seminar). Dokumen persetujuan resmi bahwa naskah laporan KP telah siap diujikan di hadapan dewan penguji seminar.',
        pihak: 'Dosen Pembimbing KP & Pembimbing Lapangan',
        desc: 'Lembar persetujuan (ACC Ujian) dari Dosen Pembimbing dan Pembimbing Lapangan untuk mendaftar seminar hasil KP.',
        filename: 'Lampiran_06_Lembar_Persetujuan_Seminar_KP_Form_KP-8.pdf',
        url: '/dokumen/lampiran/Lampiran_06_Lembar_Persetujuan_Seminar_KP_Form_KP-8.pdf',
        filesize: '228 KB',
        badgeBg: 'bg-indigo-50',
        badgeText: 'text-indigo-700',
        badgeBorder: 'border-indigo-200',
        highlight: true,
    },
    {
        id: 'lampiran-7',
        kode: 'Form KP-6a',
        lampiranNo: 7,
        title: 'Formulir Penilaian KP dari Pembimbing Lapangan (Form KP-6a)',
        category: 'Seminar & Nilai',
        tahapAlur: 'Tahap 3: Penilaian Kinerja Industri',
        kegunaan: 'Menggantikan blanko nilai lapangan. Formulir evaluasi kinerja mahasiswa di instansi (kedisiplinan, komunikasi, inisiatif, etos kerja, dan capaian proyek) yang wajib diunggah sebelum sidang.',
        pihak: 'Pembimbing Lapangan & Stempel Resmi Mitra',
        desc: 'Lembar instrumen penilaian kinerja lapangan (kedisiplinan, tanggung jawab, inisiatif, dan capaian) oleh mitra instansi.',
        filename: 'Lampiran_07_Penilaian_Pembimbing_Lapangan_Form_KP-6a.pdf',
        url: '/dokumen/lampiran/Lampiran_07_Penilaian_Pembimbing_Lapangan_Form_KP-6a.pdf',
        filesize: '303 KB',
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-200',
        highlight: true,
    },
    {
        id: 'lampiran-8',
        kode: 'Form KP-4a',
        lampiranNo: 8,
        title: 'Format Lembar Revisi Seminar Dosen Penguji 1 (Form KP-4a)',
        category: 'Seminar & Nilai',
        tahapAlur: 'Tahap 3: Pasca Seminar & Revisi Laporan',
        kegunaan: 'Menggantikan lembar catatan koreksi manual. Berisi daftar revisi materi laporan dari Dosen Penguji 1 yang wajib diselesaikan mahasiswa maksimal 2 minggu pasca seminar.',
        pihak: 'Dosen Penguji 1 & Mahasiswa',
        desc: 'Lembar catatan koreksi dan perbaikan naskah laporan hasil kerja praktik dari Dosen Penguji 1.',
        filename: 'Lampiran_08_Lembar_Revisi_Dosen_Penguji_1_Form_KP-4a.pdf',
        url: '/dokumen/lampiran/Lampiran_08_Lembar_Revisi_Dosen_Penguji_1_Form_KP-4a.pdf',
        filesize: '245 KB',
        badgeBg: 'bg-indigo-50',
        badgeText: 'text-indigo-700',
        badgeBorder: 'border-indigo-200',
    },
    {
        id: 'lampiran-9',
        kode: 'Form KP-4b',
        lampiranNo: 9,
        title: 'Format Lembar Revisi Seminar Dosen Penguji 2 (Form KP-4b)',
        category: 'Seminar & Nilai',
        tahapAlur: 'Tahap 3: Pasca Seminar & Revisi Laporan',
        kegunaan: 'Menggantikan lembar catatan koreksi manual. Berisi daftar revisi materi laporan dari Dosen Penguji 2 yang wajib diselesaikan mahasiswa sebelum pengesahan naskah final.',
        pihak: 'Dosen Penguji 2 & Mahasiswa',
        desc: 'Lembar catatan koreksi dan perbaikan naskah laporan hasil kerja praktik dari Dosen Penguji 2.',
        filename: 'Lampiran_09_Lembar_Revisi_Dosen_Penguji_2_Form_KP-4b.pdf',
        url: '/dokumen/lampiran/Lampiran_09_Lembar_Revisi_Dosen_Penguji_2_Form_KP-4b.pdf',
        filesize: '292 KB',
        badgeBg: 'bg-indigo-50',
        badgeText: 'text-indigo-700',
        badgeBorder: 'border-indigo-200',
    },
    {
        id: 'lampiran-10',
        kode: 'Form KP-5',
        lampiranNo: 10,
        title: 'Format Berita Acara Ujian Kerja Praktik (Form KP-5)',
        category: 'Seminar & Nilai',
        tahapAlur: 'Tahap 3: Ujian Seminar & Berita Acara',
        kegunaan: 'Menggantikan berkas Berita Acara Ujian fisik. Dokumen resmi pelaksanaan seminar KP bertandatangan dewan penguji dan koordinator yang mencatat nilai akhir serta status kelulusan mahasiswa.',
        pihak: 'Dewan Penguji (Penguji 1 & 2) & Koordinator KP',
        desc: 'Berita acara resmi pelaksanaan pengujian seminar kerja praktik bertandatangan dewan penguji dan koordinator.',
        filename: 'Lampiran_10_Berita_Acara_Ujian_KP_Form_KP-5.pdf',
        url: '/dokumen/lampiran/Lampiran_10_Berita_Acara_Ujian_KP_Form_KP-5.pdf',
        filesize: '268 KB',
        badgeBg: 'bg-indigo-50',
        badgeText: 'text-indigo-700',
        badgeBorder: 'border-indigo-200',
        highlight: true,
    },
    {
        id: 'lampiran-11',
        kode: 'Form KP-6b',
        lampiranNo: 11,
        title: 'Formulir Penilaian KP Dosen Penguji & Pembimbing (Form KP-6b)',
        category: 'Seminar & Nilai',
        tahapAlur: 'Tahap 3: Rekapitulasi Nilai Akhir Kampus',
        kegunaan: 'Menggantikan lembar rekap nilai manual. Berisi rubrik penilaian seminar (presentasi, tanya jawab naskah, dan penguasaan materi) yang digabungkan dengan nilai bimbingan.',
        pihak: 'Dosen Pembimbing & Dosen Penguji',
        desc: 'Formulir instrumen penilaian komprehensif pengujian seminar laporan dan bimbingan akademik dosen.',
        filename: 'Lampiran_11_Penilaian_Penguji_dan_Pembimbing_Form_KP-6b.pdf',
        url: '/dokumen/lampiran/Lampiran_11_Penilaian_Penguji_dan_Pembimbing_Form_KP-6b.pdf',
        filesize: '302 KB',
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-200',
    },
    {
        id: 'lampiran-12',
        kode: 'Form KP-7',
        lampiranNo: 12,
        title: 'Formulir Tanda Terima Laporan KP (Form KP-7)',
        category: 'Format Naskah',
        tahapAlur: 'Tahap 4: Yudisium & Penyerahan Berkas',
        kegunaan: 'Menggantikan tanda terima perpustakaan/prodi. Bukti sah bahwa mahasiswa telah menyerahkan hardcopy laporan akhir yang telah dijilid rapi serta softcopy kepada Koordinator Prodi, Perpustakaan, dan Instansi.',
        pihak: 'Mahasiswa, Staf TU / Perpus, & Koordinator KP',
        desc: 'Bukti tanda terima penyerahan naskah laporan final kerja praktik yang telah dijilid dan disahkan.',
        filename: 'Lampiran_12_Tanda_Terima_Laporan_KP_Form_KP-7.pdf',
        url: '/dokumen/lampiran/Lampiran_12_Tanda_Terima_Laporan_KP_Form_KP-7.pdf',
        filesize: '235 KB',
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200',
        highlight: true,
    },
    {
        id: 'lampiran-13',
        kode: 'Sampul Proposal',
        lampiranNo: 13,
        title: 'Format Halaman Sampul Proposal KP',
        category: 'Format Naskah',
        tahapAlur: 'Tahap 1: Pengajuan & Proposal KP',
        kegunaan: 'Format baku tata letak cover muka luar proposal pengajuan KP sesuai standar tipografi resmi Universitas Trunojoyo Madura (logo, judul, NIM, prodi, dan tahun akademik).',
        pihak: 'Mahasiswa',
        desc: 'Format baku tata letak halaman sampul depan (cover) proposal pengajuan Kerja Praktik.',
        filename: 'Lampiran_13_Sampul_Proposal_KP.pdf',
        url: '/dokumen/lampiran/Lampiran_13_Sampul_Proposal_KP.pdf',
        filesize: '60 KB',
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-200',
    },
    {
        id: 'lampiran-14',
        kode: 'Pengesahan Proposal',
        lampiranNo: 14,
        title: 'Format Halaman Pengesahan Proposal KP',
        category: 'Format Naskah',
        tahapAlur: 'Tahap 1: Pengajuan & Proposal KP',
        kegunaan: 'Lembar legalitas pengesahan naskah proposal KP yang ditandatangani oleh Calon Dosen Pembimbing dan disetujui Koordinator Program Studi Teknik Informatika sebelum diajukan ke instansi.',
        pihak: 'Calon Dosen Pembimbing & Koordinator KP',
        desc: 'Lembar pengesahan naskah proposal KP oleh Dosen Pembimbing dan Koordinator Program Studi.',
        filename: 'Lampiran_14_Pengesahan_Proposal_KP.pdf',
        url: '/dokumen/lampiran/Lampiran_14_Pengesahan_Proposal_KP.pdf',
        filesize: '62 KB',
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-200',
    },
    {
        id: 'lampiran-15',
        kode: 'Jadwal KP',
        lampiranNo: 15,
        title: 'Format Rencana Jadwal Pelaksanaan KP',
        category: 'Format Naskah',
        tahapAlur: 'Tahap 1: Proposal & Rencana Kegiatan',
        kegunaan: 'Format matriks jadwal kerja (Gantt Chart mingguan) yang memuat rincian aktivitas mulai dari studi literatur, analisis, perancangan, implementasi, hingga penulisan laporan akhir.',
        pihak: 'Mahasiswa & Pembimbing Lapangan',
        desc: 'Tabel timeline dan time-schedule / Gantt Chart rencana tahapan kegiatan kerja praktik per minggu.',
        filename: 'Lampiran_15_Rencana_Jadwal_Pelaksanaan_KP.pdf',
        url: '/dokumen/lampiran/Lampiran_15_Rencana_Jadwal_Pelaksanaan_KP.pdf',
        filesize: '54 KB',
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-200',
    },
    {
        id: 'lampiran-16',
        kode: 'Sampul Laporan',
        lampiranNo: 16,
        title: 'Format Halaman Sampul Laporan Akhir KP',
        category: 'Format Naskah',
        tahapAlur: 'Tahap 4: Penyusunan Laporan Akhir',
        kegunaan: 'Format baku sampul jilid laporan akhir (softcover/hardcover warna biru UTM) dengan format tipografi, tata letak logo kampus, judul karya, dan identitas mahasiswa yang baku.',
        pihak: 'Mahasiswa',
        desc: 'Tata letak baku sampul depan laporan akhir kerja praktik (warna cover, font, dan identitas kampus).',
        filename: 'Lampiran_16_Sampul_Laporan_Akhir_KP.pdf',
        url: '/dokumen/lampiran/Lampiran_16_Sampul_Laporan_Akhir_KP.pdf',
        filesize: '60 KB',
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200',
        highlight: true,
    },
    {
        id: 'lampiran-17',
        kode: 'Pengesahan Laporan',
        lampiranNo: 17,
        title: 'Format Halaman Pengesahan Laporan Akhir KP',
        category: 'Format Naskah',
        tahapAlur: 'Tahap 4: Pengesahan Laporan Akhir (Prodi)',
        kegunaan: 'Halaman pengesahan utama laporan akhir kerja praktik yang wajib disisipkan di dalam naskah final, ditandatangani Dosen Pembimbing dan disetujui Koordinator Program Studi.',
        pihak: 'Dosen Pembimbing & Koordinator KP',
        desc: 'Lembar pengesahan resmi laporan akhir bertandatangan Dosen Pembimbing, Penguji, dan Koordinator.',
        filename: 'Lampiran_17_Pengesahan_Laporan_Akhir_KP.pdf',
        url: '/dokumen/lampiran/Lampiran_17_Pengesahan_Laporan_Akhir_KP.pdf',
        filesize: '63 KB',
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200',
        highlight: true,
    },
    {
        id: 'lampiran-18',
        kode: 'Pengesahan Seminar',
        lampiranNo: 18,
        title: 'Format Halaman Pengesahan Seminar KP',
        category: 'Format Naskah',
        tahapAlur: 'Tahap 4: Pengesahan Seminar Laporan',
        kegunaan: 'Lembar pengesahan dewan penguji seminar yang menyatakan bahwa mahasiswa telah berhasil mempertahankan laporan hasil KP pada seminar dan telah menuntaskan seluruh revisi penguji.',
        pihak: 'Dosen Penguji 1 & Dosen Penguji 2',
        desc: 'Lembar pengesahan bahwa mahasiswa telah melaksanakan seminar hasil kerja praktik di depan penguji.',
        filename: 'Lampiran_18_Pengesahan_Seminar_KP.pdf',
        url: '/dokumen/lampiran/Lampiran_18_Pengesahan_Seminar_KP.pdf',
        filesize: '65 KB',
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200',
    },
    {
        id: 'lampiran-19',
        kode: 'Pengesahan Instansi',
        lampiranNo: 19,
        title: 'Format Halaman Pengesahan Perusahaan / Instansi Mitra',
        category: 'Format Naskah',
        tahapAlur: 'Tahap 4: Pengesahan Pihak Industri/Mitra',
        kegunaan: 'Lembar pengesahan laporan akhir dari pihak instansi mitra tempat pelaksanaan kerja praktik, ditandatangani oleh Pembimbing Lapangan dan diketahui pimpinan lembaga/perusahaan lengkap dengan cap stempel instansi.',
        pihak: 'Pembimbing Lapangan & Pimpinan Instansi Mitra',
        desc: 'Lembar pengesahan laporan akhir bertandatangan Pembimbing Lapangan dan dicap resmi perusahaan.',
        filename: 'Lampiran_19_Pengesahan_Instansi_Perusahaan_KP.pdf',
        url: '/dokumen/lampiran/Lampiran_19_Pengesahan_Instansi_Perusahaan_KP.pdf',
        filesize: '61 KB',
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200',
        highlight: true,
    },
    {
        id: 'lampiran-20',
        kode: 'Daftar Relasi',
        lampiranNo: 20,
        title: 'Format Daftar Relasi Kerja Praktik',
        category: 'Format Naskah',
        tahapAlur: 'Tahap 4: Dokumentasi Jejaring Industri',
        kegunaan: 'Format lembar rekapitulasi kontak, data pimpinan instansi, struktur unit divisi tempat magang, dan narahubung teknis untuk dokumentasi kemitraan program studi Teknik Informatika UTM.',
        pihak: 'Mahasiswa & Instansi Mitra',
        desc: 'Format tabel dokumentasi relasi dan jejaring kerja institusi yang diperoleh selama kerja praktik.',
        filename: 'Lampiran_20_Daftar_Relasi_Kerja_Praktik.pdf',
        url: '/dokumen/lampiran/Lampiran_20_Daftar_Relasi_Kerja_Praktik.pdf',
        filesize: '64 KB',
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200',
    },
    {
        id: 'lampiran-21',
        kode: 'SOP Pelaksanaan',
        lampiranNo: 21,
        title: 'Standar Operasional Prosedur (SOP) Kerja Praktik',
        category: 'SOP',
        tahapAlur: 'Pedoman Regulasi & Tata Tertib',
        kegunaan: 'Bagan alur resmi dan pedoman operasional seluruh tahapan kerja praktik mulai dari prasyarat pendaftaran, verifikasi TU, pengajuan proposal, pelaksanaan magang, seminar, hingga yudisium kelulusan.',
        pihak: 'Mahasiswa, Dosen, Koordinator KP & Tata Usaha',
        desc: 'Diagram alir dan prosedur operasional standar tahapan pendaftaran, bimbingan, hingga kelulusan KP.',
        filename: 'Lampiran_21_SOP_Standar_Operasional_Prosedur_KP.pdf',
        url: '/dokumen/lampiran/Lampiran_21_SOP_Standar_Operasional_Prosedur_KP.pdf',
        filesize: '98 KB',
        badgeBg: 'bg-slate-50',
        badgeText: 'text-slate-800',
        badgeBorder: 'border-slate-300',
        highlight: true,
    },
];

const STAGES = [
    {
        step: '01',
        title: 'Pengajuan & Berkas',
        desc: 'Syarat min. 80 SKS, pilih instansi mitra, dan unggah proposal.',
        icon: FileText,
    },
    {
        step: '02',
        title: 'Plotting Pembimbing',
        desc: 'Verifikasi berkas dan penetapan dosen pembimbing oleh koordinator.',
        icon: ShieldCheck,
    },
    {
        step: '03',
        title: 'Magang & Logbook',
        desc: 'Aktivitas magang di mitra, pengisian logbook harian, dan bimbingan.',
        icon: Clock,
    },
    {
        step: '04',
        title: 'Laporan & Nilai Lapangan',
        desc: 'Penyusunan laporan akhir dan penilaian kerja oleh pembimbing mitra.',
        icon: FileCheck2,
    },
    {
        step: '05',
        title: 'Seminar & Kelulusan',
        desc: 'Pendaftaran ujian, presentasi seminar, dan pengesahan nilai akhir.',
        icon: Award,
    },
];

export default function Panduan() {
    const { props } = usePage();
    const campus = (props as any)?.campus;
    const campusAddress = campus?.address || 'Jl. Raya Telang, PO BOX 2 Kamal, Bangkalan';
    const campusPhone = campus?.phone || '031-3011147';
    const campusEmail = campus?.email || 'tif@trunojoyo.ac.id';
    const cleanPhone = campusPhone.replace(/[^0-9]/g, '');

    const [selectedPdf, setSelectedPdf] = useState<{ url: string; title: string } | null>(null);
    const [lampiranCategory, setLampiranCategory] = useState<string>('Semua');
    const [lampiranSearch, setLampiranSearch] = useState<string>('');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const categories = ['Semua', 'Pengajuan', 'Pelaksanaan', 'Seminar & Nilai', 'Format Naskah', 'SOP'];

    const filteredLampiran = LAMPIRAN_ITEMS.filter((item) => {
        const matchesCat = lampiranCategory === 'Semua' || item.category === lampiranCategory;
        const query = lampiranSearch.toLowerCase().trim();
        const matchesSearch = !query || 
            item.title.toLowerCase().includes(query) ||
            item.kode.toLowerCase().includes(query) ||
            item.desc.toLowerCase().includes(query) ||
            item.kegunaan.toLowerCase().includes(query) ||
            item.tahapAlur.toLowerCase().includes(query) ||
            item.pihak.toLowerCase().includes(query);
        return matchesCat && matchesSearch;
    });

    return (
        <>
            <Head title="Panduan & Berkas Resmi Kerja Praktik - SI-KP UTM" />

            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
                
                {/* ======================================================== */}
                {/* 1. TOP CONTACT BAR                                       */}
                {/* ======================================================== */}
                <header className="bg-white border-b border-slate-200 py-1.5 text-xs text-slate-600 hidden sm:block">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-y-1">
                        <div className="flex items-center gap-6">
                            <a 
                                href="https://maps.google.com/?q=Universitas+Trunojoyo+Madura" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-[#00288e] transition cursor-pointer"
                                title="Buka Lokasi Kampus UTM di Google Maps"
                            >
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{campusAddress}</span>
                            </a>
                            <a 
                                href={`tel:${cleanPhone}`} 
                                className="flex items-center gap-1.5 hover:text-[#00288e] transition cursor-pointer"
                                title={`Hubungi Telepon Kampus: ${campusPhone}`}
                            >
                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{campusPhone}</span>
                            </a>
                            <a 
                                href={`mailto:${campusEmail}`} 
                                className="flex items-center gap-1.5 hover:text-[#00288e] transition cursor-pointer"
                                title={`Kirim Email ke ${campusEmail}`}
                            >
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{campusEmail}</span>
                            </a>
                        </div>

                        <div className="flex items-center gap-4 text-slate-500 font-medium">
                            <a 
                                href="https://trunojoyo.ac.id" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-[#00288e] transition cursor-pointer"
                                title="Portal Resmi Universitas Trunojoyo Madura"
                            >
                                <span>SI-KP TEKNIK INFORMATIKA &bull; UNIVERSITAS TRUNOJOYO MADURA</span>
                            </a>
                        </div>
                    </div>
                </header>

                {/* ======================================================== */}
                {/* 2. NAVBAR (Logo UTM + Logo Prodi Tekfor, Responsive)      */}
                {/* ======================================================== */}
                <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40 shadow-xs">
                    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-13 sm:h-15 flex items-center justify-between gap-2">
                        {/* Brand: Logo UTM + Logo Tekfor (Fluid min-w-0 flex-1) */}
                        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0 flex-1">
                            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                                <img 
                                    src="/images/Logo UTM terbaru_berwarna (1).png" 
                                    alt="Logo UTM" 
                                    className="h-7 sm:h-9 w-auto object-contain" 
                                />
                                <img 
                                    src="/images/tekfor-logo.png" 
                                    alt="Logo Teknik Informatika" 
                                    className="h-6 sm:h-8 w-auto object-contain" 
                                />
                            </div>
                            <div className="border-l border-slate-200 pl-2 sm:pl-2.5 min-w-0">
                                <div className="text-xs sm:text-sm font-bold text-[#00288e] tracking-tight leading-tight truncate">
                                    SI-KP TEKNIK INFORMATIKA
                                </div>
                                <div className="text-[10px] sm:text-xs font-medium text-slate-500 leading-tight truncate">
                                    Universitas Trunojoyo Madura
                                </div>
                            </div>
                        </Link>

                        <div className="flex items-center gap-2 shrink-0">
                            <Link 
                                href="/login" 
                                className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 bg-[#00288e] hover:bg-[#001f70] text-white text-xs font-semibold rounded-lg transition cursor-pointer shadow-xs"
                                title="Masuk Portal"
                                aria-label="Masuk Portal"
                            >
                                <span className="hidden sm:inline">Masuk Portal</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* ======================================================== */}
                {/* 3. HERO SECTION                                          */}
                {/* ======================================================== */}
                <header className="bg-white border-b border-slate-200 py-10 sm:py-14">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl space-y-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#00288e] bg-blue-50 border border-blue-200 px-3 py-1 rounded-md">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Panduan Resmi</span>
                            </span>
                            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                                Pedoman & Berkas Resmi KP
                            </h1>
                            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                                Alur pelaksanaan dan template berkas akademik Kerja Praktik Teknik Informatika UTM.
                            </p>
                        </div>
                    </div>
                </header>

                {/* ======================================================== */}
                {/* 4. MAIN CONTENT                                          */}
                {/* ======================================================== */}
                <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 flex-1">
                    
                    {/* SECTION 1: DOWNLOAD DOKUMEN RESMI */}
                    <section className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Dokumen & Template Resmi
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Unduh formulir dan pedoman teknis pelaksanaan KP.
                                </p>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">
                                4 Dokumen Tersedia
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {DOCUMENTS.map((doc, idx) => (
                                <div 
                                    key={idx}
                                    className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2.5 py-0.5 text-[11px] font-semibold border rounded-md ${doc.badgeColor}`}>
                                                {doc.category}
                                            </span>
                                            <span className="text-xs font-medium text-slate-400">
                                                {doc.filesize}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                                                {doc.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                                {doc.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                                        <div className="text-[11px] font-medium text-slate-400 truncate max-w-[200px]">
                                            {doc.filename}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                type="button"
                                                onClick={() => setSelectedPdf({ url: doc.url, title: doc.title })}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer shadow-xs"
                                                title="Lihat Pratinjau Dokumen di Browser"
                                            >
                                                <span>Pratinjau PDF</span>
                                                <ExternalLink className="w-3 h-3 text-slate-400" />
                                            </button>
                                            <a 
                                                href={doc.url} 
                                                download
                                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#00288e] hover:bg-[#001f70] rounded-lg transition shadow-xs"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                <span>Unduh PDF</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 1.5: FORMULIR & LAMPIRAN RESMI BUKU PANDUAN (FORM KP-1 s.d. KP-8) */}
                    <section id="lampiran-section" className="space-y-6 pt-2">
                        {/* Section Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-[#00288e] border border-blue-200 uppercase tracking-wider mb-1.5">
                                    <Layers className="w-3.5 h-3.5" />
                                    Daftar Lengkap Lampiran & Formulir Resmi (21 Berkas)
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                    Katalog Formulir & Dokumen Pengganti KP
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                                    Daftar seluruh formulir resmi (Form KP-1 s.d. KP-8, format sampul, pengesahan, dan SOP) yang diekstrak dari Buku Panduan Kerja Praktik Teknik Informatika UTM untuk melengkapi dan menggantikan berkas pada setiap tahapan.
                                </p>
                            </div>

                            <a
                                href="/dokumen/lampiran_lengkap_buku_panduan_kp.pdf"
                                download
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#00288e] hover:bg-[#001f70] text-white rounded-lg text-xs font-semibold shadow-xs transition shrink-0"
                                title="Unduh seluruh 21 halaman lampiran dalam satu file PDF"
                            >
                                <FileDown className="w-4 h-4" />
                                <span>Unduh Bundel 21 Lampiran (2.5 MB)</span>
                            </a>
                        </div>

                        {/* Petunjuk Penggunaan Berkas / Replace Dokumen Callout */}
                        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 sm:p-5 text-slate-800 space-y-2">
                            <div className="flex items-center gap-2 text-[#00288e] font-bold text-xs sm:text-sm">
                                <Sparkles className="w-4 h-4 shrink-0" />
                                <span>Petunjuk Penggunaan Berkas & Formulir Pengganti (Replace Requirement)</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Setiap formulir resmi di bawah ini berfungsi untuk <strong>menggantikan atau melengkapi dokumen fisik/digital</strong> yang dibutuhkan mahasiswa pada tiap tahapan Kerja Praktik (Pendaftaran Judul, Monitoring Lapangan, Pendaftaran Ujian Seminar, dan Penyerahan Laporan Akhir). Anda dapat mengunduh formulir secara satuan sesuai tahapan yang sedang ditempuh, mencetaknya untuk ditandatangani pihak terkait, kemudian mengunggahnya kembali ke portal SI-KP.
                            </p>
                        </div>

                        {/* Search, Filter Controls & View Switcher */}
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                            {/* Category Filter Pills */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none flex-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setLampiranCategory(cat)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                                            lampiranCategory === cat
                                                ? 'bg-[#00288e] text-white shadow-xs'
                                                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                                        }`}
                                    >
                                        {cat}
                                        {cat === 'Semua' ? ` (${LAMPIRAN_ITEMS.length})` : ''}
                                    </button>
                                ))}
                            </div>

                            {/* View Switcher & Search Input */}
                            <div className="flex items-center gap-2 shrink-0">
                                {/* Mode View Toggle: Table vs Grid */}
                                <div className="inline-flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('table')}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                                            viewMode === 'table'
                                                ? 'bg-white text-[#00288e] shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                        title="Tampilan Tabel Matriks (Lengkap dengan Kegunaan)"
                                    >
                                        <Table className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Tabel Matriks</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('grid')}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                                            viewMode === 'grid'
                                                ? 'bg-white text-[#00288e] shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                        title="Tampilan Kartu Grid"
                                    >
                                        <LayoutGrid className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Kartu</span>
                                    </button>
                                </div>

                                {/* Search Input */}
                                <div className="relative w-full sm:w-60">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={lampiranSearch}
                                        onChange={(e) => setLampiranSearch(e.target.value)}
                                        placeholder="Cari form, guna, tahap..."
                                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Lampiran List View (Table vs Grid) */}
                        {filteredLampiran.length > 0 ? (
                            viewMode === 'table' ? (
                                /* ================= TABLE VIEW ================= */
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                                                    <th className="py-3 px-4 w-12 text-center">No</th>
                                                    <th className="py-3 px-4 w-32">Kode Form</th>
                                                    <th className="py-3 px-4 min-w-[220px]">Nama Formulir & Dokumen</th>
                                                    <th className="py-3 px-4 min-w-[170px]">Tahapan Alur KP</th>
                                                    <th className="py-3 px-4 min-w-[300px]">Fungsi / Replace Dokumen Yang Dibutuhkan</th>
                                                    <th className="py-3 px-4 min-w-[180px]">Penandatangan</th>
                                                    <th className="py-3 px-4 w-44 text-center">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {filteredLampiran.map((item) => (
                                                    <tr 
                                                        key={item.id}
                                                        className={`hover:bg-slate-50/70 transition-colors ${
                                                            item.highlight ? 'bg-blue-50/30' : ''
                                                        }`}
                                                    >
                                                        {/* No */}
                                                        <td className="py-3 px-4 text-center font-bold text-slate-400">
                                                            {String(item.lampiranNo).padStart(2, '0')}
                                                        </td>

                                                        {/* Kode Form */}
                                                        <td className="py-3 px-4">
                                                            <div className="flex flex-col gap-1 items-start">
                                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${item.badgeBg} ${item.badgeBorder} ${item.badgeText}`}>
                                                                    {item.kode}
                                                                </span>
                                                                <span className="text-[10px] text-slate-400 font-medium">
                                                                    {item.filesize}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* Nama Formulir */}
                                                        <td className="py-3 px-4">
                                                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                                                                {item.title}
                                                            </div>
                                                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                                                                {item.desc}
                                                            </p>
                                                        </td>

                                                        {/* Tahapan Alur */}
                                                        <td className="py-3 px-4">
                                                            <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                                                                {item.tahapAlur}
                                                            </span>
                                                        </td>

                                                        {/* Guna / Replace Dokumen Yang Dibutuhkan */}
                                                        <td className="py-3 px-4">
                                                            <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-lg p-2.5 text-[11px] text-emerald-950 leading-relaxed">
                                                                <strong className="text-emerald-800 font-bold block mb-0.5">
                                                                    Guna / Pengganti Berkas:
                                                                </strong>
                                                                {item.kegunaan}
                                                            </div>
                                                        </td>

                                                        {/* Penandatangan */}
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                                                                <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                                <span>{item.pihak}</span>
                                                            </div>
                                                        </td>

                                                        {/* Aksi */}
                                                        <td className="py-3 px-4 text-center">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSelectedPdf({ url: item.url, title: item.title })}
                                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition cursor-pointer"
                                                                    title="Pratinjau Dokumen di Modal"
                                                                >
                                                                    <span>Pratinjau</span>
                                                                    <ExternalLink className="w-3 h-3 text-slate-400" />
                                                                </button>
                                                                <a
                                                                    href={item.url}
                                                                    download
                                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-white bg-[#00288e] hover:bg-[#001f70] rounded-md transition shadow-2xs"
                                                                    title="Unduh Formulir PDF"
                                                                >
                                                                    <Download className="w-3 h-3" />
                                                                    <span>Unduh</span>
                                                                </a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                /* ================= GRID CARDS VIEW ================= */
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredLampiran.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`bg-white border rounded-xl p-4.5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md ${
                                                item.highlight
                                                    ? 'border-[#00288e]/40 ring-1 ring-blue-500/20'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="space-y-3">
                                                {/* Top Badges */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${item.badgeBg} ${item.badgeBorder} ${item.badgeText}`}>
                                                            {item.kode}
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-slate-400">
                                                            Lampiran {item.lampiranNo}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] font-medium text-slate-400">
                                                        {item.filesize}
                                                    </span>
                                                </div>

                                                {/* Title & Tahap */}
                                                <div>
                                                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
                                                        {item.tahapAlur}
                                                    </span>
                                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                                                        {item.title}
                                                    </h4>
                                                </div>

                                                {/* Guna Dokumen Callout Box */}
                                                <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-lg p-2.5">
                                                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                                                        Guna / Replace Dokumen:
                                                    </span>
                                                    <p className="text-[11px] text-emerald-950 leading-relaxed">
                                                        {item.kegunaan}
                                                    </p>
                                                </div>

                                                {/* Pihak Terlibat */}
                                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                                                    <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <span className="line-clamp-1">TTD: {item.pihak}</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedPdf({ url: item.url, title: item.title })}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition cursor-pointer"
                                                    title="Pratinjau Halaman Lampiran"
                                                >
                                                    <span>Pratinjau</span>
                                                    <ExternalLink className="w-3 h-3 text-slate-400" />
                                                </button>

                                                <a
                                                    href={item.url}
                                                    download
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white bg-[#00288e] hover:bg-[#001f70] rounded-md transition shadow-2xs"
                                                    title="Unduh Berkas Lampiran PDF"
                                                >
                                                    <Download className="w-3 h-3" />
                                                    <span>Unduh PDF</span>
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="text-center py-10 bg-white border border-slate-200 rounded-xl space-y-2">
                                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                                <p className="text-xs sm:text-sm font-semibold text-slate-700">Tidak ada lampiran yang cocok</p>
                                <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau kategori filter.</p>
                            </div>
                        )}
                    </section>

                    {/* SECTION 2: ALUR TAHAPAN KERJA PRAKTIK (SOP) */}
                    <section className="space-y-6">
                        <div className="border-b border-slate-200 pb-3">
                            <h2 className="text-xl font-bold text-slate-900">
                                Alur Tahapan Kerja Praktik
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Tahapan pelaksanaan KP Teknik Informatika UTM.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {STAGES.map((stage, idx) => {
                                const Icon = stage.icon;
                                return (
                                    <div 
                                        key={idx}
                                        className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-[#00288e]">
                                                    <Icon className="w-4.5 h-4.5" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-300">
                                                    {stage.step}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 mb-1">
                                                    {stage.title}
                                                </h3>
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    {stage.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* SECTION 3: SYARAT DAN KETENTUAN AKADEMIK */}
                    <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    <span>Prasyarat Akademik Mahasiswa</span>
                                </h3>
                                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#00288e] rounded-full mt-2 flex-shrink-0" />
                                        <span>Lulus minimal <strong>80 SKS</strong> saat mengajukan pendaftaran.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#00288e] rounded-full mt-2 flex-shrink-0" />
                                        <span>Jadwal kuliah/praktikum tidak berbenturan dengan waktu magang.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#00288e] rounded-full mt-2 flex-shrink-0" />
                                        <span>Proposal KP telah disetujui Koordinator KP di portal.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#00288e] rounded-full mt-2 flex-shrink-0" />
                                        <span>Memperoleh Surat Pengantar resmi yang diterbitkan TU.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-[#00288e]" />
                                    <span>Kriteria Mitra Tempat KP</span>
                                </h3>
                                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#00288e] rounded-full mt-2 flex-shrink-0" />
                                        <span>Instansi pemerintah, BUMN, swasta berbadan hukum, atau startup resmi.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#00288e] rounded-full mt-2 flex-shrink-0" />
                                        <span>Memiliki divisi IT / Sistem Informasi yang relevan dengan prodi.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#00288e] rounded-full mt-2 flex-shrink-0" />
                                        <span>Bersedia menunjuk Pembimbing Lapangan (PL) untuk evaluasi kerja.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#00288e] rounded-full mt-2 flex-shrink-0" />
                                        <span>Durasi pelaksanaan 1 s/d 3 bulan (minimal <strong>160 jam kerja</strong>).</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 4: CALL TO ACTION LOGIN PORTAL */}
                    <section className="bg-[#00288e] text-white rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
                        <div className="space-y-1 text-center sm:text-left">
                            <h3 className="text-xl font-bold">
                                Siap Memulai Kerja Praktik?
                            </h3>
                            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                                Akses portal untuk pendaftaran mitra, progres plotting pembimbing, dan logbook harian.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <Link 
                                href="/login" 
                                className="px-5 py-2.5 bg-white text-[#00288e] hover:bg-blue-50 text-sm font-bold rounded-lg transition shadow-xs"
                            >
                                Masuk Portal
                            </Link>
                        </div>
                    </section>

                </main>

                {/* ======================================================== */}
                {/* 5. FOOTER INSTITUSI                                      */}
                {/* ======================================================== */}
                <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                        <div>
                            <span className="font-semibold text-slate-700">&copy; 2024 - 2026 SI-KP TEKNIK INFORMATIKA.</span> All Rights Reserved.
                        </div>
                        <div>
                            Program Studi S1 Teknik Informatika - <span className="font-semibold text-slate-700">Universitas Trunojoyo Madura</span>
                        </div>
                    </div>
                </footer>
            </div>

            {/* In-Browser PDF.js Viewer Modal */}
            <PdfViewerModal
                isOpen={!!selectedPdf}
                onClose={() => setSelectedPdf(null)}
                pdfUrl={selectedPdf?.url || ''}
                title={selectedPdf?.title || ''}
            />
        </>
    );
}
