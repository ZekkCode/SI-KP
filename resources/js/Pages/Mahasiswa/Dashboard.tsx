import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { Link, usePage } from '@inertiajs/react';
import { School, ArrowRight, Mail, Megaphone, AlertCircle, Download, BookOpen, FileText, Edit3, Briefcase, Verified, CheckCircle2, Calendar, Clock } from 'lucide-react';

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
    hasPendaftaran: boolean;
}

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

export default function Dashboard({ userName, userProdi, userAngkatan, userKonsentrasi, statusInfo, currentStep, notifications, logbookCount, logbookTarget, hasPendaftaran }: PageProps<DashboardProps>) {

    return (
        <div className="p-6 max-w-[1280px] mx-auto w-full flex-1 space-y-8">
            <div className="grid grid-cols-12 gap-6">
                {/* Welcome & Brief Profile Card */}
                <div className="col-span-12 lg:col-span-8 bg-white border border-outline-variant rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                    <div className="flex-1 space-y-4">
                        <div>
                            <h3 className="text-headline-md text-on-surface mb-1">Selamat Datang, {userName}!</h3>
                            <p className="text-body-md text-secondary">
                                {userProdi} - {userAngkatan}
                            </p>
                        </div>
                        <p className="text-body-md text-secondary leading-relaxed">
                            Sistem Informasi Kerja Praktik (SI-KP) membantu Anda mengelola tahapan pelaksanaan KP mulai dari pendaftaran, proposal, hingga penilaian akhir secara terstruktur.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <button className="bg-primary text-white px-4 py-2.5 rounded-lg text-label-md hover:shadow-md transition-all flex items-center space-x-2">
                                <BookOpen className="w-4 h-4" />
                                <span>Unduh Buku Panduan</span>
                            </button>
                            <button className="border border-primary text-primary px-4 py-2.5 rounded-lg text-label-md hover:bg-primary-container/10 transition-all">
                                Hubungi Koordinator
                            </button>
                        </div>
                    </div>
                    <div className="w-full md:w-48 h-32 md:h-40 rounded-xl overflow-hidden shadow-sm relative flex-shrink-0">
                        <div className="absolute inset-0 bg-primary/10"></div>
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXQKsbzd0HD4f87_TGfq2xTvVtGgchivENcvI5tuAqWBzCZ4NTAqck8TfJWnxGrLU8E7mQBzg8jQrXtTTWvKO7-3vdt8qaMNVjriuIkU387_tBzIULkAu87DgtHWZk2k-rG9AuDj-Aq4trJR2gXUbtBseLTunRNoHlxwHiggYt2lHFsxqXBGitSitJ6JqWO7Inv72Y2OvpN12fMOv0eAUroC_lewtjrRmCa_K0pPAvbL56Iz6Yq9whcXPcRdbtu9XuV21deV-yHag"
                            alt="Office"
                            className="w-full h-full object-cover"
                        />
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
            </div>

            {/* Infografis Tahapan KP */}
            <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex items-center space-x-2">
                    <span className="w-2 h-6 bg-primary rounded-full"></span>
                    <h3 className="text-title-lg font-bold text-on-surface">Infografis Tahapan KP</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                            <Edit3 className="w-6 h-6" />
                        </div>
                        <h4 className="text-label-sm text-primary font-bold">Tahap 1</h4>
                        <p className="text-body-xs text-secondary mt-1 px-2 font-medium">Pengajuan & Persetujuan Judul</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-12 h-12 rounded-full bg-white border border-primary text-primary flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h4 className="text-label-sm text-primary font-bold">Tahap 2</h4>
                        <p className="text-body-xs text-secondary mt-1 px-2 font-medium">Penerbitan Surat Pengantar</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-12 h-12 rounded-full bg-white border border-primary text-primary flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h4 className="text-label-sm text-primary font-bold">Tahap 3</h4>
                        <p className="text-body-xs text-secondary mt-1 px-2 font-medium">Pelaksanaan di Instansi</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-12 h-12 rounded-full bg-white border border-primary text-primary flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h4 className="text-label-sm text-primary font-bold">Tahap 4</h4>
                        <p className="text-body-xs text-secondary mt-1 px-2 font-medium">Penyusunan Laporan Akhir</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-12 h-12 rounded-full bg-white border border-primary text-primary flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                            <Verified className="w-6 h-6" />
                        </div>
                        <h4 className="text-label-sm text-primary font-bold">Tahap 5</h4>
                        <p className="text-body-xs text-secondary mt-1 px-2 font-medium">Sidang & Penilaian Akhir</p>
                    </div>
                </div>
            </div>

            {/* SOP & Persyaratan Dokumen */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                           <h3 className="text-title-md font-bold text-primary flex items-center gap-2">
                               <BookOpen className="w-5 h-5" />
                               Standar Operasional Prosedur (SOP)
                           </h3>
                           <span className="text-label-sm bg-secondary-container/30 text-secondary px-3 py-0.5 rounded-full">Revisi 2024.1</span>
                       </div>
                       <div className="space-y-4">
                           <div className="flex gap-4">
                               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-label-md">1</div>
                               <div>
                                   <h4 className="text-label-md text-on-surface font-semibold">Pendaftaran Awal</h4>
                                   <p className="text-body-sm text-secondary">Mahasiswa melakukan pendaftaran melalui portal sistem informasi dengan mengunggah transkrip nilai sementara yang telah diverifikasi.</p>
                               </div>
                           </div>
                           <div className="flex gap-4">
                               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-label-md">2</div>
                               <div>
                                   <h4 className="text-label-md text-on-surface font-semibold">Penentuan Pembimbing</h4>
                                   <p className="text-body-sm text-secondary">Koordinator KP menetapkan Dosen Pembimbing berdasarkan topik atau bidang minat yang diajukan oleh mahasiswa dalam waktu 3 hari kerja.</p>
                               </div>
                           </div>
                           <div className="flex gap-4">
                               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-label-md">3</div>
                               <div>
                                   <h4 className="text-label-md text-on-surface font-semibold">Bimbingan & Pelaksanaan</h4>
                                   <p className="text-body-sm text-secondary">Selama periode KP (minimum 40 hari kerja), mahasiswa wajib melakukan bimbingan rutin dan mengisi logbook harian di sistem.</p>
                               </div>
                           </div>
                           <div className="flex gap-4">
                               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-label-md">4</div>
                               <div>
                                   <h4 className="text-label-md text-on-surface font-semibold">Verifikasi Dokumen Akhir</h4>
                                   <p className="text-body-sm text-secondary">Setelah selesai, mahasiswa wajib mengunggah Berita Acara Pelaksanaan dan Form Penilaian dari Instansi ke sistem untuk verifikasi administrasi.</p>
                               </div>
                           </div>
                       </div>
                    </div>
                </div>

                <div className="lg:col-span-5 bg-white border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <Calendar className="w-5 h-5 text-primary" />
                            <h3 className="text-title-md font-bold text-on-surface">Jadwal Penting KP</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 flex items-start justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-label-md font-bold text-on-surface">Pendaftaran Kerja Praktik</h4>
                                    <p className="text-body-sm text-secondary flex items-center gap-1.5 mt-1">
                                        <Clock className="w-4 h-4 text-primary" />
                                        1 Agustus - 31 Agustus 2026
                                    </p>
                                </div>
                                <span className="text-label-xs bg-success-container/20 text-success px-2 py-0.5 rounded font-bold">
                                    Aktif
                                </span>
                            </div>

                            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 flex items-start justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-label-md font-bold text-on-surface">Pengajuan Surat Pengantar</h4>
                                    <p className="text-body-sm text-secondary flex items-center gap-1.5 mt-1">
                                        <Clock className="w-4 h-4 text-primary" />
                                        1 Agustus - 15 September 2026
                                    </p>
                                </div>
                                <span className="text-label-xs bg-success-container/20 text-success px-2 py-0.5 rounded font-bold">
                                    Aktif
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links & Notifications */}
            <div className="grid grid-cols-12 gap-6">
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

                {/* Right side widgets */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">

                    {/* Panduan Kerja Praktik download list */}
                    <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-label-md font-bold mb-1 uppercase tracking-wider text-secondary">Dokumen Panduan</h3>
                            <p className="text-body-sm text-secondary mb-4">Unduh dokumen panduan resmi untuk kelancaran pelaksanaan Kerja Praktik Anda.</p>
                            <div className="space-y-3">
                                <a
                                    href="#"
                                    className="flex items-center justify-between p-3 bg-white border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary-container/20 rounded-md group-hover:bg-primary-container/40 transition-colors">
                                            <BookOpen className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-label-md font-bold text-on-surface">Buku Panduan KP</p>
                                            <p className="text-body-xs text-secondary">PDF • 2.4 MB</p>
                                        </div>
                                    </div>
                                    <Download className="w-5 h-5 text-secondary group-hover:text-primary group-hover:translate-y-0.5 transition-all" />
                                </a>

                                <a
                                    href="#"
                                    className="flex items-center justify-between p-3 bg-white border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary-container/20 rounded-md group-hover:bg-primary-container/40 transition-colors">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-label-md font-bold text-on-surface">Template Proposal KP</p>
                                            <p className="text-body-xs text-secondary">DOCX • 1.2 MB</p>
                                        </div>
                                    </div>
                                    <Download className="w-5 h-5 text-secondary group-hover:text-primary group-hover:translate-y-0.5 transition-all" />
                                </a>

                                <a
                                    href="#"
                                    className="flex items-center justify-between p-3 bg-white border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary-container/20 rounded-md group-hover:bg-primary-container/40 transition-colors">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-label-md font-bold text-on-surface">Template Laporan Akhir</p>
                                            <p className="text-body-xs text-secondary">DOCX • 1.5 MB</p>
                                        </div>
                                    </div>
                                    <Download className="w-5 h-5 text-secondary group-hover:text-primary group-hover:translate-y-0.5 transition-all" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
