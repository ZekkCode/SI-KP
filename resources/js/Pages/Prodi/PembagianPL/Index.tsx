import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';
import { Users, CheckCircle, Briefcase, Save, AlertCircle, Search, UserCheck, Clock, Building2 } from 'lucide-react';

export default function PembagianPL({ mahasiswaList = [], pembimbingLapangans = [] }: any) {
    const { flash } = usePage<any>().props;
    const [search, setSearch] = useState('');
    
    // Store selected PLs locally before saving. Key is pendaftaran_id, value is pembimbing_lapangan_id
    const [selections, setSelections] = useState<Record<number, number>>({});

    const filteredMahasiswa = mahasiswaList.filter((mhs: any) =>
        mhs.mahasiswa?.name?.toLowerCase().includes(search.toLowerCase()) ||
        mhs.mahasiswa?.nim?.includes(search) ||
        mhs.instansi?.nama?.toLowerCase().includes(search.toLowerCase())
    );

    const totalMahasiswa = mahasiswaList.length;
    const terplotPL = mahasiswaList.filter((mhs: any) => mhs.pembimbing_lapangan_id).length;
    const belumPL = totalMahasiswa - terplotPL;

    const handleSelectChange = (pendaftaran_id: number, pembimbing_lapangan_id: number) => {
        setSelections(prev => ({
            ...prev,
            [pendaftaran_id]: pembimbing_lapangan_id
        }));
    };

    const handleSave = (pendaftaran_id: number) => {
        const pembimbing_lapangan_id = selections[pendaftaran_id];
        
        // If they didn't change anything, fallback to existing value if they click save
        const finalId = pembimbing_lapangan_id !== undefined 
            ? pembimbing_lapangan_id 
            : mahasiswaList.find((m:any) => m.id === pendaftaran_id)?.pembimbing_lapangan_id;

        if (!finalId) return;
        
        router.post(route('prodi.plotting-pl.store'), {
            pendaftaran_id,
            pembimbing_lapangan_id: finalId
        }, {
            preserveScroll: true
        });
    };

    return (
        <>
            <Head title="Pembagian Pembimbing Lapangan" />
            <div className="animate-in fade-in duration-300 p-4 md:p-8 space-y-6">
                {/* Page Header */}
                <PageHeader 
                    title="Pembagian Pembimbing Lapangan (PL)" 
                    description="Alokasikan Pembimbing Lapangan dari instansi/perusahaan tempat Kerja Praktik mahasiswa."
                />

                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Total Mahasiswa KP</p>
                            <h3 className="text-3xl font-extrabold text-primary mt-1">{totalMahasiswa}</h3>
                            <p className="text-xs text-secondary mt-1">Mahasiswa terdaftar KP</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Users size={24} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Sudah Terplot PL</p>
                            <h3 className="text-3xl font-extrabold text-green-600 mt-1">{terplotPL}</h3>
                            <p className="text-xs text-secondary mt-1">Telah ditentukan pembimbing</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <UserCheck size={24} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Belum Terplot PL</p>
                            <h3 className="text-3xl font-extrabold text-amber-600 mt-1">{belumPL}</h3>
                            <p className="text-xs text-secondary mt-1">Menunggu penentuan PL</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <Clock size={24} />
                        </div>
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                        <div>
                            <p className="font-bold text-sm">Berhasil!</p>
                            <p className="text-sm">{flash.success}</p>
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                        <div>
                            <p className="font-bold text-sm">Gagal!</p>
                            <p className="text-sm">{flash.error}</p>
                        </div>
                    </div>
                )}

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-xl border border-outline-variant/60 shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari Mahasiswa, NIM, atau Instansi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <div className="text-xs text-secondary font-medium">
                        Menampilkan <span className="font-bold text-on-surface">{filteredMahasiswa.length}</span> data mahasiswa
                    </div>
                </div>

                {/* Wide Modern Table */}
                <ModernTable>
                    <ModernTableHeader>
                        <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider">Mahasiswa & NIM</th>
                        <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider">Instansi Tempat KP</th>
                        <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider">Pembimbing Lapangan (PL)</th>
                        <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider text-right w-32">Aksi</th>
                    </ModernTableHeader>
                    <ModernTableBody>
                        {filteredMahasiswa.map((mhs: any) => {
                            const isAssigned = !!(selections[mhs.id] !== undefined ? selections[mhs.id] : mhs.pembimbing_lapangan_id);
                            return (
                                <tr key={mhs.id} className="hover:bg-slate-50/70 transition-colors">
                                    <ModernTableTd className="px-6 py-4">
                                        <div className="font-bold text-on-surface text-base">{mhs.mahasiswa?.name}</div>
                                        <div className="text-secondary text-xs font-mono">{mhs.mahasiswa?.nim}</div>
                                    </ModernTableTd>
                                    <ModernTableTd className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-semibold">
                                            <Building2 size={14} />
                                            {mhs.instansi?.nama ?? 'Belum ditentukan'}
                                        </span>
                                    </ModernTableTd>
                                    <ModernTableTd className="px-6 py-4">
                                        <select
                                            value={selections[mhs.id] !== undefined ? selections[mhs.id] : (mhs.pembimbing_lapangan_id || '')}
                                            onChange={(e) => handleSelectChange(mhs.id, parseInt(e.target.value))}
                                            className="w-full px-3.5 py-2 border border-outline-variant/60 rounded-xl text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        >
                                            <option value="" disabled>-- Pilih Pembimbing Lapangan --</option>
                                            {pembimbingLapangans.map((pl: any) => (
                                                <option key={pl.id} value={pl.id}>
                                                    {pl.nama} ({pl.instansi?.nama || 'Tanpa Instansi'})
                                                </option>
                                            ))}
                                        </select>
                                    </ModernTableTd>
                                    <ModernTableTd className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleSave(mhs.id)}
                                            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-on-primary px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95"
                                        >
                                            <Save size={15} />
                                            Simpan
                                        </button>
                                    </ModernTableTd>
                                </tr>
                            );
                        })}
                        {filteredMahasiswa.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-secondary">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Briefcase size={36} className="text-outline/40" />
                                        <p className="font-medium text-sm">Tidak ada data mahasiswa aktif yang ditemukan.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </ModernTableBody>
                </ModernTable>
            </div>
        </>
    );
}

PembagianPL.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
