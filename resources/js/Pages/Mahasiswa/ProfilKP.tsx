import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { FormEventHandler } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Info, Save, Verified } from 'lucide-react';
import { PageProps } from '@/types';

export default function ProfilKP() {
    const { auth, flash } = usePage<PageProps & { flash: { success?: string, error?: string } }>().props;
    const user = auth.user as any;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        no_telepon: user.no_telepon || '',
        email: user.email || '',
        konsentrasi: user.konsentrasi || '',
        total_sks: user.total_sks?.toString() || '',
    });

    const sksValue = parseInt(data.total_sks);
    const isValidSks = !isNaN(sksValue) && sksValue >= 100;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('mahasiswa.profil.update'));
    };

    return (
        <div className="flex-1 p-6 max-w-[1280px] mx-auto w-full">
            <nav className="flex text-label-sm text-secondary mb-4">
                <span>Dashboard</span><span className="mx-1">/</span><span className="text-primary">Profil KP</span>
            </nav>
            <h1 className="text-headline-md text-on-surface mb-6">Lengkapi Profil Kerja Praktik</h1>
            
            {flash.success && (
                <div className="bg-primary-container text-on-primary-container px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                    <Verified className="w-5 h-5" />
                    <span className="text-label-md">{flash.success}</span>
                </div>
            )}
            
            <div className="bg-primary-container/10 border border-primary/20 p-4 rounded-xl flex items-start gap-4 mb-6">
                <Info className="w-6 h-6 text-primary flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-label-md text-primary">Prasyarat Akademik</p>
                    <p className="text-body-sm text-on-primary-fixed-variant">Untuk dapat mendaftar Kerja Praktik, Anda wajib telah menempuh minimal <span className="font-bold">100 SKS</span>. Pastikan data yang Anda masukkan sesuai dengan Transkrip Nilai terbaru.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden h-max">
                    <div className="p-6 border-b border-outline-variant bg-surface-container-low">
                        <h2 className="text-title-lg text-on-surface">Data Personal Mahasiswa</h2>
                        <p className="text-body-sm text-secondary">Lengkapi kolom di bawah ini dengan informasi valid.</p>
                    </div>
                    <form className="p-6 space-y-4" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant">Nama Lengkap</label>
                                <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Masukkan nama sesuai KTP" className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none ${errors.name ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'}`} />
                                {errors.name && <p className="text-label-sm text-error">{errors.name}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant">NIM</label>
                                <input type="text" readOnly value={user.nim || ''} className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-variant/30 text-secondary cursor-not-allowed outline-none" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant">Program Studi</label>
                                <input type="text" readOnly value={user.program_studi?.nama || '-'} className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-variant/30 text-secondary cursor-not-allowed outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant">Konsentrasi</label>
                                <select required value={data.konsentrasi} onChange={e => setData('konsentrasi', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none bg-white ${errors.konsentrasi ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'}`}>
                                    <option value="" disabled>Pilih Konsentrasi</option>
                                    <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
                                    <option value="Jaringan Komputer">Jaringan Komputer</option>
                                    <option value="Kecerdasan Buatan">Kecerdasan Buatan</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="Multimedia">Multimedia</option>
                                    <option value="Sistem Enterprise">Sistem Enterprise</option>
                                </select>
                                {errors.konsentrasi && <p className="text-label-sm text-error">{errors.konsentrasi}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant">Nomor WhatsApp</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-body-sm">+62</span>
                                    <input type="tel" required value={data.no_telepon.replace(/^08/, '8')} onChange={e => setData('no_telepon', '08' + e.target.value.replace(/^8/, ''))} placeholder="8123456789" className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none ${errors.no_telepon ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'}`} />
                                </div>
                                {errors.no_telepon && <p className="text-label-sm text-error">{errors.no_telepon}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md text-on-surface-variant">Email Institusi</label>
                                <input type="email" required value={data.email} onChange={e => setData('email', e.target.value)} placeholder="nama@student.univ.ac.id" className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none ${errors.email ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'}`} />
                                {errors.email && <p className="text-label-sm text-error">{errors.email}</p>}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-label-md text-on-surface-variant">Total SKS yang Telah Ditempuh</label>
                            <input type="number" required min="0" placeholder="Contoh: 105" value={data.total_sks} onChange={(e) => setData('total_sks', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none ${data.total_sks && (!isValidSks || errors.total_sks) ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-primary/20 focus:border-primary'}`} />
                            <p className={`text-label-sm ${data.total_sks && (!isValidSks || errors.total_sks) ? 'text-error' : data.total_sks && isValidSks ? 'text-primary' : 'text-secondary'}`}>
                                {errors.total_sks ? errors.total_sks : data.total_sks && !isValidSks ? '⚠️ SKS Anda belum mencukupi prasyarat (Min. 100).' : data.total_sks && isValidSks ? '✅ SKS memenuhi prasyarat pendaftaran.' : 'Masukkan angka total SKS dari KHS terakhir.'}
                            </p>
                        </div>
                        <div className="pt-6 flex justify-end gap-4">
                            <button type="button" onClick={() => window.location.reload()} className="px-6 py-2 text-primary font-label-md bg-secondary-container hover:bg-secondary-container/80 transition-all rounded-lg">Reset</button>
                            <button type="submit" disabled={!isValidSks || processing} className="px-6 py-2 bg-primary text-white font-label-md rounded-lg hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save className="w-5 h-5" />{processing ? 'Menyimpan...' : 'Simpan Profil'}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-4 text-primary">
                            <Verified className="w-5 h-5" /><h3 className="text-label-md">Panduan Pengisian</h3>
                        </div>
                        <ul className="space-y-2">
                            <li className="flex gap-2 text-body-sm text-secondary"><span className="text-primary font-bold">•</span><span>Gunakan nomor WhatsApp aktif untuk koordinasi dengan dosen pembimbing.</span></li>
                            <li className="flex gap-2 text-body-sm text-secondary"><span className="text-primary font-bold">•</span><span>Pilihan konsentrasi akan menentukan fokus topik KP yang disarankan.</span></li>
                            <li className="flex gap-2 text-body-sm text-secondary"><span className="text-primary font-bold">•</span><span>Data SKS akan divalidasi oleh sistem sebelum modul pendaftaran dibuka.</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

ProfilKP.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
