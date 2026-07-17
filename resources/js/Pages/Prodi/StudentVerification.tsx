import ProdiLayout from '@/Layouts/ProdiLayout';
import { Search, CheckCircle, XCircle, FileText, Filter, Eye } from 'lucide-react';

const DUMMY_STUDENTS = [
  { id: 1, name: 'Budi Santoso', nim: '20041110001', topic: 'Sistem Informasi Akademik Terintegrasi', status: 'Menunggu' },
  { id: 2, name: 'Siti Aminah', nim: '20041110002', topic: 'Analisis Sentimen Pelanggan E-commerce', status: 'Disetujui' },
  { id: 3, name: 'Ahmad Dahlan', nim: '20041110003', topic: 'Prototipe IoT Smart Home', status: 'Ditolak' },
  { id: 4, name: 'Diana Fitri', nim: '20041110004', topic: 'Aplikasi Rekomendasi Makanan Sehat', status: 'Menunggu' },
  { id: 5, name: 'Eko Prabowo', nim: '20041110005', topic: 'Sistem Keamanan Jaringan Kantor', status: 'Disetujui' },
];

export default function StudentVerification() {
  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Verifikasi Mahasiswa</h2>
          <p className="text-on-surface-variant font-body-md text-body-md">Tinjau dan verifikasi pengajuan pendaftaran dan proposal magang mahasiswa.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full relative">
          <label className="font-label-md text-label-md text-secondary block mb-2">Pencarian</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input 
              type="text" 
              placeholder="Cari nama atau NIM..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary transition-all text-body-md text-on-surface outline-none"
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <label className="font-label-md text-label-md text-secondary block mb-2">Status</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
            <select className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary transition-all text-body-md text-on-surface appearance-none outline-none">
              <option value="">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="disetujui">Disetujui</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-secondary font-label-md text-label-md uppercase tracking-wider">
                <th className="p-4 font-semibold whitespace-nowrap">Mahasiswa</th>
                <th className="p-4 font-semibold whitespace-nowrap min-w-[300px]">Topik Proposal</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant font-body-md text-body-md">
              {DUMMY_STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-surface-bright transition-colors group">
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-on-surface whitespace-nowrap">{student.name}</p>
                      <p className="text-secondary text-sm whitespace-nowrap">NIM: {student.nim}</p>
                    </div>
                  </td>
                  <td className="p-4 text-on-surface-variant">
                    <div className="flex items-start gap-2">
                      <FileText className="text-outline shrink-0 mt-0.5" size={16} />
                      <span className="line-clamp-2">{student.topic}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md font-label-md border whitespace-nowrap
                      ${student.status === 'Menunggu' ? 'bg-secondary-container text-on-secondary-container border-secondary-container' : 
                        student.status === 'Disetujui' ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]' : 
                        'bg-error-container/50 text-error border-error-container'}`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-highest" title="Lihat Detail">
                        <Eye size={18} />
                      </button>
                      {student.status === 'Menunggu' && (
                        <>
                          <button className="text-[#137333] hover:bg-[#e6f4ea] transition-colors p-2 rounded-full" title="Setujui">
                            <CheckCircle size={18} />
                          </button>
                          <button className="text-error hover:bg-error-container/50 transition-colors p-2 rounded-full" title="Tolak">
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

StudentVerification.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
