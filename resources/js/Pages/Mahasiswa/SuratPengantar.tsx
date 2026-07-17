import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React, { useState } from 'react';
import { Download, FileText, Info, CheckCircle, ShieldCheck, Eye } from 'lucide-react';

export default function SuratPengantar() {
  const [downloadStatus, setDownloadStatus] = useState<'' | 'processing' | 'downloading' | 'success'>('');

  const handleDownload = () => {
    setDownloadStatus('processing');
    setTimeout(() => {
      setDownloadStatus('downloading');
      setTimeout(() => {
        setDownloadStatus('success');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="flex-1 p-6 max-w-[1280px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-headline-md text-on-surface mb-2">Download Surat Pengantar</h1>
        <p className="text-body-md text-secondary">Silakan unduh surat pengantar resmi untuk instansi tujuan Kerja Praktik Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Card: Document Info */}
          <div className="bg-white border border-outline-variant rounded-xl p-8 shadow-sm overflow-hidden relative">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-bl-full -mr-8 -mt-8"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="bg-green-100 text-green-700 text-label-sm font-bold px-3 py-1 rounded-full mb-3 inline-block">Siap Diunduh</span>
                  <h4 className="text-title-lg text-on-surface font-bold">Surat Pengantar Kerja Praktik</h4>
                  <p className="text-body-sm text-secondary">Nomor: 1234/UN10.F08/KP/2024</p>
                </div>
                <FileText className="w-10 h-10 text-primary" />
              </div>

              <div className="space-y-4 border-t border-dashed border-outline-variant pt-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-label-sm text-secondary uppercase tracking-wider mb-1 font-bold">Instansi Tujuan</p>
                    <p className="text-body-md font-semibold text-on-surface">PT. Teknologi Maju Bersama</p>
                    <p className="text-body-sm text-on-surface-variant">Jl. Digital No. 42, Jakarta Pusat</p>
                  </div>
                  <div>
                    <p className="text-label-sm text-secondary uppercase tracking-wider mb-1 font-bold">Ditujukan Kepada</p>
                    <p className="text-body-md font-semibold text-on-surface">Human Resources Department</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-label-sm text-secondary uppercase tracking-wider mb-1 font-bold">Tanggal Terbit</p>
                    <p className="text-body-md text-on-surface">24 Oktober 2024</p>
                  </div>
                  <div>
                    <p className="text-label-sm text-secondary uppercase tracking-wider mb-1 font-bold">Masa Berlaku</p>
                    <p className="text-body-md text-on-surface">Hingga 24 November 2024</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={handleDownload}
                  className="w-full sm:w-auto flex items-center justify-center bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-tertiary transition-all hover:shadow-lg active:scale-95 group"
                >
                  <Download className="w-5 h-5 mr-3 group-hover:-translate-y-1 transition-transform" />
                  Unduh Surat Pengantar (PDF)
                </button>
                
                <div className={`transition-opacity duration-300 ${downloadStatus ? 'opacity-100' : 'opacity-0'}`}>
                  {downloadStatus === 'processing' && <p className="text-label-sm text-primary font-semibold">Memproses dokumen...</p>}
                  {downloadStatus === 'downloading' && <p className="text-label-sm text-primary font-semibold animate-pulse">Mengunduh PDF...</p>}
                  {downloadStatus === 'success' && (
                    <p className="text-label-sm text-green-600 font-semibold flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Berhasil diunduh
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines Card */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Info className="w-5 h-5 text-primary" />
              <h5 className="text-label-md text-on-surface font-bold">Instruksi Penggunaan</h5>
            </div>
            <ul className="text-body-sm text-on-surface-variant space-y-2">
              <li className="flex items-start">
                <span className="text-primary mr-2 font-bold">1.</span>
                Pastikan data instansi tujuan sudah sesuai sebelum melakukan pengunduhan.
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2 font-bold">2.</span>
                Gunakan kertas A4 (80gsm) jika Anda diharuskan menyerahkan dokumen fisik.
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2 font-bold">3.</span>
                Dokumen ini merupakan dokumen resmi yang sah tanpa perlu tanda tangan basah tambahan.
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Digital Signature & QR Info */}
          <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm text-center">
            <p className="text-label-md text-on-surface mb-6 font-bold">Verifikasi Keaslian</p>
            
            <div className="bg-surface-container-highest p-6 rounded-xl mb-6 inline-block mx-auto relative group">
              <div className="w-40 h-40 bg-white border border-outline-variant flex items-center justify-center p-2">
                {/* Simulated QR Code */}
                <div className="grid grid-cols-4 gap-1 w-full h-full">
                  <div className="bg-primary"></div><div className="bg-white"></div><div className="bg-primary"></div><div className="bg-primary"></div>
                  <div className="bg-white"></div><div className="bg-primary"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-primary"></div><div className="bg-white"></div><div className="bg-primary"></div><div className="bg-white"></div>
                  <div className="bg-primary"></div><div className="bg-primary"></div><div className="bg-white"></div><div className="bg-primary"></div>
                  <div className="bg-primary"></div><div className="bg-white"></div><div className="bg-primary"></div><div className="bg-primary"></div>
                  <div className="bg-white"></div><div className="bg-primary"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-primary"></div><div className="bg-white"></div><div className="bg-primary"></div><div className="bg-white"></div>
                  <div className="bg-primary"></div><div className="bg-primary"></div><div className="bg-white"></div><div className="bg-primary"></div>
                </div>
              </div>
              <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl p-4">
                <p className="text-white text-label-sm font-bold text-center">Pindai untuk verifikasi integritas data dokumen</p>
              </div>
            </div>

            <div className="bg-secondary-container/20 p-4 rounded-lg flex items-start space-x-2 text-left mb-4">
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-body-sm text-on-secondary-container leading-snug">
                Dokumen ini telah ditandatangani secara digital oleh <span className="font-bold">Dekan Fakultas Teknik</span>.
              </p>
            </div>
            
            <p className="text-label-sm text-secondary">ID Verifikasi: FT-2024-X921-KP</p>
          </div>

          {/* Preview Card */}
          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-surface-container border-b border-outline-variant flex justify-between items-center">
              <span className="text-label-sm font-bold text-on-surface">Pratinjau Dokumen</span>
              <Eye className="w-4 h-4 text-secondary" />
            </div>
            <div className="h-64 bg-surface-dim flex items-center justify-center group cursor-zoom-in">
              <div className="w-40 h-56 bg-white shadow-md relative p-4 transform group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-2 bg-outline-variant mb-1"></div>
                <div className="w-3/4 h-2 bg-outline-variant mb-4"></div>
                <div className="w-full h-1 bg-surface-container-highest mb-1"></div>
                <div className="w-full h-1 bg-surface-container-highest mb-1"></div>
                <div className="w-full h-1 bg-surface-container-highest mb-1"></div>
                <div className="w-1/2 h-1 bg-surface-container-highest mb-6"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-surface-container-highest opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

SuratPengantar.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
