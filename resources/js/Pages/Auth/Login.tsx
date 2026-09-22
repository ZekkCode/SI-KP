import { FormEventHandler, useState, useEffect } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import InterfaceTour from '@/Components/InterfaceTour';
import { useTranslation } from '@/hooks/useTranslation';
import { 
    GraduationCap, 
    Award, 
    Building, 
    Briefcase, 
    ShieldCheck, 
    User, 
    Lock, 
    Eye, 
    EyeOff, 
    LogIn, 
    ArrowLeft, 
    ArrowRight, 
    Info, 
    MapPin,
    Phone,
    Mail,
    BookOpen,
    ExternalLink,
    Building2,
    Compass
} from 'lucide-react';


export type RoleId = 'mahasiswa' | 'dosen' | 'tu' | 'instansi' | 'prodi';

interface RoleConfig {
    id: RoleId;
    title: string;
    badge: string;
    portalName: string;
    description: string;
    labelInput: string;
    placeholder: string;
    icon: typeof GraduationCap;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    iconBg: string;
    iconColor: string;
}

const ROLES: RoleConfig[] = [
    {
        id: 'mahasiswa',
        title: 'Mahasiswa',
        badge: 'S1 Informatika',
        portalName: 'Portal Mahasiswa',
        description: 'Ajukan pendaftaran KP, isi catatan harian logbook, pantau bimbingan, dan daftar seminar hasil.',
        labelInput: 'NIM atau Email Kampus',
        placeholder: 'Masukkan NIM atau email @student.trunojoyo.ac.id',
        icon: GraduationCap,
        badgeBg: 'bg-blue-50',
        badgeBorder: 'border-blue-200',
        badgeText: 'text-blue-700',
        iconBg: 'bg-blue-50/90',
        iconColor: 'text-[#00288e]',
    },
    {
        id: 'dosen',
        title: 'Dosen Pembimbing',
        badge: 'Tenaga Pengajar',
        portalName: 'Portal Dosen Pembimbing',
        description: 'Pantau progres bimbingan, tinjau logbook kegiatan mahasiswa, dan berikan penilaian seminar.',
        labelInput: 'NIP atau Email Dosen',
        placeholder: 'Masukkan NIP atau email @trunojoyo.ac.id',
        icon: Award,
        badgeBg: 'bg-emerald-50',
        badgeBorder: 'border-emerald-200',
        badgeText: 'text-emerald-700',
        iconBg: 'bg-emerald-50/90',
        iconColor: 'text-emerald-700',
    },
    {
        id: 'tu',
        title: 'Tata Usaha (TU)',
        badge: 'Administrasi Fakultas',
        portalName: 'Portal Tata Usaha',
        description: 'Verifikasi berkas persyaratan, terbitkan surat pengantar, dan kelola administrasi resmi.',
        labelInput: 'Email atau Nama Pengguna TU',
        placeholder: 'Masukkan email atau username staf TU',
        icon: Building,
        badgeBg: 'bg-amber-50',
        badgeBorder: 'border-amber-200',
        badgeText: 'text-amber-700',
        iconBg: 'bg-amber-50/90',
        iconColor: 'text-amber-700',
    },
    {
        id: 'instansi',
        title: 'Pembimbing Lapangan',
        badge: 'Mitra & Instansi',
        portalName: 'Portal Pembimbing Lapangan',
        description: 'Pantau aktivitas mahasiswa di instansi mitra dan berikan evaluasi nilai kinerja lapangan.',
        labelInput: 'Email Pembimbing Lapangan',
        placeholder: 'Masukkan alamat email pembimbing lapangan',
        icon: Briefcase,
        badgeBg: 'bg-rose-50',
        badgeBorder: 'border-rose-200',
        badgeText: 'text-rose-700',
        iconBg: 'bg-rose-50/90',
        iconColor: 'text-rose-700',
    },
    {
        id: 'prodi',
        title: 'Koordinator KP',
        badge: 'Koordinator Prodi',
        portalName: 'Portal Koordinator KP',
        description: 'Verifikasi pendaftaran, tetapkan dosen pembimbing, atur kuota, dan terbitkan berita acara.',
        labelInput: 'Email atau Nama Pengguna Koordinator',
        placeholder: 'Masukkan email atau username koordinator',
        icon: ShieldCheck,
        badgeBg: 'bg-indigo-50',
        badgeBorder: 'border-indigo-200',
        badgeText: 'text-indigo-700',
        iconBg: 'bg-indigo-50/90',
        iconColor: 'text-indigo-700',
    },
];

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
    initialRole?: RoleId;
}

