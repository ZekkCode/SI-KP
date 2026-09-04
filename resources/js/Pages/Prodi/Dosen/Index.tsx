import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';
import { 
  Edit2, 
  Trash2, 
  Search, 
  Users, 
  UserCheck, 
  Award, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Mail, 
  Loader2, 
  X, 
  Info 
} from 'lucide-react';

interface Lecturer {
  id: string;
  avatar_id: string;
  name: string;
  nip: string;
  email: string;
  quota: string;
  status: string;
  statusStyle: string;
  indicatorColor: string;
}

interface Props {
  lecturers: Lecturer[];
}

export default function LecturerIndex({ lecturers = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data dosen ${name}?`)) {
      router.delete(route('prodi.dosen.destroy', id));
    }
  };

  const handleSendCredential = (lecturer: Lecturer) => {
    if (confirm(`Kirim ulang email pemberitahuan akun & password sementara baru ke ${lecturer.name} (${lecturer.email})?`)) {
      setSendingEmailId(lecturer.id);
      router.post(route('prodi.dosen.kirim-kredensial', lecturer.id), {}, {
        onFinish: () => setSendingEmailId(null),
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsUploading(true);
    router.post(route('prodi.dosen.import'), formData, {
      forceFormData: true,
      onSuccess: () => {
        setIsImportModalOpen(false);
        setSelectedFile(null);
      },
      onFinish: () => {
        setIsUploading(false);
      },
    });
  };

  const filteredLecturers = lecturers.filter(
    (l) =>
      l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.nip?.includes(searchTerm) ||
      l.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDosen = lecturers.length;

  return (
    <>
      <Head title="Daftar Dosen Pembimbing" />
      <div className="animate-in fade-in duration-300 p-4 md:p-8 space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Master Data Dosen Pembimbing"
          description="Kelola informasi NIP, nama, email, kuota bimbingan, dan kredensial akun portal Dosen."
        >
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Upload size={17} />
            <span>Import Data Dosen</span>
          </button>
        </PageHeader>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Total Dosen</p>
              <h3 className="text-3xl font-extrabold text-primary mt-1">{totalDosen}</h3>
              <p className="text-xs text-secondary mt-1">Dosen terdaftar di prodi</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Status Aktif</p>
              <h3 className="text-3xl font-extrabold text-green-600 mt-1">{totalDosen}</h3>
              <p className="text-xs text-secondary mt-1">Siap menerima mahasiswa KP</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <UserCheck size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Alokasi Bimbingan</p>
              <h3 className="text-3xl font-extrabold text-blue-600 mt-1">Aktif</h3>
              <p className="text-xs text-secondary mt-1">Sesuai kuota masing-masing</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Award size={24} />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl border border-outline-variant/60 shadow-sm p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Cari NIP, Nama Dosen, atau Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="text-xs text-secondary font-medium self-end md:self-center">
            Menampilkan <span className="font-bold text-on-surface">{filteredLecturers.length}</span> dari <span className="font-bold text-on-surface">{totalDosen}</span> Dosen
          </div>
        </div>

        {/* Wide Modern Table */}
        <ModernTable>
          <ModernTableHeader>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider w-16">No</th>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider">Nama & Email Dosen</th>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider">NIP / NIDN (Username)</th>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider">Kuota Bimbingan</th>
            <th className="px-6 py-4 font-semibold text-xs text-secondary uppercase tracking-wider text-right w-36">Aksi</th>
          </ModernTableHeader>
          <ModernTableBody>
            {filteredLecturers.map((lecturer, i) => (
              <tr key={lecturer.id} className="hover:bg-slate-50/70 transition-colors">
                <ModernTableTd className="px-6 py-4 font-semibold text-secondary">{i + 1}</ModernTableTd>
                <ModernTableTd className="px-6 py-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-primary/10 text-primary shrink-0 ring-2 ring-primary/20">
                      {lecturer.avatar_id || lecturer.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-base">{lecturer.name}</p>
                      <p className="text-secondary text-xs">{lecturer.email}</p>
                    </div>
                  </div>
                </ModernTableTd>
                <ModernTableTd className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-surface-container-high text-on-surface-variant font-mono text-xs font-semibold">
                    {lecturer.nip || '-'}
                  </span>
                </ModernTableTd>
                <ModernTableTd className="px-6 py-4">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs">
                    <span className={`w-2.5 h-2.5 rounded-full ${lecturer.indicatorColor || 'bg-green-500'}`} />
                    {lecturer.quota}
                  </span>
                </ModernTableTd>
                <ModernTableTd className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSendCredential(lecturer)}
                      disabled={sendingEmailId === lecturer.id}
                      className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
                      title="Kirim Ulang Kredensial ke Email Dosen"
                    >
                      {sendingEmailId === lecturer.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Mail size={18} />
                      )}
                    </button>
                    <Link
                      href={route('prodi.dosen.edit', lecturer.id)}
                      className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors"
                      title="Edit Data Dosen"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(lecturer.id, lecturer.name)}
                      className="p-2 rounded-xl text-error hover:bg-error/10 transition-colors cursor-pointer"
                      title="Hapus Data Dosen"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </ModernTableTd>
              </tr>
            ))}
            {filteredLecturers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-secondary">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users size={36} className="text-outline/40" />
                    <p className="font-medium text-sm">Tidak ada data dosen yang sesuai pencarian.</p>
                  </div>
                </td>
              </tr>
            )}
          </ModernTableBody>
        </ModernTable>
      </div>

      {/* ========================================================= */}
      {/* MODAL IMPORT DATA DOSEN                                    */}
      {/* ========================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileSpreadsheet size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Import Data Dosen</h3>
                  <p className="text-xs text-slate-500">Unggah file data dosen via Excel (.xlsx / .xls)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isUploading) {
                    setIsImportModalOpen(false);
                    setSelectedFile(null);
                  }
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Template Download Alert */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-xs text-emerald-900 flex-1">
                <p className="font-bold">Format Kolom Excel yang Dibutuhkan:</p>
                <p className="text-emerald-800 leading-relaxed">
                  Kolom: <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300">id</span>, <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300">nip</span>, <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300">nama</span>, <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300">email</span>.
                </p>
                <div className="pt-1">
                  <a
                    href={route('prodi.dosen.template')}
                    className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-bold underline hover:no-underline"
                  >
                    <Download size={14} />
                    <span>Download Template Excel (.xlsx)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Form Upload */}
            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Pilih File Excel (.xlsx, .xls)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx,.xls"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/20"
                >
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  {selectedFile ? (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-emerald-700 truncate max-w-xs mx-auto">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB — Klik untuk ganti file
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700">
                        Klik di sini untuk memilih file Excel
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Mendukung format Microsoft Excel (.xlsx / .xls)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Announcement */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                📢 <strong>Otomatisasi Sistem:</strong> Setelah di-import, sistem akan otomatis men-generate password sementara dan mengirimkan <strong>email pemberitahuan resmi</strong> berisi NIP & password ke email masing-masing dosen.
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Mengimpor & Mengirim Email...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      <span>Mulai Import Data Dosen</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

LecturerIndex.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
