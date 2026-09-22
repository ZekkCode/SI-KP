import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-lg border border-transparent bg-[#00288e] px-4 py-2.5 text-xs font-semibold tracking-wide text-white transition duration-150 ease-in-out hover:bg-[#001f70] focus:bg-[#001f70] focus:outline-none focus:ring-2 focus:ring-[#00288e] focus:ring-offset-1 active:bg-[#001858] shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${
                    disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
