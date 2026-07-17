import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React, { useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Building2, Calendar, UploadCloud, CheckCircle2, Save, FileText, Info, AlertCircle } from 'lucide-react';

interface PendaftaranData {
    id: number;
    status: string;
    nama_instansi: string;
    alamat_instansi: string;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    bidang_minat: string | null;
    catatan_tu: string | null;
    krs_uploaded: boolean;
    krs_file_name: string | null;
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
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_instansi: pendaftaran?.nama_instansi || '',
        alamat_instansi: pendaftaran?.alamat_instansi || '',
        tanggal_mulai: pendaftaran?.tanggal_mulai || '',
        tanggal_selesai: pendaftaran?.tanggal_selesai || '',
        krs_file: null as File | null,
        transkrip_file: null as File | null,
    });

    const isSubmitted = !!pendaftaran && !['draft', 'perlu_perbaikan'].includes(pendaftaran.status);
    const needsRevision = pendaftaran?.status === 'perlu_perbaikan';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'krs_file' | 'transkrip_file') => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran file melebihi 2MB!');
                return;
            }
            setData(type, file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mahasiswa/pendaftaran', {
            forceFormData: true,
        });
    };

    const handleSaveDraft = () => {
        post('/mahasiswa/pendaftaran/draft', {
            forceFormData: true,
        });
    };

    return (
        <div className="flex-1 p-6 max-w-[1280px] mx-auto w-full relative">
            <div className="mb-8">
                <h1 className="text-display-lg text-on-surface mb-2">Form Pendaftaran Kerja Praktik</h1>
                <p className="text-body-md text-secondary">Lengkapi data berikut untuk mengajukan izin pelaksanaan Kerja Praktik ke instansi tujuan.</p>
            </div>

            {/* Flash Messages */}
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

            {/* Revision Notice */}
            {needsRevision && pendaftaran?.catatan_tu && (
                <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">Perlu Perbaikan</p>
                        <p className="text-sm mt-1">{pendaftaran.catatan_tu}</p>
                    </div>
                </div>
            )}

            {/* Already Submitted Banner */}
            {isSubmitted && (
                <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-xl flex items-center gap-3">
                    <Info className="w-6 h-6 text-blue-600" />
                    <div>
                        <p className="font-bold">Pendaftaran Sudah Diajukan</p>
                        <p className="text-sm">Status saat ini: <strong>{pendaftaran?.status?.replace(/_/g, ' ')}</strong>. Form tidak dapat diubah.</p>
                    </div>
                </div>
            )}

            <form className="grid grid-cols-1 lg:grid-cols-12 gap-6" onSubmit={handleSubmit}>
                <div className="col-span-12 lg:col-span-7 space-y-6">
                    <section className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <Building2 className="w-6 h-6" />
                            <h3 className="text-title-lg">Informasi Instansi</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-label-md text-on-surface-variant mb-2" htmlFor="nama_instansi">Nama Instansi</label>
                                <input
                                    type="text"
                                    id="nama_instansi"
                                    required
                                    disabled={isSubmitted}
                                    value={data.nama_instansi}
                                    onChange={(e) => setData('nama_instansi', e.target.value)}
                                    placeholder="Contoh: PT. Teknologi Indonesia"
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-body-md ${errors.nama_instansi ? 'border-error' : 'border-outline-variant'} ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                />
                                {errors.nama_instansi && <p className="text-error text-body-sm mt-1">{errors.nama_instansi}</p>}
                            </div>
                            <div>
                                <label className="block text-label-md text-on-surface-variant mb-2" htmlFor="alamat_instansi">Alamat Instansi</label>
                                <textarea
                                    id="alamat_instansi"
                                    required
                                    disabled={isSubmitted}
                                    value={data.alamat_instansi}
                                    onChange={(e) => setData('alamat_instansi', e.target.value)}
                                    placeholder="Alamat lengkap instansi/perusahaan..."
                                    rows={4}
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-body-md resize-none ${errors.alamat_instansi ? 'border-error' : 'border-outline-variant'} ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                ></textarea>
                                {errors.alamat_instansi && <p className="text-error text-body-sm mt-1">{errors.alamat_instansi}</p>}
                            </div>
                        </div>
                    </section>

                    <section className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <Calendar className="w-6 h-6" />
                            <h3 className="text-title-lg">Durasi Pelaksanaan</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-label-md text-on-surface-variant mb-2" htmlFor="tanggal_mulai">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    id="tanggal_mulai"
                                    required
                                    disabled={isSubmitted}
                                    value={data.tanggal_mulai}
                                    onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-body-md ${errors.tanggal_mulai ? 'border-error' : 'border-outline-variant'} ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                />
                                {errors.tanggal_mulai && <p className="text-error text-body-sm mt-1">{errors.tanggal_mulai}</p>}
                            </div>
                            <div>
                                <label className="block text-label-md text-on-surface-variant mb-2" htmlFor="tanggal_selesai">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    id="tanggal_selesai"
                                    required
                                    disabled={isSubmitted}
                                    value={data.tanggal_selesai}
                                    onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-body-md ${errors.tanggal_selesai ? 'border-error' : 'border-outline-variant'} ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                />
                                {errors.tanggal_selesai && <p className="text-error text-body-sm mt-1">{errors.tanggal_selesai}</p>}
                            </div>
                        </div>
                        <p className="mt-4 text-body-sm text-secondary bg-surface-container-low p-4 rounded-lg border border-primary/10 flex items-start gap-3">
                            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            Kerja Praktik umumnya dilaksanakan selama 1 sampai 3 bulan sesuai dengan kurikulum yang berlaku.
                        </p>
                    </section>
                </div>

                <div className="col-span-12 lg:col-span-5 space-y-6">
                    <section className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <UploadCloud className="w-6 h-6" />
                            <h3 className="text-title-lg">Berkas Persyaratan</h3>
                        </div>

                        <div className="mb-6">
                            <label className="block text-label-md text-on-surface-variant mb-2">Kartu Rencana Studi (KRS)</label>
                            <div className="relative group">
                                <input type="file" accept=".pdf" id="upload_krs" className="hidden" disabled={isSubmitted} onChange={(e) => handleFileChange(e, 'krs_file')} />
                                <label
                                    htmlFor="upload_krs"
                                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
                                        data.krs_file || pendaftaran?.krs_uploaded
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-primary/30 bg-primary-container/5 hover:border-primary hover:bg-primary-container/10'
                                    } ${isSubmitted ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    {data.krs_file ? (
                                        <>
                                            <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                                            <span className="text-label-md text-green-600 truncate px-4 max-w-full">{data.krs_file.name}</span>
                                            <span className="text-body-sm text-secondary mt-1">File siap diunggah ({(data.krs_file.size / 1024 / 1024).toFixed(2)}MB)</span>
                                        </>
                                    ) : pendaftaran?.krs_uploaded ? (
                                        <>
                                            <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                                            <span className="text-label-md text-green-600">{pendaftaran.krs_file_name}</span>
                                            <span className="text-body-sm text-secondary mt-1">File sudah diunggah sebelumnya</span>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="w-10 h-10 text-primary mb-2" />
                                            <span className="text-label-md text-primary">Klik atau seret file ke sini</span>
                                            <span className="text-body-sm text-secondary mt-1">Hanya format PDF</span>
                                        </>
                                    )}
                                </label>
                            </div>
                            <div className="flex justify-between items-center mt-2 px-1">
                                <span className="text-label-sm text-secondary">PDF Terunggah: {data.krs_file || pendaftaran?.krs_uploaded ? '1' : '0'} file</span>
                                <span className="text-label-sm text-error font-medium italic">Maksimal 2MB</span>
                            </div>
                            {errors.krs_file && <p className="text-error text-body-sm mt-1">{errors.krs_file}</p>}
                        </div>

                        <div>
                            <label className="block text-label-md text-on-surface-variant mb-2">Transkrip Nilai Terakhir</label>
                            <div className="relative group">
                                <input type="file" accept=".pdf" id="upload_transkrip" className="hidden" disabled={isSubmitted} onChange={(e) => handleFileChange(e, 'transkrip_file')} />
                                <label
                                    htmlFor="upload_transkrip"
                                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
                                        data.transkrip_file || pendaftaran?.transkrip_uploaded
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-primary/30 bg-primary-container/5 hover:border-primary hover:bg-primary-container/10'
                                    } ${isSubmitted ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    {data.transkrip_file ? (
                                        <>
                                            <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                                            <span className="text-label-md text-green-600 truncate px-4 max-w-full">{data.transkrip_file.name}</span>
                                            <span className="text-body-sm text-secondary mt-1">File siap diunggah ({(data.transkrip_file.size / 1024 / 1024).toFixed(2)}MB)</span>
                                        </>
                                    ) : pendaftaran?.transkrip_uploaded ? (
                                        <>
                                            <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                                            <span className="text-label-md text-green-600">{pendaftaran.transkrip_file_name}</span>
                                            <span className="text-body-sm text-secondary mt-1">File sudah diunggah sebelumnya</span>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="w-10 h-10 text-primary mb-2" />
                                            <span className="text-label-md text-primary">Klik atau seret file ke sini</span>
                                            <span className="text-body-sm text-secondary mt-1">Hanya format PDF</span>
                                        </>
                                    )}
                                </label>
                            </div>
                            <div className="flex justify-between items-center mt-2 px-1">
                                <span className="text-label-sm text-secondary">PDF Terunggah: {data.transkrip_file || pendaftaran?.transkrip_uploaded ? '1' : '0'} file</span>
                                <span className="text-label-sm text-error font-medium italic">Maksimal 2MB</span>
                            </div>
                            {errors.transkrip_file && <p className="text-error text-body-sm mt-1">{errors.transkrip_file}</p>}
                        </div>
                    </section>

                    <section className="bg-secondary-container/20 border border-outline-variant p-6 rounded-xl">
                        <h4 className="text-label-md font-bold text-on-secondary-container mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Konfirmasi Pendaftaran
                        </h4>
                        <p className="text-body-sm text-on-secondary-container mb-6">Pastikan seluruh data yang Anda masukkan sudah benar dan sesuai dengan dokumen yang diunggah.</p>
                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={processing || isSubmitted}
                                className={`w-full bg-primary text-white py-3 rounded-lg font-label-md hover:shadow-lg transition-all active:scale-[0.98] ${processing || isSubmitted ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                {processing ? 'Mengirim...' : isSubmitted ? 'Sudah Dikirim' : 'Kirim Pendaftaran'}
                            </button>
                            <button
                                type="button"
                                disabled={processing || isSubmitted}
                                onClick={handleSaveDraft}
                                className={`w-full bg-white border border-outline-variant text-secondary py-3 rounded-lg font-label-md hover:bg-surface-container-low transition-all ${processing || isSubmitted ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                Simpan Draft
                            </button>
                        </div>
                    </section>
                </div>
            </form>
        </div>
    );
}

Pendaftaran.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
