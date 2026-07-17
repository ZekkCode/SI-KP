import { PropsWithChildren, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, FileText, FileSignature, LogOut, Menu, Bell } from 'lucide-react';

export default function TULayout({ children }: PropsWithChildren) {
    const { url, props } = usePage();
    const user = (props as any).auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { href: '/tu/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/tu/generate-surat', label: 'Surat Pengantar', icon: FileText, alsoActive: '/tu/verifikasi' },
        { href: '/tu/validasi-berita', label: 'Berita Acara', icon: FileSignature },
    ];

    return (
        <div className="bg-surface text-on-surface font-sans min-h-screen flex flex-col md:flex-row antialiased">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <nav className={`flex flex-col h-screen w-64 fixed left-0 top-0 bg-white border-r border-outline-variant shadow-sm z-30 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="px-6 py-8 flex flex-col items-center border-b border-outline-variant/30 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-4 overflow-hidden font-bold text-2xl">
                        TU
                    </div>
                    <h2 className="text-xl font-display font-semibold text-primary mb-1 text-center">Tata Usaha</h2>
                    <p className="text-xs font-medium text-secondary text-center">Fakultas Teknik</p>
                </div>

                <div className="flex-1 overflow-y-auto w-full px-4 space-y-1 py-2">
                    {navItems.map((item) => {
                        const isActive = url.startsWith(item.href) || (item.alsoActive && url.startsWith(item.alsoActive));
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-200 ease-in-out ${
                                    isActive
                                        ? 'text-primary font-bold border-l-4 border-primary bg-primary-container/10 rounded-l-none'
                                        : 'text-secondary hover:bg-secondary-container/20 hover:text-primary'
                                }`}
                            >
                                <span className="mr-3"><Icon size={20} /></span>
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 mt-auto border-t border-outline-variant/30">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center w-full px-4 py-3 rounded-lg text-secondary hover:bg-error-container/20 hover:text-error transition-colors"
                    >
                        <LogOut size={20} className="mr-3" />
                        <span className="text-sm font-medium">Keluar</span>
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Topbar */}
                <header className="sticky top-0 z-20 flex justify-between items-center w-full px-6 py-4 bg-surface border-b border-outline-variant shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-primary hover:bg-surface-container p-2 rounded-full transition-colors">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-2xl font-display font-bold text-primary hidden md:block">Sistem Informasi Kerja Praktik</h1>
                        <h1 className="text-xl font-display font-bold text-primary md:hidden">SIKP</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors relative">
                            <Bell size={24} />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 max-w-[1200px] w-full mx-auto">
                    {children}
                </main>

                <footer className="w-full py-4 px-6 flex flex-col md:flex-row justify-between items-center mt-auto border-t border-outline-variant bg-surface-container-low text-sm text-secondary">
                    <p>© 2024 University Academic Internship System. All rights reserved.</p>
                    <div className="flex space-x-4 mt-2 md:mt-0">
                        <a href="#" className="hover:text-primary transition-colors">Support Center</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact Info</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}
