<?php

namespace App\Http\Controllers\TU;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TUVerifikasiController extends Controller
{
    public function index(): Response
    {
        $pendaftarans = Pendaftaran::with([
            'mahasiswa',
            'instansi',
            'dokumenPendaftarans',
        ])
        ->where('status', 'diajukan')
        ->latest()
        ->get();

        return Inertia::render('TU/Verifikasi', [
            'pendaftarans' => $pendaftarans,
        ]);
    }

    public function approve(Pendaftaran $pendaftaran)
    {
        $pendaftaran->update([
            'status' => 'verifikasi_tu',
            'diverifikasi_oleh' => auth()->id(),
            'diverifikasi_pada' => now(),
        ]);

        return back()->with(
            'success',
            'Pendaftaran berhasil diverifikasi.'
        );
    }

    public function reject(Request $request, Pendaftaran $pendaftaran)
    {
        $request->validate([
            'catatan_tu' => 'required'
        ]);

        $pendaftaran->update([
            'status' => 'perlu_perbaikan',
            'catatan_tu' => $request->catatan_tu,
        ]);

        return back()->with(
            'success',
            'Pengajuan dikembalikan.'
        );
    }
}