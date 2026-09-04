import { useState } from 'react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import { Users, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';

interface Instansi {
  id: number;
  nama: string;
}

interface Pembimbing {
  id: number;
  nama: string;
  instansi: Instansi;
  user_id: number | null;
}

interface Props {
  pembimbings: Pembimbing[];
}

export default function Index({ pembimbings = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const { delete: destroy } = useForm();

  const filteredPembimbing = pembimbings.filter(item => {
    return item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.instansi?.nama.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pembimbing lapangan ini?')) {
      destroy(route('prodi.pembimbing-lapangan.destroy', id));
    }
  };

  return (
    <div className="animate-in fade-in duration-300 p-4 md:p-8">
      <Head title="Master Data Pembimbing Lapangan" />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-on-surface mb-2">
          Master Data Pembimbing Lapangan
        </h1>
        <p className="text-on-surface-variant mt-2">Kelola daftar pembimbing lapangan (whitelist) yang dapat meregistrasi akun.</p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-outline-variant bg-surface-container-low flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau instansi..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
            />
          </div>
          
          <Link
            href={route('prodi.pembimbing-lapangan.create')}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Tambah Pembimbing</span>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-4 font-semibold text-on-surface text-sm w-16 text-center">No</th>
                <th className="p-4 font-semibold text-on-surface text-sm">Nama Pembimbing</th>
                <th className="p-4 font-semibold text-on-surface text-sm">Instansi</th>
                <th className="p-4 font-semibold text-on-surface text-sm text-center">Status Akun</th>
                <th className="p-4 font-semibold text-on-surface text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPembimbing.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline">
                        <Users size={24} />
                      </div>
                      <p>{searchTerm ? 'Tidak ada pembimbing yang cocok dengan pencarian.' : 'Belum ada data pembimbing lapangan.'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPembimbing.map((item, index) => (
                  <tr key={item.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 text-center text-sm text-on-surface">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Users size={16} />
                        </div>
                        <span className="text-sm font-medium text-on-surface">{item.nama}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">{item.instansi?.nama || '-'}</td>
                    <td className="p-4 text-center">
                      {item.user_id ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          Terklaim
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          Belum Registrasi
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={route('prodi.pembimbing-lapangan.edit', item.id)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={item.user_id !== null}
                          className={`p-2 rounded-lg transition-colors ${item.user_id ? 'text-outline cursor-not-allowed' : 'text-error hover:bg-error/10'}`}
                          title={item.user_id ? "Tidak dapat dihapus (Sudah Terklaim)" : "Hapus"}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Index.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
