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
    FileCheck2
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
        title: 'Referensi Laporan Akhir (Studi Kasus)',
        category: 'Format Laporan',
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
        description: 'Rujukan sistematika dan tata letak penulisan naskah laporan ilmiah akhir KP.',
        filename: 'Optimasi Model BiLSTM Berbasis FastText pada Data Augmentasi.pdf',
        url: '/dokumen/Optimasi%20Model%20BiLSTM%20Berbasis%20FastText%20pada%20Data%20Augmentasi.pdf',
        filesize: '783 KB',
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
                    <section className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
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
