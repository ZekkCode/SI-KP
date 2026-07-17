import InstansiLayout from '@/Layouts/InstansiLayout';
import React from 'react';
import { Search, Award, Upload, Filter } from 'lucide-react';

export default function Certificates() {
  return (
    <main className="flex-1 min-h-screen p-margin-desktop w-full max-w-container-max mx-auto">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-headline-lg text-on-surface font-bold tracking-tight">Sertifikat Magang</h2>
            <p className="text-body-lg text-on-surface-variant mt-1">Kelola dan unggah sertifikat untuk mahasiswa yang telah menyelesaikan program magang.</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input
                type="text"
                placeholder="Cari mahasiswa..."
                className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md w-64 shadow-sm transition-all"
              />
            </div>
          </div>
        </header>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
            <h3 className="text-headline-md text-on-surface font-semibold">Daftar Sertifikat</h3>
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
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Periode Selesai</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Nilai Akhir</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase tracking-wider font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-md font-bold">DW</div>
                      <span className="text-body-md font-semibold text-on-surface">Dian Wibowo</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">10123458</td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">Universitas Gadjah Mada</td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">Desember 2023</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-container text-on-primary-container">
                      A (92.50)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="flex items-center justify-end gap-2 text-primary hover:text-on-primary-fixed-variant transition-colors ml-auto font-label-md">
                      <Upload size={16} />
                      Unggah
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
  );
}

Certificates.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
