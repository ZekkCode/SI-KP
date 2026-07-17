import DosenLayout from '@/Layouts/DosenLayout';
import { ChevronRight, Edit3, CheckCircle2 } from 'lucide-react';
import PdfViewer from '@/Components/PdfViewer';

const mockStudents = [
  {
    id: 1,
    name: 'Budi Santoso',
    nim: '120140123',
    avatarInitials: 'BS',
    proposalTitle: 'Sistem Informasi Manajemen Cuti Pegawai Berbasis Web',
    company: 'PT Telkom Indonesia (Persero) Tbk',
    submissionDate: '12 Oktober 2023',
  }
];

export default function ReviewProposalScreen() {
  const student = mockStudents[0];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-2">
          <span className="hover:text-primary cursor-pointer transition-colors">Review Proposal</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-on-surface">Validasi Dokumen</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">Review & Validasi Proposal KP</h1>
        <p className="text-sm text-on-surface-variant mt-1">Periksa dokumen proposal kerja praktik mahasiswa dan berikan penilaian persetujuan.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Document Preview */}
        <div className="xl:col-span-2">
          <PdfViewer title="Proposal_KP_Budi_Santoso_v2.pdf" />
        </div>

        {/* Right Column: Info & Actions */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* Student Info Card */}
          <div className="bg-surface-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
            <h3 className="text-lg font-display font-semibold text-on-surface mb-5">Informasi Mahasiswa</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-display font-bold text-lg">
                {student.avatarInitials}
              </div>
              <div>
                <div className="text-sm font-semibold text-on-surface">{student.name}</div>
                <div className="text-xs text-on-surface-variant">NIM. {student.nim}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-medium text-on-surface-variant mb-1">Judul Proposal</div>
                <div className="text-sm text-on-surface font-medium leading-snug">{student.proposalTitle}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-on-surface-variant mb-1">Lokasi KP</div>
                <div className="text-sm text-on-surface">{student.company}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-on-surface-variant mb-1">Tanggal Pengajuan</div>
                <div className="text-sm text-on-surface">{student.submissionDate}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-on-surface-variant mb-1">Status Saat Ini</div>
                <span className="inline-block px-2.5 py-1 bg-surface-high text-on-surface-variant rounded text-[10px] font-bold uppercase tracking-wider mt-1">
                  Menunggu Review
                </span>
              </div>
            </div>
          </div>

          {/* Feedback & Actions Card */}
          <div className="bg-surface-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex-1 flex flex-col">
            <h3 className="text-lg font-display font-semibold text-on-surface mb-4">Feedback & Keputusan</h3>
            
            <div className="mb-6 flex-1 flex flex-col">
              <label htmlFor="feedback" className="block text-xs font-medium text-on-surface-variant mb-2">
                Catatan Revisi / Tanggapan
              </label>
              <textarea 
                id="feedback"
                className="w-full flex-1 min-h-[120px] p-3 bg-surface-low border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none placeholder:text-outline"
                placeholder="Tuliskan catatan perbaikan atau feedback untuk mahasiswa di sini..."
              ></textarea>
            </div>

            <div className="flex gap-3 mt-auto pt-4 border-t border-outline-variant">
              <button className="flex-1 flex justify-center items-center gap-2 py-2.5 border border-outline text-secondary text-sm font-medium rounded-lg hover:bg-surface-low active:scale-95 transition-all">
                <Edit3 className="w-4 h-4" />
                Revisi
              </button>
              <button className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-primary text-on-primary text-sm font-medium rounded-lg hover:bg-opacity-90 active:scale-95 transition-all shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
                Setuju
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReviewProposalScreen.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
