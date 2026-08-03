import { useState } from 'react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import { 
  Search, 
  FileText, 
  Eye, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Check, 
  MessageSquare,
  Clock
} from 'lucide-react';

interface BeritaAcara {
  id: number;
  nim: string;
  studentName: string;
  fileName: string;
  notes: string;
  status: 'menunggu' | 'disetujui' | 'revisi';
  revisionNotes?: string;
  submittedAt: string;
}

const INITIAL_DATA: BeritaAcara[] = [
  { 
    id: 1, 
    nim: '20041110001', 
    studentName: 'Budi Santoso', 
    fileName: 'berita_acara_budi_santoso.pdf', 
    notes: 'Penyerahan lembar persetujuan ujian hasil kerja praktek.', 
    status: 'disetujui', 
    submittedAt: '2026-07-28 10:15'
  },
  { 
    id: 2, 
    nim: '20041110002', 
    studentName: 'Siti Aminah', 
    fileName: 'berita_acara_siti_aminah.pdf', 
    notes: 'Berita acara bimbingan rutin mingguan ke-8 dengan Dosen Pembimbing.', 
    status: 'menunggu', 
    submittedAt: '2026-07-30 14:22'
  },
  { 
    id: 3, 
    nim: '20041110003', 
    studentName: 'Ahmad Dahlan', 
    fileName: 'berita_acara_ahmad_dahlan.pdf', 
    notes: 'Pengajuan berita acara pelaksanaan seminar hasil kerja praktek.', 
    status: 'revisi', 
    revisionNotes: 'Format tanda tangan perwakilan instansi belum lengkap.',
    submittedAt: '2026-07-25 09:00'
  },
  { 
    id: 4, 
    nim: '20041110004', 
    studentName: 'Diana Fitri', 
    fileName: 'berita_acara_diana_fitri.pdf', 
    notes: 'Persetujuan laporan akhir dan rekomendasi nilai dari instansi.', 
    status: 'disetujui', 
    submittedAt: '2026-07-29 11:45'
  },
  { 
    id: 5, 
    nim: '20041110005', 
    studentName: 'Eko Prabowo', 
    fileName: 'berita_acara_eko_prabowo.pdf', 
    notes: 'Lembar berita acara penyelesaian revisi pasca seminar.', 
    status: 'menunggu', 
    submittedAt: '2026-08-01 08:30'
  }
];

