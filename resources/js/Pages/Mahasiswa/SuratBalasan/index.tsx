import React from 'react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { PageProps } from '@/types';

export default function SuratBalasanIndex(props: PageProps) {
    return (
        <div className="p-6 max-w-[1280px] mx-auto w-full flex-1">
            <h1 className="text-headline-md text-on-surface mb-4">Surat Balasan</h1>
            <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
                <p className="text-body-md text-secondary">Belum ada surat balasan dari instansi.</p>
            </div>
        </div>
    );
}

SuratBalasanIndex.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;