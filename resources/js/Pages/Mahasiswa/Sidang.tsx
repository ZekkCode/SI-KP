import React, { useState } from 'react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Send, 
  Building2, 
  GraduationCap, 
  FileText, 
  HelpCircle,
  Download,
  BookOpen,
  Layers,
  X,
  ArrowRight
} from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import Modal from '@/Components/Modal';

interface Requirement {
  key: string;
  title: string;
  description: string;
  is_met: boolean;
  details: string;
}

interface Eligibility {
  eligible: boolean;
  missing: string[];
  requirements: Requirement[];
}

interface SidangData {
  id: number;
  status: 'diajukan' | 'dijadwalkan' | 'selesai' | 'dibatalkan';
  tanggal_sidang: string | null;
  tanggal_formatted: string | null;
  ruangan: string | null;
  catatan: string | null;
  created_at: string;
  dosen_penguji: {
    name: string;
    nip: string;
  } | null;
}

interface Props {
  pendaftaran: {
    id: number;
    status: string;
    instansi: {
      nama: string;
      kota: string;
    } | null;
    dosen_pembimbing: {
      name: string;
      nip: string;
    } | null;
  };
  sidang: SidangData | null;
  eligibility: Eligibility;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function SidangScreen({ pendaftaran, sidang, eligibility, flash }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    catatan: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('mahasiswa.sidang.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setIsModalOpen(false);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'dijadwalkan':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Calendar className="w-3.5 h-3.5" />
            Sidang Dijadwalkan
          </span>
        );
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Sidang Selesai
          </span>
        );
      case 'dibatalkan':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Jadwal Prodi
          </span>
        );
    }
  };

  const canApply = !sidang || sidang.status === 'dibatalkan';

  return (
    <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
      <Head title="Pengajuan Sidang Kerja Praktik" />

      <PageHeader
        title="Tahap 8: Sidang Kerja Praktik"
        description="Pusat pendaftaran dan pemantauan jadwal seminar/sidang pertanggungjawaban Kerja Praktik."
      />

      {/* Flash Messages */}
      {flash?.success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm font-medium">{flash.success}</p>
        </div>
      )}

      {flash?.error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <p className="text-sm font-medium">{flash.error}</p>
        </div>
      )}

      {(errors as any)?.error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <p className="text-sm font-medium">{(errors as any).error}</p>
        </div>
      )}

      {/* Info Mahasiswa & Instansi */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lokasi Praktik Kerja</span>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span className="font-bold text-slate-800">{pendaftaran.instansi?.nama || 'Belum diatur'}</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dosen Pembimbing & Penguji</span>
          <div className="flex items-center gap-2 mt-1">
            <GraduationCap className="w-4 h-4 text-blue-700" />
            <span className="font-bold text-slate-800">{pendaftaran.dosen_pembimbing?.name || 'Belum ditentukan'}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Status Sidang</span>
            <div className="mt-1">
              {sidang ? getStatusBadge(sidang.status) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                  Belum Diajukan
                </span>
              )}
            </div>
          </div>

          {canApply && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#00288e] hover:bg-[#002277] text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs active:scale-95 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ajukan Sidang</span>
            </button>
          )}
        </div>
      </div>

      {/* Jadwal Sidang Card (Jika sudah dijadwalkan / diajukan) */}
      {sidang && (
        <div className={`rounded-xl border p-6 shadow-xs ${
          sidang.status === 'dijadwalkan' 
            ? 'bg-blue-50/60 border-blue-200' 
            : sidang.status === 'selesai'
            ? 'bg-emerald-50/60 border-emerald-200'
            : 'bg-amber-50/60 border-amber-200'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-slate-200/60">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {sidang.status === 'dijadwalkan' ? 'Pemberitahuan Jadwal Sidang' : 'Status Pengajuan'}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {sidang.status === 'dijadwalkan' 
                  ? 'Jadwal Sidang Anda Telah Ditetapkan!' 
                  : sidang.status === 'selesai'
                  ? 'Sidang Kerja Praktik Telah Selesai'
                  : 'Pengajuan Sidang Sedang Ditinjau Prodi'}
              </h2>
            </div>
            <div>{getStatusBadge(sidang.status)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-700 shadow-xs flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Waktu Pelaksanaan</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {sidang.tanggal_formatted || 'Menunggu jadwal resmi...'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-700 shadow-xs flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Ruangan / Tempat</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {sidang.ruangan || 'Akan diumumkan oleh Prodi'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-700 shadow-xs flex-shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Dosen Penguji</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {sidang.dosen_penguji?.name || pendaftaran.dosen_pembimbing?.name || 'Dosen Pembimbing'}
                </p>
              </div>
            </div>
          </div>

          {sidang.catatan && (
            <div className="mt-6 p-4 bg-white/80 border border-slate-200 rounded-lg">
              <span className="text-xs font-bold text-slate-600 block mb-1">Catatan Tambahan:</span>
              <p className="text-xs text-slate-700 leading-relaxed">{sidang.catatan}</p>
            </div>
          )}
        </div>
      )}

      {/* Checklist Syarat Sidang */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">Checklist Syarat Pendaftaran Sidang</h3>
            <p className="text-xs text-slate-500">
              Sesuai SOP Kerja Praktik, seluruh syarat berikut harus terpenuhi sebelum formulir pengajuan sidang dibuka.
            </p>
          </div>
          <div className="text-left sm:text-right">
            {eligibility.eligible ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Syarat Terpenuhi (Siap Sidang)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5" />
                Belum Lengkap ({eligibility.missing.length} Syarat Kurang)
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {eligibility.requirements.map((req) => (
            <div 
              key={req.key}
              className={`p-4 rounded-xl border transition-all ${
                req.is_met 
                  ? 'bg-emerald-50/40 border-emerald-200' 
                  : 'bg-rose-50/40 border-rose-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">{req.title}</span>
                {req.is_met ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                {req.description}
              </p>
              <div className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-md ${
                req.is_met 
                  ? 'bg-emerald-100/70 text-emerald-800' 
                  : 'bg-rose-100/70 text-rose-800'
              }`}>
                {req.details}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Pengajuan Sidang (Jika belum mengajukan atau belum selesai) */}
      {canApply && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Calendar className="w-5 h-5 text-[#00288e]" />
              <h3 className="font-bold text-base">Formulir Pengajuan Jadwal Sidang</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#00288e] hover:bg-[#002277] text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ajukan Sidang</span>
            </button>
          </div>

          {eligibility.eligible ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 bg-blue-50/60 border border-blue-200 text-blue-900 rounded-lg text-xs leading-relaxed">
                <strong>Selamat!</strong> Semua prasyarat Kerja Praktik Anda telah lengkap diverifikasi. Klik tombol di bawah untuk mengajukan permohonan penetapan jadwal sidang ke Koordinator Program Studi.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Catatan / Preferensi Hari (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={data.catatan}
                  onChange={(e) => setData('catatan', e.target.value)}
                  placeholder="Contoh: Mengajukan sidang pada minggu depan hari Rabu atau Kamis jika memungkinkan..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                />
                {errors.catatan && (
                  <p className="text-xs text-rose-600 mt-1">{errors.catatan}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center gap-2 bg-[#00288e] hover:bg-[#002277] text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pengajuan Sidang</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-4">
              <HelpCircle className="w-10 h-10 text-slate-400 mx-auto opacity-60" />
              <h4 className="text-sm font-bold text-slate-800">Prasyarat Sidang Belum Lengkap</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Terdapat {eligibility.missing.length} syarat yang perlu dilengkapi terlebih dahulu. Anda dapat menekan tombol <strong>Ajukan Sidang</strong> untuk memeriksa detail atau menggunakan pintasan di bawah untuk menyelesaikan prasyarat:
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-[#00288e] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition shadow-xs inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ajukan Sidang</span>
                </button>
                <Link
                  href="/mahasiswa/logbook"
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                >
                  Cek Logbook
                </Link>
                <Link
                  href="/mahasiswa/dokumen-akhir"
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                >
                  Upload Laporan Akhir
                </Link>
                <Link
                  href="/mahasiswa/penilaian"
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                >
                  Cek Nilai Industri
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Ajukan Sidang */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="lg">
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#00288e] flex items-center justify-center font-bold">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Pengajuan Sidang Kerja Praktik</h3>
                <p className="text-xs text-slate-500">Pendaftaran jadwal seminar ke Koordinator Program Studi</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>

          {eligibility.eligible ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Semua Syarat Sidang Terpenuhi</p>
                  <p className="mt-0.5">Logbook telah disetujui, laporan akhir telah terunggah, dan nilai industri telah diinput oleh pembimbing mitra.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Catatan / Preferensi Hari Sidang (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={data.catatan}
                  onChange={(e) => setData('catatan', e.target.value)}
                  placeholder="Contoh: Mengajukan sidang pada minggu depan hari Rabu atau Kamis jika memungkinkan..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center gap-1.5 bg-[#00288e] hover:bg-[#002277] text-white px-5 py-2 rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{processing ? 'Mengirim...' : 'Kirim Pengajuan Sidang'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-2.5 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Prasyarat Sidang Belum Lengkap</p>
                  <p className="mt-0.5">
                    Terdapat {eligibility.missing.length} syarat yang belum terpenuhi. Mohon lengkapi seluruh poin di bawah agar permohonan sidang dapat diproses oleh Koordinator Program Studi:
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {eligibility.requirements.map((req) => (
                  <div
                    key={req.key}
                    className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                      req.is_met ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-rose-50/50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {req.is_met ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold block">{req.title}</span>
                        <span className="text-[11px] opacity-80">{req.details}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link
                    href="/mahasiswa/logbook"
                    className="flex-1 sm:flex-none text-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition"
                  >
                    Logbook
                  </Link>
                  <Link
                    href="/mahasiswa/dokumen-akhir"
                    className="flex-1 sm:flex-none text-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition"
                  >
                    Laporan Akhir
                  </Link>
                  <Link
                    href="/mahasiswa/penilaian"
                    className="flex-1 sm:flex-none text-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition"
                  >
                    Nilai Industri
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition"
                >
                  Mengerti
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Berkas & Formulir Resmi Persyaratan Sidang / Seminar KP */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-[#00288e] border border-blue-200 uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              Lampiran Resmi Seminar KP
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Formulir Prasyarat & Berita Acara Ujian Seminar
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Gunakan formulir resmi berikut untuk melengkapi persyaratan ujian, penilaian lapangan, dan berita acara:
            </p>
          </div>

          <Link
            href="/panduan#lampiran-section"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Katalog 21 Lampiran Lengkap</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Form KP-8 */}
          <div className="p-3.5 bg-slate-50/60 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3 hover:border-blue-300 transition">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Form KP-8
                </span>
                <span className="text-[10px] text-slate-400">228 KB</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Persetujuan Seminar (ACC)</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Lembar persetujuan maju ujian seminar bertandatangan Dosen Pembimbing KP.
              </p>
            </div>
            <a
              href="/dokumen/lampiran/Lampiran_06_Lembar_Persetujuan_Seminar_KP_Form_KP-8.pdf"
              download
              className="inline-flex items-center justify-center gap-1 py-1.5 px-3 bg-[#00288e] hover:bg-blue-800 text-white rounded-lg text-[11px] font-semibold transition"
            >
              <Download className="w-3 h-3" />
              <span>Unduh Form KP-8</span>
            </a>
          </div>

          {/* Form KP-6a */}
          <div className="p-3.5 bg-slate-50/60 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3 hover:border-blue-300 transition">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-50 text-rose-700 border border-rose-200">
                  Form KP-6a
                </span>
                <span className="text-[10px] text-slate-400">303 KB</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Penilaian Pembimbing Lapangan</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Formulir evaluasi nilai kinerja industri mahasiswa bertandatangan pembimbing mitra.
              </p>
            </div>
            <a
              href="/dokumen/lampiran/Lampiran_07_Penilaian_Pembimbing_Lapangan_Form_KP-6a.pdf"
              download
              className="inline-flex items-center justify-center gap-1 py-1.5 px-3 bg-[#00288e] hover:bg-blue-800 text-white rounded-lg text-[11px] font-semibold transition"
            >
              <Download className="w-3 h-3" />
              <span>Unduh Form KP-6a</span>
            </a>
          </div>

          {/* Form KP-5 */}
          <div className="p-3.5 bg-slate-50/60 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3 hover:border-blue-300 transition">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Form KP-5
                </span>
                <span className="text-[10px] text-slate-400">268 KB</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Berita Acara Ujian KP</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Format berita acara resmi pelaksanaan ujian seminar bertandatangan dewan penguji.
              </p>
            </div>
            <a
              href="/dokumen/lampiran/Lampiran_10_Berita_Acara_Ujian_KP_Form_KP-5.pdf"
              download
              className="inline-flex items-center justify-center gap-1 py-1.5 px-3 bg-[#00288e] hover:bg-blue-800 text-white rounded-lg text-[11px] font-semibold transition"
            >
              <Download className="w-3 h-3" />
              <span>Unduh Form KP-5</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

SidangScreen.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
