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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        {kpiCards.map((card, idx) => (
          <Link key={idx} href={card.link} className="block group">
            <div className="bg-surface-lowest rounded-2xl p-6 border border-outline-variant shadow-sm hover:shadow-md transition-all h-full relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${card.color}`}>
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

      <div className="bg-surface-lowest rounded-2xl border border-outline-variant shadow-sm p-8 mt-4">
        <div className="flex items-center gap-4 text-on-surface-variant mb-4">
          <Clock size={24} className="text-primary" />
          <h2 className="text-xl font-display font-semibold text-on-surface">Pusat Bantuan Cepat</h2>
        </div>
        <p className="text-secondary leading-relaxed max-w-3xl">
          Sebagai staf Tata Usaha, peran utama Anda adalah memverifikasi pendaftaran awal mahasiswa dan menerbitkan dokumen-dokumen legal (seperti Surat Pengantar). 
          Pastikan untuk rutin mengecek "Antrean Surat Pengantar" agar proses administrasi Kerja Praktik mahasiswa tidak terhambat.
        </p>
      </div>
    </div>
  );
}

TUDashboard.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;
