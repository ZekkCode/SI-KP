import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';
import { FileText, CheckCircle, Search, ClipboardCheck, Clock, Printer, ExternalLink, Award } from 'lucide-react';

interface Mahasiswa {
  id: string;
  name: string;
  nim: string;
}

interface DosenPembimbing {
  name: string;
  nip: string;
}

interface BeritaAcara {
  id: number;
  path_file: string;
  status: string;
  catatan?: string;
}

interface Pendaftaran {
  id: string;
  mahasiswa: Mahasiswa;
  instansi?: { nama: string; kota: string };
  dosen_pembimbing?: DosenPembimbing | null;
  nilai_pembimbing?: number | null;
  nilai_instansi?: number | null;
  nilai_total?: number | null;
  nilai_huruf?: string | null;
  berita_acara: BeritaAcara | null;
  is_approved: boolean;
  status_validasi: 'menunggu' | 'disetujui';
  url_file: string | null;
  status_kp: string;
}

interface Props {
  pendaftarans: Pendaftaran[];
}

export default function BeritaAcaraIndex({ pendaftarans = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'menunggu' | 'disetujui'>('all');

  const handleApprove = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menyetujui & menerbitkan Berita Acara (Form KP-5) milik ${name}?`)) {
      router.post(route('prodi.berita-acara.approve', id));
    }
  };

  const filteredPendaftarans = pendaftarans.filter((p) => {
    const matchesSearch =
      p.mahasiswa?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mahasiswa?.nim?.includes(searchTerm);
    if (!matchesSearch) return false;

    if (activeTab === 'menunggu') return !p.is_approved;
    if (activeTab === 'disetujui') return p.is_approved;
    return true;
  });

  const totalWaiting = pendaftarans.filter((p) => !p.is_approved).length;
  const totalApproved = pendaftarans.filter((p) => p.is_approved).length;

  return (
    <>
      <Head title="Validasi & Penerbitan Berita Acara" />
      <div className="animate-in fade-in duration-300 p-4 md:p-8 space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Validasi & Penerbitan Berita Acara KP"
          description="Validasi Berita Acara resmi (Form KP-5) setelah Dosen Pembimbing selesai melakukan penilaian akhir KP."
        />

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Menunggu Validasi</p>
              <h3 className="text-3xl font-extrabold text-amber-600 mt-1">{totalWaiting}</h3>
              <p className="text-xs text-secondary mt-1">Dosen pembimbing selesai menilai</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Telah Disetujui</p>
              <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{totalApproved}</h3>
              <p className="text-xs text-secondary mt-1">Berita acara resmi diterbitkan</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Format Dokumen</p>
              <h3 className="text-xl font-extrabold text-blue-700 mt-1">Form KP-5</h3>
              <p className="text-xs text-secondary mt-1">Auto-generate standar Panduan KP UTM</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <ClipboardCheck size={24} />
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white rounded-xl border border-outline-variant/60 shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Semua ({pendaftarans.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('menunggu')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'menunggu'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Menunggu Validasi ({totalWaiting})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('disetujui')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'disetujui'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Telah Disetujui ({totalApproved})
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Cari Nama Mahasiswa atau NIM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant/50 text-xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <ModernTable>
          <ModernTableHeader>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider w-14">No</th>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider">Mahasiswa & Instansi</th>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider">Nilai Evaluasi</th>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider">Template Form KP-5</th>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider text-right w-44">Aksi</th>
          </ModernTableHeader>
          <ModernTableBody>
            {filteredPendaftarans.map((pendaftaran, i) => (
              <tr key={pendaftaran.id} className="hover:bg-slate-50/70 transition-colors">
                <ModernTableTd className="px-6 py-4 font-semibold text-secondary">{i + 1}</ModernTableTd>
                
                {/* Mahasiswa Info */}
                <ModernTableTd className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md flex items-center justify-center font-bold text-sm bg-primary/10 text-primary shrink-0 ring-1 ring-primary/20">
                      {pendaftaran.mahasiswa?.name?.substring(0, 2).toUpperCase() ?? 'M'}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-sm">{pendaftaran.mahasiswa?.name ?? 'Tanpa Nama'}</p>
                      <p className="text-secondary text-xs font-mono">{pendaftaran.mahasiswa?.nim ?? '-'}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs">
                        {pendaftaran.instansi?.nama || 'Mitra Instansi'}
                      </p>
                    </div>
                  </div>
                </ModernTableTd>

                {/* Nilai */}
                <ModernTableTd className="px-6 py-4">
                  <div className="text-xs space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Dosen:</span>
                      <span className="font-bold text-slate-800">
                        {pendaftaran.nilai_pembimbing !== null && pendaftaran.nilai_pembimbing !== undefined
                          ? Number(pendaftaran.nilai_pembimbing).toFixed(1)
                          : '-'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Industri:</span>
                      <span className="font-bold text-slate-800">
                        {pendaftaran.nilai_instansi !== null && pendaftaran.nilai_instansi !== undefined
                          ? Number(pendaftaran.nilai_instansi).toFixed(1)
                          : '-'}
                      </span>
                    </div>
                    {pendaftaran.nilai_total !== null && (
                      <div className="pt-1 mt-1 border-t border-slate-100 flex items-center gap-1.5">
                        <span className="text-blue-700 font-bold">Total:</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[11px]">
                          {pendaftaran.nilai_total} ({pendaftaran.nilai_huruf})
                        </span>
                      </div>
                    )}
                  </div>
                </ModernTableTd>

                {/* Template Berita Acara Auto-Generate */}
                <ModernTableTd className="px-6 py-4">
                  <div className="flex flex-col gap-1.5 items-start">
                    <a
                      href={route('prodi.berita-acara.preview', pendaftaran.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all font-semibold text-xs border border-blue-200"
                    >
                      <Printer size={13} />
                      Pratinjau Form KP-5 (Auto)
                      <ExternalLink size={11} className="opacity-70" />
                    </a>

                    {pendaftaran.url_file && (
                      <a
                        href={pendaftaran.url_file}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 underline"
                      >
                        <FileText size={11} />
                        Lihat Berkas Scan Mahasiswa
                      </a>
                    )}
                  </div>
                </ModernTableTd>

                {/* Status Validasi */}
                <ModernTableTd className="px-6 py-4">
                  {pendaftaran.is_approved ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle size={12} />
                      Telah Divalidasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock size={12} />
                      Menunggu Validasi
                    </span>
                  )}
                </ModernTableTd>

                {/* Aksi */}
                <ModernTableTd className="px-6 py-4 text-right">
                  {!pendaftaran.is_approved ? (
                    <button
                      type="button"
                      onClick={() => handleApprove(pendaftaran.id, pendaftaran.mahasiswa?.name ?? 'Mahasiswa')}
                      className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95"
                    >
                      <CheckCircle size={14} />
                      Validasi & Terbitkan
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold italic">
                      Sudah Disetujui
                    </span>
                  )}
                </ModernTableTd>
              </tr>
            ))}

            {filteredPendaftarans.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-secondary">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ClipboardCheck size={36} className="text-outline/40" />
                    <p className="font-medium text-sm">Tidak ada dokumen Berita Acara dalam daftar.</p>
                  </div>
                </td>
              </tr>
            )}
          </ModernTableBody>
        </ModernTable>
      </div>
    </>
  );
}

BeritaAcaraIndex.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
