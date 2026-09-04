import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import DosenLayout from '@/Layouts/DosenLayout';
import InstansiLayout from '@/Layouts/InstansiLayout';
import TULayout from '@/Layouts/TULayout';
import ProdiLayout from '@/Layouts/ProdiLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { ComponentType, PropsWithChildren } from 'react';
import { User, Shield, Camera, IdCard, Building2 } from 'lucide-react';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    let Layout: ComponentType<PropsWithChildren<any>> = AuthenticatedLayout;

    if (user.role === 'mahasiswa') {
        Layout = MahasiswaLayout;
    } else if (user.role === 'dosen') {
        Layout = DosenLayout;
    } else if (user.role === 'instansi') {
        Layout = InstansiLayout;
    } else if (user.role === 'tu') {
        Layout = TULayout;
    } else if (user.role === 'prodi') {
        Layout = ProdiLayout;
    }

    const roleLabel = user.role === 'instansi' ? 'Pembimbing Lapangan' : user.role === 'tu' ? 'Tata Usaha' : user.role === 'prodi' ? 'Koordinator Prodi' : user.role;

    const content = (
        <>
            <Head title="Profil Saya" />

            <div className="py-6">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {/* Hero Profile Header */}
                    <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-container to-tertiary-container shadow-xl">
                        {/* Abstract decorative pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/20" />
                            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/15" />
                            <div className="absolute top-10 left-1/2 h-32 w-32 rounded-full bg-white/10" />
                        </div>

                        <div className="relative flex flex-col items-center gap-5 px-6 py-10 sm:flex-row sm:items-end sm:px-10 sm:py-12">
                            {/* Avatar */}
                            <div className="group relative">
                                <div className="h-28 w-28 overflow-hidden rounded-2xl border-4 border-white/30 bg-white/20 shadow-2xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-105 sm:h-32 sm:w-32">
                                    {(user as any).avatar ? (
                                        <img
                                            src={`/storage/${(user as any).avatar}`}
                                            alt="Avatar"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <User className="h-14 w-14 text-white/70" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 shadow-lg">
                                    <Camera className="h-4 w-4 text-primary" />
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center sm:text-left pb-1">
                                <h1 className="text-2xl font-bold text-white sm:text-3xl drop-shadow-md">
                                    {user.name}
                                </h1>
                                <p className="mt-1 text-sm text-white/80">{user.email}</p>
                                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                        <Shield className="h-3.5 w-3.5" />
                                        {roleLabel}
                                    </span>
                                    {(user.role === 'dosen' || user.role === 'prodi' || user.role === 'tu') && user.nip && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                            <IdCard className="h-3.5 w-3.5" />
                                            NIP: {user.nip}
                                        </span>
                                    )}
                                    {user.role === 'mahasiswa' && user.nim && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                            <IdCard className="h-3.5 w-3.5" />
                                            NIM: {user.nim}
                                        </span>
                                    )}
                                    {user.role === 'instansi' && (user as any).pembimbing_lapangan?.instansi?.nama && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                            <Building2 className="h-3.5 w-3.5" />
                                            {(user as any).pembimbing_lapangan.instansi.nama}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column - Profile Info & Avatar */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Update Profile */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-outline-variant/40 transition-shadow hover:shadow-md">
                                <div className="border-b border-outline-variant/30 bg-surface-container-low/50 px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                                            <User className="h-4.5 w-4.5 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-semibold text-on-surface">Informasi Profil</h2>
                                            <p className="text-xs text-secondary">Perbarui foto, nama, dan email Anda</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                    />
                                </div>
                            </div>

                            {/* Update Password */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-outline-variant/40 transition-shadow hover:shadow-md">
                                <div className="border-b border-outline-variant/30 bg-surface-container-low/50 px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-tertiary/10">
                                            <Shield className="h-4.5 w-4.5 text-tertiary" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-semibold text-on-surface">Keamanan Akun</h2>
                                            <p className="text-xs text-secondary">Kelola kata sandi Anda</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <UpdatePasswordForm />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Role Info & Danger Zone */}
                        <div className="space-y-6">
                            {/* Role Specific Info */}
                            {user.role && (
                                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-outline-variant/40">
                                    <div className="border-b border-outline-variant/30 bg-surface-container-low/50 px-6 py-4">
                                        <h3 className="text-sm font-semibold text-on-surface">Detail Akun</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <InfoRow label="Peran" value={roleLabel} />
                                        {(user.role === 'dosen' || user.role === 'prodi' || user.role === 'tu') && (
                                            <InfoRow label="NIP" value={user.nip || '-'} />
                                        )}
                                        {user.role === 'mahasiswa' && (
                                            <>
                                                <InfoRow label="NIM" value={user.nim || '-'} />
                                                {(user as any).semester && <InfoRow label="Semester" value={(user as any).semester} />}
                                                {(user as any).ipk && <InfoRow label="IPK" value={(user as any).ipk} />}
                                            </>
                                        )}
                                        {user.role === 'instansi' && (
                                            <>
                                                <InfoRow label="Pembimbing" value={(user as any).pembimbing_lapangan?.nama ?? '-'} />
                                                <InfoRow label="Instansi" value={(user as any).pembimbing_lapangan?.instansi?.nama ?? '-'} />
                                            </>
                                        )}
                                        <InfoRow
                                            label="Bergabung"
                                            value={new Date(user.created_at ?? '').toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Danger Zone (Disembunyikan khusus untuk Mahasiswa) */}
                            {user.role !== 'mahasiswa' && (
                                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-error/20">
                                    <div className="p-6">
                                        <DeleteUserForm />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    if (Layout === AuthenticatedLayout) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Profil Saya
                    </h2>
                }
            >
                {content}
            </AuthenticatedLayout>
        );
    }

    return <Layout>{content}</Layout>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0">
            <span className="text-xs font-medium text-secondary">{label}</span>
            <span className="text-sm font-semibold text-on-surface text-right max-w-[60%] truncate">{value}</span>
        </div>
    );
}
