import TULayout from '@/Layouts/TULayout';
import { router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Undo2, Building2, User, FileText } from 'lucide-react';
import { useState } from 'react';

interface Pendaftaran {
    id: number;
    status: string;
    mahasiswa: {
        name: string;
        nim?: string;
        email?: string;
    } | null;
    instansi: {
        nama: string;
        alamat?: string;
    } | null;
    surat_pengantar: {
        nomor_surat?: string;
        tanggal_surat?: string;
    } | null;
}

interface Props {
    pendaftaran: Pendaftaran;
}

export default function Show({ pendaftaran }: Props) {
    const [showRevisi, setShowRevisi] = useState(false);
    const [catatan, setCatatan] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleApprove = () => {
        if (!confirm('Yakin ingin menyetujui surat balasan ini?')) return;
        setProcessing(true);
        router.post(`/tu/surat-balasan/${pendaftaran.id}/approve`, {}, {
            onFinish: () => setProcessing(false),
        });
    };

    const handleRevisi = () => {
        if (!catatan.trim()) return;
        setProcessing(true);
        router.post(
            `/tu/surat-balasan/${pendaftaran.id}/revisi`,
            { catatan_tu: catatan },
            { onFinish: () => setProcessing(false) }
        );
    };

    return (
        <div className="animate-in fade-in duration-300 max-w-3xl mx-auto">
            {/* Back */}
            <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Kembali
            </button>

            <h1 className="text-3xl font-display font-semibold text-on-surface mb-6">
                Detail Surat Balasan
            </h1>

            {/* Info Card */}
            <div className="bg-surface-container-low rounded-2xl border border-outline-variant p-6 space-y-5 mb-6">
                <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                        <p className="text-sm text-on-surface-variant">Mahasiswa</p>
                        <p className="font-medium text-on-surface">
                            {pendaftaran.mahasiswa?.name ?? '-'}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                        <p className="text-sm text-on-surface-variant">Instansi</p>
                        <p className="font-medium text-on-surface">
                            {pendaftaran.instansi?.nama ?? '-'}
                        </p>
                        {pendaftaran.instansi?.alamat && (
                            <p className="text-sm text-on-surface-variant mt-0.5">
                                {pendaftaran.instansi.alamat}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                        <p className="text-sm text-on-surface-variant">
                            Surat Pengantar
                        </p>
                        <p className="font-medium text-on-surface">
                            {pendaftaran.surat_pengantar?.nomor_surat ?? 'Belum ada'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-surface-container-low rounded-2xl border border-outline-variant p-6 space-y-4">
                <h2 className="text-lg font-semibold text-on-surface mb-2">
                    Tindakan
                </h2>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleApprove}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Setujui
                    </button>

                    <button
                        onClick={() => setShowRevisi(!showRevisi)}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-error-container text-on-error-container font-medium hover:bg-error-container/80 transition-colors disabled:opacity-50"
                    >
                        <Undo2 className="w-4 h-4" />
                        Minta Revisi
                    </button>
                </div>

                {showRevisi && (
                    <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                        <label className="block text-sm font-medium text-on-surface">
                            Catatan Revisi
                        </label>
                        <textarea
                            rows={4}
                            className="w-full rounded-xl border border-outline-variant bg-surface p-3 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                            placeholder="Tuliskan catatan revisi untuk mahasiswa..."
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                        />
                        <button
                            onClick={handleRevisi}
                            disabled={processing || !catatan.trim()}
                            className="px-5 py-2.5 rounded-xl bg-error text-on-error font-medium hover:bg-error/90 transition-colors disabled:opacity-50"
                        >
                            Kirim Revisi
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

Show.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;
