import TULayout from '@/Layouts/TULayout';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Stats {
  mahasiswa_aktif: number;
  antrean_surat: number;
}

interface Props {
  stats: Stats;
}

export default function TUDashboard({ stats }: Props) {
  const kpiCards = [
    {
      title: "Mahasiswa Aktif KP",
      value: stats.mahasiswa_aktif.toString(),
      icon: <Users size={24} />,
      color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
      link: route('tu.mahasiswa'),
    },
    {
      title: "Antrean Surat Pengantar",
      value: stats.antrean_surat.toString(),
      icon: <FileText size={24} />,
      color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30",
      link: route('tu.generate'),
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Dasbor Tata Usaha</h1>
          <p className="text-on-surface-variant mt-1">Ringkasan administrasi dan antrean layanan dokumen Kerja Praktik.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {kpiCards.map((card, idx) => (
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

      {/* Aksi Cepat Layanan */}
      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm p-6 mt-2">
        <div className="flex items-center justify-between mb-4 border-b border-outline-variant pb-3">
          <div>
            <h2 className="text-lg font-display font-semibold text-on-surface">Aksi Cepat Layanan TU</h2>
            <p className="text-xs text-secondary mt-0.5">Pintasan menu administrasi dan pemrosesan berkas mahasiswa.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href={route('tu.verifikasi-pendaftaran')}
            className="p-4 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 bg-blue-50 text-primary rounded-md w-fit mb-3">
                <CheckCircle size={20} />
              </div>
              <h4 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">Verifikasi Pendaftaran</h4>
              <p className="text-xs text-secondary mt-1">Validasi berkas registrasi awal mahasiswa.</p>
            </div>
          </Link>

          <Link 
            href={route('tu.generate')}
            className="p-4 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-md w-fit mb-3">
                <FileText size={20} />
              </div>
              <h4 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">Surat Pengantar</h4>
              <p className="text-xs text-secondary mt-1">Penerbitan dan verifikasi nomor surat legal.</p>
            </div>
          </Link>

          <Link 
            href={route('tu.surat-balasan')}
            className="p-4 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-md w-fit mb-3">
                <FileText size={20} />
              </div>
              <h4 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">Surat Balasan</h4>
              <p className="text-xs text-secondary mt-1">Konfirmasi penerimaan dari instansi mitra.</p>
            </div>
          </Link>

          <Link 
            href={route('tu.persetujuan-akun')}
            className="p-4 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 bg-purple-50 text-purple-700 rounded-md w-fit mb-3">
                <Users size={20} />
              </div>
              <h4 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">Persetujuan Akun</h4>
              <p className="text-xs text-secondary mt-1">Aktivasi akun registrasi mahasiswa baru.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

TUDashboard.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;
