import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React, { useState } from 'react';
import { AssignmentLate, UploadFile, Send, CheckCircle, Info, Person, School, Sync } from 'lucide-react';
// Wait, Lucide doesn't have AssignmentLate etc, I'll use closest matching icons.
import { AlertCircle, UploadCloud, Send as SendIcon, CheckCircle2, Info as InfoIcon, User, GraduationCap, RefreshCw } from 'lucide-react';

export default function Proposal() {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const f = e.dataTransfer.files[0];
      if (f.type === 'application/pdf') setFile(f);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      if (f.type === 'application/pdf') setFile(f);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="flex-1 p-6 max-w-[1280px] mx-auto w-full">
      {/* Page Header & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-headline-md text-on-surface mb-1">Upload Proposal Kerja Praktik</h1>
          <p className="text-body-md text-secondary">Pastikan informasi proposal sudah benar sebelum dikirim untuk review.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-label-sm text-secondary uppercase tracking-wider font-bold">Status Terkini:</span>
          <span className="px-4 py-1.5 rounded-full bg-error-container text-error text-label-md font-bold flex items-center gap-1.5">
            <AlertCircle className="w-5 h-5" />
            Revisi
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
            <h2 className="text-title-lg text-primary mb-4 font-bold">Formulir Pengajuan</h2>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-label-md text-on-surface mb-1.5 font-bold">Judul Proposal</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-container outline-none transition-all" 
                  placeholder="Masukkan judul lengkap rencana Kerja Praktik" 
                  defaultValue="Analisis Perancangan Sistem Manajemen Logistik Berbasis Web di PT. Sejahtera Utama"
                />
              </div>
              
              <div>
                <label className="block text-label-md text-on-surface mb-1.5 font-bold">Abstrak / Deskripsi Singkat</label>
                <textarea 
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-container outline-none transition-all" 
                  placeholder="Tuliskan abstrak atau gambaran umum kegiatan..." 
                  rows={6}
                  defaultValue="Proposal ini membahas rencana pengembangan modul inventaris pada PT Sejahtera Utama untuk meminimalisir kesalahan pencatatan manual. Metodologi yang digunakan adalah Waterfall dengan fokus pada efisiensi alur data masuk dan keluar."
                />
              </div>
              
              <div>
                <label className="block text-label-md text-on-surface mb-1.5 font-bold">File Proposal (PDF)</label>
                {!file ? (
                  <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    className="border-2 border-dashed border-primary bg-secondary-container/10 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary-container/20 transition-all group block w-full"
                  >
                    <UploadCloud className="w-12 h-12 text-primary mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-label-md text-primary font-bold">Klik atau seret file PDF ke sini</p>
                    <p className="text-body-sm text-secondary">Maksimum ukuran file: 5MB</p>
                    <input type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
                  </label>
                ) : (
                  <div className="mt-4 p-4 bg-surface-container-low rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-container/20 text-primary rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <span className="text-body-md font-medium text-on-surface">{file.name}</span>
                    </div>
                    <button type="button" onClick={() => setFile(null)} className="text-error hover:text-error-container p-2 rounded text-sm font-bold">
                      Hapus
                    </button>
                  </div>
                )}
              </div>
              
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting || isSuccess}
                  className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md ${
                    isSuccess 
                      ? 'bg-green-600 text-white' 
                      : 'bg-primary text-white hover:bg-primary-container active:scale-95'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Mengirim...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Berhasil Terkirim!
                    </>
                  ) : (
                    <>
                      <SendIcon className="w-5 h-5" />
                      Kirim Revisi Proposal
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Sidebar Info / Guidelines */}
        <div className="space-y-6">
          <section className="bg-primary-container text-white rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-title-lg mb-3 font-bold">Ketentuan Penulisan</h3>
              <ul className="space-y-2 text-body-sm opacity-90">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Menggunakan template resmi universitas.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Sudah disetujui oleh Pembimbing Lapangan.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Format file wajib PDF.
                </li>
              </ul>
            </div>
            <InfoIcon className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" />
          </section>
          
          <section className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="text-label-md text-secondary uppercase mb-4 tracking-wider font-bold">Dosen Pembimbing</h3>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold">
                DR
              </div>
              <div>
                <p className="text-body-md font-bold text-on-surface">Dr. Robert Downey, M.T.</p>
                <p className="text-body-sm text-secondary">NIP: 198501012010121001</p>
              </div>
            </div>
            <button className="w-full mt-6 py-2 border border-primary text-primary rounded-lg font-bold hover:bg-primary-container/10 transition-colors">
              Hubungi via Pesan
            </button>
          </section>
        </div>
      </div>

      {/* Feedback History Section */}
      <section className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-outline-variant flex items-center justify-between">
          <h2 className="text-title-lg text-primary font-bold">Riwayat Feedback Dosen</h2>
          <span className="text-body-sm text-secondary">Total 3 Interaksi</span>
        </div>
        <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
          {/* Chat-like feedback entry */}
          <div className="flex gap-4 max-w-3xl">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex-shrink-0 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="bg-surface-container-low p-4 rounded-r-xl rounded-bl-xl border border-outline-variant">
                <p className="text-body-md text-on-surface">
                  Judul sudah cukup baik, namun pada bagian <span className="font-bold">Abstrak</span> harap diperjelas lagi metodologi yang akan digunakan. Apakah ada tools khusus yang akan dipakai?
                </p>
                <div className="mt-4 pt-3 border-t border-outline-variant flex items-center gap-4">
                  <span className="px-2 py-1 rounded bg-error-container text-error text-[10px] font-bold uppercase tracking-wider">Status: Revisi</span>
                  <span className="text-label-sm text-secondary">24 Okt 2023, 14:20</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Student Reply / Action */}
          <div className="flex gap-4 flex-row-reverse max-w-3xl ml-auto">
            <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="space-y-2 text-right">
              <div className="bg-primary text-white p-4 rounded-l-xl rounded-br-xl shadow-sm">
                <p className="text-body-md">
                  Baik Pak, saya akan menambahkan detail metodologi Waterfall dan penggunaan framework Laravel pada abstrak revisi saya.
                </p>
                <p className="text-label-sm opacity-80 mt-2">Terkirim: 24 Okt 2023, 16:45</p>
              </div>
            </div>
          </div>
          
          {/* Older Feedback */}
          <div className="flex gap-4 max-w-3xl">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex-shrink-0 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="bg-surface-container-low p-4 rounded-r-xl rounded-bl-xl border border-outline-variant opacity-70">
                <p className="text-body-md text-on-surface">
                  Format penulisan margin masih belum sesuai dengan panduan KP 2023. Silakan dicek kembali di Buku Panduan halaman 12.
                </p>
                <div className="mt-4 pt-3 border-t border-outline-variant flex items-center gap-4">
                  <span className="px-2 py-1 rounded bg-error-container text-error text-[10px] font-bold uppercase tracking-wider">Status: Revisi</span>
                  <span className="text-label-sm text-secondary">20 Okt 2023, 09:15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-surface-container-lowest border-t border-outline-variant flex gap-4">
          <input 
            type="text" 
            className="flex-1 px-4 py-2 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container" 
            placeholder="Tulis catatan tambahan untuk dosen pembimbing..." 
          />
          <button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-bold hover:bg-tertiary-container hover:text-white transition-all">
            Kirim Catatan
          </button>
        </div>
      </section>
    </div>
  );
}

Proposal.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
