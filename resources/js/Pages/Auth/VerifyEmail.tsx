import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { MailCheck, LogOut, RefreshCw } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email - SI-KP UTM" />

            <div className="space-y-1 mb-6 text-center sm:text-left">
                <div className="inline-flex p-2.5 rounded-lg bg-blue-50 text-[#00288e] mb-2">
                    <MailCheck className="w-5 h-5" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                    Verifikasi Alamat Email
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Tautan verifikasi telah dikirimkan ke alamat email Anda. Buka kotak masuk email dan klik tautan verifikasi untuk mengaktifkan akun.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-lg">
                    Tautan verifikasi baru telah dikirimkan ke alamat email pendaftaran Anda.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <PrimaryButton disabled={processing} className="w-full sm:w-auto">
                        <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${processing ? 'animate-spin' : ''}`} />
                        <span>Kirim Ulang Email</span>
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Keluar</span>
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
