import ProdiLayout from '@/Layouts/ProdiLayout';
import { useState } from 'react';
import { Search, ChevronRight, Building2, UserPlus, Check, Ban, CheckCircle } from 'lucide-react';

export default function SupervisorPlotting() {
  const [selectedLecturer, setSelectedLecturer] = useState<string>('wahyudi');

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <header className="px-4 py-4 md:px-8 md:py-6 bg-surface-container-lowest border-b border-outline-variant shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Plotting Pembimbing</h2>
          <p className="font-body-md text-body-md text-secondary mt-1">Alokasikan dosen pembimbing untuk mahasiswa yang menunggu.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface-container px-3 py-1.5 rounded-full flex items-center gap-2 border border-outline-variant">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="font-label-md text-label-md text-on-surface-variant">Periode Aktif: 2024/2025</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side: Student Queue */}
        <section className="w-full lg:w-1/2 xl:w-2/5 h-1/2 lg:h-full overflow-y-auto border-b lg:border-b-0 lg:border-r border-outline-variant bg-surface-container-lowest flex flex-col">
          <div className="p-4 md:p-6 border-b border-outline-variant sticky top-0 bg-surface-container-lowest z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Antrean Mahasiswa</h3>
              <span className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-2.5 py-1 rounded-full">48 Menunggu</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
              <input 
                type="text" 
                placeholder="Cari nama atau NIM..." 
                className="w-full pl-10 pr-4 py-2 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow font-body-md text-body-md text-on-surface placeholder:text-outline"
              />
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Active Student Card */}
            <div className="bg-surface-container-low border-l-4 border-primary rounded-r-xl border-y border-r border-outline-variant p-4 cursor-pointer shadow-sm relative overflow-hidden group">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity">
                <ChevronRight className="text-primary" size={24} />
              </div>
              <div className="flex items-start justify-between pr-8">
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface">Ahmad Budi Santoso</h4>
                  <p className="font-body-md text-body-md text-secondary">NIM: 200411100012 • Teknik Informatika</p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-variant text-on-surface-variant border border-outline-variant">AI/ML</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-variant text-on-surface-variant border border-outline-variant">Software Eng</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inactive Student Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 cursor-pointer hover:bg-surface-container-low transition-colors group">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Siti Nurhaliza</h4>
                  <p className="font-body-md text-body-md text-secondary">NIM: 200411100045 • Sistem Informasi</p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-variant text-on-surface-variant border border-outline-variant">Data Science</span>
                  </div>
                </div>
                <span className="font-label-md text-label-md text-outline">2 hari lalu</span>
              </div>
            </div>

            {/* Inactive Student Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 cursor-pointer hover:bg-surface-container-low transition-colors group">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Bagus Dwi Cahyo</h4>
                  <p className="font-body-md text-body-md text-secondary">NIM: 200411100088 • Teknik Industri</p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-variant text-on-surface-variant border border-outline-variant">Optimization</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-variant text-on-surface-variant border border-outline-variant">SCM</span>
                  </div>
                </div>
                <span className="font-label-md text-label-md text-outline">3 hari lalu</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Assignment Panel */}
        <section className="w-full lg:w-1/2 xl:w-3/5 h-1/2 lg:h-full overflow-y-auto bg-surface p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-6 pb-8">
            
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-lg text-headline-lg shrink-0">
                  AB
                </div>
                <div className="flex-1">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Ahmad Budi Santoso</h3>
                  <p className="font-body-md text-body-md text-secondary">200411100012 | Program Studi Teknik Informatika</p>
                  
                  <div className="mt-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant">
                    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">Topik Magang</h4>
                    <p className="font-body-md text-body-md text-on-surface">Pengembangan Sistem Deteksi Penyakit Daun Jagung Menggunakan Convolutional Neural Network (CNN)</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Building2 className="text-outline shrink-0" size={16} />
                      <span className="font-body-md text-body-md text-secondary">PT. Inovasi AgriTech Nusantara, Surabaya</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-4 md:p-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
                <UserPlus className="text-primary shrink-0" size={24} />
                Pilih Dosen Pembimbing
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Filter Kompetensi</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button className="px-3 py-1.5 rounded-full border border-primary bg-primary-container text-on-primary-container font-label-md text-label-md transition-colors">Cocok dengan Topik (AI/ML)</button>
                    <button className="px-3 py-1.5 rounded-full border border-outline-variant bg-surface text-on-surface-variant font-label-md text-label-md hover:bg-surface-container transition-colors">Semua Dosen</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Lecturer Option Card (Recommended) */}
                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="lecturer" 
                      className="peer sr-only" 
                      checked={selectedLecturer === 'wahyudi'}
                      onChange={() => setSelectedLecturer('wahyudi')}
                    />
                    <div className="p-4 rounded-xl border-2 border-outline-variant bg-surface-container-lowest group-hover:border-primary-fixed-dim peer-checked:border-primary peer-checked:bg-surface transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-headline-sm text-headline-sm text-on-surface text-base">Dr. Wahyudi, S.T., M.Kom.</div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${selectedLecturer === 'wahyudi' ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
                          <Check size={14} className={`text-white transition-opacity ${selectedLecturer === 'wahyudi' ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                      </div>
                      <p className="font-body-md text-body-md text-secondary text-sm mb-3">Keahlian: Artificial Intelligence, Computer Vision</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-label-md text-label-md text-on-surface-variant">Kuota:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-surface-variant rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '60%' }}></div>
                          </div>
                          <span className="font-label-md text-label-md text-on-surface">6/10</span>
                        </div>
                      </div>
                      
                      <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                        <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">REKOMENDASI</span>
                      </div>
                    </div>
                  </label>

                  {/* Lecturer Option Card */}
                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="lecturer" 
                      className="peer sr-only" 
                      checked={selectedLecturer === 'rina'}
                      onChange={() => setSelectedLecturer('rina')}
                    />
                    <div className="p-4 rounded-xl border-2 border-outline-variant bg-surface-container-lowest group-hover:border-primary-fixed-dim peer-checked:border-primary peer-checked:bg-surface transition-all h-full flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-headline-sm text-headline-sm text-on-surface text-base">Rina Fitriana, S.Kom., M.Cs.</div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${selectedLecturer === 'rina' ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
                          <Check size={14} className={`text-white transition-opacity ${selectedLecturer === 'rina' ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                      </div>
                      <p className="font-body-md text-body-md text-secondary text-sm mb-3">Keahlian: Machine Learning, Data Mining</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-label-md text-label-md text-on-surface-variant">Kuota:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-surface-variant rounded-full overflow-hidden">
                            <div className="h-full bg-error" style={{ width: '90%' }}></div>
                          </div>
                          <span className="font-label-md text-label-md text-on-surface">9/10</span>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Lecturer Option Card (Full) */}
                  <div className="p-4 rounded-xl border-2 border-outline-variant bg-surface-variant opacity-60 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-headline-sm text-headline-sm text-on-surface text-base">Prof. Dr. Ir. Budi Santoso</div>
                      <Ban className="text-error" size={18} />
                    </div>
                    <p className="font-body-md text-body-md text-secondary text-sm mb-3">Keahlian: Software Engineering, AI</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-label-md text-label-md text-error font-medium">Kuota Penuh</span>
                      <span className="font-label-md text-label-md text-on-surface">10/10</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-outline-variant flex flex-col sm:flex-row justify-end gap-3">
                <button className="px-6 py-2 rounded-lg border border-outline text-secondary font-body-md text-body-md font-medium hover:bg-surface-container transition-colors w-full sm:w-auto text-center">
                  Lewati Sementara
                </button>
                <button className="px-6 py-2 rounded-lg bg-primary text-on-primary font-body-md text-body-md font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto">
                  <CheckCircle size={18} />
                  Tetapkan Pembimbing
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

SupervisorPlotting.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
