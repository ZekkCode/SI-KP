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
                if (f.size > 2 * 1024 * 1024) {
                    alert('Ukuran file melebihi 2MB!');
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
                if (f.size > 2 * 1024 * 1024) {
                    alert('Ukuran file melebihi 2MB!');
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

    return (
        <div className="flex-1 p-4 sm:p-6 max-w-[1280px] mx-auto w-full space-y-6">
            {/* Header & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
                        <GraduationCap className="w-3.5 h-3.5" />
                        Tahap 2: Bimbingan Proposal
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Pengajuan Proposal KP</h1>
                    <p className="text-sm text-slate-500 mt-1">Unggah berkas proposal untuk ditinjau dan disetujui Dosen Pembimbing.</p>
                </div>
                {proposal && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status Proposal:</span>
                        <span className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 border ${
                            proposal.status === 'disetujui' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            proposal.status === 'revisi' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                            {proposal.status === 'revisi' ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            <span className="capitalize">{proposal.status}</span>
                        </span>
                    </div>
                )}
            </div>

            {flash?.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-sm font-medium">{flash.success}</p>
                </div>
            )}

            {flash?.error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-sm font-medium">{flash.error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Upload Section */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Formulir Proposal</h2>
                                <p className="text-xs text-slate-500">Isi rencana judul dan lampirkan dokumen naskah.</p>
                            </div>
                            {dosenPembimbing && (
                                <div className="text-right hidden sm:block">
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Dosen Pembimbing</span>
                                    <span className="text-xs font-bold text-slate-700">{dosenPembimbing.name}</span>
                                </div>
                            )}
                        </div>
                        
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Judul Rencana Kerja Praktik</label>
                                <input 
                                    type="text" 
                                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition ${errors.judul ? 'border-red-500' : 'border-slate-300'}`}
                                    placeholder="Contoh: Rancang Bangun Sistem Informasi Logistik Berbasis Web..." 
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    disabled={proposal?.status === 'disetujui'}
                                />
                                {errors.judul && <p className="text-xs text-red-600">{errors.judul}</p>}
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Abstrak / Gambaran Kegiatan</label>
                                <textarea 
                                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition ${errors.abstrak ? 'border-red-500' : 'border-slate-300'}`}
                                    placeholder="Ringkas latar belakang, rumusan masalah, dan lingkup tugas yang akan dikerjakan di instansi..." 
                                    rows={5}
                                    value={data.abstrak}
                                    onChange={(e) => setData('abstrak', e.target.value)}
                                    disabled={proposal?.status === 'disetujui'}
                                />
                                {errors.abstrak && <p className="text-xs text-red-600">{errors.abstrak}</p>}
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Berkas Naskah Proposal (PDF)</label>
                                {!data.file_proposal && proposal?.status !== 'disetujui' ? (
                                    <label
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleFileDrop}
                                        className="border-2 border-dashed border-slate-300 bg-slate-50/50 hover:border-blue-500 hover:bg-blue-50/30 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition group block w-full text-center"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                                            <UploadCloud className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">Pilih Berkas Proposal PDF</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Seret file ke sini atau klik untuk telusuri (Maks. 2 MB)</p>
                                        <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                                    </label>
                                ) : data.file_proposal ? (
                                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-md flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-slate-900 block truncate max-w-xs">{data.file_proposal.name}</span>
                                                <span className="text-xs text-emerald-700">File siap diunggah ({(data.file_proposal.size / 1024 / 1024).toFixed(2)} MB)</span>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => setData('file_proposal', null)} 
                                            className="text-xs font-semibold text-red-600 hover:text-red-800 px-3 py-1.5 rounded-md hover:bg-red-50 transition"
                                        >
                                            Hapus File
                                        </button>
                                    </div>
                                ) : proposal?.path_file ? (
                                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-blue-50 text-blue-700 rounded-md flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-slate-900 block">Proposal Terunggah</span>
                                                <a href={`/storage/${proposal.path_file}`} target="_blank" className="text-xs font-medium text-blue-700 hover:underline">
                                                    Lihat Berkas Dokumen &rarr;
                                                </a>
                                            </div>
                                        </div>
                                        {proposal?.status !== 'disetujui' && (
                                            <button 
                                                type="button" 
                                                onClick={() => {if (fileInputRef.current) fileInputRef.current.click()}} 
                                                className="text-xs font-semibold text-blue-700 hover:text-blue-900 px-3 py-1.5 rounded-md border border-slate-300 hover:bg-white transition"
                                            >
                                                Ganti File
                                            </button>
                                        )}
                                        <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                                    </div>
                                ) : null}
                                {errors.file_proposal && <p className="text-xs text-red-600 mt-1">{errors.file_proposal}</p>}
                            </div>
                            
                            {proposal?.status !== 'disetujui' && (
                                <div className="pt-3 flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-xs transition cursor-pointer ${
                                            processing ? 'opacity-60 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {processing ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                <span>Mengirim...</span>
                                            </>
                                        ) : (
                                            <>
                                                <SendIcon className="w-4 h-4" />
                                                <span>{proposal ? 'Kirim Revisi Proposal' : 'Kirim Proposal'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    </section>
                </div>

                {/* Sidebar Ketentuan */}
                <div className="space-y-6">
                    <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                            <InfoIcon className="w-4 h-4 text-blue-700" />
                            <h3 className="text-sm font-bold text-slate-900">Ketentuan Berkas Proposal</h3>
                        </div>
                        <ul className="space-y-2.5 text-xs text-slate-600">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                <span>Format naskah sesuai template panduan akademik UTM.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                <span>Telah dikonsultasikan dengan Pembimbing Lapangan.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                <span>Berkas wajib berekstensi <strong>.PDF</strong> dengan ukuran maksimal <strong>2 MB</strong>.</span>
                            </li>
                        </ul>
                    </section>

                    {dosenPembimbing && (
                        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                                {dosenPembimbing.initials}
                            </div>
                            <div>
                                <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider block">Dosen Pembimbing</span>
                                <p className="text-xs font-bold text-slate-900">{dosenPembimbing.name}</p>
                                <p className="text-[11px] text-slate-500">NIP. {dosenPembimbing.nip}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Riwayat Feedback Bimbingan */}
            {proposal && (
                <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden mt-6 flex flex-col">
                    <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-blue-700" />
                            <h2 className="text-sm font-bold text-slate-900">Catatan & Riwayat Bimbingan Dosen</h2>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{feedbacks.length} Catatan</span>
                    </div>
                    
                    <div className="p-4 sm:p-6 space-y-4 max-h-[500px] overflow-y-auto">
                        {feedbacks.length > 0 ? feedbacks.slice().reverse().map((fb) => (
                            <div key={fb.id} className={`flex gap-3 max-w-2xl ${fb.user_role === 'mahasiswa' ? 'flex-row-reverse ml-auto text-right' : ''}`}>
                                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                                    fb.user_role === 'mahasiswa' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}>
                                    {fb.user_role === 'mahasiswa' ? <GraduationCap className="w-4 h-4" /> : fb.user_initials}
                                </div>
                                <div className="space-y-1">
                                    <div className={`p-3.5 rounded-xl border text-sm leading-relaxed ${
                                        fb.user_role === 'mahasiswa' 
                                            ? 'bg-blue-700 text-white border-blue-800' 
                                            : 'bg-slate-50 text-slate-900 border-slate-200 text-left'
                                    }`}>
                                        <p className="whitespace-pre-wrap">{fb.komentar}</p>
                                        
                                        {(fb.status_setelah || fb.user_role !== 'mahasiswa') && (
                                            <div className={`mt-2.5 pt-2 flex items-center gap-2 text-xs ${fb.user_role === 'mahasiswa' ? 'border-t border-white/20 justify-end' : 'border-t border-slate-200'}`}>
                                                {fb.status_setelah && (
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                        fb.status_setelah === 'revisi' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                                                    }`}>
                                                        Status: {fb.status_setelah}
                                                    </span>
                                                )}
                                                <span className={`${fb.user_role === 'mahasiswa' ? 'text-blue-100' : 'text-slate-500'}`}>
                                                    {fb.created_at}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-xs text-slate-400 py-6">Belum ada riwayat catatan bimbingan.</p>
                        )}
                    </div>
                    
                    <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100">
                        <form onSubmit={handleSendNote} className="flex gap-2">
                            <input 
                                type="text" 
                                className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                                placeholder="Tulis catatan atau tanggapan untuk dosen pembimbing..." 
                                value={noteForm.data.komentar}
                                onChange={(e) => noteForm.setData('komentar', e.target.value)}
                            />
                            <button 
                                type="submit" 
                                disabled={noteForm.processing || !noteForm.data.komentar.trim()}
                                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition cursor-pointer ${
                                    noteForm.processing || !noteForm.data.komentar.trim() ? 'opacity-60 cursor-not-allowed' : ''
                                }`}
                            >
                                <SendIcon className="w-3.5 h-3.5" />
                                <span>Kirim Catatan</span>
                            </button>
                        </form>
                    </div>
                </section>
            )}
        </div>
    );
}

Proposal.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
