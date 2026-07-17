import { PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Users, BarChart2, BookOpen, Award, Settings, LogOut } from 'lucide-react';

export default function InstansiLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage();
    const user = (props as any).auth?.user;

    const navItems = [
        { href: '/instansi/dashboard', label: 'Ringkasan', icon: LayoutDashboard },
        { href: '/instansi/review', label: 'Penempatan', icon: Users },
        { href: '/instansi/evaluation', label: 'Performa', icon: BarChart2 },
        { href: '/instansi/logbook', label: 'Logbook', icon: BookOpen },
        { href: '/instansi/certificates', label: 'Sertifikat', icon: Award },
        { href: '/instansi/settings', label: 'Pengaturan', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-surface font-sans flex">
            {/* Sidebar */}
            <nav className="bg-surface-container-low h-screen w-[260px] fixed left-0 top-0 border-r border-outline-variant flex-col py-6 px-4 z-40 hidden md:flex">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 px-4">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold overflow-hidden text-lg">
                        IN
                    </div>
                    <div>
                        <h1 className="text-headline-sm text-on-surface font-bold">Portal Supervisor</h1>
                        <p className="text-label-md text-on-surface-variant">Akses Eksternal</p>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="flex flex-col gap-2 flex-grow">
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
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors active:scale-95 duration-150">
                        Pusat Bantuan
                    </button>
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
