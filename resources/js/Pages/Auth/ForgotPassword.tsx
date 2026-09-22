import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi - SI-KP UTM" />

            <div className="space-y-1 mb-6 text-center sm:text-left">
                <div className="inline-flex p-2.5 rounded-lg bg-blue-50 text-[#00288e] mb-2">
                    <KeyRound className="w-5 h-5" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                    Lupa Kata Sandi
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Masukkan alamat email terdaftar. Sistem akan mengirimkan tautan untuk mengatur ulang kata sandi akun Anda.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-lg">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" />

                    <div className="relative">
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full pl-9"
                            placeholder="nama@email.com"
                            isFocused={true}
                            required
                            autoComplete="email"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full" disabled={processing}>
                        {processing ? 'Mengirim Tautan...' : 'Kirim Tautan Pemulihan'}
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
