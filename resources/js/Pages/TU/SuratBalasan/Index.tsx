import TULayout from '@/Layouts/TULayout';
import { Link } from '@inertiajs/react';
import { FileText, Eye, Search } from 'lucide-react';
import { useState } from 'react';

interface Pendaftaran {
    id: number;
    status: string;
    mahasiswa: {
        name: string;
        nim?: string;
    } | null;
    instansi: {
        nama: string;
    } | null;
    surat_pengantar: {
        nomor_surat?: string;
    } | null;
}

interface Props {
    pendaftarans: Pendaftaran[];
}

const statusLabel: Record<string, { text: string; className: string }> = {
    surat_terbit: {
        text: 'Surat Terbit',
        className: 'bg-blue-100 text-blue-700',
    },
    diterima_instansi: {
        text: 'Diterima Instansi',
        className: 'bg-green-100 text-green-700',
    },
    ditolak_instansi: {
        text: 'Ditolak Instansi',
        className: 'bg-red-100 text-red-700',
    },
};

export default function Index({ pendaftarans }: Props) {
    const [search, setSearch] = useState('');

    const filtered = pendaftarans.filter((p) => {
        const q = search.toLowerCase();
        return (
            p.mahasiswa?.name?.toLowerCase().includes(q) ||
            p.instansi?.nama?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="animate-in fade-in duration-300">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-semibold text-on-surface mb-2">
                        Surat Balasan Instansi
                    </h1>
                    <p className="text-on-surface-variant">
                        Kelola surat balasan dari instansi untuk pendaftaran Kerja Praktik mahasiswa.
                    </p>
                </div>

                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-secondary-container text-on-secondary-container">
                    <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                    {pendaftarans.length} Pendaftaran
                </span>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                    type="text"
                    placeholder="Cari mahasiswa atau instansi..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <FileText className="mx-auto w-12 h-12 text-on-surface-variant/40 mb-4" />
                    <h3 className="text-lg font-medium text-on-surface mb-1">
                        Tidak ada data
                    </h3>
                    <p className="text-on-surface-variant">
                        {search
                            ? 'Tidak ditemukan hasil untuk pencarian tersebut.'
                            : 'Belum ada pendaftaran yang menunggu surat balasan.'}
                    </p>
                </div>
            ) : (
                <div className="bg-surface-container-low rounded-2xl border border-outline-variant overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface-container">
                                <th className="px-6 py-3.5 text-sm font-semibold text-on-surface-variant">
                                    Mahasiswa
                                </th>
                                <th className="px-6 py-3.5 text-sm font-semibold text-on-surface-variant">
                                    Instansi
                                </th>
                                <th className="px-6 py-3.5 text-sm font-semibold text-on-surface-variant">
                                    Status
                                </th>
                                <th className="px-6 py-3.5 text-sm font-semibold text-on-surface-variant text-center">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {filtered.map((p) => {
                                const badge = statusLabel[p.status] ?? {
                                    text: p.status.replaceAll('_', ' '),
                                    className: 'bg-gray-100 text-gray-700',
                                };
                                return (
                                    <tr
                                        key={p.id}
                                        className="hover:bg-surface-container-highest/40 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-on-surface">
                                                {p.mahasiswa?.name ?? '-'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-on-surface-variant">
                                            {p.instansi?.nama ?? '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}
                                            >
                                                {badge.text}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                href={`/tu/surat-balasan/${p.id}`}
                                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;
