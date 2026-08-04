<?php

namespace App\Http\Controllers\TU;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class TUSuratBalasanController extends Controller
{
    /**
     * Menampilkan daftar mahasiswa yang menunggu surat balasan.
     */
    public function index(): Response
    {
        $pendaftarans = Pendaftaran::with([
                'mahasiswa',
                'instansi',
                'suratPengantar'
            ])
            ->whereIn('status', [
                'surat_terbit',
                'diterima_instansi',
                'ditolak_instansi'
            ])
            ->latest()
            ->get();

        return Inertia::render('TU/SuratBalasan/Index', [
            'pendaftarans' => $pendaftarans,
        ]);
    }

    /**
     * Detail surat balasan.
     */
    public function show(Pendaftaran $pendaftaran): Response
    {
        $pendaftaran->load([
            'mahasiswa',
            'instansi',
            'suratPengantar',
        ]);

        return Inertia::render('TU/SuratBalasan/Show', [
            'pendaftaran' => $pendaftaran,
        ]);
    }

    /**
     * Approve surat balasan dari instansi.
     */
    public function approve(Pendaftaran $pendaftaran): RedirectResponse
    {
        $pendaftaran->update([
            'status' => 'diterima_instansi',
        ]);

        return back()->with(
            'success',
            'Surat balasan berhasil diverifikasi.'
        );
    }

    /**
     * Minta revisi kepada mahasiswa.
     */
    public function revisi(
        Request $request,
        Pendaftaran $pendaftaran
    ): RedirectResponse {

        $request->validate([
            'catatan_tu' => [
                'required',
                'string',
                'max:1000'
            ],
        ]);

        $pendaftaran->update([
            'status' => 'perlu_perbaikan',
            'catatan_tu' => $request->catatan_tu,
        ]);

        return back()->with(
            'success',
            'Permintaan revisi berhasil dikirim.'
        );
    }
}