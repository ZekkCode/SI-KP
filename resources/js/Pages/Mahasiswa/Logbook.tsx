import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import React, { useState, useRef } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import {
    BookOpen, Plus, Pencil, Trash2, CheckCircle2, Clock, AlertCircle,
    Calendar, ImageIcon, X, MessageSquare, Upload, Search,
} from 'lucide-react';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';

/* ──────────────────── Types ──────────────────── */

interface LogbookEntry {
    id: number;
    tanggal: string;
    jam_mulai: string | null;
    jam_selesai: string | null;
    deskripsi: string;
    path_foto: string | null;
    status_dosen: 'menunggu' | 'disetujui' | 'revisi';
    status_instansi: 'menunggu' | 'disetujui' | 'revisi';
    catatan_dosen: string | null;
    catatan_instansi: string | null;
    created_at: string;
}

interface DosenPembimbing {
    name: string;
    nip: string;
}

interface PembimbingLapangan {
    nama: string;
    instansi: {
        nama: string;
    } | null;
}

interface LogbookProps extends Record<string, unknown> {
    logbooks: LogbookEntry[];
    dosenPembimbing: DosenPembimbing | null;
    pembimbingLapangan: PembimbingLapangan | null;
    hasPendaftaran: boolean;
    pendaftaranId: number | null;
    flash: { success?: string; error?: string };
}

/* ──────────────────── Status Helpers ──────────────────── */

const statusConfig = {
    menunggu: {
        label: 'Menunggu',
        icon: Clock,
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
    },
    disetujui: {
        label: 'Disetujui',
        icon: CheckCircle2,
        badge: 'bg-green-100 text-green-700 border-green-200',
        dot: 'bg-green-500',
    },
    revisi: {
        label: 'Perlu Revisi',
        icon: AlertCircle,
        badge: 'bg-red-100 text-red-700 border-red-200',
        dot: 'bg-red-500',
    },
} as const;

/* ──────────────────── Component ──────────────────── */

