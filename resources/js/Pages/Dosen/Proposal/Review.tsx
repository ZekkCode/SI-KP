import DosenLayout from '@/Layouts/DosenLayout';
import { useForm, Link } from '@inertiajs/react';
import { Download, CheckCircle2, Edit3, ChevronLeft, FileText } from 'lucide-react';
import { FormEvent } from 'react';

interface Mahasiswa {
  name: string;
  nim: string;
}

interface Pendaftaran {
  mahasiswa: Mahasiswa;
}

interface Proposal {
  id: number;
  judul: string;
  abstrak: string | null;
  path_file: string | null;
  status: string;
  submitted_at: string | null;
  pendaftaran: Pendaftaran;
}

interface Props {
  proposal: Proposal;
}

export default function ReviewProposalDetail({ proposal }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    status: '',
    catatan: '',
  });

  const submitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!data.status) return;

    put(route('dosen.review.update', proposal.id));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Link 
          href={route('dosen.review')} 
          className="p-2 bg-surface-container hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-semibold text-on-surface">Review Proposal Mahasiswa</h1>
          <p className="text-sm text-on-surface-variant mt-1">Berikan evaluasi untuk proposal yang diajukan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Informasi Proposal */}
        <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden p-6">
          <h2 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            Detail Dokumen
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Nama Mahasiswa</div>
              <div className="text-base font-medium text-on-surface">{proposal.pendaftaran.mahasiswa.name}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">NIM</div>
              <div className="text-base font-medium text-on-surface">{proposal.pendaftaran.mahasiswa.nim}</div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Judul Proposal</div>
            <div className="text-base font-semibold text-on-surface">{proposal.judul}</div>
          </div>

          {proposal.abstrak && (
            <div className="mb-6">
              <div className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Abstrak / Deskripsi Singkat</div>
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{proposal.abstrak}</p>
            </div>
          )}
          
          {proposal.path_file && (
            <div className="mt-2">
              <a 
                href={`/storage/${proposal.path_file}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-semibold transition-all"
              >
                <Download size={18} />
                Unduh PDF Proposal
              </a>
            </div>
          )}
        </div>

        {/* Form Review */}
        <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden p-6">
          <h2 className="text-lg font-semibold text-on-surface mb-4">Formulir Penilaian</h2>
          
          <form onSubmit={submitReview} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-3">
                Keputusan Review <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="relative cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    value="disetujui" 
                    className="peer sr-only"
                    checked={data.status === 'disetujui'}
                    onChange={(e) => setData('status', e.target.value)}
                  />
                  <div className="p-4 text-center rounded-xl border-2 border-outline-variant hover:bg-surface-container peer-checked:border-primary peer-checked:bg-primary-container peer-checked:text-on-primary-container transition-all flex items-center justify-center gap-2 shadow-sm">
                    <CheckCircle2 size={20} className={data.status === 'disetujui' ? 'text-primary' : 'text-outline'} />
                    <span className="font-semibold">Disetujui</span>
                  </div>
                </label>
                <label className="relative cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    value="revisi" 
                    className="peer sr-only"
                    checked={data.status === 'revisi'}
                    onChange={(e) => setData('status', e.target.value)}
                  />
                  <div className="p-4 text-center rounded-xl border-2 border-outline-variant hover:bg-surface-container peer-checked:border-tertiary peer-checked:bg-tertiary-container peer-checked:text-on-tertiary-container transition-all flex items-center justify-center gap-2 shadow-sm">
                    <Edit3 size={20} className={data.status === 'revisi' ? 'text-tertiary' : 'text-outline'} />
                    <span className="font-semibold">Perlu Revisi</span>
                  </div>
                </label>
              </div>
              {errors.status && <p className="text-error text-sm mt-2">{errors.status}</p>}
            </div>

            <div>
              <label htmlFor="catatan" className="block text-sm font-medium text-on-surface mb-2">
                Catatan & Feedback <span className="text-error">*</span>
              </label>
              <textarea
                id="catatan"
                rows={5}
                value={data.catatan}
                onChange={(e) => setData('catatan', e.target.value)}
                placeholder="Berikan masukan, perbaikan, atau catatan persetujuan untuk mahasiswa..."
                className="w-full p-4 bg-surface border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y shadow-sm"
              ></textarea>
              {errors.catatan && <p className="text-error text-sm mt-2">{errors.catatan}</p>}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={processing || !data.status || !data.catatan}
                className="px-6 py-3 bg-primary text-on-primary text-sm font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
              >
                {processing ? 'Menyimpan...' : 'Kirim Penilaian'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

ReviewProposalDetail.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
