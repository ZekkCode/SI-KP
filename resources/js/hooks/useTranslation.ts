import { usePage, router } from '@inertiajs/react';

export function useTranslation() {
    const { props } = usePage();
    const locale = ((props as any).locale as string) || 'id';
    const translations = ((props as any).translations as Record<string, any>) || {};

    /**
     * Translate a dot-notated key e.g. 'nav.dashboard' or 'dashboard.welcome'
     * with optional parameter replacements like { name: 'Mahasiswa' }.
     */
    const t = (key: string, replacements?: Record<string, string | number>, fallback?: string): string => {
        const parts = key.split('.');
        let current: any = translations;

        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                current = null;
                break;
            }
        }

        let result = typeof current === 'string' ? current : (fallback || key);

        if (replacements && typeof result === 'string') {
            for (const [k, v] of Object.entries(replacements)) {
                result = result.replace(new RegExp(`:${k}`, 'g'), String(v));
            }
        }

        return result;
    };

    /**
     * Switch language between 'id' and 'en'
     */
    const switchLocale = (newLocale: 'id' | 'en') => {
        router.get(
            `/locale/${newLocale}`,
            {},
            { preserveScroll: true, preserveState: false }
        );
    };

    return { t, locale, switchLocale };
}
