import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React, { useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { AlertCircle, UploadCloud, Send as SendIcon, CheckCircle2, Info as InfoIcon, User, GraduationCap, RefreshCw } from 'lucide-react';

interface Feedback {
    id: number;
    komentar: string;
    status_setelah: string | null;
    user_name: string;
    user_role: string;
    user_initials: string;
    created_at: string;
}

interface ProposalData {
    id: number;
    judul: string;
    abstrak: string | null;
    status: string;
    versi: number;
    path_file: string | null;
    submitted_at: string | null;
}

interface DosenPembimbing {
    name: string;
    nip: string;
    initials: string;
}

interface ProposalProps extends Record<string, unknown> {
    proposal: ProposalData | null;
    dosenPembimbing: DosenPembimbing | null;
    feedbacks: Feedback[];
    hasPendaftaran: boolean;
    flash: {
        success?: string;
        error?: string;
    };
}

import { PageProps } from '@/types';

export default function Proposal({ proposal, dosenPembimbing, feedbacks, hasPendaftaran, flash }: PageProps<ProposalProps>) {
    const { data, setData, post, processing, errors, reset } = useForm({
        judul: proposal?.judul || '',
        abstrak: proposal?.abstrak || '',
        file_proposal: null as File | null,
    });

    const noteForm = useForm({
        komentar: '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const isSuccess = flash?.success !== undefined;

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const f = e.dataTransfer.files[0];
            if (f.type === 'application/pdf') {
                if (f.size > 5 * 1024 * 1024) {
                    alert('Ukuran file melebihi 5MB!');
                    return;
                }
                setData('file_proposal', f);
            } else {
                alert('File harus berformat PDF!');
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const f = e.target.files[0];
            if (f.type === 'application/pdf') {
                if (f.size > 5 * 1024 * 1024) {
                    alert('Ukuran file melebihi 5MB!');
                    return;
                }
                setData('file_proposal', f);
            } else {
                alert('File harus berformat PDF!');
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mahasiswa/proposal', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setData('file_proposal', null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        });
    };

    const handleSendNote = (e: React.FormEvent) => {
        e.preventDefault();
        noteForm.post('/mahasiswa/proposal/note', {
            preserveScroll: true,
            onSuccess: () => noteForm.reset('komentar'),
        });
    };

    if (!hasPendaftaran) {
        return (
            <div className="flex-1 p-6 max-w-[1280px] mx-auto w-full flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                    <AlertCircle className="w-16 h-16 text-warning mx-auto text-amber-500" />
                    <h2 className="text-headline-md">Belum Memiliki Pendaftaran</h2>
                    <p className="text-body-md text-secondary">
                        Anda harus melakukan pendaftaran dan mendapatkan dosen pembimbing terlebih dahulu sebelum dapat mengunggah proposal.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 max-w-[1280px] mx-auto w-full">
            {/* Page Header & Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-headline-md text-on-surface mb-1">Upload Proposal Kerja Praktik</h1>
                    <p className="text-body-md text-secondary">Pastikan informasi proposal sudah benar sebelum dikirim untuk review.</p>
                </div>
                {proposal && (
                    <div className="flex items-center gap-2">
                        <span className="text-label-sm text-secondary uppercase tracking-wider font-bold">Status Terkini:</span>
                        <span className={`px-4 py-1.5 rounded-full text-label-md font-bold flex items-center gap-1.5 ${
                            proposal.status === 'disetujui' ? 'bg-green-100 text-green-700' :
                            proposal.status === 'revisi' ? 'bg-error-container text-error' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                            {proposal.status === 'revisi' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </span>
                    </div>
                )}
            </div>

            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                        <p className="font-bold">Berhasil!</p>
                        <p className="text-sm">{flash.success}</p>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <div>
                        <p className="font-bold">Gagal!</p>
                        <p className="text-sm">{flash.error}</p>
                    </div>
                </div>
            )}

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
                                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-container outline-none transition-all ${errors.judul ? 'border-error' : 'border-outline-variant focus:border-primary'}`}
                                    placeholder="Masukkan judul lengkap rencana Kerja Praktik" 
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    disabled={proposal?.status === 'disetujui'}
                                />
                                {errors.judul && <p className="text-error text-body-sm mt-1">{errors.judul}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-label-md text-on-surface mb-1.5 font-bold">Abstrak / Deskripsi Singkat</label>
                                <textarea 
                                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-container outline-none transition-all ${errors.abstrak ? 'border-error' : 'border-outline-variant focus:border-primary'}`}
                                    placeholder="Tuliskan abstrak atau gambaran umum kegiatan..." 
                                    rows={6}
                                    value={data.abstrak}
                                    onChange={(e) => setData('abstrak', e.target.value)}
                                    disabled={proposal?.status === 'disetujui'}
                                />
                                {errors.abstrak && <p className="text-error text-body-sm mt-1">{errors.abstrak}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-label-md text-on-surface mb-1.5 font-bold">File Proposal (PDF)</label>
                                {!data.file_proposal && proposal?.status !== 'disetujui' ? (
                                    <label
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleFileDrop}
                                        className="border-2 border-dashed border-primary bg-secondary-container/10 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary-container/20 transition-all group block w-full"
                                    >
                                        <UploadCloud className="w-12 h-12 text-primary mb-2 group-hover:scale-110 transition-transform" />
                                        <p className="text-label-md text-primary font-bold">Klik atau seret file PDF ke sini</p>
                                        <p className="text-body-sm text-secondary">Maksimum ukuran file: 5MB</p>
                                        <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                                    </label>
                                ) : data.file_proposal ? (
                                    <div className="mt-4 p-4 bg-surface-container-low rounded-lg flex items-center justify-between border border-outline-variant">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-primary-container/20 text-primary rounded-lg flex items-center justify-center">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                            <span className="text-body-md font-medium text-on-surface truncate max-w-xs">{data.file_proposal.name}</span>
                                        </div>
                                        <button type="button" onClick={() => setData('file_proposal', null)} className="text-error hover:text-error-container p-2 rounded text-sm font-bold">
                                            Hapus
                                        </button>
                                    </div>
                                ) : proposal?.path_file ? (
                                    <div className="mt-4 p-4 bg-surface-container-low rounded-lg flex items-center justify-between border border-outline-variant">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-primary-container/20 text-primary rounded-lg flex items-center justify-center">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-body-md font-medium text-on-surface">Proposal Tersimpan</span>
                                                <a href={`/storage/${proposal.path_file}`} target="_blank" className="text-label-sm text-primary hover:underline">Lihat Dokumen</a>
                                            </div>
                                        </div>
                                        {proposal?.status !== 'disetujui' && (
                                            <button type="button" onClick={() => {if (fileInputRef.current) fileInputRef.current.click()}} className="text-primary hover:text-primary-container p-2 rounded text-sm font-bold border border-primary">
                                                Upload Baru
                                            </button>
                                        )}
                                        <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                                    </div>
                                ) : null}
                                {errors.file_proposal && <p className="text-error text-body-sm mt-1">{errors.file_proposal}</p>}
                            </div>
                            
                            {proposal?.status !== 'disetujui' && (
                                <div className="pt-4 flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md ${
                                            processing 
                                                ? 'bg-primary/70 text-white cursor-not-allowed' 
                                                : 'bg-primary text-white hover:bg-primary-container active:scale-95'
                                        }`}
                                    >
                                        {processing ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <SendIcon className="w-5 h-5" />
                                                {proposal ? 'Kirim Revisi Proposal' : 'Kirim Proposal'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
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
                        {dosenPembimbing ? (
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold">
                                    {dosenPembimbing.initials}
                                </div>
                                <div>
                                    <p className="text-body-md font-bold text-on-surface truncate w-40" title={dosenPembimbing.name}>{dosenPembimbing.name}</p>
                                    <p className="text-body-sm text-secondary">NIP: {dosenPembimbing.nip}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-body-sm text-secondary">Belum ada dosen pembimbing yang ditetapkan.</p>
                        )}
                        <button className="w-full mt-6 py-2 border border-primary text-primary rounded-lg font-bold hover:bg-primary-container/10 transition-colors">
                            Hubungi via Pesan
                        </button>
                    </section>
                </div>
            </div>

            {/* Feedback History Section */}
            {proposal && (
                <section className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden mt-6 flex flex-col max-h-[800px]">
                    <div className="p-6 border-b border-outline-variant flex items-center justify-between">
                        <h2 className="text-title-lg text-primary font-bold">Riwayat Feedback Dosen</h2>
                        <span className="text-body-sm text-secondary">Total {feedbacks.length} Interaksi</span>
                    </div>
                    <div className="p-6 space-y-6 overflow-y-auto flex-1">
                        {feedbacks.length > 0 ? feedbacks.slice().reverse().map((fb) => (
                            <div key={fb.id} className={`flex gap-4 max-w-3xl ${fb.user_role === 'mahasiswa' ? 'flex-row-reverse ml-auto text-right' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${fb.user_role === 'mahasiswa' ? 'bg-primary text-white' : 'bg-secondary-container text-primary font-bold'}`}>
                                    {fb.user_role === 'mahasiswa' ? <GraduationCap className="w-5 h-5" /> : fb.user_initials}
                                </div>
                                <div className="space-y-2">
                                    <div className={`p-4 shadow-sm border border-outline-variant ${
                                        fb.user_role === 'mahasiswa' 
                                            ? 'bg-primary text-white rounded-l-xl rounded-br-xl border-none' 
                                            : 'bg-surface-container-low text-on-surface rounded-r-xl rounded-bl-xl'
                                    }`}>
                                        <p className="text-body-md whitespace-pre-wrap">{fb.komentar}</p>
                                        
                                        {(fb.status_setelah || fb.user_role !== 'mahasiswa') && (
                                            <div className={`mt-4 pt-3 flex items-center gap-4 ${fb.user_role === 'mahasiswa' ? 'border-t border-white/20 justify-end' : 'border-t border-outline-variant'}`}>
                                                {fb.status_setelah && (
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                        fb.status_setelah === 'revisi' ? 'bg-error-container text-error' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                        Status: {fb.status_setelah}
                                                    </span>
                                                )}
                                                <span className={`text-label-sm ${fb.user_role === 'mahasiswa' ? 'opacity-80' : 'text-secondary'}`}>
                                                    {fb.created_at}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {fb.user_role === 'mahasiswa' && !fb.status_setelah && (
                                            <p className="text-label-sm opacity-80 mt-2">Terkirim: {fb.created_at}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-secondary py-8">Belum ada riwayat feedback.</p>
                        )}
                    </div>
                    
                    <div className="p-4 bg-surface-container-lowest border-t border-outline-variant">
                        <form onSubmit={handleSendNote} className="flex gap-4">
                            <input 
                                type="text" 
                                className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-container ${noteForm.errors.komentar ? 'border-error' : 'border-outline-variant'}`}
                                placeholder="Tulis catatan tambahan untuk dosen pembimbing..." 
                                value={noteForm.data.komentar}
                                onChange={(e) => noteForm.setData('komentar', e.target.value)}
                            />
                            <button 
                                type="submit"
                                disabled={noteForm.processing || !noteForm.data.komentar.trim()}
                                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                                    noteForm.processing || !noteForm.data.komentar.trim()
                                        ? 'bg-primary-container/50 text-on-primary-container/50 cursor-not-allowed'
                                        : 'bg-primary-container text-on-primary-container hover:bg-tertiary-container hover:text-white'
                                }`}
                            >
                                Kirim Catatan
                            </button>
                        </form>
                        {noteForm.errors.komentar && <p className="text-error text-body-sm mt-1">{noteForm.errors.komentar}</p>}
                    </div>
                </section>
            )}
        </div>
    );
}

Proposal.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
