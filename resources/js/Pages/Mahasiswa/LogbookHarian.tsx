import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, Edit3, Camera, Save, List, Search, Edit2, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LogbookHarian() {
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="flex-1 p-6 max-w-[1280px] mx-auto w-full space-y-6 relative">
      <div className="flex flex-col mb-4">
        <h2 className="text-title-lg font-bold text-primary">Logbook / Monitoring Harian</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="bg-primary-container/10 p-4 rounded-lg">
            <Calendar className="text-primary w-6 h-6" />
          </div>
          <div>
            <p className="text-label-sm text-secondary font-bold">Total Hari</p>
            <p className="text-headline-md font-bold">45 Hari</p>
          </div>
        </div>
        
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="bg-green-100 p-4 rounded-lg">
            <CheckCircle2 className="text-green-700 w-6 h-6" />
          </div>
          <div>
            <p className="text-label-sm text-secondary font-bold">Disetujui</p>
            <p className="text-headline-md font-bold text-green-700">32 Entri</p>
          </div>
        </div>
        
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="bg-secondary-container/20 p-4 rounded-lg">
            <Clock className="text-primary w-6 h-6" />
          </div>
          <div>
            <p className="text-label-sm text-secondary font-bold">Menunggu Review</p>
            <p className="text-headline-md font-bold">13 Entri</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-surface-container-low border-b border-outline-variant flex items-center space-x-2">
          <Edit3 className="text-primary w-5 h-5" />
          <h3 className="text-label-md uppercase tracking-wider text-primary font-bold">Tambah Logbook Harian</h3>
        </div>
        <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-label-md text-on-surface font-bold">Tanggal Kegiatan</label>
            <input type="date" className="w-full border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all p-4 text-body-md outline-none" />
          </div>
          
          <div className="space-y-2 row-span-2">
            <label className="text-label-md text-on-surface font-bold">Dokumentasi (Foto)</label>
            <label className="border-2 border-dashed border-primary/30 rounded-xl bg-primary-container/5 h-[140px] flex flex-col items-center justify-center cursor-pointer hover:bg-primary-container/10 transition-colors group">
              <Camera className="text-primary w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-label-sm text-primary font-bold">Klik atau seret foto ke sini</p>
              <p className="text-[10px] text-secondary mt-1">PNG, JPG up to 5MB</p>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
          
          <div className="md:col-span-1 space-y-2">
            <label className="text-label-md text-on-surface font-bold">Deskripsi Pekerjaan</label>
            <textarea 
              className="w-full border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all p-4 text-body-md outline-none" 
              placeholder="Jelaskan detail pekerjaan Anda hari ini..." 
              rows={3} 
            />
          </div>
          
          <div className="md:col-span-2 flex justify-end pt-4">
            <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2 shadow-md">
              <Save className="w-5 h-5" />
              <span>Simpan Logbook</span>
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-surface-container-low border-b border-outline-variant flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <List className="text-primary w-5 h-5" />
            <h3 className="text-label-md uppercase tracking-wider text-primary font-bold">Riwayat Logbook</h3>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
              <input type="text" placeholder="Cari kegiatan..." className="pl-10 pr-4 py-2 border border-outline-variant rounded-full text-body-sm focus:ring-1 focus:ring-primary outline-none w-48" />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface text-left border-b border-outline-variant">
                <th className="p-4 text-label-sm text-secondary font-bold">TANGGAL</th>
                <th className="p-4 text-label-sm text-secondary font-bold">PEKERJAAN</th>
                <th className="p-4 text-label-sm text-secondary font-bold">DOKUMENTASI</th>
                <th className="p-4 text-label-sm text-secondary font-bold">STATUS</th>
                <th className="p-4 text-label-sm text-secondary font-bold text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {/* Entry 1 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="p-4 align-top">
                  <p className="text-body-md font-bold">12 Okt 2024</p>
                  <p className="text-label-sm text-secondary">08:00 - 17:00</p>
                </td>
                <td className="p-4 align-top max-w-md">
                  <p className="text-body-md">Menganalisis sistem database legacy dan merancang skema migrasi ke PostgreSQL. Melakukan benchmarking performa query pada tabel utama yang memiliki jutaan row.</p>
                </td>
                <td className="p-4 align-top">
                  <div className="w-20 h-14 rounded-lg bg-surface-variant overflow-hidden border border-outline-variant relative group/img cursor-zoom-in">
                    <div className="w-full h-full bg-slate-300" />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                      <Eye className="text-white w-5 h-5" />
                    </div>
                  </div>
                </td>
                <td className="p-4 align-top">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-label-sm font-bold flex items-center w-fit space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Disetujui</span>
                  </span>
                </td>
                <td className="p-4 align-top">
                  <div className="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1 hover:text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
              
              {/* Entry 2 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="p-4 align-top">
                  <p className="text-body-md font-bold">11 Okt 2024</p>
                  <p className="text-label-sm text-secondary">09:00 - 16:30</p>
                </td>
                <td className="p-4 align-top max-w-md">
                  <p className="text-body-md">Implementasi API endpoints untuk fitur manajemen inventaris menggunakan Node.js dan Express. Unit testing menggunakan Jest.</p>
                </td>
                <td className="p-4 align-top">
                  <div className="w-20 h-14 rounded-lg bg-surface-variant overflow-hidden border border-outline-variant">
                    <div className="w-full h-full bg-slate-300" />
                  </div>
                </td>
                <td className="p-4 align-top">
                  <span className="px-3 py-1 bg-blue-100 text-primary rounded-full text-label-sm font-bold flex items-center w-fit space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Menunggu</span>
                  </span>
                </td>
                <td className="p-4 align-top">
                  <div className="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1 hover:text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-surface border-t border-outline-variant flex justify-between items-center">
          <p className="text-label-sm text-secondary">Menampilkan 1-10 dari 45 entri</p>
          <div className="flex space-x-2">
            <button className="p-1 rounded border border-outline-variant hover:bg-white transition-all disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-4 py-1 rounded border border-primary bg-primary text-white font-bold text-label-sm">1</button>
            <button className="px-4 py-1 rounded border border-outline-variant hover:bg-white transition-all text-label-sm">2</button>
            <button className="px-4 py-1 rounded border border-outline-variant hover:bg-white transition-all text-label-sm">3</button>
            <button className="p-1 rounded border border-outline-variant hover:bg-white transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Success Toast */}
      <div className={`fixed bottom-8 right-8 bg-green-700 text-white p-4 rounded-xl shadow-2xl flex items-center space-x-4 transform transition-all duration-300 z-50 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <CheckCircle2 className="w-6 h-6" />
        <p className="text-label-md font-bold">Logbook berhasil disimpan!</p>
      </div>
    </div>
  );
}

LogbookHarian.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
