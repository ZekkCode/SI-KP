import React, { useState } from 'react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import { Head, router } from '@inertiajs/react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Download, 
  FileSpreadsheet, 
  Filter, 
  GraduationCap, 
  Building2 
} from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

interface Mahasiswa {
  name: string;
  nim: string;
}

interface Instansi {
  nama: string;
  kota?: string;
}

interface Dosen {
  name: string;
}

interface ArsipNilaiItem {
  id: number;
  pendaftaran_id: number;
  mahasiswa: Mahasiswa;
  instansi: Instansi;
  dosen_pembimbing: Dosen;
  nilai_pembimbing: string | number;
  nilai_instansi: string | number;
  nilai_ujian: string | number;
  nilai_total: string | number;
  nilai_huruf: string;
  status: 'proses' | 'lulus' | 'tidak_lulus';
  catatan?: string | null;
  created_at: string;
}

interface Props {
  arsip: ArsipNilaiItem[];
  stats: {
    total: number;
    lulus: number;
    tidak_lulus: number;
    proses: number;
    rata_rata: number;
  };
  filters: {
    status_lulus: string;
    nilai_huruf: string;
    search: string;
  };
}

export default function ArsipNilaiScreen({ arsip, stats, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status_lulus || 'all');
  const [selectedHuruf, setSelectedHuruf] = useState(filters.nilai_huruf || 'all');

  const applyFilters = (statusVal = selectedStatus, hurufVal = selectedHuruf, searchVal = searchTerm) => {
    router.get(
      route('prodi.arsip-nilai'),
      { status_lulus: statusVal, nilai_huruf: hurufVal, search: searchVal },
      { preserveState: true, replace: true }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(selectedStatus, selectedHuruf, searchTerm);
  };

  const exportToCSV = () => {
    if (arsip.length === 0) return;

    const headers = ['NIM', 'Nama Mahasiswa', 'Instansi', 'Dosen Pembimbing', 'Nilai Pembimbing', 'Nilai Industri', 'Nilai Ujian', 'Nilai Total', 'Nilai Huruf', 'Status'];
    const rows = arsip.map(a => [
      `"${a.mahasiswa.nim}"`,
      `"${a.mahasiswa.name}"`,
      `"${a.instansi.nama}"`,
      `"${a.dosen_pembimbing.name}"`,
      a.nilai_pembimbing,
      a.nilai_instansi,
      a.nilai_ujian,
      a.nilai_total,
      a.nilai_huruf,
      a.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_KP_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'lulus':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Lulus
          </span>
        );
      case 'tidak_lulus':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <XCircle className="w-3 h-3" /> Tidak Lulus
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Clock className="w-3 h-3" /> Proses
          </span>
        );
    }
  };

  const getHurufBadge = (huruf: string) => {
    if (huruf === 'A') return <span className="px-2 py-0.5 rounded font-bold text-xs bg-emerald-100 text-emerald-800">A</span>;
    if (huruf === 'B') return <span className="px-2 py-0.5 rounded font-bold text-xs bg-blue-100 text-blue-800">B</span>;
    if (huruf === 'C') return <span className="px-2 py-0.5 rounded font-bold text-xs bg-amber-100 text-amber-800">C</span>;
    if (huruf === 'D' || huruf === 'E') return <span className="px-2 py-0.5 rounded font-bold text-xs bg-rose-100 text-rose-800">{huruf}</span>;
    return <span className="text-secondary">-</span>;
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
      <Head title="Arsip & Rekap Nilai Kerja Praktik" />

      <PageHeader
        title="Arsip & Rekap Nilai Kerja Praktik"
        description="Rekapitulasi seluruh nilai akhir Kerja Praktik mahasiswa, komponen nilai pembimbing dan penguji, serta ekspor data nilai."
      />

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Total Mahasiswa Dinilai</span>
          <span className="text-3xl font-bold text-on-surface mt-2">{stats.total}</span>
        </div>

        <div className="bg-emerald-50/60 p-5 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Mahasiswa Lulus</span>
          <span className="text-3xl font-bold text-emerald-700 mt-2">{stats.lulus}</span>
        </div>

        <div className="bg-rose-50/60 p-5 rounded-xl border border-rose-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Tidak Lulus</span>
          <span className="text-3xl font-bold text-rose-700 mt-2">{stats.tidak_lulus}</span>
        </div>

        <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Rata-rata Nilai Akhir</span>
          <span className="text-3xl font-bold text-blue-700 mt-2">{stats.rata_rata}</span>
        </div>
      </div>

      {/* Filter and Export Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'lulus', label: 'Lulus' },
            { id: 'tidak_lulus', label: 'Tidak Lulus' },
            { id: 'proses', label: 'Proses' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedStatus(tab.id);
                applyFilters(tab.id, selectedHuruf, searchTerm);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Huruf Select */}
          <select
            value={selectedHuruf}
            onChange={(e) => {
              setSelectedHuruf(e.target.value);
              applyFilters(selectedStatus, e.target.value, searchTerm);
            }}
            className="text-xs bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary text-secondary"
          >
            <option value="all">Semua Nilai Huruf</option>
            <option value="A">Nilai A</option>
            <option value="B">Nilai B</option>
            <option value="C">Nilai C</option>
            <option value="D">Nilai D</option>
            <option value="E">Nilai E</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              placeholder="Cari mahasiswa / instansi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </form>

          <button
            onClick={exportToCSV}
            disabled={arsip.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {arsip.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Award className="w-12 h-12 text-outline mb-3 opacity-40" />
            <h3 className="text-base font-bold text-on-surface">Tidak ada data arsip nilai</h3>
            <p className="text-xs text-secondary mt-1 max-w-sm">
              Belum ada data nilai mahasiswa yang sesuai dengan filter saat ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <ModernTable>
              <ModernTableHeader>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-secondary text-xs font-semibold">
                  <ModernTableTh>Mahasiswa</ModernTableTh>
                  <ModernTableTh>Instansi Magang</ModernTableTh>
                  <ModernTableTh>Dosen Pembimbing</ModernTableTh>
                  <ModernTableTh className="text-center">Pembimbing (30%)</ModernTableTh>
                  <ModernTableTh className="text-center">Industri (30%)</ModernTableTh>
                  <ModernTableTh className="text-center">Ujian (40%)</ModernTableTh>
                  <ModernTableTh className="text-center">Nilai Akhir</ModernTableTh>
                  <ModernTableTh className="text-center">Huruf</ModernTableTh>
                  <ModernTableTh className="text-center">Status</ModernTableTh>
                </tr>
              </ModernTableHeader>
              <ModernTableBody>
                {arsip.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <ModernTableTd>
                      <div className="font-semibold text-sm text-on-surface">{item.mahasiswa.name}</div>
                      <div className="text-xs text-secondary font-mono">{item.mahasiswa.nim}</div>
                    </ModernTableTd>

                    <ModernTableTd>
                      <div className="flex items-center gap-1.5 text-xs text-on-surface">
                        <Building2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span>{item.instansi.nama}</span>
                      </div>
                    </ModernTableTd>

                    <ModernTableTd>
                      <div className="flex items-center gap-1.5 text-xs text-on-surface">
                        <GraduationCap className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span>{item.dosen_pembimbing.name}</span>
                      </div>
                    </ModernTableTd>

                    <ModernTableTd className="text-center font-mono text-xs">
                      {item.nilai_pembimbing}
                    </ModernTableTd>

                    <ModernTableTd className="text-center font-mono text-xs">
                      {item.nilai_instansi}
                    </ModernTableTd>

                    <ModernTableTd className="text-center font-mono text-xs">
                      {item.nilai_ujian}
                    </ModernTableTd>

                    <ModernTableTd className="text-center font-bold text-sm text-primary font-mono">
                      {item.nilai_total}
                    </ModernTableTd>

                    <ModernTableTd className="text-center">
                      {getHurufBadge(item.nilai_huruf)}
                    </ModernTableTd>

                    <ModernTableTd className="text-center">
                      {getStatusBadge(item.status)}
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

ArsipNilaiScreen.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
