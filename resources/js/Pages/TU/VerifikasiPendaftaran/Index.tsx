import TULayout from '@/Layouts/TULayout';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Check, X, Eye, FileText, Download, User, Building2, AlertCircle, CheckCircle2, Phone, Mail, Edit3, XCircle, Clock } from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

interface Mahasiswa {
    id: number;
    name: string;
    nim: string;
    email?: string;
    no_telepon?: string;
    semester?: string;
    ipk?: string;
    total_sks?: number;
    program_studi?: {
        nama: string;
    } | string;
    dosen_wali?: {
        id: number;
        name: string;
    } | null;
}

interface Instansi {
    id: number;
    nama: string;
    alamat?: string;
}

interface DokumenPendaftaran {
    id: number;
    jenis: string;
    nama_file: string;
    path: string;
    ukuran: number;
    uploaded_at?: string;
}

interface Pendaftaran {
    id: number;
    status: string;
    catatan_tu?: string | null;
    diverifikasi_pada?: string | null;
    mahasiswa?: Mahasiswa;
    instansi?: Instansi;
    dosen_pembimbing?: {
        id: number;
        name: string;
    } | null;
    dokumen_pendaftarans?: DokumenPendaftaran[];
}

interface Props {
    pendaftarans: Pendaftaran[];
}

const APPROVED_STATUSES = [
    'disetujui_tu',
    'surat_terbit',
    'konfirmasi_instansi',
    'diterima_instansi',
    'verifikasi_surat_balasan',
    'plotting_dosen',
    'aktif',
    'seminar',
    'sidang_requested',
    'sidang_dijadwalkan',
    'selesai'
];

