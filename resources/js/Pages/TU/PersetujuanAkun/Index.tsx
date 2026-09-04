import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import TULayout from '@/Layouts/TULayout';
import { 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Search, 
    Eye, 
    GraduationCap, 
    Mail, 
    Calendar, 
    AlertCircle,
    UserCheck,
    Check,
    X,
    MessageSquare
} from 'lucide-react';

interface Permohonan {
    id: number;
    nim: string;
    nama: string;
    email: string;
    program_studi: string;
    angkatan: string;
    status: 'menunggu_verifikasi' | 'disetujui' | 'ditolak';
    catatan_tu?: string | null;
    created_at: string;
    diverifikasi_pada?: string | null;
    verifikator?: {
        id: number;
        name: string;
    } | null;
}

interface Props {
    permohonans: {
        data: Permohonan[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    counts: {
        total: number;
        menunggu_verifikasi: number;
        disetujui: number;
        ditolak: number;
    };
    filters: {
        status: string;
        search: string;
    };
}

export default function Index({ permohonans, counts, filters }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState(filters.status || 'menunggu_verifikasi');

    // Modals
    const [detailModal, setDetailModal] = useState<Permohonan | null>(null);
    const [approveConfirmModal, setApproveConfirmModal] = useState<Permohonan | null>(null);
    const [rejectModal, setRejectModal] = useState<Permohonan | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('tu.persetujuan-akun'), {
            status: activeTab,
            search: search,
        }, { preserveState: true });
    };

    const handleTabChange = (status: string) => {
        setActiveTab(status);
        router.get(route('tu.persetujuan-akun'), {
            status: status,
            search: search,
        }, { preserveState: true });
    };

    const handleApprove = () => {
        if (!approveConfirmModal) return;
        setIsSubmitting(true);
        router.post(`/tu/persetujuan-akun/${approveConfirmModal.id}/approve`, {}, {
            onFinish: () => {
                setIsSubmitting(false);
                setApproveConfirmModal(null);
            }
        });
    };

    const handleReject = () => {
        if (!rejectModal) return;
        setIsSubmitting(true);
        router.post(`/tu/persetujuan-akun/${rejectModal.id}/reject`, {
            catatan_tu: rejectReason,
        }, {
            onFinish: () => {
                setIsSubmitting(false);
                setRejectModal(null);
                setRejectReason('');
            }
        });
    };

    return (
        <TULayout>
            <Head title="Persetujuan Akun Mahasiswa - TU SI-KP" />

            <div className="space-y-6">
                
                {/* Header Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
                            <span>Permohonan Akun Mahasiswa</span>
                            {counts.menunggu_verifikasi > 0 && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                    {counts.menunggu_verifikasi} Menunggu
                                </span>
                            )}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Verifikasi permohonan pendaftaran akun mahasiswa berdasarkan Data Master Mahasiswa.
                        </p>
                    </div>
                </div>

                {/* Flash Success / Error Alerts */}
                {flash?.success && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-start gap-3 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
                        <div className="leading-relaxed">{flash.success}</div>
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-medium flex items-start gap-3 shadow-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                        <div className="leading-relaxed">{flash.error}</div>
                    </div>
                )}

