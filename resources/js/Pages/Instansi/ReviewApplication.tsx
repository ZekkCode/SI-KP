import InstansiLayout from '@/Layouts/InstansiLayout';
import React, { useState } from 'react';
import { 
  ChevronRight, 
  Calendar, 
  FileText, 
  Download, 
  Upload, 
  CheckCircle, 
  XCircle,
  Mail,
  Phone,
  User,
  GraduationCap,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export default function ReviewApplication() {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const onConfirm = () => {
    setStatus('accepted');
    alert('Penerimaan mahasiswa berhasil dikonfirmasi!');
  };

  const onReject = () => {
    const reason = prompt('Masukkan alasan penolakan:');
    if (reason !== null) {
      setStatus('rejected');
      alert('Pengajuan mahasiswa ditolak.');
    }
  };

  return (
    <main className="flex-1 min-h-screen p-6 md:p-8 w-full max-w-[1200px] mx-auto space-y-8 bg-[#f8fafc]">
      {/* Breadcrumbs & Header */}
      <div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>Penempatan</span>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-600 font-semibold">Review Pengajuan</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Konfirmasi Penerimaan Kerja Praktek</h1>
        <p className="text-slate-500 mt-2 text-sm max-w-3xl leading-relaxed">
          Tinjau data akademik, portofolio, dan proposal mahasiswa sebelum melakukan konfirmasi penempatan kerja praktek di perusahaan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Student Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Applicant Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Initials Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-3xl shadow-sm shrink-0">
                BS
              </div>
              <div className="flex-grow w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 w-full">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Budi Santoso</h3>
                    <p className="text-sm font-semibold text-indigo-600 mt-1 flex items-center gap-1.5">
                      <GraduationCap size={16} />
                      Teknik Informatika (S1)
                    </p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {status === 'accepted' && 'Diterima'}
                      {status === 'rejected' && 'Ditolak'}
                      {status === 'pending' && 'Menunggu Konfirmasi'}
                    </span>
                  </div>
                </div>
                
                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-6 pt-6 border-t border-slate-100 text-sm">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">NIM / Student ID</span>
                    <p className="font-bold text-slate-700">13519001</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Universitas</span>
                    <p className="font-bold text-slate-700">Universitas Trunojoyo Madura</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Akademik</span>
                    <p className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Mail size={14} className="text-indigo-500" />
                      budi.santoso@student.utm.ac.id
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">No. Handphone</span>
                    <p className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Phone size={14} className="text-indigo-500" />
                      +62 812-3456-7890
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Internship Details Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Calendar className="text-indigo-600" size={20} />
              Rencana Pelaksanaan Kerja Praktek
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase block mb-1">Durasi Kerja Praktek</span>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-extrabold text-slate-800">3 Bulan</p>
                  <span className="text-slate-300">•</span>
                  <p className="text-sm font-semibold text-slate-500">Full-time (WFO)</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase block mb-1">Rentang Tanggal Pengajuan</span>
                <p className="text-lg font-extrabold text-slate-800">1 Sep 2024 - 30 Nov 2024</p>
              </div>
            </div>
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Fokus Minat & Peran</span>
              <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Briefcase size={16} className="text-indigo-500" />
                Software Engineering (Backend Development), Cloud Infrastructure
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Documents & Actions */}
        <div className="space-y-6">
          {/* Document Preview Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="text-indigo-600" size={20} />
              Berkas Pengajuan Mahasiswa
            </h4>
            <div className="space-y-3">
              <a href="#" className="flex items-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mr-3 shrink-0">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate">Resume_Budi_Santoso.pdf</p>
                  <p className="text-[10px] text-slate-400 font-semibold">1.2 MB | PDF Dokumen</p>
                </div>
                <Download className="text-slate-400 group-hover:text-indigo-600 transition-colors" size={18} />
              </a>
              
              <a href="#" className="flex items-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mr-3 shrink-0">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate">Proposal_KP_Budi.pdf</p>
                  <p className="text-[10px] text-slate-400 font-semibold">2.4 MB | PDF Dokumen</p>
                </div>
                <Download className="text-slate-400 group-hover:text-indigo-600 transition-colors" size={18} />
              </a>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h4 className="text-lg font-bold text-slate-800">Keputusan Penempatan</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Konfirmasi penerimaan mahasiswa ini akan mengubah statusnya menjadi 'Aktif' saat masa magang dimulai dan membuka modul logbook.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Unggah Surat Balasan / LoA (Opsional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 hover:border-indigo-500 transition-colors cursor-pointer group">
                <Upload className="mx-auto text-slate-400 group-hover:text-indigo-600 mb-2" size={24} />
                <p className="text-xs font-semibold text-slate-500 group-hover:text-indigo-600">Pilih atau Seret file LoA</p>
                <p className="text-[10px] text-slate-400 mt-1">PDF maksimal 5MB</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              {status === 'pending' && (
                <>
                  <button 
                    onClick={onConfirm} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm"
                  >
                    <CheckCircle size={16} />
                    Konfirmasi Penerimaan
                  </button>
                  <button 
                    onClick={onReject}
                    className="w-full bg-white text-red-600 hover:bg-red-50 text-xs font-bold py-3 px-4 rounded-xl border border-red-200 hover:border-red-300 transition-colors flex justify-center items-center gap-2"
                  >
                    <XCircle size={16} />
                    Tolak Pengajuan
                  </button>
                </>
              )}
              {status !== 'pending' && (
                <button 
                  onClick={() => setStatus('pending')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2"
                >
                  Reset Keputusan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

ReviewApplication.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
