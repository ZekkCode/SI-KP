import InstansiLayout from '@/Layouts/InstansiLayout';
import React, { useState } from 'react';
import { User, Lock, Bell, Save, Camera, Check } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <main className="flex-1 min-h-screen p-6 md:p-8 w-full max-w-[1200px] mx-auto space-y-8 bg-[#f8fafc]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pengaturan Akun</h1>
        <p className="text-slate-500 mt-2 text-sm">
          Kelola informasi profil perwakilan instansi, pengaturan keamanan, dan preferensi notifikasi Anda.
        </p>
      </div>

      {/* Toast Notification */}
      {isSaved && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">
            <Check size={12} />
          </div>
          <span className="text-sm font-semibold">Pengaturan berhasil disimpan!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Navigation Tabs */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-bold text-sm transition-all duration-150 ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <User size={18} />
            <span>Profil Perwakilan</span>
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-bold text-sm transition-all duration-150 ${
              activeTab === 'security'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Lock size={18} />
            <span>Keamanan & Kata Sandi</span>
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-bold text-sm transition-all duration-150 ${
              activeTab === 'notifications'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bell size={18} />
            <span>Preferensi Notifikasi</span>
          </button>
        </div>

        {/* Right Column: Settings Content Forms */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            
            {activeTab === 'profile' && (
              <>
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-800">Informasi Profil Instansi</h3>
                  <p className="text-xs text-slate-400 mt-1">Detail data perwakilan dan profil operasional perusahaan.</p>
                </div>
                
                {/* Profile Picture Upload Section */}
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="relative group">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkUrbX1i6SDuOuXQvZL3wWPEnaDtop5-KZ2MXc0HqFmpukGZpdusWTUcr4s67DvA9w2lFqNDyLxQ2G4yxsjH6IH_exZxs2m4xd796f9mY-eKtsO9NoPy59Iy2AsHhheIp_xTkbQgCTImtuPhIziTqXoHfqk-LycO0Yrf4QexHSVG5vk4kQAL9BaKx16ZcsuXE9t7fUVHzESdIxnch0axkRi-u3JcumWRMR2rDKZsaOD-bNrJO4_wEs8UcBzuI_py9K6Gt41K1x69s" 
                      alt="Profile Avatar" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm"
                    />
                    <button 
                      type="button"
                      className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md transition-colors"
                      title="Ganti Foto"
                    >
                      <Camera size={14} />
                    </button>
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-bold text-slate-800">Foto Profil Perwakilan</h4>
                    <p className="text-xs text-slate-400">Direkomendasikan rasio 1:1, JPG atau PNG maksimal 2MB.</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 uppercase">Nama Lengkap Supervisor</label>
                      <input 
                        type="text" 
                        defaultValue="Dr. Hendra Wijaya" 
                        className="w-full bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 uppercase">Nomor Telepon / WA</label>
                      <input 
                        type="tel" 
                        defaultValue="+62 812-3456-7890" 
                        className="w-full bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 uppercase">Email Korespondensi</label>
                    <input 
                      type="email" 
                      defaultValue="hendra.wijaya@telkom.co.id" 
                      className="w-full bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 uppercase">Nama Instansi / Perusahaan</label>
                      <input 
                        type="text" 
                        defaultValue="PT Telkom Indonesia" 
                        disabled
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-500 outline-none cursor-not-allowed" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 uppercase">Jabatan / Posisi</label>
                      <input 
                        type="text" 
                        defaultValue="Senior Engineering Manager" 
                        className="w-full bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-800">Keamanan Akun</h3>
                  <p className="text-xs text-slate-400 mt-1">Perbarui kata sandi Anda secara berkala untuk menjaga keamanan data.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 uppercase">Kata Sandi Saat Ini</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3 py-2.5 text-sm outline-none" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 uppercase">Kata Sandi Baru</label>
                    <input 
                      type="password" 
                      placeholder="Minimal 8 karakter" 
                      className="w-full bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3 py-2.5 text-sm outline-none" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 uppercase">Ulangi Kata Sandi Baru</label>
                    <input 
                      type="password" 
                      placeholder="Masukkan ulang kata sandi baru" 
                      className="w-full bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3 py-2.5 text-sm outline-none" 
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-800">Notifikasi & Lansiran</h3>
                  <p className="text-xs text-slate-400 mt-1">Konfigurasi pesan notifikasi sistem yang ingin Anda terima.</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-1 rounded text-indigo-600 focus:ring-indigo-500" />
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">Pengajuan Mahasiswa Baru</span>
                      <span className="text-xs text-slate-400">Terima email lansiran saat ada mahasiswa baru yang mengajukan penempatan magang.</span>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-1 rounded text-indigo-600 focus:ring-indigo-500" />
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">Logbook Harian</span>
                      <span className="text-xs text-slate-400">Kirim rangkuman mingguan logbook mahasiswa yang belum ditinjau ke email saya.</span>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-1 rounded text-indigo-600 focus:ring-indigo-500" />
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">Pengingat Evaluasi</span>
                      <span className="text-xs text-slate-400">Ingatkan saya via email 1 minggu sebelum masa magang mahasiswa selesai untuk mengisi form penilaian.</span>
                    </div>
                  </label>
                </div>
              </>
            )}

            {/* Save Button */}
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-sm text-sm"
              >
                <Save size={16} />
                Simpan Perubahan
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}

Settings.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
