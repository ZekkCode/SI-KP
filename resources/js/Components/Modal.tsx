import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
} from '@headlessui/react';
import { PropsWithChildren } from 'react';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
}: PropsWithChildren<{
    show: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    closeable?: boolean;
    onClose: CallableFunction;
}>) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <Dialog
            open={show}
            onClose={close}
            transition
            className="relative z-50 transition duration-300 ease-out data-closed:opacity-0"
        >
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 ease-out data-closed:opacity-0"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
                    <DialogPanel
                        transition
                        className={`w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all duration-300 ease-out border border-slate-200/80 my-4 data-closed:scale-95 data-closed:opacity-0 ${maxWidthClass}`}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        {children}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
