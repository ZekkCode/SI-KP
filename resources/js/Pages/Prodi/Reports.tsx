import ProdiLayout from '@/Layouts/ProdiLayout';
import { Download, FileSpreadsheet, FileText, PieChart, BarChart } from 'lucide-react';

export default function Reports() {
  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Laporan & Analitik</h2>
          <p className="text-on-surface-variant font-body-md text-body-md">Unduh laporan dan lihat ringkasan statistik pelaksanaan magang.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 hover:border-primary transition-colors group cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-surface-container group-hover:bg-primary-container flex items-center justify-center text-secondary group-hover:text-primary transition-colors shrink-0">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 group-hover:text-primary transition-colors">Rekapitulasi Nilai Akhir</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">Unduh data nilai akhir seluruh mahasiswa magang dalam format Excel (.xlsx) untuk periode aktif.</p>
              <button className="text-primary font-label-md text-label-md font-semibold flex items-center gap-1">
                <Download size={16} /> Unduh (.xlsx)
              </button>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 hover:border-primary transition-colors group cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-surface-container group-hover:bg-primary-container flex items-center justify-center text-secondary group-hover:text-primary transition-colors shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 group-hover:text-primary transition-colors">Laporan Plotting Dosen</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">Unduh daftar lengkap pemetaan mahasiswa dan dosen pembimbing dalam format PDF.</p>
              <button className="text-primary font-label-md text-label-md font-semibold flex items-center gap-1">
                <Download size={16} /> Unduh (.pdf)
              </button>
            </div>
          </div>
        </div>
      </div>

      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Ringkasan Statistik</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 flex flex-col items-center justify-center h-64">
          <PieChart size={64} className="text-outline mb-4 opacity-50" />
          <p className="font-body-md text-body-md text-secondary">Visualisasi Distribusi Topik Magang</p>
          <p className="font-label-md text-label-md text-outline mt-2">(Data akan ditampilkan di sini)</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 flex flex-col items-center justify-center h-64">
          <BarChart size={64} className="text-outline mb-4 opacity-50" />
          <p className="font-body-md text-body-md text-secondary">Visualisasi Progres Mahasiswa per Prodi</p>
          <p className="font-label-md text-label-md text-outline mt-2">(Data akan ditampilkan di sini)</p>
        </div>
      </div>
    </div>
  );
}

Reports.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
