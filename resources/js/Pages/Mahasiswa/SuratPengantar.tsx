import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import { FileText, Building2, MapPin, Calendar, CheckCircle2, Lock, User, Info, AlertCircle, Download, BookOpen, UserCheck, UploadCloud } from 'lucide-react';
import { PageProps } from '@/types';

interface PendaftaranData {
    id: number;
    status: string;
    catatan_tu: string | null;
    nama_instansi: string;
    alamat_instansi: string;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    surat_pengantar: {
        id: number;
        nomor_surat: string | null;
        tanggal_terbit: string | null;
        path_file: string | null;
        file_scan: string | null;
        status: string;
    } | null;
}

interface SuratPengantarProps extends Record<string, unknown> {
    nim: string;
    name: string;
    jurusan: string;
    dosenPembimbing: string | null;
    pendaftaran: PendaftaranData | null;
    flash: {
        success?: string;
        error?: string;
    };
}

export default function SuratPengantar({ nim, name, jurusan, dosenPembimbing, pendaftaran, flash }: PageProps<SuratPengantarProps>) {
    const isSubmitted = !!pendaftaran && !['draft', 'perlu_perbaikan'].includes(pendaftaran.status);

    const form = useForm<{
        nama_instansi: string;
        alamat_instansi: string;
        tanggal_mulai: string;
        tanggal_selesai: string;
    }>({
        nama_instansi: pendaftaran?.nama_instansi || '',
        alamat_instansi: pendaftaran?.alamat_instansi || '',
        tanggal_mulai: pendaftaran?.tanggal_mulai || '',
        tanggal_selesai: pendaftaran?.tanggal_selesai || '',
    });

    const uploadForm = useForm<{ file_scan: File | null }>({
        file_scan: null,
    });

    const cetakUrl = pendaftaran?.id 
        ? `/mahasiswa/surat-pengantar/${pendaftaran.id}/cetak?nama_instansi=${encodeURIComponent(form.data.nama_instansi)}&alamat_instansi=${encodeURIComponent(form.data.alamat_instansi)}&tanggal_mulai=${form.data.tanggal_mulai}&tanggal_selesai=${form.data.tanggal_selesai}`
        : '#';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/mahasiswa/surat-pengantar', {
            preserveScroll: true,
        });
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        uploadForm.post('/mahasiswa/surat-pengantar/upload', {
            preserveScroll: true,
        });
    };

    const suratStatus = pendaftaran?.surat_pengantar?.status;
    const isLocked = suratStatus === 'menunggu_verifikasi' || suratStatus === 'terverifikasi';

    return (
        <div className="flex-1 p-4 sm:p-6 max-w-[800px] mx-auto w-full space-y-6">
            <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
                    <FileText className="w-3.5 h-3.5" />
                    Tahap 3: Surat Pengantar Instansi
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Pengajuan Surat Pengantar</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Ajukan surat pengantar resmi fakultas yang ditujukan ke instansi/perusahaan tempat KP.
                </p>

                {suratStatus === 'menunggu_verifikasi' && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3.5 flex items-center gap-2.5">
                        <Info className="w-5 h-5 text-blue-700 shrink-0"/>
                        <p className="text-sm text-blue-800">
                            <strong>Menunggu Verifikasi TU:</strong> Berkas pindaian surat pengantar sedang diperiksa staf administrasi.
                        </p>
                    </div>
                )}
                {suratStatus === 'terverifikasi' && (
                    <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0"/>
                        <p className="text-sm text-emerald-800">
                            <strong>Surat Pengantar Terverifikasi:</strong> Dokumen resmi telah disetujui dan siap diserahkan ke instansi.
                        </p>
                    </div>
                )}

                {pendaftaran?.status === "perlu_perbaikan" && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3.5 flex items-start gap-2.5">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-red-700">Catatan Perbaikan Tata Usaha</p>
                            <p className="text-sm text-red-700 mt-0.5">{pendaftaran.catatan_tu ?? "Periksa kembali data instansi Anda."}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Flash Alerts */}
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

            {suratStatus === 'terverifikasi' && pendaftaran?.surat_pengantar && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Surat Terbit Resmi
                            </span>
                            <h4 className="text-base font-bold text-slate-900">Surat Pengantar Disetujui</h4>
                            <p className="text-xs text-slate-500">Nomor: <strong className="text-slate-800">{pendaftaran.surat_pengantar.nomor_surat || 'Menunggu Penomoran'}</strong></p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-100 pt-3.5 gap-3">
                        <div className="text-xs text-slate-500">
                            <span>Tanggal Terbit: <strong className="text-slate-700">{pendaftaran.surat_pengantar.tanggal_terbit || '-'}</strong></span>
                        </div>
                        {pendaftaran.surat_pengantar.file_scan && (
                            <a
                                href={`/storage/${pendaftaran.surat_pengantar.file_scan}`}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>Unduh Berkas Surat</span>
                            </a>
                        )}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Identitas Mahasiswa Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                            <User className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">Identitas Pemohon</h2>
                            <p className="text-xs text-slate-500">Data mahasiswa terdaftar pada portal akademik.</p>
                        </div>
                    </div>

                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/40">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                                NIM <Lock className="w-3 h-3 text-slate-400" />
                            </label>
                            <input
                                type="text"
                                readOnly
                                value={nim}
                                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                                Nama Lengkap <Lock className="w-3 h-3 text-slate-400" />
                            </label>
                            <input
                                type="text"
                                readOnly
                                value={name}
                                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                                Program Studi <Lock className="w-3 h-3 text-slate-400" />
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="Teknik Informatika"
                                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                                Dosen Pembimbing <Lock className="w-3 h-3 text-slate-400" />
                            </label>
                            <input
                                type="text"
                                readOnly
                                value={dosenPembimbing || 'Belum Diplot'}
                                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Tujuan Instansi & Jadwal Pelaksanaan */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                            <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">Instansi Tujuan & Jadwal KP</h2>
                            <p className="text-xs text-slate-500">Tentukan nama instansi serta rentang tanggal pelaksanaan.</p>
                        </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                                Nama Instansi / Perusahaan <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Building2 className="w-4 h-4" /></span>
                                <input
                                    type="text"
                                    required
                                    value={form.data.nama_instansi}
                                    onChange={e => form.setData('nama_instansi', e.target.value)}
                                    placeholder="Contoh: PT Telkom Indonesia (Persero) Tbk"
                                    className={`w-full pl-10 pr-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition ${form.errors.nama_instansi ? 'border-red-500' : 'border-slate-300'}`}
                                />
                            </div>
                            {form.errors.nama_instansi && <p className="text-xs text-red-600">{form.errors.nama_instansi}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                                Alamat Lengkap Instansi <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-3 text-slate-400"><MapPin className="w-4 h-4" /></span>
                                <textarea
                                    required
                                    rows={3}
                                    value={form.data.alamat_instansi}
                                    onChange={e => form.setData('alamat_instansi', e.target.value)}
                                    placeholder="Alamat kantor, gedung/divisi, kota, dan kode pos tujuan..."
                                    className={`w-full pl-10 pr-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition ${form.errors.alamat_instansi ? 'border-red-500' : 'border-slate-300'}`}
                                />
                            </div>
                            {form.errors.alamat_instansi && <p className="text-xs text-red-600">{form.errors.alamat_instansi}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                                    Tanggal Mulai <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Calendar className="w-4 h-4" /></span>
                                    <input
                                        type="date"
                                        required
                                        value={form.data.tanggal_mulai}
                                        onChange={e => form.setData('tanggal_mulai', e.target.value)}
                                        className={`w-full pl-10 pr-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition ${form.errors.tanggal_mulai ? 'border-red-500' : 'border-slate-300'}`}
                                    />
                                </div>
                                {form.errors.tanggal_mulai && <p className="text-xs text-red-600">{form.errors.tanggal_mulai}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                                    Tanggal Selesai <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Calendar className="w-4 h-4" /></span>
                                    <input
                                        type="date"
                                        required
                                        value={form.data.tanggal_selesai}
                                        onChange={e => form.setData('tanggal_selesai', e.target.value)}
                                        className={`w-full pl-10 pr-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition ${form.errors.tanggal_selesai ? 'border-red-500' : 'border-slate-300'}`}
                                    />
                                </div>
                                {form.errors.tanggal_selesai && <p className="text-xs text-red-600">{form.errors.tanggal_selesai}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Block */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className={`w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-xs transition cursor-pointer ${form.processing ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{form.processing ? 'Menyimpan...' : 'Simpan Data Instansi'}</span>
                    </button>
                    {(suratStatus === 'draft' || suratStatus === 'revisi') && (
                        <a
                            href={cetakUrl}
                            target="_blank"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition cursor-pointer"
                        >
                            <Download className="w-4 h-4 text-slate-500" />
                            <span>Cetak Draf Surat (PDF)</span>
                        </a>
                    )}
                </div>
            </form>

            {/* Form Upload Scan Offline */}
            {(suratStatus === 'draft' || suratStatus === 'revisi') && (
                <form onSubmit={handleUpload} className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 sm:p-6 space-y-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <UploadCloud className="w-4 h-4 text-blue-700" />
                            Unggah Pindaian Surat Bertanda Tangan
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Unggah berkas pindaian (scan) surat pengantar yang telah ditandatangani dan dicap resmi untuk diverifikasi TU.</p>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                            Berkas Surat Pengantar Final (PDF) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            required
                            onChange={e => uploadForm.setData('file_scan', e.target.files ? e.target.files[0] : null)}
                            className={`w-full text-xs text-slate-600 border rounded-lg outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${uploadForm.errors.file_scan ? 'border-red-500' : 'border-slate-300'}`}
                        />
                        {uploadForm.errors.file_scan && <p className="text-xs text-red-600">{uploadForm.errors.file_scan}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={uploadForm.processing}
                        className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-xs transition cursor-pointer ${uploadForm.processing ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        <UploadCloud className="w-4 h-4" />
                        <span>{uploadForm.processing ? 'Mengunggah...' : 'Unggah Berkas Pindaian'}</span>
                    </button>
                </form>
            )}
        </div>
    );
}

SuratPengantar.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
