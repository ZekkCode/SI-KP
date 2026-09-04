import React, { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: ReactNode; // Untuk action buttons, dll.
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-primary mb-2">{title}</h1>
                {description && <p className="text-gray-500 text-sm">{description}</p>}
            </div>
            {children && (
                <div className="flex items-center gap-3">
                    {children}
                </div>
            )}
        </div>
    );
}
