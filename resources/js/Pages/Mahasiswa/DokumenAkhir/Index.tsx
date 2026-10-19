import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FileText, Upload, CheckCircle2, AlertCircle, File, Download, ExternalLink, FileDown, BookOpen, Layers, FileCheck } from 'lucide-react';
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
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
          <FileCheck className="w-3.5 h-3.5" />
          Tahap 7: Laporan Akhir KP
        </span>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          Laporan Akhir Kerja Praktik
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Unggah berkas laporan akhir Kerja Praktik berformat PDF (maksimal 5MB) untuk peninjauan dosen pembimbing dan pembimbing lapangan.
        </p>
      </div>

      {!pendaftaran ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">Pendaftaran Tidak Aktif</h3>
          <p className="text-xs text-slate-500">
            Anda belum memiliki pendaftaran Kerja Praktik yang aktif pada periode ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 relative">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <Upload size={18} className="text-blue-700" />
                <h2 className="text-sm font-bold text-slate-800">Unggah Laporan</h2>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div 
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    dragActive 
                      ? 'border-blue-600 bg-blue-50/50' 
                      : data.file 
                        ? 'border-emerald-400 bg-emerald-50/30' 
                        : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
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
                  
                  <div className="flex flex-col items-center justify-center gap-2.5 pointer-events-none">
                    {data.file ? (
                      <>
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 mb-0.5">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 truncate max-w-[200px]">{data.file.name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{(data.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 mb-0.5">
                          <FileText size={20} />
                        </div>
                        <p className="text-xs font-semibold text-slate-700">Tarik berkas atau klik di sini</p>
                        <p className="text-[11px] text-slate-500">Format .PDF (Maks. 5MB)</p>
                      </>
                    )}
                  </div>
                </div>

                {errors.file && <p className="text-red-600 text-xs font-medium">{errors.file}</p>}

                {progress && (
                  <div className="w-full bg-slate-100 rounded-lg h-2 overflow-hidden">
                    <div 
                      className="bg-blue-700 h-2 rounded-lg transition-all duration-300" 
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!data.file || processing}
                  className="w-full py-2.5 px-4 bg-[#00288e] hover:bg-blue-800 text-white font-semibold text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex justify-center items-center gap-2"
                >
                  {processing ? 'Mengunggah...' : 'Unggah Laporan'}
                </button>
              </form>
            </div>
          </div>

          {/* Riwayat Dokumen */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Riwayat Laporan Akhir</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar laporan akhir yang telah Anda serahkan.
                </p>
              </div>

              <div className="p-5 flex-1 bg-slate-50/40">
                {dokumen.length === 0 ? (
                  <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <File size={24} />
                    </div>
                    <p className="text-slate-700 font-semibold text-sm">Belum Ada Dokumen</p>
                    <p className="text-xs text-slate-500 mt-1">Anda belum mengunggah laporan akhir Kerja Praktik.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dokumen.map((doc, index) => (
                      <div 
                        key={doc.id} 
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all hover:shadow-sm bg-white ${
                          index === 0 ? 'border-blue-200 ring-1 ring-blue-50' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            index === 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{doc.nama_file}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                {new Date(doc.uploaded_at).toLocaleString('id-ID', {
                                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                              </span>
                              {index === 0 && (
                                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
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
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors shrink-0"
                        >
                          <Download size={14} />
                          <span>Unduh</span>
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

      {/* Format & Formulir Resmi Laporan Akhir (Replace Dokumen) */}
      <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-[#00288e] border border-blue-200 uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              Lampiran Resmi Laporan Akhir
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Format Baku & Lembar Pengesahan Laporan Akhir
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Gunakan formulir resmi ini untuk menggantikan format manual dan melengkapi komponen wajib naskah Laporan Akhir KP Anda.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/panduan#lampiran-section"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Lihat Semua 21 Lampiran</span>
            </Link>
            <a
              href="/dokumen/lampiran_lengkap_buku_panduan_kp.pdf"
              download
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00288e] hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Bundel 21 Lampiran (2.5MB)</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Lampiran 16: Sampul Laporan Akhir */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs bg-slate-50/50 flex flex-col justify-between transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-700 border border-purple-200">
                  Lampiran 16
                </span>
                <span className="text-[10px] text-slate-400 font-medium">60 KB</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Format Sampul Laporan Akhir KP</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Format baku cover luar (judul, logo UTM, NIM, prodi, dan tahun akademik) warna biru resmi.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex justify-end">
              <a
                href="/dokumen/lampiran/Lampiran_16_Sampul_Laporan_Akhir_KP.pdf"
                download
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-[#00288e] hover:bg-blue-800 rounded-md transition"
              >
                <Download className="w-3 h-3" />
                <span>Unduh PDF</span>
              </a>
            </div>
          </div>

          {/* Lampiran 17: Pengesahan Laporan Akhir */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs bg-slate-50/50 flex flex-col justify-between transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-700 border border-purple-200">
                  Lampiran 17
                </span>
                <span className="text-[10px] text-slate-400 font-medium">63 KB</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Lembar Pengesahan Prodi</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Halaman pengesahan utama bertandatangan Dosen Pembimbing dan disetujui Koordinator Program Studi.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex justify-end">
              <a
                href="/dokumen/lampiran/Lampiran_17_Pengesahan_Laporan_Akhir_KP.pdf"
                download
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-[#00288e] hover:bg-blue-800 rounded-md transition"
              >
                <Download className="w-3 h-3" />
                <span>Unduh PDF</span>
              </a>
            </div>
          </div>

          {/* Lampiran 18: Pengesahan Seminar */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs bg-slate-50/50 flex flex-col justify-between transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-700 border border-purple-200">
                  Lampiran 18
                </span>
                <span className="text-[10px] text-slate-400 font-medium">65 KB</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Lembar Pengesahan Seminar KP</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Bukti sah kelulusan seminar dan penyelesaian revisi bertandatangan Dosen Penguji 1 & 2.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex justify-end">
              <a
                href="/dokumen/lampiran/Lampiran_18_Pengesahan_Seminar_KP.pdf"
                download
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-[#00288e] hover:bg-blue-800 rounded-md transition"
              >
                <Download className="w-3 h-3" />
                <span>Unduh PDF</span>
              </a>
            </div>
          </div>

          {/* Lampiran 19: Pengesahan Instansi / Mitra */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs bg-slate-50/50 flex flex-col justify-between transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-700 border border-purple-200">
                  Lampiran 19
                </span>
                <span className="text-[10px] text-slate-400 font-medium">61 KB</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Lembar Pengesahan Instansi Mitra</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Halaman pengesahan dari tempat magang bertandatangan Pembimbing Lapangan dan cap instansi.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex justify-end">
              <a
                href="/dokumen/lampiran/Lampiran_19_Pengesahan_Instansi_Perusahaan_KP.pdf"
                download
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-[#00288e] hover:bg-blue-800 rounded-md transition"
              >
                <Download className="w-3 h-3" />
                <span>Unduh PDF</span>
              </a>
            </div>
          </div>

          {/* Lampiran 12: Form KP-7 Tanda Terima Laporan */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs bg-slate-50/50 flex flex-col justify-between transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Form KP-7
                </span>
                <span className="text-[10px] text-slate-400 font-medium">235 KB</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Tanda Terima Laporan KP (Form KP-7)</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Bukti tanda terima penyerahan laporan yang telah dijilid ke Koordinator KP dan Perpustakaan.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex justify-end">
              <a
                href="/dokumen/lampiran/Lampiran_12_Tanda_Terima_Laporan_KP_Form_KP-7.pdf"
                download
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-[#00288e] hover:bg-blue-800 rounded-md transition"
              >
                <Download className="w-3 h-3" />
                <span>Unduh PDF</span>
              </a>
            </div>
          </div>

          {/* Lampiran 20: Format Lembar Daftar Relasi */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs bg-slate-50/50 flex flex-col justify-between transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-700 border border-purple-200">
                  Lampiran 20
                </span>
                <span className="text-[10px] text-slate-400 font-medium">64 KB</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Daftar Relasi Kerja Praktik</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Tabel dokumentasi kontak industri dan profil pembimbing lapangan untuk jejaring universitas.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex justify-end">
              <a
                href="/dokumen/lampiran/Lampiran_20_Daftar_Relasi_Kerja_Praktik.pdf"
                download
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-[#00288e] hover:bg-blue-800 rounded-md transition"
              >
                <Download className="w-3 h-3" />
                <span>Unduh PDF</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

DokumenAkhirIndex.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
