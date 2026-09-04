import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff, CheckCircle, Lock } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <form onSubmit={updatePassword} className={`space-y-5 ${className}`}>
            {/* Current Password */}
            <div>
                <InputLabel htmlFor="current_password" value="Kata Sandi Saat Ini" className="text-sm font-medium text-on-surface" />
                <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-4 w-4 text-secondary/40" />
                    </div>
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="block w-full rounded-xl border-outline-variant/50 bg-surface-container-lowest pl-10 pr-10 focus:border-primary focus:ring-primary/30"
                        autoComplete="current-password"
                        placeholder="Masukkan kata sandi lama"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-secondary/40 hover:text-on-surface transition-colors"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        tabIndex={-1}
                    >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <InputError message={errors.current_password} className="mt-1.5" />
            </div>

            <div className="h-px bg-outline-variant/20" />

            {/* New Password */}
            <div>
                <InputLabel htmlFor="password" value="Kata Sandi Baru" className="text-sm font-medium text-on-surface" />
                <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-4 w-4 text-secondary/40" />
                    </div>
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type={showNewPassword ? 'text' : 'password'}
                        className="block w-full rounded-xl border-outline-variant/50 bg-surface-container-lowest pl-10 pr-10 focus:border-primary focus:ring-primary/30"
                        autoComplete="new-password"
                        placeholder="Masukkan kata sandi baru"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-secondary/40 hover:text-on-surface transition-colors"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        tabIndex={-1}
                    >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <InputError message={errors.password} className="mt-1.5" />
            </div>

            {/* Confirm Password */}
            <div>
                <InputLabel htmlFor="password_confirmation" value="Konfirmasi Kata Sandi" className="text-sm font-medium text-on-surface" />
                <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-4 w-4 text-secondary/40" />
                    </div>
                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="block w-full rounded-xl border-outline-variant/50 bg-surface-container-lowest pl-10 pr-10 focus:border-primary focus:ring-primary/30"
                        autoComplete="new-password"
                        placeholder="Ulangi kata sandi baru"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-secondary/40 hover:text-on-surface transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <InputError message={errors.password_confirmation} className="mt-1.5" />
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 rounded-xl bg-tertiary px-6 py-2.5 text-sm font-semibold text-on-tertiary shadow-sm transition-all duration-200 hover:bg-tertiary-container hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : null}
                    Perbarui Kata Sandi
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
