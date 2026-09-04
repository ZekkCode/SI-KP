import React from 'react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Award, Printer, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

interface RincianNilai {
    komponen: string;
    bobot: number;
    nilai: number;
}

interface RaporData {
    mahasiswa: any;
    status_kp: string;
    dosen_pembimbing: string;
    instansi: string;
    agregat_dosen: number | null;
    agregat_instansi: number | null;
    agregat_ujian: number | null;
    nilai_total: number | null;
    nilai_huruf: string;
    status_lulus: string;
    catatan: string | null;
    rincian_dosen: RincianNilai[];
    rincian_instansi: RincianNilai[];
}

interface PenilaianProps extends PageProps {
    hasData: boolean;
    message?: string;
    rapor?: RaporData;
}

export default function Index({ hasData, message, rapor }: PenilaianProps) {
    if (!hasData || !rapor) {
        return (
            <div className="flex-1 p-6 max-w-[1200px] mx-auto w-full space-y-6">
                <Head title="Penilaian Kerja Praktik" />
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm">
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    <div>
                        <p className="font-bold">Informasi</p>
                        <p className="text-sm">{message || 'Data pendaftaran belum tersedia.'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 max-w-[1200px] mx-auto w-full space-y-6">
            <Head title="Hasil Penilaian Kerja Praktik" />
            
            <PageHeader title="Hasil Penilaian" description="Rincian hasil penilaian Kerja Praktik Anda.">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Award className="w-8 h-8 text-primary" />
                </div>
            </PageHeader>

            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant overflow-hidden mb-8">
                <div className="p-6 bg-surface-container-lowest border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-title-lg font-bold text-on-surface">Rapor Kerja Praktik</h2>
                        <p className="text-secondary text-body-md">Instansi: {rapor.instansi} | Dosen: {rapor.dosen_pembimbing}</p>
                    </div>
                    
                    {(rapor.rincian_dosen.length > 0 || rapor.rincian_instansi.length > 0) && (
                        <div className="flex gap-3 shrink-0">
                            <a
                                href={route('mahasiswa.penilaian.cetak')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-secondary/90 transition-all text-label-md"
                            >
                                <Printer className="w-5 h-5" />
                                Cetak Bukti Nilai
                            </a>
                            
                            {rapor.rincian_instansi.length > 0 && (
                                <a
                                    href={route('mahasiswa.penilaian.cetak-instansi')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white border border-outline text-primary px-5 py-2.5 rounded-lg font-bold hover:bg-surface-variant transition-all text-label-md"
                                >
                                    <Printer className="w-5 h-5" />
                                    Cetak Nilai Instansi
                                </a>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6">
                    {rapor.rincian_dosen.length === 0 && rapor.rincian_instansi.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-outline mx-auto mb-4" />
                            <h3 className="text-title-md font-bold text-on-surface">Penilaian Masih Diproses</h3>
                            <p className="text-secondary mt-2">Dosen atau Instansi belum melengkapi komponen nilai Anda.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Dosen Pembimbing Section */}
                                <div>
                                    <h3 className="text-title-md font-bold mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        Nilai Dosen Pembimbing (30%)
                                    </h3>
                                    {rapor.rincian_dosen.length > 0 ? (
                                        <div className="overflow-x-auto border border-outline-variant rounded-xl">
                                            <ModernTable>
                                                <ModernTableHeader>
                                                    <tr>
                                                        <ModernTableTh>Komponen</ModernTableTh>
                                                        <ModernTableTh>Nilai (0-100)</ModernTableTh>
                                                    </tr>
                                                </ModernTableHeader>
                                                <ModernTableBody>
                                                    {rapor.rincian_dosen.map((n, i) => (
                                                        <tr key={i}>
                                                            <ModernTableTd>{n.komponen}</ModernTableTd>
                                                            <ModernTableTd>{n.nilai}</ModernTableTd>
                                                        </tr>
                                                    ))}
                                                    <tr className="bg-surface-container-lowest">
                                                        <ModernTableTd>Rata-rata/Agregat Dosen</ModernTableTd>
                                                        <ModernTableTd>{rapor.agregat_dosen}</ModernTableTd>
                                                    </tr>
                                                </ModernTableBody>
                                            </ModernTable>
                                        </div>
                                    ) : (
                                        <p className="text-secondary italic">Belum ada rincian nilai dosen.</p>
                                    )}
                                </div>

                                {/* Instansi Section */}
                                <div>
                                    <h3 className="text-title-md font-bold mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        Nilai Instansi (30%)
                                    </h3>
                                    {rapor.rincian_instansi.length > 0 ? (
                                        <div className="overflow-x-auto border border-outline-variant rounded-xl">
                                            <ModernTable>
                                                <ModernTableHeader>
                                                    <tr>
                                                        <ModernTableTh>Komponen</ModernTableTh>
                                                        <ModernTableTh>Nilai (0-100)</ModernTableTh>
                                                    </tr>
                                                </ModernTableHeader>
                                                <ModernTableBody>
                                                    {rapor.rincian_instansi.map((n, i) => (
                                                        <tr key={i}>
                                                            <ModernTableTd>{n.komponen}</ModernTableTd>
                                                            <ModernTableTd>{n.nilai}</ModernTableTd>
                                                        </tr>
                                                    ))}
                                                    <tr className="bg-surface-container-lowest">
                                                        <ModernTableTd>Rata-rata/Agregat Instansi</ModernTableTd>
                                                        <ModernTableTd>{rapor.agregat_instansi}</ModernTableTd>
                                                    </tr>
                                                </ModernTableBody>
                                            </ModernTable>
                                        </div>
                                    ) : (
                                        <p className="text-secondary italic">Belum ada rincian nilai instansi.</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant text-center">
                                    <h3 className="text-title-md font-bold text-secondary mb-2">Total Nilai Akhir</h3>
                                    <div className="text-display-lg text-primary font-bold mb-1">{rapor.nilai_total}</div>
                                    <div className="inline-block bg-primary text-white px-4 py-1 rounded-full text-title-md font-bold mb-4">
                                        Grade {rapor.nilai_huruf}
                                    </div>
                                    <div className="text-label-md font-medium text-secondary">
                                        Status: <span className={rapor.status_lulus === 'lulus' ? 'text-green-600' : 'text-red-600'}>{rapor.status_lulus.toUpperCase()}</span>
                                    </div>
                                </div>
                                
                                {rapor.catatan && (
                                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
                                        <h3 className="text-label-lg font-bold text-orange-800 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5" />
                                            Catatan
                                        </h3>
                                        <p className="text-body-md text-orange-900 whitespace-pre-wrap">{rapor.catatan}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
