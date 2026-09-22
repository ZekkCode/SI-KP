import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Lock, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Atur Ulang Kata Sandi - SI-KP UTM" />

            <div className="space-y-1 mb-6 text-center sm:text-left">
                <div className="inline-flex p-2.5 rounded-lg bg-blue-50 text-[#00288e] mb-2">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                    Atur Ulang Kata Sandi
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Buat kata sandi baru untuk mengamankan akun Anda. Gunakan minimal 8 karakter.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" />

                    <div className="relative">
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full pl-9 bg-slate-50 text-slate-600"
                            autoComplete="username"
                            readOnly
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi Baru" />

                    <div className="relative">
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full pl-9"
                            placeholder="Minimal 8 karakter"
                            autoComplete="new-password"
                            isFocused={true}
                            required
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Kata Sandi Baru"
                    />

                    <div className="relative">
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full pl-9"
                            placeholder="Ketik ulang kata sandi baru"
                            autoComplete="new-password"
                            required
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5"
                    />
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
                    </PrimaryButton>
                </div>

                <div className="pt-3 text-center border-t border-slate-100">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00288e] hover:text-[#001f70] transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke Halaman Masuk</span>
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
