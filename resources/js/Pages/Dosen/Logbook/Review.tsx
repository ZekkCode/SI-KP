import DosenLayout from '@/Layouts/DosenLayout';
import { useForm, Link } from '@inertiajs/react';
import { CheckCircle2, Edit3, ChevronLeft, Clock, Image as ImageIcon, FileText } from 'lucide-react';
import { FormEvent } from 'react';

interface Mahasiswa {
  name: string;
  nim: string;
}

interface Pendaftaran {
  mahasiswa: Mahasiswa;
}

interface LogbookEntry {
  id: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  deskripsi: string;
  path_foto: string | null;
  status_dosen: string;
  catatan_dosen: string | null;
  pendaftaran: Pendaftaran;
}

interface Props {
  logbook: LogbookEntry;
}

export default function ReviewLogbookDetail({ logbook }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    status_dosen: logbook.status_dosen === 'menunggu' ? '' : logbook.status_dosen,
    catatan_dosen: logbook.catatan_dosen || '',
  });

  const submitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!data.status_dosen) return;

    put(route('dosen.logbook.update', logbook.id));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Link 
          href={route('dosen.logbook')} 
          className="p-2 bg-surface-container hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-semibold text-on-surface">Validasi Kegiatan Harian</h1>
          <p className="text-sm text-on-surface-variant mt-1">Berikan validasi untuk logbook kegiatan mahasiswa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informasi Logbook */}
        <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-on-surface">Detail Kegiatan</h2>
          </div>
          
          <div>
            <div className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Nama Mahasiswa</div>
            <div className="text-base font-medium text-on-surface">{logbook.pendaftaran.mahasiswa.name} ({logbook.pendaftaran.mahasiswa.nim})</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Tanggal</div>
              <div className="text-sm font-medium text-on-surface">
                {new Date(logbook.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Waktu Kegiatan</div>
              <div className="text-sm font-medium text-on-surface">
                {logbook.jam_mulai?.substring(0, 5)} - {logbook.jam_selesai?.substring(0, 5)}
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Deskripsi Kegiatan</div>
            <div className="text-sm text-on-surface whitespace-pre-wrap bg-surface p-4 rounded-xl border border-outline-variant">{logbook.deskripsi}</div>
          </div>

          {logbook.path_foto && (
            <div>
              <div className="text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-wider">Bukti Foto Kegiatan</div>
              <div className="rounded-xl overflow-hidden border border-outline-variant bg-surface-container aspect-video flex items-center justify-center shadow-sm">
                <img 
                  src={`/storage/${logbook.path_foto}`} 
                  alt="Bukti kegiatan" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Foto+Tidak+Ditemukan';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Form Review */}
        <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden p-6 flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-on-surface mb-2">Formulir Validasi</h2>
          
          <form onSubmit={submitReview} className="space-y-6 flex-1 flex flex-col">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-3">
                Keputusan Validasi <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-1 gap-4">
                <label className="relative cursor-pointer">
                  <input 
                    type="radio" 
                    name="status_dosen" 
                    value="menunggu" 
                    className="peer sr-only"
                    checked={data.status_dosen === 'menunggu'}
                    onChange={(e) => setData('status_dosen', e.target.value)}
                  />
                  <div className="p-4 text-center rounded-xl border-2 border-outline-variant hover:bg-surface-container peer-checked:border-warning peer-checked:bg-warning-container peer-checked:text-on-warning-container transition-all flex items-center justify-center gap-2 shadow-sm">
                    <Clock size={20} className={data.status_dosen === 'menunggu' ? 'text-warning' : 'text-outline'} />
                    <span className="font-semibold">Menunggu</span>
                  </div>
                </label>
                <label className="relative cursor-pointer">
                  <input 
                    type="radio" 
                    name="status_dosen" 
                    value="disetujui" 
                    className="peer sr-only"
                    checked={data.status_dosen === 'disetujui'}
                    onChange={(e) => setData('status_dosen', e.target.value)}
                  />
                  <div className="p-4 text-center rounded-xl border-2 border-outline-variant hover:bg-surface-container peer-checked:border-primary peer-checked:bg-primary-container peer-checked:text-on-primary-container transition-all flex items-center justify-center gap-2 shadow-sm">
                    <CheckCircle2 size={20} className={data.status_dosen === 'disetujui' ? 'text-primary' : 'text-outline'} />
                    <span className="font-semibold">Sudah Disetujui</span>
                  </div>
                </label>
                <label className="relative cursor-pointer">
                  <input 
                    type="radio" 
                    name="status_dosen" 
                    value="revisi" 
                    className="peer sr-only"
                    checked={data.status_dosen === 'revisi'}
                    onChange={(e) => setData('status_dosen', e.target.value)}
                  />
                  <div className="p-4 text-center rounded-xl border-2 border-outline-variant hover:bg-surface-container peer-checked:border-tertiary peer-checked:bg-tertiary-container peer-checked:text-on-tertiary-container transition-all flex items-center justify-center gap-2 shadow-sm">
                    <Edit3 size={20} className={data.status_dosen === 'revisi' ? 'text-tertiary' : 'text-outline'} />
                    <span className="font-semibold">Belum Disetujui / Revisi</span>
                  </div>
                </label>
              </div>
              {errors.status_dosen && <p className="text-error text-sm mt-2">{errors.status_dosen}</p>}
            </div>

            <div className="flex-1">
              <label htmlFor="catatan_dosen" className="block text-sm font-medium text-on-surface mb-2">
                Catatan Dosen (Opsional)
              </label>
              <textarea
                id="catatan_dosen"
                rows={5}
                value={data.catatan_dosen}
                onChange={(e) => setData('catatan_dosen', e.target.value)}
                placeholder="Berikan masukan, perbaikan, atau catatan untuk mahasiswa..."
                className="w-full p-4 bg-surface border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y shadow-sm h-32"
              ></textarea>
              {errors.catatan_dosen && <p className="text-error text-sm mt-2">{errors.catatan_dosen}</p>}
            </div>

            <div className="flex justify-end pt-2 mt-auto">
              <button
                type="submit"
                disabled={processing || !data.status_dosen}
                className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary text-sm font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
              >
                {processing ? 'Menyimpan...' : 'Simpan Penilaian'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

ReviewLogbookDetail.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
