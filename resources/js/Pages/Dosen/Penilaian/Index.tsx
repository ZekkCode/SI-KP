import React from 'react';
import DosenLayout from '@/Layouts/DosenLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ClipboardList, Edit, CheckCircle, Clock } from 'lucide-react';

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
