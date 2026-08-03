import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React, { FormEventHandler, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Building2, Calendar, UploadCloud, CheckCircle2, Save, FileText, Info, AlertCircle, UserCircle, ClipboardEdit, Verified } from 'lucide-react';

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

    // Single unified form for both profile details and files
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
                alert('Ukuran file melebihi 2MB!');
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
        <div className="flex-1 p-6 max-w-[768px] mx-auto w-full relative space-y-6">
            <div className="mb-6">
                <h1 className="text-display-lg text-on-surface mb-2">Pendaftaran Kerja Praktik</h1>
                <p className="text-body-md text-secondary">Lengkapi data akademik Anda dan unggah berkas persyaratan Kerja Praktik di bawah ini.</p>
            </div>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                        <p className="font-bold">Berhasil!</p>
                        <p className="text-sm">{flash.success}</p>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <div>
                        <p className="font-bold">Gagal!</p>
                        <p className="text-sm">{flash.error}</p>
                    </div>
                </div>
            )}

            {/* Revision Notice */}
            {needsRevision && pendaftaran?.catatan_tu && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-xl flex items-start gap-3 shadow-sm">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">Perlu Perbaikan</p>
                        <p className="text-sm mt-1">{pendaftaran.catatan_tu}</p>
                    </div>
                </div>
            )}

            {/* Already Submitted Banner */}
            {isSubmitted && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm">
                    <Info className="w-6 h-6 text-blue-600" />
                    <div>
                        <p className="font-bold">Pendaftaran Sudah Diajukan</p>
                        <p className="text-sm">Status saat ini: <strong>{pendaftaran?.status?.replace(/_/g, ' ')}</strong>. Form tidak dapat diubah.</p>
                    </div>
                </div>
            )}

            {/* SKS Validation warning */}
            {form.data.total_sks && !isValidSks && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-xl flex items-start gap-3 shadow-sm">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">Prasyarat Belum Terpenuhi</p>
                        <p className="text-sm mt-1">Anda wajib menempuh minimal 100 SKS untuk mendaftar Kerja Praktik. Total SKS Anda saat ini: {form.data.total_sks}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Data Personal Mahasiswa Card */}
                <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
                        <UserCircle className="w-6 h-6 text-primary" />
                        <div>
                            <h2 className="text-title-lg text-on-surface font-semibold">Data Personal Mahasiswa</h2>
                            <p className="text-body-sm text-secondary font-normal">Periksa dan lengkapi data akademik Anda.</p>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant font-medium">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    disabled={isSubmitted}
                                    value={form.data.name}
                                    onChange={e => form.setData('name', e.target.value)}
                                    placeholder="Masukkan nama sesuai KTP"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none ${form.errors.name ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'} ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                />
                                {form.errors.name && <p className="text-label-sm text-error">{form.errors.name}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant font-medium">NIM</label>
                                <input type="text" readOnly value={user.nim || ''} className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-variant/30 text-secondary cursor-not-allowed outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant font-medium">Program Studi</label>
                                <input type="text" readOnly value={user.program_studi?.nama || '-'} className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-variant/30 text-secondary cursor-not-allowed outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant font-medium">Semester</label>
                                <select
                                    required
                                    disabled={isSubmitted}
                                    value={form.data.semester}
                                    onChange={e => form.setData('semester', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none bg-white ${form.errors.semester ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'} ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                >
                                    <option value="" disabled>Pilih Semester</option>
                                    <option value="Ganjil 2024/2025">Semester Ganjil 2024/2025</option>
                                    <option value="Genap 2024/2025">Semester Genap 2024/2025</option>
                                    <option value="Ganjil 2025/2026">Semester Ganjil 2025/2026</option>
                                    <option value="Genap 2025/2026">Semester Genap 2025/2026</option>
                                    <option value="Ganjil 2026/2027">Semester Ganjil 2026/2027</option>
                                    <option value="Genap 2026/2027">Semester Genap 2026/2027</option>
                                    <option value="Ganjil 2027/2028">Semester Ganjil 2027/2028</option>
                                    <option value="Genap 2027/2028">Semester Genap 2027/2028</option>
                                </select>
                                {form.errors.semester && <p className="text-label-sm text-error">{form.errors.semester}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant font-medium">Nomor WhatsApp</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-body-sm">+62</span>
                                    <input
                                        type="tel"
                                        required
                                        disabled={isSubmitted}
                                        value={form.data.no_telepon.replace(/^08/, '8')}
                                        onChange={e => form.setData('no_telepon', '08' + e.target.value.replace(/^8/, ''))}
                                        placeholder="8123456789"
                                        className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none ${form.errors.no_telepon ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'} ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                {form.errors.no_telepon && <p className="text-label-sm text-error">{form.errors.no_telepon}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant font-medium">Email Institusi</label>
                                <input
                                    type="email"
                                    required
                                    disabled={isSubmitted}
                                    value={form.data.email}
                                    onChange={e => form.setData('email', e.target.value)}
                                    placeholder="nama@student.univ.ac.id"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none ${form.errors.email ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'} ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                />
                                {form.errors.email && <p className="text-label-sm text-error">{form.errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant font-medium">Total SKS Ditempuh</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    disabled={isSubmitted}
                                    placeholder="Contoh: 105"
                                    value={form.data.total_sks}
                                    onChange={(e) => form.setData('total_sks', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none ${form.data.total_sks && (!isValidSks || form.errors.total_sks) ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'} ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                />
                                <p className={`text-label-sm ${form.data.total_sks && (!isValidSks || form.errors.total_sks) ? 'text-error' : form.data.total_sks && isValidSks ? 'text-primary' : 'text-secondary'}`}>
                                    {form.errors.total_sks ? form.errors.total_sks : form.data.total_sks && !isValidSks ? '⚠️ SKS Anda belum mencukupi prasyarat (Min. 100).' : form.data.total_sks && isValidSks ? '✅ SKS memenuhi prasyarat pendaftaran.' : 'Masukkan angka total SKS dari KHS terakhir.'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant font-medium">IPK Terakhir</label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    min="0.00"
                                    max="4.00"
                                    disabled={isSubmitted}
                                    placeholder="Contoh: 3.50"
                                    value={form.data.ipk}
                                    onChange={(e) => form.setData('ipk', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none ${form.errors.ipk ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'} ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                />
                                {form.errors.ipk && <p className="text-label-sm text-error">{form.errors.ipk}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Berkas Persyaratan Card */}
                <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm space-y-6">
                    <div className="flex items-center gap-2 text-primary font-semibold border-b border-outline-variant pb-4">
                        <UploadCloud className="w-6 h-6" />
                        <h3 className="text-title-lg">Berkas Persyaratan</h3>
                    </div>

                    <div>
                        <label className="block text-label-md text-on-surface-variant mb-2">Transkrip Nilai Terakhir</label>
                        <div className="relative group">
                            <input type="file" accept=".pdf" id="upload_transkrip" className="hidden" disabled={isSubmitted} onChange={(e) => handleFileChange(e, 'transkrip_file')} />
                            <label
                                htmlFor="upload_transkrip"
                                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
                                    form.data.transkrip_file || pendaftaran?.transkrip_uploaded
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-primary/30 bg-primary-container/5 hover:border-primary hover:bg-primary-container/10'
                                } ${isSubmitted ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                {form.data.transkrip_file ? (
                                    <>
                                        <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                                        <span className="text-label-md text-green-600 truncate px-4 max-w-full">{form.data.transkrip_file.name}</span>
                                        <span className="text-body-sm text-secondary mt-1">File siap diunggah ({(form.data.transkrip_file.size / 1024 / 1024).toFixed(2)}MB)</span>
                                    </>
                                ) : pendaftaran?.transkrip_uploaded ? (
                                    <>
                                        <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                                        <span className="text-label-md text-green-600 truncate px-4 max-w-full">{pendaftaran.transkrip_file_name}</span>
                                        <span className="text-body-sm text-secondary mt-1">File sudah diunggah sebelumnya</span>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="w-10 h-10 text-primary mb-2" />
                                        <span className="text-label-md text-primary font-medium">Klik untuk unggah Transkrip Nilai</span>
                                        <span className="text-body-sm text-secondary mt-1">Hanya format PDF</span>
                                    </>
                                )}
                            </label>
                        </div>
                        <div className="flex justify-between items-center mt-2 px-1">
                            <span className="text-label-sm text-secondary">Maksimal 2MB</span>
                        </div>
                        {form.errors.transkrip_file && <p className="text-error text-body-sm mt-1">{form.errors.transkrip_file}</p>}
                    </div>
                </div>

                {/* Submit Action Card */}
                <div className="bg-secondary-container/20 border border-outline-variant p-6 rounded-xl shadow-sm">
                    <h4 className="text-label-md font-bold text-on-secondary-container mb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Konfirmasi Pendaftaran
                    </h4>
                    <p className="text-body-sm text-on-secondary-container mb-6">Pastikan seluruh data personal dan berkas persyaratan yang Anda masukkan sudah benar sebelum melakukan pengiriman.</p>
                    <button
                        type="submit"
                        disabled={form.processing || isSubmitted || !isValidSks}
                        className={`w-full bg-primary text-white py-3 rounded-lg font-label-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${form.processing || isSubmitted || !isValidSks ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        {form.processing ? 'Mengirim...' : isSubmitted ? 'Pendaftaran Sudah Dikirim' : 'Kirim Pendaftaran'}
                    </button>
                </div>
            </form>
        </div>
    );
}

Pendaftaran.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
