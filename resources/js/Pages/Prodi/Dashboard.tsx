import ProdiLayout from '@/Layouts/ProdiLayout';
import { Users, GraduationCap, Building2, AlertTriangle, FileText, Settings, ArrowRight, Briefcase } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Stats {
  total_mahasiswa: number;
  total_dosen: number;
  total_instansi: number;
}

interface Props {
  stats: Stats;
}

export default function ProdiDashboard({ stats }: Props) {
  const statCards = [
    {
      title: "Total Mahasiswa",
      value: stats.total_mahasiswa.toString(),
      icon: <GraduationCap size={24} />,
      color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
      link: route().has('prodi.mahasiswa') ? route('prodi.mahasiswa') : '#',
    },
    {
      title: "Dosen Pembimbing Aktif",
      value: stats.total_dosen.toString(),
      icon: <Users size={24} />,
      color: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30",
      link: route().has('prodi.dosen.index') ? route('prodi.dosen.index') : '#',
    },
    {
      title: "Instansi Mitra",
      value: stats.total_instansi.toString(),
      icon: <Building2 size={24} />,
      color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30",
      link: route().has('prodi.instansi.index') ? route('prodi.instansi.index') : '#',
    }
  ];

  const quickActions = [
    {
      title: "Plotting Dosen",
      description: "Atur pembimbing untuk mahasiswa yang telah disetujui",
      icon: <Users size={20} />,
      link: route().has('prodi.plotting') ? route('prodi.plotting') : '#',
      color: "bg-surface-variant hover:bg-surface-container transition-colors text-on-surface"
    },
    {
      title: "Manajemen Kuota",
      description: "Atur batas maksimal bimbingan tiap dosen",
      icon: <Settings size={20} />,
      link: route().has('prodi.dosen.index') ? route('prodi.dosen.index') : '#',
      color: "bg-surface-variant hover:bg-surface-container transition-colors text-on-surface"
    },
    {
      title: "Verifikasi Mahasiswa",
      description: "Tinjau pendaftaran mahasiswa baru",
      icon: <FileText size={20} />,
      link: route().has('prodi.verification') ? route('prodi.verification') : '#',
      color: "bg-surface-variant hover:bg-surface-container transition-colors text-on-surface"
    },
    {
      title: "Kelola Instansi",
      description: "Tambahkan dan kelola data instansi mitra tempat mahasiswa magang.",
      icon: <Building2 size={20} />,
      link: route().has('prodi.instansi.index') ? route('prodi.instansi.index') : '#',
      color: "bg-surface-variant hover:bg-surface-container transition-colors text-on-surface"
    },
    {
      title: "Whitelist Pembimbing Lapangan",
      description: "Daftarkan nama pembimbing lapangan sebagai syarat registrasi akun instansi.",
      icon: <Briefcase size={20} />,
      link: route().has('prodi.pembimbing-lapangan.index') ? route('prodi.pembimbing-lapangan.index') : '#',
      color: "bg-surface-variant hover:bg-surface-container transition-colors text-on-surface"
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Dasbor Program Studi</h1>
          <p className="text-on-surface-variant mt-1">Ringkasan eksekutif dan statistik keseluruhan pelaksanaan Kerja Praktik.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        {statCards.map((card, idx) => (
          <Link key={idx} href={card.link} className="block group">
            <div className="bg-surface-lowest rounded-xl p-6 border border-outline-variant shadow-sm hover:shadow-md transition-all h-full relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  {card.icon}
                </div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-on-surface mb-1 group-hover:scale-105 origin-left transition-transform">
                  {card.value}
                </div>
                <h3 className="text-sm font-medium text-on-surface-variant">{card.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 bg-surface-lowest rounded-xl border border-outline-variant shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-display font-semibold text-on-surface">Aksi Cepat</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {quickActions.map((action, idx) => (
              <Link key={idx} href={action.link} className={`p-4 rounded-lg border border-outline-variant group flex flex-col justify-between ${action.color}`}>
                <div>
                  <div className="mb-3 text-primary">{action.icon}</div>
                  <h3 className="font-semibold text-on-surface mb-1 text-sm">{action.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{action.description}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <ArrowRight size={16} className="text-on-surface-variant group-hover:text-primary transition-colors group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-primary text-on-primary rounded-xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -top-6 text-on-primary/10 rotate-12">
            <AlertTriangle size={120} />
          </div>
          <div className="relative z-10">
            <div className="bg-on-primary text-primary inline-flex p-2.5 rounded-lg mb-4">
              <AlertTriangle size={20} />
            </div>
            <h2 className="text-xl font-display font-bold mb-2">Prioritas Penugasan</h2>
            <p className="text-on-primary/90 text-sm leading-relaxed mb-6">
              Lakukan alokasi Dosen Pembimbing untuk mahasiswa yang berkasnya telah disetujui guna kelancaran pelaksanaan Kerja Praktik.
            </p>
          </div>
          <div className="relative z-10">
            <Link href={route().has('prodi.plotting') ? route('prodi.plotting') : '#'} className="inline-flex items-center gap-2 bg-on-primary text-primary px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-on-primary/90 transition-colors w-full justify-center shadow-sm">
              Kelola Plotting Dosen <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

ProdiDashboard.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
