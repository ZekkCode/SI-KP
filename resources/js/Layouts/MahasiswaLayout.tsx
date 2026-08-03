import { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, UserCircle, BookOpen, ClipboardEdit, ClipboardCheck,
    FileText, File, CalendarDays, FileClock, Award, Bell, LogOut, Menu,
} from 'lucide-react';

export default function MahasiswaLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage();
    const user = (props as any).auth?.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { href: '/mahasiswa/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/mahasiswa/pendaftaran', label: 'Pendaftaran', icon: ClipboardEdit },
        { href: '/mahasiswa/status-pengajuan', label: 'Status Pengajuan', icon: ClipboardCheck },
        { href: '/mahasiswa/surat-pengantar', label: 'Surat Pengantar', icon: FileText },
        { href: '/mahasiswa/proposal', label: 'Proposal', icon: File },
        { href: '/mahasiswa/berita-acara', label: 'Berita Acara', icon: FileClock },
        { href: '/mahasiswa/penilaian-akhir', label: 'Penilaian Akhir', icon: Award },
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
            <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-outline-variant z-50 flex flex-col py-6 px-4 shadow-sm transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="mb-8 px-2 flex items-center justify-between">
                    <h1 className="text-headline-md text-primary tracking-tight">SI-KP</h1>
                    <button className="md:hidden text-secondary" onClick={() => setIsSidebarOpen(false)}>✕</button>
                </div>

                <div className="flex items-center space-x-4 px-3 py-3 mb-6 bg-surface-container-low rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold overflow-hidden">
                        <UserCircle className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-label-md text-on-surface truncate w-32">{user?.name || 'Mahasiswa User'}</span>
                        <span className="text-body-sm text-secondary truncate">NIM: {user?.nim || '123456789'}</span>
                    </div>
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
                        <h2 className="text-title-lg font-bold text-primary">Sistem Informasi Kerja Praktik</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
                            <Bell className="w-5 h-5" />
                        </button>
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
