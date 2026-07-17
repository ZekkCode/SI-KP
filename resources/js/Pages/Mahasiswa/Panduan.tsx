import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Edit3, Mail, Briefcase, FileText, Verified, BookOpen, CheckCircle2 } from 'lucide-react';

interface PanduanProps extends Record<string, unknown> {
    hasPendaftaran: boolean;
}

import { PageProps } from '@/types';

export default function Panduan({ hasPendaftaran }: PageProps<PanduanProps>) {
    return (
        <div className="flex-1 p-6">
            <div className="max-w-[1280px] mx-auto space-y-8">
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-2 space-y-4">
                        <h1 className="text-display-lg text-primary">Panduan Alur Kerja Praktik</h1>
                        <p className="text-body-md text-secondary leading-relaxed">
                            Panduan ini disusun untuk memberikan informasi terstruktur mengenai Standar Operasional Prosedur (SOP) pelaksanaan Kerja Praktik (KP), mulai dari tahap pendaftaran hingga penilaian akhir. Pastikan Anda memahami setiap langkah dan melengkapi seluruh persyaratan dokumen yang diperlukan.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <button className="bg-primary text-white px-6 py-3 rounded-xl font-label-md hover:shadow-md transition-all">Unduh Buku Panduan PDF</button>
                            <button className="border border-primary text-primary px-6 py-3 rounded-xl font-label-md hover:bg-primary-container/10 transition-all">Hubungi Koordinator</button>
                        </div>
                    </div>
                    <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden shadow-sm">
                        <div className="absolute inset-0 bg-primary/10"></div>
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXQKsbzd0HD4f87_TGfq2xTvVtGgchivENcvI5tuAqWBzCZ4NTAqck8TfJWnxGrLU8E7mQBzg8jQrXtTTWvKO7-3vdt8qaMNVjriuIkU387_tBzIULkAu87DgtHWZk2k-rG9AuDj-Aq4trJR2gXUbtBseLTunRNoHlxwHiggYt2lHFsxqXBGitSitJ6JqWO7Inv72Y2OvpN12fMOv0eAUroC_lewtjrRmCa_K0pPAvbL56Iz6Yq9whcXPcRdbtu9XuV21deV-yHag"
                            alt="Office"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        <h2 className="text-headline-md text-on-surface">Infografis Tahapan KP</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative">
                        <div className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                                <Edit3 className="w-8 h-8" />
                            </div>
                            <h3 className="text-label-md text-primary">Tahap 1</h3>
                            <p className="text-body-sm text-secondary font-semibold mt-1 px-4">Pengajuan & Persetujuan Judul</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h3 className="text-label-md text-primary">Tahap 2</h3>
                            <p className="text-body-sm text-secondary font-semibold mt-1 px-4">Penerbitan Surat Pengantar</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <h3 className="text-label-md text-primary">Tahap 3</h3>
                            <p className="text-body-sm text-secondary font-semibold mt-1 px-4">Pelaksanaan di Instansi</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h3 className="text-label-md text-primary">Tahap 4</h3>
                            <p className="text-body-sm text-secondary font-semibold mt-1 px-4">Penyusunan Laporan Akhir</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                                <Verified className="w-8 h-8" />
                            </div>
                            <h3 className="text-label-md text-primary">Tahap 5</h3>
                            <p className="text-body-sm text-secondary font-semibold mt-1 px-4">Sidang & Penilaian Akhir</p>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 bg-white border border-outline-variant rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-title-lg text-primary flex items-center gap-2">
                                <BookOpen className="w-6 h-6" />
                                Standar Operasional Prosedur (SOP)
                            </h3>
                            <span className="text-label-sm bg-secondary-container/30 text-secondary px-4 py-1 rounded-full">Revisi 2024.1</span>
                        </div>

                        <div className="space-y-6 relative">
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold relative z-10">1</div>
                                <div>
                                    <h4 className="text-label-md text-on-surface">Pendaftaran Awal</h4>
                                    <p className="text-body-sm text-secondary">Mahasiswa melakukan pendaftaran melalui portal sistem informasi dengan mengunggah transkrip nilai sementara yang telah diverifikasi.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold relative z-10">2</div>
                                <div>
                                    <h4 className="text-label-md text-on-surface">Penentuan Pembimbing</h4>
                                    <p className="text-body-sm text-secondary">Koordinator KP menetapkan Dosen Pembimbing berdasarkan topik atau bidang minat yang diajukan oleh mahasiswa dalam waktu 3 hari kerja.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold relative z-10">3</div>
                                <div>
                                    <h4 className="text-label-md text-on-surface">Bimbingan & Pelaksanaan</h4>
                                    <p className="text-body-sm text-secondary">Selama periode KP (minimum 40 hari kerja), mahasiswa wajib melakukan bimbingan rutin dan mengisi logbook harian di sistem.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold relative z-10">4</div>
                                <div>
                                    <h4 className="text-label-md text-on-surface">Verifikasi Dokumen Akhir</h4>
                                    <p className="text-body-sm text-secondary">Setelah selesai, mahasiswa wajib mengunggah Berita Acara Pelaksanaan dan Form Penilaian dari Instansi ke sistem untuk verifikasi administrasi.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm">
                        <h3 className="text-title-lg text-primary flex items-center gap-2 mb-6">
                            <CheckCircle2 className="w-6 h-6" />
                            Persyaratan Dokumen
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 p-4 bg-white rounded-xl border border-outline-variant/30">
                                <CheckCircle2 className="text-primary w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" />
                                <div>
                                    <p className="text-label-md">Transkrip Nilai (Lulus 100 SKS)</p>
                                    <p className="text-body-sm text-secondary">Format PDF, Maks 2MB</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 p-4 bg-white rounded-xl border border-outline-variant/30">
                                <CheckCircle2 className="text-primary w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" />
                                <div>
                                    <p className="text-label-md">Curriculum Vitae (CV)</p>
                                    <p className="text-body-sm text-secondary">Standar ATS atau Kreatif</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 p-4 bg-white rounded-xl border border-outline-variant/30">
                                <CheckCircle2 className="text-primary w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" />
                                <div>
                                    <p className="text-label-md">Proposal Rencana Kerja</p>
                                    <p className="text-body-sm text-secondary">Wajib disetujui Pembimbing</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 p-4 bg-white rounded-xl border border-outline-variant/30">
                                <CheckCircle2 className="text-primary w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" />
                                <div>
                                    <p className="text-label-md">Surat Kesediaan Instansi</p>
                                    <p className="text-body-sm text-secondary">Resmi dengan Cap Instansi</p>
                                </div>
                            </li>
                        </ul>
                        <div className="mt-8 p-4 bg-primary-container text-white rounded-xl text-center">
                            <p className="text-label-sm opacity-90 mb-1">Butuh Bantuan Upload?</p>
                            <button className="text-label-md font-bold underline hover:text-primary-fixed">Lihat Panduan Upload</button>
                        </div>
                    </div>
                </div>

                <section className="bg-primary rounded-2xl p-8 md:p-12 text-white text-center space-y-4 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-headline-md">Siap Memulai Kerja Praktik Anda?</h2>
                        <p className="text-body-md opacity-90 max-w-2xl mx-auto">Pastikan anda sudah membaca seluruh syarat dan ketentuan di atas sebelum menekan tombol pendaftaran di bawah ini.</p>
                        <div className="mt-6">
                            <Link
                                href="/mahasiswa/pendaftaran"
                                className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-label-md hover:scale-105 transition-transform font-bold"
                            >
                                {hasPendaftaran ? 'Lihat Pendaftaran Saya' : 'Daftar Kerja Praktik Sekarang'}
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

Panduan.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
