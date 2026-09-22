import ProdiLayout from '@/Layouts/ProdiLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';
import { AlertCircle, Check } from 'lucide-react';

interface Mahasiswa {
  id: number;
  name: string;
  nim: string;
}

interface Dosen {
  id: number;
  name: string;
  kuota_max: number;
  bimbingan_aktif: number;
}

interface Pendaftaran {
  id: number;
  mahasiswa: Mahasiswa;
  dosen_pembimbing?: Dosen;
}

interface Props {
  mahasiswaQueue: Pendaftaran[];
  dosenList: Dosen[];
  plottedHistory: Pendaftaran[];
}

export default function SupervisorPlotting({ mahasiswaQueue = [], dosenList = [], plottedHistory = [] }: Props) {
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleSelectChange = (pendaftaran_id: number, dosen_id: number) => {
    setSelections(prev => ({
      ...prev,
      [pendaftaran_id]: dosen_id
    }));
  };

  const handleSave = (pendaftaran_id: number) => {
    const dosen_pembimbing_id = selections[pendaftaran_id];
    if (!dosen_pembimbing_id) return;
    
    setProcessingId(pendaftaran_id);
    router.post(route('prodi.plotting.store'), {
      pendaftaran_id,
      dosen_pembimbing_id
    }, {
      preserveScroll: true,
      onFinish: () => setProcessingId(null)
    });
  };

  return (
    <div className="flex flex-col max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 p-6">
      <PageHeader title="Plotting Dosen Pembimbing" description="Alokasikan dosen pembimbing untuk mahasiswa Kerja Praktik." />

      {/* Plotting Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Daftar Antrean Mahasiswa</h2>
        
        <div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>Ketentuan: Alokasi atau penyesuaian Dosen Pembimbing hanya dapat dilakukan maksimal 2 hari kalender setelah tanggal pengajuan surat.</span>
        </div>
        
        <ModernTable className="border-gray-200 shadow-none">
          <ModernTableHeader>
            <ModernTableTh>NIM</ModernTableTh>
            <ModernTableTh>Nama Mahasiswa</ModernTableTh>
            <ModernTableTh>Dosen Pembimbing</ModernTableTh>
            <ModernTableTh>Aksi</ModernTableTh>
          </ModernTableHeader>
          <ModernTableBody>
            {mahasiswaQueue.length > 0 ? (
              mahasiswaQueue.map((mhs) => (
                <tr key={mhs.id} className="hover:bg-slate-50 transition-colors">
                  <ModernTableTd className="font-mono text-xs">{mhs.mahasiswa.nim}</ModernTableTd>
                  <ModernTableTd className="font-semibold text-sm">{mhs.mahasiswa.name}</ModernTableTd>
                  <ModernTableTd>
                    <select
                      value={selections[mhs.id] || ''}
                      onChange={(e) => handleSelectChange(mhs.id, parseInt(e.target.value))}
                      className="w-full border border-gray-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700 text-sm"
                    >
                      <option value="" disabled>-- Pilih Dosen Pembimbing --</option>
                      {dosenList.map((d) => {
                        const sisa = d.kuota_max - d.bimbingan_aktif;
                        const disabled = sisa <= 0;
                        return (
                          <option key={d.id} value={d.id} disabled={disabled}>
                            {d.name} (Sisa Kuota: {sisa < 0 ? 0 : sisa})
                          </option>
                        );
                      })}
                    </select>
                  </ModernTableTd>
                  <ModernTableTd>
                    <button
                      onClick={() => handleSave(mhs.id)}
                      disabled={!selections[mhs.id] || processingId === mhs.id}
                      className="text-white font-semibold text-xs px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Check size={14} />
                      {processingId === mhs.id ? 'Menyimpan...' : 'Simpan Plotting'}
                    </button>
                  </ModernTableTd>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 px-6 text-center text-gray-500 italic text-sm">
                  Tidak ada antrean mahasiswa yang membutuhkan dosen pembimbing.
                </td>
              </tr>
            )}
          </ModernTableBody>
        </ModernTable>
      </div>

      {/* History Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Riwayat Plotting Dosen Pembimbing</h2>
        
        <ModernTable className="border-gray-200 shadow-none">
          <ModernTableHeader>
            <ModernTableTh>NIM</ModernTableTh>
            <ModernTableTh>Nama Mahasiswa</ModernTableTh>
            <ModernTableTh>Dosen Pembimbing</ModernTableTh>
            <ModernTableTh>Action</ModernTableTh>
          </ModernTableHeader>
          <ModernTableBody>
            {plottedHistory && plottedHistory.length > 0 ? (
              plottedHistory.map((h, i) => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <ModernTableTd>{h.mahasiswa?.nim}</ModernTableTd>
                  <ModernTableTd>{h.mahasiswa?.name}</ModernTableTd>
                  <ModernTableTd>{h.dosen_pembimbing?.name || '-'}</ModernTableTd>
                  <ModernTableTd>
                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      Edit
                    </button>
                  </ModernTableTd>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 px-6 text-center text-gray-500 italic text-sm">
                  Belum ada riwayat plotting.
                </td>
              </tr>
            )}
          </ModernTableBody>
        </ModernTable>
      </div>
    </div>
  );
}

SupervisorPlotting.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
