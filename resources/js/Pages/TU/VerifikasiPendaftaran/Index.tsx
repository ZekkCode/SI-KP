import TULayout from '@/Layouts/TULayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Check, X, Eye } from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

interface Mahasiswa {
    id: number;
    name: string;
    nim: string;
    program_studi: string;
    ipk: string;
    total_sks: number;
}

interface Instansi {
    id: number;
    nama: string;
}

interface Pendaftaran {
    id: number;
    mahasiswa: Mahasiswa;
    instansi: Instansi;
    status: string;
}

interface Props {
    pendaftarans: Pendaftaran[];
}

export default function Index({ pendaftarans }: Props) {
    const { post, processing } = useForm();
    const [rejectCatatan, setRejectCatatan] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const approve = (id: number) => {
        router.post(`/tu/verifikasi-pendaftaran/${id}/approve`, {}, {
            preserveScroll: true,
            onError: (errors) => {
                console.error("Error dari backend:", errors);
                alert("Gagal menyetujui, cek console!");
            }
        });
    };

    const reject = (id: number) => {
        if (!rejectCatatan) {
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

    return (
        <div className="animate-in fade-in duration-300">
            <Head title="Verifikasi Pendaftaran KP" />
            
            <PageHeader title="Verifikasi Pengajuan Kerja Praktik" description="Daftar antrean mahasiswa yang mengajukan pendaftaran Kerja Praktik." />

            <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <ModernTable className="border-0 shadow-none">
                        <ModernTableHeader>
                            <ModernTableTh className="w-[5%] text-center">No</ModernTableTh>
                            <ModernTableTh className="w-[25%]">Nama Lengkap</ModernTableTh>
                            <ModernTableTh className="w-[15%]">NIM</ModernTableTh>
                            <ModernTableTh className="w-[15%]">IPK / SKS</ModernTableTh>
                            <ModernTableTh className="w-[20%]">Instansi Tujuan</ModernTableTh>
                            <ModernTableTh className="w-[20%] text-center">Aksi</ModernTableTh>
                        </ModernTableHeader>
                        <ModernTableBody>
                            {pendaftarans.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 px-6 text-center text-gray-500 italic text-sm">
                                        Tidak ada pengajuan yang menunggu verifikasi.
                                    </td>
                                </tr>
                            ) : (
                                pendaftarans.map((p, index) => (
                                    <tr key={p.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                                        <ModernTableTd className="text-center">{index + 1}</ModernTableTd>
                                        <ModernTableTd>
                                            <span className="font-medium text-on-surface">{p.mahasiswa?.name ?? 'Nama Tidak Ditemukan'}</span>
                                        </ModernTableTd>
                                        <ModernTableTd>{p.mahasiswa?.nim ?? '-'}</ModernTableTd>
                                        <ModernTableTd>
                                            {p.mahasiswa?.ipk ?? '-'} / {p.mahasiswa?.total_sks ?? '-'} SKS
                                        </ModernTableTd>
                                        <ModernTableTd>{p.instansi?.nama ?? '-'}</ModernTableTd>
                                        <ModernTableTd>
                                            <div className="flex items-center justify-center gap-2">
                                                {p.status === 'plotting_dosen' || p.status === 'aktif' || p.status === 'selesai' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                                        Disetujui
                                                    </span>
                                                ) : p.status === 'perlu_perbaikan' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                                        Perlu Perbaikan
                                                    </span>
                                                ) : (
                                                    <>
                                                        <button 
                                                            onClick={() => approve(p.id)}
                                                            disabled={processing}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all active:scale-95 font-medium text-xs disabled:opacity-50"
                                                            title="Setujui"
                                                        >
                                                            <Check size={16} /> Setujui
                                                        </button>
                                                        <button 
                                                            onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-error/10 text-error hover:bg-error hover:text-white rounded-lg transition-all active:scale-95 font-medium text-xs disabled:opacity-50"
                                                            title="Tolak / Kembalikan"
                                                        >
                                                            <X size={16} /> Tolak
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </ModernTableTd>
                                    </tr>
                                ))
                            )}
                        </ModernTableBody>
                    </ModernTable>
                </div>
            </div>

            {/* Reject Modal / Inline form for selected row */}
            {selectedId && (
                <div className="mt-6 p-6 bg-error/5 border border-error/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <h3 className="text-lg font-semibold text-error mb-2">Penolakan / Revisi Pengajuan</h3>
                    <p className="text-sm text-on-surface-variant mb-4">Berikan catatan perbaikan agar mahasiswa dapat memperbaiki berkasnya.</p>
                    
                    <textarea 
                        className="w-full border border-error/30 rounded-lg p-3 text-sm focus:border-error focus:ring-1 focus:ring-error outline-none mb-4 bg-white" 
                        placeholder="Contoh: SKS kurang dari 100, transkrip nilai tidak terbaca, dll."
                        rows={3}
                        value={rejectCatatan}
                        onChange={e => setRejectCatatan(e.target.value)}
                    ></textarea>
                    
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => { setSelectedId(null); setRejectCatatan(''); }}
                            className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-sm font-medium transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={() => reject(selectedId)}
                            className="px-4 py-2 bg-error text-white hover:bg-error/90 rounded-lg text-sm font-bold transition-colors"
                        >
                            Kirim Catatan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;
