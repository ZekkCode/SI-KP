import InstansiLayout from '@/Layouts/InstansiLayout';
import { useState } from 'react';
import { Filter, Download, Clock, CheckCircle2, MessageSquare, Check, User2, ChevronDown, Star, AlertCircle } from 'lucide-react';

const mockInterns = [
  { id: 1, name: 'Budi Santoso', nim: '120140123', department: 'Divisi IT', avatarInitials: 'BS' },
  { id: 2, name: 'Siti Nurhaliza', nim: '120140156', department: 'Divisi Marketing', avatarInitials: 'SN' },
];

const mockLogbookEntries = [
  {
    id: 1,
    title: 'Setup Environment Development',
    date: '15 Okt 2023',
    time: '08:00 - 17:00',
    status: 'Disetujui',
    description: 'Melakukan instalasi tools development (VS Code, Node.js, Docker) dan konfigurasi environment project internal perusahaan.',
    feedback: 'Kerjakan dengan baik, pastikan semua tools sudah berjalan lancar sebelum mulai development.',
    rating: 4,
  },
  {
    id: 2,
    title: 'Implementasi Modul Autentikasi',
    date: '18 Okt 2023',
    time: '08:00 - 17:00',
    status: 'Disetujui',
    description: 'Mengembangkan fitur login, register, dan reset password menggunakan framework Laravel dengan integrasi OAuth2.',
    feedback: 'Implementasi sudah sesuai standar perusahaan. Perhatikan error handling-nya.',
    rating: 5,
  },
  {
    id: 3,
    title: 'Pengujian API Endpoints',
    date: '22 Okt 2023',
    time: '08:00 - 17:00',
    status: 'Menunggu',
    description: 'Membuat unit test dan integration test untuk seluruh endpoint API yang sudah dikembangkan pada sprint pertama.',
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Desain UI Dashboard Analytics',
    date: '25 Okt 2023',
    time: '08:00 - 12:00',
    status: 'Menunggu',
    description: 'Membuat wireframe dan prototype hi-fi untuk dashboard analytics menggunakan Figma sesuai design system perusahaan.',
  },
];

