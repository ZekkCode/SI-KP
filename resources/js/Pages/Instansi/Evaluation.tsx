import InstansiLayout from '@/Layouts/InstansiLayout';
import React, { useState } from 'react';
import { Search, Bell, HelpCircle, ChevronRight, IdCard, Building2, Calendar, Info, Lock } from 'lucide-react';
export default function Evaluation() {
  const [scores, setScores] = useState({
    val1: 85,
    val2: 88,
    val3: 92,
    val4: 80
  });

  const finalScore = (Object.values(scores).reduce((a, b) => a + b, 0) / 4).toFixed(2);

  const handleScoreChange = (key: keyof typeof scores, value: string) => {
    const num = Math.min(100, Math.max(1, Number(value)));
    setScores(prev => ({ ...prev, [key]: num }));
  };

  return (
    <div className="bg-background text-on-background flex flex-col min-h-screen">
      {/* TopNavBar */}
      <header className="bg-surface-container-lowest w-full top-0 sticky border-b border-outline-variant shadow-sm z-50">
        <div className="flex justify-between items-center px-margin-desktop py-unit max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-6">
            <h1 className="text-headline-md font-bold text-primary">InternshipPortal</h1>
            <nav className="hidden md:flex gap-4 ml-8">
              <a href="#" className="text-on-surface-variant text-body-md py-4 hover:bg-surface-container-low transition-colors">Dashboard</a>
              <a href="#" className="text-on-surface-variant text-body-md py-4 hover:bg-surface-container-low transition-colors">Students</a>
              <a href="#" className="text-primary font-semibold border-b-2 border-primary text-body-md py-4">Evaluations</a>
              <a href="#" className="text-on-surface-variant text-body-md py-4 hover:bg-surface-container-low transition-colors">Reports</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative text-on-surface-variant">
              <Search className="absolute left-3 top-2.5 text-outline" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64"
              />
            </div>
            <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full">
              <Bell size={20} />
            </button>
            <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full">
              <HelpCircle size={20} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer ml-2">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkUrbX1i6SDuOuXQvZL3wWPEnaDtop5-KZ2MXc0HqFmpukGZpdusWTUcr4s67DvA9w2lFqNDyLxQ2G4yxsjH6IH_exZxs2m4xd796f9mY-eKtsO9NoPy59Iy2AsHhheIp_xTkbQgCTImtuPhIziTqXoHfqk-LycO0Yrf4QexHSVG5vk4kQAL9BaKx16ZcsuXE9t7fUVHzESdIxnch0axkRi-u3JcumWRMR2rDKZsaOD-bNrJO4_wEs8UcBzuI_py9K6Gt41K1x69s"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-outline-variant"
              />
              <span className="hidden md:block text-body-md font-medium">Profile</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-container-max mx-auto w-full">
        {/* Adjusted Sidebar for this specific view */}
        <div className="hidden lg:block w-[260px] flex-shrink-0 relative">
</div>

        <main className="flex-1 w-full p-margin-mobile md:p-margin-desktop bg-background pb-20">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-on-surface-variant text-label-md mb-2">
              <a href="#" className="hover:text-primary">Evaluations</a>
              <ChevronRight size={14} />
              <span className="text-on-surface">Input Nilai & Evaluasi</span>
            </div>
            <h1 className="text-headline-lg text-on-surface">Input Nilai dan Evaluasi Kinerja</h1>
            <p className="text-body-lg text-on-surface-variant mt-2 max-w-3xl">
              Lengkapi form evaluasi di bawah ini untuk menilai performa mahasiswa selama masa magang. Data akan dibekukan setelah disubmit.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
            {/* Left Column */}
            <div className="xl:col-span-2 flex flex-col gap-gutter">
              
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA28DqWC7GX4i9xW6oJiO9lchsfeVtGN2OBvDgPJyefUaPzf9ic0jjRC0nj3LMIExp_ZUyHuUp6N8iIxbHOcROv1Q-MR-m2G7baUAttFWCCMpalTj6EZpbULXqj9hfJEpVWp4cUGSkhdwgJb2FhBlCIeSnjOwE5pyIwoRsondRjX8qBXLbithB-n5gDbWYO9ZxT9xE20_8h5sQxxzQ45jI-QCrDNkJMCP99N4DhTVWN1K5yKVOobr6Y0XWKXFRZcP8YXuaPJaEXShc" 
                  alt="Student" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-surface-container-high"
                />
                <div className="flex-1">
                  <h3 className="text-headline-sm text-on-surface">Budi Santoso</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-body-md text-on-surface-variant">
                    <span className="flex items-center gap-1"><IdCard size={16} /> NIM: 190512040</span>
                    <span className="flex items-center gap-1"><Building2 size={16} /> Divisi: Software Engineering</span>
                    <span className="flex items-center gap-1"><Calendar size={16} /> Periode: Jan - Jun 2024</span>
                  </div>
                </div>
                <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-md">
                  Status: Menunggu Nilai
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
                <h3 className="text-headline-sm text-on-surface border-b border-outline-variant pb-4 mb-6">Metrik Penilaian (Skala 1-100)</h3>
                
                <div className="flex flex-col gap-6">
                  {/* Metric 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <label className="md:col-span-1 text-body-md font-medium text-on-surface">Kedisiplinan</label>
                    <div className="md:col-span-2">
                      <input 
                        type="range" min="1" max="100" 
                        value={scores.val1} 
                        onChange={(e) => handleScoreChange('val1', e.target.value)}
                        className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" 
                      />
                    </div>
                    <div className="md:col-span-1">
                      <input 
                        type="number" min="1" max="100" 
                        value={scores.val1}
                        onChange={(e) => handleScoreChange('val1', e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-center text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      />
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <label className="md:col-span-1 text-body-md font-medium text-on-surface">Tanggung Jawab</label>
                    <div className="md:col-span-2">
                      <input 
                        type="range" min="1" max="100" 
                        value={scores.val2} 
                        onChange={(e) => handleScoreChange('val2', e.target.value)}
                        className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" 
                      />
                    </div>
                    <div className="md:col-span-1">
                      <input 
                        type="number" min="1" max="100" 
                        value={scores.val2}
                        onChange={(e) => handleScoreChange('val2', e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-center text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      />
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <label className="md:col-span-1 text-body-md font-medium text-on-surface">Kerja Sama Tim</label>
                    <div className="md:col-span-2">
                      <input 
                        type="range" min="1" max="100" 
                        value={scores.val3} 
                        onChange={(e) => handleScoreChange('val3', e.target.value)}
                        className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" 
                      />
                    </div>
                    <div className="md:col-span-1">
                      <input 
                        type="number" min="1" max="100" 
                        value={scores.val3}
                        onChange={(e) => handleScoreChange('val3', e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-center text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      />
                    </div>
                  </div>

                  {/* Metric 4 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <label className="md:col-span-1 text-body-md font-medium text-on-surface">Pencapaian Target</label>
                    <div className="md:col-span-2">
                      <input 
                        type="range" min="1" max="100" 
                        value={scores.val4} 
                        onChange={(e) => handleScoreChange('val4', e.target.value)}
                        className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" 
                      />
                    </div>
                    <div className="md:col-span-1">
                      <input 
                        type="number" min="1" max="100" 
                        value={scores.val4}
                        onChange={(e) => handleScoreChange('val4', e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-center text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-body-md font-medium text-on-surface mb-2">Catatan Tambahan (Opsional)</label>
                    <textarea 
                      className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" 
                      placeholder="Masukkan catatan kualitatif mengenai kinerja mahasiswa..." 
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="xl:col-span-1 flex flex-col gap-gutter">
              
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
                <h3 className="text-headline-sm text-on-surface mb-4">Estimasi Nilai Akhir</h3>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-4xl font-headline-lg font-bold text-primary">{finalScore}</span>
                  <span className="text-body-md text-on-surface-variant mb-1">/ 100</span>
                </div>
                
                <div className="bg-surface-container p-4 rounded-lg flex items-start gap-3">
                  <Info className="text-primary shrink-0 mt-0.5" size={20} />
                  <p className="text-body-md text-on-surface-variant text-sm">
                    Nilai akhir adalah rata-rata dari keempat metrik di atas. Setelah submit, nilai tidak dapat diubah kembali.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
                
                <h3 className="text-headline-sm text-on-surface mb-4 relative z-10">Preview Tanda Tangan</h3>
                <p className="text-body-md text-on-surface-variant mb-4 relative z-10">Barcode digital akan ditempelkan pada dokumen PDF resmi.</p>
                
                <div className="border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center bg-surface relative z-10">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdyTLT-MA8LkdQeAbGNA4XmI5DoWI9SLhOegcrnIPlRDjvxN57154b-AP1DeAKk62_1RBjzIVoSniM5IxdhUWRoxcIHxCPwYR9UPb6i5LxqcyRmbVFvSzWEj2KbE-FGMWEi87Gf50X-Xmt75SjI34NU1fGzsoqdVhDAE-2GXlfYLU1gBASZNsVv3fiOH3rxWC9UQIcHVCIPwnDeVgFxAQ2RbEUJwM3bWqFqxhCAIS904eInSfIHxYkngyz_bIduuShnBu_rpVNM6Q" 
                    alt="Signature Barcode" 
                    className="w-24 h-24 mb-3 opacity-80 mix-blend-multiply"
                  />
                  <span className="text-label-md text-on-surface-variant text-center">
                    Ditandatangani secara digital oleh:<br/>
                    <strong className="text-on-surface">Dr. Hendra Wijaya</strong><br/>
                    Supervisor Lapangan
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-4 flex flex-col gap-3">
                <button className="w-full bg-primary text-on-primary font-headline-sm text-sm py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-2">
                  <Lock size={16} />
                  Submit & Bekukan Nilai
                </button>
                <button className="w-full bg-transparent border border-outline-variant text-on-surface text-body-md text-sm py-3 rounded-lg hover:bg-surface-container-low transition-colors">
                  Simpan Draft
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <footer className="bg-surface-container w-full py-8 mt-auto border-t border-outline-variant z-40 relative">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-container-max mx-auto gap-4">
          <p className="text-label-md text-on-surface-variant text-center md:text-left">
            © 2024 University Internship Management System. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-label-md text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-label-md text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-label-md text-on-surface-variant hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

Evaluation.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
