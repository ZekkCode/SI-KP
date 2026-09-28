import { useState } from 'react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { Link, usePage } from '@inertiajs/react';
import { School, ArrowRight, Mail, Megaphone, AlertCircle, Download, BookOpen, FileText, Edit3, Briefcase, Verified, CheckCircle2, Calendar, Clock } from 'lucide-react';

interface Notification {
    id: number;
    judul: string;
    pesan: string;
    tipe: 'info' | 'peringatan' | 'error' | 'sukses';
    priority?: 'low' | 'normal' | 'high';
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
    dosenPembimbing?: string;
    instansi?: string;
    pembimbingLapangan?: string;
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
import { useTranslation } from '@/hooks/useTranslation';

export default function Dashboard({ userName, userProdi, userAngkatan, userKonsentrasi, statusInfo, currentStep, notifications, logbookCount, logbookTarget, hasPendaftaran, dosenPembimbing, instansi, pembimbingLapangan }: PageProps<DashboardProps>) {
    const { props } = usePage();
    const campusEmail = (props as any)?.campus?.email || 'tif@trunojoyo.ac.id';
    const { t } = useTranslation();
    const [notifFilter, setNotifFilter] = useState<'important' | 'all'>('important');

    const displayedNotifications = notifFilter === 'important'
        ? notifications.filter((n) => n.priority === 'high' || n.priority === 'normal' || !n.priority)
        : notifications;

    return (
        <div className="p-6 max-w-[1280px] mx-auto w-full flex-1 space-y-8">
            <div className="grid grid-cols-12 gap-6">
                {/* Welcome & Brief Profile Card */}
                <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
                    <div className="flex-1 space-y-4">
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                                {t('dashboard.welcome', { name: userName }, `Selamat Datang, ${userName}`)}
                            </h3>
                            <p className="text-sm font-semibold text-[#00288e]">
                                {userProdi} • {t('dashboard.class_year', undefined, 'Angkatan')} {userAngkatan}
                            </p>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {t('dashboard.welcome_desc', undefined, 'Kelola pendaftaran mitra, pencatatan logbook kegiatan harian, dan berkas evaluasi akhir Kerja Praktik melalui portal ini.')}
                        </p>
                        <div className="flex flex-wrap gap-2.5 pt-2">
                            <Link 
                                href="/panduan" 
                                className="bg-[#00288e] hover:bg-[#001f70] text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>{t('dashboard.guidebook', undefined, 'Panduan & Berkas')}</span>
                            </Link>
                            <a 
                                href="/dokumen/buku_panduan_kp.pdf" 
                                download 
                                className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                                <Download className="w-4 h-4 text-slate-500" />
                                <span>Unduh PDF</span>
                            </a>
                            <a 
                                href={`mailto:${campusEmail}`} 
                                className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center shadow-xs"
                            >
                                {t('dashboard.coordinator_help', undefined, 'Bantuan Koordinator')}
                            </a>
                        </div>
                    </div>
                    <div className="w-full md:w-48 h-32 md:h-40 rounded-xl overflow-hidden shadow-2xs relative flex-shrink-0 border border-slate-200">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXQKsbzd0HD4f87_TGfq2xTvVtGgchivENcvI5tuAqWBzCZ4NTAqck8TfJWnxGrLU8E7mQBzg8jQrXtTTWvKO7-3vdt8qaMNVjriuIkU387_tBzIULkAu87DgtHWZk2k-rG9AuDj-Aq4trJR2gXUbtBseLTunRNoHlxwHiggYt2lHFsxqXBGitSitJ6JqWO7Inv72Y2OvpN12fMOv0eAUroC_lewtjrRmCa_K0pPAvbL56Iz6Yq9whcXPcRdbtu9XuV21deV-yHag"
                            alt="Teknik Informatika UTM"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Status Chip Card */}
                <div className="col-span-12 lg:col-span-4 bg-[#00288e] text-white border border-[#00288e] rounded-xl p-6 flex flex-col justify-between shadow-xs">
                    <div>
                        <span className="text-[11px] uppercase tracking-wider font-semibold opacity-75">{t('dashboard.current_status', undefined, 'Status Pengajuan')}</span>
                        <h4 className="text-xl font-bold mt-1.5">{statusInfo.label}</h4>
                        <p className="text-xs mt-1.5 text-blue-100/90 leading-relaxed">{statusInfo.description}</p>
                    </div>
                    <div className="mt-5">
                        <Link href="/mahasiswa/status-pengajuan" className="inline-flex items-center gap-1.5 bg-white text-[#00288e] hover:bg-slate-100 px-4 py-2 rounded-lg font-semibold text-xs transition-colors shadow-2xs">
                            <span>{t('dashboard.status_detail', undefined, 'Detail Status')}</span>
                        </Link>
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
                                {t('dashboard.sop_title', undefined, 'Standar Operasional Prosedur (SOP)')}
                            </h3>
                            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                                {t('dashboard.sop_revision', undefined, 'Alur Pelaksanaan')}
                            </span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold text-label-md">1</div>
                                <div>
                                    <h4 className="text-label-md text-on-surface font-semibold">{t('dashboard.sop_step_1_title', undefined, 'Pendaftaran Awal')}</h4>
                                    <p className="text-body-sm text-secondary">{t('dashboard.sop_step_1_desc', undefined, 'Daftar via portal dengan mengunggah transkrip dan syarat kelulusan SKS.')}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold text-label-md">2</div>
                                <div>
                                    <h4 className="text-label-md text-on-surface font-semibold">{t('dashboard.sop_step_2_title', undefined, 'Penentuan Pembimbing')}</h4>
                                    <p className="text-body-sm text-secondary">{t('dashboard.sop_step_2_desc', undefined, 'Penetapan Dosen Pembimbing oleh Koordinator KP sesuai bidang minat.')}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold text-label-md">3</div>
                                <div>
                                    <h4 className="text-label-md text-on-surface font-semibold">{t('dashboard.sop_step_3_title', undefined, 'Bimbingan & Pelaksanaan')}</h4>
                                    <p className="text-body-sm text-secondary">{t('dashboard.sop_step_3_desc', undefined, 'Pelaksanaan magang mitra, bimbingan rutin dosen, dan pengisian logbook.')}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold text-label-md">4</div>
                                <div>
                                    <h4 className="text-label-md text-on-surface font-semibold">{t('dashboard.sop_step_4_title', undefined, 'Dokumen Akhir & Ujian')}</h4>
                                    <p className="text-body-sm text-secondary">{t('dashboard.sop_step_4_desc', undefined, 'Unggah Berita Acara, formulir nilai mitra, dan laporan akhir untuk yudisium.')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 bg-white border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <Calendar className="w-5 h-5 text-primary" />
                            <h3 className="text-title-md font-bold text-on-surface">{t('dashboard.schedule_title', undefined, 'Jadwal Penting KP')}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 flex items-start justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-label-md font-bold text-on-surface">{t('dashboard.schedule_registration', undefined, 'Pendaftaran Kerja Praktik')}</h4>
                                    <p className="text-body-sm text-secondary flex items-center gap-1.5 mt-1">
                                        <Clock className="w-4 h-4 text-primary" />
                                        {t('dashboard.schedule_registration_date', undefined, '1 Agustus - 31 Agustus 2026')}
                                    </p>
                                </div>
                                <span className="text-label-xs bg-success-container/20 text-success px-2 py-0.5 rounded font-bold">
                                    {t('dashboard.active', undefined, 'Aktif')}
                                </span>
                            </div>

                            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 flex items-start justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-label-md font-bold text-on-surface">{t('dashboard.schedule_cover_letter', undefined, 'Pengajuan Surat Pengantar')}</h4>
                                    <p className="text-body-sm text-secondary flex items-center gap-1.5 mt-1">
                                        <Clock className="w-4 h-4 text-primary" />
                                        {t('dashboard.schedule_cover_letter_date', undefined, '1 Agustus - 15 September 2026')}
                                    </p>
                                </div>
                                <span className="text-label-xs bg-success-container/20 text-success px-2 py-0.5 rounded font-bold">
                                    {t('dashboard.active', undefined, 'Aktif')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links & Notifications */}
            <div className="grid grid-cols-12 gap-6">
                {/* Info Pembimbing & Instansi */}
                {hasPendaftaran && (
                    <div className="col-span-12 bg-white border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
                        <div className="flex-1 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <h4 className="text-label-md font-bold text-primary mb-1 uppercase tracking-wider">{t('dashboard.supervisor_title', undefined, 'Dosen Pembimbing')}</h4>
                            <p className="text-title-md font-bold text-on-surface">{dosenPembimbing || t('dashboard.not_assigned', undefined, 'Belum Ditentukan')}</p>
                        </div>
                        <div className="flex-1 p-4 bg-secondary-container/20 border border-secondary-container/50 rounded-lg">
                            <h4 className="text-label-md font-bold text-secondary mb-1 uppercase tracking-wider">{t('dashboard.company_title', undefined, 'Instansi KP')}</h4>
                            <p className="text-title-md font-bold text-on-surface">{instansi || t('dashboard.not_assigned', undefined, 'Belum Ditentukan')}</p>
                            <p className="text-body-sm text-secondary mt-1">
                                {pembimbingLapangan ? `${t('dashboard.field_supervisor_prefix', undefined, 'Pembimbing: ')}${pembimbingLapangan}` : `${t('dashboard.field_supervisor', undefined, 'Pembimbing Lapangan')}: ${t('dashboard.not_assigned', undefined, 'Belum Ditentukan')}`}
                            </p>
                        </div>
                    </div>
                )}

                <div className="col-span-12 lg:col-span-7 bg-white border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-3">
                            <h3 className="text-title-lg font-bold">{t('dashboard.recent_notifications', undefined, 'Notifikasi Terbaru')}</h3>
                            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                                <button
                                    type="button"
                                    onClick={() => setNotifFilter('important')}
                                    className={`px-2.5 py-1 rounded-md transition ${notifFilter === 'important' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    Penting
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNotifFilter('all')}
                                    className={`px-2.5 py-1 rounded-md transition ${notifFilter === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    Semua ({notifications.length})
                                </button>
                            </div>
                        </div>
                        <button className="text-primary text-label-md hover:underline">{t('dashboard.view_all', undefined, 'Lihat Semua')}</button>
                    </div>
                    <div className="divide-y divide-outline-variant">
                        {displayedNotifications.length > 0 ? (
                            displayedNotifications.map((notif) => {
                                const { icon: Icon, bgClass, iconClass } = getNotifIcon(notif.tipe);
                                return (
                                    <div key={notif.id} className="p-4 flex space-x-4 hover:bg-surface-container-low transition-colors cursor-pointer">
                                        <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className={`w-5 h-5 ${iconClass}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h5 className={`text-label-md font-bold ${notif.tipe === 'error' ? 'text-error' : ''}`}>{notif.judul}</h5>
                                                    {notif.priority === 'high' && (
                                                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                            Penting
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-label-sm text-secondary shrink-0">{notif.created_at}</span>
                                            </div>
                                            <p className="text-body-sm text-on-surface-variant mt-1">{notif.pesan}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-secondary text-body-md">
                                {t('header.no_notifications', undefined, 'Belum ada notifikasi baru.')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side widgets */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                    {/* Panduan Kerja Praktik download list */}
                    <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-label-md font-bold mb-1 uppercase tracking-wider text-secondary">{t('dashboard.guidance_docs', undefined, 'Dokumen Panduan')}</h3>
                            <p className="text-body-sm text-secondary mb-4">{t('dashboard.guidance_docs_desc', undefined, 'Format resmi berkas proposal, berita acara, dan pedoman Kerja Praktik.')}</p>
                            <div className="space-y-3">
                                <a
                                    href="/dokumen/buku_panduan_kp.pdf"
                                    download
                                    className="flex items-center justify-between p-3 bg-white border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary-container/20 rounded-md group-hover:bg-primary-container/40 transition-colors">
                                            <BookOpen className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-label-md font-bold text-on-surface">{t('dashboard.doc_guidebook', undefined, 'Buku Panduan KP')}</p>
                                            <p className="text-body-xs text-secondary">PDF • 2.4 MB</p>
                                        </div>
                                    </div>
                                    <Download className="w-5 h-5 text-secondary group-hover:text-primary group-hover:translate-y-0.5 transition-all" />
                                </a>

                                <a
                                    href="/dokumen/template_proposal.docx"
                                    download
                                    className="flex items-center justify-between p-3 bg-white border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary-container/20 rounded-md group-hover:bg-primary-container/40 transition-colors">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-label-md font-bold text-on-surface">{t('dashboard.doc_proposal', undefined, 'Template Proposal KP')}</p>
                                            <p className="text-body-xs text-secondary">DOCX • 1.2 MB</p>
                                        </div>
                                    </div>
                                    <Download className="w-5 h-5 text-secondary group-hover:text-primary group-hover:translate-y-0.5 transition-all" />
                                </a>

                                <a
                                    href="/dokumen/template_berita_acara.docx"
                                    download
                                    className="flex items-center justify-between p-3 bg-white border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary-container/20 rounded-md group-hover:bg-primary-container/40 transition-colors">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-label-md font-bold text-on-surface">{t('dashboard.doc_berita_acara', undefined, 'Template Berita Acara')}</p>
                                            <p className="text-body-xs text-secondary">DOCX • 1.5 MB</p>
                                        </div>
                                    </div>
                                    <Download className="w-5 h-5 text-secondary group-hover:text-primary group-hover:translate-y-0.5 transition-all" />
                                </a>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                                <span className="text-xs text-secondary font-medium">Dokumen dan panduan lengkap:</span>
                                <Link 
                                    href="/panduan" 
                                    className="inline-flex items-center text-xs font-bold text-[#00288e] hover:underline cursor-pointer"
                                >
                                    <span>Halaman Panduan</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
