import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { 
    X, 
    ChevronLeft, 
    ChevronRight, 
    ZoomIn, 
    ZoomOut, 
    RotateCw, 
    Download, 
    ExternalLink, 
    Loader2, 
    FileText, 
    Maximize,
    Minimize,
    AlertCircle
} from 'lucide-react';

// Configure PDF.js worker
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
    } catch {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }
}

interface PdfViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
    title: string;
}

export default function PdfViewerModal({ isOpen, onClose, pdfUrl, title }: PdfViewerModalProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [scale, setScale] = useState<number>(1.15);
    const [rotation, setRotation] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [pageRendering, setPageRendering] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    // Track active render task to cancel if new page/scale renders quickly
    const renderTaskRef = useRef<any>(null);

    // Load PDF Document when URL changes or modal opens
    useEffect(() => {
        if (!isOpen || !pdfUrl) {
            setPdfDoc(null);
            setPageNum(1);
            setTotalPages(0);
            setScale(1.15);
            setRotation(0);
            setErrorMessage(null);
            return;
        }

        let isMounted = true;
        setLoading(true);
        setErrorMessage(null);
        setPageNum(1);

        const loadingTask = pdfjsLib.getDocument({
            url: pdfUrl,
            cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
            cMapPacked: true,
        });

        loadingTask.promise
            .then((doc) => {
                if (!isMounted) return;
                setPdfDoc(doc);
                setTotalPages(doc.numPages);
                setLoading(false);
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error('Error loading PDF:', err);
                setErrorMessage('Gagal memuat PDF. Silakan unduh dokumen langsung.');
                setLoading(false);
            });

        return () => {
            isMounted = false;
            try {
                loadingTask.destroy();
            } catch {
                // ignore
            }
        };
    }, [isOpen, pdfUrl]);

    // Render current page onto canvas
    useEffect(() => {
        if (!pdfDoc || !canvasRef.current || pageNum < 1 || pageNum > totalPages) return;

        let isCancelled = false;
        setPageRendering(true);

        // Cancel previous render task if still active
        if (renderTaskRef.current) {
            try {
                renderTaskRef.current.cancel();
            } catch {
                // ignore
            }
        }

        pdfDoc.getPage(pageNum).then((page) => {
            if (isCancelled || !canvasRef.current) return;

            const viewport = page.getViewport({ scale, rotation });
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                setPageRendering(false);
                return;
            }

            // High DPI support for sharp text rendering
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = Math.floor(viewport.width * pixelRatio);
            canvas.height = Math.floor(viewport.height * pixelRatio);
            canvas.style.width = `${Math.floor(viewport.width)}px`;
            canvas.style.height = `${Math.floor(viewport.height)}px`;

            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

            const renderContext = {
                canvas,
                canvasContext: ctx,
                viewport,
            };

            const renderTask = page.render(renderContext);
            renderTaskRef.current = renderTask;

            renderTask.promise
                .then(() => {
                    if (!isCancelled) {
                        setPageRendering(false);
                        renderTaskRef.current = null;
                    }
                })
                .catch((err: any) => {
                    if (err?.name !== 'RenderingCancelledException') {
                        console.error('Render page error:', err);
                        setPageRendering(false);
                    }
                });
        });

        return () => {
            isCancelled = true;
            if (renderTaskRef.current) {
                try {
                    renderTaskRef.current.cancel();
                } catch {
                    // ignore
                }
            }
        };
    }, [pdfDoc, pageNum, scale, rotation, totalPages]);

    // Keyboard navigation (Escape to close, Left/Right arrow to change page)
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                setPageNum((prev) => Math.min(prev + 1, totalPages));
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                setPageNum((prev) => Math.max(prev - 1, 1));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, totalPages, onClose]);

    if (!isOpen) return null;

    const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5));
    const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6));
    const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
    const handleFitWidth = () => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth - 80;
            // Estimated A4 width ratio ~595px
            const newScale = Math.max(0.6, Math.min(containerWidth / 620, 2.2));
            setScale(Number(newScale.toFixed(2)));
        }
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(() => {});
            setIsFullscreen(true);
        } else {
            document.exitFullscreen().catch(() => {});
            setIsFullscreen(false);
        }
    };

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 z-50 flex flex-col bg-slate-900/90 backdrop-blur-xs p-2 sm:p-4 text-slate-900 font-sans"
        >
            {/* ======================================================== */}
            {/* VIEWER MODAL CONTAINER                                    */}
            {/* ======================================================== */}
            <div className="w-full h-full max-w-6xl mx-auto flex flex-col bg-white border border-slate-300 rounded-xl shadow-2xl overflow-hidden">
                
                {/* 1. TOP HEADER BAR */}
                <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-[#00288e] flex-shrink-0">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 truncate leading-tight">
                                {title}
                            </h3>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <span>Pratinjau Dokumen</span>
                                <span>&bull;</span>
                                <span className="font-semibold text-[#00288e]">
                                    {totalPages > 0 ? `Halaman ${pageNum} dari ${totalPages}` : 'Memuat...'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <a
                            href={pdfUrl}
                            download
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                            title="Unduh PDF"
                        >
                            <Download className="w-3.5 h-3.5 text-[#00288e]" />
                            <span className="hidden sm:inline">Unduh PDF</span>
                        </a>
                        <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg transition cursor-pointer"
                            title="Buka Tab Baru"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                            type="button"
                            onClick={toggleFullscreen}
                            className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg transition cursor-pointer hidden sm:block"
                            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
                        >
                            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-lg transition cursor-pointer ml-1"
                            title="Tutup (Esc)"
                        >
                            <X className="w-4.5 h-4.5" />
                        </button>
                    </div>
                </div>

                {/* 2. INTERACTIVE CONTROLS TOOLBAR */}
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    {/* Page Navigation */}
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            disabled={pageNum <= 1 || loading}
                            onClick={() => setPageNum((prev) => Math.max(prev - 1, 1))}
                            className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 rounded-lg transition cursor-pointer"
                            title="Halaman Sebelumnya"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1 text-slate-600 font-semibold px-2">
                            <input
                                type="number"
                                min={1}
                                max={totalPages || 1}
                                value={pageNum}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (!isNaN(val) && val >= 1 && val <= totalPages) {
                                        setPageNum(val);
                                    }
                                }}
                                className="w-12 text-center py-0.5 border border-slate-300 rounded bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00288e]"
                            />
                            <span>/</span>
                            <span>{totalPages || '-'}</span>
                        </div>

                        <button
                            type="button"
                            disabled={pageNum >= totalPages || loading}
                            onClick={() => setPageNum((prev) => Math.min(prev + 1, totalPages))}
                            className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 rounded-lg transition cursor-pointer"
                            title="Halaman Berikutnya"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Zoom & View Controls */}
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={handleZoomOut}
                            disabled={scale <= 0.6 || loading}
                            className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-lg transition cursor-pointer"
                            title="Perkecil (-)"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-[11px] font-bold text-slate-600 min-w-[42px] text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <button
                            type="button"
                            onClick={handleZoomIn}
                            disabled={scale >= 2.5 || loading}
                            className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-lg transition cursor-pointer"
                            title="Perbesar (+)"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>

                        <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />

                        <button
                            type="button"
                            onClick={handleFitWidth}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition cursor-pointer hidden sm:block"
                            title="Sesuaikan Lebar Halaman"
                        >
                            Pas Lebar
                        </button>
                        <button
                            type="button"
                            onClick={handleRotate}
                            className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer"
                            title="Putar 90 Derajat"
                        >
                            <RotateCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* 3. PDF CANVAS VIEWPORT */}
                <div className="flex-1 overflow-auto bg-slate-200/80 p-4 sm:p-8 flex justify-center items-start relative min-h-[400px]">
                    {/* Loading State */}
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20 space-y-3">
                            <Loader2 className="w-8 h-8 text-[#00288e] animate-spin" />
                            <p className="text-xs font-semibold text-slate-600">
                                Memuat dokumen PDF dengan PDF.js...
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {errorMessage && (
                        <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-6 text-center space-y-3 shadow-md my-auto">
                            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
                            <h4 className="text-sm font-bold text-slate-900">Gagal Membuka PDF</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {errorMessage}
                            </p>
                            <div className="pt-2">
                                <a
                                    href={pdfUrl}
                                    download
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00288e] text-white text-xs font-bold rounded-lg transition"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Unduh Dokumen Sekarang</span>
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Page Rendering Indicator */}
                    {pageRendering && (
                        <div className="absolute top-4 right-4 z-10 bg-white/90 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <Loader2 className="w-3.5 h-3.5 text-[#00288e] animate-spin" />
                            <span>Merender...</span>
                        </div>
                    )}

                    {/* Canvas Target */}
                    <div className="shadow-lg border border-slate-300 bg-white inline-block">
                        <canvas ref={canvasRef} className="block mx-auto" />
                    </div>
                </div>

                {/* 4. BOTTOM INFO FOOTER */}
                <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate">
                        SI-KP UTM &bull; Panduan Resmi
                    </span>
                    <span className="hidden sm:inline">
                        Gunakan panah &larr; / &rarr; pada keyboard untuk berpindah halaman
                    </span>
                </div>
            </div>
        </div>
    );
}
