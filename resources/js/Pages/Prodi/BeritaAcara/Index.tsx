import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';
import { FileText, CheckCircle, Search, ClipboardCheck, Clock, FileCheck } from 'lucide-react';

interface Mahasiswa {
  id: string;
  name: string;
  nim: string;
}

interface BeritaAcara {
  id: number;
  path_file: string;
  status: string;
  catatan?: string;
}

interface Pendaftaran {
  id: string;
  mahasiswa: Mahasiswa;
  berita_acara: BeritaAcara;
  url_file: string | null;
}

interface Props {
  pendaftarans: Pendaftaran[];
}

export default function BeritaAcaraIndex({ pendaftarans = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menyetujui Berita Acara milik ${name}?`)) {
      router.post(route('prodi.berita-acara.approve', id));
    }
  };

  const filteredPendaftarans = pendaftarans.filter(
    (p) =>
      p.mahasiswa?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mahasiswa?.nim?.includes(searchTerm)
  );

  const totalWaiting = pendaftarans.length;
  const withFile = pendaftarans.filter((p) => p.url_file).length;

  return (
    <>
      <Head title="Validasi Berita Acara" />
      <div className="animate-in fade-in duration-300 p-4 md:p-8 space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Validasi Berita Acara KP"
          description="Review dan berikan persetujuan dokumen Berita Acara yang telah diunggah oleh mahasiswa."
        />

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Menunggu Validasi</p>
              <h3 className="text-3xl font-extrabold text-amber-600 mt-1">{totalWaiting}</h3>
              <p className="text-xs text-secondary mt-1">Dokumen perlu ditinjau</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Dokumen Siap</p>
              <h3 className="text-3xl font-extrabold text-blue-600 mt-1">{withFile}</h3>
              <p className="text-xs text-secondary mt-1">File PDF tersedia</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <FileCheck size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Status Sistem</p>
              <h3 className="text-3xl font-extrabold text-green-600 mt-1">Aktif</h3>
              <p className="text-xs text-secondary mt-1">Validasi prodi berjalan</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <ClipboardCheck size={24} />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl border border-outline-variant/60 shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Cari Nama Mahasiswa atau NIM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="text-xs text-secondary font-medium">
            Menampilkan <span className="font-bold text-on-surface">{filteredPendaftarans.length}</span> antrean dokumen
          </div>
        </div>

        {/* Wide Modern Table */}
        <ModernTable>
          <ModernTableHeader>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider w-16">No</th>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider">Nama Mahasiswa & NIM</th>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider">Dokumen Berita Acara</th>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider text-right w-44">Aksi</th>
          </ModernTableHeader>
          <ModernTableBody>
            {filteredPendaftarans.map((pendaftaran, i) => (
              <tr key={pendaftaran.id} className="hover:bg-slate-50/70 transition-colors">
                <ModernTableTd className="px-6 py-4 font-semibold text-secondary">{i + 1}</ModernTableTd>
                <ModernTableTd className="px-6 py-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-primary/10 text-primary shrink-0 ring-2 ring-primary/20">
                      {pendaftaran.mahasiswa?.name?.substring(0, 2).toUpperCase() ?? 'NA'}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-base">{pendaftaran.mahasiswa?.name ?? 'Tanpa Nama'}</p>
                      <p className="text-secondary text-xs font-mono">{pendaftaran.mahasiswa?.nim ?? 'NIM Tidak Ada'}</p>
                    </div>
                  </div>
                </ModernTableTd>
                <ModernTableTd className="px-6 py-4">
                  {pendaftaran.url_file ? (
                    <a
                      href={pendaftaran.url_file}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-container bg-primary/5 hover:bg-primary/10 px-3.5 py-1.5 rounded-xl transition-all font-semibold text-xs border border-primary/20"
                    >
                      <FileText size={16} />
                      Lihat & Unduh Dokumen
                    </a>
                  ) : (
                    <span className="text-secondary/60 text-xs italic">File tidak tersedia</span>
                  )}
                </ModernTableTd>
                <ModernTableTd className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleApprove(pendaftaran.id, pendaftaran.mahasiswa?.name ?? 'Mahasiswa')}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
                  >
                    <CheckCircle size={16} />
                    Setujui Validasi
                  </button>
                </ModernTableTd>
              </tr>
            ))}
            {filteredPendaftarans.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-secondary">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ClipboardCheck size={36} className="text-outline/40" />
                    <p className="font-medium text-sm">Tidak ada dokumen Berita Acara yang menunggu validasi.</p>
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

BeritaAcaraIndex.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
