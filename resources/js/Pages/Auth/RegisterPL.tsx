import { FormEventHandler, useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { 
    User, 
    Lock, 
    Mail, 
    Building2, 
    UserPlus, 
    Eye, 
    EyeOff, 
    CheckCircle2, 
    MapPin, 
    Phone, 
    BookOpen, 
    ExternalLink 
} from 'lucide-react';

interface Instansi {
    id: number;
    nama: string;
}

interface Props {
    instansis: Instansi[];
}

export default function RegisterPL({ instansis }: Props) {
    const { props } = usePage();
    const campus = (props as any)?.campus;
    const campusAddress = campus?.address || 'Jl. Raya Telang, PO BOX 2 Kamal, Bangkalan';
    const campusPhone = campus?.phone || '031-3011147';
    const campusEmail = campus?.email || 'tif@trunojoyo.ac.id';
    const cleanPhone = campusPhone.replace(/[^0-9]/g, '');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            <Head title="Registrasi Pembimbing Lapangan - SI-KP UTM" />

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
                        
                        <div className="space-y-1 text-center sm:text-left">
                            <div className="inline-flex p-2.5 rounded-lg bg-blue-50 text-[#00288e] mb-1">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                                Registrasi Pembimbing Lapangan
                            </h1>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Daftarkan akun Anda. Nama Anda harus sudah didaftarkan oleh Koordinator Program Studi.
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={submit}>
                            {/* Nama Field */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="nama">
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <input
                                        className={`w-full pl-9 pr-4 py-2.5 rounded-lg border bg-white text-slate-800 focus:ring-2 focus:ring-[#00288e]/20 focus:border-[#00288e] outline-none transition text-sm placeholder:text-slate-400 ${
                                            errors.nama ? 'border-red-500' : 'border-slate-200'
                                        }`}
                                        id="nama"
                                        name="nama"
                                        placeholder="Sesuai nama yang didaftarkan Prodi"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        required
                                        maxLength={255}
                                        autoComplete="name"
                                    />
                                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                {errors.nama && <p className="text-xs font-medium text-red-600 mt-1">{errors.nama}</p>}
                            </div>

                            {/* Instansi Field */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="instansi_id">
                                    Instansi Mitra
                                </label>
                                <div className="relative">
                                    <select
                                        className={`w-full pl-9 pr-8 py-2.5 rounded-lg border bg-white text-slate-800 focus:ring-2 focus:ring-[#00288e]/20 focus:border-[#00288e] outline-none transition text-sm appearance-none cursor-pointer ${
                                            errors.instansi_id ? 'border-red-500' : 'border-slate-200'
                                        } ${data.instansi_id ? 'text-slate-800' : 'text-slate-400'}`}
                                        id="instansi_id"
                                        name="instansi_id"
                                        value={data.instansi_id}
                                        onChange={(e) => setData('instansi_id', e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Pilih Instansi Mitra</option>
                                        {instansis.map((instansi) => (
                                            <option key={instansi.id} value={instansi.id} className="text-slate-800">
                                                {instansi.nama}
                                            </option>
                                        ))}
                                    </select>
                                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                    </div>
                                </div>
                                {errors.instansi_id && <p className="text-xs font-medium text-red-600 mt-1">{errors.instansi_id}</p>}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="email">
                                    Alamat Email
                                </label>
                                <div className="relative">
                                    <input
                                        className={`w-full pl-9 pr-4 py-2.5 rounded-lg border bg-white text-slate-800 focus:ring-2 focus:ring-[#00288e]/20 focus:border-[#00288e] outline-none transition text-sm placeholder:text-slate-400 ${
                                            errors.email ? 'border-red-500' : 'border-slate-200'
                                        }`}
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="email@instansi.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        maxLength={255}
                                        autoComplete="email"
                                    />
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                {errors.email && <p className="text-xs font-medium text-red-600 mt-1">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="password">
                                    Kata Sandi
                                </label>
                                <div className="relative">
                                    <input
                                        className={`w-full pl-9 pr-10 py-2.5 rounded-lg border bg-white text-slate-800 focus:ring-2 focus:ring-[#00288e]/20 focus:border-[#00288e] outline-none transition text-sm placeholder:text-slate-400 ${
                                            errors.password ? 'border-red-500' : 'border-slate-200'
                                        }`}
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Minimal 8 karakter"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        maxLength={128}
                                        autoComplete="new-password"
                                    />
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs font-medium text-red-600 mt-1">{errors.password}</p>}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="password_confirmation">
                                    Konfirmasi Kata Sandi
                                </label>
                                <div className="relative">
                                    <input
                                        className={`w-full pl-9 pr-10 py-2.5 rounded-lg border bg-white text-slate-800 focus:ring-2 focus:ring-[#00288e]/20 focus:border-[#00288e] outline-none transition text-sm placeholder:text-slate-400 ${
                                            errors.password_confirmation ? 'border-red-500' : 'border-slate-200'
                                        }`}
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        placeholder="Ketik ulang kata sandi"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                        maxLength={128}
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
                                {errors.password_confirmation && <p className="text-xs font-medium text-red-600 mt-1">{errors.password_confirmation}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#00288e] hover:bg-[#001f70] text-white py-2.5 px-4 rounded-lg font-semibold transition duration-150 shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs cursor-pointer"
                                >
                                    <span>{processing ? 'Mendaftarkan Akun...' : 'Daftar Akun'}</span>
                                    <UserPlus className="w-4 h-4" />
                                </button>
                            </div>
                        </form>

                        {/* Login Link */}
                        <div className="pt-3 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-500">
                                Sudah memiliki akun?{' '}
                                <Link href={route('login')} className="text-[#00288e] hover:text-[#001f70] font-semibold hover:underline">
                                    Masuk di sini
                                </Link>
                            </p>
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
