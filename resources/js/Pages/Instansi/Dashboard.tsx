import InstansiLayout from '@/Layouts/InstansiLayout';
import { Users, FileText, Building2, CheckCircle2, ChevronRight, BookOpen, Star } from 'lucide-react';
import { usePage, Link } from '@inertiajs/react';

interface Mahasiswa {
  id: number;
  name: string;
  nim: string;
}

interface Pendaftaran {
  id: number;
  mahasiswa_id: number;
  status: string;
  mahasiswa: Mahasiswa;
}

interface Props {
  mahasiswaBimbingan: Pendaftaran[];
  error?: string;
}

export default function DashboardScreen({ mahasiswaBimbingan, error }: Props) {
  const { props } = usePage();
  const user = (props as any).auth?.user;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <Building2 size={64} className="text-error" />
        <h2 className="text-xl font-display font-semibold text-on-surface">Terjadi Kesalahan</h2>
        <p className="text-secondary text-center max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">Dasbor Pembimbing Lapangan</h1>
          <p className="text-sm text-on-surface-variant mt-1">Selamat datang kembali, {user?.name}. Berikut adalah daftar mahasiswa bimbingan Anda.</p>
        </div>
      </div>

      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
          <h2 className="text-lg font-display font-semibold text-on-surface flex items-center gap-2">
            <Users size={20} className="text-primary" />
            Mahasiswa Bimbingan Aktif
          </h2>
          <span className="bg-primary/10 text-primary py-1 px-3 rounded-full text-xs font-bold">
            Total: {mahasiswaBimbingan?.length || 0}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest text-on-surface-variant border-b border-outline-variant">
                <th className="py-4 px-6 font-semibold text-sm w-16">No</th>
                <th className="py-4 px-6 font-semibold text-sm">NIM</th>
                <th className="py-4 px-6 font-semibold text-sm">Nama Mahasiswa</th>
                <th className="py-4 px-6 font-semibold text-sm text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {mahasiswaBimbingan?.length > 0 ? (
                mahasiswaBimbingan.map((pendaftaran, index) => (
                  <tr key={pendaftaran.id} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="py-4 px-6 text-sm text-secondary">{index + 1}</td>
                    <td className="py-4 px-6 text-sm font-medium text-on-surface">{pendaftaran.mahasiswa?.nim || '-'}</td>
                    <td className="py-4 px-6 text-sm font-bold text-primary">{pendaftaran.mahasiswa?.name || 'Mahasiswa'}</td>
                    <td className="py-4 px-6 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={route().has('instansi.logbook') ? route('instansi.logbook') : '#'} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors"
                          title="Monitoring Logbook"
                        >
                          <BookOpen size={14} />
                          Logbook
                        </Link>
                        <Link 
                          href={route().has('instansi.evaluation') ? route('instansi.evaluation') : '#'} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors"
                          title="Beri Penilaian"
                        >
                          <Star size={14} />
                          Penilaian
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 px-6 text-center text-secondary">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText size={48} className="text-outline-variant opacity-50" />
                      <p>Belum ada mahasiswa bimbingan saat ini.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

DashboardScreen.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
