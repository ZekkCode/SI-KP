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
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kuota Bimbingan</span>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-4xl font-bold text-[#00288e]">{kuota.terpakai}</span>
                <span className="text-xs text-slate-500 mb-1">/ {kuota.max} Mahasiswa</span>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-700 p-2.5 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-lg h-2 mt-1 overflow-hidden">
            <div className={`h-full rounded-lg transition-all duration-500 ${barColor}`} style={{ width: `${percentFull}%` }}></div>
          </div>
          <p className="text-xs text-slate-500">Tersedia sisa {kuota.sisa} slot bimbingan periode ini.</p>
        </div>

        {/* Pending Review */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Review Proposal</span>
              <span className="text-4xl font-bold text-slate-800 mt-2">{stats.pendingReview}</span>
            </div>
            <div className="bg-amber-50 text-amber-700 p-2.5 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 pt-3 border-t border-slate-100">Proposal masuk menunggu persetujuan Anda.</p>
        </div>

        {/* Active Monitoring */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pelaksanaan KP</span>
              <span className="text-4xl font-bold text-slate-800 mt-2">{stats.pelaksanaanKp}</span>
            </div>
            <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 pt-3 border-t border-slate-100">Mahasiswa sedang aktif bekerja di instansi.</p>
        </div>
      </div>

      {/* Mahasiswa List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-2">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-base font-bold text-slate-800">Daftar Mahasiswa Bimbingan</h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            Total: {bimbinganList.length}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          {bimbinganList.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Users size={40} className="text-slate-300 mb-3" />
              <p className="font-semibold text-slate-700 text-sm">Belum ada mahasiswa bimbingan</p>
              <p className="text-xs text-slate-500 mt-1">Anda belum dialokasikan untuk membimbing mahasiswa pada periode ini.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-5 w-1/3">Mahasiswa</th>
                  <th className="py-3 px-5">Instansi & Proposal</th>
                  <th className="py-3 px-5">Status KP</th>
                  <th className="py-3 px-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {bimbinganList.map((pendaftaran) => {
                  const statusUi = formatStatus(pendaftaran.status);
                  const proposal = pendaftaran.proposals?.[0];
                  
                  return (
                    <tr key={pendaftaran.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 uppercase border border-blue-100">
                            {pendaftaran.mahasiswa.name.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{pendaftaran.mahasiswa.name}</div>
                            <div className="text-xs text-slate-500 font-mono">{pendaftaran.mahasiswa.nim}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 align-top">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                            <Building2 size={14} className="text-slate-400 shrink-0" />
                            <span className="truncate">{pendaftaran.instansi?.nama_instansi || 'Belum terdata'}</span>
                          </div>
                          <div className="flex items-start gap-1.5 text-xs text-slate-600">
                            <FileText size={14} className="text-slate-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2" title={proposal?.judul}>
                              {proposal?.judul || <span className="text-slate-400 italic">Belum ada judul proposal</span>}
                            </span>
                          </div>
                          {proposal?.status === 'diajukan' && (
                            <span className="inline-flex items-center w-max px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              Perlu Review Proposal
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5 align-top">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border ${statusUi.color}`}>
                          {statusUi.label}
                        </span>
                      </td>
                      <td className="py-4 px-5 align-top text-center">
                        <div className="flex items-center justify-center gap-2">
                          {proposal?.status === 'diajukan' ? (
                            <Link 
                              href={route('dosen.review')} 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00288e] hover:bg-blue-800 text-white text-xs font-semibold transition-colors shadow-sm"
                            >
                              Review <ArrowRight size={13} />
                            </Link>
                          ) : pendaftaran.status === 'aktif' ? (
                            <Link 
                              href={route('dosen.logbook')} 
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                            >
                              Logbook
                            </Link>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">
                              Siap Bimbingan
                            </span>
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
