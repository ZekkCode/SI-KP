import InstansiLayout from '@/Layouts/InstansiLayout';
import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  Building2, 
  AlertCircle, 
  Filter, 
  MoreVertical, 
  Calendar, 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Activity, 
  FileText,
  CheckCircle2,
  X,
  Sparkles,
  ExternalLink,
  Plus,
  ChevronRight,
  Mail,
  Phone,
  Download,
  Upload,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Intern {
  id: number;
  name: string;
  nim: string;
  university: string;
  department: string;
  period: string;
  status: 'Aktif' | 'Selesai' | 'Menunggu';
  logbookCount: number;
  rating?: number;
  initials: string;
}

const INITIAL_INTERNS: Intern[] = [
  { 
    id: 1, 
    name: 'Ahmad Budi', 
    nim: '10123456', 
    university: 'Universitas Indonesia', 
    department: 'Software Engineering',
    period: 'Jan - Jun 2024', 
    status: 'Aktif',
    logbookCount: 16,
    initials: 'AB'
  },
  { 
    id: 2, 
    name: 'Citra Sari', 
    nim: '10123457', 
    university: 'Institut Teknologi Bandung', 
    department: 'UI/UX Design',
    period: 'Jan - Jun 2024', 
    status: 'Aktif',
    logbookCount: 15,
    initials: 'CS'
  },
  { 
    id: 3, 
    name: 'Dian Wibowo', 
    nim: '10123458', 
    university: 'Universitas Gadjah Mada', 
    department: 'Data Analyst',
    period: 'Agu - Des 2023', 
    status: 'Selesai',
    logbookCount: 24,
    rating: 92,
    initials: 'DW'
  },
  { 
    id: 4, 
    name: 'Feri Irawan', 
    nim: '20041110023', 
    university: 'Universitas Trunojoyo Madura', 
    department: 'Network Operations',
    period: 'Jan - Jun 2024', 
    status: 'Menunggu',
    logbookCount: 0,
    initials: 'FI'
  },
  { 
    id: 5, 
    name: 'Gita Lestari', 
    nim: '20041110056', 
    university: 'Universitas Trunojoyo Madura', 
    department: 'Quality Assurance',
    period: 'Jan - Jun 2024', 
    status: 'Aktif',
    logbookCount: 12,
    initials: 'GL'
  }
];

