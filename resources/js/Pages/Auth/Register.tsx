import { FormEventHandler, useState } from 'react';
import { Head, router, Link, usePage } from '@inertiajs/react';
import { 
    Search, 
    CheckCircle2, 
    AlertCircle, 
    Clock, 
    ArrowRight, 
    GraduationCap, 
    Mail, 
    BookOpen, 
    Loader2, 
    ShieldAlert, 
    RotateCcw,
    MapPin,
    Phone,
    ExternalLink
} from 'lucide-react';

interface StudentData {
    nim: string;
    nama: string;
    email: string;
    program_studi: string;
    angkatan: string;
}

export default function Register() {
    const { props } = usePage();
    const campus = (props as any)?.campus;
    const campusAddress = campus?.address || 'Jl. Raya Telang, PO BOX 2 Kamal, Bangkalan';
    const campusPhone = campus?.phone || '031-3011147';
    const campusEmail = campus?.email || 'tif@trunojoyo.ac.id';
    const cleanPhone = campusPhone.replace(/[^0-9]/g, '');

    const [nimInput, setNimInput] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [checkError, setCheckError] = useState<string | null>(null);
    const [checkErrorType, setCheckErrorType] = useState<string | null>(null);
    const [studentData, setStudentData] = useState<StudentData | null>(null);
    const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cek NIM ke server
    const handleCheckNim = async (e?: React.FormEvent, customNim?: string) => {
        if (e) e.preventDefault();

        const trimmedNim = (customNim !== undefined ? customNim : nimInput).trim();
        if (!trimmedNim) {
            setCheckError('Masukkan NIM Anda terlebih dahulu.');
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
                setCheckError(result.message || 'Gagal memeriksa NIM.');
                setCheckErrorType(result.status || 'error');
            }
        } catch {
            setCheckError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
            setCheckErrorType('network');
        } finally {
            setIsChecking(false);
        }
    };

    const handleCancelPending = async () => {
        const trimmedNim = nimInput.trim();
        if (!trimmedNim) return;

        if (!confirm('Batalkan permohonan akun yang sedang menunggu verifikasi untuk mengajukan ulang?')) {
            return;
        }

        setIsCancelling(true);
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch(route('register.cancel'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ nim: trimmedNim }),
            });

            const result = await res.json();
            if (res.ok) {
                setCheckError(null);
                setCheckErrorType(null);
                await handleCheckNim(undefined, trimmedNim);
            } else {
                alert(result.message || 'Gagal membatalkan permohonan.');
            }
        } catch {
            alert('Gagal terhubung ke server.');
        } finally {
            setIsCancelling(false);
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

            <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-[#00288e] selection:text-white">
                {/* Top Contact Bar */}
                <header className="bg-white border-b border-slate-200 py-1.5 text-xs text-slate-600 hidden md:block w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-y-1">
                        <div className="flex items-center gap-6">
                            <a 
                                href="https://maps.google.com/?q=Universitas+Trunojoyo+Madura" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-[#00288e] transition cursor-pointer"
                                title="Buka Lokasi Kampus UTM di Google Maps"
                            >
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{campusAddress}</span>
                            </a>
                            <a 
                                href={`tel:${cleanPhone}`} 
                                className="flex items-center gap-1.5 hover:text-[#00288e] transition cursor-pointer"
                                title={`Hubungi Telepon Kampus: ${campusPhone}`}
                            >
                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{campusPhone}</span>
                            </a>
                            <a 
                                href={`mailto:${campusEmail}`} 
                                className="flex items-center gap-1.5 hover:text-[#00288e] transition cursor-pointer"
                                title={`Kirim Email ke ${campusEmail}`}
                            >
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{campusEmail}</span>
                            </a>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 font-medium">
                            <a 
                                href="https://trunojoyo.ac.id" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-[#00288e] transition cursor-pointer"
                                title="Portal Resmi Universitas Trunojoyo Madura"
                            >
                                <span>SI-KP TEKNIK INFORMATIKA &bull; UNIVERSITAS TRUNOJOYO MADURA</span>
                            </a>
                        </div>
                    </div>
                </header>

                {/* Navbar */}
                <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40 shadow-xs">
                    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-13 sm:h-15 flex items-center justify-between gap-2">
                        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                                <img 
                                    src="/images/Logo UTM terbaru_berwarna (1).png" 
                                    alt="Logo UTM" 
                                    className="h-7 sm:h-9 w-auto object-contain" 
                                />
                                <img 
                                    src="/images/tekfor-logo.png" 
                                    alt="Logo Teknik Informatika" 
                                    className="h-6 sm:h-8 w-auto object-contain" 
                                />
                            </div>
                            <div className="border-l border-slate-200 pl-2 sm:pl-2.5 min-w-0">
                                <div className="text-xs sm:text-sm font-bold text-[#00288e] tracking-tight leading-tight truncate">
                                    SI-KP • TEKNIK INFORMATIKA
                                </div>
                                <div className="text-[10px] sm:text-xs font-medium text-slate-500 leading-tight truncate">
                                    Program Studi S1 Teknik Informatika • Fakultas Teknik UTM
                                </div>
                            </div>
                        </Link>

                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <Link 
                                href="/panduan" 
                                className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-xs"
                                title="Panduan"
                            >
                                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 shrink-0" />
                                <span className="hidden sm:inline">Panduan</span>
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
                    <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-xs p-6 sm:p-8 space-y-5">
                        
                        {/* VIEW A: SUCCESS STATE */}
                        {isSubmittedSuccess ? (
                            <div className="text-center space-y-4 py-2">
                                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                                        Permohonan Berhasil Dikirim
                                    </h1>
                                    <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                                        Data permohonan atas nama <strong className="text-slate-900">{studentData?.nama}</strong> ({studentData?.nim}) telah diterima. Petugas Tata Usaha (TU) akan memverifikasi data Anda.
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-900 text-left space-y-1">
                                    <p className="font-semibold flex items-center gap-1.5">
                                        <Mail className="w-4 h-4 text-[#00288e]" />
                                        Informasi Akun:
                                    </p>
                                    <p className="text-blue-800 leading-relaxed text-[11px]">
                                        Setelah disetujui, username (NIM) dan kata sandi sementara akan dikirimkan ke email kampus Anda: <span className="font-semibold text-[#00288e]">{studentData?.email}</span>.
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <Link
                                        href="/login"
                                        className="w-full py-2.5 px-4 rounded-lg bg-[#00288e] hover:bg-[#001f70] text-white font-semibold text-xs transition duration-150 ease-in-out shadow-xs flex items-center justify-center gap-1.5"
                                    >
                                        <span>Ke Halaman Masuk</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            /* VIEW B: FORM STATE */
                            <div className="space-y-5">
                                <div className="space-y-1 border-b border-slate-100 pb-4 text-center sm:text-left">
                                    <div className="inline-flex p-2.5 rounded-lg bg-blue-50 text-[#00288e] mb-1">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                                        Registrasi Akun Mahasiswa
                                    </h1>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Masukkan NIM Anda untuk memeriksa data pendaftaran pada sistem master akademik.
                                    </p>
                                </div>

                                {/* Step 1: Input NIM */}
                                <form onSubmit={handleCheckNim} className="space-y-3">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="nim">
                                            Nomor Induk Mahasiswa (NIM)
                                        </label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 text-sm focus:border-[#00288e] focus:ring-2 focus:ring-[#00288e]/20 outline-none transition"
                                                    id="nim"
                                                    name="nim"
                                                    placeholder="Contoh: 220411100080"
                                                    type="text"
                                                    value={nimInput}
                                                    onChange={(e) => setNimInput(e.target.value)}
                                                    disabled={isChecking || studentData !== null}
                                                    maxLength={30}
                                                    autoFocus
                                                />
                                                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>

                                            {!studentData ? (
                                                <button
                                                    type="submit"
                                                    disabled={isChecking || !nimInput.trim()}
                                                    className="px-4 py-2.5 rounded-lg bg-[#00288e] hover:bg-[#001f70] text-white font-semibold text-xs transition duration-150 shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                                                >
                                                    {isChecking ? (
                                                        <>
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            <span>Memeriksa...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Search className="w-3.5 h-3.5" />
                                                            <span>Cek NIM</span>
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleReset}
                                                    className="px-3.5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer shrink-0"
                                                >
                                                    Ganti NIM
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>

                                {/* Alert Box for Errors */}
                                {checkError && (
                                    <div className={`p-3.5 rounded-lg text-xs flex items-start gap-2.5 border ${
                                        checkErrorType === 'already_has_account'
                                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                                            : checkErrorType === 'pending_verification'
                                                ? 'bg-blue-50 border-blue-200 text-blue-900'
                                                : 'bg-red-50 border-red-200 text-red-900'
                                    }`}>
                                        {checkErrorType === 'pending_verification' ? (
                                            <Clock className="w-4 h-4 shrink-0 text-[#00288e] mt-0.5" />
                                        ) : checkErrorType === 'already_has_account' ? (
                                            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                                        )}
                                        <div className="space-y-1 w-full">
                                            <p className="font-semibold">
                                                {checkErrorType === 'already_has_account'
                                                    ? 'Akun Sudah Terdaftar'
                                                    : checkErrorType === 'pending_verification'
                                                        ? 'Permohonan Sedang Diproses'
                                                        : 'Pemberitahuan'}
                                            </p>
                                            <p className="text-[11px] leading-relaxed opacity-90">{checkError}</p>
                                            {checkErrorType === 'already_has_account' && (
                                                <Link href="/login" className="inline-block font-semibold text-[#00288e] hover:underline mt-1 text-xs">
                                                    Masuk ke Akun Anda →
                                                </Link>
                                            )}
                                            {checkErrorType === 'pending_verification' && (
                                                <div className="pt-2 mt-1.5 border-t border-blue-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <span className="text-[11px] text-blue-800">Perlu mengubah data atau mengajukan ulang?</span>
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelPending}
                                                        disabled={isCancelling}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#00288e] hover:bg-[#001f70] text-white rounded-md font-semibold text-[11px] transition shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
                                                    >
                                                        {isCancelling ? (
                                                            <>
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                                <span>Membatalkan...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <RotateCcw className="w-3 h-3" />
                                                                <span>Batalkan & Ajukan Ulang</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Display Fetched Data & Confirm Application */}
                                {studentData && (
                                    <form onSubmit={submitApplication} className="space-y-4 pt-1">
                                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                                                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Data Terverifikasi
                                                </span>
                                                <span className="text-xs font-semibold text-slate-500">Angkatan {studentData.angkatan}</span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                                <div>
                                                    <span className="text-slate-500 font-medium block text-[10px] uppercase tracking-wider">Nama Mahasiswa</span>
                                                    <p className="font-semibold text-slate-900 text-sm">{studentData.nama}</p>
                                                </div>

                                                <div>
                                                    <span className="text-slate-500 font-medium block text-[10px] uppercase tracking-wider">NIM</span>
                                                    <p className="font-semibold text-slate-800 font-mono">{studentData.nim}</p>
                                                </div>

                                                <div>
                                                    <span className="text-slate-500 font-medium block text-[10px] uppercase tracking-wider">Program Studi</span>
                                                    <p className="font-semibold text-slate-800">{studentData.program_studi}</p>
                                                </div>

                                                <div>
                                                    <span className="text-slate-500 font-medium block text-[10px] uppercase tracking-wider">Email Kampus</span>
                                                    <p className="font-semibold text-slate-800 truncate">{studentData.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Action */}
                                        <div className="pt-1">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-2.5 px-4 rounded-lg bg-[#00288e] hover:bg-[#001f70] text-white font-semibold text-xs shadow-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span>{isSubmitting ? 'Mengirimkan Permohonan...' : 'Ajukan Pembuatan Akun'}</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                            <p className="text-[11px] text-center text-slate-500 mt-2">
                                                Petugas Tata Usaha akan memverifikasi permohonan Anda.
                                            </p>
                                        </div>
                                    </form>
                                )}

                                {/* Bottom Link to Login */}
                                <div className="pt-3 border-t border-slate-100 text-center">
                                    <p className="text-xs text-slate-500">
                                        Sudah memiliki akun?{' '}
                                        <Link href="/login" className="text-[#00288e] hover:text-[#001f70] font-semibold hover:underline">
                                            Masuk di sini
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-slate-200 py-3.5 text-xs text-slate-500">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                        <div>
                            <span className="font-semibold text-slate-700">&copy; 2024 - 2026 SI-KP TEKNIK INFORMATIKA.</span> All Rights Reserved.
                        </div>
                        <div>
                            Program Studi S1 Teknik Informatika - <span className="font-semibold text-slate-700">Universitas Trunojoyo Madura</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
