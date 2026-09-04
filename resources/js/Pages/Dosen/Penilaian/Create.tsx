import React from 'react';
import DosenLayout from '@/Layouts/DosenLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ChevronLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Mahasiswa {
    id: number;
    name: string;
    nim: string;
}

interface CreateProps extends PageProps {
    pendaftaran: {
        id: number;
        mahasiswa: Mahasiswa;
        status_kp: string;
        catatan: string | null;
    };
    nilai_sebelumnya: Record<string, number> | null;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Create({ pendaftaran, nilai_sebelumnya, flash }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        sistematika: nilai_sebelumnya?.sistematika ?? '',
        kedalaman: nilai_sebelumnya?.kedalaman ?? '',
        penguasaan: nilai_sebelumnya?.penguasaan ?? '',
        presentasi: nilai_sebelumnya?.presentasi ?? '',
        catatan: pendaftaran.catatan ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dosen.penilaian.store', pendaftaran.id));
    };

    return (
        <div className="flex-1 p-6 max-w-[800px] mx-auto w-full">
            <Head title="Input Nilai Kerja Praktik" />
            
            <Link 
                href={route('dosen.penilaian.index')} 
                className="inline-flex items-center gap-2 text-secondary hover:text-primary mb-6 transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Daftar
            </Link>

            <div className="mb-6">
                <h1 className="text-display-sm text-on-surface mb-2">Form Penilaian</h1>
                <p className="text-body-md text-secondary">
                    Masukkan komponen nilai Kerja Praktik untuk mahasiswa bimbingan Anda.
                </p>
            </div>

            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                        <p className="font-bold">Berhasil!</p>
                        <p className="text-sm">{flash.success}</p>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                        <p className="font-bold">Gagal!</p>
                        <p className="text-sm">{flash.error}</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant overflow-hidden mb-8">
                <div className="p-6 bg-surface-container-lowest border-b border-outline-variant">
                    <h2 className="text-title-md font-bold mb-1">Identitas Mahasiswa</h2>
                    <p className="text-secondary">{pendaftaran.mahasiswa.nim} - {pendaftaran.mahasiswa.name}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-label-md font-bold text-on-surface">
                                Sistematika Penulisan (20%) <span className="text-error">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                required
                                value={data.sistematika}
                                onChange={e => setData('sistematika', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.sistematika ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'}`}
                                placeholder="0 - 100"
                            />
                            {errors.sistematika && <p className="text-label-sm text-error">{errors.sistematika}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-label-md font-bold text-on-surface">
                                Kedalaman Materi (30%) <span className="text-error">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                required
                                value={data.kedalaman}
                                onChange={e => setData('kedalaman', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.kedalaman ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'}`}
                                placeholder="0 - 100"
                            />
                            {errors.kedalaman && <p className="text-label-sm text-error">{errors.kedalaman}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-label-md font-bold text-on-surface">
                                Penguasaan Materi (30%) <span className="text-error">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                required
                                value={data.penguasaan}
                                onChange={e => setData('penguasaan', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.penguasaan ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'}`}
                                placeholder="0 - 100"
                            />
                            {errors.penguasaan && <p className="text-label-sm text-error">{errors.penguasaan}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-label-md font-bold text-on-surface">
                                Presentasi (20%) <span className="text-error">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                required
                                value={data.presentasi}
                                onChange={e => setData('presentasi', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.presentasi ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'}`}
                                placeholder="0 - 100"
                            />
                            {errors.presentasi && <p className="text-label-sm text-error">{errors.presentasi}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-label-md font-bold text-on-surface">Catatan Tambahan (Opsional)</label>
                        <textarea
                            value={data.catatan}
                            onChange={e => setData('catatan', e.target.value)}
                            rows={4}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all ${errors.catatan ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'}`}
                            placeholder="Berikan catatan, masukan, atau revisi jika ada..."
                        ></textarea>
                        {errors.catatan && <p className="text-label-sm text-error">{errors.catatan}</p>}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-outline-variant">
                        <button
                            type="submit"
                            disabled={processing}
                            className={`bg-primary text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-all ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Penilaian'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

Create.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
