<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaBeritaAcaraController extends Controller
{
    public function index(Request $request): Response
    {
        $pendaftaran = Pendaftaran::where(
            'mahasiswa_id',
            $request->user()->id
        )
        ->with([
            'beritaAcara',
            'instansi',
            'dosenPembimbing'
        ])
        ->latest()
        ->first();

        return Inertia::render(
            'Mahasiswa/BeritaAcara',
            [
                'pendaftaran' => $pendaftaran,
                'beritaAcara' => $pendaftaran?->beritaAcara,
                'status' => $pendaftaran?->status,
            ]
        );
    }
}