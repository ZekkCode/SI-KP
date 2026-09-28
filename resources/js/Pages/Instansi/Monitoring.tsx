import React, { useState } from 'react';
import InstansiLayout from '@/Layouts/InstansiLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  BookOpen, 
  Award, 
  Download,
  Building2,
  GraduationCap,
  ClipboardList
} from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';
import { getAvatarUrl } from '@/utils/avatar';

interface Mahasiswa {
  id: number;
  name: string;
  nim: string;
  email?: string;
  telepon?: string;
  avatar?: string;
}

interface DosenPembimbing {
  name: string;
  email?: string;
  telepon?: string;
}

interface SuratPengantar {
  nomor_surat: string;
  confirmation_status: string;
  confirmed_at?: string;
}

interface Proposal {
  id: number;
  judul: string;
  status: string;
  file_path?: string;
}

interface Logbook {
  total: number;
  approved_instansi: number;
  pending_instansi: number;
}

interface Penilaian {
  is_dinilai_instansi: boolean;
  nilai_instansi: number | null;
}

interface StudentMonitoring {
  id: number;
  status: string;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  mahasiswa: Mahasiswa;
  dosen_pembimbing: DosenPembimbing;
  surat_pengantar: SuratPengantar | null;
  proposal: Proposal | null;
  logbook: Logbook;
  penilaian: Penilaian;
  progress_percent: number;
}

interface Props {
  mahasiswas: StudentMonitoring[];
  stats: {
    total: number;
    aktif: number;
    logbook_pending: number;
    belum_dinilai: number;
    selesai: number;
  };
  filters: {
    status: string;
    search: string;
  };
  error?: string;
}

