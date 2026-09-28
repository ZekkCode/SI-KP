import InstansiLayout from '@/Layouts/InstansiLayout';
import { Head, Link } from '@inertiajs/react';
import { Search, FileText, CheckCircle2, XCircle, AlertCircle, Clock, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

interface Mahasiswa {
  id: number;
  name: string;
  nim: string;
}

interface Pendaftaran {
  mahasiswa: Mahasiswa;
}

interface Logbook {
  id: number;
  pendaftaran: Pendaftaran;
  tanggal: string;
  jam_mulai: string | null;
  jam_selesai: string | null;
  deskripsi: string;
  path_foto: string | null;
  status_instansi: string;
  catatan_instansi: string | null;
}

interface Props {
  logbooks: Logbook[];
  error?: string;
}

export default function LogbookIndex({ logbooks, error }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'menunggu' | 'disetujui' | 'revisi'>('all');

  const filteredLogbooks = logbooks.filter((item) => {
    const matchesSearch =
      item.pendaftaran?.mahasiswa?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pendaftaran?.mahasiswa?.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedFilter === 'all' ? true : item.status_instansi === selectedFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = logbooks.filter((l) => l.status_instansi === 'menunggu').length;
  const approvedCount = logbooks.filter((l) => l.status_instansi === 'disetujui').length;
  const revisionCount = logbooks.filter((l) => l.status_instansi === 'revisi').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disetujui':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} />
            Disetujui
          </span>
        );
      case 'revisi':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle size={13} />
            Perlu Revisi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle size={13} />
            Menunggu Validasi
          </span>
        );
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full space-y-6">
      <Head title="Logbook Kegiatan Mahasiswa" />

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <PageHeader
        title="Logbook Kegiatan Mahasiswa"
        description="Review dan validasi catatan aktivitas harian mahasiswa magang di instansi / perusahaan Anda."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Total Entri Logbook</span>
          <span className="text-3xl font-bold text-on-surface mt-2">{logbooks.length}</span>
        </div>

        <div className="bg-amber-50/60 p-5 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Menunggu Validasi</span>
            {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
          </div>
          <span className="text-3xl font-bold text-amber-700 mt-2">{pendingCount}</span>
        </div>

        <div className="bg-emerald-50/60 p-5 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Telah Disetujui</span>
          <span className="text-3xl font-bold text-emerald-700 mt-2">{approvedCount}</span>
        </div>

        <div className="bg-rose-50/60 p-5 rounded-xl border border-rose-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Perlu Revisi</span>
          <span className="text-3xl font-bold text-rose-700 mt-2">{revisionCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'menunggu', label: `Menunggu (${pendingCount})` },
            { id: 'disetujui', label: `Disetujui (${approvedCount})` },
            { id: 'revisi', label: `Revisi (${revisionCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Cari mahasiswa atau isi logbook..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Logbook Table */}
      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {filteredLogbooks.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <FileText className="w-12 h-12 text-outline mb-3 opacity-40" />
            <h3 className="text-base font-bold text-on-surface">Tidak ada entri logbook</h3>
            <p className="text-xs text-secondary mt-1 max-w-sm">
              Tidak ada catatan kegiatan mahasiswa yang cocok dengan kriteria pencarian atau filter saat ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <ModernTable>
              <ModernTableHeader>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-secondary text-xs font-semibold">
                  <ModernTableTh>Mahasiswa</ModernTableTh>
                  <ModernTableTh>Waktu & Tanggal</ModernTableTh>
                  <ModernTableTh>Aktivitas / Kegiatan</ModernTableTh>
                  <ModernTableTh>Dokumentasi</ModernTableTh>
                  <ModernTableTh>Status Validasi</ModernTableTh>
                  <ModernTableTh className="text-center">Aksi</ModernTableTh>
                </tr>
              </ModernTableHeader>
              <ModernTableBody>
                {filteredLogbooks.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    {/* Mahasiswa */}
                    <ModernTableTd>
                      <div className="font-semibold text-sm text-on-surface">
                        {item.pendaftaran?.mahasiswa?.name || 'Mahasiswa'}
                      </div>
                      <div className="text-xs text-secondary font-mono">
                        {item.pendaftaran?.mahasiswa?.nim || '-'}
                      </div>
                    </ModernTableTd>

                    {/* Tanggal & Waktu */}
                    <ModernTableTd>
                      <div className="font-medium text-xs text-on-surface">
                        {new Date(item.tanggal).toLocaleDateString('id-ID', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[11px] text-secondary flex items-center gap-1 mt-0.5">
                        <Clock size={12} />
                        <span>
                          {item.jam_mulai ? `${item.jam_mulai.substring(0, 5)} - ${item.jam_selesai?.substring(0, 5) || 'Selesai'}` : '-'}
                        </span>
                      </div>
                    </ModernTableTd>

                    {/* Deskripsi */}
                    <ModernTableTd>
                      <div className="max-w-md">
                        <p className="text-xs text-on-surface line-clamp-2 leading-relaxed">
                          {item.deskripsi}
                        </p>
                        {item.catatan_instansi && (
                          <div className="mt-1.5 p-2 bg-amber-50/70 border border-amber-200/60 rounded text-[11px] text-amber-900">
                            <strong>Catatan Anda:</strong> {item.catatan_instansi}
                          </div>
                        )}
                      </div>
                    </ModernTableTd>

                    {/* Dokumentasi */}
                    <ModernTableTd>
                      {item.path_foto ? (
                        <a
                          href={`/storage/${item.path_foto}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline bg-primary/5 px-2.5 py-1 rounded-md border border-primary/20"
                        >
                          <ImageIcon size={13} />
                          <span>Lihat Foto</span>
                        </a>
                      ) : (
                        <span className="text-xs text-secondary italic">Tidak ada foto</span>
                      )}
                    </ModernTableTd>

                    {/* Status Validasi */}
                    <ModernTableTd>
                      {getStatusBadge(item.status_instansi)}
                    </ModernTableTd>

                    {/* Aksi */}
                    <ModernTableTd className="text-center">
                      <Link
                        href={route('instansi.logbook.edit', item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                          item.status_instansi === 'menunggu'
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                        }`}
                      >
                        {item.status_instansi === 'menunggu' ? 'Validasi Sekarang' : 'Edit Validasi'}
                      </Link>
                    </ModernTableTd>
                  </tr>
                ))}
              </ModernTableBody>
            </ModernTable>
          </div>
        )}
      </div>
    </div>
  );
}

LogbookIndex.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
