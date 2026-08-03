import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import { FileText, Building2, MapPin, Calendar, CheckCircle2, Lock, User, Info, AlertCircle, Download, BookOpen, UserCheck } from 'lucide-react';
import { PageProps } from '@/types';

interface PendaftaranData {
    id: number;
    status: string;
    nama_instansi: string;
    alamat_instansi: string;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    surat_pengantar: {
        id: number;
        nomor_surat: string;
        tanggal_terbit: string;
        path_file: string | null;
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

    // Form data mapped to instansi and date inputs
    const form = useForm({
        nama_instansi: pendaftaran?.nama_instansi || '',
        alamat_instansi: pendaftaran?.alamat_instansi || '',
        tanggal_mulai: pendaftaran?.tanggal_mulai || '',
        tanggal_selesai: pendaftaran?.tanggal_selesai || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/mahasiswa/surat-pengantar', {
            preserveScroll: true,
        });
    };

    return (
        <div className="flex-1 p-6 max-w-[768px] mx-auto w-full relative space-y-6">
            <div className="mb-6">
                <h1 className="text-display-lg text-on-surface mb-2">Pengajuan Surat Pengantar</h1>
                <p className="text-body-md text-secondary">
                    Ajukan surat pengantar resmi ke instansi atau perusahaan tempat Anda melaksanakan Kerja Praktik.
                </p>
            </div>

            {/* Flash Alerts */}
            {flash?.success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm animate-fade-in">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                        <p className="font-bold">Berhasil!</p>
                        <p className="text-sm">{flash.success}</p>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm animate-fade-in">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                        <p className="font-bold">Gagal!</p>
                        <p className="text-sm">{flash.error}</p>
                    </div>
                </div>
            )}

