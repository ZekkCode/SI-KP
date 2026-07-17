import InstansiLayout from '@/Layouts/InstansiLayout';
import React from 'react';
import { User, Lock, Bell, Save } from 'lucide-react';

export default function Settings() {
  return (
    <main className="flex-1 min-h-screen p-margin-desktop w-full max-w-container-max mx-auto">
        <header className="mb-8">
          <h2 className="text-headline-lg text-on-surface font-bold tracking-tight">Pengaturan</h2>
          <p className="text-body-lg text-on-surface-variant mt-1">Kelola informasi profil dan preferensi akun Anda.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Settings Nav */}
          <div className="lg:col-span-1 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary-container text-on-secondary-container font-semibold border-l-4 border-primary text-left">
              <User size={20} />
              <span className="text-body-md">Profil Pribadi</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-colors text-left">
              <Lock size={20} />
              <span className="text-body-md">Keamanan & Kata Sandi</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-colors text-left">
              <Bell size={20} />
              <span className="text-body-md">Notifikasi</span>
            </button>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-gutter">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <h3 className="text-headline-sm text-on-surface border-b border-outline-variant pb-4 mb-6">Informasi Dasar</h3>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
                <div className="relative">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkUrbX1i6SDuOuXQvZL3wWPEnaDtop5-KZ2MXc0HqFmpukGZpdusWTUcr4s67DvA9w2lFqNDyLxQ2G4yxsjH6IH_exZxs2m4xd796f9mY-eKtsO9NoPy59Iy2AsHhheIp_xTkbQgCTImtuPhIziTqXoHfqk-LycO0Yrf4QexHSVG5vk4kQAL9BaKx16ZcsuXE9t7fUVHzESdIxnch0axkRi-u3JcumWRMR2rDKZsaOD-bNrJO4_wEs8UcBzuI_py9K6Gt41K1x69s" 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-surface-container-high"
                  />
                  <button className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-md hover:bg-primary-container hover:text-on-primary-container transition-colors">
                    <User size={14} />
                  </button>
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-label-md text-on-surface-variant mb-1">Nama Lengkap</label>
                      <input type="text" defaultValue="Dr. Hendra Wijaya" className="w-full bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary px-3 py-2 text-body-md text-on-surface outline-none" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-label-md text-on-surface-variant mb-1">Nomor Telepon</label>
                      <input type="tel" defaultValue="+62 812 3456 7890" className="w-full bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary px-3 py-2 text-body-md text-on-surface outline-none" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-label-md text-on-surface-variant mb-1">Email Aktif</label>
                    <input type="email" defaultValue="hendra.wijaya@acmecorp.id" className="w-full bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary px-3 py-2 text-body-md text-on-surface outline-none" />
                  </div>
                </div>
              </div>

              <h3 className="text-headline-sm text-on-surface border-b border-outline-variant pb-4 mb-6 mt-8">Informasi Profesional</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-label-md text-on-surface-variant mb-1">Nama Perusahaan / Instansi</label>
                  <input type="text" defaultValue="Acme Corp Indonesia" className="w-full bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary px-3 py-2 text-body-md text-on-surface outline-none" />
                </div>
                <div className="flex flex-col">
                  <label className="text-label-md text-on-surface-variant mb-1">Jabatan / Posisi</label>
                  <input type="text" defaultValue="Senior Engineering Manager" className="w-full bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary px-3 py-2 text-body-md text-on-surface outline-none" />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-outline-variant flex justify-end">
                <button className="bg-primary text-on-primary font-label-md py-2.5 px-6 rounded-lg hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2 shadow-sm">
                  <Save size={18} />
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}

Settings.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
