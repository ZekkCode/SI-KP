import { useState } from 'react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import { Building2, Users, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

interface Instansi {
  id: number;
  nama: string;
  alamat: string;
}

interface Pembimbing {
  id: number;
  nama: string;
  instansi: Instansi;
  user_id: number | null;
}

interface Props {
  instansis: Instansi[];
  pembimbings: Pembimbing[];
}

type Tab = 'instansi' | 'pembimbing';

export default function Index({ instansis = [], pembimbings = [] }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('instansi');
  const [searchTerm, setSearchTerm] = useState('');
  const { delete: destroy } = useForm();

  // --- Instansi ---
  const filteredInstansi = instansis.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteInstansi = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data instansi ini?')) {
      destroy(route('prodi.instansi.destroy', id));
    }
  };

  // --- Pembimbing Lapangan ---
  const filteredPembimbing = pembimbings.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.instansi?.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePembimbing = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pembimbing lapangan ini?')) {
      destroy(route('prodi.pembimbing-lapangan.destroy', id));
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const tabs = [
    { key: 'instansi' as Tab,   label: 'Instansi Mitra',         icon: Building2, count: instansis.length },
    { key: 'pembimbing' as Tab, label: 'Pembimbing Lapangan',     icon: Users,     count: pembimbings.length },
  ];

  return (
    <>
      <Head title="Instansi & Pembimbing Lapangan" />
      <div className="animate-in fade-in duration-300 p-4 md:p-8 space-y-6">

        {/* Page Header */}
        <PageHeader
          title="Instansi & Pembimbing Lapangan"
          description="Kelola daftar instansi mitra KP dan pembimbing lapangan yang terdaftar dalam sistem."
        >
          {activeTab === 'instansi' ? (
            <Link
              href={route('prodi.instansi.create')}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95"
            >
              <Plus size={18} />
              <span>Tambah Instansi</span>
            </Link>
          ) : (
            <Link
              href={route('prodi.pembimbing-lapangan.create')}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95"
            >
              <Plus size={18} />
              <span>Tambah Pembimbing</span>
            </Link>
          )}
        </PageHeader>

        {/* Tab Switcher */}
        <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="flex border-b border-outline-variant">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-4 text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'text-primary bg-primary/5'
                      : 'text-secondary hover:text-on-surface hover:bg-slate-50'
                  }`}
                >
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                  )}
                  <Icon size={17} />
                  <span>{tab.label}</span>
                  <span className={`inline-flex items-center justify-center min-w-[22px] h-5.5 px-1.5 rounded-full text-[11px] font-bold ${
                    isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="px-5 py-4 border-b border-outline-variant/60 bg-slate-50/50">
            <div className="relative max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
              <input
                type="text"
                placeholder={activeTab === 'instansi' ? 'Cari nama atau alamat instansi...' : 'Cari nama atau instansi pembimbing...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
              />
            </div>
          </div>

          {/* ======== TAB: INSTANSI MITRA ======== */}
          {activeTab === 'instansi' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-outline-variant">
                    <th className="px-5 py-3.5 font-semibold text-xs text-secondary uppercase tracking-wider w-14 text-center">No</th>
                    <th className="px-5 py-3.5 font-semibold text-xs text-secondary uppercase tracking-wider">Nama Instansi</th>
                    <th className="px-5 py-3.5 font-semibold text-xs text-secondary uppercase tracking-wider">Alamat</th>
                    <th className="px-5 py-3.5 font-semibold text-xs text-secondary uppercase tracking-wider text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstansi.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-secondary">
                        <div className="flex flex-col items-center gap-2">
                          <Building2 size={32} className="text-outline/40" />
                          <p className="text-sm font-medium">
                            {searchTerm ? 'Tidak ada instansi yang cocok dengan pencarian.' : 'Belum ada data instansi.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredInstansi.map((item, index) => (
                      <tr key={item.id} className="border-b border-outline-variant hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5 text-center text-sm font-medium text-secondary">{index + 1}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <Building2 size={15} />
                            </div>
                            <span className="text-sm font-semibold text-on-surface">{item.nama}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-secondary leading-relaxed max-w-md">{item.alamat}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-center gap-1.5">
                            <Link
                              href={route('prodi.instansi.edit', item.id)}
                              className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleDeleteInstansi(item.id)}
                              className="p-2 rounded-xl text-error hover:bg-error/10 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ======== TAB: PEMBIMBING LAPANGAN ======== */}
          {activeTab === 'pembimbing' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-outline-variant">
                    <th className="px-5 py-3.5 font-semibold text-xs text-secondary uppercase tracking-wider w-14 text-center">No</th>
                    <th className="px-5 py-3.5 font-semibold text-xs text-secondary uppercase tracking-wider">Nama Pembimbing</th>
                    <th className="px-5 py-3.5 font-semibold text-xs text-secondary uppercase tracking-wider">Instansi</th>
                    <th className="px-5 py-3.5 font-semibold text-xs text-secondary uppercase tracking-wider text-center">Status Akun</th>
                    <th className="px-5 py-3.5 font-semibold text-xs text-secondary uppercase tracking-wider text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPembimbing.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-secondary">
                        <div className="flex flex-col items-center gap-2">
                          <Users size={32} className="text-outline/40" />
                          <p className="text-sm font-medium">
                            {searchTerm ? 'Tidak ada pembimbing yang cocok dengan pencarian.' : 'Belum ada data pembimbing lapangan.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPembimbing.map((item, index) => (
                      <tr key={item.id} className="border-b border-outline-variant hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5 text-center text-sm font-medium text-secondary">{index + 1}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <Users size={15} />
                            </div>
                            <span className="text-sm font-semibold text-on-surface">{item.nama}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-secondary">{item.instansi?.nama || '-'}</td>
                        <td className="px-5 py-3.5 text-center">
                          {item.user_id ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                              Terklaim
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                              Belum Registrasi
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-center gap-1.5">
                            <Link
                              href={route('prodi.pembimbing-lapangan.edit', item.id)}
                              className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleDeletePembimbing(item.id)}
                              disabled={item.user_id !== null}
                              className={`p-2 rounded-xl transition-colors ${
                                item.user_id
                                  ? 'text-outline cursor-not-allowed opacity-50'
                                  : 'text-error hover:bg-error/10'
                              }`}
                              title={item.user_id ? 'Tidak dapat dihapus (sudah terklaim)' : 'Hapus'}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

Index.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
