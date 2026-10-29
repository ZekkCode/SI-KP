import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React, { useRef, useState } from 'react';
import { 
  Info, 
  Download, 
  UploadCloud, 
  CheckCircle2, 
  Trash2, 
  FileText, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Printer, 
  ExternalLink, 
  Award,
  AlertCircle
} from 'lucide-react';
import { useForm, usePage, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import { PageProps } from '@/types';

interface BeritaAcaraProps extends PageProps {
  pendaftaran: any;
  beritaAcara: any;
  status: string;
  dosenSudahMenilai?: boolean;
  isApproved?: boolean;
  nilaiAkhir?: any;
}

export default function BeritaAcara({ 
  pendaftaran, 
  beritaAcara, 
  status,
  dosenSudahMenilai = false,
  isApproved = false,
  nilaiAkhir = null
}: BeritaAcaraProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { flash } = usePage<PageProps>().props as any;
  const [showUploadForm, setShowUploadForm] = useState(false);

  const form = useForm({
    file_berita_acara: null as File | null,
    catatan: '',
  });

  const isSelesai = isApproved || status === 'selesai' || status === 'disetujui' || beritaAcara?.status === 'disetujui';
  const hasUploadedFile = Boolean(beritaAcara?.path_file && !beritaAcara?.path_file.startsWith('generated/'));

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const f = e.dataTransfer.files[0];
      if (f.type === 'application/pdf') {
        if (f.size > 5 * 1024 * 1024) {
          form.setError('file_berita_acara', 'Ukuran maksimal 5MB.');
        } else {
          form.setData('file_berita_acara', f);
          form.clearErrors('file_berita_acara');
        }
      } else {
        form.setError('file_berita_acara', 'Format harus PDF.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (f.type === 'application/pdf') {
        if (f.size > 5 * 1024 * 1024) {
          form.setError('file_berita_acara', 'Ukuran maksimal 5MB.');
        } else {
          form.setData('file_berita_acara', f);
          form.clearErrors('file_berita_acara');
        }
      } else {
        form.setError('file_berita_acara', 'Format harus PDF.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.data.file_berita_acara) {
      form.setError('file_berita_acara', 'Silakan pilih file terlebih dahulu.');
      return;
    }

    form.post('/mahasiswa/berita-acara', {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        form.reset();
        setShowUploadForm(false);
      }
    });
  };

  return (
    <div className="flex-1 p-4 md:p-6 max-w-[1280px] mx-auto w-full space-y-6 animate-in fade-in duration-300">
      {/* Flash Messages */}
      {flash?.success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-xl flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="font-medium text-sm">{flash.success}</p>
        </div>
      )}
      {flash?.error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-5 py-3.5 rounded-xl flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="font-medium text-sm">{flash.error}</p>
        </div>
      )}

      {/* Header Section */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
          <FileText className="w-3.5 h-3.5" />
          Tahap 9: Berita Acara Kelulusan &amp; Nilai KP (Form KP-5)
        </span>
        <h1 className="text-2xl font-bold text-slate-800">Berita Acara Seminar Kerja Praktik</h1>
        <p className="text-sm text-slate-500 mt-1">
          Penerbitan dokumen resmi Berita Acara (Form KP-5) yang terintegrasi otomatis setelah Dosen Pembimbing selesai menilai dan divalidasi Koordinator Program Studi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Instructions & Download Templates */}
        <div className="lg:col-span-4 space-y-6">
          {/* Download Official Templates Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Format Resmi Panduan KP</h3>
              <p className="text-xs text-slate-500 mt-0.5">Template Formulir Berita Acara Ujian (Form KP-5 / Lampiran 10)</p>
            </div>

            <a 
              href="/dokumen/lampiran/Lampiran_10_Berita_Acara_Ujian_KP_Form_KP-5.pdf" 
              download 
              className="w-full inline-flex items-center justify-center gap-2 bg-[#00288e] hover:bg-blue-800 text-white py-2 px-3 rounded-lg font-semibold text-xs transition-colors shadow-xs"
              title="Unduh Blanko Berita Acara Ujian Resmi (Form KP-5)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Blanko Form KP-5 (PDF)</span>
            </a>

            <div className="w-full pt-2 border-t border-slate-200/80 space-y-1.5 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Formulir Terkait Lainnya:
              </span>
              <a
                href="/dokumen/lampiran/Lampiran_06_Lembar_Persetujuan_Seminar_KP_Form_KP-8.pdf"
                download
                className="flex items-center justify-between text-[11px] font-medium text-slate-700 hover:text-blue-700 p-1.5 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200 transition"
              >
                <span className="truncate">Form KP-8: Persetujuan Seminar</span>
                <Download className="w-3 h-3 text-slate-400 shrink-0" />
              </a>
              <a
                href="/dokumen/lampiran/Lampiran_07_Penilaian_Pembimbing_Lapangan_Form_KP-6a.pdf"
                download
                className="flex items-center justify-between text-[11px] font-medium text-slate-700 hover:text-blue-700 p-1.5 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200 transition"
              >
                <span className="truncate">Form KP-6a: Nilai Pembimbing Lapangan</span>
                <Download className="w-3 h-3 text-slate-400 shrink-0" />
              </a>
              <Link
                href="/panduan#lampiran-section"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00288e] hover:underline pt-1"
              >
                <BookOpen className="w-3 h-3" />
                <span>Katalog 21 Lampiran Lengkap</span>
              </Link>
            </div>
          </div>

          {/* Workflow Steps Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
              <Info className="w-5 h-5" />
              <h2 className="text-sm font-bold">Alur Penerbitan Berita Acara</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex gap-2.5 items-start">
                <span className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-md text-xs font-bold mt-0.5 ${
                  dosenSudahMenilai ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-700'
                }`}>1</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Penilaian Dosen Pembimbing:</strong> Dosen menginputkan nilai seminar & bimbingan.
                </p>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-md text-xs font-bold mt-0.5 ${
                  dosenSudahMenilai ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>2</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Aktivasi & Auto-Generate:</strong> Berita Acara aktif otomatis sesuai template Form KP-5.
                </p>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-md text-xs font-bold mt-0.5 ${
                  isSelesai ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>3</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Validasi Koordinator KP:</strong> Koordinator KP meninjau dan menyetujui Berita Acara.
                </p>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-md text-xs font-bold mt-0.5 ${
                  isSelesai ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>4</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Cetak Resmi Form KP-5:</strong> Unduh atau cetak berkas sah bertanda tangan digital.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Status & Auto-Generated Document */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Status Berita Acara Kerja Praktik
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Form KP-5 / Lampiran 10 Panduan Kerja Praktik UTM
                </p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold ${
                isSelesai
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : dosenSudahMenilai
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                {isSelesai ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Telah Disetujui Koordinator KP
                  </>
                ) : dosenSudahMenilai ? (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    Menunggu Validasi Koordinator KP
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    Menunggu Penilaian Dosen
                  </>
                )}
              </span>
            </div>

            {/* State 1: Dosen Belum Menilai */}
            {!dosenSudahMenilai && (
              <div className="border border-slate-200 bg-slate-50/70 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-14 h-14 rounded-xl bg-slate-200/80 text-slate-600 flex items-center justify-center">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Menunggu Penilaian Dosen Pembimbing
                </h3>
                <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                  Tahap Berita Acara akan <strong>otomatis aktif</strong> setelah Dosen Pembimbing menyelesaikan pengisian nilai evaluasi bimbingan dan seminar Anda.
                </p>
                <div className="pt-2">
                  <Link
                    href="/mahasiswa/penilaian"
                    className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-100 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 transition shadow-xs"
                  >
                    <Award className="w-3.5 h-3.5 text-blue-700" />
                    <span>Cek Rekapitulasi Penilaian</span>
                  </Link>
                </div>
              </div>
            )}

            {/* State 2: Dosen Sudah Menilai, Menunggu Validasi Koordinator KP */}
            {dosenSudahMenilai && !isSelesai && (
              <div className="border border-amber-200 bg-amber-50/60 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Clock className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-amber-900">
                    Berita Acara Resmi Telah Di-Generate Otomatis
                  </h3>
                  <p className="text-xs text-amber-800 max-w-md leading-relaxed">
                    Dosen Pembimbing telah menyelesaikan penilaian. Dokumen Berita Acara resmi (Form KP-5) Anda telah dibuat otomatis oleh sistem dan sedang berada dalam antrean validasi Koordinator Program Studi.
                  </p>
                </div>

                {pendaftaran?.id && (
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <a
                      href={`/mahasiswa/berita-acara/${pendaftaran.id}/cetak`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-[#00288e] hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow-xs transition active:scale-95"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak / Unduh Berita Acara Resmi (Form KP-5)</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* State 3: Telah Disetujui Koordinator KP */}
            {isSelesai && (
              <div className="border border-emerald-200 bg-emerald-50/60 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-emerald-900">
                    Berita Acara Resmi Telah Divalidasi & Disetujui
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-md leading-relaxed">
                    Dokumen Berita Acara Kerja Praktik Anda telah divalidasi secara sah oleh Koordinator Program Studi. Seluruh tahapan Kerja Praktik telah selesai.
                  </p>
                </div>

                {pendaftaran?.id && (
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <a
                      href={`/mahasiswa/berita-acara/${pendaftaran.id}/cetak`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow-xs transition active:scale-95"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak / Unduh Berita Acara Resmi (Form KP-5)</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>

                    {hasUploadedFile && (
                      <a
                        href={`/storage/${beritaAcara.path_file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-4 py-2.5 rounded-lg text-xs font-semibold transition"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Lihat Berkas Scan Pindaian</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bagian Opsional: Unggah Pindaian Fisik Bertanda Tangan */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Unggahan Berkas Pindaian Fisik (Opsional)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Gunakan formulir ini hanya jika Program Studi meminta arsip tambahan pindaian berkas fisik stempel basah.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="text-xs font-semibold text-[#00288e] hover:underline shrink-0"
                >
                  {showUploadForm ? 'Tutup Formulir Unggah' : 'Unggah Pindaian PDF'}
                </button>
              </div>

              {showUploadForm && (
                <form className="space-y-4 mt-4 pt-4 border-t border-slate-100" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    {!form.data.file_berita_acara ? (
                      <label 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        className={`relative border-2 border-dashed rounded-xl bg-slate-50/60 p-6 flex flex-col items-center justify-center transition-all cursor-pointer block w-full group ${form.errors.file_berita_acara ? 'border-red-400' : 'border-slate-300 hover:border-blue-600 hover:bg-blue-50/30'}`}
                      >
                        <input 
                          type="file" 
                          accept=".pdf" 
                          className="hidden" 
                          ref={fileInputRef}
                          onChange={handleFileSelect} 
                        />
                        <div className="text-center">
                          <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mx-auto mb-2">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-semibold text-slate-700 mb-0.5">Pilih berkas PDF berita acara</p>
                          <p className="text-[10px] text-slate-400">Maksimal 5MB</p>
                        </div>
                      </label>
                    ) : (
                      <div className="relative border-2 border-dashed border-blue-600 rounded-xl bg-blue-50/30 p-6 flex flex-col items-center justify-center text-center">
                        <CheckCircle2 className="w-6 h-6 text-blue-700 mx-auto mb-1" />
                        <p className="text-xs font-bold text-blue-900 truncate max-w-md">{form.data.file_berita_acara.name}</p>
                        <button 
                          type="button" 
                          onClick={() => {
                            form.setData('file_berita_acara', null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }} 
                          className="text-[11px] font-semibold text-red-600 hover:underline flex items-center gap-1 mx-auto mt-2"
                        >
                          <Trash2 className="w-3 h-3" />
                          Hapus dan pilih ulang
                        </button>
                      </div>
                    )}
                    {form.errors.file_berita_acara && (
                      <InputError message={form.errors.file_berita_acara} />
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={form.processing || !form.data.file_berita_acara}
                      className="bg-[#00288e] hover:bg-blue-800 text-white py-2 px-5 rounded-lg font-semibold text-xs transition shadow-xs disabled:opacity-50"
                    >
                      {form.processing ? 'Mengunggah...' : 'Unggah Dokumen'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

BeritaAcara.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
