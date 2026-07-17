import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { usePage } from '@inertiajs/react';
import { School, MapPin, ArrowRight, Check, Hourglass, Mail, Megaphone, AlertCircle, UploadCloud, Download, Edit, HelpCircle } from 'lucide-react';

interface Notification {
    id: number;
    judul: string;
    pesan: string;
    tipe: 'info' | 'peringatan' | 'error' | 'sukses';
    is_read: boolean;
    created_at: string;
}

interface DashboardProps extends Record<string, unknown> {
    userName: string;
    userProdi: string;
    userAngkatan: string | number;
    userKonsentrasi: string;
    statusInfo: {
        label: string;
        description: string;
    };
    currentStep: number;
    notifications: Notification[];
    logbookCount: number;
    logbookTarget: number;
}

const steps = [
    { label: 'Pendaftaran' },
    { label: 'Verifikasi' },
    { label: 'Surat Pengantar' },
    { label: 'Proposal' },
    { label: 'Pelaksanaan' },
    { label: 'Laporan' },
];

function getNotifIcon(tipe: string) {
    switch (tipe) {
        case 'sukses':
            return { icon: Mail, bgClass: 'bg-secondary-container', iconClass: 'text-on-secondary-container' };
        case 'info':
            return { icon: Megaphone, bgClass: 'bg-tertiary-fixed', iconClass: 'text-on-tertiary-fixed' };
        case 'peringatan':
            return { icon: Megaphone, bgClass: 'bg-tertiary-fixed', iconClass: 'text-on-tertiary-fixed' };
        case 'error':
            return { icon: AlertCircle, bgClass: 'bg-error-container', iconClass: 'text-on-error-container' };
        default:
            return { icon: Mail, bgClass: 'bg-secondary-container', iconClass: 'text-on-secondary-container' };
    }
}

import { PageProps } from '@/types';

