import React from 'react';
import DosenLayout from '@/Layouts/DosenLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ClipboardList, Edit, CheckCircle, Clock, Download, FileText, ExternalLink } from 'lucide-react';

interface Mahasiswa {
    id: number;
    name: string;
    nim: string;
}

interface Pendaftaran {
    id: number;
    mahasiswa: Mahasiswa;
    status_kp: string;
    is_dinilai: boolean;
    nilai_pembimbing: number | null;
}

export default function Index({ auth, pendaftarans }: PageProps<{ pendaftarans: Pendaftaran[] }>) {
    return (
        <div className="flex-1 p-6 max-w-[1200px] mx-auto w-full">
            <Head title="Penilaian Mahasiswa" />
            
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-display-sm text-on-surface mb-2">Penilaian Mahasiswa</h1>
                    <p className="text-body-md text-secondary">
                        Daftar mahasiswa bimbingan yang telah masuk tahap penilaian Kerja Praktik.
                    </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-xl">
                    <ClipboardList className="w-8 h-8 text-primary" />
                </div>
            </div>

            {/* Kartu Format Resmi Penilaian & Berkas Seminar Dosen */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-[#00288e] flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Format Resmi Penilaian & Berkas Seminar KP Dosen</h3>
                            <p className="text-[11px] text-slate-500">
                                Unduh format formulir evaluasi, lembar revisi, dan berita acara ujian untuk keperluan administrasi penguji/pembimbing.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/panduan"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#00288e] hover:underline shrink-0"
                    >
                        <span>Katalog Panduan & Formulir</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
                    <a
                        href="/dokumen/lampiran/Lampiran_11_Penilaian_Penguji_dan_Pembimbing_Form_KP-6b.pdf"
                        download
                        className="flex items-start gap-2 p-2.5 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 transition group cursor-pointer"
                    >
                        <Download className="w-4 h-4 text-[#00288e] shrink-0 mt-0.5 group-hover:translate-y-0.5 transition-transform" />
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Form KP-6b</span>
                            <p className="text-xs font-semibold text-slate-900 mt-1 truncate">Penilaian Penguji & Pembimbing</p>
                            <p className="text-[10px] text-slate-500 truncate">Instrumen penilaian naskah & ujian</p>
                        </div>
                    </a>

                    <a
                        href="/dokumen/lampiran/Lampiran_10_Berita_Acara_Ujian_KP_Form_KP-5.pdf"
                        download
                        className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition group cursor-pointer"
                    >
                        <Download className="w-4 h-4 text-slate-600 shrink-0 mt-0.5 group-hover:translate-y-0.5 transition-transform" />
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Form KP-5</span>
                            <p className="text-xs font-semibold text-slate-900 mt-1 truncate">Berita Acara Ujian KP</p>
                            <p className="text-[10px] text-slate-500 truncate">Rekap hasil ujian dan kelulusan</p>
                        </div>
                    </a>

                    <a
                        href="/dokumen/lampiran/Lampiran_08_Lembar_Revisi_Dosen_Penguji_1_Form_KP-4a.pdf"
                        download
                        className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition group cursor-pointer"
                    >
                        <Download className="w-4 h-4 text-slate-600 shrink-0 mt-0.5 group-hover:translate-y-0.5 transition-transform" />
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">Form KP-4a & 4b</span>
                            <p className="text-xs font-semibold text-slate-900 mt-1 truncate">Lembar Revisi Penguji</p>
                            <p className="text-[10px] text-slate-500 truncate">Daftar catatan perbaikan laporan</p>
                        </div>
                    </a>

                    <a
                        href="/dokumen/lampiran/Lampiran_06_Lembar_Persetujuan_Seminar_KP_Form_KP-8.pdf"
                        download
                        className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition group cursor-pointer"
                    >
                        <Download className="w-4 h-4 text-slate-600 shrink-0 mt-0.5 group-hover:translate-y-0.5 transition-transform" />
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">Form KP-8</span>
                            <p className="text-xs font-semibold text-slate-900 mt-1 truncate">Persetujuan Seminar KP</p>
                            <p className="text-[10px] text-slate-500 truncate">Persetujuan maju ujian seminar</p>
                        </div>
                    </a>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant">
                                <th className="px-6 py-4 text-label-md text-secondary font-semibold">No</th>
                                <th className="px-6 py-4 text-label-md text-secondary font-semibold">NIM</th>
                                <th className="px-6 py-4 text-label-md text-secondary font-semibold">Nama Mahasiswa</th>
                                <th className="px-6 py-4 text-label-md text-secondary font-semibold">Status Nilai</th>
                                <th className="px-6 py-4 text-label-md text-secondary font-semibold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {pendaftarans.length > 0 ? (
                                pendaftarans.map((p, index) => (
                                    <tr key={p.id} className="hover:bg-surface-container-lowest transition-colors">
                                        <td className="px-6 py-4 text-body-md text-on-surface">{index + 1}</td>
                                        <td className="px-6 py-4 text-body-md text-on-surface font-mono text-sm">{p.mahasiswa?.nim}</td>
                                        <td className="px-6 py-4 text-body-md text-on-surface font-semibold">{p.mahasiswa?.name}</td>
                                        <td className="px-6 py-4">
                                            {p.is_dinilai ? (
                                                <div className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-md text-xs font-semibold">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Sudah Dinilai ({p.nilai_pembimbing})
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-semibold">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Belum Dinilai
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                href={route('dosen.penilaian.create', p.id)}
                                                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-all text-label-md"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Beri Nilai
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-secondary">
                                        Tidak ada data mahasiswa bimbingan yang perlu dinilai.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
