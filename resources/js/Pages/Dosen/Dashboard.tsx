import DosenLayout from '@/Layouts/DosenLayout';
import { Link } from '@inertiajs/react';
import { Users, Clock, TrendingUp, ArrowRight } from 'lucide-react';
const mockStudents = [
  { id: 1, avatarInitials: 'AW', name: 'Andi Wijaya', nim: '120140001', company: 'PT PINDAD (Persero)', status: 'Menunggu Review Proposal' },
  { id: 2, avatarInitials: 'BS', name: 'Budi Santoso', nim: '120140002', company: 'PT Dirgantara Indonesia', status: 'Pelaksanaan KP' },
];

export default function DashboardScreen() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">Dashboard Pembimbing</h1>
          <p className="text-sm text-on-surface-variant mt-1">Ringkasan aktivitas bimbingan Kerja Praktik mahasiswa.</p>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quota Card */}
        <div className="bg-surface-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary-container rounded-full opacity-20"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Kuota Bimbingan</span>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-4xl font-display text-primary font-bold">2</span>
                <span className="text-sm text-on-surface-variant mb-1">/ 4 Mahasiswa</span>
              </div>
            </div>
            <div className="bg-primary-container text-primary p-3 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-surface-high rounded-full h-2 mt-2 relative z-10">
            <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
          </div>
          <p className="text-xs text-secondary mt-1 relative z-10">Sisa 2 slot bimbingan tersedia.</p>
        </div>

        {/* Pending Review */}
        <div className="bg-surface-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Review Proposal</span>
              <span className="text-3xl font-display text-on-surface font-bold mt-2">1</span>
            </div>
            <div className="bg-surface-high text-on-surface-variant p-3 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-secondary mt-auto pt-4 border-t border-outline-variant">Menunggu persetujuan Anda.</p>
        </div>

        {/* Active Monitoring */}
        <div className="bg-surface-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Pelaksanaan KP</span>
              <span className="text-3xl font-display text-on-surface font-bold mt-2">1</span>
            </div>
            <div className="bg-secondary-container text-on-secondary-container p-3 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-secondary mt-auto pt-4 border-t border-outline-variant">Mahasiswa sedang di instansi.</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col overflow-hidden">
        <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface-lowest">
          <h2 className="text-lg font-display font-semibold text-on-surface">Daftar Mahasiswa Bimbingan</h2>
          <button className="text-primary text-sm font-medium hover:bg-surface-low px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-surface-low border-b border-outline-variant">
                <th className="p-4 text-xs font-semibold text-on-surface-variant">Nama Mahasiswa</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant">NIM</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant">Instansi Tujuan</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant">Status Tahapan</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((student) => (
                <tr key={student.id} className="border-b border-outline-variant last:border-b-0 hover:bg-surface-low transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        student.status === 'Menunggu Review Proposal' ? 'bg-primary-container text-primary' : 'bg-secondary-container text-on-secondary-container'
                      }`}>
                        {student.avatarInitials}
                      </div>
                      <span className="text-sm font-medium text-on-surface">{student.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-on-surface-variant">{student.nim}</td>
                  <td className="p-4 text-sm text-on-surface">{student.company}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                      student.status === 'Menunggu Review Proposal' 
                        ? 'bg-surface-high text-on-surface-variant border-outline-variant'
                        : 'bg-secondary-container text-on-secondary-container border-secondary/20'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {student.status === 'Menunggu Review Proposal' ? (
                      <Link 
                        href="/dosen/review-proposal"
                        className="bg-primary text-on-primary text-xs font-medium px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity shadow-sm inline-block"
                      >
                        Review
                      </Link>
                    ) : (
                      <Link 
                        href="/dosen/logbook"
                        className="border border-outline text-on-surface-variant text-xs font-medium px-4 py-1.5 rounded-lg hover:bg-surface-high transition-colors inline-block"
                      >
                        Logbook
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

DashboardScreen.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
