import React from 'react';
import { Download, Maximize2 } from 'lucide-react';

interface PdfViewerProps {
  title: string;
  showDummyContent?: boolean;
  abstract?: string;
}

export default function PdfViewer({ title, showDummyContent = false, abstract }: PdfViewerProps) {
  return (
    <div className="bg-surface-lowest rounded-xl border border-outline-variant p-6 shadow-sm h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-display font-semibold text-on-surface truncate pr-4">{title}</h3>
        <div className="flex gap-2 shrink-0">
          <button className="p-2 rounded-lg hover:bg-surface-high transition-colors text-on-surface-variant">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-surface-high transition-colors text-on-surface-variant">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 bg-surface-low rounded-lg border border-outline-variant flex flex-col items-center justify-center text-on-surface-variant gap-3">
        <div className="w-16 h-16 rounded-full bg-surface-high flex items-center justify-center">
          <svg className="w-8 h-8 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="font-medium">Pratinjau Dokumen PDF</p>
        <p className="text-sm">Dokumen akan ditampilkan di sini pada mode produksi.</p>
      </div>
      {abstract && (
        <div className="mt-4 p-4 bg-surface-low rounded-lg border border-outline-variant">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Abstrak</p>
          <p className="text-sm text-on-surface leading-relaxed">{abstract}</p>
        </div>
      )}
    </div>
  );
}
