import { FormEventHandler, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { User, Lock, Mail, Building2, UserPlus, HelpCircle } from 'lucide-react';

interface Instansi {
    id: number;
    nama: string;
}

interface Props {
    instansis: Instansi[];
}

export default function RegisterPL({ instansis }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        instansi_id: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('pembimbing-lapangan.register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Registrasi Akun Pembimbing Lapangan" />
            <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-950 font-sans">
                
                {/* 1. Glowing Radial Gradients (Mesh Background) */}
                <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-600/25 to-blue-500/5 blur-[140px] pointer-events-none" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-cyan-600/20 to-teal-500/5 blur-[140px] pointer-events-none" />
                <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

                {/* 2. Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />

                {/* Main Content Container */}
                <div className="w-full max-w-[500px] space-y-6 relative z-10">
                    
                    {/* Portal Header */}
                    <div className="text-center space-y-3">
                        <div className="flex justify-center">
                            <div className="bg-white p-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105">
                                <img src="/images/Logo UTM terbaru_berwarna (1).png" alt="Logo UTM" className="w-16 h-16 object-contain" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-100 via-blue-200 to-cyan-100 tracking-tight sm:text-3xl">
                                Registrasi Pembimbing Lapangan
                            </h1>
                            <p className="text-xs text-indigo-400 font-bold tracking-widest uppercase mt-2">
                                Sistem Informasi Kerja Praktik
                            </p>
                        </div>
                    </div>

                    {/* Register Card */}
                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-100">
                        <div className="space-y-2 text-center mb-8">
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Buat Akun Anda</h2>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Silakan buat akun Anda. Pastikan nama Anda telah didaftarkan (di-whitelist) oleh Koordinator Prodi Universitas.
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={submit}>
                            {/* Nama Field */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block" htmlFor="nama">
                                    Nama Lengkap
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white border-slate-200 text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-350 ${errors.nama ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'}`}
                                        id="nama"
                                        name="nama"
                                        placeholder="Sesuai dengan yang didaftarkan Prodi"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                                {errors.nama && <p className="text-[11px] font-semibold text-red-500 mt-1 pl-1">{errors.nama}</p>}
                            </div>

                            {/* Instansi Field */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block" htmlFor="instansi_id">
                                    Instansi Mitra
                                </label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors z-10" />
                                    <select
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white border-slate-200 text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-semibold appearance-none ${errors.instansi_id ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'} ${data.instansi_id ? 'text-slate-800' : 'text-slate-350'}`}
                                        id="instansi_id"
                                        name="instansi_id"
                                        value={data.instansi_id}
                                        onChange={(e) => setData('instansi_id', e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Pilih Instansi Anda</option>
                                        {instansis.map((instansi) => (
                                            <option key={instansi.id} value={instansi.id} className="text-slate-800">
                                                {instansi.nama}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                    </div>
                                </div>
                                {errors.instansi_id && <p className="text-[11px] font-semibold text-red-500 mt-1 pl-1">{errors.instansi_id}</p>}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block" htmlFor="email">
                                    Alamat Email
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white border-slate-200 text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-350 ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'}`}
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="email@perusahaan.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && <p className="text-[11px] font-semibold text-red-500 mt-1 pl-1">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white border-slate-200 text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-350 ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'}`}
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Minimal 8 karakter"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                {errors.password && <p className="text-[11px] font-semibold text-red-500 mt-1 pl-1">{errors.password}</p>}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block" htmlFor="password_confirmation">
                                    Konfirmasi Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white border-slate-200 text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-350 ${errors.password_confirmation ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'}`}
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        placeholder="Ketik ulang password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                {errors.password_confirmation && <p className="text-[11px] font-semibold text-red-500 mt-1 pl-1">{errors.password_confirmation}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-6 rounded-xl font-bold transition-all duration-150 active:scale-[0.98] shadow-md flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                                >
                                    <span>{processing ? 'Memproses...' : 'Daftar Akun'}</span>
                                    <UserPlus className="w-4.5 h-4.5" />
                                </button>
                            </div>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm font-semibold text-slate-500">
                                Sudah punya akun?{' '}
                                <Link href={route('login')} className="text-indigo-600 hover:text-indigo-700 hover:underline">
                                    Masuk di sini
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Details */}
                <footer className="mt-8 text-center space-y-1 relative z-10">
                    <p className="text-[10px] text-slate-500 font-semibold">
                        © 2026 Teknik Informatika, Universitas Trunodjoyo Madura.
                    </p>
                </footer>
            </main>
        </>
    );
}