export default function Dashboard({ userName, userProdi, userAngkatan, userKonsentrasi, statusInfo, currentStep, notifications, logbookCount, logbookTarget }: PageProps<DashboardProps>) {
    const logbookPercent = logbookTarget > 0 ? Math.round((logbookCount / logbookTarget) * 100) : 0;
    const circumference = 2 * Math.PI * 28; // r=28
    const strokeDashoffset = circumference - (logbookPercent / 100) * circumference;

    return (
        <div className="p-6 max-w-[1280px] mx-auto w-full flex-1">
            <div className="grid grid-cols-12 gap-6">
                {/* Welcome & Brief Profile Card */}
                <div className="col-span-12 lg:col-span-8 bg-white border border-outline-variant rounded-xl p-6 flex items-center shadow-sm">
                    <div className="flex-1">
                        <h3 className="text-headline-md text-on-surface mb-1">Selamat Datang, {userName}!</h3>
                        <p className="text-body-md text-secondary mb-4">Lanjutkan langkah Anda menuju dunia profesional melalui program Kerja Praktik semester ini.</p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2 bg-surface-container-low px-4 py-2 rounded-lg">
                                <School className="w-5 h-5 text-primary" />
                                <span className="text-label-md">{userProdi} - {userAngkatan}</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-surface-container-low px-4 py-2 rounded-lg">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span className="text-label-md">Yogyakarta, Indonesia</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Chip Card */}
                <div className="col-span-12 lg:col-span-4 bg-primary text-white border border-primary rounded-xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
                    <div className="z-10">
                        <span className="text-label-sm uppercase tracking-widest opacity-80">Status Saat Ini</span>
                        <h4 className="text-title-lg font-bold mt-2">{statusInfo.label}</h4>
                        <p className="text-body-sm mt-1 opacity-90">{statusInfo.description}</p>
                    </div>
                    <div className="mt-6 z-10">
                        <button className="bg-white text-primary px-6 py-2 rounded-full font-bold text-label-md hover:bg-opacity-90 transition-all flex items-center space-x-2 w-max">
                            <span>Detail Status</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                {/* Horizontal Stepper */}
                <div className="col-span-12 bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
                    <h3 className="text-label-md text-secondary mb-8 uppercase tracking-wider">Alur Kerja Praktik</h3>
                    <div className="relative flex items-center justify-between w-full">
                        <div className="absolute top-5 left-0 w-full h-1 bg-surface-variant -z-0"></div>
                        <div
                            className="absolute top-5 left-0 h-1 bg-primary -z-0 transition-all duration-500"
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {steps.map((step, idx) => {
                            const isCompleted = idx < currentStep;
                            const isCurrent = idx === currentStep;
                            return (
                                <div key={step.label} className="relative z-10 flex flex-col items-center">
                                    {isCompleted ? (
                                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md mb-2">
                                            <Check className="w-5 h-5" />
                                        </div>
                                    ) : isCurrent ? (
                                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg mb-2 ring-4 ring-primary-fixed">
                                            <Hourglass className="w-5 h-5" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center mb-2">
                                            <div className="w-2 h-2 rounded-full bg-on-surface-variant"></div>
                                        </div>
                                    )}
                                    <span className={`text-label-sm text-center ${isCompleted || isCurrent ? 'text-primary font-bold' : 'text-secondary'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="col-span-12 lg:col-span-7 bg-white border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                        <h3 className="text-title-lg font-bold">Notifikasi Terbaru</h3>
                        <button className="text-primary text-label-md hover:underline">Lihat Semua</button>
                    </div>
                    <div className="divide-y divide-outline-variant">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => {
                                const { icon: Icon, bgClass, iconClass } = getNotifIcon(notif.tipe);
                                return (
                                    <div key={notif.id} className="p-4 flex space-x-4 hover:bg-surface-container-low transition-colors cursor-pointer">
                                        <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className={`w-5 h-5 ${iconClass}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h5 className={`text-label-md font-bold ${notif.tipe === 'error' ? 'text-error' : ''}`}>{notif.judul}</h5>
                                                <span className="text-label-sm text-secondary">{notif.created_at}</span>
                                            </div>
                                            <p className="text-body-sm text-on-surface-variant mt-1">{notif.pesan}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-secondary text-body-md">
                                Belum ada notifikasi.
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                    <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant flex-1">
                        <h3 className="text-label-md font-bold mb-4 uppercase tracking-wider">Aksi Cepat</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="bg-white p-4 rounded-lg flex flex-col items-center justify-center border border-outline-variant hover:border-primary hover:text-primary transition-all text-center group">
                                <UploadCloud className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-label-sm">Upload Laporan</span>
                            </button>
                            <button className="bg-white p-4 rounded-lg flex flex-col items-center justify-center border border-outline-variant hover:border-primary hover:text-primary transition-all text-center group">
                                <Download className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-label-sm">Unduh Panduan</span>
                            </button>
                            <button className="bg-white p-4 rounded-lg flex flex-col items-center justify-center border border-outline-variant hover:border-primary hover:text-primary transition-all text-center group">
                                <Edit className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-label-sm">Isi Logbook</span>
                            </button>
                            <button className="bg-white p-4 rounded-lg flex flex-col items-center justify-center border border-outline-variant hover:border-primary hover:text-primary transition-all text-center group">
                                <HelpCircle className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-label-sm">Bantuan</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-outline-variant rounded-xl p-6 flex items-center justify-between shadow-sm">
                        <div>
                            <span className="text-label-sm text-secondary">Logbook Terisi</span>
                            <div className="flex items-end space-x-1 mt-1">
                                <span className="text-headline-md text-on-surface">{logbookCount}</span>
                                <span className="text-body-sm text-secondary mb-1">/ {logbookTarget} Hari</span>
                            </div>
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-surface-variant flex items-center justify-center relative">
                            <svg className="absolute inset-0 transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-primary-container/20" />
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="text-primary" />
                            </svg>
                            <span className="text-label-sm font-bold">{logbookPercent}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
