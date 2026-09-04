import { useState, useRef } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import TULayout from '@/Layouts/TULayout';
import { 
    Database, 
    Upload, 
    Download, 
    Search, 
    Trash2, 
    Edit2, 
    CheckCircle2, 
    AlertCircle, 
    FileSpreadsheet, 
    Users, 
    GraduationCap, 
    Mail, 
    BookOpen, 
    X, 
    Loader2, 
    Info, 
    FileUp 
} from 'lucide-react';

interface MasterMahasiswa {
    id: number;
    nim: string;
    nama: string;
    email: string;
    program_studi: string;
    angkatan: string;
    created_at: string;
}

interface Props {
    masterMahasiswas: {
        data: MasterMahasiswa[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    registeredNims: string[];
    angkatanList: string[];
    stats: {
        total: number;
        registered: number;
        angkatan_count: number;
    };
    filters: {
        search: string;
        angkatan: string;
    };
}

export default function Index({ masterMahasiswas, registeredNims, angkatanList, stats, filters }: Props) {
    const { flash } = usePage().props as any;

    // Filters state
    const [search, setSearch] = useState(filters.search || '');
    const [angkatan, setAngkatan] = useState(filters.angkatan || 'all');

    // Modals
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [editModalData, setEditModalData] = useState<MasterMahasiswa | null>(null);
    const [deleteConfirmData, setDeleteConfirmData] = useState<MasterMahasiswa | null>(null);
    const [truncateConfirmOpen, setTruncateConfirmOpen] = useState(false);

    // Form states
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        nim: '',
        nama: '',
        email: '',
        program_studi: 'Teknik Informatika',
        angkatan: new Date().getFullYear().toString(),
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('tu.master-mahasiswa'), {
            search,
            angkatan,
        }, { preserveState: true });
    };

    const handleAngkatanChange = (val: string) => {
        setAngkatan(val);
        router.get(route('tu.master-mahasiswa'), {
            search,
            angkatan: val,
        }, { preserveState: true });
    };

