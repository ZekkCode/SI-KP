import { PropsWithChildren, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, FileText, ClipboardList, Award, Bell, UserCircle, Search, Menu, LogOut, BookOpen } from 'lucide-react';
import { getAvatarUrl } from '@/utils/avatar';

export default function DosenLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage();
    const user = (props as any).auth?.user;
    const avatarUrl = getAvatarUrl(user?.avatar || user?.foto);

    const navItems = [
        { href: '/dosen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/panduan', label: 'Buku Panduan & SOP', icon: BookOpen },
        { href: '/dosen/review-proposal', label: 'Review Proposal', icon: FileText },
        { href: '/dosen/logbook', label: 'Monitoring', icon: ClipboardList },
        { href: '/dosen/penilaian', label: 'Penilaian Akhir', icon: Award },
    ];

    return (
        <div className="min-h-screen bg-surface font-sans text-on-surface flex flex-col md:flex-row">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-white border-r border-outline-variant shadow-sm z-40">
                <div className="px-6 py-8 flex flex-col items-center border-b border-outline-variant/30 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-4 overflow-hidden font-bold text-2xl">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            user?.name?.substring(0, 2).toUpperCase() || 'DS'
                        )}
                    </div>
                    <h2 className="text-xl font-display font-semibold text-primary mb-1 text-center">Dosen Pembimbing</h2>
                    <p className="text-xs font-medium text-secondary text-center">Teknik Informatika</p>
                </div>

                <nav className="flex flex-col flex-1 gap-1">
                    {navItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 ${
                                    isActive
                                        ? 'bg-secondary-container text-on-secondary-container font-semibold border-l-4 border-primary'
                                        : 'text-secondary hover:bg-surface-container-high hover:text-on-surface active:scale-95'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-3 text-secondary px-4 py-3 hover:bg-red-50 hover:text-red-600 transition-all duration-150 rounded-lg text-left w-full outline-none"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm">Keluar</span>
                    </Link>
                </nav>

            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-[260px] flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden w-full top-0 sticky bg-surface-container-lowest border-b border-outline-variant shadow-sm z-50">
                    <div className="flex justify-between items-center px-4 h-16 w-full">
                        <div className="flex items-center gap-3">
                            <Menu className="w-6 h-6 text-on-surface-variant" />
                            <div className="font-display text-lg font-semibold text-primary">Simpkl Akademik</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
                                <Bell className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Desktop Header */}
                <header className="hidden md:flex justify-between items-center px-8 h-16 w-full bg-surface-container-lowest sticky top-0 border-b border-outline-variant shadow-sm z-30">
                    <div className="flex-1">
                        <div className="relative max-w-md">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                            <input
                                type="text"
                                placeholder="Cari mahasiswa, proposal, atau logbook..."
                                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-on-surface-variant">
                        <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
                        </button>
                        <Link href="/panduan" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#00288e] border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors shadow-xs">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Panduan</span>
                        </Link>
                        <div className="w-px h-6 bg-outline-variant mx-1"></div>
                        <Link href={route('profile.edit')} className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-container-high rounded-lg transition-colors text-sm font-medium">
                            <UserCircle className="w-4 h-4" />
                            <span>Profil</span>
                        </Link>
                        <Link href="/logout" method="post" as="button" className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-container-high rounded-lg transition-colors text-sm font-medium">
                            <span>Logout</span>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
