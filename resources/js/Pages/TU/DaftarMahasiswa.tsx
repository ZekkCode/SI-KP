import TULayout from '@/Layouts/TULayout';
import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Search, Users, ChevronRight } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    nim: string;
    program_studi: string;
    semester: string;
    ipk: string | number;
    status_pendaftaran: string;
}

interface Props {
    students: Student[];
    filters: {
        search: string | null;
    };
}

export default function DaftarMahasiswa({ students, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/tu/mahasiswa', { search }, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'diajukan':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'verifikasi_tu':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'perlu_perbaikan':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'disetujui_tu':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'surat_terbit':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'diterima_instansi':
                return 'bg-teal-50 text-teal-700 border-teal-200';
            case 'aktif':
                return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'selesai':
                return 'bg-slate-100 text-slate-800 border-slate-300';
            case 'draft':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'belum mendaftar':
            default:
                return 'bg-gray-50 text-gray-500 border-gray-200';
        }
    };

    const formatStatusLabel = (status: string) => {
        return status.replace(/_/g, ' ').toUpperCase();
    };

    return (
        <div className="space-y-6">
            <Head title="Daftar Mahasiswa" />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-semibold text-on-surface">Database Mahasiswa</h2>
                    <p className="text-on-surface-variant mt-1">Daftar seluruh mahasiswa yang terdaftar di Sistem Kerja Praktik.</p>
                </div>
                
                {/* Search Bar Form */}
                <form onSubmit={handleSearch} className="flex gap-2 max-w-md w-full sm:w-80">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari NIM atau Nama..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 w-full border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                        />
                    </div>
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:shadow-md transition-all active:scale-[0.98]">
                        Cari
                    </button>
                </form>
            </div>

            {/* Table Card */}
            <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant text-label-md text-secondary">
                                <th className="px-6 py-4">Mahasiswa</th>
                                <th className="px-6 py-4">Program Studi</th>
                                <th className="px-6 py-4">Akademik</th>
                                <th className="px-6 py-4">Status Pendaftaran</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/50 text-body-md text-on-surface">
                            {students.length > 0 ? (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-surface-container-low/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold">
                                                    {student.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-bold">{student.name}</p>
                                                    <p className="text-label-sm text-secondary">NIM: {student.nim}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-medium">{student.program_studi}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col text-label-sm">
                                                <span className="text-secondary font-medium">Smstr: <strong className="text-on-surface">{student.semester}</strong></span>
                                                <span className="text-secondary font-medium">IPK: <strong className="text-on-surface">{student.ipk}</strong></span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(student.status_pendaftaran)}`}>
                                                {formatStatusLabel(student.status_pendaftaran)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Link
                                                href={`/tu/verifikasi`}
                                                className="inline-flex items-center gap-1.5 text-primary font-bold hover:underline text-sm"
                                            >
                                                Verifikasi
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-secondary">
                                        <Users className="w-12 h-12 mx-auto mb-2 text-secondary/50" />
                                        <p>Tidak ada data mahasiswa ditemukan.</p>
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

DaftarMahasiswa.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;
