import TULayout from '@/Layouts/TULayout';
import { FileText, AlertTriangle, CheckCircle, Search, Filter, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-semibold text-on-surface mb-2">Dashboard Antrean Dokumen</h2>
        <p className="text-on-surface-variant">Kelola permintaan Surat Pengantar dan Berita Acara Kerja Praktik.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-outline-variant/50 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-container-low rounded-lg">
              <FileText className="text-secondary" size={24} />
            </div>
            <span className="text-xs font-medium text-on-surface-variant bg-surface-container py-1 px-2 rounded-md">Hari Ini</span>
          </div>
          <div>
            <h3 className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Total Antrean</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-semibold text-on-surface">24</span>
              <span className="text-sm text-secondary">Dokumen</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant/50 p-6 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-error-container/30 rounded-lg">
              <AlertTriangle className="text-error" size={24} />
            </div>
            <span className="text-xs font-bold text-error bg-error-container/50 py-1 px-2 rounded-md">Prioritas</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Perlu Verifikasi</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-semibold text-error">12</span>
              <span className="text-sm text-secondary">Menunggu</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant/50 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <span className="text-xs font-medium text-on-surface-variant bg-surface-container py-1 px-2 rounded-md">Minggu Ini</span>
          </div>
          <div>
            <h3 className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Dokumen Selesai</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-semibold text-on-surface">86</span>
              <span className="text-sm text-secondary">Terproses</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant/50 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest">
          <div>
            <h3 className="text-xl font-display font-semibold text-on-surface">Antrean Verifikasi</h3>
            <p className="text-sm text-on-surface-variant mt-1">Daftar dokumen yang memerlukan tindak lanjut tata usaha.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
              <input 
                type="text" 
                placeholder="Cari Mahasiswa/NIM..." 
                className="pl-10 pr-4 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full sm:w-64"
              />
            </div>
            <button className="px-4 py-2 border border-outline-variant rounded-lg text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2">
              <Filter size={18} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/50">
                <th className="px-6 py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Nama Mahasiswa / NIM</th>
                <th className="px-6 py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Jenis Dokumen</th>
                <th className="px-6 py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm text-on-surface divide-y divide-outline-variant/30">
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-secondary">
                  24 Okt 2023<br/><span className="text-xs text-outline">09:15 WIB</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-on-surface">Budi Santoso</div>
                  <div className="text-xs text-secondary">210123456</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FileText className="text-primary" size={18} />
                    Surat Pengantar
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                    Menunggu Verifikasi
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <button onClick={() => onViewChange('generate')} className="bg-primary text-on-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-sm transition-colors shadow-sm">
                    Proses
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-secondary">
                  24 Okt 2023<br/><span className="text-xs text-outline">08:30 WIB</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-on-surface">Siti Aminah</div>
                  <div className="text-xs text-secondary">210123457</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FileText className="text-secondary" size={18} />
                    Berita Acara
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-container/30 text-error border border-error-container">
                    <span className="w-1.5 h-1.5 rounded-full bg-error mr-1.5"></span>
                    Perlu Perbaikan
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <button onClick={() => onViewChange('validasi')} className="bg-surface text-primary border border-primary hover:bg-primary-container/20 px-4 py-2 rounded-lg text-sm transition-colors shadow-sm">
                    Detail
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-secondary">
                  23 Okt 2023<br/><span className="text-xs text-outline">15:45 WIB</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-on-surface">Ahmad Hidayat</div>
                  <div className="text-xs text-secondary">210123458</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FileText className="text-primary" size={18} />
                    Surat Pengantar
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                    Menunggu Verifikasi
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <button onClick={() => onViewChange('generate')} className="bg-primary text-on-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-sm transition-colors shadow-sm">
                    Proses
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 text-center bg-surface-container-lowest border-t border-outline-variant/30">
          <button className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1">
            Muat Lebih Banyak <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

Dashboard.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;
