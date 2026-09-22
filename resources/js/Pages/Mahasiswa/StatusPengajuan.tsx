import { usePage } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React from 'react';
import { AlertTriangle, UploadCloud, MessageSquare, History, CheckCircle, Clock } from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

const statusText: Record<string, string> = {
    draft: "Draft",
    diajukan: "Menunggu Verifikasi",
    verifikasi_tu: "Sedang Diverifikasi Admin Akademik/Prodi",
    perlu_perbaikan: "Perlu Perbaikan",
    disetujui_tu: "Disetujui Admin Akademik/Prodi",
    surat_terbit: "Surat Pengantar Terbit",
    diterima_instansi: "Diterima Instansi",
    plotting_dosen: "Menunggu Plotting Dosen Pembimbing",
    aktif: "Kerja Praktik Berlangsung",
    selesai: "Selesai",
};

const getStatusColor = (status: string) => {
    if (['perlu_perbaikan', 'ditolak_instansi'].includes(status)) return { bg: 'bg-red-100', text: 'text-red-600', border: 'bg-red-600', container: 'border-red-200' };
    if (['draft', 'diajukan', 'verifikasi_tu', 'verifikasi_surat_balasan', 'plotting_dosen'].includes(status)) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'bg-yellow-500', container: 'border-yellow-300' };
    if (['disetujui_tu', 'surat_terbit', 'aktif', 'diterima_instansi'].includes(status)) return { bg: 'bg-green-100', text: 'text-green-700', border: 'bg-green-600', container: 'border-green-200' };
    if (status === 'selesai') return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'bg-blue-600', container: 'border-blue-200' };
    return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'bg-gray-500', container: 'border-gray-200' };
};

export default function StatusPengajuan() {
  const { pendaftaran } = usePage().props as any;

  if (!pendaftaran) {
    return (
        <div className="flex-1 p-4 sm:p-6 max-w-[800px] mx-auto w-full">
            <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center shadow-xs">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-base font-bold text-slate-900 mb-1">Belum Ada Pengajuan KP</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                    Anda belum mengajukan pendaftaran Kerja Praktik pada periode aktif.
                </p>
                <a
                    href="/mahasiswa/pendaftaran"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition"
                >
                    <span>Mulai Pendaftaran &rarr;</span>
                </a>
            </div>
        </div>
    );
  }

  const currentStatus = getStatusColor(pendaftaran.status);

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-[1280px] mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <Clock className="w-3.5 h-3.5" />
            Monitoring Status
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Status Pengajuan KP</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau proses verifikasi dokumen pendaftaran Kerja Praktik Anda.</p>
        </div>
        <div className="text-right hidden sm:block bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <p className="text-xs text-slate-600">
            <span className="font-semibold text-slate-400 uppercase text-[10px] block">Instansi Tujuan:</span>
            <strong className="text-slate-900">{pendaftaran.instansi?.nama ?? pendaftaran.nama_instansi ?? "Belum Ditentukan"}</strong>
          </p>
          <p className="text-xs text-slate-600 mt-1">
            <span className="font-semibold text-slate-400 uppercase text-[10px] block">Dosen Pembimbing:</span>
            <strong className="text-slate-900">{pendaftaran.dosenPembimbing?.name ?? "Belum Diplot"}</strong>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Status Alert Card */}
        <div className={`bg-white border ${currentStatus.container} rounded-xl p-5 sm:p-6 shadow-xs relative overflow-hidden`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-lg ${currentStatus.bg} ${currentStatus.text} flex items-center justify-center shrink-0 border`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Status Saat Ini</span>
                  <h3 className={`text-lg font-bold ${currentStatus.text}`}>{statusText[pendaftaran.status] ?? pendaftaran.status}</h3>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${currentStatus.bg} ${currentStatus.text} text-xs font-bold rounded-md border uppercase tracking-wider w-fit`}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  {statusText[pendaftaran.status] ?? pendaftaran.status}
                </span>
              </div>
              
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Catatan Verifikator Akademik/Prodi:</p>
                <p className="text-sm text-slate-700">{pendaftaran.catatan_tu ?? "Belum ada catatan khusus. Berkas Anda sedang diproses sesuai antrean."}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {pendaftaran.status === "perlu_perbaikan" && (
                  <a href="/mahasiswa/pendaftaran" className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer">
                    <UploadCloud className="w-4 h-4"/>
                    <span>Perbaiki Berkas Pendaftaran</span>
                  </a>
                )}
                <a href="/panduan" className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <span>Lihat Panduan SOP</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70 flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
              <History className="w-4 h-4 text-blue-700" />
              Riwayat Pergerakan Berkas
            </h4>
            <span className="text-xs text-slate-500 hidden sm:block">
              Pembaruan Terakhir: {new Date(pendaftaran.updated_at).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="overflow-x-auto">
            <ModernTable>
              <ModernTableHeader>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <ModernTableTh>Waktu</ModernTableTh>
                  <ModernTableTh>Aktivitas</ModernTableTh>
                  <ModernTableTh>Status</ModernTableTh>
                  <ModernTableTh>Catatan</ModernTableTh>
                </tr>
              </ModernTableHeader>
              <ModernTableBody>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <ModernTableTd>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{new Date(pendaftaran.created_at).toLocaleDateString("id-ID")}</span>
                      <span className="text-xs text-slate-500">{new Date(pendaftaran.created_at).toLocaleTimeString("id-ID")} WIB</span>
                    </div>
                  </ModernTableTd>
                  <ModernTableTd>
                    <p className="text-sm font-medium text-slate-900">Pengajuan Berkas Pendaftaran</p>
                  </ModernTableTd>
                  <ModernTableTd>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 ${currentStatus.bg} ${currentStatus.text} rounded-md text-xs font-semibold border`}>
                      {statusText[pendaftaran.status] ?? pendaftaran.status}
                    </span>
                  </ModernTableTd>
                  <ModernTableTd>
                    <p className="text-xs text-slate-600 max-w-xs line-clamp-2">{pendaftaran.catatan_tu ?? "Pengajuan awal mahasiswa."}</p>
                  </ModernTableTd>
                </tr>
              </ModernTableBody>
            </ModernTable>
          </div>
        </div>
      </div>
    </div>
  );
}

StatusPengajuan.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
