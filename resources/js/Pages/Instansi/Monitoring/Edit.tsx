import InstansiLayout from '@/Layouts/InstansiLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, FileText, CheckCircle2, XCircle } from 'lucide-react';
import React from 'react';

interface Mahasiswa {
  name: string;
  nim: string;
}

interface Logbook {
  id: number;
  mahasiswa: Mahasiswa;
  tanggal: string;
  jam_mulai: string | null;
  jam_selesai: string | null;
  deskripsi: string;
  path_foto: string | null;
  status_instansi: string;
  catatan_instansi: string | null;
}

interface Props {
  logbook: Logbook;
}

export default function Edit({ logbook }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    status_instansi: logbook.status_instansi === 'menunggu' ? 'disetujui' : logbook.status_instansi,
    catatan_instansi: logbook.catatan_instansi || '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('instansi.logbook.update', logbook.id));
  };

  return (
    <div className="animate-in fade-in duration-300 p-4 md:p-8">
      <Head title="Validasi Logbook" />
      
      {/* Header */}
      <div className="mb-8">
        <Link 
          href={route('instansi.logbook')}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Daftar Logbook</span>
        </Link>
        <h1 className="text-3xl font-display font-semibold text-on-surface mb-2">
          Validasi Kegiatan Mahasiswa
        </h1>
        <p className="text-on-surface-variant mt-2">Detail kegiatan harian mahasiswa dan form validasi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detail Kegiatan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              Detail Laporan Kegiatan
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-on-surface-variant mb-1">Mahasiswa</p>
                  <p className="font-medium text-on-surface">{logbook.mahasiswa?.name}</p>
                  <p className="text-sm text-on-surface-variant">{logbook.mahasiswa?.nim}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface-variant mb-1">Tanggal</p>
                  <p className="font-medium text-on-surface">{logbook.tanggal}</p>
                  <p className="text-sm text-on-surface-variant">
                    {logbook.jam_mulai && logbook.jam_selesai ? `${logbook.jam_mulai} - ${logbook.jam_selesai}` : 'Waktu tidak diset'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-on-surface-variant mb-2">Deskripsi Kegiatan</p>
                <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant whitespace-pre-wrap text-sm text-on-surface leading-relaxed">
                  {logbook.deskripsi}
                </div>
              </div>

              {logbook.path_foto && (
                <div>
                  <p className="text-sm font-medium text-on-surface-variant mb-2">Lampiran Foto/Dokumen</p>
                  <a 
                    href={`/storage/${logbook.path_foto}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-block rounded-lg overflow-hidden border border-outline-variant hover:opacity-90 transition-opacity"
                  >
                    <img 
                      src={`/storage/${logbook.path_foto}`} 
                      alt="Lampiran" 
                      className="max-h-64 object-contain bg-surface-container-low"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Validasi */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden sticky top-8">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant">
              <h3 className="font-semibold text-on-surface">Form Validasi</h3>
            </div>
            
            <form onSubmit={submit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-3">
                  Status Validasi Instansi
                </label>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                    data.status_instansi === 'disetujui' 
                      ? 'border-green-500 bg-green-50 ring-1 ring-green-500' 
                      : 'border-outline-variant hover:bg-surface-container-lowest'
                  }`}>
                    <input
                      type="radio"
                      name="status_instansi"
                      value="disetujui"
                      checked={data.status_instansi === 'disetujui'}
                      onChange={(e) => setData('status_instansi', e.target.value)}
                      className="text-green-600 focus:ring-green-500 w-4 h-4 mt-0.5"
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-green-900 flex items-center gap-1.5">
                        <CheckCircle2 size={16} /> Disetujui
                      </span>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                    data.status_instansi === 'revisi' 
                      ? 'border-error bg-error/5 ring-1 ring-error' 
                      : 'border-outline-variant hover:bg-surface-container-lowest'
                  }`}>
                    <input
                      type="radio"
                      name="status_instansi"
                      value="revisi"
                      checked={data.status_instansi === 'revisi'}
                      onChange={(e) => setData('status_instansi', e.target.value)}
                      className="text-error focus:ring-error w-4 h-4 mt-0.5"
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-error flex items-center gap-1.5">
                        <XCircle size={16} /> Revisi / Ditolak
                      </span>
                    </div>
                  </label>
                </div>
                {errors.status_instansi && (
                  <p className="mt-2 text-sm text-error">{errors.status_instansi}</p>
                )}
              </div>

              <div>
                <label htmlFor="catatan_instansi" className="block text-sm font-medium text-on-surface mb-2">
                  Catatan Pembimbing (Opsional)
                </label>
                <textarea
                  id="catatan_instansi"
                  value={data.catatan_instansi}
                  onChange={(e) => setData('catatan_instansi', e.target.value)}
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white min-h-[100px]"
                  placeholder="Berikan catatan, masukan, atau alasan revisi..."
                />
                {errors.catatan_instansi && (
                  <p className="mt-2 text-sm text-error">{errors.catatan_instansi}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{processing ? 'Menyimpan...' : 'Simpan Validasi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

Edit.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
