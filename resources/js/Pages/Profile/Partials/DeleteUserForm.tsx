import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-4 ${className}`}>
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-error/10">
                    <AlertTriangle className="h-4.5 w-4.5 text-error" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-on-surface">Hapus Akun</h3>
                    <p className="mt-1 text-xs leading-relaxed text-secondary">
                        Setelah akun dihapus, semua data akan hilang secara permanen. Pastikan Anda sudah mengunduh data penting sebelum melanjutkan.
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className="inline-flex items-center gap-2 rounded-xl border border-error/30 bg-error/5 px-4 py-2 text-sm font-semibold text-error transition-all duration-200 hover:bg-error hover:text-on-error hover:shadow-md active:scale-[0.98]"
            >
                <Trash2 className="h-4 w-4" />
                Hapus Akun
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
                            <AlertTriangle className="h-5 w-5 text-error" />
                        </div>
                        <h2 className="text-lg font-bold text-on-surface">
                            Konfirmasi Hapus Akun
                        </h2>
                    </div>

                    <p className="text-sm text-secondary leading-relaxed">
                        Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.
                        Semua data dan informasi Anda akan dihapus secara permanen.
                        Masukkan kata sandi untuk mengkonfirmasi.
                    </p>

                    <div className="mt-5">
                        <InputLabel
                            htmlFor="password"
                            value="Kata Sandi"
                            className="text-sm font-medium"
                        />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1.5 block w-full rounded-xl border-outline-variant/50"
                            isFocused
                            placeholder="Masukkan kata sandi Anda"
                        />
                        <InputError message={errors.password} className="mt-1.5" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-xl border border-outline-variant/50 bg-white px-5 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-surface-container"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-error px-5 py-2.5 text-sm font-semibold text-on-error shadow-sm transition-all duration-200 hover:bg-error/90 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
                        >
                            <Trash2 className="h-4 w-4" />
                            Ya, Hapus Akun
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
