import { useTranslation } from '@/hooks/useTranslation';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
    className?: string;
    variant?: 'compact' | 'badge';
}

export default function LanguageSwitcher({ className = '', variant = 'badge' }: LanguageSwitcherProps) {
    const { locale, switchLocale } = useTranslation();

    return (
        <div className={`inline-flex items-center bg-slate-100/90 border border-slate-200 rounded-lg p-0.5 text-xs font-semibold ${className}`}>
            <button
                type="button"
                onClick={() => switchLocale('id')}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer ${
                    locale === 'id'
                        ? 'bg-[#00288e] text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                title="Ganti ke Bahasa Indonesia"
            >
                <span className="text-[11px] uppercase tracking-wide">ID</span>
            </button>
            <button
                type="button"
                onClick={() => switchLocale('en')}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer ${
                    locale === 'en'
                        ? 'bg-[#00288e] text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                title="Switch to English"
            >
                <span className="text-[11px] uppercase tracking-wide">EN</span>
            </button>
        </div>
    );
}
