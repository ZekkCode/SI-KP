import React, { useRef, useState } from 'react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { useForm, Link } from '@inertiajs/react';
import { Calendar, Clock, Upload, X, ArrowLeft, Save } from 'lucide-react';
import InputError from '@/Components/InputError';
import { PageProps } from '@/types';

interface Props extends PageProps {
    logbook: {
        id: number;
        tanggal: string;
        jam_mulai: string | null;
        jam_selesai: string | null;
        deskripsi: string;
        path_foto: string | null;
    };
}

export default function Edit({ logbook }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(logbook.path_foto ? `/storage/${logbook.path_foto}` : null);

    const form = useForm({
        _method: 'put',
        tanggal: logbook.tanggal,
        jam_mulai: logbook.jam_mulai ? logbook.jam_mulai.substring(0, 5) : '',
        jam_selesai: logbook.jam_selesai ? logbook.jam_selesai.substring(0, 5) : '',
        deskripsi: logbook.deskripsi,
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
        form.post(`/mahasiswa/logbook/${logbook.id}`, {
            forceFormData: true,
        });
    };

    return (
        <div className="flex-1 p-4 sm:p-6 max-w-[1280px] mx-auto w-full space-y-6">
            <div className="flex flex-col gap-4">
                <Link
                    href="/mahasiswa/logbook"
                    className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors w-max font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Monitoring
                </Link>
                <div>
                    <h1 className="text-headline-md text-on-surface">Edit Catatan Kegiatan</h1>
                    <p className="text-body-md text-secondary mt-1">Ubah detail kegiatan harian Kerja Praktik Anda di sini.</p>
                </div>
            </div>

            <div className="bg-white border border-outline-variant rounded-xl p-6 sm:p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Tanggal */}
                        <div>
                            <label className="block text-label-md text-on-surface mb-1.5 font-semibold">
                                Tanggal <span className="text-error">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                                <input
                                    type="date"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-primary/30 outline-none transition-all text-sm ${
                                        form.errors.tanggal ? 'border-error' : 'border-outline-variant focus:border-primary'
                                    }`}
                                    value={form.data.tanggal}
                                    onChange={(e) => form.setData('tanggal', e.target.value)}
                                />
                            </div>
                            <InputError message={form.errors.tanggal} className="mt-1" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Jam Mulai */}
                        <div>
                            <label className="block text-label-md text-on-surface mb-1.5 font-semibold">
                                Jam Mulai
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                                <input
                                    type="time"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-primary/30 outline-none transition-all text-sm ${
                                        form.errors.jam_mulai ? 'border-error' : 'border-outline-variant focus:border-primary'
                                    }`}
                                    value={form.data.jam_mulai}
                                    onChange={(e) => form.setData('jam_mulai', e.target.value)}
                                />
                            </div>
                            <InputError message={form.errors.jam_mulai} className="mt-1" />
                        </div>

                        {/* Jam Selesai */}
                        <div>
                            <label className="block text-label-md text-on-surface mb-1.5 font-semibold">
                                Jam Selesai
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                                <input
                                    type="time"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-primary/30 outline-none transition-all text-sm ${
                                        form.errors.jam_selesai ? 'border-error' : 'border-outline-variant focus:border-primary'
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
                        <label className="block text-label-md text-on-surface mb-1.5 font-semibold">
                            Deskripsi Kegiatan <span className="text-error">*</span>
                        </label>
                        <textarea
                            rows={6}
                            className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-primary/30 outline-none transition-all text-sm resize-none ${
                                form.errors.deskripsi ? 'border-error' : 'border-outline-variant focus:border-primary'
                            }`}
                            placeholder="Tuliskan detail kegiatan yang Anda lakukan hari ini..."
                            value={form.data.deskripsi}
                            onChange={(e) => form.setData('deskripsi', e.target.value)}
                        />
                        <div className="flex justify-between mt-1">
                            <InputError message={form.errors.deskripsi} />
                            <p className="text-label-sm text-on-surface-variant">
                                {form.data.deskripsi.length}/5000
                            </p>
                        </div>
                    </div>

                    {/* Foto Upload */}
                    <div>
                        <label className="block text-label-md text-on-surface mb-1.5 font-semibold">
                            Dokumentasi Foto
                        </label>

                        {previewImage && (
                            <div className="relative mb-4 inline-block">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="rounded-xl border border-outline-variant max-h-56 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewImage(null);
                                        form.setData('foto', null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="absolute -top-3 -right-3 p-1.5 rounded-full bg-error text-on-error shadow-md hover:bg-error/90 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {!previewImage && (
                            <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-outline-variant hover:border-primary/50 hover:bg-primary-fixed/30 transition-all cursor-pointer group">
                                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-container transition-colors">
                                    <Upload className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                                </div>
                                <div className="text-center">
                                    <span className="block text-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors mb-1">
                                        Klik untuk upload dokumentasi foto
                                    </span>
                                    <span className="block text-xs text-secondary">
                                        Format: JPG, PNG, WEBP (Maksimal 2MB)
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
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-outline-variant">
                        <Link
                            href="/mahasiswa/logbook"
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant border border-outline-variant hover:bg-surface-container transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="bg-primary text-on-primary hover:bg-primary/90 px-6 py-2.5 rounded-lg text-label-md font-semibold transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            {form.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

Edit.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
