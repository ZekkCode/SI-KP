import React, { ReactNode } from 'react';

interface ModernTableProps {
    children: ReactNode;
    className?: string;
}

export default function ModernTable({ children, className = '' }: ModernTableProps) {
    return (
        <div className={`rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    {children}
                </table>
            </div>
        </div>
    );
}

// Komponen Pembantu
export function ModernTableHeader({ children, className = '' }: { children: ReactNode, className?: string }) {
    return (
        <thead className={`bg-slate-50/50 text-slate-700 text-sm border-b border-gray-200 ${className}`}>
            <tr>{children}</tr>
        </thead>
    );
}

export function ModernTableTh({ children, className = '', colSpan }: { children: ReactNode, className?: string, colSpan?: number }) {
    return (
        <th colSpan={colSpan} className={`px-4 py-3 font-semibold align-middle ${className}`}>
            {children}
        </th>
    );
}

export function ModernTableBody({ children, className = '' }: { children: ReactNode, className?: string }) {
    return (
        <tbody className={`divide-y divide-gray-100 ${className}`}>
            {children}
        </tbody>
    );
}

export function ModernTableTd({ children, className = '', colSpan }: { children: ReactNode, className?: string, colSpan?: number }) {
    return (
        <td colSpan={colSpan} className={`px-4 py-3 text-sm text-gray-700 align-middle ${className}`}>
            {children}
        </td>
    );
}
