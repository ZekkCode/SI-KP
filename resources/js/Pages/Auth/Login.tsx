import { FormEventHandler, useState, useEffect } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { 
    GraduationCap, 
    Award, 
    ShieldCheck, 
    Building, 
    Briefcase, 
    User, 
    Lock, 
    Eye, 
    EyeOff, 
    LogIn, 
    ArrowLeft, 
    ArrowRight, 
    Sparkles, 
    Info, 
    Building2 
} from 'lucide-react';

type RoleId = 'mahasiswa' | 'dosen' | 'prodi' | 'tu' | 'instansi';

interface RoleConfig {
    id: RoleId;
    title: string;
    badge: string;
    description: string;
    portalName: string;
    placeholder: string;
    icon: typeof GraduationCap;
    accentColor: string;
    accentGradient: string;
    buttonGradient: string;
    borderHover: string;
    glowColor: string;
    badgeBg: string;
    badgeText: string;
}

const ROLES: RoleConfig[] = [
    {
        id: 'mahasiswa',
        title: 'Mahasiswa',
        badge: 'S1 Informatika',
        portalName: 'Portal Mahasiswa',
        description: 'Pendaftaran KP, pengisian logbook mingguan, bimbingan dosen, hingga pengajuan seminar.',
        placeholder: 'Contoh: 230411100092',
        icon: GraduationCap,
        accentColor: 'blue',
        accentGradient: 'from-blue-600 to-indigo-600',
        buttonGradient: 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30',
        borderHover: 'hover:border-blue-500/60 hover:shadow-blue-500/10',
        glowColor: 'bg-blue-500/15',
        badgeBg: 'bg-blue-500/10 border-blue-500/20',
        badgeText: 'text-blue-400',
    },
    {
        id: 'dosen',
        title: 'Dosen Pembimbing',
        badge: 'Tenaga Pengajar',
        portalName: 'Portal Dosen Pembimbing',
        description: 'Monitoring progres kerja praktik, review catatan logbook harian, dan penilaian seminar KP.',
        placeholder: 'Masukkan NIP atau Email Dosen',
        icon: Award,
        accentColor: 'emerald',
        accentGradient: 'from-emerald-500 to-teal-600',
        buttonGradient: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30',
        borderHover: 'hover:border-emerald-500/60 hover:shadow-emerald-500/10',
        glowColor: 'bg-emerald-500/15',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
        badgeText: 'text-emerald-400',
    },
    {
        id: 'prodi',
        title: 'Koordinator KP',
        badge: 'Koordinator',
        portalName: 'Portal Koordinator Kerja Praktik',
        description: 'Verifikasi pendaftaran KP, plotting dosen pembimbing, monitoring kuota, dan berita acara.',
        placeholder: 'koordinatorkp@utm.ac.id / admin',
        icon: ShieldCheck,
        accentColor: 'purple',
        accentGradient: 'from-purple-600 to-indigo-600',
        buttonGradient: 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30',
        borderHover: 'hover:border-purple-500/60 hover:shadow-purple-500/10',
        glowColor: 'bg-purple-500/15',
        badgeBg: 'bg-purple-500/10 border-purple-500/20',
        badgeText: 'text-purple-400',
    },
    {
        id: 'tu',
        title: 'Tata Usaha (TU)',
        badge: 'Administrasi Fakultas',
        portalName: 'Portal Tata Usaha',
        description: 'Penerbitan surat pengantar, verifikasi berkas legalitas, dan validasi akun mitra instansi.',
        placeholder: 'tu@admin.com',
        icon: Building,
        accentColor: 'amber',
        accentGradient: 'from-amber-500 to-orange-600',
        buttonGradient: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/30',
        borderHover: 'hover:border-amber-500/60 hover:shadow-amber-500/10',
        glowColor: 'bg-amber-500/15',
        badgeBg: 'bg-amber-500/10 border-amber-500/20',
        badgeText: 'text-amber-400',
    },
    {
        id: 'instansi',
        title: 'Pembimbing Lapangan',
        badge: 'Mitra & Instansi',
        portalName: 'Portal Pembimbing Lapangan',
        description: 'Evaluasi langsung kinerja mahasiswa di instansi kerja praktik dan pengisian nilai lapangan.',
        placeholder: 'pembimbing@instansi.com',
        icon: Briefcase,
        accentColor: 'rose',
        accentGradient: 'from-rose-500 to-pink-600',
        buttonGradient: 'from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-600/30',
        borderHover: 'hover:border-rose-500/60 hover:shadow-rose-500/10',
        glowColor: 'bg-rose-500/15',
        badgeBg: 'bg-rose-500/10 border-rose-500/20',
        badgeText: 'text-rose-400',
    },
];

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
    initialRole?: RoleId;
}

