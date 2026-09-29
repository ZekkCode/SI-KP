import ProdiLayout from '@/Layouts/ProdiLayout';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  FileText, 
  Settings, 
  ArrowRight, 
  Briefcase, 
  Calendar, 
  Clock, 
  Award, 
  CheckCircle2, 
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Stats {
  total_mahasiswa: number;
  total_dosen: number;
  total_instansi: number;
  mahasiswa_aktif?: number;
  total_sidang_pending?: number;
  jadwal_sidang_minggu_ini?: number;
  sidang_selesai?: number;
}

interface SidangItem {
  id: number;
  tanggal_formatted: string;
  ruangan: string;
  mahasiswa: string;
  nim: string;
  dosen: string;
}

interface Props {
  stats: Stats;
  sidang_mendatang?: SidangItem[];
  error?: string;
}

export default function ProdiDashboard({ stats, sidang_mendatang = [], error }: Props) {
  const statCards = [
    {
      title: "Mahasiswa Aktif KP",
      value: (stats.mahasiswa_aktif ?? stats.total_mahasiswa).toString(),
      icon: <GraduationCap size={22} />,
      color: "text-blue-600 bg-blue-50 border border-blue-200",
      link: '/prodi/periode',
    },
    {
      title: "Sidang Menunggu Jadwal",
      value: (stats.total_sidang_pending ?? 0).toString(),
      icon: <Clock size={22} />,
      color: "text-amber-700 bg-amber-50 border border-amber-200",
      badge: (stats.total_sidang_pending ?? 0) > 0 ? "Perlu Dijadwalkan" : null,
      link: '/prodi/sidang',
    },
    {
      title: "Jadwal Sidang Minggu Ini",
      value: (stats.jadwal_sidang_minggu_ini ?? 0).toString(),
      icon: <Calendar size={22} />,
      color: "text-indigo-600 bg-indigo-50 border border-indigo-200",
      link: '/prodi/sidang',
    },
    {
      title: "Instansi Mitra",
      value: stats.total_instansi.toString(),
      icon: <Building2 size={22} />,
      color: "text-emerald-600 bg-emerald-50 border border-emerald-200",
      link: '/prodi/mitra-instansi',
    }
  ];

  const quickActions = [
    {
      title: "Penjadwalan Sidang",
      description: "Tinjau dan jadwalkan sidang KP mahasiswa yang telah memenuhi syarat",
      icon: <Calendar size={20} />,
      link: '/prodi/sidang',
      color: "bg-white hover:bg-slate-50 text-slate-900 border-blue-200 hover:border-blue-400"
    },
    {
      title: "Daftar Mitra & Instansi",
      description: "Daftar perusahaan mitra dan data mahasiswa magang di tiap instansi",
      icon: <Building2 size={20} />,
      link: '/prodi/mitra-instansi',
      color: "bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300"
    },
    {
      title: "Arsip Nilai KP",
      description: "Rekapitulasi seluruh nilai KP, persentase kelulusan, dan export data",
      icon: <Award size={20} />,
      link: '/prodi/arsip-nilai',
      color: "bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300"
    },
    {
      title: "Daftar Dosen Pembimbing",
      description: "Atur batas kuota bimbingan dan pantau beban dosen",
      icon: <Users size={20} />,
      link: route().has('prodi.dosen.index') ? route('prodi.dosen.index') : '/prodi/dosen',
      color: "bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300"
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-on-surface">Dashboard Koordinator Prodi</h1>
          <p className="text-secondary text-sm mt-1">Pusat kendali dan ringkasan pelaksanaan Kerja Praktik mahasiswa.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <Link key={idx} href={card.link} className="block group">
            <div className="bg-white rounded-xl p-5 border border-outline-variant shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2.5 rounded-lg ${card.color}`}>
                  {card.icon}
                </div>
                {card.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {card.badge}
                  </span>
                )}
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-on-surface mb-1 group-hover:scale-105 origin-left transition-transform">
                  {card.value}
                </div>
                <h3 className="text-xs font-semibold text-secondary">{card.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Grid: Upcoming Sidang & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Jadwal Sidang Mendatang */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base text-on-surface">Jadwal Sidang Mendatang</h3>
              </div>
              <Link 
                href="/prodi/sidang" 
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Kelola Semua Sidang</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {sidang_mendatang.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <Calendar className="w-10 h-10 text-outline mb-2 opacity-40" />
                <p className="text-xs font-semibold text-on-surface">Belum ada jadwal sidang dalam waktu dekat</p>
                <p className="text-[11px] text-secondary mt-0.5">
                  Klik menu "Penjadwalan Sidang" untuk menetapkan jadwal sidang dari mahasiswa yang telah mengajukan.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sidang_mendatang.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-xs text-on-surface">{item.mahasiswa} ({item.nim})</div>
                      <div className="text-[11px] text-secondary mt-0.5">
                        Dosen Penguji: <span className="font-medium text-slate-800">{item.dosen}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{item.tanggal_formatted}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{item.ruangan}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
            <Link
              href="/prodi/sidang"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-xs"
            >
              <span>Buka Menu Sidang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Actions List */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-on-surface mb-2">Aksi Cepat Program Studi</h3>
          {quickActions.map((qa, i) => (
            <Link
              key={i}
              href={qa.link}
              className={`p-4 rounded-xl border shadow-xs flex items-start gap-3 transition-all ${qa.color}`}
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                {qa.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-on-surface">{qa.title}</div>
                <p className="text-[11px] text-secondary mt-0.5 line-clamp-2 leading-relaxed">
                  {qa.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

ProdiDashboard.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