export default function Index({ pendaftarans }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [rejectCatatan, setRejectCatatan] = useState('');
    const [detailItem, setDetailItem] = useState<Pendaftaran | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Form state for editing detail
    const [editForm, setEditForm] = useState({
        status: 'disetujui_tu',
        catatan_tu: '',
        total_sks: '',
        ipk: '',
    });
    const [processingEdit, setProcessingEdit] = useState(false);

    const approve = (id: number) => {
        router.post(`/tu/verifikasi-pendaftaran/${id}/approve`, {}, {
            preserveScroll: true,
            onError: (errors) => {
                console.error("Error dari backend:", errors);
                alert("Gagal menyetujui, silakan coba beberapa saat lagi.");
            }
        });
    };

    const reject = (id: number) => {
        if (!rejectCatatan.trim()) {
            alert('Catatan perbaikan harus diisi!');
            return;
        }

        router.post(`/tu/verifikasi-pendaftaran/${id}/reject`, {
            catatan_tu: rejectCatatan
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedId(null);
                setRejectCatatan('');
            }
        });
    };

    const openEditModal = (item: Pendaftaran) => {
        setDetailItem(item);
        setEditForm({
            status: item.status || 'disetujui_tu',
            catatan_tu: item.catatan_tu || '',
            total_sks: item.mahasiswa?.total_sks ? String(item.mahasiswa.total_sks) : '',
            ipk: item.mahasiswa?.ipk ? String(item.mahasiswa.ipk) : '',
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!detailItem) return;

        setProcessingEdit(true);
        router.put(`/tu/verifikasi-pendaftaran/${detailItem.id}`, editForm, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                setDetailItem(null);
                setProcessingEdit(false);
            },
            onError: (errs) => {
                setProcessingEdit(false);
                console.error(errs);
                alert('Gagal memperbarui data pendaftaran. Periksa kembali isian form.');
            }
        });
    };

    return (
        <div className="animate-in fade-in duration-300 space-y-6">
            <Head title="Verifikasi Pendaftaran KP" />

            <PageHeader
                title="Verifikasi Pengajuan Kerja Praktik"
                description="Daftar antrean mahasiswa yang mengajukan pendaftaran Kerja Praktik dan verifikasi berkas prasyarat."
            />

            <div className="bg-white rounded-xl border border-outline-variant shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <ModernTable className="border-0 shadow-none">
                        <ModernTableHeader>
                            <ModernTableTh className="w-[5%] text-center">No</ModernTableTh>
                            <ModernTableTh className="w-[22%]">Nama Lengkap</ModernTableTh>
                            <ModernTableTh className="w-[14%]">NIM</ModernTableTh>
                            <ModernTableTh className="w-[14%]">IPK / SKS</ModernTableTh>
                            <ModernTableTh className="w-[20%]">Instansi Tujuan</ModernTableTh>
                            <ModernTableTh className="w-[25%] text-center">Aksi & Status</ModernTableTh>
                        </ModernTableHeader>
                        <ModernTableBody>
                            {pendaftarans.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 px-6 text-center text-gray-500 italic text-sm">
                                        Tidak ada pengajuan yang menunggu verifikasi.
                                    </td>
                                </tr>
                            ) : (
                                pendaftarans.map((p, index) => {
                                    const isApproved = APPROVED_STATUSES.includes(p.status);
                                    const isPerbaikan = p.status === 'perlu_perbaikan';
                                    const isRejected = ['ditolak', 'ditolak_instansi'].includes(p.status);
                                    const isPending = !isApproved && !isPerbaikan && !isRejected;

                                    return (
                                        <tr key={p.id} className="border-b border-outline-variant hover:bg-slate-50/60 transition-colors">
                                            <ModernTableTd className="text-center text-xs text-slate-500">{index + 1}</ModernTableTd>
                                            <ModernTableTd>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900 text-sm">{p.mahasiswa?.name ?? 'Nama Tidak Ditemukan'}</span>
                                                    <span className="text-[11px] text-slate-400">
                                                        {typeof p.mahasiswa?.program_studi === 'object'
                                                            ? p.mahasiswa?.program_studi?.nama
                                                            : p.mahasiswa?.program_studi || 'Teknik Informatika'}
                                                    </span>
                                                </div>
                                            </ModernTableTd>
                                            <ModernTableTd className="font-mono text-xs text-slate-700">{p.mahasiswa?.nim ?? '-'}</ModernTableTd>
                                            <ModernTableTd className="text-xs font-medium text-slate-700">
                                                {p.mahasiswa?.ipk ?? '-'} / {p.mahasiswa?.total_sks ?? '-'} SKS
                                            </ModernTableTd>
                                            <ModernTableTd className="text-xs text-slate-700">
                                                <span className="font-medium text-slate-800">{p.instansi?.nama ?? '-'}</span>
                                            </ModernTableTd>
                                            <ModernTableTd>
                                                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                                    {isApproved ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Disetujui
                                                        </span>
                                                    ) : isPerbaikan ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            Perlu Perbaikan
                                                        </span>
                                                    ) : isRejected ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-100 text-rose-800">
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            Ditolak
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => approve(p.id)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 rounded-lg transition-all active:scale-95 font-medium text-xs cursor-pointer shadow-2xs"
                                                                title="Setujui Berkas Mahasiswa"
                                                            >
                                                                <Check size={14} /> Setujui
                                                            </button>
                                                            <button
                                                                onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 rounded-lg transition-all active:scale-95 font-medium text-xs cursor-pointer shadow-2xs"
                                                                title="Tolak / Minta Revisi"
                                                            >
                                                                <X size={14} /> Tolak
                                                            </button>
                                                        </>
                                                    )}

                                                    <button
                                                        onClick={() => openEditModal(p)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-[#00288e] hover:text-white border border-slate-200 rounded-lg transition-all active:scale-95 font-medium text-xs cursor-pointer shadow-2xs"
                                                        title="Lihat Berkas & Edit Data"
                                                    >
                                                        <Eye size={14} /> Detail / Edit
                                                    </button>
                                                </div>
                                            </ModernTableTd>
                                        </tr>
                                    );
                                })
                            )}
                        </ModernTableBody>
                    </ModernTable>
                </div>
            </div>

            {/* Reject Inline Note Box */}
            {selectedId && (
                <div className="p-6 bg-red-50/70 border border-red-200 rounded-xl shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2 mb-2 text-red-800">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <h3 className="text-base font-bold">Penolakan / Revisi Pengajuan Berkas</h3>
                    </div>
                    <p className="text-xs text-red-700 mb-4">
                        Berikan catatan instruksi perbaikan agar mahasiswa dapat memperbaiki berkas atau data prasyarat pendaftaran.
                    </p>

                    <textarea
                        className="w-full border border-red-300 rounded-lg p-3 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none mb-4 bg-white text-slate-900"
                        placeholder="Contoh: SKS kurang dari 80 prasyarat, transkrip nilai buram/tidak terbaca, dll."
                        rows={3}
                        value={rejectCatatan}
                        onChange={e => setRejectCatatan(e.target.value)}
                    ></textarea>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => { setSelectedId(null); setRejectCatatan(''); }}
                            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => reject(selectedId)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                            Kirim Catatan Revisi
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Detail & Edit Pendaftaran */}
            {isEditModalOpen && detailItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1">
                                    <Edit3 className="w-3.5 h-3.5" /> Verifikasi Tata Usaha
                                </span>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {detailItem.mahasiswa?.name || 'Mahasiswa'}
                                </h3>
                                <p className="text-xs text-slate-500 font-mono">NIM: {detailItem.mahasiswa?.nim || '-'}</p>
                            </div>
                            <button
                                onClick={() => { setIsEditModalOpen(false); setDetailItem(null); }}
                                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
                            {/* Data Akademik Mahasiswa Overview */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-blue-700" /> Profil & Kontak Mahasiswa
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <span className="text-slate-400 block">Program Studi</span>
                                        <strong className="text-slate-800">
                                            {typeof detailItem.mahasiswa?.program_studi === 'object'
                                                ? detailItem.mahasiswa?.program_studi?.nama
                                                : detailItem.mahasiswa?.program_studi || 'Teknik Informatika'}
                                        </strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">Semester Berjalan</span>
                                        <strong className="text-slate-800">{detailItem.mahasiswa?.semester || '-'}</strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">WhatsApp / Telepon</span>
                                        {detailItem.mahasiswa?.no_telepon ? (
                                            <a
                                                href={`https://wa.me/${detailItem.mahasiswa.no_telepon.replace(/^0/, '62').replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-700 hover:underline font-semibold flex items-center gap-1"
                                            >
                                                <Phone className="w-3 h-3" />
                                                {detailItem.mahasiswa.no_telepon}
                                            </a>
                                        ) : (
                                            <span className="text-slate-500">-</span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">Email Mahasiswa</span>
                                        <span className="text-slate-700 font-mono truncate block">{detailItem.mahasiswa?.email || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">Instansi Tujuan</span>
                                        <strong className="text-slate-800">{detailItem.instansi?.nama || '-'}</strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">Dosen Wali / Pembimbing</span>
                                        <strong className="text-slate-800">
                                            {detailItem.dosen_pembimbing?.name || detailItem.mahasiswa?.dosen_wali?.name || 'Belum Diplot'}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* Berkas Prasyarat yang Diunggah */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-blue-700" /> Berkas Prasyarat (Transkrip & Dokumen)
                                </h4>
                                {detailItem.dokumen_pendaftarans && detailItem.dokumen_pendaftarans.length > 0 ? (
                                    <div className="space-y-2">
                                        {detailItem.dokumen_pendaftarans.map(doc => (
                                            <div
                                                key={doc.id}
                                                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition"
                                            >
                                                <div className="flex items-center gap-2.5 overflow-hidden">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-xs font-bold text-slate-800 truncate">{doc.nama_file}</p>
                                                        <span className="text-[11px] text-slate-400 uppercase font-semibold">
                                                            {doc.jenis} &bull; {(doc.ukuran / 1024 / 1024).toFixed(2)} MB
                                                        </span>
                                                    </div>
                                                </div>
                                                <a
                                                    href={`/storage/${doc.path}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 text-xs font-semibold transition shrink-0"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> Buka Berkas
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs">
                                        Mahasiswa belum mengunggah berkas transkrip nilai PDF.
                                    </div>
                                )}
                            </div>

                            {/* Form Edit Data Akademik & Keputusan TU */}
                            <div className="border-t border-slate-200 pt-4 space-y-4">
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <Edit3 className="w-3.5 h-3.5 text-blue-700" /> Verifikasi & Penyesuaian Nilai
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700">Total SKS Mahasiswa</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="200"
                                            value={editForm.total_sks}
                                            onChange={e => setEditForm({ ...editForm, total_sks: e.target.value })}
                                            placeholder="Contoh: 120"
                                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700">IPK Mahasiswa</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="4"
                                            value={editForm.ipk}
                                            onChange={e => setEditForm({ ...editForm, ipk: e.target.value })}
                                            placeholder="Contoh: 3.36"
                                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Keputusan Status Verifikasi</label>
                                    <select
                                        value={editForm.status}
                                        onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none bg-white font-medium"
                                    >
                                        <option value="disetujui_tu">Disetujui Admin Akademik/Prodi (disetujui_tu)</option>
                                        <option value="diajukan">Menunggu Verifikasi (diajukan)</option>
                                        <option value="perlu_perbaikan">Perlu Perbaikan / Revisi (perlu_perbaikan)</option>
                                        <option value="ditolak">Ditolak (ditolak)</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Catatan Khusus Verifikator TU</label>
                                    <textarea
                                        rows={3}
                                        value={editForm.catatan_tu}
                                        onChange={e => setEditForm({ ...editForm, catatan_tu: e.target.value })}
                                        placeholder="Tuliskan catatan verifikasi atau alasan perbaikan berkas..."
                                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => { setIsEditModalOpen(false); setDetailItem(null); }}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingEdit}
                                    className="px-5 py-2 bg-[#00288e] hover:bg-[#002070] text-white rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
                                >
                                    {processingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;