export default function Login({ status, canResetPassword = true, initialRole }: LoginProps) {
    const { props } = usePage();
    const pageErrors = props.errors as Record<string, string>;

    // Cek apakah ada query param ?role=... dari URL jika initialRole kosong
    const getInitialRole = (): RoleId | null => {
        if (initialRole && ROLES.some(r => r.id === initialRole)) {
            return initialRole;
        }
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const roleParam = params.get('role') as RoleId;
            if (roleParam && ROLES.some(r => r.id === roleParam)) {
                return roleParam;
            }
        }
        return null;
    };

    const [selectedRole, setSelectedRole] = useState<RoleId | null>(getInitialRole);
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        role: selectedRole || '',
    });

    // Update role form saat role berubah
    useEffect(() => {
        if (selectedRole) {
            setData('role', selectedRole);
        }
    }, [selectedRole]);

    const activeRole = ROLES.find((r) => r.id === selectedRole);
    const emailError = errors.email || pageErrors?.email;
    const passwordError = errors.password || pageErrors?.password;

    const handleSelectRole = (roleId: RoleId) => {
        setSelectedRole(roleId);
        setData('role', roleId);
        // Update URL tanpa reload
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('role', roleId);
            window.history.replaceState({}, '', url.toString());
        }
    };

    const handleBackToRoles = () => {
        setSelectedRole(null);
        setData('role', '');
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('role');
            window.history.replaceState({}, '', url.toString());
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title={activeRole ? `Login ${activeRole.title} - SI-KP UTM` : 'Pilih Portal Masuk - SI-KP UTM'} />

            <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden bg-slate-950 font-sans text-slate-100">
                
                {/* 1. Glowing Radial Gradients (Mesh Background) */}
                <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-blue-600/25 to-cyan-500/5 blur-[140px] pointer-events-none" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-indigo-600/20 to-purple-500/5 blur-[140px] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45vw] h-[45vw] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none" />

                {/* 2. Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />

                {/* Main Content Area */}
                <div className="w-full relative z-10 flex flex-col items-center">

                    {/* Portal Header */}
                    <div className="text-center space-y-3 mb-6 sm:mb-8">
                        <div className="flex justify-center">
                            <div className="bg-white/95 backdrop-blur p-2.5 rounded-2xl shadow-xl shadow-blue-500/10 border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105">
                                <img 
                                    src="/images/Logo UTM terbaru_berwarna (1).png" 
                                    alt="Logo UTM" 
                                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain" 
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[11px] font-semibold tracking-wider uppercase">
                                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                <span>Sistem Informasi Kerja Praktik</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 tracking-tight">
                                TEKNIK INFORMATIKA
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
                                Universitas Trunodjoyo Madura
                            </p>
                        </div>
                    </div>

                    {/* Global Status Alert */}
                    {status && (
                        <div className="w-full max-w-md mb-6 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-4 py-3 rounded-2xl shadow-lg text-center backdrop-blur">
                            {status}
                        </div>
                    )}

                    {/* ======================================================== */}
                    {/* VIEW 1: MENU 5 KOTAK PILIHAN ROLE (ROLE SELECTION)       */}
                    {/* ======================================================== */}
                    {!selectedRole ? (
                        <div className="w-full max-w-5xl space-y-6">

                            {/* Menu Header */}
                            <div className="text-center space-y-1.5 mb-2">
                                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                                    Pilih Akses Sistem Informasi Kerja Praktik
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                                    Silakan tentukan hak akses portal sesuai dengan peran Anda untuk melanjutkan
                                </p>
                            </div>

                            {/* 5-Box Grid Layout: 3 in row 1, 2 centered in row 2 on desktop */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
                                {ROLES.map((role, idx) => {
                                    const IconComponent = role.icon;
                                    const gridSpanClass = idx < 3
                                        ? 'lg:col-span-2'
                                        : idx === 3
                                            ? 'lg:col-start-2 lg:col-span-2'
                                            : 'lg:col-span-2';

                                    return (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => handleSelectRole(role.id)}
                                            className={`${gridSpanClass} group relative text-left bg-slate-900/80 hover:bg-slate-900 backdrop-blur-xl border border-slate-800/90 ${role.borderHover} rounded-3xl p-5 sm:p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.98]`}
                                        >
                                            {/* Glow overlay inside card */}
                                            <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full ${role.glowColor} blur-2xl pointer-events-none transition-all duration-500 group-hover:scale-150 group-hover:opacity-100 opacity-40`} />

                                            <div className="space-y-4 relative z-10">
                                                {/* Top Row: Icon and Badge */}
                                                <div className="flex items-center justify-between">
                                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${role.accentGradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                                        <IconComponent className="w-6 h-6" />
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${role.badgeBg} ${role.badgeText}`}>
                                                        {role.badge}
                                                    </span>
                                                </div>

                                                {/* Title & Description */}
                                                <div className="space-y-1.5">
                                                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                                                        {role.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                                                        {role.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Bottom Action Hint */}
                                            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white transition-colors relative z-10">
                                                <span>Pilih & Masuk</span>
                                                <div className="w-7 h-7 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
                                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        /* ======================================================== */
                        /* VIEW 2: DEDICATED LOGIN FORM FOR SELECTED ROLE           */
                        /* ======================================================== */
                        activeRole && (
                            <div className="w-full max-w-[460px] space-y-4 animate-in fade-in zoom-in-95 duration-200">
                                
                                {/* Back to 5 Boxes Button */}
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={handleBackToRoles}
                                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all shadow-sm hover:-translate-x-0.5 active:scale-95 cursor-pointer"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Pilih Peran Lain</span>
                                    </button>

                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                                        <span>Peran Aktif:</span>
                                        <span className={`px-2 py-0.5 rounded-md border text-[10px] uppercase tracking-wider ${activeRole.badgeBg} ${activeRole.badgeText}`}>
                                            {activeRole.title}
                                        </span>
                                    </div>
                                </div>

                                {/* White Login Card */}
                                <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-2xl border border-slate-100 text-slate-800 relative overflow-hidden">
                                    
                                    {/* Top Card Role Banner */}
                                    <div className="flex items-start gap-4 mb-6 pb-5 border-b border-slate-100">
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeRole.accentGradient} flex-shrink-0 flex items-center justify-center text-white shadow-md`}>
                                            <activeRole.icon className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-0.5 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                                    Masuk {activeRole.title}
                                                </h2>
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium leading-tight">
                                                {activeRole.id === 'mahasiswa' 
                                                    ? 'Masuk menggunakan NIM dan kata sandi Anda' 
                                                    : 'Gunakan akun yang telah terdaftar untuk role ini'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Main Login Form */}
                                    <form className="space-y-4" onSubmit={submit}>
                                        <input type="hidden" name="role" value={data.role} />

                                        {/* NIM / Email Field */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block" htmlFor="email">
                                                {activeRole.id === 'mahasiswa' ? 'Nomor Induk Mahasiswa (NIM)' : activeRole.id === 'dosen' ? 'Nomor Induk Pegawai (NIP) / Email' : 'Alamat Email / Akun'}
                                            </label>
                                            <div className="relative group">
                                                {activeRole.id === 'mahasiswa' ? (
                                                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                                ) : (
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                                )}
                                                <input
                                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50/50 hover:bg-white text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal ${
                                                        emailError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30' : 'border-slate-200'
                                                    }`}
                                                    id="email"
                                                    name="email"
                                                    placeholder={activeRole.placeholder}
                                                    type={activeRole.id === 'mahasiswa' || activeRole.id === 'dosen' ? 'text' : 'email'}
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                            {emailError && (
                                                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-600 flex items-start gap-2">
                                                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
                                                    <span>{emailError}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Password Field */}
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block" htmlFor="password">
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
                                                    className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-slate-50/50 hover:bg-white text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-400 ${
                                                        passwordError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30' : 'border-slate-200'
                                                    }`}
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
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                                >
                                                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {passwordError && <p className="text-xs font-semibold text-red-500 mt-1">{passwordError}</p>}
                                        </div>

                                        {/* Remember Me */}
                                        <div className="flex items-center justify-between py-1">
                                            <label className="flex items-center gap-2.5 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                    checked={data.remember}
                                                    onChange={(e) => setData('remember', e.target.checked)}
                                                />
                                                <span className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                                                    Ingat sesi masuk saya
                                                </span>
                                            </label>
                                        </div>

                                        {/* Submit Button with Role-themed Gradient */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`w-full bg-gradient-to-r ${activeRole.buttonGradient} text-white py-3.5 px-6 rounded-xl font-bold transition-all duration-200 active:scale-[0.98] shadow-lg flex items-center justify-center gap-2.5 disabled:opacity-50 text-sm cursor-pointer`}
                                        >
                                            <span>{processing ? 'Memverifikasi...' : `Masuk sebagai ${activeRole.title}`}</span>
                                            <LogIn className="w-4 h-4" />
                                        </button>
                                    </form>

                                    {/* ROLE-SPECIFIC FOOTER ACTIONS */}
                                    {selectedRole === 'mahasiswa' && (
                                        <div className="mt-5 text-center">
                                            <p className="text-xs font-semibold text-slate-500">
                                                Belum punya akun mahasiswa?{' '}
                                                <Link href={route('register')} className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                                                    Daftar Akun Baru
                                                </Link>
                                            </p>
                                        </div>
                                    )}

                                    {selectedRole === 'instansi' && (
                                        <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
                                            <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-100 text-xs text-slate-600 leading-relaxed">
                                                <span className="font-bold text-rose-700">Mitra Baru: </span>
                                                Jika perusahaan/instansi Anda belum terdaftar sebagai pembimbing lapangan, silakan lakukan registrasi mandiri.
                                            </div>
                                            <Link 
                                                href={route('register.pl')} 
                                                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-200"
                                            >
                                                <Building2 className="w-4 h-4 text-rose-600" />
                                                Registrasi Akun Pembimbing Lapangan (Instansi)
                                            </Link>
                                        </div>
                                    )}

                                    {(selectedRole === 'dosen' || selectedRole === 'prodi' || selectedRole === 'tu') && (
                                        <div className="mt-5 pt-4 border-t border-slate-100">
                                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 flex items-start gap-2 leading-relaxed">
                                                <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                                <span>
                                                    Akun dosen dan staf dikelola langsung oleh Administrator Sistem / Tata Usaha Fakultas. Hubungi TU jika mengalami kendala login.
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Quick Switch to Other Roles */}
                                    <div className="mt-6 pt-4 border-t border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
                                            Ganti ke Peran Lain
                                        </p>
                                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                                            {ROLES.filter(r => r.id !== selectedRole).map(r => {
                                                const MiniIcon = r.icon;
                                                return (
                                                    <button
                                                        key={r.id}
                                                        type="button"
                                                        onClick={() => handleSelectRole(r.id)}
                                                        className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                                        title={`Beralih ke ${r.title}`}
                                                    >
                                                        <MiniIcon className="w-3.5 h-3.5 text-slate-500" />
                                                        <span>{r.title}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Portal Footer */}
                <footer className="mt-10 text-center space-y-1 relative z-10">
                    <p className="text-[11px] text-slate-500 font-medium">
                        © 2026 Teknik Informatika, Fakultas Teknik, Universitas Trunodjoyo Madura.
                    </p>
                    <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 font-semibold">
                        <span>Sistem Informasi Kerja Praktik (SI-KP)</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                        <a href="#" className="hover:text-slate-400 transition-colors">Panduan Sistem</a>
                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                        <a href="#" className="hover:text-slate-400 transition-colors">Bantuan</a>
                    </div>
                </footer>
            </main>
        </>
    );
}
