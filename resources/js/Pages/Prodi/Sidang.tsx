import React, { useState } from 'react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Building2, 
  GraduationCap, 
  Edit3, 
  X,
  Send,
  Users,
  FileText,
  Download,
  ExternalLink
} from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';
import Modal from '@/Components/Modal';

interface Mahasiswa {
  id: number;
  name: string;
  nim: string;
  avatar?: string;
}

interface Instansi {
  nama: string;
  kota?: string;
}

interface Dosen {
  id?: number;
  name: string;
  nip?: string;
}

interface SidangItem {
  id: number;
  status: 'diajukan' | 'dijadwalkan' | 'selesai' | 'dibatalkan';
  tanggal_sidang: string | null;
  tanggal_formatted: string | null;
  ruangan: string | null;
  catatan: string | null;
  created_at: string;
  mahasiswa: Mahasiswa;
  instansi: Instansi;
  dosen_pembimbing: Dosen;
  dosen_penguji: Dosen;
}

interface Props {
  sidangs: SidangItem[];
  stats: {
    total: number;
    diajukan: number;
    dijadwalkan: number;
    selesai: number;
  };
  filters: {
    status: string;
    search: string;
  };
}

export default function SidangScreen({ sidangs, stats, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
  const [selectedSidang, setSelectedSidang] = useState<SidangItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, setData, post, processing, reset, errors } = useForm({
    tanggal: '',
    jam: '09:00',
    ruangan: 'Ruang Sidang Jurusan TI',
    catatan: '',
  });

  const handleFilter = (statusVal: string) => {
    setSelectedStatus(statusVal);
    router.get(
      route('prodi.sidang'),
      { status: statusVal, search: searchTerm },
      { preserveState: true, replace: true }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      route('prodi.sidang'),
      { status: selectedStatus, search: searchTerm },
      { preserveState: true, replace: true }
    );
  };

  const openJadwalModal = (sidang: SidangItem) => {
    setSelectedSidang(sidang);
    if (sidang.tanggal_sidang) {
      const [tgl, jm] = sidang.tanggal_sidang.split(' ');
      setData({
        tanggal: tgl || '',
        jam: jm || '09:00',
        ruangan: sidang.ruangan || 'Ruang Sidang Jurusan TI',
        catatan: sidang.catatan || '',
      });
    } else {
      setData({
        tanggal: new Date().toISOString().split('T')[0],
        jam: '09:00',
        ruangan: 'Ruang Sidang Jurusan TI',
        catatan: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSidang(null);
    reset();
  };

  const submitJadwal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSidang) return;

    post(route('prodi.sidang.jadwalkan', selectedSidang.id), {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'dijadwalkan':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 whitespace-nowrap">
            <Calendar className="w-3 h-3 shrink-0" /> Dijadwalkan
          </span>
        );
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 shrink-0" /> Selesai
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 whitespace-nowrap">
            <Clock className="w-3 h-3 shrink-0" /> Menunggu Jadwal
          </span>
        );
    }
  };

  const handleMarkSelesai = (sidang: SidangItem) => {
    if (confirm(`Tandai sidang KP mahasiswa ${sidang.mahasiswa.name} (${sidang.mahasiswa.nim}) sebagai Selesai?`)) {
      router.post(route('prodi.sidang.selesai', sidang.id), {}, { preserveScroll: true });
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
      <Head title="Penjadwalan Sidang Kerja Praktik" />

      <PageHeader
        title="Penjadwalan Sidang Kerja Praktik"
        description="Kelola pengajuan sidang mahasiswa, tetapkan jadwal dan ruangan, serta tugaskan Dosen Pembimbing sebagai Penguji."
      />

      {/* Kartu Berkas Resmi Sidang & Ujian KP */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-[#00288e] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Format Resmi Berita Acara & Instrumen Ujian Sidang KP</h3>
              <p className="text-[11px] text-slate-500">
                Formulir resmi dewan penguji dan koordinator untuk pelaksanaan seminar hasil dan verifikasi kelulusan.
              </p>
            </div>
          </div>
          <Link
            href="/panduan"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#00288e] hover:underline shrink-0"
          >
            <span>Katalog 21 Lampiran</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
          <a
            href="/dokumen/lampiran/Lampiran_10_Berita_Acara_Ujian_KP_Form_KP-5.pdf"
            download
            className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 transition group cursor-pointer"
          >
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Form KP-5</span>
              <p className="text-xs font-semibold text-slate-900 mt-1 truncate">Berita Acara Ujian KP</p>
              <p className="text-[10px] text-slate-500 truncate">Dokumen berita acara dan penetapan nilai ujian</p>
            </div>
            <Download className="w-4 h-4 text-[#00288e] shrink-0 group-hover:translate-y-0.5 transition-transform" />
          </a>

          <a
            href="/dokumen/lampiran/Lampiran_06_Lembar_Persetujuan_Seminar_KP_Form_KP-8.pdf"
            download
            className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition group cursor-pointer"
          >
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">Form KP-8</span>
              <p className="text-xs font-semibold text-slate-900 mt-1 truncate">Persetujuan Seminar KP</p>
              <p className="text-[10px] text-slate-500 truncate">Syarat kelayakan maju ujian dari pembimbing</p>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-primary shrink-0 group-hover:translate-y-0.5 transition-transform" />
          </a>

          <a
            href="/dokumen/lampiran/Lampiran_21_SOP_Standar_Operasional_Prosedur_KP.pdf"
            download
            className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition group cursor-pointer"
          >
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">Lampiran 21</span>
              <p className="text-xs font-semibold text-slate-900 mt-1 truncate">SOP Kerja Praktik UTM</p>
              <p className="text-[10px] text-slate-500 truncate">Standar operasional prosedur alur seminar</p>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-primary shrink-0 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Total Pengajuan</span>
          <span className="text-3xl font-bold text-on-surface mt-2">{stats.total}</span>
        </div>

        <div className="bg-amber-50/60 p-5 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Perlu Dijadwalkan</span>
          <span className="text-3xl font-bold text-amber-700 mt-2">{stats.diajukan}</span>
        </div>

        <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Telah Dijadwalkan</span>
          <span className="text-3xl font-bold text-blue-700 mt-2">{stats.dijadwalkan}</span>
        </div>

        <div className="bg-emerald-50/60 p-5 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Sidang Selesai</span>
          <span className="text-3xl font-bold text-emerald-700 mt-2">{stats.selesai}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'diajukan', label: `Menunggu (${stats.diajukan})` },
            { id: 'dijadwalkan', label: `Dijadwalkan (${stats.dijadwalkan})` },
            { id: 'selesai', label: `Selesai (${stats.selesai})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Cari mahasiswa, NIM, atau instansi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </form>
      </div>

      {/* Sidang Table */}
      {sidangs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-12 text-center flex flex-col items-center">
          <Calendar className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-900">Tidak ada data sidang</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Belum ada pengajuan sidang yang cocok dengan kriteria filter yang dipilih.
          </p>
        </div>
      ) : (
        <ModernTable>
          <ModernTableHeader className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <ModernTableTh className="w-12 text-center">No</ModernTableTh>
            <ModernTableTh className="min-w-[220px]">Mahasiswa</ModernTableTh>
            <ModernTableTh className="min-w-[190px]">Instansi Magang</ModernTableTh>
            <ModernTableTh className="min-w-[200px]">Dosen Pembimbing & Penguji</ModernTableTh>
            <ModernTableTh className="min-w-[190px]">Jadwal & Ruangan</ModernTableTh>
            <ModernTableTh className="w-36 text-center">Status</ModernTableTh>
            <ModernTableTh className="w-44 text-center">Aksi</ModernTableTh>
          </ModernTableHeader>
          <ModernTableBody>
            {sidangs.map((item, idx) => {
              const hasSchedule = Boolean(item.tanggal_sidang && item.tanggal_formatted && item.tanggal_formatted.trim() !== 'WIB');
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
                        {item.created_at && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Diajukan: {item.created_at}
                          </div>
                        )}
                      </div>
                    </div>
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

                  {/* Dosen Penguji / Pembimbing */}
                  <ModernTableTd>
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-4 h-4 text-[#00288e] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 leading-snug">
                          {item.dosen_penguji.name}
                        </div>
                        {item.dosen_penguji.nip && (
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            NIP: {item.dosen_penguji.nip}
                          </div>
                        )}
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                          Pembimbing & Penguji
                        </span>
                      </div>
                    </div>
                  </ModernTableTd>

                  {/* Jadwal & Ruangan */}
                  <ModernTableTd>
                    {hasSchedule ? (
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 whitespace-nowrap">
                          <Calendar className="w-3.5 h-3.5 text-[#00288e] shrink-0" />
                          <span>{item.tanggal_formatted}</span>
                        </div>
                        {item.ruangan && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 pl-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-medium">{item.ruangan}</span>
                          </div>
                        )}
                        {item.catatan && (
                          <div className="text-[11px] text-slate-500 italic pl-0.5 line-clamp-1" title={item.catatan}>
                            Catatan: {item.catatan}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50/70 border border-amber-200/80 px-2.5 py-1 rounded-md italic font-medium whitespace-nowrap">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>Belum dijadwalkan</span>
                      </span>
                    )}
                  </ModernTableTd>

                  {/* Status */}
                  <ModernTableTd className="text-center">
                    {getStatusBadge(item.status)}
                  </ModernTableTd>

                  {/* Aksi */}
                  <ModernTableTd className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openJadwalModal(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00288e] text-white rounded-lg text-xs font-bold hover:bg-[#002277] transition-all shadow-xs whitespace-nowrap cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.status === 'diajukan' ? 'Jadwalkan' : 'Ubah Jadwal'}</span>
                      </button>
                      {item.status === 'dijadwalkan' && (
                        <button
                          type="button"
                          onClick={() => handleMarkSelesai(item)}
                          title="Tandai Sidang Selesai"
                          className="inline-flex items-center justify-center p-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </ModernTableTd>
                </tr>
              );
            })}
          </ModernTableBody>
        </ModernTable>
      )}

      {/* Modal Penetapan Jadwal Sidang */}
      <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
        {selectedSidang && (
          <div className="p-6">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Penetapan Jadwal Sidang KP</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mahasiswa: <strong>{selectedSidang.mahasiswa.name}</strong> ({selectedSidang.mahasiswa.nim})
                </p>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitJadwal} className="space-y-4">
              {/* Info Penguji Otomatis */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
                <strong>Ketentuan Penguji:</strong> Dosen Penguji otomatis ditetapkan kepada Dosen Pembimbing mahasiswa (<strong>{selectedSidang.dosen_pembimbing.name}</strong>).
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Sidang <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={data.tanggal}
                    onChange={(e) => setData('tanggal', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  {errors.tanggal && <p className="text-xs text-rose-600 mt-0.5">{errors.tanggal}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Waktu / Jam (WIB) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={data.jam}
                    onChange={(e) => setData('jam', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  {errors.jam && <p className="text-xs text-rose-600 mt-0.5">{errors.jam}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ruangan / Tempat Sidang <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ruang Sidang TI / Lab RPL / Online Zoom"
                  value={data.ruangan}
                  onChange={(e) => setData('ruangan', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {errors.ruangan && <p className="text-xs text-rose-600 mt-0.5">{errors.ruangan}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan untuk Mahasiswa & Dosen (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Membawa berkas laporan rangkap 2 dan slide presentasi..."
                  value={data.catatan}
                  onChange={(e) => setData('catatan', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#00288e] hover:bg-[#002277] text-white rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simpan & Kirim Jadwal</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}

SidangScreen.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
