import ProdiLayout from '@/Layouts/ProdiLayout';
import { 
  Users, 
  UserMinus, 
  CheckCircle2, 
  MoreVertical,
  AlertTriangle,
  Search
} from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 tracking-tight">Dashboard Koordinator</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Ringkasan status mahasiswa magang dan alokasi dosen pembimbing.</p>
        </div>
      </header>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={80} className="text-primary" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
              <Users size={20} />
            </div>
            <h3 className="font-body-md text-body-md text-on-surface-variant font-medium">Total Mahasiswa Aktif</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface">342</span>
            <span className="font-label-md text-label-md text-surface-tint flex items-center">↑ 12%</span>
          </div>
          <p className="font-label-md text-label-md text-outline mt-2">Periode Semester Ganjil 2023/2024</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <UserMinus size={80} className="text-error" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
              <UserMinus size={20} />
            </div>
            <h3 className="font-body-md text-body-md text-on-surface-variant font-medium">Belum Mendapat Dosen</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface">45</span>
            <span className="font-label-md text-label-md text-error flex items-center">Perlu Plotting</span>
          </div>
          <div className="w-full bg-surface-container mt-3 h-2 rounded-full overflow-hidden">
            <div className="bg-error h-full rounded-full" style={{ width: '15%' }}></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CheckCircle2 size={80} className="text-surface-tint" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="font-body-md text-body-md text-on-surface-variant font-medium">Persentase Penyelesaian</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface">68%</span>
            <span className="font-label-md text-label-md text-secondary">Rata-rata progres</span>
          </div>
          <div className="w-full bg-surface-container mt-3 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Progres Evaluasi Mahasiswa</h3>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          
          <div className="flex-1 flex items-end gap-2 h-64 relative border-b border-l border-outline-variant pb-2 pl-2">
            {/* Y-axis labels */}
            <div className="absolute -left-8 bottom-0 top-0 flex flex-col justify-between text-label-md text-outline py-2">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
            
            <div className="absolute left-2 right-0 bottom-[25%] border-t border-dashed border-outline-variant w-full z-0"></div>
            <div className="absolute left-2 right-0 bottom-[50%] border-t border-dashed border-outline-variant w-full z-0"></div>
            <div className="absolute left-2 right-0 bottom-[75%] border-t border-dashed border-outline-variant w-full z-0"></div>
            
            {/* Bars */}
            <div className="flex-1 flex justify-center group z-10">
              <div className="w-full max-w-[40px] bg-primary-fixed-dim rounded-t-sm h-[40%] group-hover:bg-primary transition-colors relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-label-md px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Tahap 1: 40%</div>
              </div>
            </div>
            <div className="flex-1 flex justify-center group z-10">
              <div className="w-full max-w-[40px] bg-primary-fixed-dim rounded-t-sm h-[65%] group-hover:bg-primary transition-colors relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-label-md px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Tahap 2: 65%</div>
              </div>
            </div>
            <div className="flex-1 flex justify-center group z-10">
              <div className="w-full max-w-[40px] bg-primary rounded-t-sm h-[85%] relative shadow-[0_0_10px_rgba(0,89,187,0.3)]">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-label-md px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Tahap 3: 85%</div>
              </div>
            </div>
            <div className="flex-1 flex justify-center group z-10">
              <div className="w-full max-w-[40px] bg-surface-variant rounded-t-sm h-[30%] group-hover:bg-outline transition-colors relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-label-md px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Tahap 4: 30%</div>
              </div>
            </div>
            <div className="flex-1 flex justify-center group z-10">
              <div className="w-full max-w-[40px] bg-surface-variant rounded-t-sm h-[10%] group-hover:bg-outline transition-colors relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-label-md px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Selesai: 10%</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between px-2 mt-4 text-label-md text-outline">
            <span className="flex-1 text-center">Pendaftaran</span>
            <span className="flex-1 text-center">Proposal</span>
            <span className="flex-1 text-center font-bold text-primary">Pelaksanaan</span>
            <span className="flex-1 text-center">Laporan</span>
            <span className="flex-1 text-center">Selesai</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 flex flex-col">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6">Perlu Perhatian</h3>
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="flex gap-3 p-3 rounded-lg bg-error-container/30 border border-error-container">
              <AlertTriangle className="text-error shrink-0" size={24} />
              <div>
                <h4 className="font-body-md text-body-md font-medium text-on-surface">12 Proposal Menunggu</h4>
                <p className="font-label-md text-label-md text-on-surface-variant mt-1">Melewati batas waktu review 3 hari.</p>
                <button className="text-primary font-label-md text-label-md font-semibold mt-2 hover:underline">Tinjau Sekarang</button>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-lg bg-surface-container border border-surface-variant">
              <Search className="text-secondary shrink-0" size={24} />
              <div>
                <h4 className="font-body-md text-body-md font-medium text-on-surface">Plotting Dosen Terkendala</h4>
                <p className="font-label-md text-label-md text-on-surface-variant mt-1">5 Dosen melebihi kuota maksimal (10 mahasiswa).</p>
                <button className="text-primary font-label-md text-label-md font-semibold mt-2 hover:underline">Atur Ulang Plotting</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
