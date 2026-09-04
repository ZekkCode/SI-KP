import { FormEventHandler, useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { 
    Search, 
    CheckCircle2, 
    AlertCircle, 
    Clock, 
    ArrowRight, 
    ArrowLeft, 
    GraduationCap, 
    Mail, 
    BookOpen, 
    Calendar, 
    Loader2, 
    ShieldAlert, 
    Building2 
} from 'lucide-react';

interface StudentData {
    nim: string;
    nama: string;
    email: string;
    program_studi: string;
    angkatan: string;
}

export default function Register() {
    const [nimInput, setNimInput] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [checkError, setCheckError] = useState<string | null>(null);
    const [checkErrorType, setCheckErrorType] = useState<string | null>(null);
    const [studentData, setStudentData] = useState<StudentData | null>(null);
    const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fungsi cek NIM ke server
    const handleCheckNim = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const trimmedNim = nimInput.trim();
        if (!trimmedNim) {
            setCheckError('Silakan masukkan NIM Anda terlebih dahulu.');
            setCheckErrorType('validation');
            return;
        }

        setIsChecking(true);
        setCheckError(null);
        setCheckErrorType(null);
        setStudentData(null);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch(route('register.check-nim'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ nim: trimmedNim }),
            });

            const result = await res.json();

            if (res.ok && result.status === 'ready') {
                setStudentData(result.data);
            } else {
                setCheckError(result.message || 'Terjadi kesalahan saat memeriksa NIM.');
                setCheckErrorType(result.status || 'error');
            }
        } catch (error) {
            setCheckError('Gagal terhubung ke server. Silakan periksa koneksi Anda.');
            setCheckErrorType('network');
        } finally {
            setIsChecking(false);
        }
    };

    const handleReset = () => {
        setStudentData(null);
        setNimInput('');
        setCheckError(null);
        setCheckErrorType(null);
    };

    const submitApplication: FormEventHandler = (e) => {
        e.preventDefault();
        if (!studentData) return;

        setIsSubmitting(true);
        router.post(route('register'), {
            nim: studentData.nim,
        }, {
            onSuccess: () => {
                setIsSubmittedSuccess(true);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <>
            <Head title="Registrasi Akun Mahasiswa - SI-KP UTM" />
            <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-slate-950 font-sans text-slate-100">
                
                {/* Background Mesh */}
                <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-blue-600/25 to-cyan-500/5 blur-[140px] pointer-events-none" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-indigo-600/20 to-purple-500/5 blur-[140px] pointer-events-none" />
                <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />

                {/* Main Card Container */}
                <div className="w-full max-w-[540px] space-y-5 relative z-10">
                    
                    {/* Header Logo */}
                    <div className="text-center space-y-2.5">
                        <div className="flex justify-center">
                            <div className="bg-white p-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105">
                                <img src="/images/Logo UTM terbaru_berwarna (1).png" alt="Logo UTM" className="w-14 h-14 object-contain" />
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-blue-200 to-indigo-100 tracking-tight">
                                Registrasi Akun Mahasiswa
                            </h1>
                            <p className="text-xs text-blue-400 font-bold tracking-widest uppercase">
                                Sistem Informasi Kerja Praktik
                            </p>
                        </div>
                    </div>

                    {/* Registration Card */}
                    <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-2xl border border-slate-100 text-slate-800 relative">
                        
                        {/* VIEW A: SUCCESS STATE */}
                        {isSubmittedSuccess ? (
                            <div className="text-center space-y-5 py-4 animate-in fade-in zoom-in-95">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                                    <CheckCircle2 className="w-9 h-9" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-black text-slate-900">
                                        Permohonan Berhasil Diajukan!
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                                        Data permohonan akun atas nama <strong className="text-slate-800">{studentData?.nama}</strong> ({studentData?.nim}) telah dikirimkan ke <strong className="text-slate-800">Tata Usaha (TU)</strong> untuk diverifikasi.
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-800 text-left space-y-1">
                                    <p className="font-bold flex items-center gap-1.5">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                        Informasi Penting:
                                    </p>
                                    <p className="text-blue-700 leading-relaxed">
                                        Setelah disetujui TU, username (NIM) dan password sementara akan dikirimkan langsung ke email resmi Anda: <span className="font-semibold underline">{studentData?.email}</span>.
                                    </p>
                                </div>

                                <Link
                                    href="/login?role=mahasiswa"
                                    className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <span>Kembali ke Halaman Login</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            /* VIEW B: FORM STATE */
                            <div className="space-y-5">
                                <div className="space-y-1 border-b border-slate-100 pb-4">
                                    <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                        <span>Pencarian Data Master Mahasiswa</span>
                                    </h2>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                        Masukkan NIM Anda. Sistem akan mencari data resmi Anda pada Data Master Mahasiswa Teknik Informatika.
                                    </p>
                                </div>

                                {/* Step 1: Input NIM */}
                                <form onSubmit={handleCheckNim} className="space-y-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block" htmlFor="nim">
                                            Nomor Induk Mahasiswa (NIM)
                                        </label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1 group">
                                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                                <input
                                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal"
                                                    id="nim"
                                                    name="nim"
                                                    placeholder="Contoh: 220411100080"
                                                    type="text"
                                                    value={nimInput}
                                                    onChange={(e) => setNimInput(e.target.value)}
                                                    disabled={isChecking || studentData !== null}
                                                    autoFocus
                                                />
                                            </div>

                                            {!studentData ? (
                                                <button
                                                    type="submit"
                                                    disabled={isChecking || !nimInput.trim()}
                                                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                                >
                                                    {isChecking ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            <span>Mencari...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Search className="w-4 h-4" />
                                                            <span>Cek NIM</span>
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleReset}
                                                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                                                >
                                                    Ganti NIM
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>

                                {/* Alert Box for Errors */}
                                {checkError && (
                                    <div className={`p-4 rounded-2xl text-xs flex items-start gap-3 border ${
                                        checkErrorType === 'already_has_account'
                                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                                            : checkErrorType === 'pending_verification'
                                                ? 'bg-blue-50 border-blue-200 text-blue-900'
                                                : 'bg-red-50 border-red-200 text-red-900'
                                    }`}>
                                        {checkErrorType === 'pending_verification' ? (
                                            <Clock className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
                                        ) : checkErrorType === 'already_has_account' ? (
                                            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                                        )}
                                        <div className="space-y-1">
                                            <p className="font-bold">
                                                {checkErrorType === 'already_has_account'
                                                    ? 'Akun Sudah Terdaftar'
                                                    : checkErrorType === 'pending_verification'
                                                        ? 'Status Permohonan'
                                                        : 'Perhatian'}
                                            </p>
                                            <p className="leading-relaxed opacity-90">{checkError}</p>
                                            {checkErrorType === 'already_has_account' && (
                                                <Link href="/login?role=mahasiswa" className="inline-block font-bold text-blue-600 hover:underline mt-1">
                                                    Masuk ke Akun Anda →
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Display Fetched Data & Confirm Application */}
                                {studentData && (
                                    <form onSubmit={submitApplication} className="space-y-4 pt-1 animate-in fade-in duration-300">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Data Terverifikasi di Master
                                                </span>
                                                <span className="text-xs font-bold text-slate-500">Angkatan {studentData.angkatan}</span>
                                            </div>

                                            <div className="space-y-2 text-xs">
                                                <div>
                                                    <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Nama Lengkap</span>
                                                    <p className="font-bold text-slate-900 text-sm">{studentData.nama}</p>
                                                </div>

                                                <div>
                                                    <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Program Studi</span>
                                                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                                                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                                                        {studentData.program_studi}
                                                    </p>
                                                </div>

                                                <div>
                                                    <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Email Resmi Kampus</span>
                                                    <p className="font-bold text-slate-800 flex items-center gap-1.5 font-mono">
                                                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                                                        {studentData.email}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400 italic">
                                                        *Email berasal dari data master dan tidak dapat diubah.
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Action */}
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                            >
                                                <span>{isSubmitting ? 'Mengirim Permohonan...' : 'Ajukan Pembuatan Akun'}</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                            <p className="text-[11px] text-center text-slate-400 mt-2">
                                                Permohonan akan diverifikasi oleh staf Tata Usaha sebelum akun aktif.
                                            </p>
                                        </div>
                                    </form>
                                )}

                                {/* Bottom Link to Login */}
                                <div className="pt-4 border-t border-slate-100 text-center">
                                    <p className="text-xs text-slate-500 font-medium">
                                        Sudah memiliki akun mahasiswa?{' '}
                                        <Link href="/login?role=mahasiswa" className="text-blue-600 hover:text-blue-800 font-bold hover:underline">
                                            Masuk di sini
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Details */}
                <footer className="mt-8 text-center space-y-1 relative z-10">
                    <p className="text-[11px] text-slate-500 font-medium">
                        © 2026 Teknik Informatika, Fakultas Teknik, Universitas Trunodjoyo Madura.
                    </p>
                </footer>
            </main>
        </>
    );
}
