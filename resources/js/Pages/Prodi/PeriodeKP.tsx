import ProdiLayout from '@/Layouts/ProdiLayout';
import React, { useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { CheckCircle, Calendar } from 'lucide-react';

interface Periode {
    id: number;
    semester: string;
    tanggal_pendaftaran: string;
    tanggal_batas_pendaftaran: string;
    tanggal_batas_pengajuan_surat: string;
    tanggal_pendaftaran_formatted: string;
    tanggal_batas_pendaftaran_formatted: string;
    tanggal_batas_pengajuan_surat_formatted: string;
}

interface Props {
    periodes: Periode[];
    selectedPeriode: {
        id: number;
        semester: string;
        tanggal_pendaftaran: string;
        tanggal_batas_pendaftaran: string;
        tanggal_batas_pengajuan_surat: string;
    } | null;
    flash: {
        success?: string;
        error?: string;
    };
}

export default function PeriodeKP({ periodes, selectedPeriode, flash }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        semester: '',
        tanggal_pendaftaran: '',
        tanggal_batas_pendaftaran: '',
        tanggal_batas_pengajuan_surat: '',
    });

    useEffect(() => {
        if (selectedPeriode) {
            setData({
                semester: selectedPeriode.semester,
                tanggal_pendaftaran: selectedPeriode.tanggal_pendaftaran,
                tanggal_batas_pendaftaran: selectedPeriode.tanggal_batas_pendaftaran,
                tanggal_batas_pengajuan_surat: selectedPeriode.tanggal_batas_pengajuan_surat,
            });
        } else {
            setData({
                semester: '',
                tanggal_pendaftaran: '',
                tanggal_batas_pendaftaran: '',
                tanggal_batas_pengajuan_surat: '',
            });
        }
    }, [selectedPeriode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPeriode) {
            post(`/prodi/periode/${selectedPeriode.id}`, {
                onSuccess: () => {
                    reset();
                    router.get('/prodi/periode');
                }
            });
        } else {
            post('/prodi/periode', {
                onSuccess: () => {
                    reset();
                }
            });
        }
    };

    const handleEdit = (id: number) => {
        router.get('/prodi/periode', { id }, { preserveState: true });
    };

    const handleCancelEdit = () => {
        router.get('/prodi/periode');
    };

    const semesters = [
        'Gasal 2025/2026',
        'Genap 2025/2026',
        'Gasal 2026/2027',
        'Genap 2026/2027',
        'Gasal 2027/2028',
        'Genap 2027/2028'
    ];

    return (
        <div className="max-w-[900px] mx-auto py-8 px-4 md:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Head title="Pendaftaran & Pengajuan Surat Pengantar" />

            {flash?.success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                        <p className="font-bold">Berhasil!</p>
                        <p className="text-sm">{flash.success}</p>
                    </div>
                </div>
            )}

            {/* Form Section */}
            <div className="bg-white border border-outline-variant rounded-2xl p-8 shadow-sm space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-3xl font-display font-semibold text-primary">
                        Pendaftaran & Pengajuan Surat Pengantar
                    </h2>
                    <h2 className="text-2xl md:text-3xl font-display font-semibold text-primary">
                        Kerja Praktek
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Semester Dropdown */}
                    <div>
                        <label className="block text-sm font-semibold text-on-surface mb-1.5">
                            Semester <span className="text-error">*</span>
                        </label>
                        <select
                            value={data.semester}
                            onChange={(e) => setData('semester', e.target.value)}
                            className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                errors.semester ? 'border-error' : 'border-outline-variant focus:border-primary'
                            }`}
                            required
                        >
                            <option value="">Pilih Semester</option>
                            {semesters.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {errors.semester && <p className="text-error text-xs mt-1">{errors.semester}</p>}
                    </div>

                    {/* Tanggal Pendaftaran */}
                    <div>
                        <label className="block text-sm font-semibold text-on-surface mb-1.5">
                            Tanggal pendaftaran
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={data.tanggal_pendaftaran}
                                onChange={(e) => setData('tanggal_pendaftaran', e.target.value)}
                                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                    errors.tanggal_pendaftaran ? 'border-error' : 'border-outline-variant focus:border-primary'
                                }`}
                                required
                            />
                        </div>
                        {errors.tanggal_pendaftaran && <p className="text-error text-xs mt-1">{errors.tanggal_pendaftaran}</p>}
                    </div>

                    {/* Tanggal Batas Pendaftaran */}
                    <div>
                        <label className="block text-sm font-semibold text-on-surface mb-1.5">
                            Tanggal batas pendaftaran
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={data.tanggal_batas_pendaftaran}
                                onChange={(e) => setData('tanggal_batas_pendaftaran', e.target.value)}
                                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                    errors.tanggal_batas_pendaftaran ? 'border-error' : 'border-outline-variant focus:border-primary'
                                }`}
                                required
                            />
                        </div>
                        {errors.tanggal_batas_pendaftaran && <p className="text-error text-xs mt-1">{errors.tanggal_batas_pendaftaran}</p>}
                    </div>

                    {/* Tanggal Batas Pengajuan Surat */}
                    <div>
                        <label className="block text-sm font-semibold text-on-surface mb-1.5">
                            Tanggal batas pengajuan surat
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={data.tanggal_batas_pengajuan_surat}
                                onChange={(e) => setData('tanggal_batas_pengajuan_surat', e.target.value)}
                                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                    errors.tanggal_batas_pengajuan_surat ? 'border-error' : 'border-outline-variant focus:border-primary'
                                }`}
                                required
                            />
                        </div>
                        {errors.tanggal_batas_pengajuan_surat && <p className="text-error text-xs mt-1">{errors.tanggal_batas_pengajuan_surat}</p>}
                    </div>

                    {/* Submit Actions */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#0070f3] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {selectedPeriode ? 'Perbarui' : 'Submit'}
                        </button>
                        {selectedPeriode && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="border border-outline-variant text-secondary px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors"
                            >
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Table Section */}
            <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-outline-variant text-label-md font-bold text-on-surface">
                                <th className="px-6 py-4">No.</th>
                                <th className="px-6 py-4">Semester</th>
                                <th className="px-6 py-4">Tgl Pendaftaran</th>
                                <th className="px-6 py-4">Tgl batas Pendaftaran</th>
                                <th className="px-6 py-4">Tgl batas Pengajuan Surat</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/50 text-body-md text-on-surface">
                            {periodes.length > 0 ? (
                                periodes.map((p, idx) => (
                                    <tr key={p.id} className="hover:bg-surface-container-low/30 transition-colors">
                                        <td className="px-6 py-4 text-secondary">{idx + 1}</td>
                                        <td className="px-6 py-4 font-semibold text-primary">{p.semester}</td>
                                        <td className="px-6 py-4 text-sm">{p.tanggal_pendaftaran_formatted}</td>
                                        <td className="px-6 py-4 text-sm">{p.tanggal_batas_pendaftaran_formatted}</td>
                                        <td className="px-6 py-4 text-sm">{p.tanggal_batas_pengajuan_surat_formatted}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleEdit(p.id)}
                                                className="border border-[#0070f3] text-[#0070f3] hover:bg-blue-50 px-4 py-1.5 rounded text-sm font-medium transition-colors"
                                            >
                                                edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-secondary">
                                        <Calendar className="w-12 h-12 mx-auto mb-2 text-secondary/50" />
                                        <p>Belum ada data periode yang dikonfigurasi.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

PeriodeKP.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