                {/* Filter Tabs & Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                        <button
                            type="button"
                            onClick={() => handleTabChange('menunggu_verifikasi')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                                activeTab === 'menunggu_verifikasi'
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Menunggu Verifikasi ({counts.menunggu_verifikasi})
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange('disetujui')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                                activeTab === 'disetujui'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Disetujui ({counts.disetujui})
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange('ditolak')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                                activeTab === 'ditolak'
                                    ? 'bg-red-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Ditolak ({counts.ditolak})
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                                activeTab === 'all'
                                    ? 'bg-slate-800 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Semua ({counts.total})
                        </button>
                    </div>

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="relative min-w-[240px]">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari NIM atau Nama..."
                            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </form>
                </div>

                {/* Table Data */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Mahasiswa</th>
                                    <th className="px-6 py-4">Program Studi</th>
                                    <th className="px-6 py-4">Email Resmi</th>
                                    <th className="px-6 py-4">Tanggal Pengajuan</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {permohonans.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            <GraduationCap className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                                            <p className="text-sm font-semibold">Tidak ada data permohonan akun</p>
                                            <p className="text-xs">Tidak ada permohonan dengan kriteria filter yang dipilih.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    permohonans.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{item.nama}</div>
                                                <div className="text-[11px] text-slate-400 font-mono">NIM: {item.nim}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>{item.program_studi}</div>
                                                <div className="text-[11px] text-slate-400">Angkatan {item.angkatan}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-slate-600 flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                                                    {item.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.status === 'menunggu_verifikasi' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                        <Clock className="w-3 h-3" />
                                                        Menunggu Verifikasi
                                                    </span>
                                                )}
                                                {item.status === 'disetujui' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Disetujui
                                                    </span>
                                                )}
                                                {item.status === 'ditolak' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                                                        <XCircle className="w-3 h-3" />
                                                        Ditolak
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* Detail Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setDetailModal(item)}
                                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>

                                                    {/* Approve & Reject for Pending Items */}
                                                    {item.status === 'menunggu_verifikasi' && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => setApproveConfirmModal(item)}
                                                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                                                                title="Setujui Permohonan"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                                <span>Setujui</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setRejectModal(item);
                                                                    setRejectReason('');
                                                                }}
                                                                className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                                                title="Tolak Permohonan"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                                <span>Tolak</span>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL: DETAIL MAHASISWA */}
                {detailModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                        <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-base font-bold text-slate-900">Detail Permohonan Akun</h3>
                                <button onClick={() => setDetailModal(null)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                                    <div>
                                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Nama Lengkap</span>
                                        <span className="font-bold text-slate-900 text-sm">{detailModal.nama}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-[10px] uppercase font-bold block">NIM</span>
                                        <span className="font-mono font-bold text-slate-800">{detailModal.nim}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Program Studi & Angkatan</span>
                                        <span className="text-slate-800 font-medium">{detailModal.program_studi} (Angkatan {detailModal.angkatan})</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Email Resmi Kampus</span>
                                        <span className="font-mono text-blue-700 font-medium">{detailModal.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Waktu Pengajuan</span>
                                        <span className="text-slate-700">{new Date(detailModal.created_at).toLocaleString('id-ID')}</span>
                                    </div>
                                    {detailModal.catatan_tu && (
                                        <div className="pt-2 border-t border-slate-200">
                                            <span className="text-red-500 text-[10px] uppercase font-bold block">Catatan Penolakan TU</span>
                                            <span className="text-slate-700 italic">{detailModal.catatan_tu}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={() => setDetailModal(null)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: APPROVE CONFIRMATION */}
                {approveConfirmModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                        <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                                <UserCheck className="w-6 h-6" />
                            </div>

                            <div className="text-center space-y-1">
                                <h3 className="text-lg font-black text-slate-900">Setujui Permohonan Akun?</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Sistem akan otomatis membuat akun untuk mahasiswa <strong className="text-slate-800">{approveConfirmModal.nama}</strong> ({approveConfirmModal.nim}), men-generate password sementara acak, dan mengirimkan kredensial ke email <strong className="text-slate-800">{approveConfirmModal.email}</strong>.
                                </p>
                            </div>

                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <span>Akun ini akan diwajibkan mengganti password baru saat login pertama kali (must_change_password).</span>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setApproveConfirmModal(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleApprove}
                                    disabled={isSubmitting}
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Memproses...' : 'Ya, Setujui Akun'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: REJECT FORM */}
                {rejectModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                        <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    Tolak Permohonan Akun
                                </h3>
                                <button onClick={() => setRejectModal(null)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-xs text-slate-500">
                                Menolak permohonan untuk mahasiswa: <strong>{rejectModal.nama}</strong> ({rejectModal.nim}).
                            </p>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 block">
                                    Alasan Penolakan (Opsional)
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Contoh: Terdapat ketidaksesuaian berkas identitas akademik..."
                                    rows={3}
                                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setRejectModal(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReject}
                                    disabled={isSubmitting}
                                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Menolak...' : 'Tolak Permohonan'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TULayout>
    );
}
