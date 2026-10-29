import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { 
    ShieldAlert, Users, Award, Briefcase, GraduationCap, 
    UserCheck, CheckCircle2, AlertCircle, Building2, KeyRound,
    Plus, Edit, Trash2, LogIn, Upload, Download, X, Search, CheckSquare,
    Filter
} from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

interface Stats {
    total_users: number;
    total_pegawai?: number;
    total_dosen: number;
    total_staff: number;
    total_unassigned?: number;
    total_mahasiswa: number;
    total_instansi: number;
    total_superadmin: number;
}

interface Dekan {
    id: number;
    name: string;
    nip: string;
    email: string;
}

interface UnassignedItem {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    created_at: string;
}

interface PegawaiItem {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    nip: string;
    user_type: 'dosen' | 'staff';
    bidang_keahlian?: string[];
    no_telepon?: string;
    roles_assignment: string[];
    is_dekan: boolean;
    is_superadmin: boolean;
    is_root: boolean;
    status_akun: string;
}

interface Props {
    stats: Stats;
    pegawais?: PegawaiItem[];
    dosens?: PegawaiItem[];
    staffs?: PegawaiItem[];
    unassigned_users?: UnassignedItem[];
    dekan_aktif: Dekan | null;
    is_root: boolean;
}

export default function AdminDashboard({ 
    stats, 
    pegawais = [], 
    dosens = [], 
    staffs = [], 
    unassigned_users = [], 
    dekan_aktif, 
    is_root 
}: Props) {
    // Tab navigasi utama: 'all' | 'dosen' | 'staff' | 'unassigned'
    const [activeTab, setActiveTab] = useState<'all' | 'dosen' | 'staff' | 'unassigned'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State Assign Role (Akun Baru SSO)
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assigningUser, setAssigningUser] = useState<UnassignedItem | null>(null);

    // Modal State Pegawai (Tambah / Edit Dosen & Staff)
    const [isPegawaiModalOpen, setIsPegawaiModalOpen] = useState(false);
    const [editingPegawai, setEditingPegawai] = useState<PegawaiItem | null>(null);

    // Modal Import Excel Tunggal
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // Form Pegawai (Gabungan Dosen & Staff)
    const pegawaiForm = useForm({
        name: '',
        email: '',
        user_type: 'dosen' as 'dosen' | 'staff',
        nip: '',
        no_telepon: '',
        bidang_keahlian: '',
        password: '',
        roles: ['dosen_pembimbing'] as string[],
        is_superadmin: false,
    });

    // Form Assign Role (Akun Baru SSO)
    const assignForm = useForm({
        user_type: 'dosen' as 'dosen' | 'staff',
        nip: '',
        no_telepon: '',
        bidang_keahlian: '',
        roles: ['dosen_pembimbing'] as string[],
        is_superadmin: false,
    });

    // Form Dekan Switcher
    const dekanForm = useForm({
        dosen_id: dekan_aktif?.id ? String(dekan_aktif.id) : '',
    });

    // Form Import Excel Pegawai Tunggal
    const importForm = useForm({
        file_excel: null as File | null,
    });

    // Handle Dekan Switcher
    const handleSetDekan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!dekanForm.data.dosen_id) return;
        dekanForm.post(route('admin.set-dekan'), {
            preserveScroll: true,
        });
    };

    // Open Tambah Pegawai
    const openAddPegawai = (defaultType: 'dosen' | 'staff' = 'dosen') => {
        setEditingPegawai(null);
        pegawaiForm.setData({
            name: '',
            email: '',
            user_type: defaultType,
            nip: '',
            no_telepon: '',
            bidang_keahlian: '',
            password: '',
            roles: defaultType === 'dosen' ? ['dosen_pembimbing'] : ['tu'],
            is_superadmin: false,
        });
        setIsPegawaiModalOpen(true);
    };

    // Open Edit Pegawai
    const openEditPegawai = (p: PegawaiItem) => {
        setEditingPegawai(p);
        pegawaiForm.setData({
            name: p.name,
            email: p.email,
            user_type: p.user_type,
            nip: p.nip && p.nip !== '-' ? p.nip : '',
            no_telepon: p.no_telepon && p.no_telepon !== '-' ? p.no_telepon : '',
            bidang_keahlian: Array.isArray(p.bidang_keahlian) ? p.bidang_keahlian.join(', ') : '',
            password: '',
            roles: p.roles_assignment || (p.user_type === 'dosen' ? ['dosen_pembimbing'] : ['tu']),
            is_superadmin: Boolean(p.is_superadmin),
        });
        setIsPegawaiModalOpen(true);
    };

    // Submit Pegawai (Tambah / Update)
    const submitPegawai = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPegawai) {
            pegawaiForm.put(route('admin.pegawai.update', editingPegawai.id), {
                preserveScroll: true,
                onSuccess: () => setIsPegawaiModalOpen(false),
            });
        } else {
            pegawaiForm.post(route('admin.pegawai.store'), {
                preserveScroll: true,
                onSuccess: () => setIsPegawaiModalOpen(false),
            });
        }
    };

    // Submit Import Excel Pegawai
    const handleImportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        importForm.post(route('admin.import-users'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsImportModalOpen(false);
                importForm.reset();
            },
        });
    };

    // Impersonate / Login As
    const handleImpersonate = (userId: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin login sebagai ${name} untuk keperluan troubleshooting?`)) {
            router.post(route('admin.impersonate', userId));
        }
    };

    // Delete User
    const handleDeleteUser = (userId: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus akun ${name}? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('admin.users.destroy', userId), {
                preserveScroll: true,
            });
        }
    };

    // Open Assign Modal (Akun Baru SSO)
    const openAssignModal = (u: UnassignedItem) => {
        setAssigningUser(u);
        assignForm.setData({
            user_type: 'dosen',
            nip: '',
            no_telepon: '',
            bidang_keahlian: '',
            roles: ['dosen_pembimbing'],
            is_superadmin: false,
        });
        setIsAssignModalOpen(true);
    };

    // Submit Assign Role
    const submitAssign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!assigningUser) return;
        assignForm.post(route('admin.users.assign-role', assigningUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsAssignModalOpen(false);
                setAssigningUser(null);
            },
        });
    };

    // Pegawai List Filtered
    const filteredPegawais = pegawais.filter((p) => {
        // Filter by Tab (Dosen atau Staff atau Semua)
        if (activeTab === 'dosen' && p.user_type !== 'dosen') return false;
        if (activeTab === 'staff' && p.user_type !== 'staff') return false;

        // Filter by Search Query
        const search = searchTerm.toLowerCase();
        return (
            p.name.toLowerCase().includes(search) ||
            p.email.toLowerCase().includes(search) ||
            (p.nip && p.nip.toLowerCase().includes(search))
        );
    });

    // Unassigned SSO Filtered
    const filteredUnassigned = unassigned_users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <Head title="Panel Super Administrator" />

            {/* Header & Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <PageHeader
                    title="Panel Super Administrator"
                    description="Pusat kendali akun Pegawai (Dosen & Staff), penugasan tugas fungsional, penetapan Dekan, dan login troubleshooting."
                />

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
                    {activeTab !== 'unassigned' && (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsImportModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                            >
                                <Upload className="w-4 h-4" />
                                <span>Import Pegawai Excel</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => openAddPegawai(activeTab === 'staff' ? 'staff' : 'dosen')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah Pegawai</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Banner Otoritas Super User & Dekan Switcher */}
            <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-indigo-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 text-indigo-200 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-6 h-6 text-indigo-300" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base sm:text-lg font-bold">
                                {is_root ? 'Root Administrator (Otoritas Tertinggi)' : 'Super User Administrator'}
                            </h2>
                            <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                {is_root ? 'System Root' : 'Superadmin'}
                            </span>
                        </div>
                        <p className="text-xs text-indigo-200 mt-1 max-w-2xl leading-relaxed">
                            {is_root 
                                ? 'Sebagai Root User, Anda memiliki wewenang untuk menetapkan Super User lain, mengelola seluruh data Pegawai (Dosen & Staff), penugasan peran, dan penetapan Dekan.'
                                : 'Anda memiliki hak Super User untuk mengelola akun Pegawai (Dosen & Staff), penugasan tugas fungsional, serta login impersonate.'}
                        </p>
                    </div>
                </div>

                {/* Penetapan Dekan Fakultas Teknik (Single Dekan Switcher) */}
                <form onSubmit={handleSetDekan} className="bg-white/10 p-3 sm:p-3.5 rounded-xl border border-white/15 shrink-0 space-y-2 min-w-[280px]">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                            <Award className="w-3.5 h-3.5" />
                            Penetapan Dekan Fakultas
                        </span>
                        {dekan_aktif && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-400/30">
                                Aktif
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={dekanForm.data.dosen_id}
                            onChange={(e) => dekanForm.setData('dosen_id', e.target.value)}
                            className="w-full text-xs bg-slate-900/90 text-white rounded-lg border border-indigo-300/40 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        >
                            <option value="" disabled>-- Pilih Dosen untuk Dekan --</option>
                            {dosens.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name} {d.is_dekan ? '(Dekan Saat Ini)' : ''}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            disabled={dekanForm.processing || !dekanForm.data.dosen_id}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition disabled:opacity-50 shrink-0 cursor-pointer"
                        >
                            Tetapkan
                        </button>
                    </div>
                </form>
            </div>

            {/* Banner Notifikasi Akun Baru SSO yang belum di-assign peran */}
            {unassigned_users.length > 0 && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-200">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold shrink-0">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                                <span>Ada {unassigned_users.length} Akun Baru Terdaftar via SSO Kampus</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900 uppercase tracking-wider">
                                    Perlu Penugasan
                                </span>
                            </h4>
                            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                                Pegawai telah melakukan login awal menggunakan email resmi kampus (@trunojoyo.ac.id), namun belum dapat mengakses portal sistem sebelum peran (Dosen/Staff) dan tugas fungsionalnya ditetapkan oleh Administrator.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setActiveTab('unassigned')}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>Tetapkan Peran Sekarang</span>
                        <span className="font-mono text-sm">&rarr;</span>
                    </button>
                </div>
            )}

            {/* Statistik Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Akun</span>
                    <span className="text-2xl font-bold text-slate-900 mt-2">{stats.total_users}</span>
                </div>

                <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">Total Pegawai</span>
                    <span className="text-2xl font-bold text-indigo-900 mt-2">{stats.total_pegawai ?? pegawais.length}</span>
                </div>

                <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Dosen</span>
                    <span className="text-2xl font-bold text-blue-900 mt-2">{stats.total_dosen}</span>
                </div>

                <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Staff</span>
                    <span className="text-2xl font-bold text-emerald-900 mt-2">{stats.total_staff}</span>
                </div>

                <div className={`p-4 rounded-xl border shadow-xs flex flex-col justify-between ${
                    (stats.total_unassigned ?? unassigned_users.length) > 0 
                        ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30' 
                        : 'bg-slate-50 border-slate-200'
                }`}>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Menunggu Tugas</span>
                    <span className={`text-2xl font-bold mt-2 ${
                        (stats.total_unassigned ?? unassigned_users.length) > 0 ? 'text-amber-700' : 'text-slate-400'
                    }`}>
                        {stats.total_unassigned ?? unassigned_users.length}
                    </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Mahasiswa</span>
                    <span className="text-2xl font-bold text-slate-900 mt-2">{stats.total_mahasiswa}</span>
                </div>

                <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">Super User</span>
                    <span className="text-2xl font-bold text-teal-900 mt-2">{stats.total_superadmin}</span>
                </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Tab 1: Semua Pegawai */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('all')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                            activeTab === 'all'
                                ? 'bg-indigo-700 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        <span>Semua Pegawai ({pegawais.length})</span>
                    </button>

                    {/* Tab 2: Filter Dosen */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('dosen')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                            activeTab === 'dosen'
                                ? 'bg-indigo-700 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        <GraduationCap className="w-4 h-4" />
                        <span>Dosen ({dosens.length})</span>
                    </button>

                    {/* Tab 3: Filter Staff */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('staff')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                            activeTab === 'staff'
                                ? 'bg-indigo-700 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        <Briefcase className="w-4 h-4" />
                        <span>Staff ({staffs.length})</span>
                    </button>

                    {/* Tab 4: Akun Baru SSO */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('unassigned')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 relative cursor-pointer ${
                            activeTab === 'unassigned'
                                ? 'bg-amber-500 text-slate-950 shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        <UserCheck className="w-4 h-4" />
                        <span>Akun Baru SSO</span>
                        {unassigned_users.length > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 border border-amber-600/30">
                                {unassigned_users.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Pencarian */}
                <div className="relative min-w-[260px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Cari nama, email, atau NIP..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                </div>
            </div>

            {/* ========================================================= */}
            {/* SATU TABEL PEGAWAI TERPADU (DOSEN & STAFF DENGAN FILTER) */}
            {/* ========================================================= */}
            {activeTab !== 'unassigned' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <ModernTable>
                        <ModernTableHeader>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-12">No</th>
                            <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[220px]">Pegawai</th>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-28">Jenis Akun</th>
                            <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider w-36">NIP</th>
                            <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[260px]">Penugasan Peran &amp; Tugas</th>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">Jabatan</th>
                            <th className="px-4 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider w-44">Aksi</th>
                        </ModernTableHeader>
                        <ModernTableBody>
                            {filteredPegawais.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                                        <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                                        <p className="font-semibold text-slate-600">Tidak ada data pegawai yang sesuai.</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Silakan tambahkan pegawai baru atau import dari file Excel.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredPegawais.map((p, index) => (
                                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                        <ModernTableTd className="text-center font-medium text-xs text-slate-400">{index + 1}</ModernTableTd>
                                        <ModernTableTd>
                                            <div className="flex items-center gap-2.5">
                                                {p.avatar ? (
                                                    <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                                                ) : (
                                                    <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border ${
                                                        p.user_type === 'dosen' 
                                                            ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                    }`}>
                                                        {p.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-xs sm:text-sm text-slate-900">{p.name}</div>
                                                    <div className="text-[11px] text-slate-500">{p.email}</div>
                                                </div>
                                            </div>
                                        </ModernTableTd>
                                        <ModernTableTd className="text-center">
                                            {p.user_type === 'dosen' ? (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 inline-flex items-center gap-1">
                                                    <GraduationCap className="w-3 h-3 text-blue-600" />
                                                    Dosen
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                                                    <Briefcase className="w-3 h-3 text-emerald-600" />
                                                    Staff
                                                </span>
                                            )}
                                        </ModernTableTd>
                                        <ModernTableTd className="font-mono text-xs text-slate-700">
                                            {p.nip && p.nip !== '-' ? p.nip : <span className="text-slate-300">-</span>}
                                        </ModernTableTd>
                                        <ModernTableTd>
                                            <div className="flex flex-wrap gap-1.5 items-center">
                                                {p.roles_assignment.includes('dosen_pembimbing') && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                                        Pembimbing KP
                                                    </span>
                                                )}
                                                {p.roles_assignment.includes('koor_prodi') && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-900 border border-indigo-300">
                                                        Koor Prodi
                                                    </span>
                                                )}
                                                {p.roles_assignment.includes('penguji_sidang') && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                                                        Penguji Sidang
                                                    </span>
                                                )}
                                                {p.roles_assignment.includes('tu') && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                                        Tata Usaha (TU)
                                                    </span>
                                                )}
                                                {p.roles_assignment.includes('admin_berkas') && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                                                        Admin Berkas
                                                    </span>
                                                )}
                                                {p.is_superadmin && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                                        <ShieldAlert className="w-3 h-3 text-amber-700" />
                                                        Super User
                                                    </span>
                                                )}
                                            </div>
                                        </ModernTableTd>
                                        <ModernTableTd className="text-center">
                                            {p.is_dekan ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-300">
                                                    <Award className="w-3 h-3 text-amber-600" /> Dekan
                                                </span>
                                            ) : p.is_root ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-indigo-50 text-indigo-800 border border-indigo-300">
                                                    ROOT
                                                </span>
                                            ) : (
                                                <span className="text-slate-300 text-xs">-</span>
                                            )}
                                        </ModernTableTd>
                                        <ModernTableTd className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* Tombol Login Sebagai (Troubleshooting) */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleImpersonate(p.id, p.name)}
                                                    title={`Login sebagai ${p.name} (Troubleshooting)`}
                                                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition border border-indigo-200 flex items-center gap-1 cursor-pointer"
                                                >
                                                    <LogIn className="w-3.5 h-3.5" />
                                                    <span>Login As</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openEditPegawai(p)}
                                                    title="Edit Data & Tugas"
                                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                {!p.is_root && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteUser(p.id, p.name)}
                                                        title="Hapus Akun"
                                                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </ModernTableTd>
                                    </tr>
                                ))
                            )}
                        </ModernTableBody>
                    </ModernTable>
                </div>
            )}

            {/* ========================================================= */}
            {/* TABEL DATA AKUN BARU SSO (MENUNGGU PENUGASAN) */}
            {/* ========================================================= */}
            {activeTab === 'unassigned' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-4 bg-amber-50/60 border-b border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                                <KeyRound className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-amber-950">
                                    Daftar Akun Baru SSO Kampus (@trunojoyo.ac.id)
                                </h3>
                                <p className="text-[11px] text-amber-800/90 mt-0.5">
                                    Akun otomatis terbuat dari otentikasi Google kampus. Tetapkan perannya sebagai Dosen atau Staff serta tugas fungsionalnya agar user dapat login.
                                </p>
                            </div>
                        </div>
                    </div>

                    <ModernTable>
                        <ModernTableHeader>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-12">No</th>
                            <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[220px]">Pengguna SSO</th>
                            <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Terdaftar</th>
                            <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[180px]">Status Akun</th>
                            <th className="px-4 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider w-56">Aksi Penugasan</th>
                        </ModernTableHeader>
                        <ModernTableBody>
                            {filteredUnassigned.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                                        <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                                        <p className="font-semibold text-slate-700">Tidak ada akun baru yang menunggu penugasan.</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Semua akun pegawai kampus telah memiliki peran dan tugas fungsional.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUnassigned.map((u, index) => (
                                    <tr key={u.id} className="hover:bg-amber-50/40 transition-colors">
                                        <ModernTableTd className="text-center font-medium text-xs text-slate-400">{index + 1}</ModernTableTd>
                                        <ModernTableTd>
                                            <div className="flex items-center gap-2.5">
                                                {u.avatar ? (
                                                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                                                        {u.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-xs sm:text-sm text-slate-900">{u.name}</div>
                                                    <div className="text-[11px] text-slate-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </ModernTableTd>
                                        <ModernTableTd className="text-xs text-slate-600">{u.created_at}</ModernTableTd>
                                        <ModernTableTd>
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                                                Role Kosong (Belum Login)
                                            </span>
                                        </ModernTableTd>
                                        <ModernTableTd className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openAssignModal(u)}
                                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                                                >
                                                    <UserCheck className="w-3.5 h-3.5" />
                                                    <span>Tugaskan Peran</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteUser(u.id, u.name)}
                                                    title="Hapus Akun"
                                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </ModernTableTd>
                                    </tr>
                                ))
                            )}
                        </ModernTableBody>
                    </ModernTable>
                </div>
            )}

            {/* ========================================================= */}
            {/* MODAL TAMBAH / EDIT PEGAWAI TERPADU */}
            {/* ========================================================= */}
            {isPegawaiModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="font-bold text-slate-900 text-base">
                                {editingPegawai ? `Edit Pegawai: ${editingPegawai.name}` : 'Tambah Akun Pegawai Baru'}
                            </h3>
                            <button onClick={() => setIsPegawaiModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={submitPegawai} className="space-y-3.5 text-xs">
                            {/* Pilihan Jenis Pegawai (Dosen vs Staff) */}
                            <div>
                                <label className="font-bold text-slate-700 block mb-1.5">Jenis Akun Pegawai *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            pegawaiForm.setData({
                                                ...pegawaiForm.data,
                                                user_type: 'dosen',
                                                roles: pegawaiForm.data.roles.length > 0 ? pegawaiForm.data.roles : ['dosen_pembimbing'],
                                            });
                                        }}
                                        className={`p-2.5 rounded-xl border-2 text-left flex items-center gap-2.5 transition cursor-pointer ${
                                            pegawaiForm.data.user_type === 'dosen'
                                                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold'
                                                : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                                        }`}
                                    >
                                        <GraduationCap className={`w-4 h-4 ${pegawaiForm.data.user_type === 'dosen' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        <div>
                                            <div className="text-xs">Dosen</div>
                                            <div className="text-[10px] text-slate-500 font-normal">Tenaga Pendidik</div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            pegawaiForm.setData({
                                                ...pegawaiForm.data,
                                                user_type: 'staff',
                                                roles: pegawaiForm.data.roles.includes('tu') ? pegawaiForm.data.roles : ['tu'],
                                            });
                                        }}
                                        className={`p-2.5 rounded-xl border-2 text-left flex items-center gap-2.5 transition cursor-pointer ${
                                            pegawaiForm.data.user_type === 'staff'
                                                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold'
                                                : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                                        }`}
                                    >
                                        <Briefcase className={`w-4 h-4 ${pegawaiForm.data.user_type === 'staff' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        <div>
                                            <div className="text-xs">Staff</div>
                                            <div className="text-[10px] text-slate-500 font-normal">Tenaga Kependidikan</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap &amp; Gelar *</label>
                                <input
                                    type="text"
                                    required
                                    value={pegawaiForm.data.name}
                                    onChange={(e) => pegawaiForm.setData('name', e.target.value)}
                                    placeholder={pegawaiForm.data.user_type === 'dosen' ? "Contoh: Dr. Budi Santoso, M.Kom." : "Contoh: Siti Rahmawati, S.A.P."}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Email Kampus *</label>
                                    <input
                                        type="email"
                                        required
                                        value={pegawaiForm.data.email}
                                        onChange={(e) => pegawaiForm.setData('email', e.target.value)}
                                        placeholder="nama@trunojoyo.ac.id"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">NIP (Opsional)</label>
                                    <input
                                        type="text"
                                        value={pegawaiForm.data.nip}
                                        onChange={(e) => pegawaiForm.setData('nip', e.target.value)}
                                        placeholder="19800101..."
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {pegawaiForm.data.user_type === 'dosen' ? (
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Bidang Keahlian (Opsional)</label>
                                    <input
                                        type="text"
                                        value={pegawaiForm.data.bidang_keahlian}
                                        onChange={(e) => pegawaiForm.setData('bidang_keahlian', e.target.value)}
                                        placeholder="AI, Software Engineering (pisahkan dengan koma)"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Nomor WhatsApp / Telepon (Opsional)</label>
                                    <input
                                        type="text"
                                        value={pegawaiForm.data.no_telepon}
                                        onChange={(e) => pegawaiForm.setData('no_telepon', e.target.value)}
                                        placeholder="08123456789"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="font-bold text-slate-700 block mb-1">
                                    {editingPegawai ? 'Password Baru (Kosongkan jika tidak diganti)' : 'Password Sementara (Kosongkan untuk default: "password")'}
                                </label>
                                <input
                                    type="password"
                                    value={pegawaiForm.data.password}
                                    onChange={(e) => pegawaiForm.setData('password', e.target.value)}
                                    placeholder="Minimal 6 karakter"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Penugasan Tugas Fungsional (Checkbox) */}
                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                                    Penugasan Tugas Fungsional:
                                </span>
                                <div className="space-y-1.5">
                                    {pegawaiForm.data.user_type === 'dosen' && (
                                        <>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={pegawaiForm.data.roles.includes('dosen_pembimbing')}
                                                    onChange={(e) => {
                                                        const roles = e.target.checked
                                                            ? [...pegawaiForm.data.roles, 'dosen_pembimbing']
                                                            : pegawaiForm.data.roles.filter(r => r !== 'dosen_pembimbing');
                                                        pegawaiForm.setData('roles', roles);
                                                    }}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="font-semibold text-slate-700">Dosen Pembimbing KP</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={pegawaiForm.data.roles.includes('koor_prodi')}
                                                    onChange={(e) => {
                                                        const roles = e.target.checked
                                                            ? [...pegawaiForm.data.roles, 'koor_prodi']
                                                            : pegawaiForm.data.roles.filter(r => r !== 'koor_prodi');
                                                        pegawaiForm.setData('roles', roles);
                                                    }}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="font-semibold text-slate-700">Koordinator Program Studi (Koor Prodi)</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={pegawaiForm.data.roles.includes('penguji_sidang')}
                                                    onChange={(e) => {
                                                        const roles = e.target.checked
                                                            ? [...pegawaiForm.data.roles, 'penguji_sidang']
                                                            : pegawaiForm.data.roles.filter(r => r !== 'penguji_sidang');
                                                        pegawaiForm.setData('roles', roles);
                                                    }}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="font-semibold text-slate-700">Dosen Penguji Sidang</span>
                                            </label>
                                        </>
                                    )}

                                    {/* TU bisa untuk Dosen maupun Staff */}
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={pegawaiForm.data.roles.includes('tu')}
                                            onChange={(e) => {
                                                const roles = e.target.checked
                                                    ? [...pegawaiForm.data.roles, 'tu']
                                                    : pegawaiForm.data.roles.filter(r => r !== 'tu');
                                                pegawaiForm.setData('roles', roles);
                                            }}
                                            className="rounded text-amber-600 focus:ring-amber-500"
                                        />
                                        <span className="font-semibold text-slate-700">Tata Usaha Fakultas / Jurusan (TU)</span>
                                    </label>

                                    {pegawaiForm.data.user_type === 'staff' && (
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={pegawaiForm.data.roles.includes('admin_berkas')}
                                                onChange={(e) => {
                                                    const roles = e.target.checked
                                                        ? [...pegawaiForm.data.roles, 'admin_berkas']
                                                        : pegawaiForm.data.roles.filter(r => r !== 'admin_berkas');
                                                    pegawaiForm.setData('roles', roles);
                                                }}
                                                className="rounded text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="font-semibold text-slate-700">Pengelola Arsip &amp; Berkas</span>
                                        </label>
                                    )}

                                    {/* Otoritas Root: Mengangkat Super User */}
                                    {is_root && (
                                        <div className="pt-2 mt-2 border-t border-slate-200">
                                            <label className="flex items-center gap-2 cursor-pointer bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                <input
                                                    type="checkbox"
                                                    checked={pegawaiForm.data.is_superadmin}
                                                    onChange={(e) => pegawaiForm.setData('is_superadmin', e.target.checked)}
                                                    className="rounded text-amber-600 focus:ring-amber-500"
                                                />
                                                <span className="font-bold text-amber-900">
                                                    Berikan Akses Super User Administrator
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsPegawaiModalOpen(false)}
                                    className="px-4 py-2 border rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={pegawaiForm.processing}
                                    className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                                >
                                    {pegawaiForm.processing ? 'Menyimpan...' : 'Simpan Pegawai'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* MODAL IMPORT EXCEL PEGAWAI TUNGGAL (DOSEN & STAFF) */}
            {/* ========================================================= */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="font-bold text-slate-900 text-base">
                                Import Data Pegawai dari Excel
                            </h3>
                            <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <p className="text-slate-500 leading-relaxed">
                                Format template Excel mencakup data <strong>Dosen dan Staff sekaligus</strong> dengan kolom: Nama Lengkap, Email, Jenis Akun (dosen/staff), NIP (opsional), dan Password Sementara (opsional).
                            </p>

                            <a
                                href={route('admin.download-template')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold border border-indigo-200 transition"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>Unduh Template Excel Pegawai</span>
                            </a>

                            <form onSubmit={handleImportSubmit} className="space-y-4 pt-2">
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50">
                                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                    <input
                                        type="file"
                                        required
                                        accept=".xlsx,.xls,.csv"
                                        onChange={(e) => importForm.setData('file_excel', e.target.files ? e.target.files[0] : null)}
                                        className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsImportModalOpen(false)}
                                        className="px-4 py-2 border rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={importForm.processing || !importForm.data.file_excel}
                                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
                                    >
                                        {importForm.processing ? 'Mengunggah...' : 'Unggah & Import'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* MODAL PENETAPAN PERAN & TUGAS AKUN BARU SSO */}
            {/* ========================================================= */}
            {isAssignModalOpen && assigningUser && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                                    <UserCheck className="w-5 h-5 text-indigo-600" />
                                    <span>Penetapan Peran &amp; Tugas Akun SSO</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Tentukan apakah akun ini adalah Dosen atau Staff serta tugas fungsionalnya.
                                </p>
                            </div>
                            <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Profil Ringkas Akun SSO */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                            {assigningUser.avatar ? (
                                <img src={assigningUser.avatar} alt={assigningUser.name} className="w-10 h-10 rounded-full border border-slate-300 object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center border border-indigo-200">
                                    {assigningUser.name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <div className="font-bold text-slate-900 text-sm">{assigningUser.name}</div>
                                <div className="text-xs text-slate-500">{assigningUser.email}</div>
                                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                                    Terotentikasi Google Kampus UTM
                                </span>
                            </div>
                        </div>

                        <form onSubmit={submitAssign} className="space-y-4 text-xs">
                            {/* Pilihan Tipe Akun (Dosen atau Staff) */}
                            <div>
                                <label className="font-bold text-slate-700 block mb-2">Jenis Akun Utama *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            assignForm.setData({
                                                ...assignForm.data,
                                                user_type: 'dosen',
                                                roles: ['dosen_pembimbing'],
                                            });
                                        }}
                                        className={`p-3 rounded-xl border-2 text-left flex items-center gap-3 transition cursor-pointer ${
                                            assignForm.data.user_type === 'dosen'
                                                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold'
                                                : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                                        }`}
                                    >
                                        <GraduationCap className={`w-5 h-5 ${assignForm.data.user_type === 'dosen' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        <div>
                                            <div className="text-xs">Dosen</div>
                                            <div className="text-[10px] text-slate-500 font-normal">Tenaga Pendidik</div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            assignForm.setData({
                                                ...assignForm.data,
                                                user_type: 'staff',
                                                roles: ['tu'],
                                            });
                                        }}
                                        className={`p-3 rounded-xl border-2 text-left flex items-center gap-3 transition cursor-pointer ${
                                            assignForm.data.user_type === 'staff'
                                                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold'
                                                : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                                        }`}
                                    >
                                        <Briefcase className={`w-5 h-5 ${assignForm.data.user_type === 'staff' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        <div>
                                            <div className="text-xs">Staff</div>
                                            <div className="text-[10px] text-slate-500 font-normal">Tenaga Kependidikan</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Field spesifik Dosen */}
                            {assignForm.data.user_type === 'dosen' && (
                                <div className="space-y-3 p-3.5 bg-indigo-50/40 rounded-xl border border-indigo-100">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="font-bold text-slate-700 block mb-1">NIP (Opsional)</label>
                                            <input
                                                type="text"
                                                value={assignForm.data.nip}
                                                onChange={(e) => assignForm.setData('nip', e.target.value)}
                                                placeholder="198001012005011001"
                                                className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="font-bold text-slate-700 block mb-1">Bidang Keahlian</label>
                                            <input
                                                type="text"
                                                value={assignForm.data.bidang_keahlian}
                                                onChange={(e) => assignForm.setData('bidang_keahlian', e.target.value)}
                                                placeholder="AI, Software Engineering (koma)"
                                                className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="font-bold text-slate-700 block mb-1.5">Penugasan Tugas Fungsional *</label>
                                        <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={assignForm.data.roles.includes('dosen_pembimbing')}
                                                    onChange={(e) => {
                                                        const roles = e.target.checked
                                                            ? [...assignForm.data.roles, 'dosen_pembimbing']
                                                            : assignForm.data.roles.filter(r => r !== 'dosen_pembimbing');
                                                        assignForm.setData('roles', roles);
                                                    }}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="font-semibold text-slate-800">Dosen Pembimbing KP</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={assignForm.data.roles.includes('koor_prodi')}
                                                    onChange={(e) => {
                                                        const roles = e.target.checked
                                                            ? [...assignForm.data.roles, 'koor_prodi']
                                                            : assignForm.data.roles.filter(r => r !== 'koor_prodi');
                                                        assignForm.setData('roles', roles);
                                                    }}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="font-semibold text-slate-800">Koordinator Program Studi (Koor Prodi)</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={assignForm.data.roles.includes('penguji_sidang')}
                                                    onChange={(e) => {
                                                        const roles = e.target.checked
                                                            ? [...assignForm.data.roles, 'penguji_sidang']
                                                            : assignForm.data.roles.filter(r => r !== 'penguji_sidang');
                                                        assignForm.setData('roles', roles);
                                                    }}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="font-semibold text-slate-800">Dosen Penguji Sidang</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={assignForm.data.roles.includes('tu')}
                                                    onChange={(e) => {
                                                        const roles = e.target.checked
                                                            ? [...assignForm.data.roles, 'tu']
                                                            : assignForm.data.roles.filter(r => r !== 'tu');
                                                        assignForm.setData('roles', roles);
                                                    }}
                                                    className="rounded text-amber-600 focus:ring-amber-500"
                                                />
                                                <span className="font-semibold text-slate-800">Tata Usaha Fakultas / Jurusan (TU)</span>
                                            </label>

                                            {is_root && (
                                                <div className="pt-2 mt-2 border-t border-slate-200">
                                                    <label className="flex items-center gap-2 cursor-pointer bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                        <input
                                                            type="checkbox"
                                                            checked={assignForm.data.is_superadmin}
                                                            onChange={(e) => assignForm.setData('is_superadmin', e.target.checked)}
                                                            className="rounded text-amber-600 focus:ring-amber-500"
                                                        />
                                                        <span className="font-bold text-amber-900">
                                                            Berikan Hak Akses Super User Administrator
                                                        </span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Field spesifik Staff */}
                            {assignForm.data.user_type === 'staff' && (
                                <div className="space-y-3 p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="font-bold text-slate-700 block mb-1">NIP (Opsional)</label>
                                            <input
                                                type="text"
                                                value={assignForm.data.nip}
                                                onChange={(e) => assignForm.setData('nip', e.target.value)}
                                                placeholder="1985..."
                                                className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="font-bold text-slate-700 block mb-1">Nomor WhatsApp</label>
                                            <input
                                                type="text"
                                                value={assignForm.data.no_telepon}
                                                onChange={(e) => assignForm.setData('no_telepon', e.target.value)}
                                                placeholder="08123456789"
                                                className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="font-bold text-slate-700 block mb-1.5">Penugasan Tugas Staff *</label>
                                        <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={assignForm.data.roles.includes('tu')}
                                                    onChange={(e) => {
                                                        const roles = e.target.checked
                                                            ? [...assignForm.data.roles, 'tu']
                                                            : assignForm.data.roles.filter(r => r !== 'tu');
                                                        assignForm.setData('roles', roles);
                                                    }}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="font-semibold text-slate-800">Tata Usaha Fakultas / Jurusan (TU)</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={assignForm.data.roles.includes('admin_berkas')}
                                                    onChange={(e) => {
                                                        const roles = e.target.checked
                                                            ? [...assignForm.data.roles, 'admin_berkas']
                                                            : assignForm.data.roles.filter(r => r !== 'admin_berkas');
                                                        assignForm.setData('roles', roles);
                                                    }}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="font-semibold text-slate-800">Pengelola Arsip &amp; Berkas</span>
                                            </label>

                                            {is_root && (
                                                <div className="pt-2 mt-2 border-t border-slate-200">
                                                    <label className="flex items-center gap-2 cursor-pointer bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                        <input
                                                            type="checkbox"
                                                            checked={assignForm.data.is_superadmin}
                                                            onChange={(e) => assignForm.setData('is_superadmin', e.target.checked)}
                                                            className="rounded text-amber-600 focus:ring-amber-500"
                                                        />
                                                        <span className="font-bold text-amber-900">
                                                            Berikan Hak Akses Super User Administrator
                                                        </span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAssignModalOpen(false)}
                                    className="px-4 py-2 border rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={assignForm.processing || assignForm.data.roles.length === 0}
                                    className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
                                >
                                    {assignForm.processing ? 'Menyimpan...' : 'Simpan & Aktifkan Penugasan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

AdminDashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
