import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { School, MapPin, ArrowRight, Check, Hourglass, Mail, Megaphone, AlertCircle, UploadCloud, Download, Edit, HelpCircle } from 'lucide-react';

export default function Dashboard() {
    return (
        <div className="p-6 max-w-[1280px] mx-auto w-full flex-1">
            <div className="grid grid-cols-12 gap-6">
                {/* Welcome & Brief Profile Card */}
                <div className="col-span-12 lg:col-span-8 bg-white border border-outline-variant rounded-xl p-6 flex items-center shadow-sm">
                    <div className="flex-1">
                        <h3 className="text-headline-md text-on-surface mb-1">Selamat Datang, Mahasiswa User!</h3>
                        <p className="text-body-md text-secondary mb-4">Lanjutkan langkah Anda menuju dunia profesional melalui program Kerja Praktik semester ini.</p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2 bg-surface-container-low px-4 py-2 rounded-lg">
                                <School className="w-5 h-5 text-primary" />
                                <span className="text-label-md">Informatika - 2021</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-surface-container-low px-4 py-2 rounded-lg">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span className="text-label-md">Yogyakarta, Indonesia</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Chip Card */}
                <div className="col-span-12 lg:col-span-4 bg-primary text-white border border-primary rounded-xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
                    <div className="z-10">
                        <span className="text-label-sm uppercase tracking-widest opacity-80">Status Saat Ini</span>
                        <h4 className="text-title-lg font-bold mt-2">Menunggu Surat Pengantar</h4>
                        <p className="text-body-sm mt-1 opacity-90">Dokumen pendaftaran Anda sedang diverifikasi oleh koordinator KP.</p>
                    </div>
                    <div className="mt-6 z-10">
                        <button className="bg-white text-primary px-6 py-2 rounded-full font-bold text-label-md hover:bg-opacity-90 transition-all flex items-center space-x-2 w-max">
                            <span>Detail Status</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                {/* Horizontal Stepper */}
                <div className="col-span-12 bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
                    <h3 className="text-label-md text-secondary mb-8 uppercase tracking-wider">Alur Kerja Praktik</h3>
                    <div className="relative flex items-center justify-between w-full">
                        <div className="absolute top-5 left-0 w-full h-1 bg-surface-variant -z-0"></div>
                        <div className="absolute top-5 left-0 w-1/2 h-1 bg-primary -z-0 transition-all duration-500"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md mb-2"><Check className="w-5 h-5" /></div>
                            <span className="text-label-sm text-primary font-bold">Pendaftaran</span>
                        </div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md mb-2"><Check className="w-5 h-5" /></div>
                            <span className="text-label-sm text-primary font-bold">Verifikasi</span>
                        </div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg mb-2 ring-4 ring-primary-fixed"><Hourglass className="w-5 h-5" /></div>
                            <span className="text-label-sm text-primary font-bold text-center">Surat Pengantar</span>
                        </div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center mb-2"><div className="w-2 h-2 rounded-full bg-on-surface-variant"></div></div>
                            <span className="text-label-sm text-secondary">Proposal</span>
                        </div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center mb-2"><div className="w-2 h-2 rounded-full bg-on-surface-variant"></div></div>
                            <span className="text-label-sm text-secondary">Pelaksanaan</span>
                        </div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center mb-2"><div className="w-2 h-2 rounded-full bg-on-surface-variant"></div></div>
                            <span className="text-label-sm text-secondary">Laporan</span>
                        </div>
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="col-span-12 lg:col-span-7 bg-white border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                        <h3 className="text-title-lg font-bold">Notifikasi Terbaru</h3>
                        <button className="text-primary text-label-md hover:underline">Lihat Semua</button>
                    </div>
                    <div className="divide-y divide-outline-variant">
                        <div className="p-4 flex space-x-4 hover:bg-surface-container-low transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-on-secondary-container" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h5 className="text-label-md font-bold">Verifikasi Berkas Berhasil</h5>
                                    <span className="text-label-sm text-secondary">2 jam yang lalu</span>
                                </div>
                                <p className="text-body-sm text-on-surface-variant mt-1">Berkas pendaftaran Anda telah disetujui. Silakan unduh draft surat pengantar.</p>
                            </div>
                        </div>
                        <div className="p-4 flex space-x-4 hover:bg-surface-container-low transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center flex-shrink-0">
                                <Megaphone className="w-5 h-5 text-on-tertiary-fixed" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h5 className="text-label-md font-bold">Pengumuman Deadline Proposal</h5>
                                    <span className="text-label-sm text-secondary">Kemarin</span>
                                </div>
                                <p className="text-body-sm text-on-surface-variant mt-1">Batas akhir pengumpulan proposal Kerja Praktik adalah tanggal 20 Oktober 2024.</p>
                            </div>
                        </div>
                        <div className="p-4 flex space-x-4 hover:bg-surface-container-low transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-5 h-5 text-on-error-container" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h5 className="text-label-md font-bold text-error">Foto Profil Ditolak</h5>
                                    <span className="text-label-sm text-secondary">2 hari yang lalu</span>
                                </div>
                                <p className="text-body-sm text-on-surface-variant mt-1">Foto profil tidak sesuai ketentuan. Harap gunakan foto formal dengan latar biru.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                    <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant flex-1">
                        <h3 className="text-label-md font-bold mb-4 uppercase tracking-wider">Aksi Cepat</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="bg-white p-4 rounded-lg flex flex-col items-center justify-center border border-outline-variant hover:border-primary hover:text-primary transition-all text-center group">
                                <UploadCloud className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-label-sm">Upload Laporan</span>
                            </button>
                            <button className="bg-white p-4 rounded-lg flex flex-col items-center justify-center border border-outline-variant hover:border-primary hover:text-primary transition-all text-center group">
                                <Download className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-label-sm">Unduh Panduan</span>
                            </button>
                            <button className="bg-white p-4 rounded-lg flex flex-col items-center justify-center border border-outline-variant hover:border-primary hover:text-primary transition-all text-center group">
                                <Edit className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-label-sm">Isi Logbook</span>
                            </button>
                            <button className="bg-white p-4 rounded-lg flex flex-col items-center justify-center border border-outline-variant hover:border-primary hover:text-primary transition-all text-center group">
                                <HelpCircle className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-label-sm">Bantuan</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-outline-variant rounded-xl p-6 flex items-center justify-between shadow-sm">
                        <div>
                            <span className="text-label-sm text-secondary">Logbook Terisi</span>
                            <div className="flex items-end space-x-1 mt-1">
                                <span className="text-headline-md text-on-surface">12</span>
                                <span className="text-body-sm text-secondary mb-1">/ 40 Hari</span>
                            </div>
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-surface-variant flex items-center justify-center relative">
                            <svg className="absolute inset-0 transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-primary-container/20" />
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175.9" strokeDashoffset="123" className="text-primary" />
                            </svg>
                            <span className="text-label-sm font-bold">30%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
