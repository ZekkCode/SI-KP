import React, { useRef, useState } from 'react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { useForm, Link } from '@inertiajs/react';
import { Calendar, Clock, Upload, X, ArrowLeft, Save } from 'lucide-react';
import InputError from '@/Components/InputError';
import { PageProps } from '@/types';

export default function Create() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const form = useForm({
        tanggal: '',
        jam_mulai: '',
        jam_selesai: '',
        deskripsi: '',
        foto: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran foto maksimal 2MB!');
                return;
            }
            form.setData('foto', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/mahasiswa/logbook', {
            forceFormData: true,
        });
    };

    return (
        <div className="flex-1 p-4 sm:p-6 max-w-[1280px] mx-auto w-full space-y-6">
            <div className="flex flex-col gap-3">
                <Link
                    href="/mahasiswa/logbook"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-700 transition-colors w-max font-semibold"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar Logbook
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Tambah Catatan Kegiatan</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Catat aktivitas harian, jam pelaksanaan, dan dokumentasi foto kegiatan Kerja Praktik.</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Tanggal */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Tanggal Kegiatan <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="date"
                                    className={`w-full pl-9 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm ${
                                        form.errors.tanggal ? 'border-red-400' : 'border-slate-300 focus:border-blue-600'
                                    }`}
                                    value={form.data.tanggal}
                                    onChange={(e) => form.setData('tanggal', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={form.errors.tanggal} className="mt-1" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Jam Mulai */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Jam Mulai
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="time"
                                    className={`w-full pl-9 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm ${
                                        form.errors.jam_mulai ? 'border-red-400' : 'border-slate-300 focus:border-blue-600'
                                    }`}
                                    value={form.data.jam_mulai}
                                    onChange={(e) => form.setData('jam_mulai', e.target.value)}
                                />
                            </div>
                            <InputError message={form.errors.jam_mulai} className="mt-1" />
                        </div>

                        {/* Jam Selesai */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Jam Selesai
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="time"
                                    className={`w-full pl-9 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm ${
                                        form.errors.jam_selesai ? 'border-red-400' : 'border-slate-300 focus:border-blue-600'
                                    }`}
                                    value={form.data.jam_selesai}
                                    onChange={(e) => form.setData('jam_selesai', e.target.value)}
                                />
                            </div>
                            <InputError message={form.errors.jam_selesai} className="mt-1" />
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Deskripsi Rincian Kegiatan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={5}
                            className={`w-full px-3.5 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm resize-none ${
                                form.errors.deskripsi ? 'border-red-400' : 'border-slate-300 focus:border-blue-600'
                            }`}
                            placeholder="Uraikan tugas, pekerjaan, atau pembelajaran yang Anda laksanakan hari ini..."
                            value={form.data.deskripsi}
                            onChange={(e) => form.setData('deskripsi', e.target.value)}
                            required
                        />
                        <div className="flex justify-between mt-1">
                            <InputError message={form.errors.deskripsi} />
                            <p className="text-[11px] text-slate-400">
                                {form.data.deskripsi.length}/5000 karakter
                            </p>
                        </div>
                    </div>

                    {/* Foto Upload */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Dokumentasi Foto Kegiatan (Opsional)
                        </label>

                        {previewImage && (
                            <div className="relative mb-3 inline-block">
                                <img
                                    src={previewImage}
                                    alt="Pratinjau"
                                    className="rounded-xl border border-slate-200 max-h-52 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewImage(null);
                                        form.setData('foto', null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="absolute -top-2.5 -right-2.5 p-1 rounded-md bg-red-600 text-white shadow hover:bg-red-700 transition-colors"
                                    title="Hapus foto"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {!previewImage && (
                            <label className="flex flex-col items-center justify-center gap-2.5 p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-600 hover:bg-blue-50/20 transition-all cursor-pointer group">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors text-slate-500">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <div className="text-center">
                                    <span className="block text-xs font-semibold text-slate-700 group-hover:text-blue-700 transition-colors mb-0.5">
                                        Klik untuk unggah foto dokumentasi
                                    </span>
                                    <span className="block text-[11px] text-slate-400">
                                        Format JPG, PNG, atau WEBP (Maks. 2MB)
                                    </span>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        )}
                        <InputError message={form.errors.foto} className="mt-1" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-slate-100">
                        <Link
                            href="/mahasiswa/logbook"
                            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#00288e] hover:bg-blue-800 text-white active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {form.processing ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Simpan Catatan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

Create.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
