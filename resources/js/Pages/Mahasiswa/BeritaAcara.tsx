import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React, { useRef } from 'react';
import { Info, Download, UploadCloud, CheckCircle2, Trash2, FileText, CheckCircle, Clock } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import { PageProps } from '@/types';

interface BeritaAcaraProps extends PageProps {
    pendaftaran: any;
    beritaAcara: any;
    status: string;
}

export default function BeritaAcara({ pendaftaran, beritaAcara, status }: BeritaAcaraProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { flash } = usePage<PageProps>().props as any;

    const form = useForm({
        file_berita_acara: null as File | null,
        catatan: '',
    });

    const isSelesai = status === 'selesai' || status === 'disetujui';
    const isUploaded = status !== 'menunggu_unggahan' && beritaAcara?.path_file;

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
            }
        });
    };

    return (
        <div className="flex-1 p-6 max-w-[1280px] mx-auto w-full space-y-6">
            {/* Flash Messages */}
            {flash?.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3.5 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <p className="font-medium text-sm">{flash.success}</p>
                </div>
            )}
            {flash?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in">
                    <Info className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="font-medium text-sm">{flash.error}</p>
                </div>
            )}

            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Berita Acara Selesai Kerja Praktik</h1>
                <p className="text-sm text-slate-500 mt-1">Unggah dokumen berita acara resmi yang telah ditandatangani dan dicap oleh pembimbing instansi.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Instructions & Download */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Instruction Card */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
                            <Info className="w-5 h-5" />
                            <h2 className="text-base">Tahapan Pengunggahan</h2>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-2.5 items-start">
                                <span className="bg-blue-100 text-blue-700 w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-md text-xs font-bold mt-0.5">1</span>
                                <p className="text-xs text-slate-600 leading-relaxed">Unduh template berita acara resmi di bawah.</p>
                            </li>
                            <li className="flex gap-2.5 items-start">
                                <span className="bg-blue-100 text-blue-700 w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-md text-xs font-bold mt-0.5">2</span>
                                <p className="text-xs text-slate-600 leading-relaxed">Lengkapi data pelaksanaan KP sesuai kegiatan nyata.</p>
                            </li>
                            <li className="flex gap-2.5 items-start">
                                <span className="bg-blue-100 text-blue-700 w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-md text-xs font-bold mt-0.5">3</span>
                                <p className="text-xs text-slate-600 leading-relaxed">Minta tanda tangan pembimbing lapangan & stempel instansi.</p>
                            </li>
                            <li className="flex gap-2.5 items-start">
                                <span className="bg-blue-100 text-blue-700 w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-md text-xs font-bold mt-0.5">4</span>
                                <p className="text-xs text-slate-600 leading-relaxed">Pindai (scan) dalam format <strong>PDF</strong> (maks. 5MB) lalu unggah.</p>
                            </li>
                        </ul>
                    </div>

                    {/* Download Card */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                            <Download className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 mb-1">Template Berita Acara</h3>
                        <p className="text-xs text-slate-500 mb-4">Gunakan format resmi program studi (v.2024.1)</p>
                        <a href="/dokumen/template_berita_acara.docx" download className="w-full inline-flex items-center justify-center gap-2 bg-[#00288e] hover:bg-blue-800 text-white py-2.5 px-4 rounded-lg font-semibold text-xs transition-colors shadow-sm">
                            <Download className="w-4 h-4" />
                            Unduh Template (DOCX)
                        </a>
                    </div>
                </div>

                {/* Right Column: Upload Form / Success State */}
                <div className="lg:col-span-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-base font-bold text-slate-800">
                                    {isUploaded ? 'Dokumen Berita Acara' : 'Unggah Berita Acara'}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {isUploaded ? 'Status peninjauan dokumen Anda' : 'Format PDF, ukuran berkas maksimal 5MB'}
                                </p>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                                isSelesai ? 'bg-green-50 text-green-700 border border-green-200' : 
                                isUploaded ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                                {isSelesai ? <CheckCircle2 className="w-3.5 h-3.5" /> : isUploaded ? <Clock className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                {isSelesai ? 'Telah Disetujui' : isUploaded ? 'Sedang Diverifikasi' : 'Menunggu Unggahan'}
                            </span>
                        </div>
                        
                        {isUploaded ? (
                            <div className={`border rounded-xl p-8 flex flex-col items-center justify-center text-center ${
                                isSelesai ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
                            }`}>
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 ${
                                    isSelesai ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    <CheckCircle className="w-7 h-7" />
                                </div>
                                <h3 className={`text-base font-bold mb-1.5 ${
                                    isSelesai ? 'text-green-900' : 'text-amber-900'
                                }`}>
                                    {isSelesai ? 'Dokumen Telah Divalidasi & Disetujui' : 'Dokumen Berhasil Diunggah'}
                                </h3>
                                <p className={`text-xs mb-5 max-w-md leading-relaxed ${
                                    isSelesai ? 'text-green-700' : 'text-amber-700'
                                }`}>
                                    {isSelesai 
                                        ? 'Dokumen Berita Acara Anda telah divalidasi oleh Koordinator Program Studi. Tahapan Kerja Praktik telah selesai.' 
                                        : 'Dokumen berada dalam antrean validasi Koordinator Program Studi. Silakan cek status secara berkala.'}
                                </p>
                                
                                <a 
                                    href={`/storage/${beritaAcara.path_file}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`inline-flex items-center gap-2 bg-white border px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors shadow-sm ${
                                        isSelesai ? 'border-green-300 text-green-700 hover:bg-green-100' : 'border-amber-300 text-amber-700 hover:bg-amber-100'
                                    }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    Lihat Berkas Terunggah
                                </a>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700">Berkas Pindaian (Scan) Berita Acara</label>
                                    
                                    {!form.data.file_berita_acara ? (
                                        <label 
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={handleFileDrop}
                                            className={`relative border-2 border-dashed rounded-xl bg-slate-50/60 p-8 flex flex-col items-center justify-center transition-all cursor-pointer block w-full group ${form.errors.file_berita_acara ? 'border-red-400' : 'border-slate-300 hover:border-blue-600 hover:bg-blue-50/30'}`}
                                        >
                                            <input 
                                                type="file" 
                                                accept=".pdf" 
                                                className="hidden" 
                                                ref={fileInputRef}
                                                onChange={handleFileSelect} 
                                            />
                                            <div className="text-center">
                                                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                                                    <UploadCloud className="w-6 h-6" />
                                                </div>
                                                <p className="text-sm font-semibold text-slate-700 mb-1">Klik atau seret berkas PDF ke sini</p>
                                                <p className="text-xs text-slate-500">Format PDF resmi bertanda tangan & stempel (maksimal 5MB)</p>
                                            </div>
                                        </label>
                                    ) : (
                                        <div className="relative border-2 border-dashed border-blue-600 rounded-xl bg-blue-50/30 p-8 flex flex-col items-center justify-center">
                                            <div className="text-center">
                                                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                    <CheckCircle2 className="w-6 h-6" />
                                                </div>
                                                <p className="text-sm font-bold text-blue-900 truncate max-w-md mb-2">{form.data.file_berita_acara.name}</p>
                                                <button type="button" onClick={() => {
                                                    form.setData('file_berita_acara', null);
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }} className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline flex items-center justify-center gap-1.5 mx-auto">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Hapus dan pilih ulang
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {form.errors.file_berita_acara && (
                                        <InputError message={form.errors.file_berita_acara} />
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700">Catatan Tambahan (Opsional)</label>
                                    <textarea 
                                        className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all min-h-[90px]" 
                                        placeholder="Tuliskan catatan tambahan jika ada..."
                                        value={form.data.catatan}
                                        onChange={(e) => form.setData('catatan', e.target.value)}
                                    ></textarea>
                                </div>
                                
                                <div className="flex items-center justify-end pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={form.processing}
                                        className="bg-[#00288e] hover:bg-blue-800 text-white py-2.5 px-6 rounded-lg font-semibold text-xs shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {form.processing ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Mengunggah...
                                            </>
                                        ) : (
                                            'Kirim Berita Acara'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Informational Verification Footer */}
            {!isUploaded && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-700 shrink-0" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Setelah dokumen terunggah, Koordinator Program Studi akan memvalidasi keabsahan tanda tangan dan stempel instansi dalam 2-3 hari kerja.
                    </p>
                </div>
            )}
        </div>
    );
}

BeritaAcara.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