export default function Login({ status, canResetPassword = true, initialRole }: LoginProps) {
    const { props } = usePage();
    const { t } = useTranslation();
    const [isTourOpen, setIsTourOpen] = useState(false);
    const pageErrors = props.errors as Record<string, string>;


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

    const activeRole = ROLES.find((r) => r.id === selectedRole);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        role: selectedRole || '',
    });

    useEffect(() => {
        if (selectedRole) {
            setData('role', selectedRole);
        }
    }, [selectedRole]);

    const emailError = errors.email || pageErrors?.email;
    const passwordError = errors.password || pageErrors?.password;

    const handleSelectRole = (roleId: RoleId) => {
        setSelectedRole(roleId);
        setData('role', roleId);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('role', roleId);
            url.searchParams.delete('prodi');
            window.history.replaceState({}, '', url.toString());
        }
    };

    const handleBackToRoles = () => {
        setSelectedRole(null);
        setData('role', '');
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('role');
            url.searchParams.delete('prodi');
            window.history.replaceState({}, '', url.toString());
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    const campus = (props as any)?.campus;
    const campusAddress = campus?.address || 'Jl. Raya Telang, PO BOX 2 Kamal, Bangkalan';
    const campusPhone = campus?.phone || '031-3011147';
    const campusEmail = campus?.email || 'tif@trunojoyo.ac.id';
    const cleanPhone = campusPhone.replace(/[^0-9]/g, '');

    return (

        <>
            <Head 
                title={
                    activeRole 
                        ? `Masuk ${activeRole.title} - SI-KP TEKNIK INFORMATIKA` 
                        : 'Pilih Peran Masuk - SI-KP TEKNIK INFORMATIKA'
                } 
            />

            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased w-full overflow-x-hidden">
                
                {/* 1. TOP CONTACT BAR */}
                <header id="tour-contact-bar" className="bg-white border-b border-slate-200 py-1.5 text-xs text-slate-600 hidden md:block w-full">
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

                {/* 2. NAVBAR RESMI TEKNIK INFORMATIKA */}
                <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40 shadow-xs">
                    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-13 sm:h-15 flex items-center justify-between gap-2">
                        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0 flex-1">
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
                            <div id="tour-language">
                                <LanguageSwitcher />
                            </div>

                            <Link 
                                id="tour-panduan"
                                href="/panduan" 
                                className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-xs"
                                title="Halaman Panduan"
                            >
                                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 shrink-0" />
                                <span className="hidden sm:inline">Panduan</span>
                            </Link>

                            <button
                                id="tour-trigger-btn"
                                type="button"
                                onClick={() => setIsTourOpen(true)}
                                className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 border border-blue-200 rounded-lg bg-blue-50/70 hover:bg-blue-100 text-[#00288e] text-xs font-semibold transition cursor-pointer shadow-xs"
                                title={t('tour.btn_label', undefined, 'Petunjuk Fitur')}
                            >
                                <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00288e] shrink-0" />
                                <span className="hidden md:inline">{t('tour.btn_label', undefined, 'Petunjuk Fitur')}</span>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* 3. KONTEN UTAMA */}
                <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col justify-center items-center">

                    {/* Global Status Alert */}
                    {status && (
                        <div className="w-full max-w-md mb-4 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-lg text-center shadow-xs">
                            {status}
                        </div>
                    )}

                    {/* VIEW 1: PILIH PERAN MASUK (5 BOXES SEPERTI SEBELUMNYA) */}
                    {!selectedRole || !activeRole ? (
                        <div className="w-full max-w-5xl space-y-6">
                            
                            {/* Section Header */}
                            <div className="text-center space-y-1.5 mb-2">
                                <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#00288e] bg-blue-50 border border-blue-200 px-3 py-0.5 rounded-md">
                                    Portal Resmi Kerja Praktik
                                </span>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                                    Pilih Portal Masuk
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
                                    Pilih peran akun Anda untuk mengakses layanan Kerja Praktik Teknik Informatika UTM.
                                </p>
                            </div>

                            {/* 5-Box Grid Layout (3 row 1, 2 centered row 2) */}
                            <div id="tour-roles" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5 w-full">
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
                                            className={`${gridSpanClass} bg-white border border-slate-200 hover:border-[#00288e] rounded-xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between text-left cursor-pointer group shadow-xs hover:shadow-md hover:-translate-y-0.5`}
                                        >
                                            <div className="space-y-4">
                                                {/* Top Row: Icon and Badge */}
                                                <div className="flex items-center justify-between">
                                                    <div className={`w-12 h-12 rounded-xl ${role.iconBg} border border-slate-100 flex items-center justify-center ${role.iconColor} group-hover:scale-105 transition-transform duration-200 shadow-xs`}>
                                                        <IconComponent className="w-6 h-6" />
                                                    </div>
                                                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${role.badgeBg} ${role.badgeBorder} ${role.badgeText}`}>
                                                        {role.badge}
                                                    </span>
                                                </div>

                                                {/* Title & Description */}
                                                <div className="space-y-1">
                                                    <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#00288e] transition-colors leading-snug">
                                                        {role.title}
                                                    </h2>
                                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                                        {role.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Bottom Action Hint */}
                                            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-[#00288e] transition-colors">
                                                <span>Masuk Portal</span>
                                                <div className="w-6 h-6 rounded-lg bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Banner Google SSO Masuk Cepat */}
                            <div 
                                id="tour-google-sso" 
                                className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs transition-colors"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
                                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                                            <span>Masuk Cepat via Akun Kampus</span>
                                            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#00288e] border border-blue-200">
                                                SSO UTM
                                            </span>
                                        </div>
                                        <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                                            Khusus akun resmi mahasiswa (<span className="text-[#00288e] font-semibold">@student.trunojoyo.ac.id</span>) dan dosen (<span className="text-[#00288e] font-semibold">@trunojoyo.ac.id</span>)
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href={route('auth.google')}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00288e] hover:bg-[#001f70] text-white rounded-lg text-xs font-semibold transition shrink-0 cursor-pointer shadow-xs"
                                >
                                    <span>Masuk via Google Kampus</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </div>

                            {/* Pilihan Registrasi */}
                            <div className="pt-2 text-center flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
                                <span>Belum punya akun?</span>
                                <Link href={route('register')} className="font-semibold text-[#00288e] hover:underline">
                                    Daftar Akun Mahasiswa
                                </Link>
                                <span className="text-slate-300">•</span>
                                <Link href={route('register.pl')} className="font-semibold text-[#00288e] hover:underline">
                                    Registrasi Pembimbing Lapangan (Mitra)
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* VIEW 2: FORM LOGIN TUNGGAL SESUAI PERAN */
                        <div className="w-full max-w-md space-y-4">
                            
                            {/* Bar Kembali ke Pilihan Peran */}
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={handleBackToRoles}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Pilih Peran Lain</span>
                                </button>

                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${activeRole.badgeBg} border ${activeRole.badgeBorder} rounded-md text-[11px] font-bold ${activeRole.badgeText}`}>
                                    <activeRole.icon className="w-3.5 h-3.5" />
                                    <span>Peran: {activeRole.title}</span>
                                </div>
                            </div>

                            {/* Card Form Login */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
                                
                                {/* Header Card */}
                                <div className="border-b border-slate-100 pb-4 mb-5 text-center sm:text-left">
                                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                                        <div className={`w-12 h-12 ${activeRole.iconBg} border border-slate-100 rounded-xl flex items-center justify-center ${activeRole.iconColor} p-2 shrink-0 shadow-xs`}>
                                            <activeRole.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-[10px] font-bold text-[#00288e] tracking-wide uppercase mb-1">
                                                SI-KP TEKNIK INFORMATIKA
                                            </div>
                                            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                                                Masuk {activeRole.title}
                                            </h2>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {activeRole.portalName} • S1 Teknik Informatika UTM
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Kredensial */}
                                <form className="space-y-4" onSubmit={submit}>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="email">
                                            {activeRole.labelInput}
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                className={`w-full pl-9 pr-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-[#00288e] transition ${
                                                    emailError ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                                                }`}
                                                id="email"
                                                name="email"
                                                placeholder={activeRole.placeholder}
                                                type="text"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                                autoComplete="username"
                                                autoFocus
                                            />
                                        </div>
                                        {emailError && (
                                            <div className="mt-1.5 p-2 bg-red-50 border border-red-200 text-xs font-medium text-red-700 rounded-md flex items-start gap-1.5">
                                                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-600" />
                                                <span>{emailError}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block" htmlFor="password">
                                                Kata Sandi
                                            </label>
                                            {canResetPassword && (
                                                <Link href="/forgot-password" className="text-xs font-semibold text-[#00288e] hover:underline">
                                                    Lupa Sandi?
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-[#00288e] transition ${
                                                    passwordError ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                                                }`}
                                                id="password"
                                                name="password"
                                                placeholder="••••••••"
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                                title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                                            >
                                                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {passwordError && <p className="text-xs font-medium text-red-600 mt-1">{passwordError}</p>}
                                    </div>

                                    {/* Remember Me */}
                                    <div className="flex items-center">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-slate-300 text-[#00288e] focus:ring-0 cursor-pointer"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                            />
                                            <span className="text-xs text-slate-600">
                                                Ingat sesi saya
                                            </span>
                                        </label>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-[#00288e] hover:bg-[#001f70] active:bg-[#001550] text-white py-2.5 px-4 font-semibold rounded-lg transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>{processing ? 'Memverifikasi...' : `Masuk sebagai ${activeRole.title}`}</span>
                                    </button>
                                </form>

                                {/* Google Login Option (Mahasiswa & Dosen) */}
                                {(selectedRole === 'mahasiswa' || selectedRole === 'dosen') && (
                                    <div className="mt-4">
                                        <div className="relative my-3.5">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-slate-200" />
                                            </div>
                                            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                                                <span className="bg-white px-3 text-slate-400 font-medium">atau masuk dengan</span>
                                            </div>
                                        </div>

                                        <a
                                            href={route('auth.google')}
                                            className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 py-2.5 px-4 font-semibold rounded-lg transition text-xs flex items-center justify-center gap-2.5 shadow-xs cursor-pointer"
                                        >
                                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
                                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                                            </svg>
                                            <span>Masuk dengan Akun Google Kampus</span>
                                        </a>
                                        <p className="text-[11px] text-slate-500 text-center mt-1.5 font-medium">
                                            {selectedRole === 'mahasiswa' ? (
                                                <>Khusus akun resmi mahasiswa <span className="text-[#00288e] font-semibold">@student.trunojoyo.ac.id</span></>
                                            ) : (
                                                <>Khusus akun resmi dosen <span className="text-[#00288e] font-semibold">@trunojoyo.ac.id</span></>
                                            )}
                                        </p>
                                    </div>
                                )}

                                {/* Catatan dan link registrasi sesuai role */}
                                {selectedRole === 'mahasiswa' && (
                                    <div className="mt-4 pt-3.5 border-t border-slate-100 text-center">
                                        <p className="text-xs text-slate-500">
                                            Belum punya akun mahasiswa?{' '}
                                            <Link href={route('register')} className="text-[#00288e] font-semibold hover:underline">
                                                Daftar Sekarang
                                            </Link>
                                        </p>
                                    </div>
                                )}

                                {selectedRole === 'instansi' && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
                                        <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-xs text-slate-600 leading-relaxed">
                                            <span className="font-semibold text-rose-800">Mitra Baru: </span>
                                            Daftarkan instansi atau perusahaan Anda jika belum memiliki akun pembimbing lapangan.
                                        </div>
                                        <Link
                                            href={route('register.pl')}
                                            className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-slate-200"
                                        >
                                            <Building2 className="w-3.5 h-3.5 text-rose-600" />
                                            <span>Daftar Pembimbing Lapangan</span>
                                        </Link>
                                    </div>
                                )}

                                {(selectedRole === 'dosen' || selectedRole === 'tu' || selectedRole === 'prodi') && (
                                    <div className="mt-4 pt-3.5 border-t border-slate-100">
                                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2 leading-relaxed">
                                            <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                            <span>
                                                Akun dosen dan staf dikelola oleh Tata Usaha Fakultas Teknik. Hubungi bagian TU jika membutuhkan bantuan akses akun.
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>

                {/* 4. FOOTER INSTITUSI */}
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

            {/* Interactive First Visit Interface Tour */}
            <InterfaceTour 
                isOpen={isTourOpen} 
                onClose={() => setIsTourOpen(false)} 
                autoStart={true} 
            />
        </>
    );
}
