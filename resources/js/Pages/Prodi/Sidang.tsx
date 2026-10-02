import React, { useState } from 'react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import { Head, useForm, router } from '@inertiajs/react';
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
  Users
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
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            <Calendar className="w-3 h-3" /> Dijadwalkan
          </span>
        );
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Selesai
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <Clock className="w-3 h-3" /> Menunggu Jadwal
          </span>
        );
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
      <Head title="Penjadwalan Sidang Kerja Praktik" />

      <PageHeader
        title="Penjadwalan Sidang Kerja Praktik"
        description="Kelola pengajuan sidang mahasiswa, tetapkan jadwal dan ruangan, serta tugaskan Dosen Pembimbing sebagai Penguji."
      />

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
      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {sidangs.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Calendar className="w-12 h-12 text-outline mb-3 opacity-40" />
            <h3 className="text-base font-bold text-on-surface">Tidak ada data sidang</h3>
            <p className="text-xs text-secondary mt-1 max-w-sm">
              Belum ada pengajuan sidang yang cocok dengan kriteria filter yang dipilih.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <ModernTable>
              <ModernTableHeader>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-secondary text-xs font-semibold">
                  <ModernTableTh>Mahasiswa</ModernTableTh>
                  <ModernTableTh>Instansi Magang</ModernTableTh>
                  <ModernTableTh>Dosen Pembimbing & Penguji</ModernTableTh>
                  <ModernTableTh>Jadwal & Ruangan</ModernTableTh>
                  <ModernTableTh>Status</ModernTableTh>
                  <ModernTableTh className="text-center">Aksi</ModernTableTh>
                </tr>
              </ModernTableHeader>
              <ModernTableBody>
                {sidangs.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    {/* Mahasiswa */}
                    <ModernTableTd>
                      <div className="font-semibold text-sm text-on-surface">{item.mahasiswa.name}</div>
                      <div className="text-xs text-secondary font-mono">{item.mahasiswa.nim}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Diajukan: {item.created_at}</div>
                    </ModernTableTd>

                    {/* Instansi */}
                    <ModernTableTd>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface">
                        <Building2 className="w-3.5 h-3.5 text-primary" />
                        <span>{item.instansi.nama}</span>
                      </div>
                      {item.instansi.kota && (
                        <div className="text-[11px] text-secondary ml-5">{item.instansi.kota}</div>
                      )}
                    </ModernTableTd>

                    {/* Dosen Penguji / Pembimbing */}
                    <ModernTableTd>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface">
                          <GraduationCap className="w-3.5 h-3.5 text-primary" />
                          <span>{item.dosen_penguji.name}</span>
                        </div>
                        <div className="text-[11px] text-secondary">
                          (Dosen Pembimbing sekaligus Penguji)
                        </div>
                      </div>
                    </ModernTableTd>

                    {/* Jadwal & Ruangan */}
                    <ModernTableTd>
                      {item.tanggal_formatted ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>{item.tanggal_formatted}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-secondary">
                            <MapPin className="w-3 h-3 text-secondary" />
                            <span>{item.ruangan}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-700 italic font-medium">Belum dijadwalkan</span>
                      )}
                    </ModernTableTd>

                    {/* Status */}
                    <ModernTableTd>
                      {getStatusBadge(item.status)}
                    </ModernTableTd>

                    {/* Aksi */}
                    <ModernTableTd className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openJadwalModal(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{item.status === 'diajukan' ? 'Jadwalkan' : 'Ubah Jadwal'}</span>
                        </button>
                      </div>
                    </ModernTableTd>
                  </tr>
                ))}
              </ModernTableBody>
            </ModernTable>
          </div>
        )}
      </div>

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
