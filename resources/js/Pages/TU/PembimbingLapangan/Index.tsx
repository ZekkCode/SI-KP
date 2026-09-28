import { useState, FormEvent } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import TULayout from '@/Layouts/TULayout';
import {
    Briefcase,
    Building2,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    RefreshCw,
    Lock,
    Key,
    UserCheck,
    UserX,
    Eye,
    Mail,
    Phone,
    Users,
    AlertCircle,
    Info,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface PembimbingLapanganItem {
    id: number;
    nama: string;
    instansi_id: number | null;
    user_id: number | null;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        status_akun: string;
        no_telepon?: string | null;
        must_change_password?: boolean;
    } | null;
    instansi: {
        id: number;
        nama: string;
        alamat?: string;
    } | null;
    pendaftarans?: Array<{
        id: number;
        status: string;
        mahasiswa: {
            id: number;
            name: string;
            nim: string;
        } | null;
    }>;
}

interface Props {
    pembimbingLapangans: {
        data: PembimbingLapanganItem[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
    stats: {
        total: number;
        aktif: number;
        pending: number;
        nonaktif: number;
        belum_klaim: number;
    };
    filters: {
        status: string;
        search: string;
    };
}

export default function Index({ pembimbingLapangans, stats, filters }: Props) {
    const { flash } = usePage().props as any;

    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [selectedPl, setSelectedPl] = useState<PembimbingLapanganItem | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Modals
    const [detailModal, setDetailModal] = useState<PembimbingLapanganItem | null>(null);
    const [resetConfirmModal, setResetConfirmModal] = useState<PembimbingLapanganItem | null>(null);
    const [toggleStatusModal, setToggleStatusModal] = useState<{
        pl: PembimbingLapanganItem;
        targetStatus: 'aktif' | 'nonaktif';
    } | null>(null);

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/tu/pembimbing-lapangan',
            { search, status: statusFilter },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        router.get(
            '/tu/pembimbing-lapangan',
            { search, status: newStatus },
            { preserveState: true, replace: true }
        );
    };

    const handleActivate = (user: { id: number }) => {
        setActionLoading(true);
        router.post(
            `/tu/pembimbing-lapangan/${user.id}/activate`,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setActionLoading(false);
                    setToggleStatusModal(null);
                },
            }
        );
    };

    const handleDeactivate = (user: { id: number }) => {
        setActionLoading(true);
        router.post(
            `/tu/pembimbing-lapangan/${user.id}/deactivate`,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setActionLoading(false);
                    setToggleStatusModal(null);
                },
            }
        );
    };

    const handleResetPassword = (user: { id: number }) => {
        setActionLoading(true);
        router.post(
            `/tu/pembimbing-lapangan/${user.id}/reset-password`,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setActionLoading(false);
                    setResetConfirmModal(null);
                },
            }
        );
    };

    return (
        <TULayout>
            <Head title="Kelola Akun Pembimbing Lapangan - Tata Usaha" />

            <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2.5">
                            <Briefcase className="w-7 h-7 text-teal-600" />
                            <span>Kelola Akun Pembimbing Lapangan</span>
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Aktivasi akun, reset password, dan pemantauan pembimbing lapangan mitra instansi kerja praktik.
                        </p>
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                        <div className="text-sm font-medium">{flash.success}</div>
                    </div>
                )}

                {flash?.error && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div className="text-sm font-medium">{flash.error}</div>
                    </div>
                )}

                {flash?.warning && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3">
                        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-sm font-medium">{flash.warning}</div>
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <span>Total Pembimbing</span>
                            <Briefcase className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 font-display">{stats.total}</div>
                        <p className="text-xs text-slate-400">Terdaftar di instansi mitra</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-teal-700 text-xs font-semibold uppercase tracking-wider">
                            <span>Akun Aktif</span>
                            <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        </div>
                        <div className="text-2xl font-bold text-teal-700 font-display">{stats.aktif}</div>
                        <p className="text-xs text-slate-400">Dapat login & menilai</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-amber-700 text-xs font-semibold uppercase tracking-wider">
                            <span>Pending / Belum Aktif</span>
                            <Clock className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="text-2xl font-bold text-amber-700 font-display">{stats.pending}</div>
                        <p className="text-xs text-slate-400">Menunggu aktivasi TU</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-rose-700 text-xs font-semibold uppercase tracking-wider">
                            <span>Nonaktif</span>
                            <XCircle className="w-4 h-4 text-rose-500" />
                        </div>
                        <div className="text-2xl font-bold text-rose-700 font-display">{stats.nonaktif}</div>
                        <p className="text-xs text-slate-400">Akses dinonaktifkan</p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                    <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama pembimbing, email, atau instansi..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                        />
                    </form>

                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                        {[
                            { key: 'all', label: 'Semua' },
                            { key: 'aktif', label: 'Aktif' },
                            { key: 'pending', label: 'Pending' },
                            { key: 'ditolak', label: 'Nonaktif' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleFilterChange(tab.key)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                    statusFilter === tab.key
                                        ? 'bg-teal-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    <th className="py-3.5 px-4 w-12 text-center">No</th>
                                    <th className="py-3.5 px-4">Pembimbing Lapangan</th>
                                    <th className="py-3.5 px-4">Instansi Mitra</th>
                                    <th className="py-3.5 px-4">Akun Login</th>
                                    <th className="py-3.5 px-4">Mahasiswa Bimbingan</th>
                                    <th className="py-3.5 px-4 text-center">Status Akun</th>
                                    <th className="py-3.5 px-4 text-center w-40">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pembimbingLapangans.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Briefcase className="w-8 h-8 text-slate-300" />
                                                <p className="font-medium text-slate-600">Tidak ada data pembimbing lapangan</p>
                                                <p className="text-xs text-slate-400">
                                                    {search ? 'Coba ubah kata kunci pencarian Anda' : 'Belum ada pembimbing lapangan yang terdaftar'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    pembimbingLapangans.data.map((pl, idx) => {
                                        const rowNumber = (pembimbingLapangans.from || 1) + idx;
                                        const user = pl.user;
                                        const status = user?.status_akun;

                                        return (
                                            <tr key={pl.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="py-4 px-4 text-center text-xs font-mono text-slate-400">
                                                    {rowNumber}
                                                </td>

                                                {/* Nama PL */}
                                                <td className="py-4 px-4">
                                                    <div className="font-semibold text-slate-900">{pl.nama}</div>
                                                    {user?.no_telepon && (
                                                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                            <Phone className="w-3 h-3 text-slate-400" />
                                                            <span>{user.no_telepon}</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Instansi */}
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                                                        <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                                                        <span>{pl.instansi?.nama || 'Belum terafiliasi'}</span>
                                                    </div>
                                                </td>

                                                {/* Akun Login */}
                                                <td className="py-4 px-4">
                                                    {user ? (
                                                        <div className="space-y-0.5">
                                                            <div className="text-xs font-medium text-slate-800 flex items-center gap-1">
                                                                <Mail className="w-3 h-3 text-slate-400" />
                                                                <span className="font-mono">{user.email}</span>
                                                            </div>
                                                            <div className="text-[11px] text-slate-400">
                                                                {user.must_change_password ? 'Perlu ganti password' : 'Password telah disetel'}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Belum memiliki akun
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Mahasiswa Bimbingan */}
                                                <td className="py-4 px-4">
                                                    {pl.pendaftarans && pl.pendaftarans.length > 0 ? (
                                                        <div className="space-y-1">
                                                            {pl.pendaftarans.slice(0, 2).map((p) => (
                                                                <div key={p.id} className="text-xs text-slate-700">
                                                                    <span className="font-semibold">{p.mahasiswa?.name}</span>{' '}
                                                                    <span className="text-slate-400 font-mono">({p.mahasiswa?.nim})</span>
                                                                </div>
                                                            ))}
                                                            {pl.pendaftarans.length > 2 && (
                                                                <div className="text-[11px] text-teal-600 font-medium">
                                                                    +{pl.pendaftarans.length - 2} mahasiswa lainnya
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">0 mahasiswa</span>
                                                    )}
                                                </td>

                                                {/* Status Akun */}
                                                <td className="py-4 px-4 text-center">
                                                    {!user ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                                            Belum Terdaftar
                                                        </span>
                                                    ) : status === 'aktif' ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            <span>Aktif</span>
                                                        </span>
                                                    ) : status === 'pending' ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                            <Clock className="w-3 h-3" />
                                                            <span>Pending</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                            <XCircle className="w-3 h-3" />
                                                            <span>Nonaktif</span>
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setDetailModal(pl)}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                                                            title="Lihat Detail"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        {user && (
                                                            <>
                                                                {status === 'aktif' ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setToggleStatusModal({
                                                                                pl,
                                                                                targetStatus: 'nonaktif',
                                                                            })
                                                                        }
                                                                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                                                                        title="Nonaktifkan Akun"
                                                                    >
                                                                        <UserX className="w-4 h-4" />
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setToggleStatusModal({
                                                                                pl,
                                                                                targetStatus: 'aktif',
                                                                            })
                                                                        }
                                                                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                                        title="Aktifkan Akun"
                                                                    >
                                                                        <UserCheck className="w-4 h-4" />
                                                                    </button>
                                                                )}

                                                                <button
                                                                    type="button"
                                                                    onClick={() => setResetConfirmModal(pl)}
                                                                    className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
                                                                    title="Reset Password & Kirim Kredensial"
                                                                >
                                                                    <Key className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pembimbingLapangans.last_page > 1 && (
                        <div className="p-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                            <div>
                                Menampilkan {pembimbingLapangans.from} - {pembimbingLapangans.to} dari {pembimbingLapangans.total} data
                            </div>
                            <div className="flex items-center gap-1">
                                {pembimbingLapangans.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                className="px-3 py-1.5 rounded-lg text-slate-300 cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => router.get(link.url!, {}, { preserveState: true })}
                                            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                                                link.active
                                                    ? 'bg-teal-600 text-white'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* DETAIL MODAL */}
            {detailModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-teal-600" />
                                <span>Detail Pembimbing Lapangan</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setDetailModal(null)}
                                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500">Nama Pembimbing:</span>
                                <span className="font-semibold text-slate-900">{detailModal.nama}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500">Instansi:</span>
                                <span className="font-semibold text-slate-900">{detailModal.instansi?.nama || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500">Email Login:</span>
                                <span className="font-mono text-slate-900">{detailModal.user?.email || 'Belum ada akun'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500">No. Telepon:</span>
                                <span className="text-slate-900">{detailModal.user?.no_telepon || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500">Status Akun:</span>
                                <span className="font-semibold capitalize text-teal-700">
                                    {detailModal.user?.status_akun || 'Belum terdaftar'}
                                </span>
                            </div>

                            <div className="pt-2">
                                <p className="font-semibold text-xs text-slate-600 uppercase tracking-wider mb-2">
                                    Daftar Mahasiswa yang Dibimbing:
                                </p>
                                {detailModal.pendaftarans && detailModal.pendaftarans.length > 0 ? (
                                    <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-200/60 max-h-40 overflow-y-auto">
                                        {detailModal.pendaftarans.map((p) => (
                                            <div key={p.id} className="text-xs flex justify-between">
                                                <span className="font-medium text-slate-800">{p.mahasiswa?.name}</span>
                                                <span className="text-slate-400 font-mono">{p.mahasiswa?.nim}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">Belum ada mahasiswa yang terhubung.</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setDetailModal(null)}
                                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOGGLE STATUS MODAL */}
            {toggleStatusModal && toggleStatusModal.pl.user && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
                        <div className="flex items-center gap-3">
                            {toggleStatusModal.targetStatus === 'aktif' ? (
                                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                                    <UserCheck className="w-6 h-6" />
                                </div>
                            ) : (
                                <div className="p-3 rounded-full bg-rose-100 text-rose-600">
                                    <UserX className="w-6 h-6" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">
                                    {toggleStatusModal.targetStatus === 'aktif'
                                        ? 'Aktifkan Akun Pembimbing Lapangan?'
                                        : 'Nonaktifkan Akun Pembimbing Lapangan?'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {toggleStatusModal.pl.nama} ({toggleStatusModal.pl.user.email})
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                            {toggleStatusModal.targetStatus === 'aktif'
                                ? 'Akun yang diaktifkan akan dapat kembali login ke portal pembimbing lapangan untuk melakukan monitoring dan penilaian kerja praktik mahasiswa.'
                                : 'Pembimbing lapangan ini tidak akan dapat login ke sistem selama akun dalam status nonaktif.'}
                        </p>

                        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => setToggleStatusModal(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => {
                                    if (toggleStatusModal.targetStatus === 'aktif') {
                                        handleActivate(toggleStatusModal.pl.user!);
                                    } else {
                                        handleDeactivate(toggleStatusModal.pl.user!);
                                    }
                                }}
                                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-colors shadow-xs ${
                                    toggleStatusModal.targetStatus === 'aktif'
                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                        : 'bg-rose-600 hover:bg-rose-700'
                                }`}
                            >
                                {actionLoading ? 'Menyimpan...' : 'Ya, Lanjutkan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* RESET PASSWORD MODAL */}
            {resetConfirmModal && resetConfirmModal.user && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-full bg-teal-100 text-teal-700">
                                <Key className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">Reset Password Akun?</h3>
                                <p className="text-xs text-slate-500">
                                    {resetConfirmModal.nama} ({resetConfirmModal.user.email})
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                            Sistem akan membuat kata sandi acak baru dan secara otomatis mengirimkan informasi akun ke alamat email pembimbing lapangan ({resetConfirmModal.user.email}).
                        </p>

                        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => setResetConfirmModal(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleResetPassword(resetConfirmModal.user!)}
                                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-xs"
                            >
                                {actionLoading ? 'Mengirim...' : 'Reset & Kirim Email'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </TULayout>
    );
}
