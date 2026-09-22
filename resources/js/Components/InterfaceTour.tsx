import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { 
    X, 
    ChevronRight, 
    ChevronLeft, 
    Check, 
    Sparkles, 
    Users, 
    BookOpen, 
    Globe, 
    PhoneCall, 
    HelpCircle,
    Compass
} from 'lucide-react';

export interface TourStep {
    targetId: string;
    titleKey: string;
    titleFallback: string;
    descKey: string;
    descFallback: string;
    icon: any;
    accentColor: string;
}

const DEFAULT_STEPS: TourStep[] = [
    {
        targetId: 'tour-roles',
        titleKey: 'tour.step_roles_title',
        titleFallback: 'Pilih Portal Sesuai Peran Anda',
        descKey: 'tour.step_roles_desc',
        descFallback: 'Tersedia 5 portal: Mahasiswa, Dosen Pembimbing, Tata Usaha, Pembimbing Lapangan, dan Koordinator. Pilih kartu peran Anda untuk membuka formulir masuk.',
        icon: Users,
        accentColor: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
        targetId: 'tour-google-sso',
        titleKey: 'tour.step_google_title',
        titleFallback: 'Masuk Cepat via Akun Kampus',
        descKey: 'tour.step_google_desc',
        descFallback: 'Gunakan akun Google resmi (@student.trunojoyo.ac.id atau @trunojoyo.ac.id) untuk masuk langsung dengan aman tanpa perlu mengetik kata sandi.',
        icon: Sparkles,
        accentColor: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
        targetId: 'tour-panduan',
        titleKey: 'tour.step_panduan_title',
        titleFallback: 'Akses Panduan & Format Berkas',
        descKey: 'tour.step_panduan_desc',
        descFallback: 'Pelajari alur pelaksanaan Kerja Praktik serta unduh format resmi proposal, lembar pengesahan, dan berita acara.',
        icon: BookOpen,
        accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
        targetId: 'tour-language',
        titleKey: 'tour.step_language_title',
        titleFallback: 'Atur Bahasa Tampilan',
        descKey: 'tour.step_language_desc',
        descFallback: 'Sistem menggunakan Bahasa Indonesia secara bawaan. Anda dapat beralih ke Bahasa Inggris kapan saja melalui tombol ini.',
        icon: Globe,
        accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
        targetId: 'tour-contact-bar',
        titleKey: 'tour.step_contact_title',
        titleFallback: 'Kontak Layanan & Bantuan',
        descKey: 'tour.step_contact_desc',
        descFallback: 'Perlu bantuan teknis atau administrasi? Klik nomor telepon, email, atau alamat kampus untuk langsung menghubungi sekretariat prodi.',
        icon: PhoneCall,
        accentColor: 'text-rose-600 bg-rose-50 border-rose-200',
    },
];

interface InterfaceTourProps {
    isOpen?: boolean;
    onClose?: () => void;
    autoStart?: boolean;
}

