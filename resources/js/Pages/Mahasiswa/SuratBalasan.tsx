import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { useForm, Link } from '@inertiajs/react';
import React from 'react';
import { FileText, UploadCloud, Download, CheckCircle2, Calendar, Hash, Building2, AlertCircle } from 'lucide-react';
import InputError from '@/Components/InputError';

interface SuratBalasanData {
    nomor_surat: string;
    tanggal_surat: string;
    path_file: string;
}

interface Pendaftaran {
    id: number;
    status: string;
    surat_balasan: SuratBalasanData | null;
}

interface Props {
    pendaftaran: Pendaftaran | null;
}

export default function SuratBalasan({ pendaftaran }: Props) {
    const form = useForm({
        nomor_surat: '',
        tanggal_surat: '',
        file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/mahasiswa/surat-balasan', {
            forceFormData: true,
        });
    };

    return (
        <div className="flex-1 p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    Surat Balasan Instansi
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Unggah surat konfirmasi atau jawaban resmi dari instansi/perusahaan tempat Kerja Praktik.
                </p>
            </div>

            {pendaftaran?.surat_balasan ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-green-900">
                                Surat Balasan Berhasil Diunggah
                            </h3>
                            <p className="text-xs text-green-700">
                                Nomor Surat: <span className="font-semibold text-green-900">{pendaftaran.surat_balasan.nomor_surat}</span>
                            </p>
                            {pendaftaran.surat_balasan.tanggal_surat && (
                                <p className="text-xs text-green-700">
                                    Tanggal Surat: <span className="font-semibold text-green-900">{pendaftaran.surat_balasan.tanggal_surat}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-green-200/60 flex items-center gap-3">
                        <a
                            href="/mahasiswa/surat-balasan/download"
                            className="inline-flex items-center gap-2 bg-[#00288e] hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Unduh Surat Balasan
                        </a>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={submit}
                    className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-700">
                                Nomor Surat Resmi <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Contoh: 045/HRD-EXT/X/2026"
                                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    value={form.data.nomor_surat}
                                    onChange={(e) => form.setData('nomor_surat', e.target.value)}
                                    required
                                />
                            </div>
                            {form.errors.nomor_surat && <InputError message={form.errors.nomor_surat} />}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-700">
                                Tanggal Surat <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="date"
                                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    value={form.data.tanggal_surat}
                                    onChange={(e) => form.setData('tanggal_surat', e.target.value)}
                                    required
                                />
                            </div>
                            {form.errors.tanggal_surat && <InputError message={form.errors.tanggal_surat} />}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                            Pindaian (Scan) Surat Balasan (PDF, maks. 5MB) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/60 p-6 text-center hover:border-blue-600 hover:bg-blue-50/30 transition-all cursor-pointer group">
                            <input
                                type="file"
                                accept=".pdf,application/pdf"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) =>
                                    form.setData('file', e.target.files ? e.target.files[0] : null)
                                }
                                required
                            />
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                                    <UploadCloud className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-semibold text-slate-700 mb-0.5">
                                    {form.data.file ? form.data.file.name : 'Klik atau seret file PDF ke sini'}
                                </p>
                                <p className="text-[11px] text-slate-500">Hanya berkas format .pdf</p>
                            </div>
                        </div>
                        {form.errors.file && <InputError message={form.errors.file} />}
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="bg-[#00288e] hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50 active:scale-[0.98] flex items-center gap-2"
                        >
                            {form.processing ? 'Mengunggah...' : 'Unggah Surat Balasan'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

SuratBalasan.layout = (page: React.ReactNode) => (
    <MahasiswaLayout>
        {page}
    </MahasiswaLayout>
);