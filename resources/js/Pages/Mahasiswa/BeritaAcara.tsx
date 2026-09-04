import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React, { useRef } from 'react';
import { Info, Download, UploadCloud, CheckCircle2, Trash2, FileText, CheckCircle } from 'lucide-react';
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
        if (e.target.files && e.target.files.length > 0) {
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
        <div className="flex-1 p-6 max-w-[1280px] mx-auto w-full space-y-8">
            {/* Flash Messages */}
            {flash?.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="font-medium text-sm">{flash.success}</p>
                </div>
            )}
            {flash?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in">
                    <Info className="w-5 h-5 text-red-600" />
                    <p className="font-medium text-sm">{flash.error}</p>
                </div>
            )}

            {/* Header Section */}
            <div className="mb-8">
                <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Berita Acara Selesai Kerja Praktik</h1>
                <p className="font-body-md text-body-md text-secondary">Silakan unduh template dan unggah dokumen yang telah ditandatangani serta dicap oleh instansi terkait.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Instructions & Download */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Instruction Card */}
                    <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-primary">
                            <Info className="w-6 h-6" />
                            <h2 className="font-title-lg text-title-lg font-bold">Instruksi Penting</h2>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <span className="bg-primary-container text-white w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-[12px] font-bold">1</span>
                                <p className="text-body-sm">Unduh Template Berita Acara yang telah disediakan.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-primary-container text-white w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-[12px] font-bold">2</span>
                                <p className="text-body-sm">Isi data sesuai dengan pelaksanaan Kerja Praktik Anda.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-primary-container text-white w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-[12px] font-bold">3</span>
                                <p className="text-body-sm">Mintalah tanda tangan pembimbing lapangan dan stempel resmi instansi.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-primary-container text-white w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-[12px] font-bold">4</span>
                                <p className="text-body-sm">Scan dokumen tersebut dalam format <strong>PDF</strong> (maks. 5MB) dan unggah pada form di samping.</p>
                            </li>
                        </ul>
                    </div>

                    {/* Download Card */}
                    <div className="bg-surface-container-low p-6 rounded-xl border border-primary/20 flex flex-col items-center text-center">
                        <Download className="w-12 h-12 text-primary mb-4" />
                        <h3 className="font-title-lg text-title-lg mb-2 font-bold">Template Dokumen</h3>
                        <p className="text-body-sm text-secondary mb-6">Pastikan Anda menggunakan versi terbaru (v.2024.1)</p>
                        <a href="/dokumen/template_berita_acara.docx" download className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-lg font-bold hover:bg-primary-container transition-all active:scale-[0.98]">
                            <Download className="w-5 h-5" />
                            Download Template Berita Acara
                        </a>
                    </div>
                </div>

                {/* Right Column: Upload Form / Success State */}
                <div className="lg:col-span-8">
                    <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="font-title-lg text-title-lg mb-2 font-bold">
                                    {isUploaded ? 'Dokumen Berhasil Diunggah' : 'Form Unggah Berita Acara'}
                                </h2>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-label-sm font-bold ${
                                    isSelesai ? 'bg-green-100 text-green-700' : 
                                    isUploaded ? 'bg-amber-100 text-amber-700' : 'bg-secondary-container text-on-secondary-container'
                                }`}>
                                    {isSelesai ? <CheckCircle2 className="w-4 h-4 mr-1" /> : isUploaded ? <ClockIcon className="w-4 h-4 mr-1" /> : <ClockIcon className="w-4 h-4 mr-1" />}
                                    {isSelesai ? 'Telah Disetujui' : isUploaded ? 'Sedang Diproses' : 'Menunggu Unggahan'}
                                </span>
                            </div>
                        </div>
                        
                        {isUploaded ? (
                            <div className={`border rounded-xl p-8 flex flex-col items-center justify-center text-center ${
                                isSelesai ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
                            }`}>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                                    isSelesai ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className={`text-lg font-bold mb-2 ${
                                    isSelesai ? 'text-green-900' : 'text-amber-900'
                                }`}>
                                    {isSelesai ? '✅ Dokumen Berita Acara Telah Disetujui' : '✅ Dokumen Berita Acara berhasil diunggah'}
                                </h3>
                                <p className={`text-sm mb-6 max-w-md ${
                                    isSelesai ? 'text-green-700' : 'text-amber-700'
                                }`}>
                                    {isSelesai 
                                        ? 'Dokumen Berita Acara Anda telah divalidasi dan disetujui oleh Koordinator Prodi. Kerja Praktik Anda telah selesai.' 
                                        : 'Dokumen Anda sedang dalam antrean untuk divalidasi oleh Koordinator Prodi. Mohon periksa kembali secara berkala.'}
                                </p>
                                
                                <a 
                                    href={`/storage/${beritaAcara.path_file}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`inline-flex items-center gap-2 bg-white border px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm ${
                                        isSelesai ? 'border-green-300 text-green-700 hover:bg-green-100' : 'border-amber-300 text-amber-700 hover:bg-amber-100'
                                    }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    Lihat / Unduh Dokumen Anda
                                </a>
                            </div>
                        ) : (
                            <form className="space-y-8" onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <label className="font-label-md font-bold text-on-surface">Pilih File Scan Dokumen</label>
                                    
                                    {!form.data.file_berita_acara ? (
                                        <label 
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={handleFileDrop}
                                            className={`relative border-2 border-dashed rounded-xl bg-surface-container-lowest p-12 flex flex-col items-center justify-center transition-all cursor-pointer block w-full group ${form.errors.file_berita_acara ? 'border-error' : 'border-outline-variant hover:border-primary'}`}
                                        >
                                            <input 
                                                type="file" 
                                                accept=".pdf" 
                                                className="hidden" 
                                                ref={fileInputRef}
                                                onChange={handleFileSelect} 
                                            />
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-primary-container/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                    <UploadCloud className="w-8 h-8" />
                                                </div>
                                                <p className="font-title-lg text-title-lg mb-2 font-bold text-primary">Klik atau seret file PDF ke sini</p>
                                                <p className="text-body-sm text-secondary">Hanya mendukung format .pdf dengan ukuran maksimal 5MB</p>
                                            </div>
                                        </label>
                                    ) : (
                                        <div className="relative border-2 border-dashed border-primary rounded-xl bg-surface-container-lowest p-12 flex flex-col items-center justify-center">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-tertiary-container/10 text-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <CheckCircle2 className="w-8 h-8" />
                                                </div>
                                                <p className="font-title-lg text-title-lg mb-2 font-bold text-primary truncate max-w-md">{form.data.file_berita_acara.name}</p>
                                                <button type="button" onClick={() => {
                                                    form.setData('file_berita_acara', null);
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }} className="text-error font-bold hover:underline flex items-center justify-center gap-1 mx-auto">
                                                    <Trash2 className="w-4 h-4" />
                                                    Hapus dan pilih ulang
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {form.errors.file_berita_acara && (
                                        <InputError message={form.errors.file_berita_acara} />
                                    )}
                                </div>
                                
                                <div className="space-y-4">
                                    <label className="font-label-md font-bold text-on-surface">Catatan Tambahan (Opsional)</label>
                                    <textarea 
                                        className="w-full bg-white border border-outline-variant rounded-lg p-4 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px]" 
                                        placeholder="Masukkan keterangan tambahan jika ada..."
                                        value={form.data.catatan}
                                        onChange={(e) => form.setData('catatan', e.target.value)}
                                    ></textarea>
                                </div>
                                
                                <div className="flex items-center justify-end pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={form.processing}
                                        className="bg-primary text-white py-3 px-8 rounded-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {form.processing ? (
                                            <>
                                                <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Mengunggah...
                                            </>
                                        ) : (
                                            'Simpan dan Kirim'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Visual Decorative Element */}
            {!isUploaded && (
                <div className="mt-12 relative h-64 overflow-hidden rounded-xl bg-surface-container-high/30 flex flex-col items-center justify-center text-center p-6 border border-outline-variant/50">
                    <p className="text-label-sm font-bold text-primary uppercase tracking-widest mb-2">Proses Verifikasi</p>
                    <p className="text-body-sm text-secondary max-w-md">Setelah dokumen diunggah, Koordinator KP akan memverifikasi keabsahan tanda tangan dan stempel dalam waktu 2-3 hari kerja.</p>
                </div>
            )}
        </div>
    );
}

// Minimal ClockIcon to avoid importing another one if not needed
function ClockIcon(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
        </svg>
    );
}

BeritaAcara.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
