import { PropsWithChildren, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Users, ListOrdered, ClipboardCheck,
    BarChart3, Settings, LogOut, Menu, Bell, HelpCircle, Search, Plus, CalendarDays,
    FileText, UserCircle, BellRing, Building2, BookOpen, X
} from 'lucide-react';
import { getAvatarUrl } from '@/utils/avatar';

export default function ProdiLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage();
    const user = (props as any).auth?.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [filterPriority, setFilterPriority] = useState<'important' | 'all'>('important');
    const notifications = (props as any).auth?.notifications || [];
    const unreadCount = notifications.filter((n: any) => !n.is_read).length;
    const avatarUrl = getAvatarUrl(user?.avatar || user?.foto);

    const navItems = [
        { href: route('prodi.dashboard'), label: 'Dashboard', icon: LayoutDashboard },
        { href: '/panduan', label: 'Buku Panduan & SOP', icon: BookOpen },
        { href: route('prodi.periode'), label: 'Pendaftaran & Surat', icon: FileText },
        { href: route('prodi.dosen.index'), label: 'Daftar Dosen Pembimbing', icon: ListOrdered },
        { href: route().has('prodi.instansi.index') ? route('prodi.instansi.index') : '#', label: 'Instansi & Pembimbing Lapangan', icon: Building2 },
        { href: route('prodi.berita-acara.index'), label: 'Berita Acara', icon: ClipboardCheck },
    ];

    return (
        <div className="flex bg-background min-h-screen font-sans">
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-on-surface/20 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-outline-variant z-50 flex flex-col shadow-sm transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="px-6 py-8 flex flex-col items-center border-b border-outline-variant/30 mb-4">
                    <button className="absolute top-4 right-4 md:hidden text-secondary p-1" onClick={() => setIsSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                    <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-4 overflow-hidden font-bold text-2xl">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            user?.name?.substring(0, 2).toUpperCase() || 'KP'
                        )}
                    </div>
                    <h2 className="text-xl font-display font-semibold text-primary mb-1 text-center">Koordinator Prodi</h2>
                    <p className="text-xs font-medium text-secondary text-center">Teknik Informatika</p>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
                    {navItems.map((item) => {
                        const itemUrl = item.href !== '#' ? new URL(item.href, window.location.origin).pathname : '#';
                        const isActive = item.href !== '#' && url.startsWith(itemUrl);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`w-full flex items-center space-x-4 px-3 py-3 rounded-lg transition-all duration-200 ${
                                    isActive
                                        ? 'text-primary font-bold border-l-4 border-primary bg-primary-container/10'
                                        : 'text-secondary hover:bg-secondary-container/20 hover:text-primary'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-label-md">{item.label}</span>
                            </Link>
                        );
                    })}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center space-x-4 px-3 py-3 rounded-lg transition-all duration-200 text-secondary hover:bg-red-50 hover:text-red-600 text-left outline-none"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-label-md">Keluar</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:ml-64 min-h-screen relative w-full overflow-hidden">
                {/* Top App Bar */}
                <header className="sticky top-0 z-40 flex justify-between items-center w-full px-6 py-4 bg-surface border-b border-outline-variant">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-primary hover:bg-surface-container p-2 rounded-full" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="text-title-lg font-bold text-primary">Kerja Praktik Teknik Informatika</h2>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link 
                            href="/panduan" 
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#00288e] border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors shadow-xs"
                            title="Buka Buku Panduan & SOP"
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Panduan</span>
                        </Link>
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant relative"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-error rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            {isNotifOpen && (
                                <div className="absolute right-0 mt-2 w-84 bg-white border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden">
                                    <div className="p-3.5 border-b border-outline-variant bg-surface-container-low flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-title-md font-bold text-on-surface">Notifikasi</h3>
                                            <span className="text-label-sm text-primary cursor-pointer hover:underline">Tandai semua dibaca</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-surface-container p-0.5 rounded-lg text-[11px]">
                                            <button
                                                type="button"
                                                onClick={() => setFilterPriority('important')}
                                                className={`flex-1 py-1 text-center font-semibold rounded-md transition ${filterPriority === 'important' ? 'bg-white text-primary shadow-xs' : 'text-secondary hover:text-on-surface'}`}
                                            >
                                                Penting ({notifications.filter((n: any) => n.priority === 'high' || n.priority === 'normal' || !n.priority).length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFilterPriority('all')}
                                                className={`flex-1 py-1 text-center font-semibold rounded-md transition ${filterPriority === 'all' ? 'bg-white text-primary shadow-xs' : 'text-secondary hover:text-on-surface'}`}
                                            >
                                                Semua ({notifications.length})
                                            </button>
                                        </div>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications
                                                .filter((notif: any) => filterPriority === 'all' || notif.priority === 'high' || notif.priority === 'normal' || !notif.priority)
                                                .map((notif: any) => (
                                                <div key={notif.id} className={`p-3.5 border-b border-outline-variant hover:bg-surface-container-lowest transition-colors cursor-pointer ${!notif.is_read ? 'bg-primary/5' : ''}`}>
                                                    <div className="flex gap-3">
                                                        <div className={`p-2 rounded-full flex-shrink-0 ${notif.priority === 'high' ? 'bg-rose-100 text-rose-600' : notif.tipe === 'info' ? 'bg-blue-100 text-blue-600' : notif.tipe === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                                            <BellRing className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-1 mb-1">
                                                                <h4 className="text-label-md font-bold text-on-surface truncate">{notif.judul}</h4>
                                                                {notif.priority === 'high' && (
                                                                    <span className="shrink-0 px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                                        Penting
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-body-sm text-secondary line-clamp-2">{notif.pesan}</p>
                                                            <span className="text-[10px] text-outline mt-1 block">{new Date(notif.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-6 text-center text-secondary">
                                                <p className="text-body-md">Tidak ada notifikasi baru.</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2 border-t border-outline-variant text-center bg-surface-container-lowest">
                                        <Link href="#" className="text-label-sm text-primary hover:underline">Lihat semua notifikasi</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Link
                            href={route('profile.edit')}
                            className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
                            title="Profil Saya"
                        >
                            <UserCircle className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-label-md hidden sm:inline">Keluar</span>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 flex flex-col w-full h-full overflow-y-auto overflow-x-hidden relative">
                    {children}
                    {/* Footer */}
                    <footer className="w-full py-4 px-6 flex flex-col md:flex-row justify-between items-center mt-auto border-t border-outline-variant bg-surface-container-low">
                        <span className="text-body-sm text-secondary mb-2 md:mb-0">
                            © 2024 University Academic Internship System. All rights reserved.
                        </span>
                        <div className="flex space-x-6">
                            <a href="#" className="text-label-sm text-secondary hover:text-primary underline opacity-80 hover:opacity-100 transition-all">Support Center</a>
                            <a href="#" className="text-label-sm text-secondary hover:text-primary underline opacity-80 hover:opacity-100 transition-all">Contact Info</a>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}
