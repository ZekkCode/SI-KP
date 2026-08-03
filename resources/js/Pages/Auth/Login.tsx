import { FormEventHandler, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Info, User, Lock, Eye, EyeOff, LogIn, HelpCircle, Building2, Sparkles } from 'lucide-react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk ke Sistem" />
            <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-950 font-sans">
                
                {/* 1. Glowing Radial Gradients (Mesh Background) */}
                <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-blue-600/25 to-cyan-500/5 blur-[140px] pointer-events-none" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-indigo-600/20 to-purple-500/5 blur-[140px] pointer-events-none" />
                <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

                {/* 2. Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />

                {/* Main Content Container (Slightly larger: max-w-[480px]) */}
                <div className="w-full max-w-[480px] space-y-6 relative z-10">
                    
                    {/* Portal Header */}
                    <div className="text-center space-y-3">
                        <div className="flex justify-center">
                            <div className="bg-white p-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105">
                                <img src="/images/Logo UTM terbaru_berwarna (1).png" alt="Logo UTM" className="w-16 h-16 object-contain" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-blue-200 to-indigo-100 tracking-tight sm:text-3xl">
                                SI-KP TEKNIK INFORMATIKA
                            </h1>
                            <p className="text-xs text-blue-400 font-bold tracking-widest uppercase">
                                Universitas Trunojoyo Madura
                            </p>
                        </div>
                    </div>

                    {/* Status Alert if exists */}
                    {status && (
                        <div className="text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-250 px-4 py-3 rounded-xl shadow-sm text-center">
                            {status}
                        </div>
                    )}

                    {/* Login Card (Pure White & Larger Padding) */}
                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-100">
                        <div className="space-y-1.5 text-center mb-8">
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Masuk Portal</h2>
                            <p className="text-sm text-slate-400 font-semibold">Gunakan akun portal akademik Anda</p>
                        </div>

                        <form className="space-y-5" onSubmit={submit}>
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block" htmlFor="email">
                                    Alamat Email
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        className={`w-full pl-11 pr-4 py-3.5 rounded-xl border bg-white border-slate-200 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-350 ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'}`}
                                        id="email"
                                        name="email"
                                        placeholder="email@student.utm.ac.id"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.email && <p className="text-xs font-semibold text-red-500 mt-1">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block" htmlFor="password">
                                        Kata Sandi
                                    </label>
                                    {canResetPassword && (
                                        <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline">
                                            Lupa Sandi?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        className={`w-full pl-11 pr-11 py-3.5 rounded-xl border bg-white border-slate-200 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-350 ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'}`}
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                    >
                                        {showPassword ? <Eye className="w-4.5 h-4.5" /> : <EyeOff className="w-4.5 h-4.5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs font-semibold text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center justify-between py-1">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="text-xs font-bold text-slate-450 cursor-pointer select-none">Ingat sesi masuk saya</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl font-bold transition-all duration-150 active:scale-[0.98] shadow-md flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                            >
                                <span>{processing ? 'Memproses...' : 'Masuk Sekarang'}</span>
                                <LogIn className="w-4.5 h-4.5" />
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative flex items-center py-5">
                            <div className="flex-grow border-t border-slate-100"></div>
                            <span className="flex-shrink mx-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Registrasi Mitra</span>
                            <div className="flex-grow border-t border-slate-100"></div>
                        </div>

                        {/* External Registrasi Link */}
                        <div className="flex gap-3">
                            <Link 
                                href="/instansi/registration" 
                                className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-200"
                            >
                                <Building2 className="w-4.5 h-4.5 text-blue-600" />
                                Registrasi Instansi / Perusahaan Baru
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Details */}
                <footer className="mt-8 text-center space-y-1 relative z-10">
                    <p className="text-[10px] text-slate-500 font-semibold">
                        © 2026 Teknik Informatika, Universitas Trunojoyo Madura.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-bold">
                        <a href="#" className="hover:underline">Syarat & Ketentuan</a>
                        <span className="w-1.5 h-1.5 bg-slate-800 rounded-full opacity-50"></span>
                        <a href="#" className="hover:underline">Kebijakan Privasi</a>
                    </div>
                </footer>
            </main>
        </>
    );
}
