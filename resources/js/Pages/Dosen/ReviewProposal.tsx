import DosenLayout from '@/Layouts/DosenLayout';
import { Link } from '@inertiajs/react';
import { FileText, Clock } from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

interface Mahasiswa {
  name: string;
  nim: string;
}

interface Pendaftaran {
  mahasiswa: Mahasiswa;
}

interface Proposal {
  id: number;
  judul: string;
  abstrak: string | null;
  path_file: string | null;
  status: string;
  submitted_at: string | null;
  pendaftaran: Pendaftaran;
}

interface Props {
  proposals: Proposal[];
}

export default function ReviewProposalScreen({ proposals }: Props) {

  const formatStatus = (status: string) => {
    switch (status) {
      case 'diajukan': return { label: 'Menunggu Review', color: 'bg-error-container text-error' };
      case 'revisi': return { label: 'Revisi', color: 'bg-tertiary-container text-on-tertiary-container' };
      case 'disetujui': return { label: 'Disetujui', color: 'bg-primary-container text-on-primary-container' };
      default: return { label: status, color: 'bg-surface-variant text-on-surface-variant' };
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <PageHeader title="Review Proposal" description="Daftar proposal mahasiswa bimbingan yang membutuhkan persetujuan." />

      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mt-2">
        <div className="overflow-x-auto">
          {proposals.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <FileText size={48} className="text-outline mb-4 opacity-50" />
              <p className="font-body-lg text-on-surface">Belum ada proposal masuk</p>
              <p className="font-body-md text-secondary mt-1">Mahasiswa bimbingan Anda belum ada yang mengajukan proposal.</p>
            </div>
          ) : (
            <ModernTable>
              <ModernTableHeader>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant text-sm font-medium">
                  <ModernTableTh>Mahasiswa</ModernTableTh>
                  <ModernTableTh>Judul Proposal</ModernTableTh>
                  <ModernTableTh>Tanggal Pengajuan</ModernTableTh>
                  <ModernTableTh>Status</ModernTableTh>
                  <ModernTableTh>Aksi</ModernTableTh>
                </tr>
              </ModernTableHeader>
              <ModernTableBody>
                {proposals.map((proposal) => {
                  const statusUi = formatStatus(proposal.status);
                  
                  return (
                    <tr key={proposal.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <ModernTableTd>
                        <div className="font-medium text-on-surface">{proposal.pendaftaran.mahasiswa.name}</div>
                        <div className="text-sm text-secondary">{proposal.pendaftaran.mahasiswa.nim}</div>
                      </ModernTableTd>
                      <ModernTableTd>
                        <div className="text-sm font-medium text-on-surface line-clamp-2" title={proposal.judul}>
                          {proposal.judul}
                        </div>
                      </ModernTableTd>
                      <ModernTableTd>
                        <div className="text-sm text-secondary flex items-center gap-1.5">
                          <Clock size={14} />
                          {proposal.submitted_at ? new Date(proposal.submitted_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          }) : '-'}
                        </div>
                      </ModernTableTd>
                      <ModernTableTd>
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusUi.color}`}>
                          {statusUi.label}
                        </span>
                      </ModernTableTd>
                      <ModernTableTd>
                        <Link 
                          href={route('dosen.review.show', proposal.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            proposal.status === 'diajukan' 
                              ? 'bg-primary text-on-primary hover:bg-primary/90 shadow-sm'
                              : 'border border-outline text-secondary hover:bg-surface-container'
                          }`}
                        >
                          {proposal.status === 'diajukan' ? (
                            <>Review</>
                          ) : (
                            <>Lihat Review</>
                          )}
                        </Link>
                      </ModernTableTd>
                    </tr>
                  );
                })}
              </ModernTableBody>
            </ModernTable>
          )}
        </div>
      </div>
    </div>
  );
}

ReviewProposalScreen.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
