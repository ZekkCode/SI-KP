import DosenLayout from '@/Layouts/DosenLayout';
import { useState } from 'react';
import { Download, BarChart2, ScanLine, QrCode, Send } from 'lucide-react';
import PdfViewer from '@/Components/PdfViewer';
export default function GradingScreen() {
  const [scores, setScores] = useState({
    sistematika: 0,
    kedalaman: 0,
    penguasaan: 0,
    presentasi: 0
  });

  const totalNilai = 
    (scores.sistematika * 0.2) + 
    (scores.kedalaman * 0.3) + 
    (scores.penguasaan * 0.3) + 
    (scores.presentasi * 0.2);

  let grade = 'E';
  if (totalNilai >= 85) grade = 'A';
  else if (totalNilai >= 70) grade = 'B';
  else if (totalNilai >= 55) grade = 'C';
  else if (totalNilai >= 40) grade = 'D';

  const handleScoreChange = (field: keyof typeof scores, value: string) => {
    let num = parseInt(value, 10);
    if (isNaN(num)) num = 0;
    if (num > 100) num = 100;
    if (num < 0) num = 0;
    setScores(prev => ({ ...prev, [field]: num }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-primary-container text-primary px-3 py-1 rounded-full text-xs font-semibold">Menunggu Penilaian</span>
            <span className="text-outline text-xs font-medium">Batas Waktu: 15 Okt 2024</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">Evaluasi Laporan Skripsi</h1>
          <p className="text-sm text-on-surface-variant mt-1">Budi Santoso - 120140123 (Teknik Informatika)</p>
        </div>
        <button className="px-4 py-2 bg-surface-lowest text-primary border border-outline-variant rounded-lg text-sm font-medium hover:bg-surface-high transition-colors flex items-center gap-2 shadow-sm">
          <Download className="w-4 h-4" />
          Unduh PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: PDF */}
        <div className="lg:col-span-2">
          <PdfViewer 
            title="Laporan_Akhir_Budi_Santoso.pdf" 
            showDummyContent={true}
            abstract="Abstrak—Sistem informasi akademik merupakan komponen vital dalam pengelolaan data pendidikan tinggi. Penelitian ini mengusulkan pengembangan platform web terintegrasi untuk memperlancar proses penilaian laporan akhir mahasiswa. Metodologi yang digunakan adalah Agile development, yang memungkinkan iterasi cepat dan penyesuaian kebutuhan pengguna. Hasil pengujian menunjukkan peningkatan efisiensi administratif sebesar 40% dan pengurangan kesalahan input data secara signifikan."
          />
        </div>

        {/* Right: Grading Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Form */}
          <div className="bg-surface-lowest border border-outline-variant rounded-xl shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed opacity-20 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
            
            <h3 className="text-lg font-display font-semibold text-on-surface mb-6 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-primary" />
              Parameter Penilaian
            </h3>
            
            <div className="space-y-5">
              {[
                { id: 'sistematika', label: 'Sistematika Penulisan (20%)' },
                { id: 'kedalaman', label: 'Kedalaman Materi (30%)' },
                { id: 'penguasaan', label: 'Penguasaan Konsep (30%)' },
                { id: 'presentasi', label: 'Kualitas Presentasi (20%)' }
              ].map((param) => (
                <div key={param.id} className="space-y-1">
                  <div className="flex justify-between items-end mb-1">
                    <label className="text-xs font-medium text-on-surface-variant">{param.label}</label>
                    <span className="text-sm font-semibold text-primary">{scores[param.id as keyof typeof scores]}</span>
                  </div>
                  <input 
                    type="number" 
                    min="0" max="100" 
                    value={scores[param.id as keyof typeof scores] || ''}
                    onChange={(e) => handleScoreChange(param.id as keyof typeof scores, e.target.value)}
                    placeholder="0 - 100"
                    className="w-full bg-surface-lowest border border-outline-variant rounded-lg p-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow placeholder:text-outline"
                  />
                </div>
              ))}

              <div className="pt-4 border-t border-outline-variant">
                <div className="flex justify-between items-center bg-surface-low p-4 rounded-xl border border-outline-variant">
                  <span className="text-lg font-display font-semibold text-on-surface">Total Nilai</span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-display font-bold text-primary">{totalNilai.toFixed(2)}</span>
                    <span className={`text-xl font-display font-bold mb-0.5 ${
                      grade === 'A' || grade === 'B' ? 'text-green-600' :
                      grade === 'C' ? 'text-yellow-600' : 'text-error'
                    }`}>({grade})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-medium text-on-surface-variant mb-1 block">Catatan Tambahan (Opsional)</label>
                <textarea 
                  className="w-full bg-surface-lowest border border-outline-variant rounded-lg p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow placeholder:text-outline resize-none"
                  placeholder="Masukkan catatan perbaikan..."
                  rows={3}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Digital Signature */}
          <div className="bg-surface-lowest border border-outline-variant rounded-xl shadow-sm p-6">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
              <ScanLine className="w-4 h-4" />
              Pengesahan Digital
            </h3>
            
            <div className="flex items-center gap-4 bg-surface-low border border-outline-variant border-dashed p-4 rounded-lg mb-6">
              <div className="w-16 h-16 bg-surface-high rounded flex items-center justify-center shrink-0">
                <QrCode className="w-8 h-8 text-outline opacity-50" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">Tanda Tangan Digital</p>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">QR Code akan otomatis di-generate dan disematkan pada lembar pengesahan setelah nilai di-submit.</p>
              </div>
            </div>
            
            <button className="w-full py-3 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:bg-opacity-90 shadow-sm active:scale-[0.98] transition-all flex justify-center items-center gap-2">
              <Send className="w-4 h-4" />
              Submit Nilai & Sahkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

GradingScreen.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
