import React, { useMemo } from 'react';
import DosenLayout from '@/Layouts/DosenLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    ChevronLeft, 
    Save, 
    AlertCircle, 
    CheckCircle2, 
    FileText, 
    Download, 
    Printer, 
    Award, 
    Calculator,
    UserCheck,
    HelpCircle
} from 'lucide-react';

interface Mahasiswa {
    id: number;
    name: string;
    nim: string;
}

interface CreateProps extends PageProps {
    pendaftaran: {
        id: number;
        mahasiswa: Mahasiswa;
        status_kp: string;
        catatan: string | null;
        nilai_pembimbing?: number | null;
        nilai_ujian?: number | null;
        nilai_huruf?: string | null;
    };
    nilai_sebelumnya: Record<string, number> | null;
    huruf_sebelumnya?: {
        ujian?: Record<string, string>;
        bimbingan?: Record<string, string>;
        total?: string;
    } | null;
    flash?: {
        success?: string;
        error?: string;
    };
}

export const calculateGradeLetter = (score: number | string): string => {
    const val = typeof score === 'string' ? parseFloat(score) : score;
    if (isNaN(val) || val < 0) return '';
    if (val > 80) return 'A';
    if (val >= 75) return 'B+';
    if (val >= 70) return 'B';
    if (val >= 60) return 'C+';
    if (val >= 55) return 'C';
    if (val >= 50) return 'D+';
    if (val >= 45) return 'D';
    return 'E';
};

export const GRADE_OPTIONS = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E'];

