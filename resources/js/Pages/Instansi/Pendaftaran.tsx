import InstansiLayout from '@/Layouts/InstansiLayout';
import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { CheckCircle2, XCircle, FileText, Download, Building2, X } from 'lucide-react';
import Modal from '@/Components/Modal';

interface Mahasiswa {
  name: string;
  nim: string;
  program_studi?: {
    nama: string;
  };
}

interface SuratPengantar {
  nomor_surat: string;
  path_file: string;
}

interface Pendaftaran {
  id: number;
  mahasiswa: Mahasiswa;
  surat_pengantar: SuratPengantar | null;
  status: string;
  tanggal_pengajuan: string;
}

interface Props {
  pendaftarans: Pendaftaran[];
  error?: string;
}

export default function PendaftaranScreen({ pendaftarans, error }: Props) {
  const [selectedPendaftaran, setSelectedPendaftaran] = useState<Pendaftaran | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'diterima_instansi' | 'ditolak_instansi'>('diterima_instansi');

  const { put, processing, reset } = useForm<{ status: string }>({
    status: '',
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <Building2 size={64} className="text-error" />
        <h2 className="text-xl font-display font-semibold text-on-surface">Akses Ditolak</h2>
        <p className="text-secondary text-center max-w-md">{error}</p>
      </div>
    );
  }

  const openConfirmModal = (pendaftaran: Pendaftaran, action: 'diterima_instansi' | 'ditolak_instansi') => {
    setSelectedPendaftaran(pendaftaran);
    setActionType(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPendaftaran(null);
      reset();
    }, 200);
  };

  const submitAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPendaftaran) return;

    router.put(route('instansi.pendaftaran.update', selectedPendaftaran.id), { status: actionType }, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'surat_terbit': return { label: 'Menunggu Respons', color: 'bg-error-container text-error border-error-container' };
      case 'diterima_instansi': return { label: 'Diterima', color: 'bg-primary-container text-on-primary-container border-primary-container' };
      case 'ditolak_instansi': return { label: 'Ditolak', color: 'bg-tertiary-container text-on-tertiary-container border-tertiary-container' };
      default: return { label: status.replace(/_/g, ' ').toUpperCase(), color: 'bg-surface-variant text-on-surface-variant border-outline-variant' };
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">Pendaftaran Mahasiswa</h1>
        <p className="text-sm text-on-surface-variant mt-1">Kelola persetujuan mahasiswa yang melamar magang/kerja praktik di instansi Anda.</p>
      </div>

      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mt-2">
        <div className="overflow-x-auto">
          {pendaftarans.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <FileText size={48} className="text-outline mb-4 opacity-50" />
              <p className="font-body-lg text-on-surface">Belum ada pendaftar</p>
              <p className="font-body-md text-secondary mt-1">Belum ada mahasiswa yang memilih instansi Anda sebagai tempat magang.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant text-sm font-medium">
                  <th className="py-4 px-5 w-1/4">Profil Mahasiswa</th>
                  <th className="py-4 px-5">Surat Pengantar</th>
                  <th className="py-4 px-5">Status Terkini</th>
                  <th className="py-4 px-5 text-center">Keputusan Instansi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {pendaftarans.map((p) => {
                  const statusUi = formatStatus(p.status);
                  
                  return (
                    <tr key={p.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="py-4 px-5 align-top">
                        <div className="font-medium text-on-surface">{p.mahasiswa.name}</div>
                        <div className="text-sm text-secondary">{p.mahasiswa.nim}</div>
                        {p.mahasiswa.program_studi && (
                          <div className="text-xs text-on-surface-variant mt-1">{p.mahasiswa.program_studi.nama}</div>
                        )}
                      </td>
                      <td className="py-4 px-5 align-top">
                        {p.surat_pengantar ? (
                          <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-on-surface">No: {p.surat_pengantar.nomor_surat}</span>
                            <a 
                              href={`/storage/${p.surat_pengantar.path_file}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline w-max"
                            >
                              <Download size={14} /> Unduh Surat
                            </a>
                          </div>
                        ) : (
                          <span className="text-sm text-outline italic">Dokumen belum terbit</span>
                        )}
                        <div className="text-xs text-secondary mt-2">Diajukan pada: {p.tanggal_pengajuan}</div>
                      </td>
                      <td className="py-4 px-5 align-top">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${statusUi.color}`}>
                          {statusUi.label}
                        </span>
                      </td>
                      <td className="py-4 px-5 align-top text-center">
                        {p.status === 'surat_terbit' ? (
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => openConfirmModal(p, 'diterima_instansi')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container text-on-primary-container border border-primary-container hover:border-primary rounded-lg text-sm font-medium transition-colors"
                            >
                              <CheckCircle2 size={16} /> Terima
                            </button>
                            <button 
                              onClick={() => openConfirmModal(p, 'ditolak_instansi')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-error-container text-on-error-container border border-error-container hover:border-error rounded-lg text-sm font-medium transition-colors"
                            >
                              <XCircle size={16} /> Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-secondary italic">Sudah direspons</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
        <form onSubmit={submitAction} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mb-4 ${actionType === 'diterima_instansi' ? 'bg-primary-container text-primary' : 'bg-error-container text-error'}`}>
              {actionType === 'diterima_instansi' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
            </div>
            <button type="button" onClick={closeModal} className="text-on-surface-variant hover:bg-surface-container p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <h2 className="text-xl font-display font-semibold text-on-surface mb-2">
            Konfirmasi Keputusan
          </h2>
          
          <p className="text-sm text-on-surface-variant mb-6">
            Apakah Anda yakin ingin <strong className={actionType === 'diterima_instansi' ? 'text-primary' : 'text-error'}>{actionType === 'diterima_instansi' ? 'MENERIMA' : 'MENOLAK'}</strong> permohonan magang dari mahasiswa <strong>{selectedPendaftaran?.mahasiswa.name}</strong>?
            Keputusan ini akan diteruskan ke pihak Universitas dan Mahasiswa yang bersangkutan.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-outline text-secondary text-sm font-medium rounded-lg hover:bg-surface-container transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={processing}
              className={`px-6 py-2 text-on-primary text-sm font-medium rounded-lg disabled:opacity-50 transition-colors shadow-sm ${
                actionType === 'diterima_instansi' ? 'bg-primary hover:bg-primary/90' : 'bg-error hover:bg-error/90'
              }`}
            >
              {processing ? 'Menyimpan...' : 'Ya, Konfirmasi'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

PendaftaranScreen.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
