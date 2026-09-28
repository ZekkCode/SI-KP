import { FormEvent, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    XCircle,
    Building2,
    UserCheck,
    Calendar,
    GraduationCap,
    FileText,
    Mail,
    Phone,
    User,
    AlertCircle,
    Info,
    ArrowRight,
    Lock,
    ExternalLink,
} from 'lucide-react';

interface Props {
    token: string;
    surat: {
        id: number;
        nomor_surat: string;
        tanggal_terbit: string | null;
        confirmation_status: 'pending' | 'accepted' | 'rejected';
        confirmed_at: string | null;
        pl_nama: string | null;
        pl_email: string | null;
        pl_telepon: string | null;
        catatan_instansi: string | null;
    };
    instansi: {
        nama: string;
        alamat: string;
    };
    mahasiswa: {
        nama: string;
        nim: string;
        prodi: string;
        angkatan: string | number;
        dosen_pembimbing: string;
    };
    periode: {
        mulai: string | null;
        selesai: string | null;
    };
}

export default function KonfirmasiInstansi({ token, surat, instansi, mahasiswa, periode }: Props) {
    const { flash } = usePage().props as any;

    const [keputusan, setKeputusan] = useState<'terima' | 'tolak'>('terima');

    const { data, setData, post, processing, errors, reset } = useForm({
        keputusan: 'terima' as 'terima' | 'tolak',
        pl_nama: '',
        pl_email: '',
        pl_telepon: '',
        catatan: '',
    });

    const isAlreadyConfirmed = surat.confirmation_status !== 'pending';

    const handleKeputusanChange = (value: 'terima' | 'tolak') => {
        setKeputusan(value);
        setData('keputusan', value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/konfirmasi/${token}`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased py-8 px-4 sm:px-6 lg:px-8 selection:bg-teal-500 selection:text-white">
            <Head title="Konfirmasi Penerimaan Kerja Praktik - SI-KP UTM" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Kop Resmi */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-200/80 pb-6 text-center sm:text-left">
                        <img
                            src="/assets/img/utm.png"
                            alt="Logo Universitas Trunojoyo Madura"
                            className="w-20 h-20 object-contain shrink-0"
                            onError={(e) => {
                                // Fallback jika logo belum ada
                                (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                        />
                        <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                                Universitas Trunojoyo Madura • Fakultas Teknik
                            </p>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                Portal Konfirmasi Penerimaan Kerja Praktik
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Program Studi Teknik Informatika • Konfirmasi Resmi Instansi / Perusahaan Mitra
                            </p>
                        </div>
                    </div>

                    {/* Flash Alerts */}
                    {flash?.success && (
                        <div className="mt-6 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                            <div className="text-sm font-medium">{flash.success}</div>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <div className="text-sm font-medium">{flash.error}</div>
                        </div>
                    )}

                    {flash?.warning && (
                        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3">
                            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-sm font-medium">{flash.warning}</div>
                        </div>
                    )}

                    {/* Informasi Permohonan Surat */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 space-y-2">
                            <div className="flex items-center gap-2 font-semibold text-slate-900">
                                <FileText className="w-4 h-4 text-teal-600" />
                                <span>Rincian Surat Pengantar</span>
                            </div>
                            <div className="space-y-1 text-xs sm:text-sm text-slate-600">
                                <div><span className="text-slate-400">Nomor:</span> <span className="font-semibold text-slate-800 font-mono">{surat.nomor_surat}</span></div>
                                <div><span className="text-slate-400">Tanggal Terbit:</span> <span className="text-slate-700">{surat.tanggal_terbit || 'Resmi'}</span></div>
                                <div><span className="text-slate-400">Tujuan Instansi:</span> <span className="font-semibold text-slate-800">{instansi.nama}</span></div>
                            </div>
                        </div>

                        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 space-y-2">
                            <div className="flex items-center gap-2 font-semibold text-slate-900">
                                <GraduationCap className="w-4 h-4 text-blue-600" />
                                <span>Data Mahasiswa Pemohon</span>
                            </div>
                            <div className="space-y-1 text-xs sm:text-sm text-slate-600">
                                <div><span className="text-slate-400">Nama:</span> <span className="font-semibold text-slate-800">{mahasiswa.nama}</span></div>
                                <div><span className="text-slate-400">NIM:</span> <span className="font-semibold text-slate-800 font-mono">{mahasiswa.nim}</span></div>
                                <div><span className="text-slate-400">Program Studi:</span> <span className="text-slate-700">{mahasiswa.prodi}</span></div>
                                <div><span className="text-slate-400">Rencana Periode:</span> <span className="font-medium text-slate-800">{periode.mulai || '-'} s.d {periode.selesai || '-'}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* State: SUDAH DIKONFIRMASI */}
                {isAlreadyConfirmed ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                        {surat.confirmation_status === 'accepted' ? (
                            <div className="text-center py-6 space-y-4">
                                <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-600">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                        Permohonan Telah Diterima
                                    </h2>
                                    <p className="text-sm text-slate-500 max-w-lg mx-auto">
                                        Konfirmasi penerimaan kerja praktik untuk mahasiswa ini telah dicatat pada sistem pada {surat.confirmed_at}.
                                    </p>
                                </div>

                                <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-sm space-y-2">
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Data Pembimbing Lapangan
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Nama:</span>
                                        <span className="font-semibold text-slate-800">{surat.pl_nama || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Email:</span>
                                        <span className="font-semibold text-slate-800">{surat.pl_email || '-'}</span>
                                    </div>
                                    {surat.pl_telepon && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Kontak:</span>
                                            <span className="font-semibold text-slate-800">{surat.pl_telepon}</span>
                                        </div>
                                    )}
                                    {surat.catatan_instansi && (
                                        <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                                            <span className="font-semibold text-slate-700">Catatan:</span> {surat.catatan_instansi}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <a
                                        href="/login?role=instansi"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors shadow-sm"
                                    >
                                        <span>Masuk ke Portal Pembimbing Lapangan</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 space-y-4">
                                <div className="inline-flex p-4 rounded-full bg-rose-100 text-rose-600">
                                    <XCircle className="w-12 h-12" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                        Permohonan Belum Diterima / Ditolak
                                    </h2>
                                    <p className="text-sm text-slate-500 max-w-lg mx-auto">
                                        Konfirmasi penolakan untuk mahasiswa ini telah tersimpan pada {surat.confirmed_at}.
                                    </p>
                                </div>

                                {surat.catatan_instansi && (
                                    <div className="max-w-md mx-auto bg-rose-50/60 border border-rose-200 rounded-xl p-4 text-left text-sm">
                                        <span className="font-semibold text-rose-900">Alasan Penolakan:</span>
                                        <p className="text-rose-700 mt-1">{surat.catatan_instansi}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    /* State: FORM KONFIRMASI */
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-lg font-bold text-slate-900">
                                Formulir Pernyataan Penerimaan Instansi
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Silakan nyatakan kesediaan instansi menerima mahasiswa bersangkutan untuk melaksanakan Kerja Praktik.
                            </p>
                        </div>

                        {/* Pilihan Terima / Tolak */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleKeputusanChange('terima')}
                                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                                    keputusan === 'terima'
                                        ? 'border-teal-600 bg-teal-50/60 shadow-xs'
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                }`}
                            >
                                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                                    keputusan === 'terima' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">Terima Mahasiswa</div>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Instansi bersedia memfasilitasi pelaksanaan kerja praktik mahasiswa.
                                    </p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleKeputusanChange('tolak')}
                                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                                    keputusan === 'tolak'
                                        ? 'border-rose-600 bg-rose-50/60 shadow-xs'
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                }`}
                            >
                                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                                    keputusan === 'tolak' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    <XCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">Belum Dapat Menerima / Tolak</div>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Instansi belum memiliki kuota atau bidang belum sesuai.
                                    </p>
                                </div>
                            </button>
                        </div>

                        {/* Form jika Diterima */}
                        {keputusan === 'terima' ? (
                            <div className="space-y-5 pt-4 border-t border-slate-100">
                                <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4 text-xs sm:text-sm text-teal-800 flex items-start gap-3">
                                    <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Penerbitan Akun Pembimbing Lapangan Otomatis</p>
                                        <p className="mt-0.5 text-teal-700">
                                            Sistem akan membuatkan akun Pembimbing Lapangan baru di portal SI-KP UTM dan mengirimkan tautan serta kata sandi sementara ke alamat email yang Anda cantumkan di bawah ini.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Nama Lengkap Pembimbing Lapangan <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                value={data.pl_nama}
                                                onChange={(e) => setData('pl_nama', e.target.value)}
                                                placeholder="Contoh: Budi Santoso, S.Kom."
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all ${
                                                    errors.pl_nama ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 bg-white'
                                                }`}
                                                required
                                            />
                                        </div>
                                        {errors.pl_nama && (
                                            <p className="text-xs text-rose-600">{errors.pl_nama}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Email Resmi Pembimbing Lapangan <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="email"
                                                value={data.pl_email}
                                                onChange={(e) => setData('pl_email', e.target.value)}
                                                placeholder="pembimbing@instansi.com"
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all ${
                                                    errors.pl_email ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 bg-white'
                                                }`}
                                                required
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">Digunakan untuk login dan menerima kredensial akun.</p>
                                        {errors.pl_email && (
                                            <p className="text-xs text-rose-600">{errors.pl_email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                            No. WhatsApp / Telepon Aktif
                                        </label>
                                        <div className="relative">
                                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="tel"
                                                value={data.pl_telepon}
                                                onChange={(e) => setData('pl_telepon', e.target.value)}
                                                placeholder="Contoh: 081234567890"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">Memudahkan koordinasi dosen pembimbing & mahasiswa.</p>
                                        {errors.pl_telepon && (
                                            <p className="text-xs text-rose-600">{errors.pl_telepon}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5 sm:col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Catatan Tambahan untuk Mahasiswa / Kampus (Opsional)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={data.catatan}
                                            onChange={(e) => setData('catatan', e.target.value)}
                                            placeholder="Contoh: Mahasiswa diharapkan hadir pengarahan hari pertama pukul 08:00 WIB mengenakan pakaian rapi berkerah."
                                            className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                                        />
                                        {errors.catatan && (
                                            <p className="text-xs text-rose-600">{errors.catatan}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Form jika Ditolak */
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Alasan Penolakan Permohonan <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={data.catatan}
                                        onChange={(e) => setData('catatan', e.target.value)}
                                        placeholder="Contoh: Kuota penerimaan mahasiswa magang / KP untuk periode tersebut telah penuh, atau perusahaan sedang tidak menerima peserta luar."
                                        className={`w-full p-3 rounded-xl border text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all ${
                                            errors.catatan ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 bg-white'
                                        }`}
                                        required
                                    />
                                    <p className="text-xs text-slate-500">
                                        Keterangan ini akan diinformasikan kepada mahasiswa untuk membantu pengajuan ke instansi alternatif.
                                    </p>
                                    {errors.catatan && (
                                        <p className="text-xs text-rose-600">{errors.catatan}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-xs text-slate-500 flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-slate-400" />
                                <span>Tautan terenkripsi aman dan hanya dapat dikonfirmasi satu kali.</span>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-sm flex items-center justify-center gap-2 ${
                                    keputusan === 'terima'
                                        ? 'bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300'
                                        : 'bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300'
                                }`}
                            >
                                {processing ? (
                                    <span>Memproses...</span>
                                ) : (
                                    <>
                                        <span>
                                            {keputusan === 'terima' ? 'Kirim Konfirmasi Penerimaan' : 'Kirim Konfirmasi Penolakan'}
                                        </span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Footer Informasi Resmi */}
                <div className="text-center text-xs text-slate-400 py-4 space-y-1">
                    <p>&copy; 2026 Program Studi Teknik Informatika, Fakultas Teknik, Universitas Trunojoyo Madura.</p>
                    <p>Jl. Raya Telang, PO.Box 2 Kamal, Bangkalan, Madura • SI-KP Versi 2.0</p>
                </div>
            </div>
        </div>
    );
}
