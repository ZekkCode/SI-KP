import InstansiLayout from '@/Layouts/InstansiLayout';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { BarChart2, CheckCircle2, FileSignature, Upload, X, ScanLine, Building2 } from 'lucide-react';
import Modal from '@/Components/Modal';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

interface Mahasiswa {
  name: string;
  nim: string;
}

interface Pendaftaran {
  id: number;
  mahasiswa: Mahasiswa;
  status_kp: string;
  is_dinilai: boolean;
  nilai_instansi: string | number | null;
  komponen_nilai: Record<string, string | number> | null;
}

interface Props {
  pendaftarans: Pendaftaran[];
  error?: string;
}

export default function EvaluationScreen({ pendaftarans, error }: Props) {
  const [selectedPendaftaran, setSelectedPendaftaran] = useState<Pendaftaran | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, setData, post, processing, reset, errors } = useForm({
    kedisiplinan: '',
    kerjasama: '',
    kinerja: '',
    catatan: '',
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

  const openGradingModal = (pendaftaran: Pendaftaran) => {
    setSelectedPendaftaran(pendaftaran);
    if (pendaftaran.komponen_nilai) {
      setData({
        kedisiplinan: pendaftaran.komponen_nilai.kedisiplinan?.toString() || '',
        kerjasama: pendaftaran.komponen_nilai.kerjasama?.toString() || '',
        kinerja: pendaftaran.komponen_nilai.kinerja?.toString() || '',
        catatan: '', 
      });
    } else {
      setData({
        kedisiplinan: '',
        kerjasama: '',
        kinerja: '',
        catatan: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPendaftaran(null);
      reset();
    }, 200);
  };

  const handleScoreChange = (field: keyof typeof data, value: string) => {
    if (field === 'catatan') {
      setData(field, value);
      return;
    }
    
    let num = parseInt(value, 10);
    if (isNaN(num)) {
      setData(field, '');
      return;
    }
    if (num > 100) num = 100;
    if (num < 0) num = 0;
    setData(field, num.toString());
  };

  const submitGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPendaftaran) return;

    post(route('instansi.evaluation.store', selectedPendaftaran.id), {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  // Helper to calculate runtime total for preview
  const disiplin = parseFloat(data.kedisiplinan) || 0;
  const kerja = parseFloat(data.kerjasama) || 0;
  const praktek = parseFloat(data.kinerja) || 0;
  // Bobot: Kedisiplinan 30%, Kerjasama 30%, Kinerja Praktis 40%
  const totalPreview = (disiplin * 0.3) + (kerja * 0.3) + (praktek * 0.4);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <PageHeader title="Penilaian Industri" description="Evaluasi performa dan kedisiplinan mahasiswa selama melaksanakan kerja praktik/magang." />

      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mt-2">
        <div className="overflow-x-auto">
          {pendaftarans.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <FileSignature size={48} className="text-outline mb-4 opacity-50" />
              <p className="font-body-lg text-on-surface">Belum ada mahasiswa</p>
              <p className="font-body-md text-secondary mt-1">Belum ada mahasiswa magang aktif atau yang telah selesai untuk dinilai.</p>
            </div>
          ) : (
            <ModernTable>
              <ModernTableHeader>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant text-sm font-medium">
                  <ModernTableTh>Mahasiswa</ModernTableTh>
                  <ModernTableTh>Status KP</ModernTableTh>
                  <ModernTableTh>Status Penilaian</ModernTableTh>
                  <ModernTableTh>Nilai Instansi</ModernTableTh>
                  <ModernTableTh>Aksi</ModernTableTh>
                </tr>
              </ModernTableHeader>
              <ModernTableBody>
                {pendaftarans.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <ModernTableTd>
                        <div className="font-medium text-on-surface">{p.mahasiswa.name}</div>
                        <div className="text-sm text-secondary">{p.mahasiswa.nim}</div>
                      </ModernTableTd>
                      <ModernTableTd>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-high text-on-surface rounded-md text-xs font-semibold border border-outline-variant">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {p.status_kp?.replace('_', ' ') || 'AKTIF'}
                        </span>
                      </ModernTableTd>
                      <ModernTableTd>
                        {p.is_dinilai ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                            <CheckCircle2 size={14} /> Sudah Dinilai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                            Belum Dinilai
                          </span>
                        )}
                      </ModernTableTd>
                      <ModernTableTd>
                        {p.nilai_instansi !== null ? (
                          <div className="text-xl font-display font-bold text-on-surface">
                            {Number(p.nilai_instansi).toFixed(1)}
                          </div>
                        ) : (
                          <span className="text-outline">-</span>
                        )}
                      </ModernTableTd>
                      <ModernTableTd>
                        <button 
                          onClick={() => openGradingModal(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            !p.is_dinilai 
                              ? 'bg-primary text-on-primary hover:bg-primary/90 shadow-sm'
                              : 'border border-outline text-secondary hover:bg-surface-container'
                          }`}
                        >
                          {!p.is_dinilai ? 'Beri Nilai' : 'Ubah Nilai'}
                        </button>
                      </ModernTableTd>
                    </tr>
                  );
                })}
              </ModernTableBody>
            </ModernTable>
          )}
        </div>
      </div>

      <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
        <div className="p-0">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-semibold text-on-surface">Evaluasi Industri (Pembimbing Lapangan)</h2>
              {selectedPendaftaran && (
                <p className="text-sm text-on-surface-variant mt-1">
                  {selectedPendaftaran.mahasiswa.name} ({selectedPendaftaran.mahasiswa.nim})
                </p>
              )}
            </div>
            <button onClick={closeModal} className="text-on-surface-variant hover:bg-surface-container p-1.5 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={submitGrading} className="p-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 mb-6">
              <h3 className="text-sm font-display font-semibold text-on-surface mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                Parameter Penilaian Kinerja (0-100)
              </h3>
              
              <div className="space-y-4">
                {[
                  { id: 'kedisiplinan', label: 'Kedisiplinan & Etika Kerja (30%)', error: errors.kedisiplinan },
                  { id: 'kerjasama', label: 'Kemampuan Bekerjasama (Tim) (30%)', error: errors.kerjasama },
                  { id: 'kinerja', label: 'Kinerja Praktis & Pemahaman (40%)', error: errors.kinerja }
                ].map((param) => (
                  <div key={param.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-sm font-medium text-on-surface-variant sm:w-2/3">{param.label}</label>
                    <div className="sm:w-1/3 flex flex-col">
                      <input 
                        type="number" 
                        min="0" max="100" 
                        value={data[param.id as keyof typeof data]}
                        onChange={(e) => handleScoreChange(param.id as keyof typeof data, e.target.value)}
                        placeholder="0 - 100"
                        className="w-full bg-surface border border-outline-variant rounded-lg p-2 text-sm text-center font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                      />
                      {param.error && <span className="text-[10px] text-error mt-1">{param.error}</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-5 mt-5 border-t border-outline-variant">
                <div className="flex justify-between items-center bg-surface-low p-4 rounded-xl border border-outline-variant">
                  <span className="text-sm font-display font-semibold text-on-surface">Agregasi Nilai Instansi</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-display font-bold text-primary">{totalPreview.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="catatan" className="block text-sm font-medium text-on-surface mb-2">
                Catatan / Kesan Pesan (Opsional)
              </label>
              <textarea
                id="catatan"
                rows={3}
                value={data.catatan}
                onChange={(e) => handleScoreChange('catatan', e.target.value)}
                placeholder="Berikan masukan menyeluruh atas hasil kerja praktik mahasiswa..."
                className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
              ></textarea>
              {errors.catatan && <p className="text-error text-xs mt-1">{errors.catatan}</p>}
            </div>

            <div className="flex items-center gap-3 bg-secondary-container/30 border border-secondary-container p-4 rounded-xl mb-6">
              <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center shrink-0">
                <ScanLine className="w-5 h-5" />
              </div>
              <div className="text-xs text-on-surface-variant leading-relaxed">
                <span className="font-semibold block text-on-surface">Otentikasi Digital</span>
                Penilaian ini merupakan keputusan yang sah dari pihak Instansi/Perusahaan tempat mahasiswa melaksanakan kerja praktik.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-outline text-secondary text-sm font-medium rounded-lg hover:bg-surface-container transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={processing || data.kedisiplinan === '' || data.kerjasama === '' || data.kinerja === ''}
                className="px-6 py-2 bg-primary text-on-primary text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
              >
                <Upload size={16} />
                {processing ? 'Menyimpan...' : 'Simpan Nilai'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

EvaluationScreen.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
