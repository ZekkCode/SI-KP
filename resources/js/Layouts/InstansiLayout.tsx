import { PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Users, BarChart2, BookOpen, Award, Settings, LogOut } from 'lucide-react';

export default function InstansiLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage();
    const user = (props as any).auth?.user;

    const navItems = [
        { href: '/instansi/dashboard', label: 'Ringkasan', icon: LayoutDashboard },
        { href: '/instansi/logbook', label: 'Monitoring', icon: BookOpen },
        { href: '/instansi/evaluation', label: 'Penilaian', icon: BarChart2 },
    ];

    return (
        <div className="min-h-screen bg-surface font-sans flex">
            {/* Sidebar */}
            <nav className="bg-white h-screen w-64 fixed left-0 top-0 border-r border-outline-variant flex flex-col shadow-sm z-40 hidden md:flex">
                <div className="px-6 py-8 flex flex-col items-center border-b border-outline-variant/30 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-4 overflow-hidden font-bold text-2xl">
                        {user?.avatar ? (
                            <img src={`/storage/${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.substring(0, 2).toUpperCase() || 'PL'
                        )}
                    </div>
                    <h2 className="text-xl font-display font-semibold text-primary mb-1 text-center">Pembimbing Lapangan</h2>
                    <p className="text-xs font-medium text-secondary text-center">Akses Eksternal</p>
                </div>

                {/* Main Navigation */}
                <div className="flex flex-col gap-3 mt-6 flex-grow">
                    {navItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all active:scale-95 duration-150 ${
                                    isActive
                                        ? 'bg-secondary-container text-on-secondary-container font-semibold border-l-4 border-primary'
                                        : 'text-on-surface-variant hover:bg-surface-container-highest'
                                }`}
                            >
                                <Icon size={20} className={isActive ? 'text-primary' : ''} />
                                <span className="text-body-md">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer Actions */}
                <div className="mt-auto flex flex-col gap-4 border-t border-outline-variant pt-6">
                    <Link
                        href={route('profile.edit')}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-all active:scale-95 duration-150 text-left w-full"
                    >
                        <Users size={20} />
                        <span className="text-body-md">Profil Saya</span>
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-all active:scale-95 duration-150 text-left w-full"
                    >
                        <LogOut size={20} />
                        <span className="text-body-md">Keluar</span>
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 md:ml-[260px] min-h-screen">
                {children}
            </div>
        </div>
    );
}
