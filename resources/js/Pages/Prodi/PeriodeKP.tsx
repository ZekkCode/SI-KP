import ProdiLayout from '@/Layouts/ProdiLayout';
import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    CheckCircle, AlertCircle, Calendar, Edit3, Trash2, X, Plus, 
    Clock, CheckCircle2, ChevronRight, AlertTriangle 
} from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

interface Periode {
    id: number;
    semester: string;
    status?: 'aktif' | 'mendatang' | 'selesai';
    tanggal_pendaftaran: string;
    tanggal_batas_pendaftaran: string;
    tanggal_batas_pengajuan_surat: string;
    tanggal_pendaftaran_formatted: string;
    tanggal_batas_pendaftaran_formatted: string;
    tanggal_batas_pengajuan_surat_formatted: string;
}

interface Props {
    periodes: Periode[];
    selectedPeriode?: {
        id: number;
        semester: string;
        tanggal_pendaftaran: string;
        tanggal_batas_pendaftaran: string;
        tanggal_batas_pengajuan_surat: string;
    } | null;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function PeriodeKP({ periodes = [], selectedPeriode = null, flash }: Props) {
    // Mode kustom semester jika ingin mengetik manual
    const [isCustomSemester, setIsCustomSemester] = useState(false);
    
    // State periode yang sedang diedit
    const [editingPeriode, setEditingPeriode] = useState<Periode | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        semester: '',
        tanggal_pendaftaran: '',
        tanggal_batas_pendaftaran: '',
        tanggal_batas_pengajuan_surat: '',
    });

    const defaultSemesters = [
        'Gasal 2024/2025',
        'Genap 2024/2025',
        'Gasal 2025/2026',
        'Genap 2025/2026',
        'Gasal 2026/2027',
        'Genap 2026/2027',
        'Gasal 2027/2028',
        'Genap 2027/2028',
        'Gasal 2028/2029',
        'Genap 2028/2029',
    ];

    // Sinkronisasi jika ada selectedPeriode dari backend
    useEffect(() => {
        if (selectedPeriode) {
            const matchInList = defaultSemesters.includes(selectedPeriode.semester);
            setIsCustomSemester(!matchInList);
            setData({
                semester: selectedPeriode.semester,
                tanggal_pendaftaran: selectedPeriode.tanggal_pendaftaran || '',
                tanggal_batas_pendaftaran: selectedPeriode.tanggal_batas_pendaftaran || '',
                tanggal_batas_pengajuan_surat: selectedPeriode.tanggal_batas_pengajuan_surat || '',
            });
            const found = periodes.find(p => p.id === selectedPeriode.id);
            if (found) {
                setEditingPeriode(found);
            }
        }
    }, [selectedPeriode]);

    // Handle Edit baris tabel
    const handleStartEdit = (p: Periode) => {
        setEditingPeriode(p);
        clearErrors();
        const matchInList = defaultSemesters.includes(p.semester);
        setIsCustomSemester(!matchInList);
        setData({
            semester: p.semester,
            tanggal_pendaftaran: p.tanggal_pendaftaran || '',
            tanggal_batas_pendaftaran: p.tanggal_batas_pendaftaran || '',
            tanggal_batas_pengajuan_surat: p.tanggal_batas_pengajuan_surat || '',
        });

        // Scroll halus ke form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Batal Edit
    const handleCancelEdit = () => {
        setEditingPeriode(null);
        clearErrors();
        reset();
        setIsCustomSemester(false);
    };

    // Submit Form (Tambah Baru / Perbarui)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        if (editingPeriode) {
            // Mode Update
            post(route('prodi.periode.update', editingPeriode.id), {
                preserveScroll: true,
                onSuccess: () => {
                    handleCancelEdit();
                },
            });
        } else {
            // Mode Create / Store Baru
            post(route('prodi.periode.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setIsCustomSemester(false);
                },
            });
        }
    };

    // Hapus Periode
    const handleDelete = (id: number, semesterName: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data periode '${semesterName}'? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('prodi.periode.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    if (editingPeriode?.id === id) {
                        handleCancelEdit();
                    }
                },
            });
        }
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
            <Head title="Pengaturan Periode Pendaftaran & Pengajuan Surat KP" />

            <PageHeader
                title="Periode Pendaftaran & Pengajuan Surat KP"
                description="Konfigurasikan kalender semester, jadwal pendaftaran mahasiswa, dan batas akhir pengajuan surat pengantar Kerja Praktik."
            />

            {/* Flash Success Notification */}
            {flash?.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-4 rounded-2xl flex items-start gap-3 shadow-xs animate-in fade-in duration-200">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-sm">Operasi Berhasil</p>
                        <p className="text-xs text-emerald-800 mt-0.5">{flash.success}</p>
                    </div>
                </div>
            )}

            {/* Flash Error Notification */}
            {(flash?.error || hasErrors) && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 px-5 py-4 rounded-2xl flex items-start gap-3 shadow-xs animate-in fade-in duration-200">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-sm">Terjadi Kesalahan</p>
                        <p className="text-xs text-rose-800 mt-0.5">
                            {flash?.error || 'Silakan periksa input tanggal dan kolom yang bertanda merah di bawah ini.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Form Section Card */}
            <div className={`bg-white border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 transition-all ${
                editingPeriode ? 'border-indigo-400 ring-2 ring-indigo-500/20' : 'border-slate-200'
            }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`p-2 rounded-xl text-white ${editingPeriode ? 'bg-amber-600' : 'bg-indigo-700'}`}>
                                <Calendar className="w-5 h-5" />
                            </span>
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingPeriode ? `Edit Periode: ${editingPeriode.semester}` : 'Tambah Periode Pendaftaran Baru'}
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {editingPeriode 
                                ? 'Perbarui jadwal pembukaan dan penutupan pendaftaran serta batas pengajuan surat untuk semester ini.'
                                : 'Tetapkan jadwal semester dan batas waktu pengajuan KP untuk mahasiswa.'}
                        </p>
                    </div>

                    {editingPeriode && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-bold transition self-start cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                            <span>Batal Edit</span>
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                    {/* Semester Field */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="font-bold text-slate-700 block">
                                Semester Akademik <span className="text-rose-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCustomSemester(!isCustomSemester);
                                    setData('semester', '');
                                }}
                                className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-800 underline cursor-pointer"
                            >
                                {isCustomSemester ? 'Pilih dari daftar semester' : 'Input semester kustom / manual'}
                            </button>
                        </div>

                        {isCustomSemester ? (
                            <input
                                type="text"
                                required
                                value={data.semester}
                                onChange={(e) => setData('semester', e.target.value)}
                                placeholder="Contoh: Gasal 2026/2027 atau Semester Antara 2026"
                                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                                    errors.semester ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-600'
                                }`}
                            />
                        ) : (
                            <select
                                value={data.semester}
                                onChange={(e) => setData('semester', e.target.value)}
                                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                                    errors.semester ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-600'
                                }`}
                                required
                            >
                                <option value="">-- Pilih Semester Akademik --</option>
                                {defaultSemesters.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        )}
                        {errors.semester && (
                            <p className="text-rose-600 font-semibold text-[11px] mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.semester}
                            </p>
                        )}
                    </div>

                    {/* Grid 3 Kolom Tanggal */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 1. Tanggal Pendaftaran */}
                        <div className="space-y-1.5">
                            <label className="font-bold text-slate-700 block">
                                Tanggal Pembukaan Pendaftaran <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={data.tanggal_pendaftaran}
                                onChange={(e) => setData('tanggal_pendaftaran', e.target.value)}
                                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                                    errors.tanggal_pendaftaran ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-600'
                                }`}
                            />
                            {errors.tanggal_pendaftaran ? (
                                <p className="text-rose-600 font-semibold text-[11px] mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.tanggal_pendaftaran}
                                </p>
                            ) : (
                                <p className="text-slate-400 text-[10px]">Hari pertama mahasiswa dapat mendaftar KP.</p>
                            )}
                        </div>

                        {/* 2. Tanggal Batas Pendaftaran */}
                        <div className="space-y-1.5">
                            <label className="font-bold text-slate-700 block">
                                Tanggal Batas Pendaftaran <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                min={data.tanggal_pendaftaran || undefined}
                                value={data.tanggal_batas_pendaftaran}
                                onChange={(e) => setData('tanggal_batas_pendaftaran', e.target.value)}
                                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                                    errors.tanggal_batas_pendaftaran ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-600'
                                }`}
                            />
                            {errors.tanggal_batas_pendaftaran ? (
                                <p className="text-rose-600 font-semibold text-[11px] mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.tanggal_batas_pendaftaran}
                                </p>
                            ) : (
                                <p className="text-slate-400 text-[10px]">Batas akhir pendaftaran ditutup.</p>
                            )}
                        </div>

                        {/* 3. Tanggal Batas Pengajuan Surat */}
                        <div className="space-y-1.5">
                            <label className="font-bold text-slate-700 block">
                                Batas Pengajuan Surat Pengantar <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                min={data.tanggal_pendaftaran || undefined}
                                value={data.tanggal_batas_pengajuan_surat}
                                onChange={(e) => setData('tanggal_batas_pengajuan_surat', e.target.value)}
                                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                                    errors.tanggal_batas_pengajuan_surat ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-600'
                                }`}
                            />
                            {errors.tanggal_batas_pengajuan_surat ? (
                                <p className="text-rose-600 font-semibold text-[11px] mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.tanggal_batas_pengajuan_surat}
                                </p>
                            ) : (
                                <p className="text-slate-400 text-[10px]">Tenggat permohonan surat izin ke TU.</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={processing}
                            className={`px-6 py-2.5 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                                editingPeriode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-700 hover:bg-indigo-800'
                            }`}
                        >
                            {processing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    {editingPeriode ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    <span>{editingPeriode ? 'Perbarui Periode' : 'Simpan Periode Baru'}</span>
                                </>
                            )}
                        </button>

                        {editingPeriode && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={processing}
                                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                            >
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Table Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Daftar Konfigurasi Periode KP</h3>
                        <p className="text-xs text-slate-500">Histori dan status aktif seluruh periode semester Kerja Praktik.</p>
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                        Total: {periodes.length} Periode
                    </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                    <ModernTable>
                        <ModernTableHeader>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-12">No</th>
                            <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[180px]">Semester</th>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">Status</th>
                            <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[150px]">Tgl Pendaftaran</th>
                            <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[160px]">Batas Pendaftaran</th>
                            <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[170px]">Batas Pengajuan Surat</th>
                            <th className="px-4 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider w-36">Aksi</th>
                        </ModernTableHeader>
                        <ModernTableBody>
                            {periodes.length > 0 ? (
                                periodes.map((p, idx) => {
                                    const isEditingThis = editingPeriode?.id === p.id;
                                    return (
                                        <tr 
                                            key={p.id} 
                                            className={`transition-colors ${
                                                isEditingThis ? 'bg-amber-50/60 font-medium' : 'hover:bg-slate-50/80'
                                            }`}
                                        >
                                            <ModernTableTd className="text-center font-medium text-xs text-slate-400">
                                                {idx + 1}
                                            </ModernTableTd>
                                            <ModernTableTd>
                                                <div className="font-bold text-xs sm:text-sm text-slate-900">{p.semester}</div>
                                            </ModernTableTd>
                                            <ModernTableTd className="text-center">
                                                {p.status === 'aktif' ? (
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                                        Aktif Berjalan
                                                    </span>
                                                ) : p.status === 'mendatang' ? (
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center gap-1">
                                                        <Clock className="w-3 h-3 text-blue-600" />
                                                        Mendatang
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center gap-1">
                                                        Selesai
                                                    </span>
                                                )}
                                            </ModernTableTd>
                                            <ModernTableTd className="text-xs text-slate-700">
                                                {p.tanggal_pendaftaran_formatted}
                                            </ModernTableTd>
                                            <ModernTableTd className="text-xs text-slate-700">
                                                {p.tanggal_batas_pendaftaran_formatted}
                                            </ModernTableTd>
                                            <ModernTableTd className="text-xs text-slate-700">
                                                {p.tanggal_batas_pengajuan_surat_formatted}
                                            </ModernTableTd>
                                            <ModernTableTd className="text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStartEdit(p)}
                                                        title="Edit Periode"
                                                        className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                                                            isEditingThis 
                                                                ? 'bg-amber-500 text-slate-950 font-black' 
                                                                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                                                        }`}
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                        <span className="hidden sm:inline">Edit</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(p.id, p.semester)}
                                                        title="Hapus Periode"
                                                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition border border-rose-200 cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </ModernTableTd>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-slate-400">
                                        <Calendar className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                                        <p className="font-semibold text-slate-600">Belum ada data periode yang dikonfigurasi.</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Gunakan form di atas untuk menambahkan periode pendaftaran semester baru.</p>
                                    </td>
                                </tr>
                            )}
                        </ModernTableBody>
                    </ModernTable>
                </div>
            </div>
        </div>
    );
}

PeriodeKP.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