export default function InstansiMonitoringScreen({ mahasiswas, stats, filters, error }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

  const handleFilter = (statusVal: string) => {
    setSelectedStatus(statusVal);
    router.get(
      route('instansi.monitoring'),
      { status: statusVal, search: searchTerm },
      { preserveState: true, replace: true }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      route('instansi.monitoring'),
      { status: selectedStatus, search: searchTerm },
      { preserveState: true, replace: true }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aktif':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Aktif Magang</span>;
      case 'selesai':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Selesai Magang</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">{status?.replace('_', ' ')}</span>;
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Building2 size={64} className="text-error opacity-70" />
        <h2 className="text-xl font-display font-semibold text-on-surface">Akses Terbatas</h2>
        <p className="text-secondary text-center max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full space-y-6">
      <Head title="Monitoring Mahasiswa KP" />

      <PageHeader
        title="Monitoring Mahasiswa Magang"
        description="Pantau progres pelaksanaan Kerja Praktik mahasiswa di perusahaan Anda, mulai dari proposal, kehadiran & logbook harian hingga evaluasi nilai."
      />

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Total Mahasiswa</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-on-surface">{stats.total}</span>
            <Users className="w-6 h-6 text-primary opacity-60" />
          </div>
        </div>

        <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Aktif Magang</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-emerald-700">{stats.aktif}</span>
            <Clock className="w-6 h-6 text-emerald-600 opacity-60" />
          </div>
        </div>

        <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-100 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Logbook Perlu Validasi</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-amber-700">{stats.logbook_pending}</span>
            <ClipboardList className="w-6 h-6 text-amber-600 opacity-60" />
          </div>
        </div>

        <div className="bg-rose-50/50 p-5 rounded-xl border border-rose-100 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Belum Dinilai</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-rose-700">{stats.belum_dinilai}</span>
            <Award className="w-6 h-6 text-rose-600 opacity-60" />
          </div>
        </div>

        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Selesai Magang</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-blue-700">{stats.selesai}</span>
            <CheckCircle2 className="w-6 h-6 text-blue-600 opacity-60" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: 'Semua Mahasiswa' },
            { id: 'aktif', label: 'Aktif Magang' },
            { id: 'selesai', label: 'Selesai Magang' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Cari nama mahasiswa atau NIM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </form>
      </div>

      {/* Monitoring Table */}
      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {mahasiswas.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Users className="w-12 h-12 text-outline mb-3 opacity-40" />
            <h3 className="text-base font-bold text-on-surface">Belum ada mahasiswa magang</h3>
            <p className="text-xs text-secondary mt-1 max-w-sm">
              Tidak ada data mahasiswa magang yang sesuai dengan filter yang dipilih.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <ModernTable>
              <ModernTableHeader>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-secondary text-xs font-semibold">
                  <ModernTableTh>Mahasiswa</ModernTableTh>
                  <ModernTableTh>Dosen Pembimbing</ModernTableTh>
                  <ModernTableTh>Progres Magang</ModernTableTh>
                  <ModernTableTh>Proposal KP</ModernTableTh>
                  <ModernTableTh>Logbook Magang</ModernTableTh>
                  <ModernTableTh>Evaluasi Industri</ModernTableTh>
                  <ModernTableTh className="text-center">Aksi Cepat</ModernTableTh>
                </tr>
              </ModernTableHeader>
              <ModernTableBody>
                {mahasiswas.map((item) => {
                  const avatar = getAvatarUrl(item.mahasiswa.avatar);
                  return (
                    <tr key={item.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      {/* Mahasiswa Info */}
                      <ModernTableTd>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs overflow-hidden flex-shrink-0">
                            {avatar ? (
                              <img src={avatar} alt={item.mahasiswa.name} className="w-full h-full object-cover" />
                            ) : (
                              item.mahasiswa.name.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-on-surface">{item.mahasiswa.name}</div>
                            <div className="text-xs text-secondary font-mono">{item.mahasiswa.nim}</div>
                            {item.mahasiswa.telepon && (
                              <div className="text-[11px] text-secondary mt-0.5">{item.mahasiswa.telepon}</div>
                            )}
                          </div>
                        </div>
                      </ModernTableTd>

                      {/* Dosen Pembimbing */}
                      <ModernTableTd>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface">
                            <GraduationCap className="w-3.5 h-3.5 text-primary" />
                            <span>{item.dosen_pembimbing.name}</span>
                          </div>
                          {item.dosen_pembimbing.email && (
                            <div className="text-[11px] text-secondary">{item.dosen_pembimbing.email}</div>
                          )}
                        </div>
                      </ModernTableTd>

                      {/* Progress Bar & Status */}
                      <ModernTableTd>
                        <div className="space-y-1.5 min-w-[130px]">
                          <div className="flex justify-between items-center text-xs">
                            {getStatusBadge(item.status)}
                            <span className="font-bold text-xs text-primary">{item.progress_percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${
                                item.progress_percent >= 90
                                  ? 'bg-emerald-500'
                                  : item.progress_percent >= 50
                                  ? 'bg-primary'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${item.progress_percent}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-secondary">
                            {item.tanggal_mulai ? `${item.tanggal_mulai} - ${item.tanggal_selesai || '...'}` : 'Jadwal belum diatur'}
                          </div>
                        </div>
                      </ModernTableTd>

                      {/* Proposal Status & Download */}
                      <ModernTableTd>
                        {item.proposal ? (
                          <div className="space-y-1 max-w-[180px]">
                            <p className="text-xs font-medium text-on-surface line-clamp-1" title={item.proposal.judul}>
                              {item.proposal.judul}
                            </p>
                            <a
                              href={route('instansi.proposal.download', item.proposal.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                            >
                              <Download className="w-3 h-3" /> Unduh Dokumen
                            </a>
                          </div>
                        ) : (
                          <span className="text-xs text-secondary italic">Belum diunggah</span>
                        )}
                      </ModernTableTd>

                      {/* Logbook Status */}
                      <ModernTableTd>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold text-on-surface">{item.logbook.total} Entri</span>
                            <span className="text-[11px] text-emerald-600 font-medium">({item.logbook.approved_instansi} disetujui)</span>
                          </div>
                          {item.logbook.pending_instansi > 0 ? (
                            <Link
                              href={route('instansi.logbook')}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 hover:bg-amber-100 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              {item.logbook.pending_instansi} menunggu validasi
                            </Link>
                          ) : (
                            <span className="text-[11px] text-secondary">Semua entri telah divalidasi</span>
                          )}
                        </div>
                      </ModernTableTd>

                      {/* Evaluasi Instansi */}
                      <ModernTableTd>
                        {item.penilaian.is_dinilai_instansi ? (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Nilai: {item.penilaian.nilai_instansi}</span>
                          </div>
                        ) : (
                          <Link
                            href={route('instansi.evaluation')}
                            className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium hover:bg-amber-100 transition-colors"
                          >
                            <Clock className="w-3 h-3" /> Beri Penilaian
                          </Link>
                        )}
                      </ModernTableTd>

                      {/* Action Shortcuts */}
                      <ModernTableTd className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {item.proposal && (
                            <a
                              href={route('instansi.proposal.download', item.proposal.id)}
                              className="p-1.5 text-secondary hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                              title="Download Proposal"
                            >
                              <FileText className="w-4 h-4" />
                            </a>
                          )}
                          <Link
                            href={route('instansi.logbook')}
                            className="p-1.5 text-secondary hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                            title="Review Logbook"
                          >
                            <ClipboardList className="w-4 h-4" />
                          </Link>
                          <Link
                            href={route('instansi.evaluation')}
                            className="p-1.5 text-secondary hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                            title="Input Evaluasi Nilai"
                          >
                            <Award className="w-4 h-4" />
                          </Link>
                        </div>
                      </ModernTableTd>
                    </tr>
                  );
                })}
              </ModernTableBody>
            </ModernTable>
          </div>
        )}
      </div>
    </div>
  );
}

InstansiMonitoringScreen.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
