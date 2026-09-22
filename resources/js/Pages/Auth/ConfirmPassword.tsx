import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Lock, ShieldAlert } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Konfirmasi Kata Sandi - SI-KP UTM" />

            <div className="space-y-1 mb-6 text-center sm:text-left">
                <div className="inline-flex p-2.5 rounded-lg bg-amber-50 text-amber-700 mb-2">
                    <ShieldAlert className="w-5 h-5" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                    Konfirmasi Tindakan
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Area ini memerlukan autentikasi ulang. Masukkan kata sandi akun Anda untuk melanjutkan.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi" />

                    <div className="relative">
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full pl-9"
                            placeholder="Masukkan kata sandi Anda"
                            isFocused={true}
                            required
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full" disabled={processing}>
                        {processing ? 'Memverifikasi...' : 'Konfirmasi Kata Sandi'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