export default function Dashboard() {
  const [interns, setInterns] = useState<Intern[]>(INITIAL_INTERNS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  
  // Modals / Detail pages states
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [activeDetailIntern, setActiveDetailIntern] = useState<Intern | null>(null);
  
  // Add Student form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInternName, setNewInternName] = useState('');
  const [newInternNim, setNewInternNim] = useState('');
  const [newInternUniv, setNewInternUniv] = useState('');
  const [newInternDept, setNewInternDept] = useState('');
  const [newInternPeriod, setNewInternPeriod] = useState('Jan - Jun 2024');
  const [newInternStatus, setNewInternStatus] = useState<'Aktif' | 'Selesai' | 'Menunggu'>('Aktif');

  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Filter interns
  const filteredInterns = interns.filter(intern => {
    const matchesStatus = statusFilter === 'Semua' ? true : intern.status === statusFilter;
    const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          intern.nim.includes(searchTerm) ||
                          intern.university.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalInterns = interns.length;
  const activeInterns = interns.filter(i => i.status === 'Aktif').length;
  const completedInterns = interns.filter(i => i.status === 'Selesai').length;

  const handleAddIntern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternName.trim() || !newInternNim.trim() || !newInternUniv.trim() || !newInternDept.trim()) {
      alert('Mohon lengkapi semua data mahasiswa!');
      return;
    }

    const newIntern: Intern = {
      id: Date.now(),
      name: newInternName,
      nim: newInternNim,
      university: newInternUniv,
      department: newInternDept,
      period: newInternPeriod,
      status: newInternStatus,
      logbookCount: 0,
      initials: newInternName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    };

    setInterns(prev => [newIntern, ...prev]);
    setShowAddModal(false);
    
    // Clear inputs
    setNewInternName('');
    setNewInternNim('');
    setNewInternUniv('');
    setNewInternDept('');
    setNewInternPeriod('Jan - Jun 2024');
    setNewInternStatus('Aktif');

    triggerNotification(`Mahasiswa ${newIntern.name} berhasil ditambahkan!`);
  };

  // Confirm Acceptance
  const handleConfirmAcceptance = (id: number) => {
    setInterns(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, status: 'Aktif' as const };
        setActiveDetailIntern(updated);
        return updated;
      }
      return item;
    }));
    triggerNotification('Penerimaan mahasiswa berhasil dikonfirmasi!');
  };

  // Reject Acceptance
  const handleRejectAcceptance = (id: number) => {
    const reason = prompt('Masukkan alasan penolakan:');
    if (reason !== null) {
      setInterns(prev => prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, status: 'Menunggu' as const };
          setActiveDetailIntern(updated);
          return updated;
        }
        return item;
      }));
      triggerNotification('Pengajuan penempatan mahasiswa ditolak.');
    }
  };

  // Render Student Detail page if activeDetailIntern is set (goes to Placement UI lookalike)
  if (activeDetailIntern) {
    return (
      <main className="flex-1 min-h-screen p-6 md:p-8 w-full max-w-[1200px] mx-auto space-y-8 bg-[#f8fafc]">
        {/* Toast Notification */}
        {notification && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CheckCircle2 size={18} className="text-green-400" />
            <span className="text-sm font-semibold">{notification}</span>
          </div>
        )}

        {/* Breadcrumbs & Header */}
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <button 
              onClick={() => setActiveDetailIntern(null)}
              className="hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </button>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-600 font-semibold">Tinjau Penempatan</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Detail Penempatan Kerja Praktek</h1>
          <p className="text-slate-500 mt-2 text-sm max-w-3xl leading-relaxed">
            Tinjau data akademik, berkas pengajuan, dan lakukan konfirmasi penempatan kerja praktek mahasiswa di perusahaan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Student Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Applicant Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-3xl shadow-sm shrink-0">
                  {activeDetailIntern.initials}
                </div>
                <div className="flex-grow w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 w-full">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">{activeDetailIntern.name}</h3>
                      <p className="text-sm font-semibold text-indigo-600 mt-1 flex items-center gap-1.5">
                        <GraduationCap size={16} />
                        {activeDetailIntern.department}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        activeDetailIntern.status === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-800'
                          : activeDetailIntern.status === 'Selesai'
                          ? 'bg-slate-100 text-slate-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {activeDetailIntern.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-6 pt-6 border-t border-slate-100 text-sm">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">NIM / Student ID</span>
                      <p className="font-bold text-slate-700">{activeDetailIntern.nim}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Universitas</span>
                      <p className="font-bold text-slate-700">{activeDetailIntern.university}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Akademik</span>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Mail size={14} className="text-indigo-500" />
                        {activeDetailIntern.name.toLowerCase().replace(/\s+/g, '')}@student.utm.ac.id
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
                    <p className="text-sm font-semibold text-slate-500">Full-time</p>
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
                  Software Engineering, Cloud Infrastructure, Database Design
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
                    <p className="text-xs font-bold text-slate-700 truncate">Resume_{activeDetailIntern.initials}.pdf</p>
                    <p className="text-[10px] text-slate-400 font-semibold">1.2 MB | PDF Dokumen</p>
                  </div>
                  <Download className="text-slate-400 group-hover:text-indigo-600 transition-colors" size={18} />
                </a>
                
                <a href="#" className="flex items-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mr-3 shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">Proposal_KP_{activeDetailIntern.initials}.pdf</p>
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
                {activeDetailIntern.status === 'Menunggu' && (
                  <>
                    <button 
                      type="button"
                      onClick={() => handleConfirmAcceptance(activeDetailIntern.id)} 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm"
                    >
                      <CheckCircle size={16} />
                      Konfirmasi Penerimaan
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleRejectAcceptance(activeDetailIntern.id)}
                      className="w-full bg-white text-red-600 hover:bg-red-50 text-xs font-bold py-3 px-4 rounded-xl border border-red-200 hover:border-red-300 transition-colors flex justify-center items-center gap-2"
                    >
                      <XCircle size={16} />
                      Tolak Pengajuan
                    </button>
                  </>
                )}
                {activeDetailIntern.status !== 'Menunggu' && (
                  <div className="space-y-3">
                    <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-semibold border border-emerald-100 text-center">
                      Keputusan: {activeDetailIntern.status === 'Aktif' ? 'Diterima' : 'Selesai Magang'}
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setInterns(prev => prev.map(item => {
                          if (item.id === activeDetailIntern.id) {
                            const updated = { ...item, status: 'Menunggu' as const };
                            setActiveDetailIntern(updated);
                            return updated;
                          }
                          return item;
                        }));
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors flex justify-center items-center gap-2"
                    >
                      Reset Keputusan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-screen p-6 md:p-8 w-full max-w-[1400px] mx-auto space-y-8 bg-[#f8fafc]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-lg border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none hidden md:block">
          <svg width="400" height="100%" viewBox="0 0 400 200" fill="none">
            <path d="M-100 200 C100 100 200 300 400 100" stroke="white" strokeWidth="4" />
            <path d="M-50 250 C150 150 250 350 450 150" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles size={12} />
            Mitra Industri Resmi SIKP
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Selamat Datang, PT Telkom Indonesia 👋
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Kelola mahasiswa magang Anda dengan mudah. Tinjau logbook harian, berikan evaluasi akhir, dan unduh sertifikat kerja praktek dalam satu dashboard terintegrasi.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Interns */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md hover:border-indigo-200 transition-all group">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Mahasiswa Magang</h3>
            <p className="text-4xl font-extrabold text-slate-900">{totalInterns}</p>
            <p className="text-xs text-indigo-600 font-semibold flex items-center gap-1 mt-1">
              <span>+3 semester ini</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
            <Users size={24} />
          </div>
        </div>

        {/* Active Interns */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md hover:border-emerald-200 transition-all group">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mahasiswa Aktif</h3>
            <p className="text-4xl font-extrabold text-slate-900">{activeInterns}</p>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
              <span>Sedang berlangsung</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-inner">
            <Activity size={24} />
          </div>
        </div>

        {/* Completed Interns */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md hover:border-amber-200 transition-all group">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selesai Magang</h3>
            <p className="text-4xl font-extrabold text-slate-900">{completedInterns}</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              <span>Telah diverifikasi akhir</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-inner">
            <Award size={24} />
          </div>
        </div>
      </div>

      {/* Main Interns List Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Daftar Mahasiswa Magang</h3>
            <p className="text-xs text-slate-400 mt-1">Kelola mahasiswa, tinjau logbook harian, dan pantau status mereka.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto items-stretch sm:items-center">
            {/* Filter by Status */}
            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
              {['Semua', 'Aktif', 'Selesai', 'Menunggu'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari nama, nim, universitas..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full sm:w-56 bg-white border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700"
              />
            </div>

            {/* Add Student Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus size={16} />
              Tambah Mahasiswa
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Nama Mahasiswa</th>
                <th className="px-6 py-4">NIM</th>
                <th className="px-6 py-4">Universitas / Divisi</th>
                <th className="px-6 py-4">Periode</th>
                <th className="px-6 py-4 text-center">Logbook</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600 bg-white">
              {filteredInterns.length > 0 ? (
                filteredInterns.map(intern => (
                  <tr 
                    key={intern.id} 
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedIntern(intern)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                          {intern.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{intern.name}</p>
                          <p className="text-xs text-slate-400">Internship Program</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">{intern.nim}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-800">{intern.university}</p>
                        <p className="text-xs text-indigo-600 font-semibold">{intern.department}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        <Calendar size={12} className="text-slate-400" />
                        {intern.period}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-slate-700">{intern.logbookCount} </span>
                      <span className="text-xs text-slate-400">Log</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider ${
                        intern.status === 'Aktif' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : intern.status === 'Selesai'
                          ? 'bg-slate-100 text-slate-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {intern.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Original Detail Button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIntern(intern);
                          }}
                          className="px-2.5 py-1.5 bg-slate-150 hover:bg-slate-200 rounded-lg text-xs font-bold transition-all text-slate-700"
                        >
                          Detail
                        </button>
                        {/* New View Placement Button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDetailIntern(intern);
                          }}
                          className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold transition-all text-indigo-600 flex items-center justify-center gap-1"
                        >
                          Tinjau <ArrowRight size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 bg-white">
                    Tidak ditemukan data mahasiswa magang yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Entries Info */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-medium text-slate-400">
            Menampilkan {filteredInterns.length} dari {interns.length} entri
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-white text-xs font-semibold transition-all disabled:opacity-50" disabled>Sebelumnya</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-white text-xs font-semibold transition-all">Selanjutnya</button>
          </div>
        </div>
      </div>

      {/* Add Intern Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-950 text-white p-5 flex justify-between items-center">
              <h3 className="font-extrabold text-lg">Tambah Mahasiswa Baru</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="hover:bg-white/10 p-1.5 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleAddIntern}>
              <div className="p-6 space-y-4 text-slate-700">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1.5">Nama Mahasiswa</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Rendi Wijaya"
                    value={newInternName}
                    onChange={(e) => setNewInternName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1.5">NIM / Student ID</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: 20041110008"
                    value={newInternNim}
                    onChange={(e) => setNewInternNim(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1.5">Universitas</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Universitas Trunojoyo Madura"
                    value={newInternUniv}
                    onChange={(e) => setNewInternUniv(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1.5">Divisi Penempatan</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Front-End Development"
                    value={newInternDept}
                    onChange={(e) => setNewInternDept(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1.5">Periode Magang</label>
                    <select
                      value={newInternPeriod}
                      onChange={(e) => setNewInternPeriod(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-850"
                    >
                      <option value="Jan - Jun 2024">Jan - Jun 2024</option>
                      <option value="Agu - Des 2024">Agu - Des 2024</option>
                      <option value="Mar - Agu 2024">Mar - Agu 2024</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1.5">Status Awal</label>
                    <select
                      value={newInternStatus}
                      onChange={(e) => setNewInternStatus(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-850"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Menunggu">Menunggu</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Tambah Mahasiswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Intern Detail Popup Modal */}
      {selectedIntern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-950 text-white p-6 relative">
              <button 
                onClick={() => setSelectedIntern(null)}
                className="absolute right-4 top-4 hover:bg-white/10 p-2 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg text-white">
                  {selectedIntern.initials}
                </div>
                <div>
                  <h3 className="font-extrabold text-xl">{selectedIntern.name}</h3>
                  <p className="text-xs text-indigo-300 font-medium">NIM: {selectedIntern.nim} | {selectedIntern.university}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block">Divisi Penempatan</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Briefcase size={14} className="text-indigo-500" />
                    {selectedIntern.department}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block">Status Magang</span>
                  <span className="mt-1 inline-block">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      selectedIntern.status === 'Aktif'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedIntern.status === 'Selesai'
                        ? 'bg-slate-100 text-slate-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedIntern.status}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block">Periode</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Calendar size={14} className="text-indigo-500" />
                    {selectedIntern.period}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block">Progres Logbook</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <FileText size={14} className="text-indigo-500" />
                    {selectedIntern.logbookCount} Log Terisi
                  </span>
                </div>
              </div>

              {/* Action Suggestion Alert */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-700 text-sm flex items-center gap-1">
                  <Sparkles size={14} className="text-indigo-500" />
                  Aksi Cepat Instansi
                </h4>
                <p className="text-xs text-slate-500">
                  Anda dapat meninjau logbook harian mahasiswa ini atau langsung memberikan evaluasi penilaian magang akhir.
                </p>
              </div>

              {selectedIntern.rating && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-900 p-4 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs text-emerald-700 font-bold block">Nilai Evaluasi Akhir</span>
                    <span className="text-lg font-extrabold">Sudah Dinilai ({selectedIntern.rating}/100)</span>
                  </div>
                  <CheckCircle2 size={24} className="text-emerald-500" />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between gap-3">
              <button
                onClick={() => setSelectedIntern(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                Tutup
              </button>

              <div className="flex gap-2">
                <a
                  href="/instansi/logbook"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  Tinjau Logbook <ExternalLink size={12} />
                </a>
                
                {selectedIntern.status === 'Aktif' && (
                  <a
                    href="/instansi/evaluation"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    Beri Penilaian
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

Dashboard.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
