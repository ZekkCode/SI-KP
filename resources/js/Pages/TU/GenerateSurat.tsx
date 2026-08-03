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
                approveForm.reset();
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
                            <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
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
                                                            <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold">
                                                                {item.mahasiswa.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold">{item.mahasiswa.name}</p>
                                                                <p className="text-label-sm text-secondary">NIM: {item.mahasiswa.nim} • {item.mahasiswa.prodi}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-medium text-on-surface">{item.perusahaan}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-secondary text-sm">
                                                        {item.periode}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <Link
                                                            href={`/tu/generate-surat?id=${item.id}`}
                                                            className="inline-flex items-center gap-1.5 text-primary font-bold hover:underline text-sm"
                                                        >
                                                            Verifikasi
                                                            <ChevronRight className="w-4 h-4" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white border border-outline-variant rounded-2xl text-secondary">
                                <FileIcon className="w-12 h-12 mx-auto mb-2 text-secondary/50" />
                                <p>Tidak ada pengajuan surat pengantar yang menunggu verifikasi.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'setuju' && (
                    <div>
                        {setuju.length > 0 ? (
                            <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
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
                                                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                                                                {item.mahasiswa.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold">{item.mahasiswa.name}</p>
                                                                <p className="text-label-sm text-secondary">NIM: {item.mahasiswa.nim} • {item.mahasiswa.prodi}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-medium text-on-surface">{item.perusahaan}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-secondary text-sm">
                                                        {item.surat_pengantar?.nomor_surat ?? '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <Link
                                                            href={`/tu/generate-surat?id=${item.id}`}
                                                            className="inline-flex items-center gap-1.5 text-primary font-bold hover:underline text-sm"
                                                        >
                                                            Detail Surat
                                                            <ChevronRight className="w-4 h-4" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white border border-outline-variant rounded-2xl text-secondary">
                                <FileIcon className="w-12 h-12 mx-auto mb-2 text-secondary/50" />
                                <p>Belum ada surat pengantar yang disetujui/diterbitkan.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'ditolak' && (
                    <div>
                        {ditolak.length > 0 ? (
                            <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
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
                                                            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold">
                                                                {item.mahasiswa.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold">{item.mahasiswa.name}</p>
                                                                <p className="text-label-sm text-secondary">NIM: {item.mahasiswa.nim} • {item.mahasiswa.prodi}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-medium text-on-surface">{item.perusahaan}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-secondary text-sm truncate max-w-xs" title={item.catatan_tu || ''}>
                                                        {item.catatan_tu}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <Link
                                                            href={`/tu/generate-surat?id=${item.id}`}
                                                            className="inline-flex items-center gap-1.5 text-primary font-bold hover:underline text-sm"
                                                        >
                                                            Tinjau Kembali
                                                            <ChevronRight className="w-4 h-4" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white border border-outline-variant rounded-2xl text-secondary">
                                <FileIcon className="w-12 h-12 mx-auto mb-2 text-secondary/50" />
                                <p>Tidak ada pengajuan surat pengantar yang ditolak/dikembalikan.</p>
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
                    className="p-2 rounded-full border border-outline-variant bg-white text-secondary hover:bg-surface-container-low transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-display font-bold text-on-surface">Detail Pengajuan Surat Pengantar</h2>
                    <p className="text-on-surface-variant text-sm">Tinjau informasi permohonan surat pengantar mahasiswa.</p>
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
                                                <div className="w-10 h-10 rounded bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                                                    <FileIcon size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-on-surface">{doc.name}</div>
                                                    <div className="text-xs text-on-surface-variant">Diunggah pada {doc.date} • {doc.size}</div>
                                                </div>
                                            </div>
                                            <button className="text-primary hover:bg-primary-container/20 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                                <Eye size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-secondary text-sm">Tidak ada berkas/dokumen transkrip yang diunggah.</p>
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
                            
                            {selectedStudent.status === 'verifikasi_tu' ? (
                                <div className="space-y-4">
                                    <button
                                        onClick={() => setStep('pratinjau')}
                                        className="w-full bg-primary text-white hover:bg-primary/90 py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <CheckCircle size={20} />
                                        <span>Verifikasi & Lanjut Pratinjau</span>
                                        <ArrowRight size={20} />
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
                                <p className="text-secondary text-sm">Status verifikasi saat ini: <strong>{selectedStudent.status.replace(/_/g, ' ').toUpperCase()}</strong>. Tidak ada tindakan verifikasi yang tertunda.</p>
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

            {step === 'pratinjau' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* PDF Draft Letter View */}
                    <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden flex flex-col h-[850px]">
                        <div className="bg-surface-container-highest px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                            <div className="flex items-center gap-2 text-on-surface">
                                <Eye className="text-primary" size={20} />
                                <span className="font-medium">Draf Surat Pengantar KP</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 rounded text-secondary hover:bg-surface-variant transition-colors">
                                    <ZoomOut size={18} />
                                </button>
                                <button className="p-2 rounded text-secondary hover:bg-surface-variant transition-colors">
                                    <ZoomIn size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-surface-variant/30 p-8 overflow-y-auto flex justify-center items-start">
                            <div className="bg-white w-full max-w-[650px] min-h-[900px] shadow-md p-12 flex flex-col text-sm text-on-surface">
                                <div className="flex items-center border-b-[3px] border-on-surface pb-6 mb-8">
                                    <div className="w-16 h-16 bg-surface-container flex items-center justify-center shrink-0">
                                        <img
                                            className="w-16 h-16 object-contain"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcYI-cxVibUaX-TsGqqDgu1W0ZAWpp6kbny_PUKWUTQ4IkhlzMU8YocEgbIjortS1a8dmcD6erxZ-uUuIybhKdrrnD_l0cYmKdOB6nBK7B6rCq6e649ycBlDE5EIaZFspiSArmk9WFDyJJYe6EINJi1E2z0H0zPSMMncdw0GdN6GqczG2iM-wfIUatYYqkSrtwhmP8H0fIZkaPOYkleUSN_kwv9TcmuBf5rMW4rgWhlwof4ttnj7rSf0dnIp_BJUE2iNlHJB4PBrw"
                                            alt="Logo"
                                        />
                                    </div>
                                    <div className="flex-1 text-center px-4">
                                        <h3 className="font-display font-bold uppercase tracking-wide text-xs">Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi</h3>
                                        <h2 className="text-base font-display font-extrabold uppercase mt-1">Universitas Teknologi Nasional</h2>
                                        <h4 className="font-display font-bold uppercase mt-1 text-xs">Fakultas Ilmu Komputer</h4>
                                        <p className="text-[10px] text-on-surface-variant mt-1">Jl. Pendidikan Raya No. 123, Kota Akademik, 45123</p>
                                        <p className="text-[10px] text-on-surface-variant">Telp: (021) 555-1234 | Email: dekanat@fik.utn.ac.id | Web: fik.utn.ac.id</p>
                                    </div>
                                </div>

                                <div className="flex justify-between mb-8">
                                    <div>
                                        <div className="flex gap-4"><span className="w-20">Nomor</span><span>: {approveForm.data.nomor_surat || '____________/UN.XX/AK.KP/2026'}</span></div>
                                        <div className="flex gap-4"><span className="w-20">Lampiran</span><span>: 1 (satu) berkas proposal</span></div>
                                        <div className="flex gap-4"><span className="w-20">Perihal</span><span>: Permohonan Kerja Praktik (KP)</span></div>
                                    </div>
                                    <div className="text-right">
                                        <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <p>Yth. Pimpinan HRD / Direktur Utama</p>
                                    <p className="font-bold">{selectedStudent.perusahaan}</p>
                                    {selectedStudent.alamat.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>

                                <div className="text-justify leading-relaxed flex-1 space-y-4">
                                    <p>Dengan hormat,</p>
                                    <p>Dalam rangka memenuhi persyaratan kurikulum akademik dan meningkatkan kompetensi praktis mahasiswa, bersama ini kami memohon kesediaan Bapak/Ibu untuk menerima mahasiswa kami melaksanakan program Kerja Praktik (KP) di instansi/perusahaan yang Bapak/Ibu pimpin.</p>
                                    <p>Adapun data mahasiswa tersebut adalah sebagai berikut:</p>
                                    <table className="w-full mt-4 mb-4 border-collapse">
                                        <tbody>
                                            <tr><td className="py-1 w-40">Nama Lengkap</td><td>: <strong>{selectedStudent.mahasiswa.name}</strong></td></tr>
                                            <tr><td className="py-1 w-40">NIM</td><td>: {selectedStudent.mahasiswa.nim}</td></tr>
                                            <tr><td className="py-1 w-40">Program Studi</td><td>: {selectedStudent.mahasiswa.prodi}</td></tr>
                                            <tr><td className="py-1 w-40">Semester</td><td>: {selectedStudent.mahasiswa.semester}</td></tr>
                                        </tbody>
                                    </table>
                                    <p>Kerja Praktik ini direncanakan akan dilaksanakan mulai tanggal <strong>{selectedStudent.tanggal_mulai}</strong> s.d <strong>{selectedStudent.tanggal_selesai}</strong>.</p>
                                    <p>Demikian surat permohonan ini kami sampaikan. Atas perhatian dan kerjasamanya yang baik, kami ucapkan terima kasih.</p>
                                </div>

                                <div className="flex justify-between items-end mt-12">
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 bg-white border border-outline-variant p-1 mb-2">
                                            <div
                                                className="w-full h-full bg-cover bg-center"
                                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGhxhznv1Fve27AmCZIFr5wrCClrL2q_cBUqlxiuaTb2Lp-8V1O3x46KoP47ZJwhZdlAiHeA2Fm-UMPE8vx5UEm5WH1W74Mx-S0z4dcTe0gk306ddJUzOCYvcFTX291_CmB93_5l23irdtkGFPTLh0lFSfCKFlJZ27z4yc4jgqRpGzYR26N6UP9hKAEmyPSwkMiUp1W79-ZX0oLoBvPzgq49-dRpO6LPp0CDFTwjoHk_OcqV3-s8yP0VlJ4GRt1jXSenx-BKKc1nI')" }}
                                            />
                                        </div>
                                        <span className="text-[8px] text-on-surface-variant text-center max-w-[100px]">Scan QR untuk validasi</span>
                                    </div>
                                    <div className="text-center w-60 text-xs">
                                        <p className="mb-12">Wakil Dekan Bidang Akademik,</p>
                                        <div className="border-b border-on-surface pb-0.5 mb-0.5">
                                            <p className="font-bold">Dr. Budi Santoso, M.Kom.</p>
                                        </div>
                                        <p>NIP. 19800101 200501 1 001</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Finalize Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <form onSubmit={handleApprove} className="bg-white rounded-xl shadow-sm border border-outline-variant p-6 relative overflow-hidden space-y-4">
                            <h3 className="text-xl font-display font-semibold text-on-surface">Tindakan Akhir</h3>
                            
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-2">Input Nomor Surat Resmi <span className="text-error">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Format: 1245/UN.XX/AK.KP/2026"
                                    className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                        approveForm.errors.nomor_surat ? 'border-error' : 'border-outline-variant focus:border-primary'
                                    }`}
                                    value={approveForm.data.nomor_surat}
                                    onChange={(e) => approveForm.setData('nomor_surat', e.target.value)}
                                    required
                                />
                                {approveForm.errors.nomor_surat && <p className="text-error text-xs mt-1">{approveForm.errors.nomor_surat}</p>}
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep('verifikasi')}
                                className="w-full bg-surface hover:bg-surface-container border border-outline-variant text-on-surface py-3 px-4 rounded-lg font-medium transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={18} />
                                Kembali
                            </button>

                            <button
                                type="submit"
                                disabled={approveForm.processing}
                                className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                {approveForm.processing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Menerbitkan...
                                    </>
                                ) : (
                                    <>
                                        <BadgeCheck size={20} />
                                        Terbitkan Surat Resmi
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

GenerateSurat.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;
