import React, { useState } from 'react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import { Head, router } from '@inertiajs/react';
import { 
  Building2, 
  Users, 
  MapPin, 
  Mail, 
  Phone, 
  Search, 
  GraduationCap, 
  CheckCircle2, 
  Briefcase
} from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

interface PembimbingLapangan {
  id: number;
  nama: string;
  email?: string;
  jabatan?: string;
}

interface MitraItem {
  id: number;
  nama: string;
  alamat?: string;
  kota?: string;
  email?: string;
  telepon?: string;
  total_mahasiswa: number;
  mahasiswa_aktif: number;
  mahasiswa_selesai: number;
  pembimbing_lapangans: PembimbingLapangan[];
}

interface Props {
  mitras: MitraItem[];
  stats: {
    total_instansi: number;
    total_mahasiswa_magang: number;
    total_aktif_saat_ini: number;
  };
  filters: {
    search: string;
  };
}

export default function MitraInstansiScreen({ mitras, stats, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      route('prodi.mitra-instansi'),
      { search: searchTerm },
      { preserveState: true, replace: true }
    );
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
      <Head title="Mitra & Instansi Tempat KP" />

      <PageHeader
        title="Mitra & Instansi Tempat KP"
        description="Rekapitulasi seluruh perusahaan / instansi tempat mahasiswa melaksanakan Kerja Praktik beserta sebaran mahasiswa dan pembimbing lapangan."
      />

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Total Perusahaan / Mitra</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-on-surface">{stats.total_instansi}</span>
            <Building2 className="w-6 h-6 text-primary opacity-60" />
          </div>
        </div>

        <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Mahasiswa Aktif Magang</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-blue-700">{stats.total_aktif_saat_ini}</span>
            <GraduationCap className="w-6 h-6 text-blue-600 opacity-60" />
          </div>
        </div>

        <div className="bg-emerald-50/60 p-5 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Total Mahasiswa Diterima</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-emerald-700">{stats.total_mahasiswa_magang}</span>
            <Users className="w-6 h-6 text-emerald-600 opacity-60" />
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Cari nama perusahaan atau kota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </form>
        <span className="text-xs text-secondary">
          Menampilkan {mitras.length} mitra terdaftar
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {mitras.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Building2 className="w-12 h-12 text-outline mb-3 opacity-40" />
            <h3 className="text-base font-bold text-on-surface">Tidak ada data mitra</h3>
            <p className="text-xs text-secondary mt-1 max-w-sm">
              Belum ada instansi mitra yang sesuai dengan pencarian saat ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <ModernTable>
              <ModernTableHeader>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-secondary text-xs font-semibold">
                  <ModernTableTh>Perusahaan / Instansi</ModernTableTh>
                  <ModernTableTh>Kontak & Alamat</ModernTableTh>
                  <ModernTableTh>Pembimbing Lapangan</ModernTableTh>
                  <ModernTableTh className="text-center">Aktif Saat Ini</ModernTableTh>
                  <ModernTableTh className="text-center">Total Mahasiswa</ModernTableTh>
                </tr>
              </ModernTableHeader>
              <ModernTableBody>
                {mitras.map((mitra) => (
                  <tr key={mitra.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    {/* Instansi Info */}
                    <ModernTableTd>
                      <div className="font-semibold text-sm text-on-surface flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{mitra.nama}</span>
                      </div>
                      {mitra.kota && (
                        <div className="text-xs text-secondary ml-5 mt-0.5">{mitra.kota}</div>
                      )}
                    </ModernTableTd>

                    {/* Kontak & Alamat */}
                    <ModernTableTd>
                      <div className="space-y-1 text-xs text-secondary max-w-xs">
                        {mitra.alamat && (
                          <div className="flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 mt-0.5" />
                            <span className="line-clamp-2">{mitra.alamat}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          {mitra.email && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-600">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{mitra.email}</span>
                            </div>
                          )}
                          {mitra.telepon && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-600">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{mitra.telepon}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </ModernTableTd>

                    {/* Pembimbing Lapangan */}
                    <ModernTableTd>
                      {mitra.pembimbing_lapangans.length > 0 ? (
                        <div className="space-y-1 max-w-xs">
                          {mitra.pembimbing_lapangans.map((pl) => (
                            <div key={pl.id} className="flex items-center gap-1.5 text-xs text-slate-800">
                              <Briefcase className="w-3 h-3 text-primary flex-shrink-0" />
                              <span className="font-medium">{pl.nama}</span>
                              {pl.jabatan && <span className="text-slate-400 text-[10px]">({pl.jabatan})</span>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-secondary italic">Belum terdaftar</span>
                      )}
                    </ModernTableTd>

                    {/* Mahasiswa Aktif */}
                    <ModernTableTd className="text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        mitra.mahasiswa_aktif > 0 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {mitra.mahasiswa_aktif} Orang
                      </span>
                    </ModernTableTd>

                    {/* Total Mahasiswa */}
                    <ModernTableTd className="text-center">
                      <span className="font-bold text-sm text-slate-800">
                        {mitra.total_mahasiswa}
                      </span>
                    </ModernTableTd>
                  </tr>
                ))}
              </ModernTableBody>
            </ModernTable>
          </div>
        )}
      </div>
    </div>
  );
}

MitraInstansiScreen.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
