import TULayout from '@/Layouts/TULayout';
import { ArrowLeft, FileText, ZoomIn, ZoomOut, Download, Edit3, CheckCircle } from 'lucide-react';

export default function ValidasiBerita() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <button 
          onClick={() => onViewChange('dashboard')}
          className="inline-flex items-center text-primary hover:underline text-sm font-medium mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Kembali ke Daftar Berita Acara
        </button>
        <h2 className="text-3xl font-display font-semibold text-on-surface">Validasi Berita Acara Selesai KP</h2>
        <p className="text-secondary mt-2">Mohon periksa kejelasan scan, keberadaan cap basah perusahaan, dan tanda tangan pembimbing lapangan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <div className="flex items-center space-x-2">
              <FileText className="text-secondary" size={20} />
              <span className="text-sm font-semibold">BA_Selesai_Ahmad_Budi_123456789.pdf</span>
            </div>
            <div className="flex space-x-2">
              <button className="p-1.5 rounded hover:bg-surface-container text-secondary transition-colors" title="Zoom In">
                <ZoomIn size={18} />
              </button>
              <button className="p-1.5 rounded hover:bg-surface-container text-secondary transition-colors" title="Zoom Out">
                <ZoomOut size={18} />
              </button>
              <button className="p-1.5 rounded hover:bg-surface-container text-secondary transition-colors" title="Download">
                <Download size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 bg-surface-dim p-4 flex items-center justify-center min-h-[500px] overflow-auto">
            <div className="w-full max-w-2xl bg-white shadow-md p-8 min-h-[700px] border border-outline relative overflow-hidden flex flex-col justify-end">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568227451241-11c5040f7b0f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
                <img alt="Scanned Document Preview" className="w-full h-auto object-contain opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3WHWsrqBcOTzOElvGzLb8V674t7fx-7CTwsuR8IRPEA8zybc_Ikqx4lw4S2bEbS_l1_npRxZ6ncip_J0rmCdjiCDgVweSrwdCptbWc4sa7AIcyNg8Rethki18ONZ2pPlwo_Uzc_cs47-Fanfz9gn2yTx9vb1pbwKgcqnQJOs1aVJL7bUF6jxgXIhREa6iHGFLbsrj0ZCPwqWBYYZQG7c5TGcqo4lmCARMyH4jxBRFuKz6xcgabDW798xkydtyn4D6n4_rZDQGA1U"/>
                <div className="absolute z-10 flex flex-col items-center justify-center p-8 border-4 border-blue-600/30 rounded-full w-48 h-48 rotate-[-15deg] mb-32">
                    <div className="text-blue-800 font-bold text-xl uppercase tracking-widest text-center">Approved</div>
                    <div className="text-blue-600 font-bold text-sm text-center">Fakultas Teknik</div>
                </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-6">
            <h3 className="text-xl font-display font-semibold mb-4 border-b border-outline-variant pb-3">Informasi Mahasiswa</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-medium text-secondary mb-1">Nama</p>
                <p className="font-medium text-on-surface">Ahmad Budi Santoso</p>
              </div>
              <div>
                <p className="text-xs font-medium text-secondary mb-1">NIM</p>
                <p className="font-medium text-on-surface">123456789</p>
              </div>
              <div>
                <p className="text-xs font-medium text-secondary mb-1">Perusahaan</p>
                <p className="font-medium text-on-surface">PT. Teknologi Nusantara Sejahtera</p>
              </div>
              <div>
                <p className="text-xs font-medium text-secondary mb-1">Periode KP</p>
                <p className="font-medium text-on-surface">1 Feb 2024 - 30 Apr 2024</p>
              </div>
              <div>
                <p className="text-xs font-medium text-secondary mb-1">Status Pengajuan</p>
                <span className="inline-flex items-center px-2.5 py-1 mt-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-medium">
                  Menunggu Validasi TU
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-display font-semibold mb-4 border-b border-outline-variant pb-3">Aksi Validasi</h3>
            <div className="flex flex-col flex-1 space-y-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-secondary mb-2" htmlFor="catatan_revisi">
                  Catatan Revisi (Opsional, wajib jika ditolak)
                </label>
                <textarea 
                  id="catatan_revisi"
                  className="w-full rounded-lg border border-outline-variant p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none bg-surface-bright" 
                  placeholder="Contoh: Cap perusahaan kurang jelas, harap scan ulang dengan resolusi lebih tinggi..." 
                  rows={5}
                ></textarea>
              </div>
              <div className="pt-4 border-t border-outline-variant space-y-3">
                <button className="w-full flex justify-center items-center py-3 px-4 border border-error text-error hover:bg-error-container/20 rounded-lg text-sm font-bold transition-colors">
                  <Edit3 size={18} className="mr-2" />
                  Revisi Berita Acara
                </button>
                <button className="w-full flex justify-center items-center py-3 px-4 bg-primary text-white hover:bg-primary/90 rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow-md">
                  <CheckCircle size={18} className="mr-2" />
                  Validasi & Selesaikan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ValidasiBerita.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;
