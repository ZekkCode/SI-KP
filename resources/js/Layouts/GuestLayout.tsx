import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { MapPin, Phone, Mail, BookOpen, ExternalLink } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    const { props } = usePage();
    const campus = (props as any)?.campus;
    const campusAddress = campus?.address || 'Jl. Raya Telang, PO BOX 2 Kamal, Bangkalan';
    const campusPhone = campus?.phone || '031-3011147';
    const campusEmail = campus?.email || 'tif@trunojoyo.ac.id';
    const cleanPhone = campusPhone.replace(/[^0-9]/g, '');

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-[#00288e] selection:text-white">
            {/* Top Contact Bar */}
            <header className="bg-white border-b border-slate-200 py-1.5 text-xs text-slate-600 hidden md:block w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-y-1">
                    <div className="flex items-center gap-6">
                        <a 
                            href="https://maps.google.com/?q=Universitas+Trunojoyo+Madura" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-[#00288e] transition cursor-pointer"
                            title="Buka Lokasi Kampus UTM di Google Maps"
                        >
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{campusAddress}</span>
                        </a>
                        <a 
                            href={`tel:${cleanPhone}`} 
                            className="flex items-center gap-1.5 hover:text-[#00288e] transition cursor-pointer"
                            title={`Hubungi Telepon Kampus: ${campusPhone}`}
                        >
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{campusPhone}</span>
                        </a>
                        <a 
                            href={`mailto:${campusEmail}`} 
                            className="flex items-center gap-1.5 hover:text-[#00288e] transition cursor-pointer"
                            title={`Kirim Email ke ${campusEmail}`}
                        >
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{campusEmail}</span>
                        </a>
                    </div>

                    <div className="flex items-center gap-4 text-slate-500 font-medium">
                        <a 
                            href="https://trunojoyo.ac.id" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-[#00288e] transition cursor-pointer"
                            title="Portal Resmi Universitas Trunojoyo Madura"
                        >
                            <span>SI-KP TEKNIK INFORMATIKA &bull; UNIVERSITAS TRUNOJOYO MADURA</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* Official Navbar */}
            <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40 shadow-xs">
                <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-13 sm:h-15 flex items-center justify-between gap-2">
                    <Link href="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                            <img 
                                src="/images/Logo UTM terbaru_berwarna (1).png" 
                                alt="Logo UTM" 
                                className="h-7 sm:h-9 w-auto object-contain" 
                            />
                            <img 
                                src="/images/tekfor-logo.png" 
                                alt="Logo Teknik Informatika" 
                                className="h-6 sm:h-8 w-auto object-contain" 
                            />
                        </div>
                        <div className="border-l border-slate-200 pl-2 sm:pl-2.5 min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-[#00288e] tracking-tight leading-tight truncate">
                                SI-KP • TEKNIK INFORMATIKA
                            </div>
                            <div className="text-[10px] sm:text-xs font-medium text-slate-500 leading-tight truncate">
                                Program Studi S1 Teknik Informatika • Fakultas Teknik UTM
                            </div>
                        </div>
                    </Link>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <Link 
                            href="/panduan" 
                            className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-xs"
                            title="Panduan"
                        >
                            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 shrink-0" />
                            <span className="hidden sm:inline">Panduan</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xs p-6 sm:p-8">
                    {children}
                </div>
            </main>

            {/* Official Footer */}
            <footer className="bg-white border-t border-slate-200 py-3.5 text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                    <div>
                        <span className="font-semibold text-slate-700">&copy; 2024 - 2026 SI-KP TEKNIK INFORMATIKA.</span> All Rights Reserved.
                    </div>
                    <div>
                        Program Studi S1 Teknik Informatika - <span className="font-semibold text-slate-700">Universitas Trunojoyo Madura</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
