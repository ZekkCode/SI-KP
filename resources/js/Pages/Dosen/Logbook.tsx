import DosenLayout from '@/Layouts/DosenLayout';
import { Link } from '@inertiajs/react';
import { Clock, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

interface Mahasiswa {
  name: string;
  nim: string;
}

interface Pendaftaran {
  mahasiswa: Mahasiswa;
}

interface LogbookEntry {
  id: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  deskripsi: string;
  path_foto: string | null;
  status_dosen: string;
  catatan_dosen: string | null;
  pendaftaran: Pendaftaran;
}

interface Props {
  logbooks: LogbookEntry[];
}

export default function LogbookScreen({ logbooks }: Props) {

  const formatStatus = (status: string) => {
    switch (status) {
      case 'menunggu': return { label: 'Menunggu', color: 'bg-error-container text-error' };
      case 'revisi': return { label: 'Revisi', color: 'bg-tertiary-container text-on-tertiary-container' };
      case 'disetujui': return { label: 'Disetujui', color: 'bg-primary-container text-on-primary-container' };
      default: return { label: status, color: 'bg-surface-variant text-on-surface-variant' };
    }
  };

  const pendingCount = logbooks.filter(l => l.status_dosen === 'menunggu').length;
  const approvedCount = logbooks.filter(l => l.status_dosen === 'disetujui').length;

  return (
    <div className="flex flex-col max-w-6xl mx-auto w-full p-6 space-y-6">
      <PageHeader 
        title="Monitoring Kegiatan" 
        description="Daftar kegiatan harian mahasiswa bimbingan yang membutuhkan validasi."
      />

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Total Entri</span>
          <span className="text-4xl text-gray-800 font-bold">{logbooks.length}</span>
        </div>
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-red-600 mb-1 uppercase tracking-wider">Menunggu Validasi</span>
          <span className="text-4xl text-red-600 font-bold">{pendingCount}</span>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Tervalidasi</span>
          <span className="text-4xl text-primary font-bold">{approvedCount}</span>
        </div>
      </div>

      {/* Logbook List */}
      {logbooks.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center bg-white rounded-xl border border-gray-200 shadow-sm">
          <Clock size={48} className="text-gray-300 mb-4" />
          <p className="text-lg text-gray-800 font-semibold">Belum ada logbook</p>
          <p className="text-sm text-gray-500 mt-1">Mahasiswa bimbingan Anda belum mengisi catatan kegiatan harian.</p>
        </div>
      ) : (
        <ModernTable>
          <ModernTableHeader>
            <ModernTableTh className="w-1/4">Mahasiswa</ModernTableTh>
            <ModernTableTh className="w-1/5">Waktu Kegiatan</ModernTableTh>
            <ModernTableTh className="w-1/3">Deskripsi Singkat</ModernTableTh>
            <ModernTableTh>Status</ModernTableTh>
            <ModernTableTh className="text-center">Aksi</ModernTableTh>
          </ModernTableHeader>
          <ModernTableBody>
            {logbooks.map((entry) => {
              const statusUi = formatStatus(entry.status_dosen);
              
              return (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <ModernTableTd>
                    <div className="font-bold text-slate-800">{entry.pendaftaran.mahasiswa.name}</div>
                    <div className="text-slate-500">{entry.pendaftaran.mahasiswa.nim}</div>
                  </ModernTableTd>
                  <ModernTableTd>
                    <div className="font-medium text-slate-800">
                      {new Date(entry.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {entry.jam_mulai?.substring(0, 5)} - {entry.jam_selesai?.substring(0, 5)}
                    </div>
                  </ModernTableTd>
                  <ModernTableTd>
                    <div className="text-slate-700 line-clamp-2" title={entry.deskripsi}>
                      {entry.deskripsi}
                    </div>
                    {entry.path_foto && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-blue-700 font-semibold bg-blue-50 w-fit px-2 py-0.5 rounded-md border border-blue-100">
                        <ImageIcon size={12} /> FOTO TERLAMPIR
                      </div>
                    )}
                  </ModernTableTd>
                  <ModernTableTd>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${statusUi.color}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      {statusUi.label}
                    </span>
                  </ModernTableTd>
                  <ModernTableTd className="text-center">
                    <Link 
                      href={route('dosen.logbook.review', entry.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        entry.status_dosen === 'menunggu' 
                          ? 'bg-primary text-white hover:bg-primary/90 shadow-sm'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {entry.status_dosen === 'menunggu' ? 'Validasi Kegiatan' : 'Lihat Detail'}
                    </Link>
                  </ModernTableTd>
                </tr>
              );
            })}
          </ModernTableBody>
        </ModernTable>
      )}
    </div>
  );
}

LogbookScreen.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
