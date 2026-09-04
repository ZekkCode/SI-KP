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
                    <h1 className="text-headline-md text-on-surface">Monitoring Kegiatan</h1>
                    <p className="text-body-md text-secondary mt-1">
                        Catat kegiatan harian Kerja Praktik Anda.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mt-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                        <div className="flex-1">
                            <span className="text-label-sm text-secondary block">Pembimbing Lapangan</span>
                            <span className="text-body-md font-semibold text-on-surface">
                                {pembimbingLapangan?.nama ?? 'Belum ditentukan'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <span className="text-label-sm text-secondary block">Instansi</span>
                            <span className="text-body-md font-semibold text-on-surface">
                                {pembimbingLapangan?.instansi?.nama ?? 'Belum ditentukan'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <span className="text-label-sm text-secondary block">Dosen Pembimbing</span>
                            <span className="text-body-md font-semibold text-on-surface">
                                {dosenPembimbing?.name ?? 'Belum ditentukan'}
                            </span>
                        </div>
                    </div>
                </div>

                {hasPendaftaran && (
                    <Link
                        href="/mahasiswa/logbook/create"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md shadow-primary/20"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Catatan
                    </Link>
                )}
            </div>

            {/* ── No Pendaftaran guard ── */}
            {!hasPendaftaran && (
                <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-12 text-center">
                    <BookOpen className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-4" />
                    <h3 className="text-title-lg text-on-surface mb-2">Belum Ada Pendaftaran</h3>
                    <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
                        Anda perlu mendaftar Kerja Praktik terlebih dahulu sebelum dapat mengisi logbook.
                    </p>
                </div>
            )}

            {hasPendaftaran && (
                <>
                    {/* ── Stats Cards ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { label: 'Total Entri', value: stats.total, color: 'text-primary', bg: 'bg-primary-fixed' },
                            { label: 'Menunggu', value: stats.menunggu, color: 'text-amber-700', bg: 'bg-amber-50' },
                            { label: 'Disetujui', value: stats.disetujui, color: 'text-green-700', bg: 'bg-green-50' },
                            { label: 'Revisi', value: stats.revisi, color: 'text-red-700', bg: 'bg-red-50' },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className={`${s.bg} rounded-xl p-4 border border-outline-variant/50`}
                            >
                                <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">{s.label}</p>
                                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Search & Filter Bar ── */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan deskripsi atau tanggal..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            {(['semua', 'menunggu', 'disetujui', 'revisi'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                        filterStatus === s
                                            ? 'bg-primary text-on-primary shadow-sm'
                                            : 'bg-surface-container-low text-on-surface-variant border border-outline-variant hover:bg-surface-container'
                                    }`}
                                >
                                    {s === 'semua' ? 'Semua' : statusConfig[s].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Logbook List ── */}
                    {filtered.length === 0 ? (
                        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-12 text-center">
                            <Calendar className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-4" />
                            <h3 className="text-title-lg text-on-surface mb-2">Belum Ada Catatan Kegiatan</h3>
                            <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
                                {searchQuery || filterStatus !== 'semua'
                                    ? 'Tidak ada catatan yang cocok dengan filter.'
                                    : 'Mulai catat kegiatan harian Anda dengan menekan tombol "Tambah Catatan".'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((entry) => {
                                return (
                                    <div
                                        key={entry.id}
                                        className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                                    >
                                        <div className="p-5 sm:p-6">
                                            {/* Top row: date + status + actions */}
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
                                                        <Calendar className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-label-md text-on-surface font-semibold">
                                                            {formatDate(entry.tanggal)}
                                                        </p>
                                                        <p className="text-label-sm text-on-surface-variant">
                                                            {entry.jam_mulai && entry.jam_selesai
                                                                ? `${entry.jam_mulai} - ${entry.jam_selesai}`
                                                                : 'Waktu tidak diatur'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-on-surface-variant w-14 text-right">Dosen:</span>
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[entry.status_dosen].badge}`}>
                                                            {React.createElement(statusConfig[entry.status_dosen].icon, { className: "w-3.5 h-3.5" })}
                                                            {statusConfig[entry.status_dosen].label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-on-surface-variant w-14 text-right">Instansi:</span>
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[entry.status_instansi].badge}`}>
                                                            {React.createElement(statusConfig[entry.status_instansi].icon, { className: "w-3.5 h-3.5" })}
                                                            {statusConfig[entry.status_instansi].label}
                                                        </span>
                                                    </div>

                                                    {!(entry.status_dosen === 'disetujui' || entry.status_instansi === 'disetujui') && (
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                                                            <Link
                                                                href={`/mahasiswa/logbook/${entry.id}/edit`}
                                                                className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary-container/60 transition-all"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => setDeleteConfirmId(entry.id)}
                                                                className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/60 transition-all"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
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
