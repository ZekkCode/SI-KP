import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { 
    UploadCloud, CheckCircle2, FileText, Info, AlertCircle, 
    GraduationCap, Send, FileCheck2, FileUp, Sparkles, Phone, Mail, Award, BookOpen
} from 'lucide-react';

interface PendaftaranData {
    id: number;
    status: string;
    nama_instansi: string;
    alamat_instansi: string;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    bidang_minat: string | null;
    catatan_tu: string | null;
    transkrip_uploaded: boolean;
    transkrip_file_name: string | null;
}

interface PendaftaranProps extends Record<string, unknown> {
    pendaftaran: PendaftaranData | null;
    flash: {
        success?: string;
        error?: string;
    };
}

import { PageProps } from '@/types';

export default function Pendaftaran({ pendaftaran, flash }: PageProps<PendaftaranProps>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user as any;

    const form = useForm({
        name: user.name || '',
        no_telepon: user.no_telepon || '',
        email: user.email || '',
        semester: user.semester || '',
        total_sks: user.total_sks?.toString() || '',
        ipk: user.ipk?.toString() || '',
        transkrip_file: null as File | null,
    });

    const sksValue = parseInt(form.data.total_sks);
    const isValidSks = !isNaN(sksValue) && sksValue >= 100;

    const isSubmitted = !!pendaftaran && !['draft', 'perlu_perbaikan'].includes(pendaftaran.status);
    const needsRevision = pendaftaran?.status === 'perlu_perbaikan';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'transkrip_file') => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran berkas melebihi 2MB. Silakan kompres berkas PDF Anda.');
                return;
            }
            form.setData(type, file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/mahasiswa/pendaftaran', {
            forceFormData: true,
        });
    };

    return (
        <div className="flex-1 p-4 sm:p-6 max-w-[800px] mx-auto w-full space-y-6">
            {/* Header */}
            <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Tahap 1: Verifikasi Berkas
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Pendaftaran Kerja Praktik</h1>
                <p className="text-sm text-slate-500 mt-1">Lengkapi data akademik dan unggah transkrip nilai prasyarat KP.</p>
            </div>

            {/* Flash Feedback */}
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

            {/* Catatan Perbaikan TU */}
            {needsRevision && pendaftaran?.catatan_tu && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3.5 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Catatan Perbaikan Tata Usaha</p>
                        <p className="text-sm text-amber-800 mt-0.5">{pendaftaran.catatan_tu}</p>
                    </div>
                </div>
            )}

            {/* Status Locked */}
            {isSubmitted && (
                <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3.5 rounded-lg flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-800">Pendaftaran Terkirim</p>
                        <p className="text-sm text-blue-700">Status saat ini: <strong className="capitalize">{pendaftaran?.status?.replace(/_/g, ' ')}</strong>. Formulir terkunci selama proses verifikasi.</p>
                    </div>
                </div>
            )}

            {/* Warning SKS */}
            {form.data.total_sks && !isValidSks && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm">
                        Total SKS Anda saat ini <strong>{form.data.total_sks} SKS</strong>. Prasyarat pendaftaran minimal <strong>100 SKS</strong>.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Data Akademik Mahasiswa Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Data Akademik Mahasiswa</h2>
                            <p className="text-xs text-slate-500">Periksa dan pastikan data diri Anda sesuai KRS/KHS aktif.</p>
                        </div>
                    </div>
                    
                    <div className="p-5 sm:p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={form.data.name}
                                    onChange={e => form.setData('name', e.target.value)}
                                    placeholder="Nama sesuai KTP/KTM"
                                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition ${form.errors.name ? 'border-red-500' : 'border-slate-300'}`}
                                />
                                {form.errors.name && <p className="text-xs text-red-600">{form.errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">NIM</label>
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={user.nim || ''} 
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed outline-none" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Program Studi</label>
                                <input 
                                    type="text" 
                                    readOnly 
                                    value="Teknik Informatika" 
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed outline-none font-medium" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Semester Berjalan</label>
                                <select
                                    required
                                    value={form.data.semester}
                                    onChange={e => form.setData('semester', e.target.value)}
                                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition ${form.errors.semester ? 'border-red-500' : 'border-slate-300'}`}
                                >
                                    <option value="" disabled>Pilih Periode Semester</option>
                                    <option value="Ganjil 2024/2025">Semester Ganjil 2024/2025</option>
                                    <option value="Genap 2024/2025">Semester Genap 2024/2025</option>
                                    <option value="Ganjil 2025/2026">Semester Ganjil 2025/2026</option>
                                    <option value="Genap 2025/2026">Semester Genap 2025/2026</option>
                                    <option value="Ganjil 2026/2027">Semester Ganjil 2026/2027</option>
                                    <option value="Genap 2026/2027">Semester Genap 2026/2027</option>
                                    <option value="Ganjil 2027/2028">Semester Ganjil 2027/2028</option>
                                    <option value="Genap 2027/2028">Semester Genap 2027/2028</option>
                                </select>
                                {form.errors.semester && <p className="text-xs text-red-600">{form.errors.semester}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Nomor WhatsApp Aktif</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">+62</span>
                                    <input
                                        type="tel"
                                        required
                                        value={form.data.no_telepon.replace(/^08/, '8')}
                                        onChange={e => form.setData('no_telepon', '08' + e.target.value.replace(/^8/, ''))}
                                        placeholder="81234567890"
                                        className={`w-full pl-12 pr-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition ${form.errors.no_telepon ? 'border-red-500' : 'border-slate-300'}`}
                                    />
                                </div>
                                {form.errors.no_telepon && <p className="text-xs text-red-600">{form.errors.no_telepon}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Email Kampus / Akun</label>
                                <input
                                    type="email"
                                    required
                                    value={form.data.email}
                                    onChange={e => form.setData('email', e.target.value)}
                                    placeholder="nim@student.trunojoyo.ac.id"
                                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition ${form.errors.email ? 'border-red-500' : 'border-slate-300'}`}
                                />
                                {form.errors.email && <p className="text-xs text-red-600">{form.errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Total SKS Ditempuh</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    placeholder="Contoh: 105"
                                    value={form.data.total_sks}
                                    onChange={(e) => form.setData('total_sks', e.target.value)}
                                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition ${form.data.total_sks && !isValidSks ? 'border-amber-500 focus:ring-amber-500/20' : 'border-slate-300'}`}
                                />
                                <p className={`text-xs ${form.data.total_sks && !isValidSks ? 'text-amber-600 font-medium' : form.data.total_sks && isValidSks ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                                    {form.data.total_sks && !isValidSks ? '⚠️ Belum memenuhi prasyarat (min. 100 SKS).' : form.data.total_sks && isValidSks ? '✓ Memenuhi syarat SKS.' : 'Prasyarat: minimal 100 SKS lulus.'}
                                </p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">IPK Terakhir</label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    min="0.00"
                                    max="4.00"
                                    placeholder="Contoh: 3.50"
                                    value={form.data.ipk}
                                    onChange={(e) => form.setData('ipk', e.target.value)}
                                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition ${form.errors.ipk ? 'border-red-500' : 'border-slate-300'}`}
                                />
                                {form.errors.ipk && <p className="text-xs text-red-600">{form.errors.ipk}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Berkas Transkrip Nilai Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 sm:p-6 space-y-4">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                            <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Berkas Transkrip Nilai</h3>
                            <p className="text-xs text-slate-500">Unggah transkrip nilai KHS resmi (format PDF, maks. 2 MB).</p>
                        </div>
                    </div>

                    <div>
                        <input 
                            type="file" 
                            accept=".pdf" 
                            id="upload_transkrip" 
                            className="hidden"  
                            onChange={(e) => handleFileChange(e, 'transkrip_file')} 
                        />
                        <label
                            htmlFor="upload_transkrip"
                            className={`flex flex-col items-center justify-center w-full min-h-36 p-6 border-2 border-dashed rounded-xl transition cursor-pointer ${
                                form.data.transkrip_file || pendaftaran?.transkrip_uploaded
                                    ? 'border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50'
                                    : 'border-slate-300 bg-slate-50/50 hover:border-blue-500 hover:bg-blue-50/30'
                            }`}
                        >
                            {form.data.transkrip_file ? (
                                <div className="text-center">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto mb-2">
                                        <FileCheck2 className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 block truncate max-w-sm">{form.data.transkrip_file.name}</span>
                                    <span className="text-xs text-slate-500 mt-1 inline-block">Siap diunggah ({(form.data.transkrip_file.size / 1024 / 1024).toFixed(2)} MB) &bull; Klik untuk ganti file</span>
                                </div>
                            ) : pendaftaran?.transkrip_uploaded ? (
                                <div className="text-center">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto mb-2">
                                        <FileCheck2 className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 block truncate max-w-sm">{pendaftaran.transkrip_file_name}</span>
                                    <span className="text-xs text-slate-500 mt-1 inline-block">Berkas tersimpan &bull; Klik untuk memperbarui</span>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mx-auto mb-2">
                                        <FileUp className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 block">Pilih Berkas Transkrip PDF</span>
                                    <span className="text-xs text-slate-500 mt-1 inline-block">Seret file ke sini atau klik untuk telusuri (Maks. 2 MB)</span>
                                </div>
                            )}
                        </label>
                        {form.errors.transkrip_file && <p className="text-xs text-red-600 mt-1.5">{form.errors.transkrip_file}</p>}
                    </div>
                </div>

                {/* Konfirmasi & Kirim */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-blue-700" />
                            Konfirmasi Pendaftaran
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">Pastikan seluruh data dan transkrip sudah benar sebelum diajukan ke Tata Usaha.</p>
                    </div>
                    <button
                        type="submit"
                        disabled={form.processing || !isValidSks}
                        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-xs transition cursor-pointer ${form.processing || !isValidSks ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        <Send className="w-4 h-4" />
                        <span>{form.processing ? 'Menyimpan...' : pendaftaran ? 'Perbarui Pendaftaran' : 'Kirim Pendaftaran'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

Pendaftaran.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
