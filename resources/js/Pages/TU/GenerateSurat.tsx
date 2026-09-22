import TULayout from '@/Layouts/TULayout';
import { Eye, ZoomIn, ZoomOut, CheckCircle, Info, BadgeCheck, Download, Undo2, FileIcon, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';

interface StudentData {
    id: number;
    mahasiswa: {
        name: string;
        nim: string;
        prodi: string;
        semester: string;
        sks: string;
        ipk: string;
    };
    perusahaan: string;
    alamat: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    periode: string;
    status: string;
    catatan_tu: string | null;
    surat_pengantar: {
        id: number;
        nomor_surat: string;
        tanggal_terbit: string;
        file_scan: string | null;
        status: string;
    } | null;
    docs: Array<{
        name: string;
        date: string;
        size: string;
        path: string;
    }>;
}

interface Props {
    pengajuan: StudentData[];
    setuju: StudentData[];
    ditolak: StudentData[];
    selectedStudent: StudentData | null;
    selectedId: string | null;
    flash: {
        success?: string;
        error?: string;
    };
}

export default function GenerateSurat({ pengajuan, setuju, ditolak, selectedStudent, selectedId, flash }: Props) {
    const [activeTab, setActiveTab] = useState<'pengajuan' | 'setuju' | 'ditolak'>('pengajuan');
    const [step, setStep] = useState<'verifikasi' | 'pratinjau'>('verifikasi');
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);

    const approveForm = useForm({
        nomor_surat: selectedStudent?.surat_pengantar?.nomor_surat || '',
    });

    const rejectForm = useForm({
        catatan_tu: '',
    });

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent) return;
        approveForm.post(`/tu/generate-surat/${selectedStudent.id}/approve`, {
            onSuccess: () => {
                setStep('verifikasi');
            }
        });
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent) return;
        rejectForm.post(`/tu/generate-surat/${selectedStudent.id}/reject`, {
            onSuccess: () => {
                rejectForm.reset();
                setShowFeedback(false);
            }
        });
    };

    // If no student is selected, render the categorized lists
    if (!selectedStudent) {
        return (
            <div className="space-y-6">
                <Head title="Daftar Pengajuan Surat" />
                
                <div>
                    <h2 className="text-3xl font-display font-semibold text-on-surface">Proses Surat Pengantar</h2>
                    <p className="text-on-surface-variant mt-1">Kelola dan verifikasi pengajuan surat pengantar mahasiswa.</p>
                </div>

                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="font-bold">Berhasil!</p>
                            <p className="text-sm">{flash.success}</p>
                        </div>
                    </div>
                )}

                {/* Tab selectors */}
                <div className="flex border-b border-outline-variant">
                    <button
                        onClick={() => setActiveTab('pengajuan')}
                        className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
                            activeTab === 'pengajuan'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-secondary hover:text-primary'
                        }`}
                    >
                        Pengajuan ({pengajuan.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('setuju')}
                        className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
                            activeTab === 'setuju'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-secondary hover:text-primary'
                        }`}
                    >
                        Setuju ({setuju.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('ditolak')}
                        className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
                            activeTab === 'ditolak'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-secondary hover:text-primary'
                        }`}
                    >
                        Ditolak ({ditolak.length})
                    </button>
                </div>

                {/* Tab content */}
                {activeTab === 'pengajuan' && (
                    <div>
                        {pengajuan.length > 0 ? (
                            <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-surface-container-low border-b border-outline-variant text-label-md text-secondary">
                                                <th className="px-6 py-4">Mahasiswa</th>
                                                <th className="px-6 py-4">Instansi/Perusahaan</th>
                                                <th className="px-6 py-4">Periode</th>
                                                <th className="px-6 py-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/50 text-body-md text-on-surface">
                                            {pengajuan.map((item) => (
                                                <tr key={item.id} className="hover:bg-surface-container-low/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-md bg-primary-container/20 text-primary flex items-center justify-center font-bold text-sm">
                                                                {item.mahasiswa.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-on-surface">{item.mahasiswa.name}</p>
                                                                <p className="text-xs font-mono text-secondary mt-0.5">NIM: {item.mahasiswa.nim} • {item.mahasiswa.prodi}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-medium text-sm text-on-surface">{item.perusahaan}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-secondary text-xs">
                                                        {item.periode}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <Link
                                                            href={`/tu/generate-surat?id=${item.id}`}
                                                            className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline text-xs"
                                                        >
                                                            Verifikasi
                                                            <ChevronRight className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white border border-outline-variant rounded-xl text-secondary">
                                <FileIcon className="w-12 h-12 mx-auto mb-2 text-secondary/50" />
                                <p className="text-sm">Tidak ada pengajuan surat pengantar yang menunggu verifikasi.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'setuju' && (
                    <div>
                        {setuju.length > 0 ? (
                            <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-surface-container-low border-b border-outline-variant text-label-md text-secondary">
                                                <th className="px-6 py-4">Mahasiswa</th>
                                                <th className="px-6 py-4">Instansi/Perusahaan</th>
                                                <th className="px-6 py-4">Nomor Surat</th>
                                                <th className="px-6 py-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/50 text-body-md text-on-surface">
                                            {setuju.map((item) => (
                                                <tr key={item.id} className="hover:bg-surface-container-low/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-md bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                                                                {item.mahasiswa.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-on-surface">{item.mahasiswa.name}</p>
                                                                <p className="text-xs font-mono text-secondary mt-0.5">NIM: {item.mahasiswa.nim} • {item.mahasiswa.prodi}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-medium text-sm text-on-surface">{item.perusahaan}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-secondary text-xs">
                                                        {item.surat_pengantar?.nomor_surat ?? '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <Link
                                                            href={`/tu/generate-surat?id=${item.id}`}
                                                            className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline text-xs"
                                                        >
                                                            Detail Surat
                                                            <ChevronRight className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white border border-outline-variant rounded-xl text-secondary">
                                <FileIcon className="w-12 h-12 mx-auto mb-2 text-secondary/50" />
                                <p className="text-sm">Belum ada surat pengantar yang disetujui/diterbitkan.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'ditolak' && (
                    <div>
                        {ditolak.length > 0 ? (
                            <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-surface-container-low border-b border-outline-variant text-label-md text-secondary">
                                                <th className="px-6 py-4">Mahasiswa</th>
                                                <th className="px-6 py-4">Instansi/Perusahaan</th>
                                                <th className="px-6 py-4">Alasan Pengembalian</th>
                                                <th className="px-6 py-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/50 text-body-md text-on-surface">
                                            {ditolak.map((item) => (
                                                <tr key={item.id} className="hover:bg-surface-container-low/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-md bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
                                                                {item.mahasiswa.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-on-surface">{item.mahasiswa.name}</p>
                                                                <p className="text-xs font-mono text-secondary mt-0.5">NIM: {item.mahasiswa.nim} • {item.mahasiswa.prodi}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-medium text-sm text-on-surface">{item.perusahaan}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-secondary text-xs truncate max-w-xs" title={item.catatan_tu || ''}>
                                                        {item.catatan_tu}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <Link
                                                            href={`/tu/generate-surat?id=${item.id}`}
                                                            className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline text-xs"
                                                        >
                                                            Tinjau Kembali
                                                            <ChevronRight className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white border border-outline-variant rounded-xl text-secondary">
                                <FileIcon className="w-12 h-12 mx-auto mb-2 text-secondary/50" />
                                <p className="text-sm">Tidak ada pengajuan surat pengantar yang ditolak/dikembalikan.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Detail view when a student is selected
    return (
        <div className="space-y-6">
            <Head title={`Detail Pengajuan - ${selectedStudent.mahasiswa.name}`} />

            <div className="flex items-center gap-4">
                <Link
                    href="/tu/generate-surat"
                    className="p-2.5 rounded-lg border border-outline-variant bg-white text-secondary hover:bg-surface-container-low transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-display font-bold text-on-surface">Detail Pengajuan Surat Pengantar</h2>
                    <p className="text-secondary text-sm">Tinjau informasi permohonan surat pengantar mahasiswa.</p>
                </div>
            </div>

            {flash?.success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                        <p className="font-bold">Berhasil!</p>
                        <p className="text-sm">{flash.success}</p>
                    </div>
                </div>
            )}

            {selectedStudent.status === 'surat_terbit' && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl flex items-center gap-4">
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-lg">Surat Pengantar Telah Diterbitkan</h4>
                        <p className="text-sm">Nomor Surat: <strong>{selectedStudent.surat_pengantar?.nomor_surat}</strong> • Tanggal Terbit: {selectedStudent.surat_pengantar?.tanggal_terbit}</p>
                    </div>
                </div>
            )}

            {selectedStudent.status === 'perlu_perbaikan' && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl flex items-center gap-4">
                    <Undo2 className="w-8 h-8 text-red-600 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-lg">Pengajuan Dikembalikan (Perlu Perbaikan)</h4>
                        <p className="text-sm">Alasan Pengembalian: <strong>{selectedStudent.catatan_tu}</strong></p>
                    </div>
                </div>
            )}

            {step === 'verifikasi' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 space-y-6">
                        {/* Student Details Card */}
                        <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
                            <h2 className="text-xl font-display font-semibold text-on-surface mb-6 border-b border-surface-variant pb-3">Informasi Mahasiswa</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                <div>
                                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Nama Lengkap</label>
                                    <div className="text-base text-on-surface font-medium">{selectedStudent.mahasiswa.name}</div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-on-surface-variant mb-1">NIM</label>
                                    <div className="text-base text-on-surface font-medium">{selectedStudent.mahasiswa.nim}</div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Program Studi</label>
                                    <div className="text-base text-on-surface font-medium">{selectedStudent.mahasiswa.prodi}</div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Total SKS Lulus</label>
                                    <div className="text-base text-on-surface font-medium">{selectedStudent.mahasiswa.sks}</div>
                                </div>
                                <div className="md:col-span-2 mt-2">
                                    <label className="block text-xs font-medium text-on-surface-variant mb-2">Rencana Tempat KP</label>
                                    <div className="text-sm text-on-surface bg-surface-container-low p-4 rounded-lg border border-surface-variant">
                                        <strong className="block text-base mb-1">{selectedStudent.perusahaan}</strong>
                                        {selectedStudent.alamat.split('\n').map((line, i) => (
                                            <span key={i} className="block">{line}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Documents Card */}
                        <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
                            <h2 className="text-xl font-display font-semibold text-on-surface mb-6 border-b border-surface-variant pb-3">Dokumen Pendukung</h2>
                            {selectedStudent.docs.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedStudent.docs.map((doc, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedDocIndex(idx)}
                                            className={`flex items-center justify-between p-4 border rounded-lg hover:bg-surface-container-low transition-colors group cursor-pointer ${
                                                selectedDocIndex === idx ? 'border-primary bg-primary-container/5' : 'border-outline-variant'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-md bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                                                    <FileIcon size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-on-surface">{doc.name}</div>
                                                    <div className="text-xs text-on-surface-variant">Diunggah pada {doc.date} • {doc.size}</div>
                                                </div>
                                            </div>
                                            <button className="text-primary hover:bg-primary-container/20 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                <Eye size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-secondary text-sm mb-4">Tidak ada berkas/dokumen transkrip yang diunggah.</p>
                            )}
                            
                            <h2 className="text-xl font-display font-semibold text-on-surface mb-6 mt-8 border-b border-surface-variant pb-3">File Scan Surat Pengantar</h2>
                            {selectedStudent.surat_pengantar?.file_scan ? (
                                <div className="mt-2 border border-outline-variant rounded-lg overflow-hidden bg-surface-container-low p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-on-surface">Surat_Pengantar_Bertanda_Tangan.pdf</span>
                                        <a
                                            href={`/storage/${selectedStudent.surat_pengantar.file_scan}`}
                                            target="_blank"
                                            className="text-primary hover:underline text-xs font-bold flex items-center gap-1"
                                        >
                                            <Download className="w-4 h-4" /> Unduh Dokumen
                                        </a>
                                    </div>
                                    <iframe
                                        src={`/storage/${selectedStudent.surat_pengantar.file_scan}`}
                                        className="w-full h-[500px] border border-outline-variant rounded"
                                    />
                                </div>
                            ) : (
                                <p className="text-secondary text-sm">Tidak ada file scan yang diunggah.</p>
                            )}

                            {selectedDocIndex !== null && selectedStudent.docs[selectedDocIndex] && (
                                <div className="mt-6 border border-outline-variant rounded-lg overflow-hidden bg-surface-container-low p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-on-surface">{selectedStudent.docs[selectedDocIndex].name}</span>
                                        <a
                                            href={`/storage/${selectedStudent.docs[selectedDocIndex].path}`}
                                            target="_blank"
                                            className="text-primary hover:underline text-xs font-bold flex items-center gap-1"
                                        >
                                            <Download className="w-4 h-4" /> Unduh Dokumen
                                        </a>
                                    </div>
                                    <iframe
                                        src={`/storage/${selectedStudent.docs[selectedDocIndex].path}`}
                                        className="w-full h-[500px] border border-outline-variant rounded"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions Sidebar */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm sticky top-24">
                            <h2 className="text-xl font-display font-semibold text-on-surface mb-6 border-b border-surface-variant pb-3">Tindakan Verifikasi</h2>
                            
                            {selectedStudent.surat_pengantar?.status === 'menunggu_verifikasi' ? (
                                <div className="space-y-4">
                                    <button
                                        onClick={handleApprove}
                                        disabled={approveForm.processing}
                                        className="w-full bg-primary text-white hover:bg-primary/90 py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <CheckCircle size={20} />
                                        <span>Verifikasi File Scan</span>
                                    </button>
                                    <button
                                        onClick={() => setShowFeedback(!showFeedback)}
                                        className={`w-full border py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2
                                            ${showFeedback ? 'bg-surface-container border-outline-variant text-on-surface-variant' : 'border-secondary text-secondary hover:bg-surface-container-low'}
                                        `}
                                    >
                                        <Undo2 size={20} />
                                        <span>Kembalikan untuk Perbaikan</span>
                                    </button>
                                </div>
                            ) : (
                                <p className="text-secondary text-sm">Status verifikasi saat ini: <strong>{selectedStudent.surat_pengantar?.status?.replace(/_/g, ' ').toUpperCase() || '-'}</strong>. Tidak ada tindakan verifikasi yang tertunda.</p>
                            )}

                            {showFeedback && (
                                <form onSubmit={handleReject} className="mt-6 pt-6 border-t border-surface-variant animate-in fade-in slide-in-from-top-2 duration-200">
                                    <label className="block text-sm font-semibold text-on-surface mb-2">Catatan Perbaikan <span className="text-error">*</span></label>
                                    <textarea
                                        className="w-full border border-outline-variant rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant"
                                        placeholder="Tuliskan alasan pengembalian berkas secara spesifik..."
                                        rows={4}
                                        value={rejectForm.data.catatan_tu}
                                        onChange={(e) => rejectForm.setData('catatan_tu', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    {rejectForm.errors.catatan_tu && <p className="text-error text-xs mt-1">{rejectForm.errors.catatan_tu}</p>}
                                    
                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowFeedback(false)}
                                            className="px-4 py-2 text-secondary hover:bg-surface-container-low rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={rejectForm.processing}
                                            className="px-4 py-2 bg-error text-white hover:bg-error/90 rounded-lg text-sm font-bold transition-colors shadow-sm"
                                        >
                                            {rejectForm.processing ? 'Mengirim...' : 'Kirim Catatan'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}

GenerateSurat.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;
