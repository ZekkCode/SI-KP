import { useState } from 'react';
import TULayout from '@/Layouts/TULayout';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  Briefcase, 
  Mail, 
  Eye, 
  Key, 
  Send, 
  Copy, 
  Check, 
  AlertCircle, 
  Building2, 
  ExternalLink, 
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';

interface Stats {
  mahasiswa_aktif: number;
  antrean_surat: number;
  total_mitra?: number;
  mitra_aktif?: number;
  mitra_pending?: number;
  mitra_belum_klaim?: number;
}

interface MitraItem {
  id: number;
  nama: string;
  instansi_id: number | null;
  user_id: number | null;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    status_akun: string;
    no_telepon?: string | null;
    must_change_password?: boolean;
  } | null;
  instansi: {
    id: number;
    nama: string;
    alamat?: string;
    kota?: string;
  } | null;
  mahasiswa: {
    id: number;
    name: string;
    nim: string;
  } | null;
  periode_kp?: string | null;
  pendaftaran_status?: string | null;
}

interface Props {
  stats: Stats;
  mitraList?: MitraItem[];
}

export default function TUDashboard({ stats, mitraList = [] }: Props) {
  const { flash } = usePage().props as any;

  const [previewModal, setPreviewModal] = useState<MitraItem | null>(null);
  const [sendConfirmModal, setSendConfirmModal] = useState<MitraItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'semua' | 'aktif' | 'pending'>('semua');

  const filteredMitra = mitraList.filter((m) => {
    if (activeTab === 'aktif') return m.user?.status_akun === 'aktif';
    if (activeTab === 'pending') return !m.user || m.user.status_akun !== 'aktif';
    return true;
  });

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleSendEmail = (mitra: MitraItem) => {
    if (!mitra.user) return;
    setActionLoading(true);
    router.post(
      route('tu.pembimbing-lapangan.resend', mitra.user.id),
      {},
      {
        preserveScroll: true,
        onFinish: () => {
          setActionLoading(false);
          setSendConfirmModal(null);
          setPreviewModal(null);
        },
      }
    );
  };

  const kpiCards = [
    {
      title: "Mahasiswa Aktif KP",
      value: stats.mahasiswa_aktif.toString(),
      icon: <Users size={24} />,
      color: "text-blue-600 bg-blue-100",
      link: route('tu.mahasiswa'),
    },
    {
      title: "Antrean Surat Pengantar",
      value: stats.antrean_surat.toString(),
      icon: <FileText size={24} />,
      color: "text-amber-600 bg-amber-100",
      link: route('tu.generate'),
    },
    {
      title: "Mitra & Pembimbing Lapangan",
      value: (stats.total_mitra ?? mitraList.length).toString(),
      icon: <Briefcase size={24} />,
      color: "text-teal-600 bg-teal-100",
      link: route('tu.pembimbing-lapangan.index'),
    },
    {
      title: "Akun Mitra Aktif",
      value: (stats.mitra_aktif ?? mitraList.filter(m => m.user?.status_akun === 'aktif').length).toString(),
      icon: <Mail size={24} />,
      color: "text-indigo-600 bg-indigo-100",
      link: route('tu.pembimbing-lapangan.index'),
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Dashboard Tata Usaha</h1>
          <p className="text-on-surface-variant mt-1">Ringkasan administrasi, antrean surat pengantar, dan distribusi kredensial email mitra.</p>
        </div>
        <Link
          href={route('tu.pembimbing-lapangan.index')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer self-start md:self-auto"
        >
          <Briefcase className="w-4 h-4" />
          <span>Kelola Akun Mitra</span>
        </Link>
      </div>

      {/* Flash Messages */}
      {flash?.success && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-start gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{flash.success}</div>
        </div>
      )}

      {flash?.warning && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3 shadow-xs">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{flash.warning}</div>
        </div>
      )}

      {flash?.error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{flash.error}</div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-1">
        {kpiCards.map((card, idx) => (
          <Link key={idx} href={card.link} className="block group">
            <div className="bg-surface-lowest rounded-xl p-5 border border-outline-variant shadow-sm hover:shadow-md transition-all h-full relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2.5 rounded-lg ${card.color}`}>
                  {card.icon}
                </div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-on-surface mb-1 group-hover:scale-105 origin-left transition-transform">
                  {card.value}
                </div>
                <h3 className="text-xs font-medium text-on-surface-variant">{card.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Layanan Administrasi Tata Usaha */}
      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm p-6">
        <div className="flex items-center justify-between mb-4 border-b border-outline-variant pb-3">
          <div>
            <h2 className="text-lg font-display font-semibold text-on-surface">Layanan Administrasi Tata Usaha</h2>
            <p className="text-xs text-secondary mt-0.5">Akses cepat pemrosesan berkas Kerja Praktik dan akun mitra.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <Link 
            href={route('tu.verifikasi-pendaftaran')}
            className="p-4 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 bg-blue-50 text-primary rounded-md w-fit mb-3">
                <CheckCircle size={20} />
              </div>
              <h4 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">Verifikasi Pendaftaran</h4>
              <p className="text-xs text-secondary mt-1">Validasi berkas registrasi awal mahasiswa.</p>
            </div>
          </Link>

          <Link 
            href={route('tu.generate')}
            className="p-4 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-md w-fit mb-3">
                <FileText size={20} />
              </div>
              <h4 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">Surat Pengantar</h4>
              <p className="text-xs text-secondary mt-1">Penerbitan surat pengantar instansi.</p>
            </div>
          </Link>

          <Link 
            href={route('tu.surat-balasan')}
            className="p-4 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-md w-fit mb-3">
                <FileText size={20} />
              </div>
              <h4 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">Surat Balasan</h4>
              <p className="text-xs text-secondary mt-1">Konfirmasi penerimaan dari instansi mitra.</p>
            </div>
          </Link>

          <Link 
            href={route('tu.persetujuan-akun')}
            className="p-4 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 bg-purple-50 text-purple-700 rounded-md w-fit mb-3">
                <Users size={20} />
              </div>
              <h4 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">Persetujuan Akun</h4>
              <p className="text-xs text-secondary mt-1">Aktivasi akun registrasi mahasiswa baru.</p>
            </div>
          </Link>

          <Link 
            href={route('tu.pembimbing-lapangan.index')}
            className="p-4 rounded-lg border border-outline-variant hover:border-teal-500 hover:bg-teal-50/40 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 bg-teal-50 text-teal-700 rounded-md w-fit mb-3">
                <Briefcase size={20} />
              </div>
              <h4 className="font-semibold text-sm text-on-surface group-hover:text-teal-700 transition-colors">Kredensial Mitra & PL</h4>
              <p className="text-xs text-secondary mt-1">Kirim email akun pembimbing lapangan.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* GUI EMAIL MITRA & PUSAT KREDENSIAL */}
      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-display font-semibold text-on-surface">
                Pusat Kredensial & GUI Email Mitra (Pembimbing Lapangan)
              </h2>
            </div>
            <p className="text-xs text-secondary mt-1">
              Pratinjau visual GUI email resmi, verifikasi alamat email mitra, dan kirimkan kredensial akses portal langsung dari dasbor.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('semua')}
                className={`px-3 py-1 rounded-md transition ${activeTab === 'semua' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Semua ({mitraList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('aktif')}
                className={`px-3 py-1 rounded-md transition ${activeTab === 'aktif' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Aktif
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1 rounded-md transition ${activeTab === 'pending' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Pending
              </button>
            </div>

            <Link
              href={route('tu.pembimbing-lapangan.index')}
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline px-2.5 py-1"
            >
              <span>Kelola Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Tabel Interaktif GUI Email Mitra */}
        <div className="overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-outline-variant font-bold">
                <th className="py-3 px-4 w-12">No</th>
                <th className="py-3 px-4">Pembimbing Lapangan & Kontak</th>
                <th className="py-3 px-4">Instansi Mitra</th>
                <th className="py-3 px-4">Mahasiswa Bimbingan</th>
                <th className="py-3 px-4 text-center">Status Akun</th>
                <th className="py-3 px-4 text-right">Aksi GUI Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredMitra.length > 0 ? (
                filteredMitra.map((mitra, idx) => {
                  const hasUser = !!mitra.user;
                  const email = mitra.user?.email || '-';
                  return (
                    <tr key={mitra.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{mitra.nama}</div>
                        <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                          <span className="font-mono text-[11px] text-teal-700 font-medium">{email}</span>
                          {hasUser && (
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(email)}
                              title="Salin email mitra"
                              className="text-slate-400 hover:text-teal-600 transition p-0.5 rounded"
                            >
                              {copiedEmail === email ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{mitra.instansi?.nama || 'Instansi Mitra'}</span>
                        </div>
                        {mitra.instansi?.kota && (
                          <div className="text-[11px] text-slate-400 mt-0.5">{mitra.instansi.kota}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {mitra.mahasiswa ? (
                          <div>
                            <span className="font-semibold text-slate-800 block">{mitra.mahasiswa.name}</span>
                            <span className="font-mono text-slate-400 text-[11px]">{mitra.mahasiswa.nim}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Belum dialokasikan</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {hasUser ? (
                          mitra.user?.status_akun === 'aktif' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Belum Ada Akun
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Tombol Preview GUI Email */}
                          <button
                            type="button"
                            onClick={() => setPreviewModal(mitra)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-semibold transition shadow-2xs cursor-pointer"
                            title="Pratinjau Format GUI Email Resmi"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview GUI Email</span>
                          </button>

                          {/* Tombol Kirim / Reset Kredensial */}
                          {hasUser && (
                            <button
                              type="button"
                              onClick={() => setSendConfirmModal(mitra)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-teal-500 text-slate-700 hover:text-teal-700 rounded-lg text-xs font-semibold transition shadow-2xs cursor-pointer"
                              title="Reset Password & Kirim Ulang Email"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Kirim Email</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-60" />
                    <p className="font-medium text-slate-600">Belum ada data pembimbing lapangan mitra.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Data pembimbing lapangan akan muncul otomatis saat mitra mengonfirmasi surat pengantar kerja praktik.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: PREVIEW GUI EMAIL MITRA */}
      {previewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
            {/* Modal Header & Window Bar */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <Mail className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold font-mono tracking-wide">
                  Pratinjau GUI Email Resmi Pembimbing Lapangan
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded"
              >
                ✕ Tutup
              </button>
            </div>

            {/* Email Metadata Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 text-xs space-y-1.5 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-16">Pengirim:</span>
                <span className="font-semibold text-slate-800">
                  SI-KP Teknik Informatika UTM &lt;tif@trunojoyo.ac.id&gt;
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-16">Kepada:</span>
                <span className="font-bold text-teal-700">
                  {previewModal.user?.name || previewModal.nama} &lt;{previewModal.user?.email || 'email-mitra@instansi.com'}&gt;
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-16">Subjek:</span>
                <span className="font-semibold text-slate-800">
                  Akun Pembimbing Lapangan SI-KP Teknik Informatika UTM
                </span>
              </div>
            </div>

            {/* Rendered Visual Email Content */}
            <div className="p-6 bg-slate-100 max-h-[60vh] overflow-y-auto">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-lg mx-auto">
                {/* Header Email Brand */}
                <div className="bg-gradient-to-r from-teal-700 to-teal-600 p-6 text-center text-white">
                  <h3 className="font-extrabold text-base tracking-tight">SI-KP TEKNIK INFORMATIKA</h3>
                  <p className="text-[11px] uppercase tracking-wider text-teal-100 mt-0.5">Universitas Trunojoyo Madura</p>
                </div>

                {/* Email Body */}
                <div className="p-6 text-slate-800 text-xs space-y-4 leading-relaxed">
                  <div className="font-bold text-sm text-slate-900">
                    Yth. Bapak/Ibu {previewModal.user?.name || previewModal.nama},
                  </div>
                  <p>
                    Terima kasih atas kesediaan <strong>{previewModal.instansi?.nama || 'Instansi Mitra'}</strong> menerima mahasiswa kami dalam pelaksanaan Kerja Praktik. Akun Pembimbing Lapangan Anda di Sistem Informasi Kerja Praktik (SI-KP) telah aktif.
                  </p>

                  {/* Info Mahasiswa Bimbingan Box */}
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-1 text-emerald-900">
                    <strong className="block text-[11px] uppercase tracking-wider text-emerald-800 font-bold mb-1">
                      Data Mahasiswa Bimbingan:
                    </strong>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-emerald-700">Nama:</span>
                      <span className="col-span-2 font-bold">{previewModal.mahasiswa?.name || 'Mahasiswa Bimbingan'}</span>
                      <span className="text-emerald-700">NIM:</span>
                      <span className="col-span-2 font-mono font-bold">{previewModal.mahasiswa?.nim || '-'}</span>
                      <span className="text-emerald-700">Instansi:</span>
                      <span className="col-span-2">{previewModal.instansi?.nama || 'Instansi Mitra'}</span>
                      {previewModal.periode_kp && (
                        <>
                          <span className="text-emerald-700">Periode:</span>
                          <span className="col-span-2 font-semibold">{previewModal.periode_kp}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <p>
                    Gunakan kredensial berikut untuk masuk ke portal Pembimbing Lapangan:
                  </p>

                  {/* Kredensial Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 font-mono">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-sans">Alamat Email / Akun:</span>
                      <span className="font-bold text-slate-900">{previewModal.user?.email || 'email-mitra@instansi.com'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-sans">Password Sementara:</span>
                      <span className="font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        [Dibuat Acak Sistem]
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-sans">Peran:</span>
                      <span className="font-bold text-slate-700 font-sans">Pembimbing Lapangan</span>
                    </div>
                  </div>

                  {/* Security Alert */}
                  <div className="bg-blue-50 border-l-4 border-teal-600 p-3 rounded-r-lg text-blue-900 text-[11px]">
                    <strong>Catatan Keamanan:</strong> Demi keamanan akun, Anda akan diminta untuk mengganti password sementara saat pertama kali masuk ke sistem.
                  </div>

                  {/* CTA Button mockup */}
                  <div className="pt-2 text-center">
                    <span className="inline-block bg-teal-600 text-white font-bold px-6 py-2.5 rounded-lg shadow-xs text-xs">
                      Masuk ke Portal Pembimbing Lapangan
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 text-center pt-2">
                    Melalui portal ini, Anda dapat memantau proposal, memvalidasi logbook aktivitas harian mahasiswa, serta memberikan penilaian akhir kerja praktik.
                  </p>
                </div>

                {/* Footer Email */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
                  © 2026 Program Studi Teknik Informatika, Fakultas Teknik, Universitas Trunojoyo Madura.<br />
                  Jl. Raya Telang, PO.Box 2 Kamal, Bangkalan, Madura. Email otomatis sistem.
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              {previewModal.user ? (
                <a
                  href={`/tu/pembimbing-lapangan/${previewModal.user.id}/preview-email`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-teal-700 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Tampilan HTML Asli</span>
                </a>
              ) : (
                <span className="text-xs text-slate-400">Akun belum terdaftar</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Tutup
                </button>
                {previewModal.user && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleSendEmail(previewModal)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{actionLoading ? 'Mengirim...' : 'Kirim Kredensial Sekarang'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI KIRIM / RESET KREDENSIAL */}
      {sendConfirmModal && sendConfirmModal.user && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-teal-100 text-teal-700">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Kirim Ulang Kredensial Mitra?</h3>
                <p className="text-xs text-slate-500 font-mono">
                  {sendConfirmModal.nama} ({sendConfirmModal.user.email})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Sistem akan membuat kata sandi acak baru dan secara otomatis mengirimkan informasi akun ke alamat email pembimbing lapangan ({sendConfirmModal.user.email}).
            </p>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setSendConfirmModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleSendEmail(sendConfirmModal)}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{actionLoading ? 'Mengirim...' : 'Ya, Kirim Email'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

TUDashboard.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;

