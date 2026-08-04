import TULayout from '@/Layouts/TULayout';
import { CheckCircle, Undo2, FileIcon, Eye, Search } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Props {
    pendaftarans: any[];
}

interface Props{
    pendaftarans:any[];
}

export default function Verifikasi({
    pendaftarans
}:Props){
  const [showFeedback, setShowFeedback] = useState(false);

  const data = pendaftarans[0];

  const approve = () => {
      router.post(`/tu/verifikasi/${data.id}/approve`);
  };

  const revisi = (catatan: string) => {
      router.post(`/tu/verifikasi/${data.id}/revisi`, {
          catatan_tu: catatan,
      });
  };

  if (!data) {
      return (
          <div className="p-10">
              <h1 className="text-2xl font-bold">
                  Tidak ada pengajuan yang menunggu verifikasi.
              </h1>
          </div>
      );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface mb-2">Verifikasi Pendaftaran KP</h1>
          <p className="text-on-surface-variant">Tinjau kelengkapan berkas dan data pendaftaran mahasiswa sebelum menyetujui pengajuan.</p>
        </div>
        <div>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-secondary-container text-on-secondary-container">
            <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
            Menunggu Verifikasi
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
            <h2 className="text-xl font-display font-semibold text-on-surface mb-6 border-b border-surface-variant pb-3">Informasi Mahasiswa</h2>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-24 h-24 rounded-lg bg-surface-container-high overflow-hidden shrink-0 border border-outline-variant shadow-sm">
                <img 
                  alt="Student Profile Photo" 
                  className="object-cover w-full h-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBRlzGU-GrW16vOx67zzi0ZeF5bRRHaTE2tYtCIs_hUt6n2exXoI44QdeTrpAISq97RGZnzVwyguA-AuD5gT2BuUEuXQmdqPIi9TQOLtWcZb9RumQIfavEYFTp6rrRn4iE7X8hZG1NPB2u_3FEae_Md6P_WqApG5jKgsnZ7gmcyeoa8MYNEKs2f1CJieZFI0n1MSjHIMg9svpw3Rl0cAVL6jDOnZ2tW-dqkV1ibiO3fM3rU07RHW5ckZj60Tox5iEX_YXawa-xMgE"
                />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Nama Lengkap</label>
                <div className="text-base text-on-surface font-medium">{pendaftarans[0]?.mahasiswa?.name}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">NIM</label>
                <div className="text-base text-on-surface font-medium">{pendaftarans[0]?.mahasiswa?.nim}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Program Studi</label>
                <div className="text-base text-on-surface font-medium">{pendaftarans[0]?.mahasiswa?.program_studi}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Total SKS Lulus</label>
                <div className="text-base text-on-surface font-medium">{pendaftarans[0]?.mahasiswa?.total_sks} SKS</div>
              </div>
                <div className="md:col-span-2 mt-2">
                  <label className="block text-xs font-medium text-on-surface-variant mb-2">Rencana Tempat KP</label>
                  <div className="text-sm text-on-surface bg-surface-container-low p-4 rounded-lg border border-surface-variant">
                    <strong className="block text-base mb-1">{pendaftarans[0]?.instansi?.nama}</strong>
                    {pendaftarans[0]?.instansi?.alamat}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
            <h2 className="text-xl font-display font-semibold text-on-surface mb-6 border-b border-surface-variant pb-3">Dokumen Pendukung</h2>
            <div className="space-y-4">
              {[
                { name: 'Kartu Rencana Studi (KRS) Semester Berjalan.pdf', date: '12 Okt 2023, 10:23 WIB', size: '1.2 MB' },
                { name: 'Transkrip Nilai Akademik Terakhir.pdf', date: '12 Okt 2023, 10:25 WIB', size: '2.4 MB' }
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded bg-error-container text-error flex items-center justify-center shrink-0">
                      <FileIcon size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-on-surface">{doc.name}</div>
                      <div className="text-xs text-on-surface-variant">Diunggah pada {doc.date} • {doc.size}</div>
                    </div>
                  </div>
                  <button className="text-primary hover:bg-primary-container/20 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                    <Eye size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 border border-surface-variant rounded-lg bg-surface-container-lowest h-64 flex flex-col items-center justify-center text-on-surface-variant relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtgSb7n-BOOXhqdRz_6nohM5CjnyFB1o4CO1NfuYS2iFGkjWgaujiW2zCpmkMcissUXr9HLGS_pjdPld_ZVaakbsbT977cq8qHZ4YnQSn4ylxufqC3FdVAmjIYXd2_juppyB-oQIQKdQrmIP8zQwkyJSZLhUL4jJXBUKNAx9tKx27AwqvkfxFO-kwzW_fLXQher1YvZxJ4Gt8J1WAai2trcIIR4cW_fWRDWY36095sXKidZKcj8cqWsHu6vRe9mQg_dOkl5ieYxsw')" }}></div>
              <Search size={48} className="mb-4 opacity-50 relative z-10" />
              <p className="text-sm relative z-10 text-center font-medium">Pilih dokumen di atas untuk mempratinjau<br/><span className="text-xs font-normal">Sistem akan menampilkan pratinjau dokumen di area ini</span></p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-display font-semibold text-on-surface mb-6 border-b border-surface-variant pb-3">Tindakan Verifikasi</h2>
            <p className="text-sm text-on-surface-variant mb-6">Pastikan semua dokumen valid dan memenuhi syarat SKS minimal (100 SKS) sebelum menyetujui.</p>
            
            <div className="space-y-4">
              <button
              onClick={()=>{router.post('/tu/verifikasi/'+pendaftarans[0].id+'/approve')}} className="w-full bg-primary text-white hover:bg-primary/90 py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
              >
                <span>Verifikasi & Setuju</span>
              </button>
              <button 
                onClick={() => setShowFeedback(true)}
                className={`w-full border py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2
                  ${showFeedback ? 'bg-surface-container border-outline-variant text-on-surface-variant' : 'border-secondary text-secondary hover:bg-surface-container-low'}
                `}
              >
                <Undo2 size={20} />
                <span>Kembalikan untuk Perbaikan</span>
              </button>
            </div>

            {showFeedback && (
              <div className="mt-6 pt-6 border-t border-surface-variant animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="block text-sm font-semibold text-on-surface mb-2">Catatan Perbaikan <span className="text-error">*</span></label>
                <textarea 
                  className="w-full border border-outline-variant rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant" 
                  placeholder="Tuliskan alasan pengembalian berkas secara spesifik..." 
                  rows={4}
                  autoFocus
                ></textarea>
                <div className="mt-4 flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowFeedback(false)}
                    className="px-4 py-2 text-secondary hover:bg-surface-container-low rounded-lg text-sm font-medium transition-colors"
                  >
                    Batal
                  </button>
                  <button
                  onClick={()=>{router.post('/tu/verifikasi/'+pendaftarans[0].id+'/reject',{catatan_tu:"Silakan lengkapi berkas."})}} className="px-4 py-2 bg-error text-white hover:bg-error/90 rounded-lg text-sm font-bold"
                  >
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Verifikasi.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;