export default function Create({ pendaftaran, nilai_sebelumnya, huruf_sebelumnya, flash }: CreateProps) {
    // Initial values helper
    const getInitVal = (key: string, legacyKey?: string): string => {
        if (nilai_sebelumnya && nilai_sebelumnya[key] !== undefined && nilai_sebelumnya[key] !== null) {
            return String(nilai_sebelumnya[key]);
        }
        if (legacyKey && nilai_sebelumnya && nilai_sebelumnya[legacyKey] !== undefined && nilai_sebelumnya[legacyKey] !== null) {
            return String(nilai_sebelumnya[legacyKey]);
        }
        return '';
    };

    const initPerumusan = getInitVal('perumusan_masalah', 'sistematika');
    const initManfaat = getInitVal('manfaat', 'kedalaman');
    const initTinjauan = getInitVal('tinjauan_pustaka', 'penguasaan');
    const initMetode = getInitVal('metode');
    const initPresentasi = getInitVal('presentasi');

    const initPermasalahan = getInitVal('permasalahan');
    const initLaporan = getInitVal('laporan');
    const initUjianKp = getInitVal('ujian_kp', 'nilai_ujian');

    // Calculate initial Table 1 total
    let initialTotalUjian = 0;
    const hasUjianValues = initPerumusan !== '' || initManfaat !== '' || initTinjauan !== '' || initMetode !== '' || initPresentasi !== '';
    if (hasUjianValues) {
        initialTotalUjian = Math.round((
            (parseFloat(initPerumusan) || 0) * 0.15 +
            (parseFloat(initManfaat) || 0) * 0.20 +
            (parseFloat(initTinjauan) || 0) * 0.15 +
            (parseFloat(initMetode) || 0) * 0.20 +
            (parseFloat(initPresentasi) || 0) * 0.30
        ) * 100) / 100;
    }

    const effectiveInitUjianKp = initUjianKp !== '' ? initUjianKp : (hasUjianValues ? initialTotalUjian.toFixed(2) : '');
    const hasBimbinganValues = initPermasalahan !== '' || initLaporan !== '' || effectiveInitUjianKp !== '';
    let initialTotalBimbingan = 0;
    if (hasBimbinganValues) {
        initialTotalBimbingan = Math.round((
            (parseFloat(initPermasalahan) || 0) * 0.30 +
            (parseFloat(initLaporan) || 0) * 0.30 +
            (parseFloat(effectiveInitUjianKp) || 0) * 0.40
        ) * 100) / 100;
    }

    const { data, setData, post, processing, errors } = useForm({
        // Tabel 1: Komponen Penilaian Ujian KP (Penguji)
        perumusan_masalah: initPerumusan,
        perumusan_masalah_huruf: initPerumusan !== '' ? calculateGradeLetter(initPerumusan) : '',
        manfaat: initManfaat,
        manfaat_huruf: initManfaat !== '' ? calculateGradeLetter(initManfaat) : '',
        tinjauan_pustaka: initTinjauan,
        tinjauan_pustaka_huruf: initTinjauan !== '' ? calculateGradeLetter(initTinjauan) : '',
        metode: initMetode,
        metode_huruf: initMetode !== '' ? calculateGradeLetter(initMetode) : '',
        presentasi: initPresentasi,
        presentasi_huruf: initPresentasi !== '' ? calculateGradeLetter(initPresentasi) : '',
        nilai_ujian_huruf: hasUjianValues ? calculateGradeLetter(initialTotalUjian) : '',

        // Tabel 2: Penilaian Lapangan & Bimbingan (Pembimbing)
        permasalahan: initPermasalahan,
        permasalahan_huruf: initPermasalahan !== '' ? calculateGradeLetter(initPermasalahan) : '',
        laporan: initLaporan,
        laporan_huruf: initLaporan !== '' ? calculateGradeLetter(initLaporan) : '',
        ujian_kp: effectiveInitUjianKp,
        ujian_kp_huruf: effectiveInitUjianKp !== '' ? calculateGradeLetter(effectiveInitUjianKp) : '',
        nilai_bimbingan_huruf: hasBimbinganValues ? calculateGradeLetter(initialTotalBimbingan) : '',
        nilai_huruf: hasBimbinganValues ? calculateGradeLetter(initialTotalBimbingan) : (pendaftaran.nilai_huruf || ''),

        catatan: pendaftaran.catatan ?? '',
    });

    // Real-time calculation for Table 1 (Ujian KP)
    const { totalUjian, hasAnyUjian } = useMemo(() => {
        const p = parseFloat(data.perumusan_masalah as string) || 0;
        const m = parseFloat(data.manfaat as string) || 0;
        const t = parseFloat(data.tinjauan_pustaka as string) || 0;
        const mt = parseFloat(data.metode as string) || 0;
        const pr = parseFloat(data.presentasi as string) || 0;

        const any = data.perumusan_masalah !== '' || 
                    data.manfaat !== '' || 
                    data.tinjauan_pustaka !== '' || 
                    data.metode !== '' || 
                    data.presentasi !== '';

        const total = (p * 0.15) + (m * 0.20) + (t * 0.15) + (mt * 0.20) + (pr * 0.30);
        return { totalUjian: Math.round(total * 100) / 100, hasAnyUjian: any };
    }, [data.perumusan_masalah, data.manfaat, data.tinjauan_pustaka, data.metode, data.presentasi]);

    // Real-time calculation for Table 2 (Bimbingan)
    const { totalBimbingan, hasAnyBimbingan } = useMemo(() => {
        const p = parseFloat(data.permasalahan as string) || 0;
        const l = parseFloat(data.laporan as string) || 0;
        const u = parseFloat(data.ujian_kp as string) || (hasAnyUjian ? totalUjian : 0);

        const any = data.permasalahan !== '' || data.laporan !== '' || data.ujian_kp !== '' || hasAnyUjian;
        const total = (p * 0.30) + (l * 0.30) + (u * 0.40);
        return { totalBimbingan: Math.round(total * 100) / 100, hasAnyBimbingan: any };
    }, [data.permasalahan, data.laporan, data.ujian_kp, totalUjian, hasAnyUjian]);

    // Handle score change in Table 1
    const handleScoreChangeUjian = (
        field: 'perumusan_masalah' | 'manfaat' | 'tinjauan_pustaka' | 'metode' | 'presentasi', 
        val: string
    ) => {
        if (val !== '' && !/^\d*\.?\d*$/.test(val)) return;
        const num = parseFloat(val);
        if (!isNaN(num) && num > 100) return;

        const nextLetter = val !== '' ? calculateGradeLetter(val) : '';
        const updated = {
            ...data,
            [field]: val,
            [`${field}_huruf`]: nextLetter,
        };

        // Recalculate Table 1 total
        const p = parseFloat(field === 'perumusan_masalah' ? val : (data.perumusan_masalah as string)) || 0;
        const m = parseFloat(field === 'manfaat' ? val : (data.manfaat as string)) || 0;
        const t = parseFloat(field === 'tinjauan_pustaka' ? val : (data.tinjauan_pustaka as string)) || 0;
        const mt = parseFloat(field === 'metode' ? val : (data.metode as string)) || 0;
        const pr = parseFloat(field === 'presentasi' ? val : (data.presentasi as string)) || 0;

        const anyUjian = (field === 'perumusan_masalah' ? val : data.perumusan_masalah) !== '' ||
                         (field === 'manfaat' ? val : data.manfaat) !== '' ||
                         (field === 'tinjauan_pustaka' ? val : data.tinjauan_pustaka) !== '' ||
                         (field === 'metode' ? val : data.metode) !== '' ||
                         (field === 'presentasi' ? val : data.presentasi) !== '';

        const newTotalUjian = anyUjian ? Math.round(((p * 0.15) + (m * 0.20) + (t * 0.15) + (mt * 0.20) + (pr * 0.30)) * 100) / 100 : 0;
        const newHurufUjian = anyUjian ? calculateGradeLetter(newTotalUjian) : '';
        updated.nilai_ujian_huruf = newHurufUjian;

        // Auto-sync into Table 2 "ujian_kp" if user hasn't explicitly given custom input
        if (anyUjian) {
            updated.ujian_kp = newTotalUjian.toFixed(2);
            updated.ujian_kp_huruf = newHurufUjian;
        }

        // Recalculate Table 2 total
        const pm = parseFloat(data.permasalahan as string) || 0;
        const lp = parseFloat(data.laporan as string) || 0;
        const uk = parseFloat(updated.ujian_kp as string) || 0;
        const anyBimbingan = data.permasalahan !== '' || data.laporan !== '' || updated.ujian_kp !== '';

        const newTotalBimbingan = anyBimbingan ? Math.round(((pm * 0.30) + (lp * 0.30) + (uk * 0.40)) * 100) / 100 : 0;
        const newHurufBimbingan = anyBimbingan ? calculateGradeLetter(newTotalBimbingan) : '';

        updated.nilai_bimbingan_huruf = newHurufBimbingan;
        updated.nilai_huruf = newHurufBimbingan;

        setData(updated);
    };

    // Handle score change in Table 2
    const handleScoreChangeBimbingan = (
        field: 'permasalahan' | 'laporan' | 'ujian_kp',
        val: string
    ) => {
        if (val !== '' && !/^\d*\.?\d*$/.test(val)) return;
        const num = parseFloat(val);
        if (!isNaN(num) && num > 100) return;

        const nextLetter = val !== '' ? calculateGradeLetter(val) : '';
        const updated = {
            ...data,
            [field]: val,
            [`${field}_huruf`]: nextLetter,
        };

        const pm = parseFloat(field === 'permasalahan' ? val : (data.permasalahan as string)) || 0;
        const lp = parseFloat(field === 'laporan' ? val : (data.laporan as string)) || 0;
        const uk = parseFloat(field === 'ujian_kp' ? val : (data.ujian_kp as string)) || 0;

        const anyBimbingan = (field === 'permasalahan' ? val : data.permasalahan) !== '' ||
                             (field === 'laporan' ? val : data.laporan) !== '' ||
                             (field === 'ujian_kp' ? val : data.ujian_kp) !== '';

        const newTotalBimbingan = anyBimbingan ? Math.round(((pm * 0.30) + (lp * 0.30) + (uk * 0.40)) * 100) / 100 : 0;
        const newHurufBimbingan = anyBimbingan ? calculateGradeLetter(newTotalBimbingan) : '';

        updated.nilai_bimbingan_huruf = newHurufBimbingan;
        updated.nilai_huruf = newHurufBimbingan;

        setData(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dosen.penilaian.store', pendaftaran.id));
    };

    const isAlreadyGraded = pendaftaran.nilai_pembimbing !== null || pendaftaran.nilai_ujian !== null;

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto w-full">
            <Head title={`Penilaian KP - ${pendaftaran.mahasiswa.name}`} />
            
            {/* Nav Back & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <Link 
                    href={route('dosen.penilaian.index')} 
                    className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-semibold"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Kembali ke Daftar Penilaian
                </Link>

                {isAlreadyGraded && (
                    <a
                        href={route('dosen.penilaian.cetak', pendaftaran.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition shadow-xs self-start sm:self-auto"
                    >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        Cetak Berkas KP-6b
                    </a>
                )}
            </div>

            {/* Official Header Banner Form KP-6b */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/80 text-[#00288e] flex items-center justify-center shrink-0 shadow-xs">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">
                                    PENILAIAN KERJA PRAKTIK (KP)
                                </h1>
                                <span className="bg-blue-100/90 text-[#00288e] text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-300">
                                    BERKAS KP-6b
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Formulir penilaian gabungan <strong>Dosen Penguji</strong> (Ujian KP) dan <strong>Dosen Pembimbing</strong> (Lapangan & Bimbingan).
                            </p>
                        </div>
                    </div>

                    <a
                        href="/dokumen/lampiran/Lampiran_11_Penilaian_Penguji_dan_Pembimbing_Form_KP-6b.pdf"
                        download
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-[#00288e] text-xs font-bold transition shrink-0 border border-blue-200/70"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Blanko Resmi Form KP-6b</span>
                    </a>
                </div>

                {/* Info Mahasiswa Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                        <span className="text-slate-400 font-medium block text-[11px] mb-0.5">Nama Mahasiswa</span>
                        <span className="font-bold text-slate-900 text-sm">{pendaftaran.mahasiswa.name}</span>
                    </div>
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                        <span className="text-slate-400 font-medium block text-[11px] mb-0.5">NIM Mahasiswa</span>
                        <span className="font-mono font-bold text-slate-800 text-sm">{pendaftaran.mahasiswa.nim}</span>
                    </div>
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                        <span className="text-slate-400 font-medium block text-[11px] mb-0.5">Status Penilaian</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            {isAlreadyGraded ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    Sudah Dinilai (Nilai Akhir: {pendaftaran.nilai_pembimbing ?? '-'})
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                                    <Calculator className="w-4 h-4 text-amber-600" />
                                    Belum Dinilai (Menunggu Input)
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {flash?.success && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-xl flex items-center gap-3 shadow-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                        <p className="font-bold text-sm">Berhasil!</p>
                        <p className="text-xs">{flash.success}</p>
                    </div>
                </div>
            )}

            {(flash?.error || (errors as any).error) && (
                <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 px-5 py-4 rounded-xl flex items-center gap-3 shadow-xs">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                        <p className="font-bold text-sm">Gagal!</p>
                        <p className="text-xs">{flash?.error || (errors as any).error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* ========================================================= */}
                {/* TABEL 1: KOMPONEN PENILAIAN UJIAN KP (DOSEN PENGUJI) */}
                {/* ========================================================= */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
                    <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px] font-black tracking-wider uppercase">
                                    Tabel Atas
                                </span>
                                <h2 className="text-base sm:text-lg font-bold">
                                    Komponen Penilaian Ujian KP
                                </h2>
                            </div>
                            <p className="text-xs text-blue-200 mt-0.5">
                                (Diisi oleh Dosen Penguji KP) • Masukkan nilai 0 – 100, total dihitung otomatis oleh sistem.
                            </p>
                        </div>

                        {hasAnyUjian && (
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 self-start sm:self-auto">
                                <span className="text-[11px] text-blue-100 font-medium">Total Ujian:</span>
                                <span className="text-base font-black text-amber-300">{totalUjian.toFixed(2)}</span>
                                <span className="bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded text-[11px] font-black">
                                    {data.nilai_ujian_huruf || calculateGradeLetter(totalUjian)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-100/90 text-slate-700 border-b border-slate-200 font-bold">
                                    <th className="py-3 px-3 text-center w-12">No</th>
                                    <th className="py-3 px-4 w-44">Kriteria</th>
                                    <th className="py-3 px-4 min-w-[260px]">Indikator Penilaian</th>
                                    <th className="py-3 px-3 text-center w-24">Bobot (%)</th>
                                    <th className="py-3 px-4 text-center w-36">Nilai (0 – 100)</th>
                                    <th className="py-3 px-4 text-center w-32">Nilai Huruf *)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-800">
                                {/* 1. Perumusan Masalah */}
                                <tr className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3.5 px-3 text-center font-bold text-slate-500">1</td>
                                    <td className="py-3.5 px-4 font-bold text-slate-900">Perumusan Masalah</td>
                                    <td className="py-3.5 px-4 text-slate-600 text-xs leading-relaxed">
                                        Ketajaman Perumusan Masalah, Tujuan Penelitian / KP, Kebaharuan dan Originalitas, Kesesuaian Judul dengan Isi
                                    </td>
                                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">15%</td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            placeholder="0 - 100"
                                            value={data.perumusan_masalah}
                                            onChange={e => handleScoreChangeUjian('perumusan_masalah', e.target.value)}
                                            className="w-full px-3 py-1.5 text-center font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition"
                                        />
                                        {errors.perumusan_masalah && <p className="text-[10px] text-rose-600 mt-1">{errors.perumusan_masalah}</p>}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            readOnly
                                            disabled
                                            value={data.perumusan_masalah !== '' ? calculateGradeLetter(data.perumusan_masalah) : '-'}
                                            className="w-full px-2.5 py-1.5 text-center font-bold text-slate-700 border border-slate-200 rounded-lg bg-slate-100 cursor-not-allowed select-none"
                                        />
                                    </td>
                                </tr>

                                {/* 2. Manfaat Hasil KP */}
                                <tr className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3.5 px-3 text-center font-bold text-slate-500">2</td>
                                    <td className="py-3.5 px-4 font-bold text-slate-900">Manfaat Hasil KP</td>
                                    <td className="py-3.5 px-4 text-slate-600 text-xs leading-relaxed">
                                        Pengembangan Ipteks, Pembangunan dan atau Pengembangan Kelembagaan
                                    </td>
                                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">20%</td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            placeholder="0 - 100"
                                            value={data.manfaat}
                                            onChange={e => handleScoreChangeUjian('manfaat', e.target.value)}
                                            className="w-full px-3 py-1.5 text-center font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition"
                                        />
                                        {errors.manfaat && <p className="text-[10px] text-rose-600 mt-1">{errors.manfaat}</p>}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            readOnly
                                            disabled
                                            value={data.manfaat !== '' ? calculateGradeLetter(data.manfaat) : '-'}
                                            className="w-full px-2.5 py-1.5 text-center font-bold text-slate-700 border border-slate-200 rounded-lg bg-slate-100 cursor-not-allowed select-none"
                                        />
                                    </td>
                                </tr>

                                {/* 3. Tinjauan Pustaka */}
                                <tr className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3.5 px-3 text-center font-bold text-slate-500">3</td>
                                    <td className="py-3.5 px-4 font-bold text-slate-900">Tinjauan Pustaka</td>
                                    <td className="py-3.5 px-4 text-slate-600 text-xs leading-relaxed">
                                        Relevansi dan Kemutakhiran, Kedalaman Tinjauan Pustaka
                                    </td>
                                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">15%</td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            placeholder="0 - 100"
                                            value={data.tinjauan_pustaka}
                                            onChange={e => handleScoreChangeUjian('tinjauan_pustaka', e.target.value)}
                                            className="w-full px-3 py-1.5 text-center font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition"
                                        />
                                        {errors.tinjauan_pustaka && <p className="text-[10px] text-rose-600 mt-1">{errors.tinjauan_pustaka}</p>}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            readOnly
                                            disabled
                                            value={data.tinjauan_pustaka !== '' ? calculateGradeLetter(data.tinjauan_pustaka) : '-'}
                                            className="w-full px-2.5 py-1.5 text-center font-bold text-slate-700 border border-slate-200 rounded-lg bg-slate-100 cursor-not-allowed select-none"
                                        />
                                    </td>
                                </tr>

                                {/* 4. Metode Penelitian */}
                                <tr className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3.5 px-3 text-center font-bold text-slate-500">4</td>
                                    <td className="py-3.5 px-4 font-bold text-slate-900">Metode Penelitian</td>
                                    <td className="py-3.5 px-4 text-slate-600 text-xs leading-relaxed">
                                        Ketepatan Desain, Ketepatan Instrumen, Ketepatan Analisis
                                    </td>
                                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">20%</td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            placeholder="0 - 100"
                                            value={data.metode}
                                            onChange={e => handleScoreChangeUjian('metode', e.target.value)}
                                            className="w-full px-3 py-1.5 text-center font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition"
                                        />
                                        {errors.metode && <p className="text-[10px] text-rose-600 mt-1">{errors.metode}</p>}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            readOnly
                                            disabled
                                            value={data.metode !== '' ? calculateGradeLetter(data.metode) : '-'}
                                            className="w-full px-2.5 py-1.5 text-center font-bold text-slate-700 border border-slate-200 rounded-lg bg-slate-100 cursor-not-allowed select-none"
                                        />
                                    </td>
                                </tr>

                                {/* 5. Presentasi & Tanya Jawab */}
                                <tr className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3.5 px-3 text-center font-bold text-slate-500">5</td>
                                    <td className="py-3.5 px-4 font-bold text-slate-900">Presentasi &amp; Tanya Jawab</td>
                                    <td className="py-3.5 px-4 text-slate-600 text-xs leading-relaxed">
                                        Presentasi / Argumentasi
                                    </td>
                                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">30%</td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            placeholder="0 - 100"
                                            value={data.presentasi}
                                            onChange={e => handleScoreChangeUjian('presentasi', e.target.value)}
                                            className="w-full px-3 py-1.5 text-center font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition"
                                        />
                                        {errors.presentasi && <p className="text-[10px] text-rose-600 mt-1">{errors.presentasi}</p>}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            readOnly
                                            disabled
                                            value={data.presentasi !== '' ? calculateGradeLetter(data.presentasi) : '-'}
                                            className="w-full px-2.5 py-1.5 text-center font-bold text-slate-700 border border-slate-200 rounded-lg bg-slate-100 cursor-not-allowed select-none"
                                        />
                                    </td>
                                </tr>

                                {/* Total Row Ujian KP */}
                                <tr className="bg-blue-50/60 font-bold border-t-2 border-slate-200">
                                    <td colSpan={3} className="py-3.5 px-4 text-right text-slate-800">
                                        Jumlah (Total Ujian KP)
                                    </td>
                                    <td className="py-3.5 px-3 text-center text-blue-900">100%</td>
                                    <td className="py-3.5 px-4 text-center">
                                        <span className="inline-block px-3 py-1 rounded-lg bg-blue-100 text-blue-900 font-black text-sm">
                                            {hasAnyUjian ? totalUjian.toFixed(2) : '-'}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            readOnly
                                            disabled
                                            value={hasAnyUjian ? calculateGradeLetter(totalUjian) : '-'}
                                            className="w-full px-2.5 py-1.5 text-center font-black text-blue-900 border border-blue-200 rounded-lg bg-blue-100/70 cursor-not-allowed select-none"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* TABEL 2: PENILAIAN LAPANGAN & BIMBINGAN (PEMBIMBING) */}
                {/* ========================================================= */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
                    <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px] font-black tracking-wider uppercase">
                                    Tabel Bawah
                                </span>
                                <h2 className="text-base sm:text-lg font-bold">
                                    Penilaian Lapangan &amp; Bimbingan
                                </h2>
                            </div>
                            <p className="text-xs text-emerald-200 mt-0.5">
                                (Dosen Pembimbing) • Baris ke-3 otomatis terisi dari hasil Jumlah Tabel 1 Ujian KP di atas.
                            </p>
                        </div>

                        {hasAnyBimbingan && (
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 self-start sm:self-auto">
                                <span className="text-[11px] text-emerald-100 font-medium">Total Bimbingan:</span>
                                <span className="text-base font-black text-amber-300">{totalBimbingan.toFixed(2)}</span>
                                <span className="bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded text-[11px] font-black">
                                    {data.nilai_bimbingan_huruf || calculateGradeLetter(totalBimbingan)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-100/90 text-slate-700 border-b border-slate-200 font-bold">
                                    <th className="py-3 px-4 min-w-[280px]">Kriteria Penilaian</th>
                                    <th className="py-3 px-3 text-center w-28">Bobot</th>
                                    <th className="py-3 px-4 text-center w-40">Nilai (0 – 100)</th>
                                    <th className="py-3 px-4 text-center w-36">Nilai Huruf **)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-800">
                                <tr className="bg-slate-50/60 font-bold text-slate-600 text-xs">
                                    <td colSpan={4} className="py-2 px-4 uppercase tracking-wider text-[11px] text-slate-500">
                                        Dari Dosen Pembimbing:
                                    </td>
                                </tr>

                                {/* 1. Permasalahan Masalah dan Solusi */}
                                <tr className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                                        Permasalahan Masalah dan Solusi
                                    </td>
                                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">30%</td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            placeholder="0 - 100"
                                            value={data.permasalahan}
                                            onChange={e => handleScoreChangeBimbingan('permasalahan', e.target.value)}
                                            className="w-full px-3 py-1.5 text-center font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition"
                                        />
                                        {errors.permasalahan && <p className="text-[10px] text-rose-600 mt-1">{errors.permasalahan}</p>}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            readOnly
                                            disabled
                                            value={data.permasalahan !== '' ? calculateGradeLetter(data.permasalahan) : '-'}
                                            className="w-full px-2.5 py-1.5 text-center font-bold text-slate-700 border border-slate-200 rounded-lg bg-slate-100 cursor-not-allowed select-none"
                                        />
                                    </td>
                                </tr>

                                {/* 2. Laporan */}
                                <tr className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                                        Laporan
                                    </td>
                                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">30%</td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            placeholder="0 - 100"
                                            value={data.laporan}
                                            onChange={e => handleScoreChangeBimbingan('laporan', e.target.value)}
                                            className="w-full px-3 py-1.5 text-center font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition"
                                        />
                                        {errors.laporan && <p className="text-[10px] text-rose-600 mt-1">{errors.laporan}</p>}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            readOnly
                                            disabled
                                            value={data.laporan !== '' ? calculateGradeLetter(data.laporan) : '-'}
                                            className="w-full px-2.5 py-1.5 text-center font-bold text-slate-700 border border-slate-200 rounded-lg bg-slate-100 cursor-not-allowed select-none"
                                        />
                                    </td>
                                </tr>

                                {/* 3. Ujian KP (Dari hasil ujian KP) */}
                                <tr className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                                        <div>Ujian KP (Dari hasil ujian KP)</div>
                                        <span className="text-[11px] text-emerald-700 block font-normal mt-0.5">
                                            * Terhubung otomatis dengan total Nilai Ujian pada Tabel 1 di atas.
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">40%</td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            placeholder={hasAnyUjian ? totalUjian.toFixed(2) : "0 - 100"}
                                            value={data.ujian_kp}
                                            onChange={e => handleScoreChangeBimbingan('ujian_kp', e.target.value)}
                                            className="w-full px-3 py-1.5 text-center font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition"
                                        />
                                        {errors.ujian_kp && <p className="text-[10px] text-rose-600 mt-1">{errors.ujian_kp}</p>}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            readOnly
                                            disabled
                                            value={data.ujian_kp !== '' ? calculateGradeLetter(data.ujian_kp) : (hasAnyUjian ? calculateGradeLetter(totalUjian) : '-')}
                                            className="w-full px-2.5 py-1.5 text-center font-bold text-slate-700 border border-slate-200 rounded-lg bg-slate-100 cursor-not-allowed select-none"
                                        />
                                    </td>
                                </tr>

                                {/* TOTAL Row Bimbingan */}
                                <tr className="bg-emerald-50/60 font-bold border-t-2 border-slate-200">
                                    <td className="py-3.5 px-4 text-right text-slate-800">
                                        TOTAL (Penilaian Bimbingan)
                                    </td>
                                    <td className="py-3.5 px-3 text-center text-emerald-900">100%</td>
                                    <td className="py-3.5 px-4 text-center">
                                        <span className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-950 font-black text-sm">
                                            {hasAnyBimbingan ? totalBimbingan.toFixed(2) : '-'}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <input
                                            type="text"
                                            readOnly
                                            disabled
                                            value={hasAnyBimbingan ? calculateGradeLetter(totalBimbingan) : '-'}
                                            className="w-full px-2.5 py-1.5 text-center font-black text-emerald-900 border border-emerald-200 rounded-lg bg-emerald-100/70 cursor-not-allowed select-none"
                                        />
                                    </td>
                                </tr>

                                {/* Final NILAI HURUF ***) Row */}
                                <tr className="bg-amber-50/70 font-bold border-t border-amber-200">
                                    <td colSpan={2} className="py-4 px-4 text-right text-amber-900 font-display font-black text-sm uppercase tracking-wide">
                                        NILAI HURUF ***)
                                    </td>
                                    <td colSpan={2} className="py-4 px-4 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <input
                                                type="text"
                                                readOnly
                                                disabled
                                                value={hasAnyBimbingan ? `Grade ${calculateGradeLetter(totalBimbingan)}` : '-'}
                                                className="w-36 px-4 py-2 text-center text-base font-black text-amber-950 border-2 border-amber-300 rounded-xl bg-amber-100/70 cursor-not-allowed select-none shadow-xs"
                                            />
                                            <span className="text-xs text-amber-800 font-semibold hidden sm:inline">
                                                (Otomatis dari skala konversi nilai angka)
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Catatan Dosen & Feedback */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5 sm:p-6 space-y-3">
                    <label className="text-sm font-bold text-slate-900 block">
                        Catatan Evaluasi / Masukan Dosen (Opsional)
                    </label>
                    <textarea
                        value={data.catatan}
                        onChange={e => setData('catatan', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition text-sm text-slate-800 placeholder:text-slate-400"
                        placeholder="Berikan masukan perbaikan naskah, saran tindak lanjut, atau catatan bimbingan untuk mahasiswa..."
                    ></textarea>
                    {errors.catatan && <p className="text-xs text-rose-600">{errors.catatan}</p>}
                </div>

                {/* Footnotes & Skala Konversi Nilai Resmi Form KP-6b */}
                <div className="bg-slate-50/90 rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 space-y-3">
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <HelpCircle className="w-4 h-4 text-blue-700" />
                        <span>Keterangan Berkas &amp; Skala Konversi Nilai Resmi (Form KP-6b)</span>
                    </div>

                    <div className="space-y-1 text-slate-500 text-[11px]">
                        <p><strong>*)</strong> Diisi oleh Dosen Penguji KP</p>
                        <p><strong>**)</strong> Diisi oleh Pembimbing Lapangan &amp; Dosen Pembimbing</p>
                        <p><strong>***) Skala Penilaian Standar Universitas Trunojoyo Madura:</strong></p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
                        <div className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between">
                            <span className="font-bold text-slate-800">A</span>
                            <span className="text-slate-500">80 &lt; Nilai &le; 100</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between">
                            <span className="font-bold text-slate-800">B+</span>
                            <span className="text-slate-500">75 &le; Nilai &lt; 80</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between">
                            <span className="font-bold text-slate-800">B</span>
                            <span className="text-slate-500">70 &le; Nilai &lt; 75</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between">
                            <span className="font-bold text-slate-800">C+</span>
                            <span className="text-slate-500">60 &le; Nilai &lt; 70</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between">
                            <span className="font-bold text-slate-800">C</span>
                            <span className="text-slate-500">55 &le; Nilai &lt; 60</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between">
                            <span className="font-bold text-slate-800">D+</span>
                            <span className="text-slate-500">50 &le; Nilai &lt; 55</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between">
                            <span className="font-bold text-slate-800">D</span>
                            <span className="text-slate-500">45 &le; Nilai &lt; 50</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between">
                            <span className="font-bold text-rose-700">E</span>
                            <span className="text-slate-500">0 &le; Nilai &lt; 45</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Submit Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#00288e] flex items-center justify-center shrink-0">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <div className="text-xs">
                            <p className="font-bold text-slate-900">Pastikan Seluruh Komponen Telah Terisi</p>
                            <p className="text-slate-500">
                                Nilai Ujian: <strong className="text-blue-900">{hasAnyUjian ? totalUjian.toFixed(2) : '-'}</strong> | 
                                Nilai Bimbingan: <strong className="text-emerald-900">{hasAnyBimbingan ? totalBimbingan.toFixed(2) : '-'}</strong> | 
                                Huruf: <strong className="text-amber-900">{data.nilai_huruf || '-'}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                        <Link
                            href={route('dosen.penilaian.index')}
                            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 bg-[#00288e] text-white hover:bg-blue-900 transition shadow-sm ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Penilaian Form KP-6b'}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
}

Create.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
