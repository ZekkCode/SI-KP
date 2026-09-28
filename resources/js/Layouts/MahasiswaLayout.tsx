import { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, UserCircle, BookOpen, ClipboardEdit, ClipboardCheck,
    FileText, File, CalendarDays, FileClock, Award, Bell, LogOut, Menu, BellRing, FileCheck, X,
    Lock, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { getAvatarUrl } from '@/utils/avatar';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from '@/Components/LanguageSwitcher';

export default function MahasiswaLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage();
    const user = (props as any).auth?.user;
    const kpProgress = (props as any).kp_progress;
    const flash = (props as any).flash;
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [filterPriority, setFilterPriority] = useState<'important' | 'all'>('important');
    const notifications = (props as any).auth?.notifications || [];
    const unreadCount = notifications.filter((n: any) => !n.is_read).length;

    const avatarUrl = getAvatarUrl(user?.avatar || user?.foto);

    const navItems = [
        { href: '/mahasiswa/dashboard', label: t('nav.dashboard', undefined, 'Dashboard'), icon: LayoutDashboard, step: null },
        { href: '/panduan', label: t('nav.panduan', undefined, 'Buku Panduan'), icon: BookOpen, step: null },
        { href: '/mahasiswa/pendaftaran', label: t('nav.pendaftaran', undefined, 'Pendaftaran'), icon: ClipboardEdit, step: 1 },
        { href: '/mahasiswa/status-pengajuan', label: t('nav.status_pengajuan', undefined, 'Status Pengajuan'), icon: ClipboardCheck, step: 1 },
        { href: '/mahasiswa/surat-pengantar', label: t('nav.surat_pengantar', undefined, 'Surat Pengantar'), icon: FileText, step: 2 },
        { href: '/mahasiswa/proposal', label: t('nav.proposal', undefined, 'Proposal'), icon: File, step: 4 },
        { href: '/mahasiswa/logbook', label: t('nav.monitoring', undefined, 'Monitoring Logbook'), icon: BookOpen, step: 6 },
        { href: '/mahasiswa/dokumen-akhir', label: t('nav.laporan_akhir', undefined, 'Laporan Akhir'), icon: FileCheck, step: 7 },
        { href: '/mahasiswa/berita-acara', label: t('nav.berita_acara', undefined, 'Berita Acara'), icon: FileClock, step: 7 },
        { href: '/mahasiswa/sidang', label: 'Sidang KP', icon: CalendarDays, step: 8 },
        { href: '/mahasiswa/penilaian', label: t('nav.penilaian', undefined, 'Penilaian Akhir'), icon: Award, step: 9 },
    ];

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 z-50 flex flex-col shadow-xs transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Profile Widget */}
                <div className="px-5 py-6 flex flex-col items-center border-b border-slate-100 relative">
                    <button 
                        className="absolute top-3 right-3 md:hidden text-slate-400 hover:text-slate-600 p-1" 
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    <div className="w-18 h-18 rounded-full bg-blue-50 border-2 border-blue-100 text-[#00288e] flex items-center justify-center mb-3 overflow-hidden font-bold text-xl shadow-xs relative">
                        {avatarUrl ? (
                            <img 
                                src={avatarUrl} 
                                alt={user?.name || 'Avatar'} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <span>{user?.name?.substring(0, 2).toUpperCase() || 'MH'}</span>
                        )}
                    </div>
                    
                    <h2 className="text-sm font-bold text-slate-900 leading-tight text-center px-2 line-clamp-1" title={user?.name}>
                        {user?.name || 'Mahasiswa'}
                    </h2>
                    <p className="text-xs font-medium text-slate-500 text-center mt-0.5">
                        {user?.nim || (user?.program_studi?.nama || 'Teknik Informatika')}
                    </p>
                    <span className="mt-1.5 px-2.5 py-0.5 bg-blue-50 text-[#00288e] border border-blue-200/60 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                        {t('header.role_mahasiswa', undefined, 'Mahasiswa')}
                    </span>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
                    {navItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        const isLocked = item.step !== null && kpProgress && (item.step > kpProgress.max_unlocked_step);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                title={isLocked ? `Tahap ${item.step} terkunci. Selesaikan tahapan sebelumnya terlebih dahulu.` : undefined}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                                    isActive
                                        ? 'bg-[#00288e] text-white shadow-xs font-bold'
                                        : isLocked
                                            ? 'text-slate-400 hover:bg-slate-50 hover:text-slate-500 opacity-75'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <div className="flex items-center space-x-3 truncate">
                                    <Icon className={`w-4 h-4 shrink-0 ${isLocked ? 'text-slate-400' : ''}`} />
                                    <span className="truncate">{item.label}</span>
                                </div>
                                {isLocked && (
                                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-3 border-t border-slate-100">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 text-slate-600 hover:bg-red-50 hover:text-red-600 text-left outline-none cursor-pointer"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span>{t('nav.keluar', undefined, 'Keluar')}</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:ml-64 min-h-screen relative w-full overflow-hidden">
                {/* Top App Bar */}
                <header className="sticky top-0 z-40 flex justify-between items-center w-full px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200 shadow-xs">
                    <div className="flex items-center gap-3">
                        <button 
                            className="md:hidden text-slate-600 hover:bg-slate-100 p-2 rounded-lg" 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-sm sm:text-base font-bold text-[#00288e] leading-tight">
                                {t('header.title', undefined, 'SI-KP Teknik Informatika')}
                            </h2>
                            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                                {t('header.subtitle', undefined, 'Sistem Informasi Kerja Praktik • Universitas Trunojoyo Madura')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* Language Switcher */}
                        <LanguageSwitcher />

                        {/* Panduan Button */}
                        <Link
                            href="/panduan"
                            className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-xs"
                            title={t('nav.panduan', undefined, 'Buku Panduan')}
                        >
                            <BookOpen className="w-3.5 h-3.5 text-[#00288e] shrink-0" />
                            <span className="hidden sm:inline">{t('nav.panduan', undefined, 'Panduan')}</span>
                        </Link>

                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 relative cursor-pointer"
                                title={t('header.notifications', undefined, 'Notifikasi')}
                            >
                                <Bell className="w-4 h-4" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-red-600 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            {isNotifOpen && (
                                <div className="absolute right-0 mt-2 w-84 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                    <div className="p-3 border-b border-slate-100 bg-slate-50 flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xs font-bold text-slate-900">{t('header.notifications', undefined, 'Notifikasi')}</h3>
                                            <span className="text-[11px] text-[#00288e] font-semibold cursor-pointer hover:underline">
                                                {t('header.mark_all_read', undefined, 'Tandai semua dibaca')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-lg text-[11px]">
                                            <button
                                                type="button"
                                                onClick={() => setFilterPriority('important')}
                                                className={`flex-1 py-1 text-center font-semibold rounded-md transition ${filterPriority === 'important' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                                            >
                                                Penting ({notifications.filter((n: any) => n.priority === 'high' || n.priority === 'normal' || !n.priority).length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFilterPriority('all')}
                                                className={`flex-1 py-1 text-center font-semibold rounded-md transition ${filterPriority === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                                            >
                                                Semua ({notifications.length})
                                            </button>
                                        </div>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications
                                                .filter((notif: any) => filterPriority === 'all' || notif.priority === 'high' || notif.priority === 'normal' || !notif.priority)
                                                .map((notif: any) => (
                                                <div key={notif.id} className={`p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-blue-50/40' : ''}`}>
                                                    <div className="flex gap-2.5">
                                                        <div className={`p-1.5 rounded-full shrink-0 ${notif.priority === 'high' ? 'bg-rose-100 text-rose-600' : notif.tipe === 'info' ? 'bg-blue-100 text-blue-600' : notif.tipe === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                            <BellRing className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-1 mb-0.5">
                                                                <h4 className="text-xs font-bold text-slate-900 truncate">{notif.judul}</h4>
                                                                {notif.priority === 'high' && (
                                                                    <span className="shrink-0 px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                                        Penting
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-600 line-clamp-2">{notif.pesan}</p>
                                                            <span className="text-[10px] text-slate-400 mt-1 block">{new Date(notif.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-6 text-center text-slate-500 text-xs">
                                                {t('header.no_notifications', undefined, 'Belum ada notifikasi baru.')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Link */}
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-2 p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-700"
                            title={t('header.profile', undefined, 'Profil Saya')}
                        >
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-[#00288e]">
                                {avatarUrl ? (
                                    <img 
                                        src={avatarUrl} 
                                        alt={user?.name || 'Avatar'} 
                                        className="w-full h-full object-cover" 
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <span>{user?.name?.substring(0, 2).toUpperCase() || 'MH'}</span>
                                )}
                            </div>
                            <span className="text-xs font-semibold text-slate-700 hidden lg:inline max-w-[120px] truncate">
                                {user?.name || 'Profil'}
                            </span>
                        </Link>

                        {/* Logout Link */}
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition text-xs font-semibold text-slate-600 cursor-pointer shadow-xs"
                            title={t('nav.keluar', undefined, 'Keluar')}
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t('nav.keluar', undefined, 'Keluar')}</span>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 flex flex-col w-full h-full overflow-y-auto overflow-x-hidden relative">
                    {/* Flash Alert Messages */}
                    {flash?.error && (
                        <div className="mx-4 sm:mx-6 mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1 text-xs">
                                <p className="font-bold text-amber-950">Akses Dibatasi Sistem</p>
                                <p className="mt-0.5 leading-relaxed">{flash.error}</p>
                            </div>
                        </div>
                    )}
                    {flash?.success && (
                        <div className="mx-4 sm:mx-6 mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 shadow-xs">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="flex-1 text-xs">
                                <p className="font-bold text-emerald-950">Berhasil</p>
                                <p className="mt-0.5 leading-relaxed">{flash.success}</p>
                            </div>
                        </div>
                    )}

                    {children}
                    
                    {/* Consistent Institutional Footer */}
                    <footer className="w-full py-4 px-6 flex flex-col md:flex-row justify-between items-center mt-auto border-t border-slate-200 bg-white text-xs text-slate-500">
                        <span className="mb-2 md:mb-0 text-center md:text-left font-medium">
                            {t('footer.copyright', undefined, '© 2024 - 2026 SI-KP TEKNIK INFORMATIKA • Fakultas Teknik Universitas Trunojoyo Madura. Hak Cipta Dilindungi.')}
                        </span>
                        <div className="flex items-center space-x-4 font-semibold">
                            <a 
                                href="/panduan" 
                                className="text-slate-600 hover:text-[#00288e] transition-colors"
                            >
                                {t('dashboard.guidebook', undefined, 'Buku Panduan')}
                            </a>
                            <span className="text-slate-300">•</span>
                            <a 
                                href={`mailto:${(props as any).campus?.email || 'tif@trunojoyo.ac.id'}`} 
                                className="text-slate-600 hover:text-[#00288e] transition-colors"
                            >
                                {t('footer.contact', undefined, 'Kontak Layanan')}
                            </a>
                        </div>
                    </footer>

                </main>
            </div>
        </div>
    );
}

