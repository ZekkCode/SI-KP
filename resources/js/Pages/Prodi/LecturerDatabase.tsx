import ProdiLayout from '@/Layouts/ProdiLayout';
import { 
  Download, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const DUMMY_DATA = [
  {
    id: 'AB',
    name: 'Dr. Andi Budianto, S.T., M.Kom.',
    nip: 'NIP: 198005122005011002',
    color: 'bg-primary-fixed text-on-primary-fixed',
    field: 'Rekayasa Perangkat Lunak',
    quota: '4 / 10',
    status: 'Aktif',
    statusStyle: 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]',
    indicatorColor: 'bg-primary'
  },
  {
    id: 'CS',
    name: 'Citra Sari, S.Kom., M.T.',
    nip: 'NIDN: 0715088502',
    color: 'bg-secondary-fixed text-on-secondary-fixed',
    field: 'Kecerdasan Buatan, Data Mining',
    quota: '8 / 10',
    status: 'Aktif',
    statusStyle: 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]',
    indicatorColor: 'bg-outline'
  },
  {
    id: 'DP',
    name: 'Dian Pratama, M.Sc.',
    nip: 'NIP: 198511202010121005',
    color: 'bg-surface-container-highest text-secondary',
    field: 'Jaringan & Keamanan Komputer',
    quota: 'N/A',
    status: 'Cuti Studi',
    statusStyle: 'bg-surface-variant text-on-surface-variant border-outline-variant',
    inactive: true
  }
];

export default function LecturerDatabase() {
  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Master Data Dosen</h2>
          <p className="text-on-surface-variant font-body-md text-body-md">Kelola informasi, keahlian, dan status aktif dosen pembimbing.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-surface-container text-on-surface px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors flex items-center gap-2 font-label-md text-label-md">
            <Download size={18} />
            Unduh CSV
          </button>
          <button className="bg-primary text-on-primary px-5 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm flex items-center gap-2 font-label-md text-label-md">
            <Plus size={18} />
            Tambah Dosen
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full relative">
          <label className="font-label-md text-label-md text-secondary block mb-2">Pencarian</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input 
              type="text" 
              placeholder="Cari nama atau NIP/NIDN..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary transition-all text-body-md text-on-surface outline-none"
            />
          </div>
        </div>
        <div className="w-full md:w-64">
          <label className="font-label-md text-label-md text-secondary block mb-2">Bidang Keahlian</label>
          <select className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary transition-all text-body-md text-on-surface appearance-none outline-none">
            <option value="">Semua Bidang</option>
            <option value="rpl">Rekayasa Perangkat Lunak</option>
            <option value="ai">Kecerdasan Buatan</option>
            <option value="jaringan">Jaringan Komputer</option>
          </select>
        </div>
        <div className="w-full md:w-48">
          <label className="font-label-md text-label-md text-secondary block mb-2">Status</label>
          <select className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary transition-all text-body-md text-on-surface appearance-none outline-none">
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="cuti">Cuti / Non-Aktif</option>
          </select>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-secondary font-label-md text-label-md uppercase tracking-wider">
                <th className="p-4 font-semibold whitespace-nowrap">Nama Dosen & NIP/NIDN</th>
                <th className="p-4 font-semibold whitespace-nowrap">Bidang Keahlian</th>
                <th className="p-4 font-semibold whitespace-nowrap">Kuota Sisa</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant font-body-md text-body-md">
              {DUMMY_DATA.map((lecturer, i) => (
                <tr key={i} className={`hover:bg-surface-bright transition-colors group ${lecturer.inactive ? 'opacity-75' : ''}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-headline-sm shrink-0 ${lecturer.color}`}>
                        {lecturer.id}
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface whitespace-nowrap">{lecturer.name}</p>
                        <p className="text-secondary text-sm whitespace-nowrap">{lecturer.nip}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-on-surface-variant min-w-[200px]">{lecturer.field}</td>
                  <td className="p-4">
                    {lecturer.quota === 'N/A' ? (
                      <span className="text-secondary italic text-sm">N/A</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-md whitespace-nowrap">
                        <span className={`w-2 h-2 rounded-full ${lecturer.indicatorColor}`}></span>
                        {lecturer.quota}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md font-label-md border whitespace-nowrap ${lecturer.statusStyle}`}>
                      {lecturer.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-highest">
                        <Edit2 size={18} />
                      </button>
                      <button className="text-secondary hover:text-error transition-colors p-2 rounded-full hover:bg-error-container/50">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-surface-variant flex flex-col sm:flex-row items-center justify-between text-sm text-secondary bg-surface-container-lowest gap-4">
          <div>Menampilkan 1 - 3 dari 45 Dosen</div>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-surface-variant disabled:opacity-50" disabled>
              <ChevronLeft size={20} />
            </button>
            <button className="w-8 h-8 rounded-md bg-primary text-on-primary font-medium flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded-md hover:bg-surface-variant font-medium flex items-center justify-center text-on-surface">2</button>
            <button className="w-8 h-8 rounded-md hover:bg-surface-variant font-medium flex items-center justify-center text-on-surface">3</button>
            <span className="px-1">...</span>
            <button className="p-1 rounded hover:bg-surface-variant">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

LecturerDatabase.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
