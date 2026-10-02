import InstansiLayout from '@/Layouts/InstansiLayout';
import { Users, FileText, Building2, CheckCircle2, ChevronRight, BookOpen, Star, UserPlus, Clock, ArrowRight } from 'lucide-react';
import { usePage, Link } from '@inertiajs/react';

interface Mahasiswa {
  id: number;
  name: string;
  nim: string;
  program_studi?: {
    nama: string;
  };
}

interface Proposal {
  id: number;
  judul: string;
  status: string;
  versi: number;
}

interface Pendaftaran {
  id: number;
  status: string;
  created_at?: string;
  mahasiswa: Mahasiswa;
  proposals?: Proposal[];
}

interface Props {
  stats?: {
    totalMahasiswa: number;
    menungguKonfirmasi: number;
    aktifKp: number;
    selesai: number;
  };
  mahasiswaBaru?: Pendaftaran[];
  mahasiswaBimbingan: Pendaftaran[];
  error?: string;
}

export default function DashboardScreen({ stats, mahasiswaBaru = [], mahasiswaBimbingan = [], error }: Props) {
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

  const formatStatus = (status: string) => {
    switch (status) {
      case 'surat_terbit':
        return { label: 'Menunggu Konfirmasi', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'diterima_instansi':
      case 'verifikasi_surat_balasan':
      case 'plotting_dosen':
        return { label: 'Diterima Mitra', color: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'aktif':
        return { label: 'Aktif Magang', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'selesai':
        return { label: 'Selesai KP', color: 'bg-slate-100 text-slate-700 border-slate-200' };
      default:
        return { label: status.replace(/_/g, ' '), color: 'bg-slate-50 text-slate-600 border-slate-200' };
    }
  };

  const defaultStats = stats || {
    totalMahasiswa: mahasiswaBimbingan.length,
    menungguKonfirmasi: mahasiswaBimbingan.filter((p) => p.status === 'surat_terbit').length,
    aktifKp: mahasiswaBimbingan.filter((p) => ['aktif', 'diterima_instansi'].includes(p.status)).length,
    selesai: mahasiswaBimbingan.filter((p) => p.status === 'selesai').length,
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">
            Dashboard Pembimbing Lapangan
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Selamat datang, <strong className="text-slate-800">{user?.name}</strong>. Pantau aktivitas dan progres mahasiswa kerja praktik mitra.
          </p>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Mahasiswa</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-display">{defaultStats.totalMahasiswa}</div>
          <p className="text-[11px] text-slate-400">Terdaftar di instansi mitra</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold uppercase tracking-wider">
            <span>Pendaftar Baru</span>
            <UserPlus className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-amber-700 font-display">{defaultStats.menungguKonfirmasi}</div>
          <p className="text-[11px] text-slate-400">Menunggu respons instansi</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-teal-700 text-xs font-semibold uppercase tracking-wider">
            <span>Aktif Bimbingan</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-bold text-teal-700 font-display">{defaultStats.aktifKp}</div>
          <p className="text-[11px] text-slate-400">Tahap magang & pengisian logbook</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold uppercase tracking-wider">
            <span>Selesai KP</span>
            <Star className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-emerald-700 font-display">{defaultStats.selesai}</div>
          <p className="text-[11px] text-slate-400">Telah dievaluasi & selesai</p>
        </div>
      </div>

      {/* Alert Banner: Mahasiswa Baru Mendaftar */}
      {mahasiswaBaru.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <UserPlus className="w-4 h-4 text-[#00288e]" />
              <span>Mahasiswa Baru Mendaftar di Instansi Anda ({mahasiswaBaru.length})</span>
            </div>
            <Link
              href="/instansi/pendaftaran"
              className="text-xs font-bold text-[#00288e] hover:underline flex items-center gap-1"
            >
              <span>Kelola di Pendaftaran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {mahasiswaBaru.slice(0, 3).map((p) => (
              <div key={p.id} className="bg-slate-50/60 p-3.5 rounded-lg border border-slate-200 text-xs space-y-2 shadow-2xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{p.mahasiswa?.name}</span>
                    <span className="font-mono text-slate-400 text-xs">{p.mahasiswa?.nim}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${formatStatus(p.status).color}`}>
                    {formatStatus(p.status).label}
                  </span>
                </div>
                {p.mahasiswa?.program_studi && (
                  <p className="text-slate-500 text-[11px]">{p.mahasiswa.program_studi.nama}</p>
                )}
                <div className="pt-2 border-t border-slate-200/80 flex justify-end">
                  <Link
                    href="/instansi/pendaftaran"
                    className="text-[#00288e] hover:underline font-bold text-xs inline-flex items-center gap-1"
                  >
                    <span>Lihat Berkas</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Table: Mahasiswa Bimbingan */}
      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
          <h2 className="text-lg font-display font-semibold text-on-surface flex items-center gap-2">
            <Users size={20} className="text-primary" />
            Daftar Seluruh Mahasiswa Terhubung
          </h2>
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#00288e] border border-blue-200 py-1 px-2.5 rounded-md text-xs font-semibold">
            Total: {mahasiswaBimbingan?.length || 0} Mahasiswa
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest text-on-surface-variant border-b border-outline-variant">
                <th className="py-4 px-6 font-semibold text-sm w-16">No</th>
                <th className="py-4 px-6 font-semibold text-sm">NIM</th>
                <th className="py-4 px-6 font-semibold text-sm">Nama Mahasiswa</th>
                <th className="py-4 px-6 font-semibold text-sm">Status KP</th>
                <th className="py-4 px-6 font-semibold text-sm text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {mahasiswaBimbingan?.length > 0 ? (
                mahasiswaBimbingan.map((pendaftaran, index) => {
                  const statusUi = formatStatus(pendaftaran.status);
                  return (
                    <tr key={pendaftaran.id} className="hover:bg-surface-container-lowest transition-colors group">
                      <td className="py-4 px-6 text-sm text-secondary font-mono">{index + 1}</td>
                      <td className="py-4 px-6 text-sm font-mono text-on-surface">{pendaftaran.mahasiswa?.nim || '-'}</td>
                      <td className="py-4 px-6 text-sm">
                        <div className="font-bold text-primary">{pendaftaran.mahasiswa?.name || 'Mahasiswa'}</div>
                        {pendaftaran.mahasiswa?.program_studi && (
                          <div className="text-xs text-secondary mt-0.5">{pendaftaran.mahasiswa.program_studi.nama}</div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border ${statusUi.color}`}>
                          {statusUi.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href="/instansi/logbook"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors"
                            title="Monitoring & Validasi Logbook"
                          >
                            <BookOpen size={14} />
                            Logbook
                          </Link>
                          <Link
                            href="/instansi/evaluation"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors"
                            title="Beri Penilaian Evaluasi"
                          >
                            <Star size={14} />
                            Penilaian
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-secondary">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText size={48} className="text-outline-variant opacity-50" />
                      <p className="font-medium">Belum ada mahasiswa bimbingan saat ini.</p>
                      <p className="text-xs text-slate-400">Mahasiswa yang mendaftar dan memilih instansi Anda akan otomatis muncul di sini.</p>
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