            {/* Cover Letter Issued Banner */}
            {pendaftaran?.surat_pengantar && (
                <div className="bg-gradient-to-r from-primary/10 to-primary-container/20 border border-primary/20 rounded-xl p-6 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <span className="bg-green-100 text-green-700 text-label-sm font-bold px-3 py-1 rounded-full mb-2 inline-block">
                                    Surat Pengantar Terbit
                                </span>
                                <h4 className="text-title-lg text-on-surface font-bold">Surat Pengantar Resmi</h4>
                                <p className="text-body-sm text-secondary">Nomor: {pendaftaran.surat_pengantar.nomor_surat}</p>
                            </div>
                            <FileText className="w-10 h-10 text-primary" />
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-dashed border-outline-variant pt-4 gap-4">
                            <div>
                                <p className="text-label-sm text-secondary">Tanggal Terbit</p>
                                <p className="text-body-md text-on-surface font-medium">{pendaftaran.surat_pengantar.tanggal_terbit}</p>
                            </div>
                            {pendaftaran.surat_pengantar.path_file && (
                                <a
                                    href={`/storage/${pendaftaran.surat_pengantar.path_file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto flex items-center justify-center bg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:shadow-lg transition-all active:scale-[0.98] gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Unduh Surat Pengantar (PDF)
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Identitas Mahasiswa & Akademik Card */}
                    <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
                            <User className="w-6 h-6 text-primary" />
                            <div>
                                <h2 className="text-title-lg text-on-surface font-semibold">Identitas Mahasiswa</h2>
                                <p className="text-body-sm text-secondary">Informasi mahasiswa yang terdaftar pada sistem.</p>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50">
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant font-medium flex items-center gap-1.5">
                                    NIM <Lock className="w-3 h-3 text-secondary" />
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={nim}
                                    className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-variant/30 text-secondary cursor-not-allowed outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant font-medium flex items-center gap-1.5">
                                    Nama Lengkap <Lock className="w-3 h-3 text-secondary" />
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={name}
                                    className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-variant/30 text-secondary cursor-not-allowed outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant font-medium flex items-center gap-1.5">
                                    Jurusan / Program Studi <Lock className="w-3 h-3 text-secondary" />
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={jurusan}
                                    className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-variant/30 text-secondary cursor-not-allowed outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant font-medium flex items-center gap-1.5">
                                    Dosen Pembimbing <Lock className="w-3 h-3 text-secondary" />
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={dosenPembimbing || 'Belum Diplot'}
                                    className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-variant/30 text-secondary cursor-not-allowed outline-none"
                                />
                            </div>

                            <div className="space-y-1 md:col-span-2">
                                <label className="text-label-md text-on-surface-variant font-medium flex items-center gap-1.5">
                                    Surat Pengantar Untuk <Lock className="w-3 h-3 text-secondary" />
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value="Kerja Praktek"
                                    className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-variant/30 text-secondary cursor-not-allowed outline-none font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Informasi Perusahaan & Pelaksanaan Card */}
                    <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
                            <Building2 className="w-6 h-6 text-primary" />
                            <div>
                                <h2 className="text-title-lg text-on-surface font-semibold">Tujuan Instansi & Jadwal Pelaksanaan</h2>
                                <p className="text-body-sm text-secondary">Tentukan nama instansi/perusahaan tujuan serta tanggal pelaksanaan KP Anda.</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant font-medium">
                                    Nama Instansi / Perusahaan <span className="text-error">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary"><Building2 className="w-4 h-4" /></span>
                                    <input
                                        type="text"
                                        required
                                        disabled={isSubmitted}
                                        value={form.data.nama_instansi}
                                        onChange={e => form.setData('nama_instansi', e.target.value)}
                                        placeholder="Masukkan nama instansi yang dituju..."
                                        className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none ${form.errors.nama_instansi ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'} ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                {form.errors.nama_instansi && <p className="text-label-sm text-error">{form.errors.nama_instansi}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant font-medium">
                                    Alamat Instansi / Perusahaan <span className="text-error">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-secondary"><MapPin className="w-4 h-4" /></span>
                                    <textarea
                                        required
                                        disabled={isSubmitted}
                                        rows={3}
                                        value={form.data.alamat_instansi}
                                        onChange={e => form.setData('alamat_instansi', e.target.value)}
                                        placeholder="Masukkan alamat instansi yang dituju secara detail..."
                                        className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none ${form.errors.alamat_instansi ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'} ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                {form.errors.alamat_instansi && <p className="text-label-sm text-error">{form.errors.alamat_instansi}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-label-md text-on-surface-variant font-medium">
                                        Tanggal Mulai Kerja Praktik <span className="text-error">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary"><Calendar className="w-4 h-4" /></span>
                                        <input
                                            type="date"
                                            required
                                            disabled={isSubmitted}
                                            value={form.data.tanggal_mulai}
                                            onChange={e => form.setData('tanggal_mulai', e.target.value)}
                                            className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none bg-white ${form.errors.tanggal_mulai ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'} ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                    {form.errors.tanggal_mulai && <p className="text-label-sm text-error">{form.errors.tanggal_mulai}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-label-md text-on-surface-variant font-medium">
                                        Tanggal Selesai Kerja Praktik <span className="text-error">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary"><Calendar className="w-4 h-4" /></span>
                                        <input
                                            type="date"
                                            required
                                            disabled={isSubmitted}
                                            value={form.data.tanggal_selesai}
                                            onChange={e => form.setData('tanggal_selesai', e.target.value)}
                                            className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none bg-white ${form.errors.tanggal_selesai ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'} ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                    {form.errors.tanggal_selesai && <p className="text-label-sm text-error">{form.errors.tanggal_selesai}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Block */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            type="submit"
                            disabled={form.processing || isSubmitted}
                            className={`w-full sm:flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${form.processing || isSubmitted ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {form.processing ? 'Mengirim...' : isSubmitted ? 'Pengajuan Sudah Diajukan' : 'Submit'}
                        </button>
                        <Link
                            href="/mahasiswa/status-pengajuan"
                            className="w-full sm:w-auto bg-surface-container-highest text-on-surface border border-outline px-6 py-3 rounded-xl font-bold text-center hover:bg-surface-container-high transition-all active:scale-[0.98]"
                        >
                            Cek Status Pengajuan
                        </Link>
                    </div>
                </form>
        </div>
    );
}

SuratPengantar.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
