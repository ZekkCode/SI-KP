import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Camera, Upload, CheckCircle } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [preview, setPreview] = useState<string | null>((user as any).avatar ? `/storage/${(user as any).avatar}` : null);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            avatar: null as File | null,
            _method: 'patch',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('profile.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={submit} className={`space-y-6 ${className}`}>
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div
                    className="group relative cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="h-24 w-24 overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container to-surface-container-high ring-2 ring-outline-variant/30 transition-all duration-300 group-hover:ring-primary/50 group-hover:shadow-lg">
                        {preview ? (
                            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <Camera className="h-8 w-8 text-secondary/50" />
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform duration-200 group-hover:scale-110">
                        <Upload className="h-3.5 w-3.5" />
                    </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm font-medium text-on-surface">Foto Profil</p>
                    <p className="mt-0.5 text-xs text-secondary">
                        Klik foto untuk mengganti. Format JPG, PNG. Maks 2MB.
                    </p>
                    <input
                        ref={fileInputRef}
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setData('avatar', file);
                                setPreview(URL.createObjectURL(file));
                            }
                        }}
                    />
                    <InputError className="mt-1" message={errors.avatar} />
                </div>
            </div>

            <div className="h-px bg-outline-variant/30" />

            {/* Name */}
            <div>
                <InputLabel htmlFor="name" value="Nama Lengkap" className="text-sm font-medium text-on-surface" />
                <TextInput
                    id="name"
                    className="mt-1.5 block w-full rounded-xl border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-primary/30"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    autoComplete="name"
                />
                <InputError className="mt-1.5" message={errors.name} />
            </div>

            {/* Email */}
            <div>
                <InputLabel htmlFor="email" value="Alamat Email" className="text-sm font-medium text-on-surface" />
                <TextInput
                    id="email"
                    type="email"
                    className="mt-1.5 block w-full rounded-xl border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-primary/30"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                    autoComplete="username"
                />
                <InputError className="mt-1.5" message={errors.email} />
            </div>

            {mustVerifyEmail && user.email_verified_at === null && (
                <div className="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
                    <p className="text-sm text-amber-800">
                        Email Anda belum terverifikasi.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="font-semibold text-amber-700 underline hover:text-amber-900"
                        >
                            Kirim ulang link verifikasi.
                        </Link>
                    </p>
                    {status === 'verification-link-sent' && (
                        <p className="mt-2 text-sm font-medium text-green-600">
                            Link verifikasi baru telah dikirim ke email Anda.
                        </p>
                    )}
                </div>
            )}

            {/* Save Button */}
            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-all duration-200 hover:bg-primary-container hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : null}
                    Simpan Perubahan
                </button>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-out duration-300"
                    enterFrom="opacity-0 translate-y-1"
                    leave="transition ease-in duration-200"
                    leaveTo="opacity-0"
                >
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Tersimpan!
                    </span>
                </Transition>
            </div>
        </form>
    );
}
