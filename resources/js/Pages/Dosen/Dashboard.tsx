import DosenLayout from '@/Layouts/DosenLayout';
import { Link } from '@inertiajs/react';
import { Users, Clock, TrendingUp, ArrowRight, Building2, FileText, CheckCircle2 } from 'lucide-react';

interface Mahasiswa {
  id: number;
  name: string;
  nim: string;
}

interface Instansi {
  id: number;
  nama_instansi: string;
  kota: string;
}

interface Proposal {
  id: number;
  judul: string;
  status: string;
}

interface Pendaftaran {
  id: number;
  status: string;
  mahasiswa: Mahasiswa;
  instansi: Instansi | null;
  proposals: Proposal[];
}

interface DashboardProps {
  kuota: {
    max: number;
    terpakai: number;
    sisa: number;
  };
  stats: {
    totalBimbingan: number;
    pendingReview: number;
    pelaksanaanKp: number;
  };
  bimbinganList: Pendaftaran[];
}

export default function DashboardScreen({ kuota, stats, bimbinganList }: DashboardProps) {
  // Hitung persentase kuota terpakai
  const percentFull = Math.min(100, Math.round((kuota.terpakai / kuota.max) * 100));
  let barColor = 'bg-primary';
  if (percentFull > 75) barColor = 'bg-error';
  else if (percentFull > 50) barColor = 'bg-tertiary';

  // Format label status
  const formatStatus = (status: string) => {
    switch(status) {
      case 'aktif': return { label: 'Sedang KP', color: 'bg-primary-container text-on-primary-container border-primary' };
      case 'selesai': return { label: 'Selesai KP', color: 'bg-tertiary-container text-on-tertiary-container border-tertiary' };
      case 'plotting_dosen': 
      case 'diterima_instansi':
      case 'verifikasi_surat_balasan':
        return { label: 'Persiapan KP', color: 'bg-secondary-container text-on-secondary-container border-secondary' };
      default: return { label: status.replace('_', ' '), color: 'bg-surface-variant text-on-surface-variant border-outline-variant' };
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">Dashboard Pembimbing</h1>
          <p className="text-sm text-on-surface-variant mt-1">Ringkasan aktivitas bimbingan Kerja Praktik mahasiswa.</p>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quota Card */}
        <div className="bg-surface-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary-container rounded-full opacity-20"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Kuota Bimbingan</span>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-4xl font-display text-primary font-bold">{kuota.terpakai}</span>
                <span className="text-sm text-on-surface-variant mb-1">/ {kuota.max} Mahasiswa</span>
              </div>
            </div>
            <div className="bg-primary-container text-primary p-3 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-surface-high rounded-full h-2 mt-2 relative z-10 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${percentFull}%` }}></div>
          </div>
          <p className="text-xs text-secondary mt-1 relative z-10">Sisa {kuota.sisa} slot bimbingan tersedia.</p>
        </div>

        {/* Pending Review */}
        <div className="bg-surface-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Review Proposal</span>
              <span className="text-3xl font-display text-on-surface font-bold mt-2">{stats.pendingReview}</span>
            </div>
            <div className="bg-error-container text-error p-3 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-secondary mt-auto pt-4 border-t border-outline-variant">Menunggu persetujuan Anda.</p>
        </div>

        {/* Active Monitoring */}
        <div className="bg-surface-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Pelaksanaan KP</span>
              <span className="text-3xl font-display text-on-surface font-bold mt-2">{stats.pelaksanaanKp}</span>
            </div>
            <div className="bg-secondary-container text-on-secondary-container p-3 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-secondary mt-auto pt-4 border-t border-outline-variant">Mahasiswa sedang di instansi.</p>
        </div>
      </div>

      {/* Mahasiswa List */}
      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mt-4">
        <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface-lowest">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Daftar Mahasiswa Bimbingan</h2>
        </div>
        
        <div className="overflow-x-auto">
          {bimbinganList.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center">
              <Users size={48} className="text-outline mb-4 opacity-50" />
              <p className="font-body-lg text-on-surface">Belum ada mahasiswa bimbingan</p>
              <p className="font-body-md text-secondary mt-1">Anda belum diplot untuk membimbing mahasiswa pada periode ini.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant text-sm font-medium">
                  <th className="py-3 px-4 w-1/3">Mahasiswa</th>
                  <th className="py-3 px-4">Instansi & Topik</th>
                  <th className="py-3 px-4">Status KP</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {bimbinganList.map((pendaftaran) => {
                  const statusUi = formatStatus(pendaftaran.status);
                  const proposal = pendaftaran.proposals?.[0];
                  
                  return (
                    <tr key={pendaftaran.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                            {pendaftaran.mahasiswa.name.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-medium text-on-surface">{pendaftaran.mahasiswa.name}</div>
                            <div className="text-sm text-secondary">{pendaftaran.mahasiswa.nim}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 text-sm text-on-surface">
                            <Building2 size={14} className="text-outline shrink-0" />
                            <span className="truncate">{pendaftaran.instansi?.nama_instansi || 'Belum ada instansi'}</span>
                          </div>
                          <div className="flex items-start gap-1.5 text-sm text-on-surface">
                            <FileText size={14} className="text-outline shrink-0 mt-0.5" />
                            <span className="line-clamp-2" title={proposal?.judul}>
                              {proposal?.judul || <span className="text-secondary italic">Belum ada proposal</span>}
                            </span>
                          </div>
                          {proposal?.status === 'diajukan' && (
                            <span className="inline-flex items-center w-max px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-error">
                              PERLU REVIEW PROPOSAL
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${statusUi.color}`}>
                          {statusUi.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 align-top text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {proposal?.status === 'diajukan' ? (
                            <Link 
                              href={route('dosen.review')} 
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                              Review <ArrowRight size={14} />
                            </Link>
                          ) : pendaftaran.status === 'aktif' ? (
                            <Link 
                              href={route('dosen.logbook')} 
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary text-primary bg-primary-container/20 text-sm font-medium hover:bg-primary-container/40 transition-colors"
                            >
                              Logbook
                            </Link>
                          ) : (
                            <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline text-secondary text-sm font-medium hover:bg-surface-container transition-colors">
                              Detail
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

DashboardScreen.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
