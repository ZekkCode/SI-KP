import { FormEventHandler, useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldAlert, MapPin, Phone, Mail, BookOpen, ExternalLink, LogOut } from 'lucide-react';

interface Props {
    user: {
        name: string;
        email: string;
        nim?: string;
    };
}

export default function ForceChangePassword({ user }: Props) {
    const { props } = usePage();
    const campus = (props as any)?.campus;
    const campusAddress = campus?.address || 'Jl. Raya Telang, PO BOX 2 Kamal, Bangkalan';
    const campusPhone = campus?.phone || '031-3011147';
    const campusEmail = campus?.email || 'tif@trunojoyo.ac.id';
    const cleanPhone = campusPhone.replace(/[^0-9]/g, '');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.force_change.update'), {
            onFinish: () => reset('current_password', 'password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Perbarui Kata Sandi - SI-KP UTM" />

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
                    <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xs p-6 sm:p-8 space-y-5">
                        
                        {/* Header Box */}
                        <div className="space-y-1 text-center sm:text-left">
                            <div className="inline-flex p-2.5 rounded-lg bg-amber-50 text-amber-700 mb-2">
                                <KeyRound className="w-5 h-5" />
                            </div>
                            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                                Perbarui Kata Sandi Akun
                            </h1>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Anda saat ini menggunakan kata sandi sementara. Tetapkan kata sandi baru sebelum masuk ke dashboard.
                            </p>
                        </div>

                        {/* User Identity Banner */}
                        <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-slate-700 flex items-start gap-2.5">
                            <ShieldAlert className="w-4 h-4 text-[#00288e] shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-slate-900">{user.name}</span>
                                {user.nim && <span className="text-slate-500"> ({user.nim})</span>}
                                <p className="text-[11px] text-slate-500 mt-0.5">{user.email}</p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-4">
                            {/* Current / Temporary Password */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="current_password">
                                    Kata Sandi Sementara
                                </label>
                                <div className="relative">
                                    <input
                                        className={`w-full pl-9 pr-10 py-2.5 rounded-lg border bg-white text-slate-800 focus:ring-2 focus:ring-[#00288e]/20 focus:border-[#00288e] outline-none transition-all text-sm placeholder:text-slate-400 ${
                                            errors.current_password ? 'border-red-500' : 'border-slate-200'
                                        }`}
                                        id="current_password"
                                        name="current_password"
                                        placeholder="Masukkan kata sandi dari email"
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        required
                                        autoFocus
                                        autoComplete="current-password"
                                    />
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.current_password && (
                                    <p className="text-xs font-medium text-red-600 mt-1">{errors.current_password}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="password">
                                    Kata Sandi Baru
                                </label>
                                <div className="relative">
                                    <input
                                        className={`w-full pl-9 pr-10 py-2.5 rounded-lg border bg-white text-slate-800 focus:ring-2 focus:ring-[#00288e]/20 focus:border-[#00288e] outline-none transition-all text-sm placeholder:text-slate-400 ${
                                            errors.password ? 'border-red-500' : 'border-slate-200'
                                        }`}
                                        id="password"
                                        name="password"
                                        placeholder="Minimal 8 karakter"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
                                    >
                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs font-medium text-red-600 mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="password_confirmation">
                                    Konfirmasi Kata Sandi Baru
                                </label>
                                <div className="relative">
                                    <input
                                        className={`w-full pl-9 pr-10 py-2.5 rounded-lg border bg-white text-slate-800 focus:ring-2 focus:ring-[#00288e]/20 focus:border-[#00288e] outline-none transition-all text-sm placeholder:text-slate-400 ${
                                            errors.password_confirmation ? 'border-red-500' : 'border-slate-200'
                                        }`}
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        placeholder="Ketik ulang kata sandi baru"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-xs font-medium text-red-600 mt-1">{errors.password_confirmation}</p>
                                )}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#00288e] hover:bg-[#001f70] text-white py-2.5 px-4 rounded-lg font-semibold text-xs transition duration-150 ease-in-out shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <span>{processing ? 'Menyimpan Kata Sandi...' : 'Simpan Kata Sandi & Lanjutkan'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </form>

                        {/* Logout Option */}
                        <div className="pt-3 border-t border-slate-100 text-center">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 transition"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Keluar dari Sesi</span>
                            </Link>
                        </div>
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
