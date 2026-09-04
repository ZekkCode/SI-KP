import { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, UserCircle, BookOpen, ClipboardEdit, ClipboardCheck,
    FileText, File, CalendarDays, FileClock, Award, Bell, LogOut, Menu, BellRing, FileCheck,
} from 'lucide-react';

export default function MahasiswaLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage();
    const user = (props as any).auth?.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifications = (props as any).auth?.notifications || [];
    const unreadCount = notifications.filter((n: any) => !n.is_read).length;

    const navItems = [
        { href: '/mahasiswa/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/mahasiswa/pendaftaran', label: 'Pendaftaran', icon: ClipboardEdit },
        { href: '/mahasiswa/status-pengajuan', label: 'Status Pengajuan', icon: ClipboardCheck },
        { href: '/mahasiswa/surat-pengantar', label: 'Surat Pengantar', icon: FileText },
        { href: '/mahasiswa/proposal', label: 'Proposal', icon: File },
        { href: '/mahasiswa/logbook', label: 'Monitoring', icon: BookOpen },
        { href: '/mahasiswa/berita-acara', label: 'Berita Acara', icon: FileClock },
        { href: '/mahasiswa/dokumen-akhir', label: 'Laporan Akhir', icon: FileCheck },
        { href: '/mahasiswa/penilaian', label: 'Penilaian Akhir', icon: Award },
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
                    <button className="absolute top-4 right-4 md:hidden text-secondary" onClick={() => setIsSidebarOpen(false)}>✕</button>
                    <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-4 overflow-hidden font-bold text-2xl">
                        {user?.avatar ? (
                            <img src={`/storage/${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.substring(0, 2).toUpperCase() || 'MH'
                        )}
                    </div>
                    <h2 className="text-xl font-display font-semibold text-primary mb-1 text-center">Mahasiswa</h2>
                    <p className="text-xs font-medium text-secondary text-center">Teknik Informatika</p>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
                    {navItems.map((item) => {
                        const isActive = url.startsWith(item.href);
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
                    <div className="flex items-center space-x-4">
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
                                <div className="absolute right-0 mt-2 w-80 bg-white border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden">
                                    <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                                        <h3 className="text-title-md font-bold text-on-surface">Notifikasi</h3>
                                        <span className="text-label-sm text-primary cursor-pointer hover:underline">Tandai semua dibaca</span>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif: any) => (
                                                <div key={notif.id} className={`p-4 border-b border-outline-variant hover:bg-surface-container-lowest transition-colors cursor-pointer ${!notif.is_read ? 'bg-primary/5' : ''}`}>
                                                    <div className="flex gap-3">
                                                        <div className={`p-2 rounded-full flex-shrink-0 ${notif.tipe === 'info' ? 'bg-blue-100 text-blue-600' : notif.tipe === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                                            <BellRing className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-label-md font-bold text-on-surface mb-1">{notif.judul}</h4>
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
