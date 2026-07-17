import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React, { useState } from 'react';
import { Building2, Calendar, UploadCloud, CheckCircle2, Save, FileText, Info } from 'lucide-react';

export default function Pendaftaran() {
  const [krsFile, setKrsFile] = useState<File | null>(null);
  const [transkripFile, setTranskripFile] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'krs' | 'transkrip') => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file melebihi 2MB!');
        return;
      }
      if (type === 'krs') setKrsFile(file);
      else setTranskripFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  return (
    <div className="flex-1 p-6 max-w-[1280px] mx-auto w-full relative">
      <div className="mb-8">
        <h1 className="text-display-lg text-on-surface mb-2">Form Pendaftaran Kerja Praktik</h1>
        <p className="text-body-md text-secondary">Lengkapi data berikut untuk mengajukan izin pelaksanaan Kerja Praktik ke instansi tujuan.</p>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-12 gap-6" onSubmit={handleSubmit}>
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <section className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <Building2 className="w-6 h-6" />
              <h3 className="text-title-lg">Informasi Instansi</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-label-md text-on-surface-variant mb-2" htmlFor="nama_instansi">Nama Instansi</label>
                <input 
                  type="text" 
                  id="nama_instansi" 
                  required
                  placeholder="Contoh: PT. Teknologi Indonesia" 
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-body-md" 
                />
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant mb-2" htmlFor="alamat_instansi">Alamat Instansi</label>
                <textarea 
                  id="alamat_instansi" 
                  required
                  placeholder="Alamat lengkap instansi/perusahaan..." 
                  rows={4} 
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-body-md resize-none"
                ></textarea>
              </div>
            </div>
          </section>

          <section className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <Calendar className="w-6 h-6" />
              <h3 className="text-title-lg">Durasi Pelaksanaan</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-label-md text-on-surface-variant mb-2" htmlFor="tanggal_mulai">Tanggal Mulai</label>
                <input 
                  type="date" 
                  id="tanggal_mulai" 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-body-md" 
                />
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant mb-2" htmlFor="tanggal_selesai">Tanggal Selesai</label>
                <input 
                  type="date" 
                  id="tanggal_selesai" 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-body-md" 
                />
              </div>
            </div>
            <p className="mt-4 text-body-sm text-secondary bg-surface-container-low p-4 rounded-lg border border-primary/10 flex items-start gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              Kerja Praktik umumnya dilaksanakan selama 1 sampai 3 bulan sesuai dengan kurikulum yang berlaku.
            </p>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">
          <section className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <UploadCloud className="w-6 h-6" />
              <h3 className="text-title-lg">Berkas Persyaratan</h3>
            </div>

            <div className="mb-6">
              <label className="block text-label-md text-on-surface-variant mb-2">Kartu Rencana Studi (KRS)</label>
              <div className="relative group">
                <input type="file" accept=".pdf" id="upload_krs" className="hidden" onChange={(e) => handleFileChange(e, 'krs')} />
                <label 
                  htmlFor="upload_krs" 
                  className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
                    krsFile ? 'border-green-500 bg-green-50' : 'border-primary/30 bg-primary-container/5 hover:border-primary hover:bg-primary-container/10'
                  }`}
                >
                  {krsFile ? (
                    <>
                      <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                      <span className="text-label-md text-green-600 truncate px-4 max-w-full">{krsFile.name}</span>
                      <span className="text-body-sm text-secondary mt-1">File siap diunggah ({(krsFile.size / 1024 / 1024).toFixed(2)}MB)</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 text-primary mb-2" />
                      <span className="text-label-md text-primary">Klik atau seret file ke sini</span>
                      <span className="text-body-sm text-secondary mt-1">Hanya format PDF</span>
                    </>
                  )}
                </label>
              </div>
              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-label-sm text-secondary">PDF Terunggah: {krsFile ? '1' : '0'} file</span>
                <span className="text-label-sm text-error font-medium italic">Maksimal 2MB</span>
              </div>
            </div>

            <div>
              <label className="block text-label-md text-on-surface-variant mb-2">Transkrip Nilai Terakhir</label>
              <div className="relative group">
                <input type="file" accept=".pdf" id="upload_transkrip" className="hidden" onChange={(e) => handleFileChange(e, 'transkrip')} />
                <label 
                  htmlFor="upload_transkrip" 
                  className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
                    transkripFile ? 'border-green-500 bg-green-50' : 'border-primary/30 bg-primary-container/5 hover:border-primary hover:bg-primary-container/10'
                  }`}
                >
                  {transkripFile ? (
                    <>
                      <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                      <span className="text-label-md text-green-600 truncate px-4 max-w-full">{transkripFile.name}</span>
                      <span className="text-body-sm text-secondary mt-1">File siap diunggah ({(transkripFile.size / 1024 / 1024).toFixed(2)}MB)</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 text-primary mb-2" />
                      <span className="text-label-md text-primary">Klik atau seret file ke sini</span>
                      <span className="text-body-sm text-secondary mt-1">Hanya format PDF</span>
                    </>
                  )}
                </label>
              </div>
              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-label-sm text-secondary">PDF Terunggah: {transkripFile ? '1' : '0'} file</span>
                <span className="text-label-sm text-error font-medium italic">Maksimal 2MB</span>
              </div>
            </div>
          </section>

          <section className="bg-secondary-container/20 border border-outline-variant p-6 rounded-xl">
            <h4 className="text-label-md font-bold text-on-secondary-container mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Konfirmasi Pendaftaran
            </h4>
            <p className="text-body-sm text-on-secondary-container mb-6">Pastikan seluruh data yang Anda masukkan sudah benar dan sesuai dengan dokumen yang diunggah.</p>
            <div className="flex flex-col gap-3">
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-label-md hover:shadow-lg transition-all active:scale-[0.98]">
                Kirim Pendaftaran
              </button>
              <button type="button" className="w-full bg-white border border-outline-variant text-secondary py-3 rounded-lg font-label-md hover:bg-surface-container-low transition-all">
                Simpan Draft
              </button>
            </div>
          </section>
        </div>
      </form>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <p className="font-bold">Berhasil!</p>
            <p className="text-sm">Pendaftaran Anda telah terkirim.</p>
          </div>
        </div>
      )}
    </div>
  );
}

Pendaftaran.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
