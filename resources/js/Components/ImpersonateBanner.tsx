import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { UserCheck, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function ImpersonateBanner() {
    const { auth } = usePage().props as any;
    const isImpersonating = Boolean(auth?.impersonated_by);

    if (!isImpersonating) return null;

    return (
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2.5 text-xs font-semibold shadow-md flex items-center justify-between z-50 sticky top-0">
            <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-200 shrink-0 animate-pulse" />
                <span>
                    Mode Troubleshooting: Anda sedang login sebagai <strong>{auth?.user?.name}</strong> ({auth?.user?.email})
                </span>
            </div>
            <Link
                href="/admin/impersonate/leave"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-50 transition shadow-xs shrink-0"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Panel Super User</span>
            </Link>
        </div>
    );
}