export default function InterfaceTour({ 
    isOpen: propIsOpen, 
    onClose: propOnClose, 
    autoStart = true 
}: InterfaceTourProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    // Cookie helpers
    const getCookie = (name: string): string | null => {
        if (typeof document === 'undefined') return null;
        const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
        return matches ? decodeURIComponent(matches[1]) : null;
    };

    const setTourSeenCookie = () => {
        if (typeof document === 'undefined') return;
        // Simpan cookie 365 hari
        document.cookie = `sikp_tour_seen=1; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
        try {
            sessionStorage.setItem('sikp_tour_seen', '1');
        } catch {
            // Ignore sessionStorage error
        }
    };

    // Auto-open check on first visit
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (propIsOpen !== undefined) {
            setIsOpen(propIsOpen);
            return;
        }

        if (autoStart) {
            const hasSeenCookie = getCookie('sikp_tour_seen') === '1';
            let hasSeenSession = false;
            try {
                hasSeenSession = sessionStorage.getItem('sikp_tour_seen') === '1';
            } catch {}

            if (!hasSeenCookie && !hasSeenSession) {
                const timer = setTimeout(() => {
                    setIsOpen(true);
                    setCurrentStepIndex(0);
                }, 750);
                return () => clearTimeout(timer);
            }
        }
    }, [propIsOpen, autoStart]);

    // Measure target element position
    const updateTargetPosition = useCallback(() => {
        if (!isOpen) {
            setTargetRect(null);
            return;
        }

        const step = DEFAULT_STEPS[currentStepIndex];
        if (!step) return;

        const el = document.getElementById(step.targetId);
        if (el) {
            // Smoothly scroll element into view if not visible
            const rect = el.getBoundingClientRect();
            const isInView = (
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            );

            if (!isInView) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Small delay to get stabilized rect after scroll
            setTimeout(() => {
                const updatedRect = el.getBoundingClientRect();
                setTargetRect(updatedRect);
            }, 100);
        } else {
            setTargetRect(null);
        }
    }, [isOpen, currentStepIndex]);

    useEffect(() => {
        updateTargetPosition();

        window.addEventListener('resize', updateTargetPosition);
        window.addEventListener('scroll', updateTargetPosition, true);

        return () => {
            window.removeEventListener('resize', updateTargetPosition);
            window.removeEventListener('scroll', updateTargetPosition, true);
        };
    }, [updateTargetPosition]);

    const handleClose = () => {
        setTourSeenCookie();
        setIsOpen(false);
        if (propOnClose) propOnClose();
    };

    const handleNext = () => {
        if (currentStepIndex < DEFAULT_STEPS.length - 1) {
            setCurrentStepIndex((prev) => prev + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prev) => prev - 1);
        }
    };

    if (!isOpen) return null;

    const currentStep = DEFAULT_STEPS[currentStepIndex];
    const IconComponent = currentStep.icon;
    const isLastStep = currentStepIndex === DEFAULT_STEPS.length - 1;

    // Hitung posisi popover modal card
    const getCardStyle = () => {
        if (!targetRect || typeof window === 'undefined') {
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            };
        }

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const cardWidth = Math.min(420, windowWidth - 32);

        // Jika target di bagian atas layar, taruh popover di bawahnya
        let top = targetRect.bottom + 16;
        let left = targetRect.left + (targetRect.width / 2) - (cardWidth / 2);

        // Clamp posisi horizontal agar tidak terpotong
        if (left < 16) left = 16;
        if (left + cardWidth > windowWidth - 16) {
            left = windowWidth - cardWidth - 16;
        }

        // Jika bagian bawah tidak cukup ruang, taruh di atasnya
        if (top + 260 > windowHeight) {
            top = Math.max(16, targetRect.top - 270);
        }

        return {
            top: `${Math.max(16, top)}px`,
            left: `${left}px`,
            width: `${cardWidth}px`,
        };
    };

    return (
        <div className="fixed inset-0 z-50 pointer-events-auto">
            {/* 1. Backdrop Gelap Transparan */}
            <div 
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] transition-opacity duration-300"
                onClick={handleClose}
            />

            {/* 2. Spotlight Cutout / Ring Sorotan pada Elemen Target */}
            {targetRect && (
                <div
                    style={{
                        top: `${targetRect.top - 6}px`,
                        left: `${targetRect.left - 6}px`,
                        width: `${targetRect.width + 12}px`,
                        height: `${targetRect.height + 12}px`,
                    }}
                    className="fixed pointer-events-none rounded-xl border-2 border-amber-400 ring-4 ring-amber-400/40 shadow-[0_0_0_9999px_rgba(2,6,23,0.55)] transition-all duration-300 z-50 animate-pulse"
                />
            )}

            {/* 3. Popover Card Penjelasan Tur "Ini Disini" */}
            <div 
                style={getCardStyle()} 
                className="fixed z-50 bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-5 sm:p-6 transition-all duration-200"
            >
                {/* Header: Badge & Close Button */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-50 text-[#00288e] border border-blue-200">
                            <Compass className="w-3 h-3 text-[#00288e]" />
                            {t('tour.badge', undefined, 'Tur Panduan Cepat')}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                            {t('tour.step_indicator', { current: currentStepIndex + 1, total: DEFAULT_STEPS.length }, `Langkah ${currentStepIndex + 1} dari ${DEFAULT_STEPS.length}`)}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title={t('tour.skip', undefined, 'Tutup Tur')}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Konten Penjelasan */}
                <div className="flex items-start gap-3.5 mb-4">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${currentStep.accentColor}`}>
                        <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                            {t(currentStep.titleKey, undefined, currentStep.titleFallback)}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                            {t(currentStep.descKey, undefined, currentStep.descFallback)}
                        </p>
                    </div>
                </div>

                {/* Step Dots Indicator */}
                <div className="flex items-center justify-center gap-1.5 py-2 mb-3">
                    {DEFAULT_STEPS.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentStepIndex(idx)}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                idx === currentStepIndex
                                    ? 'w-6 bg-[#00288e]'
                                    : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                            }`}
                            title={`Langkah ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-2 py-1.5"
                    >
                        {t('tour.skip', undefined, 'Lewati')}
                    </button>

                    <div className="flex items-center gap-2">
                        {currentStepIndex > 0 && (
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span>{t('tour.prev', undefined, 'Sebelumnya')}</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleNext}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00288e] hover:bg-[#001f70] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                        >
                            <span>
                                {isLastStep 
                                    ? t('tour.finish', undefined, 'Mengerti & Mulai') 
                                    : t('tour.next', undefined, 'Lanjut')
                                }
                            </span>
                            {isLastStep ? (
                                <Check className="w-3.5 h-3.5" />
                            ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