    // Import Excel Submit
    const handleImportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!importFile) return;

        setIsSubmitting(true);
        const data = new FormData();
        data.append('file', importFile);

        router.post(route('tu.master-mahasiswa.import'), data, {
            onSuccess: () => {
                setImportModalOpen(false);
                setImportFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    // Edit Submit
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editModalData) return;

        setIsSubmitting(true);
        setFormErrors({});

        router.put(route('tu.master-mahasiswa.update', editModalData.id), formData, {
            onError: (errs) => {
                setFormErrors(errs);
            },
            onSuccess: () => {
                setEditModalData(null);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    // Delete Single Record
    const handleDelete = () => {
        if (!deleteConfirmData) return;

        setIsSubmitting(true);
        router.delete(route('tu.master-mahasiswa.destroy', deleteConfirmData.id), {
            onSuccess: () => {
                setDeleteConfirmData(null);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    // Truncate All Records
    const handleTruncate = () => {
        setIsSubmitting(true);
        router.delete(route('tu.master-mahasiswa.truncate'), {
            onSuccess: () => {
                setTruncateConfirmOpen(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const openEditModal = (mhs: MasterMahasiswa) => {
        setEditModalData(mhs);
        setFormData({
            nim: mhs.nim,
            nama: mhs.nama,
            email: mhs.email,
            program_studi: mhs.program_studi,
            angkatan: mhs.angkatan,
        });
        setFormErrors({});
    };

    return (
        <TULayout>
            <Head title="Data Master Mahasiswa - TU SI-KP" />

            <div className="space-y-6">
                
                {/* Header Title & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
                            <Database className="w-6 h-6 text-blue-600" />
                            <span>Data Master Mahasiswa</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Sumber data resmi mahasiswa untuk pencocokan otomatis (NIM) saat registrasi akun baru.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Download Template Excel */}
                        <a
                            href={route('tu.master-mahasiswa.template')}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                            title="Unduh Format File Excel (.xlsx)"
                        >
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Download Template Excel (.xlsx)</span>
                        </a>

                        {/* Import Excel Button */}
                        <button
                            type="button"
                            onClick={() => setImportModalOpen(true)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                            <span>Import File Excel</span>
                        </button>

                        {/* Kosongkan Data (Opsional jika ingin reset) */}
                        {masterMahasiswas.total > 0 && (
                            <button
                                type="button"
                                onClick={() => setTruncateConfirmOpen(true)}
                                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-colors cursor-pointer"
                                title="Kosongkan Semua Data Master"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-start gap-3 shadow-sm animate-in fade-in">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
                        <div className="leading-relaxed">{flash.success}</div>
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-medium flex items-start gap-3 shadow-sm animate-in fade-in">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                        <div className="leading-relaxed">{flash.error}</div>
                    </div>
                )}

                {/* Stats Widget */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Data Master</span>
                            <span className="text-xl font-black text-slate-800">{stats.total} Mahasiswa</span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Akun Telah Aktif</span>
                            <span className="text-xl font-black text-emerald-600">{stats.registered} Akun</span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Belum Terdaftar Akun</span>
                            <span className="text-xl font-black text-amber-600">{Math.max(0, stats.total - stats.registered)} Mahasiswa</span>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                    {/* Filter Angkatan */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Angkatan:</span>
                        <select
                            value={angkatan}
                            onChange={(e) => handleAngkatanChange(e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
                        >
                            <option value="all">Semua Angkatan</option>
                            {angkatanList.map((thn) => (
                                <option key={thn} value={thn}>Angkatan {thn}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative min-w-[280px]">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari NIM, Nama, atau Email..."
                            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </form>
                </div>

                {/* Table Records */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">NIM</th>
                                    <th className="px-6 py-4">Nama Lengkap</th>
                                    <th className="px-6 py-4">Email Resmi Kampus</th>
                                    <th className="px-6 py-4">Program Studi</th>
                                    <th className="px-6 py-4 text-center">Angkatan</th>
                                    <th className="px-6 py-4 text-center">Status Akun</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {masterMahasiswas.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                            <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                                            <p className="text-sm font-semibold">Data Master Mahasiswa Kosong</p>
                                            <p className="text-xs mt-1">Silakan klik "Import File Excel" untuk mengunggah file data master mahasiswa (.xlsx).</p>
                                        </td>
                                    </tr>
                                ) : (
                                    masterMahasiswas.data.map((item) => {
                                        const hasAccount = registeredNims.includes(item.nim);
                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4 font-mono font-bold text-slate-900">
                                                    {item.nim}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-900">
                                                    {item.nama}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                                                        <span>{item.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{item.program_studi}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center font-semibold text-slate-800">
                                                    {item.angkatan}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {hasAccount ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Sudah Berakun
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                                                            Belum Mendaftar
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(item)}
                                                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 transition-colors cursor-pointer"
                                                            title="Edit Data"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeleteConfirmData(item)}
                                                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors cursor-pointer"
                                                            title="Hapus Data"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {masterMahasiswas.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                            <div>
                                Menampilkan data ke <b>{(masterMahasiswas.current_page - 1) * 15 + 1}</b> sampai <b>{Math.min(masterMahasiswas.current_page * 15, masterMahasiswas.total)}</b> dari <b>{masterMahasiswas.total}</b> mahasiswa
                            </div>
                            <div className="flex items-center gap-1">
                                {masterMahasiswas.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    : 'text-slate-300 pointer-events-none'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* MODAL: IMPORT EXCEL */}
                {importModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                        <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                                    Import Data Master Mahasiswa (Excel)
                                </h3>
                                <button onClick={() => setImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Info Format */}
                            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-2">
                                <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                                    <Info className="w-4 h-4 text-emerald-600" />
                                    Format Kolom File Excel (.xlsx):
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-emerald-800 leading-relaxed text-[11px]">
                                    <li>Urutan kolom baris pertama: <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">nim, nama, email, program_studi, angkatan</code></li>
                                    <li>Mendukung file Microsoft Excel resmi (ekstensi <strong>.xlsx</strong>).</li>
                                    <li>Jika NIM sudah ada di sistem, data mahasiswa akan <strong>otomatis diperbarui</strong>.</li>
                                </ul>
                                <div className="pt-1">
                                    <a
                                        href={route('tu.master-mahasiswa.template')}
                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>Unduh contoh template Excel (.xlsx) di sini</span>
                                    </a>
                                </div>
                            </div>

                            {/* Form Upload */}
                            <form onSubmit={handleImportSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 block">
                                        Pilih File Excel (.xlsx / .xls)
                                    </label>
                                    <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/50 cursor-pointer">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept=".xlsx,.xls,.csv"
                                            onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                                            required
                                        />
                                        {importFile && (
                                            <p className="mt-2 text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                                                <CheckCircle2 className="w-4 h-4" />
                                                File terpilih: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setImportModalOpen(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !importFile}
                                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Mengimpor File Excel...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                <span>Mulai Import Excel</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: EDIT MAHASISWA */}
                {editModalData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                        <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Edit2 className="w-5 h-5 text-blue-600" />
                                    Edit Data Master Mahasiswa
                                </h3>
                                <button onClick={() => setEditModalData(null)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 block">NIM</label>
                                    <input
                                        type="text"
                                        value={formData.nim}
                                        onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:ring-1 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                    {formErrors.nim && <p className="text-red-500 text-[11px]">{formErrors.nim}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 block">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={formData.nama}
                                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                    {formErrors.nama && <p className="text-red-500 text-[11px]">{formErrors.nama}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 block">Email Resmi Kampus</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:ring-1 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                    {formErrors.email && <p className="text-red-500 text-[11px]">{formErrors.email}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 block">Program Studi</label>
                                        <input
                                            type="text"
                                            value={formData.program_studi}
                                            onChange={(e) => setFormData({ ...formData, program_studi: e.target.value })}
                                            className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 block">Angkatan</label>
                                        <input
                                            type="text"
                                            value={formData.angkatan}
                                            onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                                            className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditModalData(null)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Memperbarui...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: HAPUS SATU DATA */}
                {deleteConfirmData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                        <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                                <Trash2 className="w-6 h-6" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900">Hapus Data Master?</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Apakah Anda yakin ingin menghapus mahasiswa <strong className="text-slate-800">{deleteConfirmData.nama}</strong> ({deleteConfirmData.nim}) dari Data Master?
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setDeleteConfirmData(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: TRUNCATE SEMUA DATA */}
                {truncateConfirmOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                        <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                                <AlertCircle className="w-6 h-6" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900">Kosongkan Semua Data Master?</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Tindakan ini akan menghapus <strong>seluruh {masterMahasiswas.total} data master mahasiswa</strong> yang tersimpan saat ini.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setTruncateConfirmOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleTruncate}
                                    disabled={isSubmitting}
                                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Mengosongkan...' : 'Ya, Kosongkan'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </TULayout>
    );
}
