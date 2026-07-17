import TULayout from '@/Layouts/TULayout';
import { Eye, ZoomIn, ZoomOut, CheckCircle, Info, BadgeCheck, Download, ChevronDown, Undo2, FileIcon, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const STUDENTS = [
  { 
    id: '1', 
    name: 'Budi Santoso', 
    nim: '123456789', 
    prodi: 'S1 Teknik Informatika', 
    semester: 'VII (Tujuh)', 
    sks: '110 SKS',
    perusahaan: 'PT. Teknologi Inovasi Nusantara', 
    alamat: 'Gedung Cyber Tower Lt. 15\nJakarta Selatan, Indonesia', 
    periode: '1 November 2024 s.d 31 Desember 2024',
    docs: [
      { name: 'Kartu Rencana Studi (KRS) Semester Berjalan.pdf', date: '12 Okt 2023, 10:23 WIB', size: '1.2 MB' },
      { name: 'Transkrip Nilai Akademik Terakhir.pdf', date: '12 Okt 2023, 10:25 WIB', size: '2.4 MB' }
    ]
  },
  { 
    id: '2', 
    name: 'Ahmad Hidayat', 
    nim: '987654321', 
    prodi: 'S1 Sistem Informasi', 
    semester: 'VII (Tujuh)', 
    sks: '105 SKS',
    perusahaan: 'PT. Maju Bersama Jaya', 
    alamat: 'Kawasan Industri Terpadu Blok A2\nBandung, Jawa Barat', 
    periode: '15 November 2024 s.d 15 Januari 2025',
    docs: [
      { name: 'KRS Semester 7.pdf', date: '14 Okt 2023, 09:10 WIB', size: '1.1 MB' },
      { name: 'Transkrip_Siti.pdf', date: '14 Okt 2023, 09:12 WIB', size: '2.1 MB' }
    ]
  },
];

export default function GenerateSurat() {
  const [step, setStep] = useState<'verifikasi' | 'pratinjau'>('verifikasi');
  const [verifying, setVerifying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(STUDENTS[0]);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setShowModal(true);
    }, 1500);
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStudent(STUDENTS.find(s => s.id === e.target.value) || STUDENTS[0]);
    setStep('verifikasi');
    setShowFeedback(false);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-display font-semibold text-on-surface">Proses Surat Pengantar</h2>
          <p className="text-on-surface-variant mt-1">Verifikasi berkas mahasiswa dan generate surat pengantar resmi.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-6 mb-6">
        <h3 className="text-sm font-semibold text-on-surface-variant mb-3 uppercase tracking-wider">Pilih Antrean Mahasiswa</h3>
        <div className="relative max-w-lg">
          <select 
            className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-medium cursor-pointer hover:bg-surface-container-low transition-colors"
            value={selectedStudent.id}
            onChange={handleStudentChange}
          >
            {STUDENTS.map(s => (
              <option key={s.id} value={s.id}>{s.name} - {s.nim} ({s.perusahaan})</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" size={18} />
        </div>
      </div>

      {step === 'verifikasi' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
              <h2 className="text-xl font-display font-semibold text-on-surface mb-6 border-b border-surface-variant pb-3">Informasi Mahasiswa</h2>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-24 h-24 rounded-lg bg-surface-container-high overflow-hidden shrink-0 border border-outline-variant shadow-sm">
                  <img 
                    alt="Student Profile Photo" 
                    className="object-cover w-full h-full" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBRlzGU-GrW16vOx67zzi0ZeF5bRRHaTE2tYtCIs_hUt6n2exXoI44QdeTrpAISq97RGZnzVwyguA-AuD5gT2BuUEuXQmdqPIi9TQOLtWcZb9RumQIfavEYFTp6rrRn4iE7X8hZG1NPB2u_3FEae_Md6P_WqApG5jKgsnZ7gmcyeoa8MYNEKs2f1CJieZFI0n1MSjHIMg9svpw3Rl0cAVL6jDOnZ2tW-dqkV1ibiO3fM3rU07RHW5ckZj60Tox5iEX_YXawa-xMgE"
                  />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Nama Lengkap</label>
                    <div className="text-base text-on-surface font-medium">{selectedStudent.name}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">NIM</label>
                    <div className="text-base text-on-surface font-medium">{selectedStudent.nim}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Program Studi</label>
                    <div className="text-base text-on-surface font-medium">{selectedStudent.prodi}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Total SKS Lulus</label>
                    <div className="text-base text-on-surface font-medium">{selectedStudent.sks}</div>
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <label className="block text-xs font-medium text-on-surface-variant mb-2">Rencana Tempat KP</label>
                    <div className="text-sm text-on-surface bg-surface-container-low p-4 rounded-lg border border-surface-variant">
                      <strong className="block text-base mb-1">{selectedStudent.perusahaan}</strong>
                      {selectedStudent.alamat.split('\n').map((line, i) => (
                        <span key={i} className="block">{line}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
              <h2 className="text-xl font-display font-semibold text-on-surface mb-6 border-b border-surface-variant pb-3">Dokumen Pendukung</h2>
              <div className="space-y-4">
                {selectedStudent.docs.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors group cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded bg-error-container text-error flex items-center justify-center shrink-0">
                        <FileIcon size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-on-surface">{doc.name}</div>
                        <div className="text-xs text-on-surface-variant">Diunggah pada {doc.date} • {doc.size}</div>
                      </div>
                    </div>
                    <button className="text-primary hover:bg-primary-container/20 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                      <Eye size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 border border-surface-variant rounded-lg bg-surface-container-lowest h-64 flex flex-col items-center justify-center text-on-surface-variant relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtgSb7n-BOOXhqdRz_6nohM5CjnyFB1o4CO1NfuYS2iFGkjWgaujiW2zCpmkMcissUXr9HLGS_pjdPld_ZVaakbsbT977cq8qHZ4YnQSn4ylxufqC3FdVAmjIYXd2_juppyB-oQIQKdQrmIP8zQwkyJSZLhUL4jJXBUKNAx9tKx27AwqvkfxFO-kwzW_fLXQher1YvZxJ4Gt8J1WAai2trcIIR4cW_fWRDWY36095sXKidZKcj8cqWsHu6vRe9mQg_dOkl5ieYxsw')" }}></div>
                <Search size={48} className="mb-4 opacity-50 relative z-10" />
                <p className="text-sm relative z-10 text-center font-medium">Pilih dokumen di atas untuk mempratinjau<br/><span className="text-xs font-normal">Sistem akan menampilkan pratinjau dokumen di area ini</span></p>
              </div>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-display font-semibold text-on-surface mb-6 border-b border-surface-variant pb-3">Tindakan Verifikasi</h2>
              <p className="text-sm text-on-surface-variant mb-6">Pastikan semua dokumen valid dan memenuhi syarat akademik sebelum membuat surat pengantar.</p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setStep('pratinjau')}
                  className="w-full bg-primary text-white hover:bg-primary/90 py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle size={20} />
                  <span>Verifikasi & Lanjut Pratinjau</span>
                  <ArrowRight size={20} />
                </button>
                <button 
                  onClick={() => setShowFeedback(true)}
                  className={`w-full border py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2
                    ${showFeedback ? 'bg-surface-container border-outline-variant text-on-surface-variant' : 'border-secondary text-secondary hover:bg-surface-container-low'}
                  `}
                >
                  <Undo2 size={20} />
                  <span>Kembalikan untuk Perbaikan</span>
                </button>
              </div>

              {showFeedback && (
                <div className="mt-6 pt-6 border-t border-surface-variant animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="block text-sm font-semibold text-on-surface mb-2">Catatan Perbaikan <span className="text-error">*</span></label>
                  <textarea 
                    className="w-full border border-outline-variant rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant" 
                    placeholder="Tuliskan alasan pengembalian berkas secara spesifik..." 
                    rows={4}
                    autoFocus
                  ></textarea>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button 
                      onClick={() => setShowFeedback(false)}
                      className="px-4 py-2 text-secondary hover:bg-surface-container-low rounded-lg text-sm font-medium transition-colors"
                    >
                      Batal
                    </button>
                    <button className="px-4 py-2 bg-error text-white hover:bg-error/90 rounded-lg text-sm font-bold transition-colors shadow-sm">
                      Kirim Catatan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 'pratinjau' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden flex flex-col h-[800px]">
            <div className="bg-surface-container-highest px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-2 text-on-surface">
                <Eye className="text-primary" size={20} />
                <span className="font-medium">Pratinjau Dokumen PDF</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded text-secondary hover:bg-surface-variant transition-colors">
                  <ZoomOut size={18} />
                </button>
                <button className="p-2 rounded text-secondary hover:bg-surface-variant transition-colors">
                  <ZoomIn size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-surface-variant/30 p-8 overflow-y-auto flex justify-center items-start">
              <div className="bg-white w-full max-w-[650px] min-h-[900px] shadow-md p-12 flex flex-col text-sm text-on-surface">
                <div className="flex items-center border-b-[3px] border-on-surface pb-6 mb-8">
                  <div className="w-20 h-20 bg-surface-container flex items-center justify-center shrink-0">
                    <img 
                      className="w-16 h-16 object-contain" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcYI-cxVibUaX-TsGqqDgu1W0ZAWpp6kbny_PUKWUTQ4IkhlzMU8YocEgbIjortS1a8dmcD6erxZ-uUuIybhKdrrnD_l0cYmKdOB6nBK7B6rCq6e649ycBlDE5EIaZFspiSArmk9WFDyJJYe6EINJi1E2z0H0zPSMMncdw0GdN6GqczG2iM-wfIUatYYqkSrtwhmP8H0fIZkaPOYkleUSN_kwv9TcmuBf5rMW4rgWhlwof4ttnj7rSf0dnIp_BJUE2iNlHJB4PBrw" 
                      alt="Logo" 
                    />
                  </div>
                  <div className="flex-1 text-center px-4">
                    <h3 className="font-display font-bold uppercase tracking-wide">Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi</h3>
                    <h2 className="text-lg font-display font-extrabold uppercase mt-1">Universitas Teknologi Nasional</h2>
                    <h4 className="font-display font-bold uppercase mt-1">Fakultas Ilmu Komputer</h4>
                    <p className="text-xs text-on-surface-variant mt-2">Jl. Pendidikan Raya No. 123, Kota Akademik, 45123</p>
                    <p className="text-xs text-on-surface-variant">Telp: (021) 555-1234 | Email: dekanat@fik.utn.ac.id | Web: fik.utn.ac.id</p>
                  </div>
                </div>

                <div className="flex justify-between mb-8">
                  <div>
                    <div className="flex gap-4"><span className="w-20">Nomor</span><span>: 1245/UN.XX/AK.KP/2024</span></div>
                    <div className="flex gap-4"><span className="w-20">Lampiran</span><span>: 1 (satu) berkas proposal</span></div>
                    <div className="flex gap-4"><span className="w-20">Perihal</span><span>: Permohonan Kerja Praktik (KP)</span></div>
                  </div>
                  <div className="text-right">
                    <span>24 Oktober 2024</span>
                  </div>
                </div>

                <div className="mb-8">
                  <p>Yth. Pimpinan HRD / Direktur Utama</p>
                  <p className="font-bold">{selectedStudent.perusahaan}</p>
                  {selectedStudent.alamat.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                <div className="text-justify leading-relaxed flex-1 space-y-4">
                  <p>Dengan hormat,</p>
                  <p>Dalam rangka memenuhi persyaratan kurikulum akademik dan meningkatkan kompetensi praktis mahasiswa, bersama ini kami memohon kesediaan Bapak/Ibu untuk menerima mahasiswa kami melaksanakan program Kerja Praktik (KP) di instansi/perusahaan yang Bapak/Ibu pimpin.</p>
                  <p>Adapun data mahasiswa tersebut adalah sebagai berikut:</p>
                  <table className="w-full mt-4 mb-4 border-collapse">
                    <tbody>
                      <tr><td className="py-1 w-40">Nama Lengkap</td><td>: <strong>{selectedStudent.name}</strong></td></tr>
                      <tr><td className="py-1 w-40">NIM</td><td>: {selectedStudent.nim}</td></tr>
                      <tr><td className="py-1 w-40">Program Studi</td><td>: {selectedStudent.prodi}</td></tr>
                      <tr><td className="py-1 w-40">Semester</td><td>: {selectedStudent.semester}</td></tr>
                    </tbody>
                  </table>
                  <p>Kerja Praktik ini direncanakan akan dilaksanakan selama 2 (dua) bulan, mulai tanggal <strong>{selectedStudent.periode.split(' s.d ')[0]}</strong> s.d <strong>{selectedStudent.periode.split(' s.d ')[1]}</strong> (atau menyesuaikan dengan kebijakan perusahaan).</p>
                  <p>Demikian surat permohonan ini kami sampaikan. Atas perhatian dan kerjasamanya yang baik, kami ucapkan terima kasih.</p>
                </div>

                <div className="flex justify-between items-end mt-12">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-white border-2 border-outline-variant p-2 mb-2">
                      <div 
                        className="w-full h-full bg-cover bg-center" 
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGhxhznv1Fve27AmCZIFr5wrCClrL2q_cBUqlxiuaTb2Lp-8V1O3x46KoP47ZJwhZdlAiHeA2Fm-UMPE8vx5UEm5WH1W74Mx-S0z4dcTe0gk306ddJUzOCYvcFTX291_CmB93_5l23irdtkGFPTLh0lFSfCKFlJZ27z4yc4jgqRpGzYR26N6UP9hKAEmyPSwkMiUp1W79-ZX0oLoBvPzgq49-dRpO6LPp0CDFTwjoHk_OcqV3-s8yP0VlJ4GRt1jXSenx-BKKc1nI')" }}
                      ></div>
                    </div>
                    <span className="text-xs text-on-surface-variant text-center max-w-[120px]">Scan untuk validasi keaslian surat</span>
                  </div>
                  <div className="text-center w-64">
                    <p className="mb-16">Wakil Dekan Bidang Akademik,</p>
                    <div className="border-b border-on-surface pb-1 mb-1">
                      <p className="font-bold">Dr. Budi Santoso, M.Kom.</p>
                    </div>
                    <p>NIP. 19800101 200501 1 001</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
              <h3 className="text-xl font-display font-semibold text-on-surface mb-4">Tindakan Akhir</h3>
              
              <div className="bg-surface-container-low rounded-lg p-4 mb-6 border border-outline-variant/50">
                <ul className="space-y-3 text-sm text-on-surface">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-primary shrink-0" size={20} />
                    <span>Data diri dan perusahaan telah divalidasi.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-primary shrink-0" size={20} />
                    <span>Nomor surat telah dialokasikan otomatis.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="text-secondary shrink-0" size={20} />
                    <span>Silakan periksa kembali detail surat pada panel pratinjau sebelum membuat surat.</span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={() => setStep('verifikasi')}
                className="w-full bg-surface hover:bg-surface-container border border-outline-variant text-on-surface py-3 px-4 rounded-lg font-medium transition-all shadow-sm flex items-center justify-center gap-2 mb-3"
              >
                <ArrowLeft size={18} />
                Kembali ke Verifikasi
              </button>

              <button 
                onClick={handleVerify}
                disabled={verifying}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {verifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <BadgeCheck size={20} />
                    Buat Surat Resmi
                  </>
                )}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-6">
              <h3 className="text-lg font-display font-semibold text-on-surface mb-3 flex items-center gap-2">
                <Info className="text-tertiary" size={20} />
                Informasi
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Surat yang telah diverifikasi dan dibuat (digenerate) akan dilengkapi dengan tanda tangan digital tersertifikasi dan stempel instansi berbasis QR Code. Dokumen tidak perlu dicetak ulang untuk mendapatkan tanda tangan basah.
              </p>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-primary-container/20 p-6 flex justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                <CheckCircle className="text-primary" size={48} />
              </div>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-display font-bold text-on-surface mb-2">Surat Berhasil Dibuat!</h3>
              <p className="text-on-surface-variant mb-6 text-sm">
                Surat pengantar resmi Anda telah berhasil di-generate dan divalidasi. Dokumen PDF sekarang tersedia dan tersimpan aman di akun Anda.
              </p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => { setShowModal(false); setStep('verifikasi'); }}
                  className="px-6 py-2 border border-outline-variant rounded-lg text-secondary hover:bg-surface-container-low transition-colors font-medium text-sm"
                >
                  Tutup
                </button>
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 text-sm">
                  <Download size={18} />
                  Unduh PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

GenerateSurat.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;
