import { PropsWithChildren, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Users, ShieldAlert, LogOut, Menu, Bell,
    UserCheck, BookOpen, BellRing, X, AlertCircle, CheckCircle2,
    Briefcase, Award
} from 'lucide-react';
import { getAvatarUrl } from '@/utils/avatar';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from '@/Components/LanguageSwitcher';

export default function AdminLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage();
    const user = (props as any).auth?.user;
    const flash = (props as any).flash;
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const avatarUrl = getAvatarUrl(user?.avatar || user?.foto);
    const isRoot = Boolean(user?.is_root);

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard Super User', icon: LayoutDashboard },
        { href: '/panduan', label: 'Buku Panduan & SOP', icon: BookOpen },
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
                    
                    <div className="w-18 h-18 rounded-full bg-indigo-50 border-2 border-indigo-200 text-indigo-700 flex items-center justify-center mb-3 overflow-hidden font-bold text-xl shadow-xs relative">
                        {avatarUrl ? (
                            <img 
                                src={avatarUrl} 
                                alt={user?.name || 'Avatar'} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <span>{isRoot ? 'ROOT' : 'SU'}</span>
                        )}
                    </div>
                    
                    <h2 className="text-sm font-bold text-slate-900 leading-tight text-center px-2 line-clamp-1" title={user?.name}>
                        {user?.name || 'Super Administrator'}
                    </h2>
                    <p className="text-xs font-medium text-slate-500 text-center mt-0.5">
                        {user?.email || 'admin@trunojoyo.ac.id'}
                    </p>
                    <span className="mt-1.5 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        {isRoot ? 'Root Administrator' : 'Super User'}
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
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                                    isActive
                                        ? 'bg-indigo-700 text-white shadow-xs font-bold'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <div className="flex items-center space-x-3 truncate">
                                    <Icon className="w-4 h-4 shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                </div>
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
                        <span>Keluar</span>
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
                            <h2 className="text-sm sm:text-base font-bold text-indigo-900 leading-tight flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-indigo-600" />
                                Portal Super Administrator SI-KP
                            </h2>
                            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                                Pengelolaan Hak Akses &amp; Jabatan Sistem • Universitas Trunojoyo Madura
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <LanguageSwitcher />

                        <Link
                            href="/panduan"
                            className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-xs"
                            title="Buku Panduan"
                        >
                            <BookOpen className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                            <span className="hidden sm:inline">Panduan</span>
                        </Link>

                        {/* Profile Link */}
                        <Link
                            href={route('profile.edit', { from: 'admin' })}
                            className="flex items-center gap-2 p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-700"
                            title="Profil Saya"
                        >
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
                                {avatarUrl ? (
                                    <img 
                                        src={avatarUrl} 
                                        alt={user?.name || 'Avatar'} 
                                        className="w-full h-full object-cover" 
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <span>SU</span>
                                )}
                            </div>
                            <span className="text-xs font-semibold text-slate-700 hidden lg:inline max-w-[120px] truncate">
                                {user?.name || 'Super Admin'}
                            </span>
                        </Link>

                        {/* Logout Link */}
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition text-xs font-semibold text-slate-600 cursor-pointer shadow-xs"
                            title="Keluar"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Keluar</span>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 flex flex-col w-full h-full overflow-y-auto overflow-x-hidden relative">
                    {/* Flash Alert Messages */}
                    {flash?.error && (
                        <div className="mx-4 sm:mx-6 mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1 text-xs">
                                <p className="font-bold text-amber-950">Akses Dibatasi</p>
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

                    <div className="flex-1 p-4 md:p-8 max-w-[1200px] w-full mx-auto">
                        {children}
                    </div>

                    {/* Footer */}
                    <footer className="w-full py-4 px-6 flex flex-col md:flex-row justify-between items-center mt-auto border-t border-slate-200 bg-white text-xs text-slate-500">
                        <span className="mb-2 md:mb-0 text-center md:text-left font-medium">
                            © 2024 - 2026 SI-KP TEKNIK INFORMATIKA • Fakultas Teknik Universitas Trunojoyo Madura.
                        </span>
                        <div className="flex items-center space-x-4 font-semibold">
                            <span className="text-slate-400">Portal Otoritas Super User</span>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}
