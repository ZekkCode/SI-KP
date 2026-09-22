import { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, UserCircle, BookOpen, ClipboardEdit, ClipboardCheck,
    FileText, File, CalendarDays, FileClock, Award, Bell, LogOut, Menu, BellRing, FileCheck,
} from 'lucide-react';
import { getAvatarUrl } from '@/utils/avatar';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from '@/Components/LanguageSwitcher';

export default function MahasiswaLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage();
    const user = (props as any).auth?.user;
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifications = (props as any).auth?.notifications || [];
    const unreadCount = notifications.filter((n: any) => !n.is_read).length;

    const avatarUrl = getAvatarUrl(user?.avatar || user?.foto);

    const navItems = [
        { href: '/mahasiswa/dashboard', label: t('nav.dashboard', undefined, 'Dashboard'), icon: LayoutDashboard },
        { href: '/panduan', label: t('nav.panduan', undefined, 'Buku Panduan'), icon: BookOpen },
        { href: '/mahasiswa/pendaftaran', label: t('nav.pendaftaran', undefined, 'Pendaftaran'), icon: ClipboardEdit },
        { href: '/mahasiswa/status-pengajuan', label: t('nav.status_pengajuan', undefined, 'Status Pengajuan'), icon: ClipboardCheck },
        { href: '/mahasiswa/surat-pengantar', label: t('nav.surat_pengantar', undefined, 'Surat Pengantar'), icon: FileText },
        { href: '/mahasiswa/proposal', label: t('nav.proposal', undefined, 'Proposal'), icon: File },
        { href: '/mahasiswa/logbook', label: t('nav.monitoring', undefined, 'Monitoring Logbook'), icon: BookOpen },
        { href: '/mahasiswa/berita-acara', label: t('nav.berita_acara', undefined, 'Berita Acara'), icon: FileClock },
        { href: '/mahasiswa/dokumen-akhir', label: t('nav.laporan_akhir', undefined, 'Laporan Akhir'), icon: FileCheck },
        { href: '/mahasiswa/penilaian', label: t('nav.penilaian', undefined, 'Penilaian Akhir'), icon: Award },
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
                        ✕
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
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                                    isActive
                                        ? 'bg-[#00288e] text-white shadow-xs font-bold'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span>{item.label}</span>
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
                                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                    <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                        <h3 className="text-xs font-bold text-slate-900">{t('header.notifications', undefined, 'Notifikasi')}</h3>
                                        <span className="text-[11px] text-[#00288e] font-semibold cursor-pointer hover:underline">
                                            {t('header.mark_all_read', undefined, 'Tandai semua dibaca')}
                                        </span>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif: any) => (
                                                <div key={notif.id} className={`p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-blue-50/40' : ''}`}>
                                                    <div className="flex gap-2.5">
                                                        <div className={`p-1.5 rounded-full shrink-0 ${notif.tipe === 'info' ? 'bg-blue-100 text-blue-600' : notif.tipe === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                            <BellRing className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-bold text-slate-900 mb-0.5">{notif.judul}</h4>
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

