import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { Head, useForm } from '@inertiajs/react';
import { FileText, Upload, CheckCircle2, AlertCircle, File, Download } from 'lucide-react';
import React, { useState } from 'react';

interface DokumenAkhir {
  id: number;
  nama_file: string;
  path: string;
  uploaded_at: string;
}

interface Pendaftaran {
  id: number;
  status: string;
}

interface Props {
  dokumen: DokumenAkhir[];
  pendaftaran: Pendaftaran | null;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function DokumenAkhirIndex({ dokumen, pendaftaran, flash }: Props) {
  const [dragActive, setDragActive] = useState(false);
  
  const { data, setData, post, processing, errors, progress, reset } = useForm({
    file: null as File | null,
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setData('file', droppedFile);
      } else {
        alert("Mohon unggah file dengan format PDF.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData('file', e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.file) return;

    post(route('mahasiswa.dokumen-akhir.store'), {
      onSuccess: () => {
        reset('file');
      },
    });
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <Head title="Laporan Akhir" />

      {/* Flash Messages */}
      {flash?.success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-sm font-medium">{flash.success}</p>
        </div>
      )}
      
      {flash?.error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm font-medium">{flash.error}</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-on-surface mb-2">
          Laporan Akhir Kerja Praktik
        </h1>
        <p className="text-on-surface-variant max-w-2xl">
          Unggah Laporan Akhir Kerja Praktik Anda di sini. Pastikan format file adalah PDF dan ukuran maksimal 5MB. Laporan ini akan ditinjau oleh Dosen Pembimbing dan Pembimbing Lapangan.
        </p>
      </div>

      {!pendaftaran ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-outline mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-on-surface mb-2">Pendaftaran Tidak Aktif</h3>
          <p className="text-on-surface-variant">
            Anda belum memiliki pendaftaran Kerja Praktik yang aktif.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Upload */}
          <div className="lg:col-span-1">
            <div className="bg-surface-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden p-6 relative">
              <div className="flex items-center gap-2 mb-4">
                <Upload size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-on-surface">Unggah Dokumen</h2>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div 
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragActive 
                      ? 'border-primary bg-primary/5' 
                      : data.file 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-outline-variant bg-surface hover:bg-surface-container-lowest'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={processing}
                  />
                  
                  <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
                    {data.file ? (
                      <>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-1">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{data.file.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{(data.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                          <FileText size={24} />
                        </div>
                        <p className="text-sm font-medium text-gray-700">Tarik file ke sini, atau klik untuk memilih</p>
                        <p className="text-xs text-gray-500 mt-1">Hanya file PDF (Maks. 5MB)</p>
                      </>
                    )}
                  </div>
                </div>

                {errors.file && <p className="text-error text-sm font-medium">{errors.file}</p>}

                {progress && (
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!data.file || processing}
                  className="w-full py-3 px-4 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex justify-center items-center gap-2"
                >
                  {processing ? 'Mengunggah...' : 'Unggah Laporan'}
                </button>
              </form>
            </div>
          </div>

          {/* Riwayat Dokumen */}
          <div className="lg:col-span-2">
            <div className="bg-surface-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-outline-variant">
                <h2 className="text-lg font-semibold text-on-surface">Riwayat Laporan Akhir</h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Daftar laporan akhir yang telah Anda unggah.
                </p>
              </div>

              <div className="p-6 flex-1 bg-surface-container-lowest/30">
                {dokumen.length === 0 ? (
                  <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mb-4">
                      <File size={32} />
                    </div>
                    <p className="text-on-surface font-medium">Belum Ada Dokumen</p>
                    <p className="text-sm text-on-surface-variant mt-1">Anda belum mengunggah laporan akhir.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dokumen.map((doc, index) => (
                      <div 
                        key={doc.id} 
                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all hover:shadow-sm bg-white ${
                          index === 0 ? 'border-primary/30 ring-1 ring-primary/5' : 'border-outline-variant'
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                            index === 0 ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'
                          }`}>
                            <FileText size={24} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-on-surface truncate">{doc.nama_file}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                                {new Date(doc.uploaded_at).toLocaleString('id-ID', {
                                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                              </span>
                              {index === 0 && (
                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                  Terbaru
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <a
                          href={`/storage/${doc.path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg text-sm font-medium transition-colors shrink-0"
                        >
                          <Download size={16} />
                          <span className="hidden sm:inline">Unduh</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}

DokumenAkhirIndex.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
