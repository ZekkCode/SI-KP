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
  komponen_nilai: Record<string, string | number> | null;
  catatan?: string | null;
}

interface Props {
  pendaftarans: Pendaftaran[];
  error?: string;
}

export default function EvaluationScreen({ pendaftarans = [], error }: Props) {
  const { flash } = usePage().props as any;
  const [selectedPendaftaran, setSelectedPendaftaran] = useState<Pendaftaran | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'belum' | 'sudah'>('all');

  const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
    kedisiplinan: '',
    kerjasama: '',
    kinerja: '',
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

    if (pendaftaran.komponen_nilai) {
      setData({
        kedisiplinan: pendaftaran.komponen_nilai.kedisiplinan != null ? String(pendaftaran.komponen_nilai.kedisiplinan) : '',
        kerjasama: pendaftaran.komponen_nilai.kerjasama != null ? String(pendaftaran.komponen_nilai.kerjasama) : '',
        kinerja: pendaftaran.komponen_nilai.kinerja != null ? String(pendaftaran.komponen_nilai.kinerja) : '',
        catatan: pendaftaran.catatan || '',
      });
    } else {
      setData({
        kedisiplinan: '',
        kerjasama: '',
        kinerja: '',
        catatan: pendaftaran.catatan || '',
      });
    }
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

  const handleScoreChange = (field: keyof typeof data, value: string) => {
    if (field === 'catatan') {
      setData(field, value);
      return;
    }

    if (value === '') {
      setData(field, '');
      return;
    }

    // Allow decimal numbers up to 100
    if (/^\d*\.?\d*$/.test(value)) {
      const num = parseFloat(value);
      if (isNaN(num)) {
        setData(field, value);
        return;
      }
      if (num <= 100) {
        setData(field, value);
      }
    }
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

  // Helper to calculate runtime total for preview (Kedisiplinan 30%, Kerjasama 30%, Kinerja Praktis 40%)
  const disiplin = parseFloat(data.kedisiplinan) || 0;
  const kerja = parseFloat(data.kerjasama) || 0;
  const praktek = parseFloat(data.kinerja) || 0;
  const totalPreview = disiplin * 0.3 + kerja * 0.3 + praktek * 0.4;

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
              <p className="text-[11px] text-slate-500">Bobot: Disiplin 30%, Kerjasama 30%, Kinerja 40%</p>
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
                            </div>
                            {komponen && (
                              <div className="text-[11px] text-on-surface-variant/80 flex items-center gap-2 font-mono">
                                <span>D: {komponen.kedisiplinan ?? '-'}</span>
                                <span>•</span>
                                <span>K: {komponen.kerjasama ?? '-'}</span>
                                <span>•</span>
                                <span>P: {komponen.kinerja ?? '-'}</span>
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
        <div className="p-0">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-semibold text-on-surface">Evaluasi Kerja Praktik Industri</h2>
              {selectedPendaftaran && (
                <p className="text-sm text-on-surface-variant mt-1">
                  Mahasiswa: <span className="font-semibold text-on-surface">{selectedPendaftaran.mahasiswa?.name || 'Mahasiswa'}</span>{' '}
                  <span className="text-secondary font-mono">({selectedPendaftaran.mahasiswa?.nim || '-'})</span>
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="text-on-surface-variant hover:bg-surface-container p-1.5 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={submitGrading} className="p-6 space-y-6">
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

            <div className="flex items-center justify-between bg-blue-50/70 border border-blue-200 px-3.5 py-2.5 rounded-xl text-xs">
              <span className="text-slate-600 font-medium">Memerlukan blanko fisik Form KP-6a untuk dicetak & dicap?</span>
              <a
                href="/dokumen/lampiran/Lampiran_07_Penilaian_Pembimbing_Lapangan_Form_KP-6a.pdf"
                download
                className="inline-flex items-center gap-1 font-bold text-[#00288e] hover:underline shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Blanko Form KP-6a (PDF)</span>
              </a>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
              <h3 className="text-sm font-display font-semibold text-on-surface mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                Parameter Penilaian Kinerja (Rentang Nilai 0 - 100)
              </h3>

              <div className="space-y-4">
                {[
                  { id: 'kedisiplinan', label: 'Kedisiplinan, Kehadiran & Etika Kerja (Bobot 30%)', error: errors.kedisiplinan },
                  { id: 'kerjasama', label: 'Kemampuan Bekerjasama & Komunikasi Tim (Bobot 30%)', error: errors.kerjasama },
                  { id: 'kinerja', label: 'Kinerja Praktis, Tanggung Jawab & Pemahaman Tugas (Bobot 40%)', error: errors.kinerja },
                ].map((param) => (
                  <div key={param.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label htmlFor={param.id} className="text-sm font-medium text-on-surface-variant sm:w-2/3">
                      {param.label} <span className="text-error">*</span>
                    </label>
                    <div className="sm:w-1/3 flex flex-col">
                      <input
                        id={param.id}
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                        value={data[param.id as keyof typeof data]}
                        onChange={(e) => handleScoreChange(param.id as keyof typeof data, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                          }
                        }}
                        placeholder="Contoh: 85.5"
                        className="w-full bg-surface border border-outline-variant rounded-lg p-2 text-sm text-center font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                      />
                      {param.error && <span className="text-[10px] text-error mt-1">{param.error}</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-5 mt-5 border-t border-outline-variant">
                <div className="flex justify-between items-center bg-surface-low p-4 rounded-xl border border-outline-variant">
                  <div>
                    <span className="text-sm font-display font-semibold text-on-surface block">
                      Agregasi Nilai Instansi (Otomatis)
                    </span>
                    <span className="text-[11px] text-secondary">
                      Formula UTM: (Disiplin × 30%) + (Kerjasama × 30%) + (Kinerja × 40%)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-display font-bold text-primary">{totalPreview.toFixed(1)}</span>
                    <span className="text-xs text-secondary">/ 100</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="catatan" className="block text-sm font-medium text-on-surface mb-2">
                Catatan Evaluasi / Pesan Pembimbing Lapangan (Opsional)
              </label>
              <textarea
                id="catatan"
                rows={3}
                value={data.catatan}
                onChange={(e) => handleScoreChange('catatan', e.target.value)}
                placeholder="Tuliskan masukan atas pencapaian atau hal-hal yang perlu ditingkatkan oleh mahasiswa..."
                className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
              ></textarea>
              {errors.catatan && <p className="text-error text-xs mt-1">{errors.catatan}</p>}
            </div>

            <div className="flex items-center gap-3 bg-secondary-container/30 border border-secondary-container p-4 rounded-xl">
              <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center shrink-0">
                <ScanLine className="w-5 h-5" />
              </div>
              <div className="text-xs text-on-surface-variant leading-relaxed">
                <span className="font-semibold block text-on-surface">Validitas Data Evaluasi</span>
                Nilai yang disimpan akan masuk secara resmi ke rekapitulasi penilaian akhir Program Studi dan dapat ditinjau oleh Dosen Pembimbing.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-outline-variant text-secondary text-sm font-medium rounded-lg hover:bg-surface-container transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={processing || data.kedisiplinan === '' || data.kerjasama === '' || data.kinerja === ''}
                className="px-6 py-2 bg-primary text-on-primary text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
              >
                <Upload size={16} />
                {processing ? 'Menyimpan...' : 'Simpan Nilai'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

EvaluationScreen.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
