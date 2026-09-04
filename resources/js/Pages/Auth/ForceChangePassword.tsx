import { FormEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { ShieldAlert, KeyRound, Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
    user: {
        name: string;
        email: string;
        nim?: string;
    };
}

export default function ForceChangePassword({ user }: Props) {
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
            <Head title="Ganti Password Pertama Kali - SI-KP UTM" />

            <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-slate-950 font-sans text-slate-100">
                {/* Glowing Mesh */}
                <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-amber-600/25 to-orange-500/5 blur-[140px] pointer-events-none" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-blue-600/20 to-indigo-500/5 blur-[140px] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />

                <div className="w-full max-w-[480px] space-y-6 relative z-10">
                    
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="flex justify-center">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                                <KeyRound className="w-7 h-7" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-100 to-white tracking-tight">
                                Ganti Password Akun
                            </h1>
                            <p className="text-xs text-amber-400 font-bold tracking-widest uppercase">
                                Login Pertama Kali Mahasiswa
                            </p>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-2xl border border-slate-100 text-slate-800 space-y-5">
                        
                        {/* Security Notice */}
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-bold">Keamanan Akun Diperlukan</p>
                                <p className="leading-relaxed text-amber-800">
                                    Halo <strong>{user.name}</strong>, Anda masuk menggunakan password sementara. Silakan buat password baru pribadi Anda untuk melanjutkan ke dashboard.
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-4">
                            
                            {/* Current / Temporary Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block" htmlFor="current_password">
                                    Password Sementara / Saat Ini
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                                    <input
                                        className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-slate-50/50 hover:bg-white text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-400 ${
                                            errors.current_password ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'
                                        }`}
                                        id="current_password"
                                        name="current_password"
                                        placeholder="Masukkan password dari email"
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                    >
                                        {showCurrentPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.current_password && (
                                    <p className="text-xs font-semibold text-red-500 mt-1">{errors.current_password}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block" htmlFor="password">
                                    Password Baru
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-slate-50/50 hover:bg-white text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-400 ${
                                            errors.password ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'
                                        }`}
                                        id="password"
                                        name="password"
                                        placeholder="Minimal 8 karakter"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                    >
                                        {showNewPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs font-semibold text-red-500 mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block" htmlFor="password_confirmation">
                                    Konfirmasi Password Baru
                                </label>
                                <div className="relative group">
                                    <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-slate-50/50 hover:bg-white text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-400 ${
                                            errors.password_confirmation ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'
                                        }`}
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        placeholder="Ulangi password baru"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                    >
                                        {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-xs font-semibold text-red-500 mt-1">{errors.password_confirmation}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    <span>{processing ? 'Menyimpan Password...' : 'Simpan Password & Masuk Dashboard'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </form>

                        {/* Logout Option */}
                        <div className="pt-4 border-t border-slate-100 text-center">
                            <form action={route('logout')} method="POST">
                                <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''} />
                                <button
                                    type="submit"
                                    className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                >
                                    Keluar dari Sesi (Logout)
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-8 text-center space-y-1 relative z-10">
                    <p className="text-[11px] text-slate-500 font-medium">
                        © 2026 Teknik Informatika, Fakultas Teknik, Universitas Trunodjoyo Madura.
                    </p>
                </footer>
            </main>
        </>
    );
}
