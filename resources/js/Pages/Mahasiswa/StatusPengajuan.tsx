import { usePage } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React from 'react';
import { AlertTriangle, UploadCloud, MessageSquare, History, CheckCircle, Clock } from 'lucide-react';

const statusText: Record<string, string> = {
    draft: "Draft",
    diajukan: "Menunggu Verifikasi",
    verifikasi_tu: "Sedang Diverifikasi TU",
    perlu_perbaikan: "Perlu Perbaikan",
    disetujui_tu: "Disetujui TU",
    surat_terbit: "Surat Pengantar Terbit",
    diterima_instansi: "Diterima Instansi",
    aktif: "Kerja Praktik Berlangsung",
    selesai: "Selesai",
};

export default function StatusPengajuan() {
  const { pendaftaran } = usePage().props as any;
  if (!pendaftaran) {
    return (
        <div className="p-6">
            <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-6">
                <h2 className="text-xl font-bold">
                    Belum Ada Pengajuan
                </h2>

                <p className="mt-2">
                    Anda belum melakukan pengajuan Kerja Praktik.
                </p>
            </div>
        </div>
    );
}
  return (
    <div className="flex-1 p-6 max-w-[1280px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-headline-md text-on-surface mb-2">Status Pengajuan KP</h1>
        <div className="mt-3 space-y-1">
          <p className="text-body-md">
            <b>Instansi :</b> {pendaftaran.instansi?.nama ?? "-"}
          </p>
          <p className="text-body-md">
            <b>Dosen Pembimbing :</b> {pendaftaran.dosenPembimbing?.name ?? "-"} 
          </p>
        </div>
        <p className="text-body-md text-secondary">Pantau riwayat pergerakan dan status verifikasi dokumen pendaftaran Kerja Praktik Anda.</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Status Alert Card */}
        <div className="col-span-12">
          <div className="bg-white border-2 border-error-container rounded-xl p-6 flex items-start gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-error"></div>
            <div className="bg-error-container text-error p-3 rounded-full flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-title-lg text-error font-bold">{statusText[pendaftaran.status] ?? pendaftaran.status}</h4>
                <span className="px-4 py-1 bg-error-container text-error text-label-sm font-bold rounded-full uppercase tracking-wider">{statusText[pendaftaran.status] ?? pendaftaran.status}</span>
              </div>
              <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/30">
                <p className="text-label-md text-on-surface mb-1">Catatan Admin Tata Usaha:</p>
                <p className="text-body-md text-secondary">{pendaftaran.catatan_tu ?? "Belum ada catatan dari Tata Usaha."}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {pendaftaran.status === "perlu_perbaikan" && (

                <button className="bg-primary text-white px-6 py-2 rounded-lg text-label-md font-bold flex items-center gap-2">
                <UploadCloud className="w-5 h-5"/>

                Re-upload Dokumen

                </button>
                )}
                <button className="bg-secondary-container text-on-secondary-container px-6 py-2 rounded-lg text-label-md font-bold flex items-center gap-2 hover:bg-outline-variant/20 transition-all">
                  <MessageSquare className="w-5 h-5" />
                  Hubungi Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="col-span-12">
          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
              <h4 className="text-label-md text-on-surface-variant flex items-center gap-2 uppercase tracking-widest">
                <History className="w-5 h-5 text-primary" />
                Riwayat Pergerakan Dokumen
              </h4>
              <div className="text-label-sm text-secondary hidden sm:block">
                Terakhir diperbarui: {new Date(pendaftaran.updated_at).toLocaleString("id-ID")}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-6 py-4 text-label-sm text-secondary border-b border-outline-variant">TANGGAL</th>
                    <th className="px-6 py-4 text-label-sm text-secondary border-b border-outline-variant">AKTIVITAS</th>
                    <th className="px-6 py-4 text-label-sm text-secondary border-b border-outline-variant">STATUS</th>
                    <th className="px-6 py-4 text-label-sm text-secondary border-b border-outline-variant">CATATAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-body-md font-bold text-on-surface">{new Date(pendaftaran.created_at).toLocaleDateString("id-ID")}</span>
                        <span className="text-label-sm text-secondary">{new Date(pendaftaran.created_at).toLocaleTimeString("id-ID")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-body-md font-medium text-on-surface">Status Pengajuan</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-error-container text-error rounded-full text-label-sm font-bold">
                        <span className="w-2 h-2 rounded-full bg-error"></span>
                        {statusText[pendaftaran.status] ?? pendaftaran.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-body-sm text-on-surface-variant max-w-xs line-clamp-2 italic">{pendaftaran.catatan_tu ?? "-"}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between">
              <span className="text-label-sm text-secondary">Menampilkan data pengajuan terbaru</span>
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container disabled:opacity-30" disabled>
                  &lt;
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container disabled:opacity-30" disabled>
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

StatusPengajuan.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
