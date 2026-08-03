import InstansiLayout from '@/Layouts/InstansiLayout';
import React, { useState } from 'react';
import { ChevronRight, IdCard, Building2, Calendar, Info, Lock } from 'lucide-react';

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
    <main className="flex-1 min-h-screen p-6 md:p-8 w-full max-w-[1200px] mx-auto space-y-8 bg-[#f8fafc]">
      {/* Breadcrumbs & Header */}
      <div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>Evaluations</span>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-600 font-semibold">Input Nilai & Evaluasi</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Input Nilai dan Evaluasi Kinerja</h1>
        <p className="text-slate-500 mt-2 text-sm max-w-3xl leading-relaxed">
          Lengkapi form evaluasi di bawah ini untuk menilai performa mahasiswa selama masa magang. Data akan dibekukan setelah disubmit.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Student Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl shadow-sm shrink-0">
              BS
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-slate-800">Budi Santoso</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5"><IdCard size={14} className="text-indigo-500" /> NIM: 190512040</span>
                <span className="flex items-center gap-1.5"><Building2 size={14} className="text-indigo-500" /> Divisi: Software Engineering</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-indigo-500" /> Periode: Jan - Jun 2024</span>
              </div>
            </div>
            <div className="bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0">
              Menunggu Nilai
            </div>
          </div>

          {/* Evaluation Form Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Metrik Penilaian (Skala 1-100)</h3>
            
            <div className="flex flex-col gap-6">
              {/* Metric 1 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label className="md:col-span-1 text-sm font-semibold text-slate-600">Kedisiplinan</label>
                <div className="md:col-span-2">
                  <input 
                    type="range" min="1" max="100" 
                    value={scores.val1} 
                    onChange={(e) => handleScoreChange('val1', e.target.value)}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                  />
                </div>
                <div className="md:col-span-1">
                  <input 
                    type="number" min="1" max="100" 
                    value={scores.val1}
                    onChange={(e) => handleScoreChange('val1', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-center text-sm font-bold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>

              {/* Metric 2 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label className="md:col-span-1 text-sm font-semibold text-slate-600">Tanggung Jawab</label>
                <div className="md:col-span-2">
                  <input 
                    type="range" min="1" max="100" 
                    value={scores.val2} 
                    onChange={(e) => handleScoreChange('val2', e.target.value)}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                  />
                </div>
                <div className="md:col-span-1">
                  <input 
                    type="number" min="1" max="100" 
                    value={scores.val2}
                    onChange={(e) => handleScoreChange('val2', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-center text-sm font-bold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>

              {/* Metric 3 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label className="md:col-span-1 text-sm font-semibold text-slate-600">Kerja Sama Tim</label>
                <div className="md:col-span-2">
                  <input 
                    type="range" min="1" max="100" 
                    value={scores.val3} 
                    onChange={(e) => handleScoreChange('val3', e.target.value)}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                  />
                </div>
                <div className="md:col-span-1">
                  <input 
                    type="number" min="1" max="100" 
                    value={scores.val3}
                    onChange={(e) => handleScoreChange('val3', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-center text-sm font-bold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>

              {/* Metric 4 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label className="md:col-span-1 text-sm font-semibold text-slate-600">Pencapaian Target</label>
                <div className="md:col-span-2">
                  <input 
                    type="range" min="1" max="100" 
                    value={scores.val4} 
                    onChange={(e) => handleScoreChange('val4', e.target.value)}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                  />
                </div>
                <div className="md:col-span-1">
                  <input 
                    type="number" min="1" max="100" 
                    value={scores.val4}
                    onChange={(e) => handleScoreChange('val4', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-center text-sm font-bold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>

              {/* Additional Comments */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Catatan Kualitatif / Tambahan (Opsional)</label>
                <textarea 
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-slate-700" 
                  placeholder="Masukkan catatan mengenai kinerja, keahlian teknis, dan etos kerja mahasiswa..." 
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* Estimation Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Estimasi Nilai Akhir</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-extrabold text-indigo-600">{finalScore}</span>
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
            
            <div className="bg-indigo-50/50 p-4 rounded-xl flex items-start gap-3 border border-indigo-100">
              <Info className="text-indigo-600 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                Nilai akhir dihitung secara otomatis sebagai rata-rata dari keempat metrik. Setelah Anda mengirimkan penilaian ini, nilai akan dibekukan dan tidak dapat diubah kembali.
              </p>
            </div>
          </div>

          {/* E-Signature Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Tanda Tangan Digital</h3>
            <p className="text-xs text-slate-500 mb-4">Barcode validasi digital unik akan disematkan pada dokumen sertifikat magang resmi.</p>
            
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdyTLT-MA8LkdQeAbGNA4XmI5DoWI9SLhOegcrnIPlRDjvxN57154b-AP1DeAKk62_1RBjzIVoSniM5IxdhUWRoxcIHxCPwYR9UPb6i5LxqcyRmbVFvSzWEj2KbE-FGMWEi87Gf50X-Xmt75SjI34NU1fGzsoqdVhDAE-2GXlfYLU1gBASZNsVv3fiOH3rxWC9UQIcHVCIPwnDeVgFxAQ2RbEUJwM3bWqFqxhCAIS904eInSfIHxYkngyz_bIduuShnBu_rpVNM6Q" 
                alt="Signature Barcode" 
                className="w-20 h-20 mb-3 opacity-90 mix-blend-multiply"
              />
              <span className="text-xs text-slate-500 text-center leading-normal">
                Ditandatangani secara digital oleh:<br/>
                <strong className="text-slate-800 font-bold">PT Telkom Indonesia</strong><br/>
                Supervisor Lapangan
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
              <Lock size={16} />
              Submit & Bekukan Nilai
            </button>
            <button className="w-full bg-white border border-slate-200 text-slate-600 font-semibold text-sm py-3.5 rounded-xl hover:bg-slate-50 transition-colors">
              Simpan Draft
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

Evaluation.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
