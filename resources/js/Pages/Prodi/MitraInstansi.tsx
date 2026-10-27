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
      {mitras.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-12 text-center flex flex-col items-center">
          <Building2 className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-900">Tidak ada data mitra</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Belum ada instansi mitra yang sesuai dengan pencarian saat ini.
          </p>
        </div>
      ) : (
        <ModernTable>
          <ModernTableHeader className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <ModernTableTh className="w-12 text-center">No</ModernTableTh>
            <ModernTableTh className="min-w-[230px]">Perusahaan / Instansi</ModernTableTh>
            <ModernTableTh className="min-w-[250px]">Kontak & Alamat</ModernTableTh>
            <ModernTableTh className="min-w-[220px]">Pembimbing Lapangan</ModernTableTh>
            <ModernTableTh className="w-36 text-center">Aktif Saat Ini</ModernTableTh>
            <ModernTableTh className="w-36 text-center">Total Mahasiswa</ModernTableTh>
          </ModernTableHeader>
          <ModernTableBody>
            {mitras.map((mitra, idx) => (
              <tr key={mitra.id} className="hover:bg-slate-50/80 transition-colors">
                {/* No */}
                <ModernTableTd className="text-center font-medium text-xs text-slate-400">
                  {idx + 1}
                </ModernTableTd>

                {/* Instansi Info */}
                <ModernTableTd>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-[#00288e] flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {mitra.nama}
                      </div>
                      {mitra.kota ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{mitra.kota}</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 mt-0.5">Instansi Mitra KP</div>
                      )}
                    </div>
                  </div>
                </ModernTableTd>

                {/* Kontak & Alamat */}
                <ModernTableTd>
                  <div className="space-y-1.5 text-xs text-slate-600 max-w-xs">
                    {mitra.alamat ? (
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">{mitra.alamat}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Alamat belum dicantumkan</span>
                    )}
                    {(mitra.email || mitra.telepon) && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                        {mitra.email && (
                          <div className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[160px]">{mitra.email}</span>
                          </div>
                        )}
                        {mitra.telepon && (
                          <div className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80 whitespace-nowrap">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{mitra.telepon}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </ModernTableTd>

                {/* Pembimbing Lapangan */}
                <ModernTableTd>
                  {mitra.pembimbing_lapangans.length > 0 ? (
                    <div className="space-y-1.5">
                      {mitra.pembimbing_lapangans.map((pl) => (
                        <div key={pl.id} className="flex items-start gap-2 text-xs">
                          <Briefcase className="w-3.5 h-3.5 text-[#00288e] shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-800 leading-snug">{pl.nama}</div>
                            {pl.jabatan && (
                              <div className="text-[11px] text-slate-500">{pl.jabatan}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 italic">
                      Belum terdaftar
                    </span>
                  )}
                </ModernTableTd>

                {/* Mahasiswa Aktif */}
                <ModernTableTd className="text-center">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap border ${
                    mitra.mahasiswa_aktif > 0 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                    <span>{mitra.mahasiswa_aktif} Mahasiswa</span>
                  </span>
                </ModernTableTd>

                {/* Total Mahasiswa */}
                <ModernTableTd className="text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs whitespace-nowrap">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span>{mitra.total_mahasiswa} Total</span>
                    </span>
                    {mitra.mahasiswa_selesai > 0 && (
                      <span className="text-[10px] text-slate-500 mt-1 whitespace-nowrap">
                        {mitra.mahasiswa_selesai} Selesai
                      </span>
                    )}
                  </div>
                </ModernTableTd>
              </tr>
            ))}
          </ModernTableBody>
        </ModernTable>
      )}
    </div>
  );
}

MitraInstansiScreen.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