export default function Logbook({
    logbooks,
    dosenPembimbing,
    pembimbingLapangan,
    hasPendaftaran,
    flash,
}: PageProps<LogbookProps>) {
    /* ─── State ─── */
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('semua');
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    /* ─── Filtering & search ─── */
    const filtered = logbooks.filter((lb) => {
        const matchStatus = filterStatus === 'semua' || lb.status_dosen === filterStatus || lb.status_instansi === filterStatus;
        const matchSearch =
            !searchQuery ||
            lb.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lb.tanggal.includes(searchQuery);
        return matchStatus && matchSearch;
    });

    /* ─── Stats ─── */
    const stats = {
        total: logbooks.length,
        menunggu: logbooks.filter((l) => l.status_dosen === 'menunggu' || l.status_instansi === 'menunggu').length,
        disetujui: logbooks.filter((l) => l.status_dosen === 'disetujui' && l.status_instansi === 'disetujui').length,
        revisi: logbooks.filter((l) => l.status_dosen === 'revisi' || l.status_instansi === 'revisi').length,
    };

    /* ─── Delete handler ─── */
    const handleDelete = (id: number) => {
        router.delete(`/mahasiswa/logbook/${id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteConfirmId(null),
        });
    };

    /* ─── Format helpers ─── */
    const formatDate = (d: string) => {
        const date = new Date(d + 'T00:00:00');
        return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };
    const formatTime = (t: string | null) => (t ? t.slice(0, 5) : '-');

    /* ══════════════════ RENDER ══════════════════ */
    return (
        <div className="flex-1 p-4 sm:p-6 max-w-[1280px] mx-auto w-full space-y-6">
            {/* ── Flash messages ── */}
            {flash?.success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                        <p className="font-bold text-sm">Berhasil!</p>
                        <p className="text-sm">{flash.success}</p>
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <div>
                        <p className="font-bold text-sm">Gagal!</p>
                        <p className="text-sm">{flash.error}</p>
                    </div>
                </div>
            )}

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
                        <BookOpen className="w-3.5 h-3.5" />
                        Tahap 4: Logbook Harian
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Logbook Kegiatan Harian</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Catat aktivitas harian, jam kerja, dan dokumentasi kegiatan Kerja Praktik.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mt-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                        <div className="flex-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Pembimbing Lapangan</span>
                            <span className="text-sm font-bold text-slate-900">
                                {pembimbingLapangan?.nama ?? 'Belum ditentukan'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Instansi Mitra</span>
                            <span className="text-sm font-bold text-slate-900">
                                {pembimbingLapangan?.instansi?.nama ?? 'Belum ditentukan'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Dosen Pembimbing</span>
                            <span className="text-sm font-bold text-slate-900">
                                {dosenPembimbing?.name ?? 'Belum ditentukan'}
                            </span>
                        </div>
                    </div>
                </div>

                {hasPendaftaran && (
                    <Link
                        href="/mahasiswa/logbook/create"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition shadow-xs cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Kegiatan</span>
                    </Link>
                )}
            </div>

            {/* ── No Pendaftaran guard ── */}
            {!hasPendaftaran && (
                <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center shadow-xs">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">Belum Terdaftar KP</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Silakan selesaikan pendaftaran Kerja Praktik dan verifikasi berkas sebelum mengisi logbook kegiatan harian.
                    </p>
                </div>
            )}

            {hasPendaftaran && (
                <>
                    {/* ── Stats Cards ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { label: 'Total Entri', value: stats.total, color: 'text-blue-700', bg: 'bg-blue-50/70 border-blue-200' },
                            { label: 'Menunggu', value: stats.menunggu, color: 'text-amber-700', bg: 'bg-amber-50/70 border-amber-200' },
                            { label: 'Disetujui', value: stats.disetujui, color: 'text-emerald-700', bg: 'bg-emerald-50/70 border-emerald-200' },
                            { label: 'Perlu Revisi', value: stats.revisi, color: 'text-red-700', bg: 'bg-red-50/70 border-red-200' },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className={`${s.bg} rounded-xl p-4 border`}
                            >
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">{s.label}</p>
                                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Search & Filter Bar ── */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari kegiatan atau tanggal..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                            {(['semua', 'menunggu', 'disetujui', 'revisi'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                                        filterStatus === s
                                            ? 'bg-blue-700 text-white shadow-xs'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    {s === 'semua' ? 'Semua Status' : statusConfig[s].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Logbook List ── */}
                    {filtered.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center shadow-xs">
                            <div className="w-12 h-12 rounded-lg bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto mb-3">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-1">Tidak Ada Catatan Ditemukan</h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto">
                                {searchQuery || filterStatus !== 'semua'
                                    ? 'Coba sesuaikan kata kunci pencarian atau filter status yang dipilih.'
                                    : 'Mulai dokumentasikan kegiatan harian Anda dengan tombol "Tambah Kegiatan".'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((entry) => {
                                return (
                                    <div
                                        key={entry.id}
                                        className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-blue-300 transition group"
                                    >
                                        <div className="p-5 sm:p-6">
                                            {/* Top row: date + status + actions */}
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">
                                                            {formatDate(entry.tanggal)}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {entry.jam_mulai && entry.jam_selesai
                                                                ? `${entry.jam_mulai} - ${entry.jam_selesai} WIB`
                                                                : 'Waktu belum diatur'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold text-slate-500">Dosen:</span>
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${statusConfig[entry.status_dosen].badge}`}>
                                                            {React.createElement(statusConfig[entry.status_dosen].icon, { className: "w-3 h-3" })}
                                                            {statusConfig[entry.status_dosen].label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold text-slate-500">Instansi:</span>
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${statusConfig[entry.status_instansi].badge}`}>
                                                            {React.createElement(statusConfig[entry.status_instansi].icon, { className: "w-3 h-3" })}
                                                            {statusConfig[entry.status_instansi].label}
                                                        </span>
                                                    </div>

                                                    {!(entry.status_dosen === 'disetujui' || entry.status_instansi === 'disetujui') && (
                                                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity mt-1">
                                                            <Link
                                                                href={`/mahasiswa/logbook/${entry.id}/edit`}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 transition"
                                                                title="Edit Catatan"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                                <span>Edit</span>
                                                            </Link>
                                                            <button
                                                                onClick={() => setDeleteConfirmId(entry.id)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 transition cursor-pointer"
                                                                title="Hapus Catatan"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                <span>Hapus</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Deskripsi */}
                                            <p className="text-body-md text-on-surface leading-relaxed whitespace-pre-line">
                                                {entry.deskripsi}
                                            </p>

                                            {/* Foto */}
                                            {entry.path_foto && (
                                                <div className="mt-4">
                                                    <img
                                                        src={`/storage/${entry.path_foto}`}
                                                        alt="Dokumentasi kegiatan"
                                                        className="rounded-lg border border-outline-variant max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                        onClick={() => setPreviewImage(`/storage/${entry.path_foto}`)}
                                                    />
                                                </div>
                                            )}

                                            {/* Catatan Dosen */}
                                            {entry.catatan_dosen && (
                                                <div className={`mt-4 rounded-lg p-4 flex items-start gap-3 ${
                                                    entry.status_dosen === 'revisi'
                                                        ? 'bg-red-50 border border-red-200'
                                                        : 'bg-blue-50 border border-blue-200'
                                                }`}>
                                                    <MessageSquare className={`w-4 h-4 mt-0.5 shrink-0 ${
                                                        entry.status_dosen === 'revisi' ? 'text-red-600' : 'text-blue-600'
                                                    }`} />
                                                    <div>
                                                        <p className={`text-label-sm font-semibold mb-1 ${
                                                            entry.status_dosen === 'revisi' ? 'text-red-700' : 'text-blue-700'
                                                        }`}>
                                                            Catatan Dosen Pembimbing
                                                        </p>
                                                        <p className={`text-body-sm ${
                                                            entry.status_dosen === 'revisi' ? 'text-red-600' : 'text-blue-600'
                                                        }`}>
                                                            {entry.catatan_dosen}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Catatan Instansi */}
                                            {entry.catatan_instansi && (
                                                <div className={`mt-4 rounded-lg p-4 flex items-start gap-3 ${
                                                    entry.status_instansi === 'revisi'
                                                        ? 'bg-red-50 border border-red-200'
                                                        : 'bg-blue-50 border border-blue-200'
                                                }`}>
                                                    <MessageSquare className={`w-4 h-4 mt-0.5 shrink-0 ${
                                                        entry.status_instansi === 'revisi' ? 'text-red-600' : 'text-blue-600'
                                                    }`} />
                                                    <div>
                                                        <p className={`text-label-sm font-semibold mb-1 ${
                                                            entry.status_instansi === 'revisi' ? 'text-red-700' : 'text-blue-700'
                                                        }`}>
                                                            Catatan Pembimbing Lapangan
                                                        </p>
                                                        <p className={`text-body-sm ${
                                                            entry.status_instansi === 'revisi' ? 'text-red-600' : 'text-blue-600'
                                                        }`}>
                                                            {entry.catatan_instansi}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Delete confirmation inline */}
                                        {deleteConfirmId === entry.id && (
                                            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                                    <p className="text-sm text-red-700 font-medium">
                                                        Yakin ingin menghapus catatan kegiatan ini?
                                                    </p>
                                                    <div className="flex gap-2 shrink-0">
                                                        <button
                                                            onClick={() => setDeleteConfirmId(null)}
                                                            className="px-3 py-1.5 text-sm rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors"
                                                        >
                                                            Batal
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(entry.id)}
                                                            className="px-3 py-1.5 text-sm rounded-lg bg-error text-on-error font-medium hover:bg-error/90 transition-colors"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* ═══════════════ IMAGE PREVIEW MODAL ═══════════════ */}
            <Modal show={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="2xl">
                <div className="p-2" onClick={(e) => e.stopPropagation()}>
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Preview foto dokumentasi"
                            className="w-full rounded-lg"
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
}

Logbook.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
