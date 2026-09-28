import React, { useState } from 'react';
import DosenLayout from '@/Layouts/DosenLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  BookOpen, 
  Award, 
  ChevronRight,
  Building2,
  ExternalLink,
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
  avatar?: string;
}

interface Instansi {
  id?: number;
  nama: string;
  kota?: string;
}

interface PembimbingLapangan {
  nama: string;
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
  approved_dosen: number;
  approved_instansi: number;
  pending_dosen: number;
}

interface Penilaian {
  is_dinilai_dosen: boolean;
  nilai_pembimbing: number | null;
  is_dinilai_instansi: boolean;
  nilai_instansi: number | null;
  nilai_total: number | null;
  nilai_huruf: string | null;
}

interface StudentMonitoring {
  id: number;
  status: string;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  mahasiswa: Mahasiswa;
  instansi: Instansi;
  pembimbing_lapangan: PembimbingLapangan;
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
    proposal_pending: number;
    logbook_pending: number;
    siap_dinilai: number;
    selesai: number;
  };
  filters: {
    status: string;
    search: string;
  };
}

export default function MonitoringScreen({ mahasiswas, stats, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

  const handleFilter = (statusVal: string) => {
    setSelectedStatus(statusVal);
    router.get(
      route('dosen.monitoring'),
      { status: statusVal, search: searchTerm },
      { preserveState: true, replace: true }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      route('dosen.monitoring'),
      { status: selectedStatus, search: searchTerm },
      { preserveState: true, replace: true }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aktif':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Aktif KP</span>;
      case 'selesai':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Selesai</span>;
      case 'disetujui_tu':
      case 'diverifikasi_tu':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">Verifikasi TU</span>;
      case 'diajukan':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Pendaftaran Baru</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">{status?.replace('_', ' ')}</span>;
    }
  };

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
      <Head title="Monitoring Mahasiswa KP" />

      <PageHeader
        title="Monitoring Progres Mahasiswa KP"
        description="Pantau tahapan lengkap pelaksanaan Kerja Praktik mahasiswa bimbingan Anda dari pendaftaran, proposal, logbook harian hingga penilaian."
      />

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Total Bimbingan</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-on-surface">{stats.total}</span>
            <Users className="w-5 h-5 text-primary opacity-60" />
          </div>
        </div>

        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Aktif KP</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-emerald-700">{stats.aktif}</span>
            <Clock className="w-5 h-5 text-emerald-600 opacity-60" />
          </div>
        </div>

        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Review Proposal</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-amber-700">{stats.proposal_pending}</span>
            <FileText className="w-5 h-5 text-amber-600 opacity-60" />
          </div>
        </div>

        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">Validasi Logbook</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-indigo-700">{stats.logbook_pending}</span>
            <ClipboardList className="w-5 h-5 text-indigo-600 opacity-60" />
          </div>
        </div>

        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Siap Dinilai</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-rose-700">{stats.siap_dinilai}</span>
            <Award className="w-5 h-5 text-rose-600 opacity-60" />
          </div>
        </div>

        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Selesai KP</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-blue-700">{stats.selesai}</span>
            <CheckCircle2 className="w-5 h-5 text-blue-600 opacity-60" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'aktif', label: 'Aktif KP' },
            { id: 'diajukan', label: 'Mahasiswa Baru' },
            { id: 'selesai', label: 'Selesai' },
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
            placeholder="Cari mahasiswa, NIM, atau instansi..."
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
            <h3 className="text-base font-bold text-on-surface">Tidak ada data mahasiswa bimbingan</h3>
            <p className="text-xs text-secondary mt-1 max-w-sm">
              Belum ada data mahasiswa bimbingan yang cocok dengan kriteria filter saat ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <ModernTable>
              <ModernTableHeader>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-secondary text-xs font-semibold">
                  <ModernTableTh>Mahasiswa</ModernTableTh>
                  <ModernTableTh>Progres KP</ModernTableTh>
                  <ModernTableTh>Proposal KP</ModernTableTh>
                  <ModernTableTh>Logbook Harian</ModernTableTh>
                  <ModernTableTh>Penilaian Dosen</ModernTableTh>
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
                            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-primary">
                              <Building2 className="w-3 h-3" />
                              <span className="truncate max-w-[160px]">{item.instansi.nama}</span>
                            </div>
                          </div>
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

                      {/* Proposal Status */}
                      <ModernTableTd>
                        {item.proposal ? (
                          <div className="space-y-1 max-w-[200px]">
                            <p className="text-xs font-medium text-on-surface line-clamp-1" title={item.proposal.judul}>
                              {item.proposal.judul}
                            </p>
                            <div className="flex items-center gap-1.5">
                              {item.proposal.status === 'disetujui' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" /> Disetujui
                                </span>
                              ) : item.proposal.status === 'revisi' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                  <AlertCircle className="w-3 h-3" /> Perlu Revisi
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  <Clock className="w-3 h-3" /> Perlu Review
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-secondary italic">Belum upload</span>
                        )}
                      </ModernTableTd>

                      {/* Logbook Status */}
                      <ModernTableTd>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold text-on-surface">{item.logbook.total} Entri</span>
                            <span className="text-[11px] text-emerald-600 font-medium">({item.logbook.approved_dosen} divalidasi)</span>
                          </div>
                          {item.logbook.pending_dosen > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              {item.logbook.pending_dosen} menunggu Anda
                            </span>
                          ) : (
                            <span className="text-[11px] text-secondary">Semua entri telah divalidasi</span>
                          )}
                        </div>
                      </ModernTableTd>

                      {/* Penilaian Dosen */}
                      <ModernTableTd>
                        {item.penilaian.is_dinilai_dosen ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-xs font-bold text-emerald-700">
                                Nilai: {item.penilaian.nilai_pembimbing}
                              </span>
                            </div>
                            {item.penilaian.nilai_huruf && (
                              <span className="text-[11px] text-secondary">
                                Nilai Akhir: <strong className="text-primary">{item.penilaian.nilai_huruf}</strong> ({item.penilaian.nilai_total})
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                            <Clock className="w-3 h-3" /> Belum dinilai
                          </span>
                        )}
                      </ModernTableTd>

                      {/* Action Shortcuts */}
                      <ModernTableTd className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {item.proposal && (
                            <Link
                              href={route('dosen.review.show', item.proposal.id)}
                              className="p-1.5 text-secondary hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                              title="Review Proposal"
                            >
                              <FileText className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            href={route('dosen.logbook')}
                            className="p-1.5 text-secondary hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                            title="Validasi Logbook"
                          >
                            <ClipboardList className="w-4 h-4" />
                          </Link>
                          <Link
                            href={route('dosen.penilaian.create', item.id)}
                            className="p-1.5 text-secondary hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                            title="Beri Nilai"
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

MonitoringScreen.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
