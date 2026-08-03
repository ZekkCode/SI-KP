import { PropsWithChildren, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Users, ListOrdered, UserPlus, ClipboardCheck,
    BarChart3, Settings, LogOut, Menu, Bell, HelpCircle, Search, Plus, CalendarDays,
    FileText
} from 'lucide-react';

export default function ProdiLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage();
    const user = (props as any).auth?.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { href: '/prodi/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/prodi/periode', label: 'Pendaftaran & Surat', icon: FileText },
        { href: '/prodi/verification', label: 'Verifikasi Mahasiswa', icon: ClipboardCheck },
        { href: '/prodi/plotting', label: 'Pembagian Dosbing', icon: UserPlus },
        { href: '/prodi/lecturers', label: 'Daftar Dosen Pembimbing', icon: ListOrdered },
        { href: '/prodi/mahasiswa', label: 'Mahasiswa', icon: Users },
        { href: '/prodi/reports', label: 'Berita Acara', icon: ClipboardCheck },
    ];

    return (
        <div className="flex h-screen bg-surface overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:sticky top-0 left-0 h-screen w-[260px] bg-surface-container-lowest border-r border-outline-variant z-40 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-4 flex items-center gap-3 bg-[#0091d5] text-white select-none">
                    <div className="shrink-0 bg-white rounded-full p-1 shadow-sm">
                        <img src="/images/Logo UTM terbaru_berwarna (1).png" alt="Logo UTM" className="w-9 h-9 object-contain" />
                    </div>
                    <div>
                        <h1 className="text-label-lg font-bold tracking-wider leading-tight">TEKNIK INFORMATIKA</h1>
                    </div>
                </div>


                <nav className="flex-1 px-4 mt-6 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer border-l-4 ${
                                    isActive
                                        ? 'border-primary bg-primary-container text-on-primary-container font-semibold'
                                        : 'text-secondary hover:bg-surface-container-high hover:pl-5 border-transparent'
                                }`}
                            >
                                <Icon size={20} className={isActive ? 'text-primary' : 'text-secondary'} />
                                <span className="font-body-md text-body-md">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-4 mt-auto py-4 border-t border-outline-variant space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-secondary hover:bg-surface-container-high hover:pl-5 transition-all duration-200 cursor-pointer border-l-4 border-transparent">
                        <Settings size={20} />
                        <span className="font-body-md text-body-md">Pengaturan</span>
                    </button>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-error hover:bg-error-container hover:text-on-error-container hover:pl-5 transition-all duration-200 cursor-pointer border-l-4 border-transparent"
                    >
                        <LogOut size={20} />
                        <span className="font-body-md text-body-md">Keluar</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* TopNav */}
                <nav className="bg-surface-container-lowest flex justify-between items-center px-4 md:px-6 h-16 w-full sticky top-0 z-30 border-b border-outline-variant shadow-sm">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-on-surface-variant p-2" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <div className="font-headline-md text-headline-md text-primary tracking-tight hidden sm:block">
                            UTM Internship Hub
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface-container rounded-full text-on-surface-variant focus-within:ring-2 focus-within:ring-primary/20">
                            <Search size={18} />
                            <input type="text" placeholder="Cari..." className="bg-transparent border-none focus:outline-none text-body-md font-body-md w-48" />
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <button className="text-on-surface-variant hover:bg-surface-container-highest transition-colors p-2 rounded-full active:scale-95 duration-150">
                                <Bell size={20} />
                            </button>
                            <button className="hidden sm:block text-on-surface-variant hover:bg-surface-container-highest transition-colors p-2 rounded-full active:scale-95 duration-150">
                                <HelpCircle size={20} />
                            </button>
                        </div>
                    </div>
                </nav>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
