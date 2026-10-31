import React, { useState } from 'react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import { Head, router } from '@inertiajs/react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  FileSpreadsheet, 
  GraduationCap, 
  Building2,
  Calendar,
  Printer,
  FileText
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
  semester: string;
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

interface RekapSemesterItem {
  semester: string;
  total: number;
  lulus: number;
  tidak_lulus: number;
  proses: number;
  rata_rata: number;
}

interface Props {
  arsip: ArsipNilaiItem[];
  stats: {
    total: number;
    lulus: number;
    tidak_lulus: number;
    proses: number;
    rata_rata: number;
    distribusi_huruf?: Record<string, number>;
  };
  semester_options?: string[];
  rekap_semester?: RekapSemesterItem[];
  filters: {
    semester?: string;
    status_lulus: string;
    nilai_huruf: string;
    search: string;
  };
}

export default function ArsipNilaiScreen({ arsip, stats, semester_options = [], rekap_semester = [], filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedSemester, setSelectedSemester] = useState(filters.semester || 'all');
  const [selectedStatus, setSelectedStatus] = useState(filters.status_lulus || 'all');
  const [selectedHuruf, setSelectedHuruf] = useState(filters.nilai_huruf || 'all');

  const applyFilters = (
    semesterVal = selectedSemester,
    statusVal = selectedStatus,
    hurufVal = selectedHuruf,
    searchVal = searchTerm
  ) => {
    router.get(
      route('prodi.arsip-nilai'),
      {
        semester: semesterVal,
        status_lulus: statusVal,
        nilai_huruf: hurufVal,
        search: searchVal,
      },
      { preserveState: true, replace: true }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(selectedSemester, selectedStatus, selectedHuruf, searchTerm);
  };

  const exportToCSV = () => {
    if (arsip.length === 0) return;

    const headers = [
      'No',
      'Semester',
      'NIM',
      'Nama Mahasiswa',
      'Instansi',
      'Dosen Pembimbing',
      'Nilai Pembimbing',
      'Nilai Industri',
      'Nilai Ujian',
      'Nilai Total',
      'Nilai Huruf',
      'Status'
    ];
    const rows = arsip.map((a, index) => [
      index + 1,
      `"${a.semester}"`,
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

    const semesterSlug = selectedSemester !== 'all'
      ? selectedSemester.replace(/[^a-zA-Z0-9]/g, '_')
      : 'Semua_Semester';

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Rekap_KP_${semesterSlug}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCetakLaporan = (customSemester?: string) => {
    const sem = customSemester ?? selectedSemester;
    const params = new URLSearchParams({
      semester: sem,
      status_lulus: selectedStatus,
      nilai_huruf: selectedHuruf,
      search: searchTerm,
    });
    window.open(`/prodi/arsip-nilai/cetak?${params.toString()}`, '_blank', 'noopener,noreferrer');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'lulus':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 shrink-0" /> Lulus
          </span>
        );
      case 'tidak_lulus':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 whitespace-nowrap">
            <XCircle className="w-3 h-3 shrink-0" /> Tidak Lulus
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 whitespace-nowrap">
            <Clock className="w-3 h-3 shrink-0" /> Proses
          </span>
        );
    }
  };

  const getHurufBadge = (huruf: string) => {
    if (huruf === 'A') return <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">A</span>;
    if (huruf === 'B+' || huruf === 'B') return <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs bg-blue-50 text-blue-800 border border-blue-200">{huruf}</span>;
    if (huruf === 'C+' || huruf === 'C') return <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs bg-amber-50 text-amber-800 border border-amber-200">{huruf}</span>;
    if (huruf === 'D+' || huruf === 'D' || huruf === 'E') return <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs bg-rose-50 text-rose-800 border border-rose-200">{huruf}</span>;
    return <span className="text-slate-400 font-medium">-</span>;
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
      <Head title="Arsip & Laporan Rekap Nilai Kerja Praktik" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Arsip & Laporan Rekapitulasi Nilai KP"
          description="Rekapitulasi nilai akhir Kerja Praktik berdasarkan Semester (Ganjil/Genap per Tahun Akademik), pembuatan laporan rekap berkala, dan pengarsipan."
        />

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => handleCetakLaporan()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00288e] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>
              {selectedSemester !== 'all' ? `Cetak Rekap (${selectedSemester})` : 'Cetak Laporan Rekap'}
            </span>
          </button>

          <button
            type="button"
            onClick={exportToCSV}
            disabled={arsip.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Total Mahasiswa Dinilai</span>
            {selectedSemester !== 'all' && (
              <span className="text-[10px] font-bold text-[#00288e] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {selectedSemester}
              </span>
            )}
          </div>
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

      {/* Ringkasan Rekapitulasi per Semester (Quick Cards) */}
      {rekap_semester.length > 0 && (
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00288e]" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                Rekapitulasi Berkala per Semester (Ganjil / Genap)
              </h2>
            </div>
            <span className="text-[11px] text-slate-500">
              Klik kartu semester untuk memfilter tabel atau langsung mencetak laporan semester terkait.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rekap_semester.map((rk) => {
              const isSelected = selectedSemester === rk.semester;
              const isGanjil = rk.semester.toLowerCase().includes('ganjil');
              return (
                <div
                  key={rk.semester}
                  onClick={() => {
                    const nextSem = isSelected ? 'all' : rk.semester;
                    setSelectedSemester(nextSem);
                    applyFilters(nextSem, selectedStatus, selectedHuruf, searchTerm);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-400 ring-1 ring-blue-400/50'
                      : 'bg-slate-50/60 border-slate-200 hover:border-blue-300 hover:bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                          isGanjil
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                            : 'bg-teal-50 text-teal-800 border-teal-200'
                        }`}
                      >
                        {isGanjil ? 'Ganjil' : 'Genap'}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {rk.semester}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1.5 flex items-center gap-2.5 flex-wrap">
                      <span>Total: <strong>{rk.total}</strong></span>
                      <span className="text-emerald-700">Lulus: <strong>{rk.lulus}</strong></span>
                      <span className="text-blue-800">Rata-rata: <strong>{rk.rata_rata}</strong></span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCetakLaporan(rk.semester);
                    }}
                    title={`Cetak Laporan Semester ${rk.semester}`}
                    className="p-2 rounded-lg bg-white hover:bg-blue-50 text-slate-600 hover:text-[#00288e] border border-slate-200 transition shrink-0"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Semester (Ganjil/Genap per Tahun Akademik) */}
          <div className="relative flex items-center">
            <Calendar className="w-3.5 h-3.5 text-[#00288e] absolute left-3 pointer-events-none" />
            <select
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                applyFilters(e.target.value, selectedStatus, selectedHuruf, searchTerm);
              }}
              className="text-xs font-semibold bg-blue-50/70 border border-blue-200 rounded-lg pl-8 pr-7 py-1.5 focus:outline-none focus:border-primary text-[#00288e]"
            >
              <option value="all">Semua Semester (Ganjil &amp; Genap)</option>
              {semester_options.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block mx-0.5" />

          {/* Status Tabs */}
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'lulus', label: 'Lulus' },
            { id: 'tidak_lulus', label: 'Tidak Lulus' },
            { id: 'proses', label: 'Proses' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedStatus(tab.id);
                applyFilters(selectedSemester, tab.id, selectedHuruf, searchTerm);
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
              applyFilters(selectedSemester, selectedStatus, e.target.value, searchTerm);
            }}
            className="text-xs bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary text-secondary"
          >
            <option value="all">Semua Nilai Huruf</option>
            <option value="A">Nilai A</option>
            <option value="B+">Nilai B+</option>
            <option value="B">Nilai B</option>
            <option value="C+">Nilai C+</option>
            <option value="C">Nilai C</option>
            <option value="D+">Nilai D+</option>
            <option value="D">Nilai D</option>
            <option value="E">Nilai E</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative min-w-[240px] w-full lg:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              placeholder="Cari mahasiswa / NIM / instansi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </form>
        </div>
      </div>

      {/* Table */}
      {arsip.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-12 text-center flex flex-col items-center">
          <Award className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-900">Tidak ada data arsip nilai</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Belum ada data nilai mahasiswa yang sesuai dengan filter semester atau kriteria pencarian saat ini.
          </p>
        </div>
      ) : (
        <ModernTable>
          <ModernTableHeader className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <ModernTableTh className="w-12 text-center">No</ModernTableTh>
            <ModernTableTh className="min-w-[210px]">Mahasiswa</ModernTableTh>
            <ModernTableTh className="w-36 text-center whitespace-nowrap">Semester</ModernTableTh>
            <ModernTableTh className="min-w-[190px]">Instansi Magang</ModernTableTh>
            <ModernTableTh className="min-w-[180px]">Dosen Pembimbing</ModernTableTh>
            <ModernTableTh className="w-28 text-center whitespace-nowrap">Pembimbing (30%)</ModernTableTh>
            <ModernTableTh className="w-28 text-center whitespace-nowrap">Industri (30%)</ModernTableTh>
            <ModernTableTh className="w-28 text-center whitespace-nowrap">Ujian (40%)</ModernTableTh>
            <ModernTableTh className="w-28 text-center whitespace-nowrap">Nilai Akhir</ModernTableTh>
            <ModernTableTh className="w-20 text-center">Huruf</ModernTableTh>
            <ModernTableTh className="w-32 text-center">Status</ModernTableTh>
          </ModernTableHeader>
          <ModernTableBody>
            {arsip.map((item, idx) => {
              const isGanjil = item.semester?.toLowerCase().includes('ganjil');
              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* No */}
                  <ModernTableTd className="text-center font-medium text-xs text-slate-400">
                    {idx + 1}
                  </ModernTableTd>

                  {/* Mahasiswa */}
                  <ModernTableTd>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 text-[#00288e] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {item.mahasiswa.name?.substring(0, 2).toUpperCase() || 'MH'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug truncate">
                          {item.mahasiswa.name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          NIM: {item.mahasiswa.nim}
                        </div>
                      </div>
                    </div>
                  </ModernTableTd>

                  {/* Semester */}
                  <ModernTableTd className="text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${
                        isGanjil
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                          : 'bg-teal-50 text-teal-800 border-teal-200'
                      }`}
                    >
                      {item.semester}
                    </span>
                  </ModernTableTd>

                  {/* Instansi */}
                  <ModernTableTd>
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-[#00288e] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 leading-snug">
                          {item.instansi.nama}
                        </div>
                        {item.instansi.kota && (
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {item.instansi.kota}
                          </div>
                        )}
                      </div>
                    </div>
                  </ModernTableTd>

                  {/* Dosen Pembimbing */}
                  <ModernTableTd>
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-4 h-4 text-[#00288e] shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-800 leading-snug">
                        {item.dosen_pembimbing.name}
                      </span>
                    </div>
                  </ModernTableTd>

                  {/* Nilai Pembimbing */}
                  <ModernTableTd className="text-center font-mono text-xs font-semibold text-slate-700">
                    {item.nilai_pembimbing}
                  </ModernTableTd>

                  {/* Nilai Industri */}
                  <ModernTableTd className="text-center font-mono text-xs font-semibold text-slate-700">
                    {item.nilai_instansi}
                  </ModernTableTd>

                  {/* Nilai Ujian */}
                  <ModernTableTd className="text-center font-mono text-xs font-semibold text-slate-700">
                    {item.nilai_ujian}
                  </ModernTableTd>

                  {/* Nilai Akhir */}
                  <ModernTableTd className="text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 font-bold text-xs text-[#00288e] font-mono">
                      {item.nilai_total}
                    </span>
                  </ModernTableTd>

                  {/* Huruf */}
                  <ModernTableTd className="text-center">
                    {getHurufBadge(item.nilai_huruf)}
                  </ModernTableTd>

                  {/* Status */}
                  <ModernTableTd className="text-center">
                    {getStatusBadge(item.status)}
                  </ModernTableTd>
                </tr>
              );
            })}
          </ModernTableBody>
        </ModernTable>
      )}
    </div>
  );
}

ArsipNilaiScreen.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
