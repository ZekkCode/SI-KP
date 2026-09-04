import InstansiLayout from '@/Layouts/InstansiLayout';
import { Head, Link } from '@inertiajs/react';
import { Search, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
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

export default function Index({ logbooks, error }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogbooks = logbooks.filter(item => {
    return item.pendaftaran?.mahasiswa?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disetujui':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 size={14} />
            Disetujui
          </span>
        );
      case 'revisi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-error/10 text-error border border-error/20">
            <XCircle size={14} />
            Revisi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle size={14} />
            Menunggu
          </span>
        );
    }
  };

  return (
    <div className="animate-in fade-in duration-300 p-4 md:p-8">
      <Head title="Monitoring Logbook" />
      
      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Header */}
      <PageHeader title="Monitoring Kegiatan Mahasiswa" description="Daftar logbook harian mahasiswa bimbingan yang perlu divalidasi (Khusus Instansi)." />

      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-outline-variant bg-surface-container-low flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama mahasiswa atau deskripsi..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <ModernTable>
            <ModernTableHeader>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <ModernTableTh className="w-[5%] text-center">No</ModernTableTh>
                <ModernTableTh className="w-[15%]">Tanggal & Waktu</ModernTableTh>
                <ModernTableTh className="w-[20%]">Mahasiswa</ModernTableTh>
                <ModernTableTh className="w-[35%]">Deskripsi</ModernTableTh>
                <ModernTableTh className="w-[15%] text-center">Status</ModernTableTh>
                <ModernTableTh className="w-[10%] text-center">Aksi</ModernTableTh>
              </tr>
            </ModernTableHeader>
            <ModernTableBody>
              {filteredLogbooks.length === 0 ? (
                <tr>
                  <ModernTableTd>
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline">
                        <FileText size={24} />
                      </div>
                      <p>{searchTerm ? 'Tidak ada logbook yang cocok.' : 'Belum ada logbook mahasiswa yang masuk.'}</p>
                    </div>
                  </ModernTableTd>
                </tr>
              ) : (
                filteredLogbooks.map((item, index) => (
                  <tr key={item.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                    <ModernTableTd className="text-center">{index + 1}</ModernTableTd>
                    <ModernTableTd>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-on-surface">
                          {new Date(item.tanggal).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          {item.jam_mulai && item.jam_selesai ? `${item.jam_mulai.substring(0, 5)} - ${item.jam_selesai.substring(0, 5)}` : '-'}
                        </span>
                      </div>
                    </ModernTableTd>
                    <ModernTableTd>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-on-surface">{item.pendaftaran?.mahasiswa?.name}</span>
                        <span className="text-xs text-on-surface-variant">{item.pendaftaran?.mahasiswa?.nim}</span>
                      </div>
                    </ModernTableTd>
                    <ModernTableTd>
                      <p className="line-clamp-2">{item.deskripsi}</p>
                    </ModernTableTd>
                    <ModernTableTd className="text-center">
                      {getStatusBadge(item.status_instansi)}
                    </ModernTableTd>
                    <ModernTableTd className="text-center">
                      <Link
                        href={route('instansi.logbook.edit', item.id)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors"
                      >
                        {item.status_instansi === 'menunggu' ? 'Validasi' : 'Lihat'}
                      </Link>
                    </ModernTableTd>
                  </tr>
                ))
              )}
            </ModernTableBody>
          </ModernTable>
        </div>
      </div>
    </div>
  );
}

Index.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
