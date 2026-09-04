import React from 'react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    nama: '',
    alamat: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('prodi.instansi.store'));
  };

  return (
    <div className="animate-in fade-in duration-300 p-4 md:p-8">
      <Head title="Tambah Instansi" />
      
      {/* Header */}
      <div className="mb-8">
        <Link 
          href={route('prodi.instansi.index')}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Daftar Instansi</span>
        </Link>
        <h1 className="text-3xl font-display font-semibold text-on-surface mb-2">
          Tambah Instansi Baru
        </h1>
        <p className="text-on-surface-variant mt-2">Tambahkan data instansi tempat Kerja Praktik baru ke dalam whitelist.</p>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden max-w-2xl">
        <form onSubmit={submit} className="p-6 md:p-8 space-y-6">
          
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-on-surface mb-2">
              Nama Instansi / Perusahaan <span className="text-error">*</span>
            </label>
            <input
              id="nama"
              type="text"
              value={data.nama}
              onChange={(e) => setData('nama', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:outline-none transition-colors ${
                errors.nama 
                  ? 'border-error focus:ring-error/20 bg-error/5' 
                  : 'border-outline-variant focus:ring-primary/20 focus:border-primary bg-white'
              }`}
              placeholder="Contoh: PT. Telekomunikasi Indonesia"
              required
            />
            {errors.nama && (
              <p className="mt-2 text-sm text-error flex items-center gap-1">
                {errors.nama}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="alamat" className="block text-sm font-medium text-on-surface mb-2">
              Alamat Lengkap <span className="text-error">*</span>
            </label>
            <textarea
              id="alamat"
              value={data.alamat}
              onChange={(e) => setData('alamat', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:outline-none transition-colors min-h-[120px] ${
                errors.alamat 
                  ? 'border-error focus:ring-error/20 bg-error/5' 
                  : 'border-outline-variant focus:ring-primary/20 focus:border-primary bg-white'
              }`}
              placeholder="Contoh: Jl. Ketintang No. 156, Surabaya..."
              required
            />
            {errors.alamat && (
              <p className="mt-2 text-sm text-error flex items-center gap-1">
                {errors.alamat}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
            <Link
              href={route('prodi.instansi.index')}
              className="px-6 py-2.5 rounded-lg font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              <span>{processing ? 'Menyimpan...' : 'Simpan Instansi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

Create.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
