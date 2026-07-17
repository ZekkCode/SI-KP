import InstansiLayout from '@/Layouts/InstansiLayout';
import React from 'react';
import { Search, Users, Building2, AlertCircle, Filter, MoreVertical } from 'lucide-react';

export default function Dashboard() {
  const onViewStudent = () => {
    // TODO: Implement view student details logic
  };

  return (
    <main className="flex-1 min-h-screen p-margin-desktop w-full max-w-container-max mx-auto">
        {/* Header */}
        <header className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-headline-lg text-on-surface font-bold tracking-tight">Dashboard</h2>
            <p className="text-body-lg text-on-surface-variant mt-1">Welcome back. Here is the overview of your current interns.</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input 
                type="text" 
                placeholder="Search interns..." 
                className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md w-64 shadow-sm transition-all"
              />
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-label-md text-on-surface-variant uppercase tracking-wider">Total Interns</h3>
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary">
                <Users size={16} />
              </div>
            </div>
            <div>
              <p className="text-headline-lg font-bold text-on-surface">24</p>
              <p className="text-label-md text-tertiary mt-1"><span className="text-primary font-semibold">+3</span> from last semester</p>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-label-md text-on-surface-variant uppercase tracking-wider">Active Departments</h3>
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <Building2 size={16} />
              </div>
            </div>
            <div>
              <p className="text-headline-lg font-bold text-on-surface">5</p>
              <p className="text-label-md text-tertiary mt-1">Across 3 branches</p>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-label-md text-on-surface-variant uppercase tracking-wider">Pending Evaluations</h3>
              <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
                <AlertCircle size={16} />
              </div>
            </div>
            <div>
              <p className="text-headline-lg font-bold text-on-surface">7</p>
              <p className="text-label-md text-tertiary mt-1">Due next week</p>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
            <h3 className="text-headline-md text-on-surface font-semibold">Daftar Mahasiswa Magang</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 text-primary hover:bg-primary-container rounded-lg transition-colors text-label-md">
              <Filter size={16} /> Filter
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant">
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Nama Mahasiswa</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">NIM</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Universitas</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Periode Magang</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Status</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase tracking-wider font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {/* Row 1 */}
                <tr className="hover:bg-surface-container-low transition-colors cursor-pointer" onClick={onViewStudent}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-label-md font-bold">AB</div>
                      <span className="text-body-md font-semibold text-on-surface">Ahmad Budi</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">10123456</td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">Universitas Indonesia</td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">Jan - Jun 2024</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-container text-on-secondary-container">Aktif</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-tertiary hover:text-primary transition-colors p-1" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-surface-container-low transition-colors cursor-pointer" onClick={onViewStudent}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-label-md font-bold">CS</div>
                      <span className="text-body-md font-semibold text-on-surface">Citra Sari</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">10123457</td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">Institut Teknologi Bandung</td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">Jan - Jun 2024</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-container text-on-secondary-container">Aktif</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-tertiary hover:text-primary transition-colors p-1" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
                {/* Row 3 */}
                <tr className="hover:bg-surface-container-low transition-colors cursor-pointer" onClick={onViewStudent}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-md font-bold">DW</div>
                      <span className="text-body-md font-semibold text-on-surface">Dian Wibowo</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">10123458</td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">Universitas Gadjah Mada</td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">Aug - Dec 2023</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-variant text-on-surface-variant">Selesai</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-tertiary hover:text-primary transition-colors p-1" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-lowest">
            <span className="text-label-md text-on-surface-variant">Showing 3 of 24 entries</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low text-label-md transition-colors disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low text-label-md transition-colors">Next</button>
            </div>
          </div>
        </div>
      </main>
  );
}

Dashboard.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
