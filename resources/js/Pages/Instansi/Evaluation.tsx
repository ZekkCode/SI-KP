import React, { useState, useMemo } from 'react';
import InstansiLayout from '@/Layouts/InstansiLayout';
import { useForm, Link, usePage, Head } from '@inertiajs/react';
import {
  BarChart2,
  CheckCircle2,
  FileSignature,
  Upload,
  X,
  ScanLine,
  Building2,
  Download,
  FileText,
  Search,
  Clock,
  ExternalLink,
  AlertCircle,
  Edit2,
  Award,
} from 'lucide-react';
import Modal from '@/Components/Modal';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

interface Mahasiswa {
  name?: string;
  nim?: string;
}

interface Pendaftaran {
  id: number;
  mahasiswa?: Mahasiswa | null;
  status_kp: string;
  is_dinilai: boolean;
  nilai_instansi: string | number | null;
  nilai_huruf?: string | null;
  komponen_nilai: Record<string, string | number> | null;
  komponen_huruf?: Record<string, string> | null;
  catatan?: string | null;
}

interface Props {
  pendaftarans: Pendaftaran[];
  error?: string;
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

export default function EvaluationScreen({ pendaftarans = [], error }: Props) {
  const { flash } = usePage().props as any;
  const [selectedPendaftaran, setSelectedPendaftaran] = useState<Pendaftaran | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'belum' | 'sudah'>('all');

  const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
    tugas: '',
    tugas_huruf: '',
    sikap: '',
    sikap_huruf: '',
    kedisiplinan: '',
    kedisiplinan_huruf: '',
    laporan: '',
    laporan_huruf: '',
    nilai_huruf: '',
    catatan: '',
  });

  const counts = useMemo(() => {
    return {
      all: pendaftarans.length,
      belum: pendaftarans.filter((p) => !p.is_dinilai).length,
      sudah: pendaftarans.filter((p) => p.is_dinilai).length,
    };
  }, [pendaftarans]);

  const filteredPendaftarans = useMemo(() => {
    return pendaftarans.filter((p) => {
      const matchesFilter =
        selectedFilter === 'all' ||
        (selectedFilter === 'belum' && !p.is_dinilai) ||
        (selectedFilter === 'sudah' && p.is_dinilai);

      const q = search.toLowerCase().trim();
      const studentName = p.mahasiswa?.name?.toLowerCase() || '';
      const studentNim = p.mahasiswa?.nim?.toLowerCase() || '';

      const matchesSearch = !q || studentName.includes(q) || studentNim.includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [pendaftarans, selectedFilter, search]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
          <Building2 size={36} />
        </div>
        <h2 className="text-xl font-display font-semibold text-on-surface">Akses Profil Instansi</h2>
        <p className="text-secondary text-sm max-w-md">{error}</p>
      </div>
    );
  }

  const openGradingModal = (pendaftaran: Pendaftaran) => {
    clearErrors();
    setSelectedPendaftaran(pendaftaran);

    const kNilai = pendaftaran.komponen_nilai || {};

    const rawTugas = kNilai.tugas != null ? String(kNilai.tugas) : (kNilai.kinerja != null ? String(kNilai.kinerja) : '');
    const rawSikap = kNilai.sikap != null ? String(kNilai.sikap) : (kNilai.kerjasama != null ? String(kNilai.kerjasama) : '');
    const rawDisiplin = kNilai.kedisiplinan != null ? String(kNilai.kedisiplinan) : '';
    const rawLaporan = kNilai.laporan != null ? String(kNilai.laporan) : '';

    const tugasHuruf = rawTugas !== '' ? calculateGradeLetter(rawTugas) : '';
    const sikapHuruf = rawSikap !== '' ? calculateGradeLetter(rawSikap) : '';
    const disiplinHuruf = rawDisiplin !== '' ? calculateGradeLetter(rawDisiplin) : '';
    const laporanHuruf = rawLaporan !== '' ? calculateGradeLetter(rawLaporan) : '';

    let totalScore = 0;
    const hasAny = rawTugas !== '' || rawSikap !== '' || rawDisiplin !== '' || rawLaporan !== '';
    if (hasAny) {
      totalScore = (parseFloat(rawTugas) || 0) * 0.35 +
                   (parseFloat(rawSikap) || 0) * 0.25 +
                   (parseFloat(rawDisiplin) || 0) * 0.20 +
                   (parseFloat(rawLaporan) || 0) * 0.20;
    }

    const totalHuruf = hasAny ? calculateGradeLetter(totalScore) : '';

    setData({
      tugas: rawTugas,
      tugas_huruf: tugasHuruf,
      sikap: rawSikap,
      sikap_huruf: sikapHuruf,
      kedisiplinan: rawDisiplin,
      kedisiplinan_huruf: disiplinHuruf,
      laporan: rawLaporan,
      laporan_huruf: laporanHuruf,
      nilai_huruf: totalHuruf,
      catatan: pendaftaran.catatan || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPendaftaran(null);
      reset();
      clearErrors();
    }, 200);
  };

  const handleScoreChange = (field: 'tugas' | 'sikap' | 'kedisiplinan' | 'laporan', value: string) => {
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    if (value !== '') {
      const num = parseFloat(value);
      if (num > 100) return;
    }

    const nextScores = {
      tugas: field === 'tugas' ? value : data.tugas,
      sikap: field === 'sikap' ? value : data.sikap,
      kedisiplinan: field === 'kedisiplinan' ? value : data.kedisiplinan,
      laporan: field === 'laporan' ? value : data.laporan,
    };

    const t = parseFloat(nextScores.tugas) || 0;
    const s = parseFloat(nextScores.sikap) || 0;
    const d = parseFloat(nextScores.kedisiplinan) || 0;
    const l = parseFloat(nextScores.laporan) || 0;

    const hasAny = nextScores.tugas !== '' || nextScores.sikap !== '' || nextScores.kedisiplinan !== '' || nextScores.laporan !== '';
    const total = (t * 0.35) + (s * 0.25) + (d * 0.20) + (l * 0.20);

    setData({
      ...data,
      ...nextScores,
      tugas_huruf: nextScores.tugas !== '' ? calculateGradeLetter(nextScores.tugas) : '',
      sikap_huruf: nextScores.sikap !== '' ? calculateGradeLetter(nextScores.sikap) : '',
      kedisiplinan_huruf: nextScores.kedisiplinan !== '' ? calculateGradeLetter(nextScores.kedisiplinan) : '',
      laporan_huruf: nextScores.laporan !== '' ? calculateGradeLetter(nextScores.laporan) : '',
      nilai_huruf: hasAny ? calculateGradeLetter(total) : '',
    });
  };

  const handleCatatanChange = (value: string) => {
    setData('catatan', value);
  };

  const submitGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPendaftaran) return;

    post(route('instansi.evaluation.store', selectedPendaftaran.id), {
      preserveScroll: true,
      onSuccess: (page) => {
        const pageErrors = page?.props?.errors || {};
        if (Object.keys(pageErrors).length === 0) {
          closeModal();
        }
      },
      onError: () => {
        // Modal stays open so user can inspect and fix errors
      },
    });
  };

  // Nilai total otomatis Form KP-6a (35% Tugas + 25% Sikap + 20% Disiplin + 20% Laporan)
  const valTugas = parseFloat(data.tugas) || 0;
  const valSikap = parseFloat(data.sikap) || 0;
  const valDisiplin = parseFloat(data.kedisiplinan) || 0;
  const valLaporan = parseFloat(data.laporan) || 0;
  const totalScore = (valTugas * 0.35) + (valSikap * 0.25) + (valDisiplin * 0.20) + (valLaporan * 0.20);
  const isFormFilled = data.tugas !== '' && data.sikap !== '' && data.kedisiplinan !== '' && data.laporan !== '';

  const getInitials = (name?: string) => {
    if (!name) return 'M';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-6 space-y-4">
      <Head title="Penilaian Industri (Pembimbing Lapangan)" />
      <PageHeader
        title="Penilaian Pembimbing Lapangan"
        description="Evaluasi performa, etika, dan pencapaian mahasiswa selama melaksanakan Kerja Praktik di instansi/perusahaan."
      />

      {/* Flash Alerts */}
      {flash?.success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-200 shadow-xs">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="text-sm font-medium">{flash.success}</div>
        </div>
      )}

      {flash?.error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 text-rose-800 dark:text-rose-200 shadow-xs">
          <AlertCircle size={20} className="shrink-0 text-rose-600 dark:text-rose-400" />
          <div className="text-sm font-medium">{flash.error}</div>
        </div>
      )}

      {(errors as any)?.error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 text-rose-800 dark:text-rose-200 shadow-xs">
          <AlertCircle size={20} className="shrink-0 text-rose-600 dark:text-rose-400" />
          <div className="text-sm font-medium">{(errors as any).error}</div>
        </div>
      )}

      {/* Kartu Berkas Resmi & Panduan Penilaian Lapangan */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-[#00288e] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Format Resmi Penilaian Pembimbing Lapangan (Form KP-6a)</h3>
              <p className="text-xs text-slate-500">
                Gunakan instrumen penilaian resmi UTM berikut jika instansi memerlukan blanko fisik bertanda tangan dan berstempel basah.
              </p>
            </div>
          </div>
          <Link
            href="/panduan"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00288e] hover:underline self-start sm:self-center shrink-0"
          >
            <span>Katalog 21 Lampiran</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
          <a
            href="/dokumen/lampiran/Lampiran_07_Penilaian_Pembimbing_Lapangan_Form_KP-6a.pdf"
            download
            className="flex items-start gap-2.5 p-3 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 transition group cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#00288e] shrink-0 mt-0.5 group-hover:translate-y-0.5 transition-transform" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                Form KP-6a
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-1 truncate">Penilaian Pembimbing Lapangan</p>
              <p className="text-[11px] text-slate-500">Bobot: Tugas 35%, Sikap 25%, Disiplin 20%, Laporan 20%</p>
            </div>
          </a>

          <a
            href="/dokumen/lampiran/Lampiran_12_Tanda_Terima_Laporan_KP_Form_KP-7.pdf"
            download
            className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition group cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600 shrink-0 mt-0.5 group-hover:translate-y-0.5 transition-transform" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                Form KP-7
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-1 truncate">Tanda Terima Laporan KP</p>
              <p className="text-[11px] text-slate-500">Bukti penyerahan laporan ke pihak mitra</p>
            </div>
          </a>

          <a
            href="/dokumen/lampiran/Lampiran_19_Pengesahan_Instansi_Perusahaan_KP.pdf"
            download
            className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition group cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600 shrink-0 mt-0.5 group-hover:translate-y-0.5 transition-transform" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                Lampiran 19
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-1 truncate">Pengesahan Instansi / Mitra</p>
              <p className="text-[11px] text-slate-500">Lembar tanda tangan & stempel pimpinan</p>
            </div>
          </a>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-container/60 rounded-xl border border-outline-variant/60 w-fit">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              selectedFilter === 'all'
                ? 'bg-surface-lowest text-on-surface shadow-xs border border-outline-variant/60'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span>Semua Mahasiswa</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface-container text-on-surface-variant font-mono">
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('belum')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              selectedFilter === 'belum'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span>Belum Dinilai</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${selectedFilter === 'belum' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'}`}>
              {counts.belum}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('sudah')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              selectedFilter === 'sudah'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span>Sudah Dinilai</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${selectedFilter === 'sudah' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
              {counts.sudah}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari mahasiswa atau NIM..."
            className="w-full pl-9 pr-3.5 py-2 bg-surface text-on-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          {filteredPendaftarans.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <FileSignature size={44} className="text-outline mb-3 opacity-40" />
              <p className="text-base font-semibold text-on-surface">
                {pendaftarans.length === 0 ? 'Belum Ada Mahasiswa Bimbingan' : 'Tidak Ditemukan Mahasiswa'}
              </p>
              <p className="text-xs sm:text-sm text-secondary mt-1 max-w-sm">
                {pendaftarans.length === 0
                  ? 'Belum ada mahasiswa magang aktif atau yang telah selesai untuk dinilai.'
                  : 'Coba ubah kata kunci pencarian atau ganti filter status penilaian.'}
              </p>
            </div>
          ) : (
            <ModernTable>
              <ModernTableHeader>
                <tr className="bg-surface-container-lowest/80 border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                  <ModernTableTh className="py-3.5 px-4 w-[280px]">Mahasiswa</ModernTableTh>
                  <ModernTableTh className="py-3.5 px-4 w-[160px]">Status KP</ModernTableTh>
                  <ModernTableTh className="py-3.5 px-4 w-[170px]">Status Evaluasi</ModernTableTh>
                  <ModernTableTh className="py-3.5 px-4 min-w-[200px]">Komponen & Nilai Akhir</ModernTableTh>
                  <ModernTableTh className="py-3.5 px-4 w-[140px] text-right">Aksi</ModernTableTh>
                </tr>
              </ModernTableHeader>
              <ModernTableBody>
                {filteredPendaftarans.map((p) => {
                  const studentName = p.mahasiswa?.name || 'Mahasiswa';
                  const studentNim = p.mahasiswa?.nim || '-';
                  const initials = getInitials(studentName);
                  const komponen = p.komponen_nilai;

                  return (
                    <tr key={p.id} className="hover:bg-surface-container-lowest/50 transition-colors border-b border-outline-variant/50 last:border-0">
                      {/* Mahasiswa */}
                      <ModernTableTd className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-on-surface truncate" title={studentName}>
                              {studentName}
                            </div>
                            <div className="text-xs text-secondary font-mono mt-0.5">{studentNim}</div>
                          </div>
                        </div>
                      </ModernTableTd>

                      {/* Status KP */}
                      <ModernTableTd className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 bg-surface-container text-on-surface-variant rounded-md text-xs font-semibold border border-outline-variant/60 uppercase">
                          {p.status_kp?.replace(/_/g, ' ') || 'AKTIF'}
                        </span>
                      </ModernTableTd>

                      {/* Status Penilaian */}
                      <ModernTableTd className="py-3.5 px-4 align-middle whitespace-nowrap">
                        {p.is_dinilai ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 size={13} className="shrink-0" /> Sudah Dinilai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 px-2.5 py-1 rounded-lg">
                            <Clock size={13} className="shrink-0" /> Belum Dinilai
                          </span>
                        )}
                      </ModernTableTd>

                      {/* Komponen & Nilai Instansi */}
                      <ModernTableTd className="py-3.5 px-4 align-middle">
                        {p.nilai_instansi !== null ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold font-display text-primary">
                                {Number(p.nilai_instansi).toFixed(1)}
                              </span>
                              <span className="text-[11px] text-secondary">/ 100</span>
                              {p.nilai_huruf && (
                                <span className="px-2 py-0.5 rounded text-xs font-black bg-blue-100 text-[#00288e] border border-blue-200">
                                  {p.nilai_huruf}
                                </span>
                              )}
                            </div>
                            {komponen && (
                              <div className="text-[11px] text-on-surface-variant/80 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono">
                                <span>T: {komponen.tugas ?? komponen.kinerja ?? '-'}</span>
                                <span>•</span>
                                <span>S: {komponen.sikap ?? komponen.kerjasama ?? '-'}</span>
                                <span>•</span>
                                <span>D: {komponen.kedisiplinan ?? '-'}</span>
                                <span>•</span>
                                <span>L: {komponen.laporan ?? '-'}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-secondary italic">Belum ada nilai diinput</span>
                        )}
                      </ModernTableTd>

                      {/* Aksi */}
                      <ModernTableTd className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openGradingModal(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            !p.is_dinilai
                              ? 'bg-primary text-on-primary hover:bg-primary/90 shadow-xs'
                              : 'border border-outline-variant bg-surface hover:bg-surface-container text-on-surface'
                          }`}
                        >
                          {!p.is_dinilai ? (
                            <>
                              <Award size={13} />
                              <span>Beri Nilai</span>
                            </>
                          ) : (
                            <>
                              <Edit2 size={13} />
                              <span>Ubah Nilai</span>
                            </>
                          )}
                        </button>
                      </ModernTableTd>
                    </tr>
                  );
                })}
              </ModernTableBody>
            </ModernTable>
          )}
        </div>
      </div>

      {/* Modal Evaluasi */}
      <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl" closeable={false}>
        <div className="flex flex-col max-h-[90vh]">
          {/* Header Modal (Pinned) */}
          <div className="p-5 sm:p-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 rounded-t-2xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#00288e] border border-blue-200 mb-1">
                Form KP-6a UTM
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900">Evaluasi Kerja Praktik Industri</h2>
              {selectedPendaftaran && (
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Mahasiswa: <span className="font-bold text-slate-900">{selectedPendaftaran.mahasiswa?.name || 'Mahasiswa'}</span>{' '}
                  <span className="text-slate-500 font-mono font-semibold">({selectedPendaftaran.mahasiswa?.nim || '-'})</span>
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-xl transition-colors shrink-0"
              title="Tutup Modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Modal (Scrollable Body) */}
          <form onSubmit={submitGrading} className="p-5 sm:p-6 space-y-5 overflow-y-auto bg-white">
            {/* Box Peringatan / Error Validasi In-Modal */}
            {((errors as any).error || Object.keys(errors).length > 0) && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-3 shadow-xs animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold">Terjadi Kendala Pengisian / Penyimpanan Nilai:</p>
                  {(errors as any).error && <p>{(errors as any).error}</p>}
                  {Object.keys(errors).filter((k) => k !== 'error').length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-rose-700">
                      {Object.entries(errors)
                        .filter(([k]) => k !== 'error')
                        .map(([k, msg]) => (
                          <li key={k}>{msg}</li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Link Unduh Blanko Fisik */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50/70 border border-blue-200 px-3.5 py-2.5 rounded-xl text-xs">
              <span className="text-slate-700 font-medium">Memerlukan blanko fisik Form KP-6a untuk dicetak & dicap?</span>
              <a
                href="/dokumen/lampiran/Lampiran_07_Penilaian_Pembimbing_Lapangan_Form_KP-6a.pdf"
                download
                className="inline-flex items-center gap-1 font-bold text-[#00288e] hover:underline shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Blanko Form KP-6a (PDF)</span>
              </a>
            </div>

            {/* Form KP-6a Official Grading Table */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-300 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Tabel Penilaian Pembimbing Lapangan (Form KP-6a)
                </span>
                <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">
                  Skala Nilai: 0 – 100
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-200/80 text-slate-800 font-bold border-b border-slate-300 text-center">
                      <th className="py-2.5 px-3 text-left w-[42%]">Kriteria Penilaian</th>
                      <th className="py-2.5 px-3 w-[14%]">Bobot</th>
                      <th className="py-2.5 px-3 w-[24%]">Nilai (0 – 100)</th>
                      <th className="py-2.5 px-3 w-[20%]">Nilai Huruf **)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {/* Header Bagian Form KP-6a */}
                    <tr className="bg-slate-50 font-bold text-slate-700">
                      <td colSpan={4} className="py-2 px-3 text-xs tracking-wider uppercase text-slate-600">
                        Dari Perusahaan:
                      </td>
                    </tr>

                    {/* 1. Kemampuan menyelesaikan tugas (35%) */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-800">
                        <div className="font-semibold text-slate-900">1. Kemampuan menyelesaikan tugas</div>
                        <div className="text-[11px] text-slate-500 font-normal mt-0.5">Kualitas hasil tugas, ketuntasan, dan pemahaman teknis</div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold font-mono text-slate-700 bg-slate-50/50">
                        35%
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="any"
                          value={data.tugas}
                          onChange={(e) => handleScoreChange('tugas', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.preventDefault();
                          }}
                          placeholder="0 - 100"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2 px-2.5 text-center font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm shadow-2xs"
                        />
                        {errors.tugas && <p className="text-[10px] font-semibold text-rose-600 mt-1">{errors.tugas}</p>}
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={data.tugas !== '' ? calculateGradeLetter(data.tugas) : '-'}
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2 px-2.5 text-center font-bold text-slate-700 text-sm cursor-not-allowed select-none shadow-2xs"
                        />
                      </td>
                    </tr>

                    {/* 2. Tingkah laku/ sikap (25%) */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-800">
                        <div className="font-semibold text-slate-900">2. Tingkah laku/ sikap</div>
                        <div className="text-[11px] text-slate-500 font-normal mt-0.5">Etika kerja, kesopanan, inisiatif, dan komunikasi kerja tim</div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold font-mono text-slate-700 bg-slate-50/50">
                        25%
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="any"
                          value={data.sikap}
                          onChange={(e) => handleScoreChange('sikap', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.preventDefault();
                          }}
                          placeholder="0 - 100"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2 px-2.5 text-center font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm shadow-2xs"
                        />
                        {errors.sikap && <p className="text-[10px] font-semibold text-rose-600 mt-1">{errors.sikap}</p>}
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={data.sikap !== '' ? calculateGradeLetter(data.sikap) : '-'}
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2 px-2.5 text-center font-bold text-slate-700 text-sm cursor-not-allowed select-none shadow-2xs"
                        />
                      </td>
                    </tr>

                    {/* 3. Kedisiplinan (20%) */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-800">
                        <div className="font-semibold text-slate-900">3. Kedisiplinan</div>
                        <div className="text-[11px] text-slate-500 font-normal mt-0.5">Kehadiran, kepatuhan jam operasional, dan tata tertib instansi</div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold font-mono text-slate-700 bg-slate-50/50">
                        20%
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="any"
                          value={data.kedisiplinan}
                          onChange={(e) => handleScoreChange('kedisiplinan', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.preventDefault();
                          }}
                          placeholder="0 - 100"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2 px-2.5 text-center font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm shadow-2xs"
                        />
                        {errors.kedisiplinan && <p className="text-[10px] font-semibold text-rose-600 mt-1">{errors.kedisiplinan}</p>}
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={data.kedisiplinan !== '' ? calculateGradeLetter(data.kedisiplinan) : '-'}
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2 px-2.5 text-center font-bold text-slate-700 text-sm cursor-not-allowed select-none shadow-2xs"
                        />
                      </td>
                    </tr>

                    {/* 4. Laporan (20%) */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-800">
                        <div className="font-semibold text-slate-900">4. Laporan</div>
                        <div className="text-[11px] text-slate-500 font-normal mt-0.5">Kelengkapan catatan harian, laporan magang &amp; luaran kerja</div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold font-mono text-slate-700 bg-slate-50/50">
                        20%
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="any"
                          value={data.laporan}
                          onChange={(e) => handleScoreChange('laporan', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.preventDefault();
                          }}
                          placeholder="0 - 100"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2 px-2.5 text-center font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm shadow-2xs"
                        />
                        {errors.laporan && <p className="text-[10px] font-semibold text-rose-600 mt-1">{errors.laporan}</p>}
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={data.laporan !== '' ? calculateGradeLetter(data.laporan) : '-'}
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2 px-2.5 text-center font-bold text-slate-700 text-sm cursor-not-allowed select-none shadow-2xs"
                        />
                      </td>
                    </tr>

                    {/* Row 5: TOTAL */}
                    <tr className="bg-blue-50/80 border-t-2 border-slate-300 font-bold text-slate-900">
                      <td colSpan={2} className="py-3 px-4 text-right uppercase tracking-wider text-xs sm:text-sm">
                        <div className="font-bold text-[#00288e]">TOTAL NILAI (100%)</div>
                        <div className="text-[10px] text-slate-500 font-normal lowercase">Dihitung otomatis (35% Tugas + 25% Sikap + 20% Disiplin + 20% Laporan)</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-baseline gap-1 bg-white px-3 py-1.5 rounded-lg border border-blue-300 shadow-2xs">
                          <span className="text-base sm:text-lg font-black font-display text-[#00288e]">
                            {isFormFilled || totalScore > 0 ? totalScore.toFixed(2) : '0.00'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">/100</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={isFormFilled || totalScore > 0 ? calculateGradeLetter(totalScore) : '-'}
                          className="w-full bg-blue-100/70 border border-blue-200 rounded-lg py-2 px-2 text-center font-black text-blue-900 text-sm cursor-not-allowed select-none shadow-2xs"
                        />
                      </td>
                    </tr>

                    {/* Row 6: NILAI HURUF ***) */}
                    <tr className="bg-blue-100/50 border-t border-blue-200">
                      <td colSpan={2} className="py-3 px-4 text-right font-bold text-slate-900 text-xs sm:text-sm">
                        <div>NILAI HURUF AKHIR ***)</div>
                        <div className="text-[10px] text-slate-500 font-normal">Otomatis dihitung dari Nilai Total Form KP-6a</div>
                      </td>
                      <td colSpan={2} className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            disabled
                            value={isFormFilled || totalScore > 0 ? calculateGradeLetter(totalScore) : '-'}
                            className="w-full bg-white border border-blue-300 rounded-lg py-2.5 px-3 text-center font-black text-lg text-[#00288e] cursor-not-allowed select-none shadow-2xs"
                          />
                        </div>
                        {errors.nilai_huruf && <p className="text-[10px] font-semibold text-rose-600 mt-1">{errors.nilai_huruf}</p>}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Catatan Kaki Skala Nilai Resmi UTM */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-[11px] text-slate-600">
              <div className="font-semibold text-slate-800">
                Keterangan Skala Nilai Form KP-6a UTM:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[11px] bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-slate-700"><span className="font-bold text-blue-700">A</span> : 80 &lt; Nilai &le; 100</div>
                <div className="text-slate-700"><span className="font-bold text-blue-700">B+</span> : 75 &le; Nilai &lt; 80</div>
                <div className="text-slate-700"><span className="font-bold text-blue-700">B</span> : 70 &le; Nilai &lt; 75</div>
                <div className="text-slate-700"><span className="font-bold text-blue-700">C+</span> : 60 &le; Nilai &lt; 70</div>
                <div className="text-slate-700"><span className="font-bold text-amber-700">C</span> : 55 &le; Nilai &lt; 60</div>
                <div className="text-slate-700"><span className="font-bold text-amber-700">D+</span> : 50 &le; Nilai &lt; 55</div>
                <div className="text-slate-700"><span className="font-bold text-rose-700">D</span> : 45 &le; Nilai &lt; 50</div>
                <div className="text-slate-700"><span className="font-bold text-rose-700">E</span> : 0 &le; Nilai &lt; 45</div>
              </div>
              <div className="space-y-0.5 text-slate-500 italic text-[10px]">
                <div>*) Diisi oleh Dosen Penguji</div>
                <div>**) Dihitung otomatis oleh sistem berdasarkan nilai angka (0 – 100) sesuai skala resmi UTM.</div>
                <div>***) Nilai Huruf Akhir terkunci dan dihitung otomatis berdasarkan Nilai Total Form KP-6a (sama seperti penilaian dosen pembimbing).</div>
              </div>
            </div>

            {/* Catatan Evaluasi */}
            <div>
              <label htmlFor="catatan" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Catatan Evaluasi / Pesan Pembimbing Lapangan <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <textarea
                id="catatan"
                rows={3}
                value={data.catatan}
                onChange={(e) => handleCatatanChange(e.target.value)}
                placeholder="Tuliskan masukan atas performa, sikap, atau hal-hal yang perlu ditingkatkan oleh mahasiswa..."
                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-y shadow-2xs placeholder:text-slate-400"
              ></textarea>
              {errors.catatan && <p className="text-rose-600 text-xs mt-1">{errors.catatan}</p>}
            </div>

            {/* Info Validitas */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
              <div className="w-9 h-9 bg-blue-100 text-[#00288e] rounded-lg flex items-center justify-center shrink-0">
                <ScanLine className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                <span className="font-bold block text-slate-800">Validitas Data Evaluasi Form KP-6a</span>
                Nilai yang disimpan akan masuk secara resmi ke rekapitulasi penilaian akhir Program Studi dan dapat ditinjau oleh Dosen Pembimbing.
              </div>
            </div>

            {/* Footer Buttons (Pinned at bottom of modal) */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 bg-white sticky bottom-0">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={processing || !isFormFilled}
                className="px-6 py-2 bg-[#00288e] hover:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Upload size={16} />
                <span>{processing ? 'Menyimpan...' : 'Simpan Nilai'}</span>
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

EvaluationScreen.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
