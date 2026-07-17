import { FormEventHandler, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Info, User, Lock, Eye, EyeOff, LogIn, HelpCircle, Building2 } from 'lucide-react';

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
            <Head title="Login" />
            <main className="w-full flex flex-col items-center justify-center min-h-screen py-12 px-4 relative overflow-hidden bg-background">
                {/* Background gradients */}
                <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-primary-fixed rounded-full blur-[100px] opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-secondary-fixed rounded-full blur-[100px] opacity-40 translate-x-1/2 translate-y-1/2 pointer-events-none" />

                {/* Logo Section */}
                <div className="mb-8 text-center z-10">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-32 h-16 bg-white border border-outline-variant shadow-sm flex items-center justify-center rounded-lg">
                            <span className="font-bold text-primary text-xl">SI-KP</span>
                        </div>
                    </div>
                    <h1 className="text-headline-md text-primary tracking-tight">Sistem Informasi Kerja Praktik</h1>
                    <p className="text-body-sm text-secondary mt-1">Portal Autentikasi Akademik Terintegrasi</p>
                </div>

                {/* Login Card */}
                <div className="w-full max-w-md p-6 rounded-xl border border-outline-variant shadow-sm bg-white/95 backdrop-blur-md transition-all duration-300 hover:shadow-md z-10">
                    <div className="flex flex-col space-y-4">
                        <div className="space-y-2 text-center">
                            <h2 className="text-title-lg text-on-surface">Masuk ke Sistem</h2>
                            <div className="bg-secondary-container/30 px-4 py-2 rounded-lg flex items-start gap-2">
                                <Info className="text-primary w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p className="text-label-sm text-on-secondary-fixed-variant text-left leading-relaxed">
                                    Gunakan akun portal akademik Anda untuk mengakses layanan kerja praktik ini.
                                </p>
                            </div>
                        </div>

                        {status && (
                            <div className="text-sm font-medium text-success bg-success-container px-4 py-2 rounded-lg">
                                {status}
                            </div>
                        )}

                        <form className="space-y-4 mt-4" onSubmit={submit}>
                            {/* Email Field */}
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant block" htmlFor="email">
                                    Email
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                                    <input
                                        className={`w-full pl-12 pr-4 py-2.5 rounded-lg border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md placeholder:text-outline-variant ${errors.email ? 'border-error' : 'border-outline-variant'}`}
                                        id="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.email && <p className="text-label-sm text-error">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant block" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                                    <input
                                        className={`w-full pl-12 pr-12 py-2.5 rounded-lg border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md placeholder:text-outline-variant ${errors.password ? 'border-error' : 'border-outline-variant'}`}
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
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-label-sm text-error">{errors.password}</p>}
                            </div>

                            <div className="flex items-center justify-between py-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="text-label-sm text-secondary">Ingat saya</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-primary text-on-primary py-4 px-6 rounded-lg font-label-md transition-all duration-200 hover:bg-primary-container active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <span>{processing ? 'Memproses...' : 'Masuk'}</span>
                                <LogIn className="w-5 h-5" />
                            </button>
                        </form>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-outline-variant"></div>
                            <span className="flex-shrink mx-4 text-label-sm text-outline uppercase tracking-widest">Bantuan</span>
                            <div className="flex-grow border-t border-outline-variant"></div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Link href="/instansi/registration" className="w-full py-2.5 px-4 bg-secondary-container text-on-secondary-container rounded-lg text-label-md hover:opacity-90 transition-colors flex items-center justify-center gap-2 font-medium">
                                <Building2 className="w-5 h-5" />
                                Registrasi Instansi Baru
                            </Link>
                            <button className="w-full py-2.5 px-4 border border-outline-variant rounded-lg text-label-md text-secondary hover:bg-surface-container transition-colors flex items-center justify-center gap-2">
                                <HelpCircle className="w-5 h-5" />
                                Hubungi Support Center
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <footer className="mt-12 text-center space-y-2 z-10">
                    <p className="text-label-sm text-secondary opacity-70">
                        © 2024 University Academic Internship System. All rights reserved.
                    </p>
                    <div className="flex items-center justify-center gap-6">
                        <a href="#" className="text-label-sm text-outline hover:text-primary transition-colors">Syarat & Ketentuan</a>
                        <span className="w-1 h-1 bg-outline rounded-full"></span>
                        <a href="#" className="text-label-sm text-outline hover:text-primary transition-colors">Kebijakan Privasi</a>
                    </div>
                </footer>
            </main>
        </>
    );
}