export default function LogbookScreen() {
  const [selectedIntern, setSelectedIntern] = useState(mockInterns[0]);

  const approvedCount = mockLogbookEntries.filter(e => e.status === 'Disetujui').length;
  const pendingCount = mockLogbookEntries.filter(e => e.status === 'Menunggu').length;
  const totalCount = mockLogbookEntries.length;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">Monitoring Logbook</h1>
          <p className="text-sm text-on-surface-variant mt-1">Pantau aktivitas harian mahasiswa KP di perusahaan Anda.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface rounded-lg hover:bg-surface-high transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity text-sm font-medium shadow-sm">
            <Download className="w-4 h-4" />
            Ekspor PDF
          </button>
        </div>
      </div>

      {/* Intern Selector */}
      <div className="bg-surface-lowest rounded-xl border border-outline-variant p-5 shadow-sm">
        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 block">Pilih Mahasiswa</label>
        <div className="flex flex-wrap gap-3">
          {mockInterns.map((intern) => (
            <button
              key={intern.id}
              onClick={() => setSelectedIntern(intern)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 active:scale-95 ${
                selectedIntern.id === intern.id
                  ? 'border-primary bg-primary-fixed text-primary shadow-sm'
                  : 'border-outline-variant text-on-surface-variant hover:bg-surface-high'
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm ${
                selectedIntern.id === intern.id
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-high text-on-surface-variant'
              }`}>
                {intern.avatarInitials}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">{intern.name}</div>
                <div className="text-xs opacity-75">{intern.department}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Total Entri</span>
          <span className="text-4xl font-display text-primary font-bold">{totalCount}</span>
          <div className="mt-4 h-1 w-full bg-surface-high rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(approvedCount / Math.max(totalCount, 1)) * 100}%` }}></div>
          </div>
        </div>
        <div className="bg-surface-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Menunggu Persetujuan</span>
          <span className="text-4xl font-display text-error font-bold">{pendingCount}</span>
          <div className="mt-4 flex gap-2">
            {pendingCount > 0 && (
              <span className="px-2 py-1 bg-error-container text-on-error-container text-xs font-medium rounded-md flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Perlu Tindakan
              </span>
            )}
          </div>
        </div>
        <div className="bg-surface-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Disetujui</span>
          <span className="text-4xl font-display text-on-surface font-bold">{approvedCount}</span>
          <div className="mt-4 flex gap-2">
            <span className="px-2 py-1 bg-secondary-container text-on-secondary-container text-xs font-medium rounded-md">
              {totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0}% Selesai
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-6 space-y-8 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-outline-variant">
        {mockLogbookEntries.map((entry, index) => (
          <div key={entry.id} className={`relative flex items-start md:items-center justify-between md:justify-normal ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''} group`}>
            
            {/* Icon Marker */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-lowest shadow-sm shrink-0 md:order-1 z-10 ml-0 md:absolute md:left-1/2 md:-translate-x-1/2 ${
              entry.status === 'Menunggu' 
                ? 'bg-error-container text-on-error-container' 
                : 'bg-secondary-container text-primary'
            }`}>
              {entry.status === 'Menunggu' ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>

            {/* Content Card */}
            <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-surface-lowest p-6 rounded-xl border border-outline-variant shadow-sm ml-4 md:ml-0 relative transition-all duration-300 ${
              entry.status === 'Disetujui' ? 'opacity-80 hover:opacity-100' : ''
            }`}>
              {/* Arrow */}
              <div className={`absolute top-6 -left-3 md:top-1/2 md:-translate-y-1/2 w-3 h-3 bg-surface-lowest border-t border-l border-outline-variant rotate-[-45deg] ${
                index % 2 !== 0 ? 'md:left-auto md:-right-3 md:border-t-0 md:border-l-0 md:border-b md:border-r' : 'md:-left-3'
              }`}></div>
              
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-display font-semibold text-on-surface">{entry.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <time className="text-xs text-on-surface-variant">{entry.date}</time>
                    {entry.time && (
                      <>
                        <span className="text-xs text-outline">•</span>
                        <span className="text-xs text-on-surface-variant">{entry.time}</span>
                      </>
                    )}
                  </div>
                </div>
                {entry.status === 'Menunggu' ? (
                  <span className="px-2 py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded-md uppercase tracking-wider">Menunggu</span>
                ) : (
                  <span className="px-2 py-1 bg-surface-high text-on-surface text-[10px] font-bold rounded-md uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3 h-3" /> Disetujui
                  </span>
                )}
              </div>
              
              <p className="text-sm text-on-surface-variant mb-4">{entry.description}</p>
              
              {entry.imageUrl && (
                <div className="mb-4 rounded-lg overflow-hidden border border-outline-variant bg-surface-low aspect-video">
                  <img src={entry.imageUrl} alt="Dokumentasi" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Rating (for approved entries) */}
              {entry.status === 'Disetujui' && entry.rating && (
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= entry.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-outline'}`}
                    />
                  ))}
                  <span className="text-xs text-on-surface-variant ml-1">({entry.rating}/5)</span>
                </div>
              )}

              {/* Actions or Feedback */}
              {entry.status === 'Menunggu' ? (
                <div className="mt-4 pt-4 border-t border-outline-variant flex flex-col gap-3">
                  <textarea 
                    className="w-full bg-surface-low border border-outline-variant rounded-lg p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow placeholder:text-outline resize-none"
                    placeholder="Berikan komentar atau catatan untuk mahasiswa..."
                    rows={2}
                  ></textarea>

                  {/* Rating Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-on-surface-variant">Penilaian Kinerja:</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} className="p-0.5 hover:scale-110 transition-transform">
                          <Star className="w-5 h-5 text-outline hover:text-yellow-500 hover:fill-yellow-500 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 border border-error text-error rounded-lg hover:bg-error-container transition-colors text-xs font-medium">Revisi</button>
                    <button className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-colors text-xs font-medium shadow-sm">Setujui & Simpan</button>
                  </div>
                </div>
              ) : entry.feedback ? (
                <div className="mt-4 p-3 bg-surface-low rounded-lg border border-outline-variant">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-on-surface">Komentar Supervisor:</span>
                  </div>
                  <p className="text-sm text-on-surface-variant italic">{entry.feedback}</p>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button className="px-6 py-2 border border-outline-variant text-on-surface rounded-full hover:bg-surface-high transition-colors text-sm font-medium shadow-sm">
          Muat Lebih Banyak
        </button>
      </div>
    </div>
  );
}

LogbookScreen.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
