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
            
            <PageHeader title="Hasil Penilaian" description="Rincian hasil evaluasi nilai Kerja Praktik dari Dosen dan Instansi.">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-700">
                    <Award className="w-7 h-7" />
                </div>
            </PageHeader>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-base font-bold text-slate-800">Rapor Kerja Praktik</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Instansi: <span className="font-semibold text-slate-700">{rapor.instansi}</span> | Dosen: <span className="font-semibold text-slate-700">{rapor.dosen_pembimbing}</span></p>
                    </div>
                    
                    {(rapor.rincian_dosen.length > 0 || rapor.rincian_instansi.length > 0) && (
                        <div className="flex gap-2.5 shrink-0">
                            <a
                                href={route('mahasiswa.penilaian.cetak')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#00288e] hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-xs shadow-sm"
                            >
                                <Printer className="w-4 h-4" />
                                Cetak Nilai
                            </a>
                            
                            {rapor.rincian_instansi.length > 0 && (
                                <a
                                    href={route('mahasiswa.penilaian.cetak-instansi')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-xs"
                                >
                                    <Printer className="w-4 h-4" />
                                    Nilai Instansi
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
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Nilai Akhir</h3>
                                    <div className="text-4xl text-[#00288e] font-bold mb-2">{rapor.nilai_total}</div>
                                    <div className="inline-block bg-[#00288e] text-white px-3 py-1 rounded-md text-xs font-bold mb-3">
                                        Grade {rapor.nilai_huruf}
                                    </div>
                                    <div className="text-xs font-medium text-slate-500">
                                        Status: <span className={`font-bold ${rapor.status_lulus === 'lulus' ? 'text-green-600' : 'text-red-600'}`}>{rapor.status_lulus.toUpperCase()}</span>
                                    </div>
                                </div>
                                
                                {rapor.catatan && (
                                    <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                                        <h3 className="text-xs font-bold text-amber-800 mb-1.5 flex items-center gap-1.5">
                                            <AlertCircle className="w-4 h-4" />
                                            Catatan Evaluasi
                                        </h3>
                                        <p className="text-xs text-amber-900 whitespace-pre-wrap leading-relaxed">{rapor.catatan}</p>
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