export default function Reports() {
  const [dataList, setDataList] = useState<BeritaAcara[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('semua');
  const [selectedItem, setSelectedItem] = useState<BeritaAcara | null>(null);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionInput, setRevisionInput] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Filters
  const filteredData = dataList.filter(item => {
    const matchesStatus = selectedStatus === 'semua' ? true : item.status === selectedStatus;
    const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.nim.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleApprove = (id: number) => {
    setDataList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: 'disetujui', revisionNotes: undefined };
      }
      return item;
    }));
    triggerNotification('Berita acara berhasil disetujui!');
    setSelectedItem(null);
  };

  const handleSendRevision = () => {
    if (!selectedItem || !revisionInput.trim()) return;
    setDataList(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        return { ...item, status: 'revisi', revisionNotes: revisionInput };
      }
      return item;
    }));
    triggerNotification('Status diubah ke Revisi dengan catatan terkirim.');
    setShowRevisionModal(false);
    setRevisionInput('');
    setSelectedItem(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-8 bg-[#f4f6f9] min-h-screen">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg animate-bounce">
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          KERJA PRAKTEK TEKNIK INFORMATIKA UTM
        </p>
        <h1 className="text-3xl font-bold text-[#002f6c] mt-1">
          Berita Acara Mahasiswa
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Tinjau, verifikasi, dan kelola dokumen berita acara kerja praktek mahasiswa.
        </p>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['semua', 'menunggu', 'disetujui', 'revisi'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  selectedStatus === status
                    ? 'bg-[#0091d5] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Cari NIM atau Nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2.5 focus:outline-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 border-collapse">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold text-center w-12">No.</th>
                <th className="py-3.5 px-4 font-bold">NIM</th>
                <th className="py-3.5 px-4 font-bold">Nama Mahasiswa</th>
                <th className="py-3.5 px-4 font-bold">File Dokumen</th>
                <th className="py-3.5 px-4 font-bold">Tanggal Kirim</th>
                <th className="py-3.5 px-4 text-center font-bold">Status</th>
                <th className="py-3.5 px-4 text-center font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-center font-medium text-slate-900">{index + 1}</td>
                    <td className="py-4 px-4 font-mono font-medium text-slate-900">{item.nim}</td>
                    <td className="py-4 px-4 font-medium text-slate-900">{item.studentName}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <FileText size={16} className="text-blue-500 shrink-0" />
                        <span className="truncate max-w-[180px]">{item.fileName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-400">{item.submittedAt}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        item.status === 'disetujui' 
                          ? 'bg-green-100 text-green-800' 
                          : item.status === 'revisi'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status === 'disetujui' && <CheckCircle2 size={12} />}
                        {item.status === 'revisi' && <AlertTriangle size={12} />}
                        {item.status === 'menunggu' && <Clock size={12} />}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-[#0091d5] hover:text-white rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1"
                        >
                          <Eye size={14} /> Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada data berita acara untuk kriteria ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-[#002f6c] text-white p-4">
              <h3 className="font-bold text-lg">Detail Berita Acara</h3>
              <button 
                onClick={() => setSelectedItem(null)}
                className="hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-slate-700">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-slate-400">Mahasiswa</span>
                <span className="font-semibold">{selectedItem.studentName} ({selectedItem.nim})</span>

                <span className="text-slate-400">Tanggal Kirim</span>
                <span>{selectedItem.submittedAt}</span>

                <span className="text-slate-400">Dokumen</span>
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <FileText size={16} />
                  <a href="#" className="hover:underline flex items-center gap-1">
                    {selectedItem.fileName} <Download size={12} />
                  </a>
                </div>

                <span className="text-slate-400">Status</span>
                <div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                    selectedItem.status === 'disetujui'
                      ? 'bg-green-100 text-green-800'
                      : selectedItem.status === 'revisi'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedItem.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <h4 className="font-semibold text-sm text-slate-500">Catatan Mahasiswa</h4>
                <p className="bg-slate-50 p-3 rounded-lg text-sm italic text-slate-600">
                  "{selectedItem.notes}"
                </p>
              </div>

              {selectedItem.status === 'revisi' && selectedItem.revisionNotes && (
                <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm border border-red-100 space-y-1">
                  <h4 className="font-bold flex items-center gap-1">
                    <AlertTriangle size={14} /> Catatan Revisi Koordinator:
                  </h4>
                  <p>{selectedItem.revisionNotes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer / Actions */}
            <div className="bg-slate-50 p-4 flex justify-between gap-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors"
              >
                Tutup
              </button>

              <div className="flex gap-2">
                {selectedItem.status !== 'revisi' && (
                  <button
                    onClick={() => {
                      setRevisionInput(selectedItem.revisionNotes || '');
                      setShowRevisionModal(true);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <MessageSquare size={16} /> Minta Revisi
                  </button>
                )}
                {selectedItem.status !== 'disetujui' && (
                  <button
                    onClick={() => handleApprove(selectedItem.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Check size={16} /> Setujui
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revision Input Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-red-700 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold">Kirim Catatan Revisi</h3>
              <button 
                onClick={() => setShowRevisionModal(false)}
                className="hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <label className="text-sm font-bold text-slate-600 block">
                Tulis detail perbaikan yang diperlukan mahasiswa:
              </label>
              <textarea
                value={revisionInput}
                onChange={(e) => setRevisionInput(e.target.value)}
                placeholder="Contoh: Harap lampirkan tanda tangan dosen pembimbing..."
                className="w-full h-32 p-3 border border-slate-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
            <div className="bg-slate-50 p-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSendRevision}
                disabled={!revisionInput.trim()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                Kirim Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Reports.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
