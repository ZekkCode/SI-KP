import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React from 'react';
import { Info, UploadCloud, FileText, CheckCircle2, FileDown, Clock, Download, Verified } from 'lucide-react';

export default function PenilaianAkhir() {
  return (
    <div className="flex-1 p-6 max-w-[1280px] mx-auto w-full space-y-6">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-headline-md text-primary font-bold">Penilaian dan Laporan Akhir</h1>
          <p className="text-body-md text-secondary">Kelola dokumen final dan tinjau rekapitulasi nilai Kerja Praktik Anda.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 rounded-full bg-secondary-container text-on-secondary-fixed-variant text-label-sm font-bold flex items-center gap-2">
            <Info className="w-4 h-4" />
            Periode: Ganjil 2024/2025
          </span>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          
          {/* Form Upload Section */}
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
            <h2 className="text-title-lg text-on-surface mb-4 font-bold flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-primary" />
              Pengumpulan Berkas Akhir
            </h2>
            
            <div className="space-y-4">
              {/* Laporan Akhir */}
              <div className="p-4 border-2 border-dashed border-outline-variant rounded-xl hover:border-primary transition-colors group cursor-pointer bg-surface-container-low/50 block w-full text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-container/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">Laporan Akhir KP</p>
                      <p className="text-body-sm text-secondary">Format: PDF, Maks 10MB</p>
                    </div>
                  </div>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg text-label-md font-bold hover:bg-tertiary-container transition-all">Upload</button>
                </div>
              </div>

            </div>

            <div className="mt-6 p-4 bg-secondary-container/20 rounded-lg border border-secondary-container flex gap-4">
              <Info className="w-5 h-5 text-secondary flex-shrink-0" />
              <p className="text-body-sm text-on-secondary-fixed-variant">Pastikan semua dokumen telah ditandatangani oleh Pembimbing Lapangan sebelum diunggah.</p>
            </div>
          </div>

          {/* Breakdown Nilai */}
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm space-y-6">
            <h2 className="text-title-lg text-on-surface font-bold mb-4">Rincian Penilaian Detail</h2>
            
            {/* Section 1: Penilaian Ujian KP */}
            <div className="overflow-x-auto">
              <p className="text-label-md font-bold text-primary mb-2">Komponen Penilaian Ujian KP : (Diisi oleh Dosen Penguji KP)</p>
              <table className="w-full border-collapse border border-outline-variant text-body-sm">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="border border-outline-variant p-2 text-center">No</th>
                    <th className="border border-outline-variant p-2 text-left">Kriteria</th>
                    <th className="border border-outline-variant p-2 text-center">Bobot (%)</th>
                    <th className="border border-outline-variant p-2 text-center">Nilai (0-100)</th>
                    <th className="border border-outline-variant p-2 text-center">Nilai Huruf *)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-outline-variant p-2 text-center">1</td>
                    <td className="border border-outline-variant p-2">Perumusan Masalah</td>
                    <td className="border border-outline-variant p-2 text-center">15</td>
                    <td className="border border-outline-variant p-2 text-center font-bold">85</td>
                    <td className="border border-outline-variant p-2 text-center">A</td>
                  </tr>
                  <tr>
                    <td className="border border-outline-variant p-2 text-center">2</td>
                    <td className="border border-outline-variant p-2">Manfaat Hasil KP</td>
                    <td className="border border-outline-variant p-2 text-center">20</td>
                    <td className="border border-outline-variant p-2 text-center font-bold">88</td>
                    <td className="border border-outline-variant p-2 text-center">A</td>
                  </tr>
                  <tr>
                    <td className="border border-outline-variant p-2 text-center">3</td>
                    <td className="border border-outline-variant p-2">Tinjauan Pustaka</td>
                    <td className="border border-outline-variant p-2 text-center">15</td>
                    <td className="border border-outline-variant p-2 text-center font-bold">90</td>
                    <td className="border border-outline-variant p-2 text-center">A</td>
                  </tr>
                  <tr>
                    <td className="border border-outline-variant p-2 text-center">4</td>
                    <td className="border border-outline-variant p-2">Metode Penelitian</td>
                    <td className="border border-outline-variant p-2 text-center">20</td>
                    <td className="border border-outline-variant p-2 text-center font-bold">92</td>
                    <td className="border border-outline-variant p-2 text-center">A</td>
                  </tr>
                  <tr>
                    <td className="border border-outline-variant p-2 text-center">5</td>
                    <td className="border border-outline-variant p-2">Presentasi & Tanya Jawab</td>
                    <td className="border border-outline-variant p-2 text-center">30</td>
                    <td className="border border-outline-variant p-2 text-center font-bold">90</td>
                    <td className="border border-outline-variant p-2 text-center">A</td>
                  </tr>
                </tbody>
                <tfoot className="bg-surface-container-low font-bold">
                  <tr>
                    <td className="border border-outline-variant p-2 text-right" colSpan={2}>Jumlah</td>
                    <td className="border border-outline-variant p-2 text-center">100</td>
                    <td className="border border-outline-variant p-2 text-center">89.45</td>
                    <td className="border border-outline-variant p-2 text-center">A</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Section 2: Penilaian Lapangan & Bimbingan */}
            <div className="overflow-x-auto">
              <p className="text-label-md font-bold text-tertiary mb-2">Penilaian Lapangan & Bimbingan : (Dosen Pembimbing)</p>
              <table className="w-full border-collapse border border-outline-variant text-body-sm">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="border border-outline-variant p-2 text-left">Kriteria Penilaian</th>
                    <th className="border border-outline-variant p-2 text-center">Bobot</th>
                    <th className="border border-outline-variant p-2 text-center">Nilai (0-100)</th>
                    <th className="border border-outline-variant p-2 text-center">Nilai Huruf **)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-outline-variant p-2">Permasalahan Masalah dan Solusi</td>
                    <td className="border border-outline-variant p-2 text-center">30%</td>
                    <td className="border border-outline-variant p-2 text-center font-bold">90</td>
                    <td className="border border-outline-variant p-2 text-center">A</td>
                  </tr>
                  <tr>
                    <td className="border border-outline-variant p-2">Laporan</td>
                    <td className="border border-outline-variant p-2 text-center">30%</td>
                    <td className="border border-outline-variant p-2 text-center font-bold">88</td>
                    <td className="border border-outline-variant p-2 text-center">A</td>
                  </tr>
                  <tr>
                    <td className="border border-outline-variant p-2">Ujian KP</td>
                    <td className="border border-outline-variant p-2 text-center">40%</td>
                    <td className="border border-outline-variant p-2 text-center font-bold">90</td>
                    <td className="border border-outline-variant p-2 text-center">A</td>
                  </tr>
                </tbody>
                <tfoot className="bg-surface-container-low font-bold">
                  <tr>
                    <td className="border border-outline-variant p-2 text-center" colSpan={2}>TOTAL</td>
                    <td className="border border-outline-variant p-2 text-center">89.45</td>
                    <td className="border border-outline-variant p-2 text-center"></td>
                  </tr>
                  <tr>
                    <td className="border border-outline-variant p-2 text-center" colSpan={3}>NILAI HURUF***)</td>
                    <td className="border border-outline-variant p-2 text-center">A</td>
                  </tr>
                </tfoot>
              </table>
            </div>

          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          
          {/* Main Status Card */}
          <div className="bg-primary rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="relative z-10">
              <p className="text-label-md opacity-80 mb-2">Status Penilaian</p>
              <div className="flex items-center gap-4">
                <h3 className="text-headline-md font-bold">LULUS</h3>
                <span className="px-4 py-1 bg-white/20 rounded-full text-label-sm font-bold border border-white/30">SELESAI</span>
              </div>
              <div className="mt-12 flex items-end justify-between">
                <div>
                  <p className="text-label-sm opacity-80">Indeks Nilai Akhir</p>
                  <p className="text-6xl font-extrabold tracking-tight">A</p>
                </div>
                <div className="text-right">
                  <p className="text-label-sm opacity-80">Skor Numerik</p>
                  <p className="text-3xl font-bold">89.45</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Check */}
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
            <h2 className="text-title-lg text-on-surface mb-4 font-bold">Status Prasyarat</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-tertiary flex-shrink-0" />
                <div>
                  <p className="font-bold text-on-surface">Logbook Selesai</p>
                  <p className="text-body-sm text-secondary">Semua entri harian telah divalidasi.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-tertiary flex-shrink-0" />
                <div>
                  <p className="font-bold text-on-surface">Validasi Industri</p>
                  <p className="text-body-sm text-secondary">Nilai lapangan telah diterima sistem.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-tertiary flex-shrink-0" />
                <div>
                  <p className="font-bold text-on-surface">Berita Acara</p>
                  <p className="text-body-sm text-secondary">Dokumen sidang telah ditandatangani.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-bold text-on-surface">Verifikasi Dokumen Akhir</p>
                  <p className="text-body-sm text-secondary">Menunggu pengecekan Admin Prodi.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Download Actions */}
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant flex flex-col gap-3">
            <p className="text-label-md font-bold text-primary mb-1">Dokumen Tersedia</p>
            <button className="w-full flex items-center justify-between p-4 bg-white border border-outline-variant rounded-lg hover:border-primary transition-all font-bold group">
              <span className="flex items-center gap-3">
                <Verified className="w-5 h-5 text-primary" />
                <span className="text-label-md">Sertifikat Nilai Akhir</span>
              </span>
              <Download className="w-5 h-5 text-secondary group-hover:text-primary" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-white border border-outline-variant rounded-lg hover:border-primary transition-all font-bold group">
              <span className="flex items-center gap-3">
                <FileDown className="w-5 h-5 text-primary" />
                <span className="text-label-md">Transkrip KP Terintegrasi</span>
              </span>
              <Download className="w-5 h-5 text-secondary group-hover:text-primary" />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

PenilaianAkhir.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
