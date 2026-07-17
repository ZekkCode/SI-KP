import ProdiLayout from '@/Layouts/ProdiLayout';
import { Search, SlidersHorizontal, Edit2, Save, X, Plus, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const INITIAL_DATA = [
  { id: 'AB', name: 'Dr. Andi Budianto, S.T., M.Kom.', current: 4, max: 10, nip: 'NIP: 198005122005011002' },
  { id: 'CS', name: 'Citra Sari, S.Kom., M.T.', current: 8, max: 10, nip: 'NIDN: 0715088502' },
  { id: 'RF', name: 'Rina Fitriana, S.Kom., M.Cs.', current: 9, max: 10, nip: 'NIP: 198210102008122001' },
  { id: 'BS', name: 'Prof. Dr. Ir. Budi Santoso', current: 10, max: 10, nip: 'NIP: 197001011995121001' },
];

export default function QuotaManagement() {
  const [data, setData] = useState(INITIAL_DATA);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(10);

  const startEdit = (id: string, max: number) => {
    setEditingId(id);
    setEditValue(max);
  };

  const saveEdit = (id: string) => {
    setData(data.map(item => item.id === id ? { ...item, max: editValue } : item));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Manajemen Kuota</h2>
          <p className="text-on-surface-variant font-body-md text-body-md">Atur batas maksimal mahasiswa bimbingan untuk setiap dosen.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-primary text-on-primary px-5 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm flex items-center gap-2 font-label-md text-label-md">
            <SlidersHorizontal size={18} />
            Penyesuaian Massal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
            <SlidersHorizontal size={24} />
          </div>
          <div>
            <p className="font-label-md text-label-md text-secondary">Rata-rata Kuota</p>
            <p className="font-headline-md text-headline-md text-on-surface">10 <span className="text-sm font-normal text-outline">mahasiswa/dosen</span></p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="font-label-md text-label-md text-secondary">Dosen Kuota Penuh</p>
            <p className="font-headline-md text-headline-md text-on-surface">1 <span className="text-sm font-normal text-outline">dosen</span></p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
            <Search size={24} />
          </div>
          <div className="w-full">
            <input 
              type="text" 
              placeholder="Cari dosen..." 
              className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-1 font-body-md text-body-md text-on-surface"
            />
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-secondary font-label-md text-label-md uppercase tracking-wider">
                <th className="p-4 font-semibold whitespace-nowrap">Nama Dosen & NIP/NIDN</th>
                <th className="p-4 font-semibold whitespace-nowrap">Keterisian Kuota</th>
                <th className="p-4 font-semibold whitespace-nowrap">Batas Maksimal</th>
                <th className="p-4 font-semibold text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant font-body-md text-body-md">
              {data.map((lecturer) => {
                const percentage = (lecturer.current / lecturer.max) * 100;
                let barColor = 'bg-primary';
                if (percentage >= 90) barColor = 'bg-error';
                else if (percentage >= 70) barColor = 'bg-[#fbbc04]'; // Warning color

                return (
                  <tr key={lecturer.id} className="hover:bg-surface-bright transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container-highest text-secondary flex items-center justify-center font-bold font-headline-sm shrink-0">
                          {lecturer.id}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface whitespace-nowrap">{lecturer.name}</p>
                          <p className="text-secondary text-sm whitespace-nowrap">{lecturer.nip}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                          <div className={`h-full ${barColor}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap">
                          {lecturer.current} / {lecturer.max}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {editingId === lecturer.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            min={lecturer.current} 
                            value={editValue} 
                            onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-primary rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary text-center font-body-md"
                          />
                        </div>
                      ) : (
                        <span className="font-body-md text-on-surface px-2">{lecturer.max}</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {editingId === lecturer.id ? (
                        <div className="flex justify-end gap-1">
                          <button onClick={() => saveEdit(lecturer.id)} className="text-[#137333] hover:bg-[#e6f4ea] transition-colors p-2 rounded-full">
                            <Save size={18} />
                          </button>
                          <button onClick={cancelEdit} className="text-error hover:bg-error-container/50 transition-colors p-2 rounded-full">
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(lecturer.id, lecturer.max)} className="text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-highest">
                          <Edit2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

QuotaManagement.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
