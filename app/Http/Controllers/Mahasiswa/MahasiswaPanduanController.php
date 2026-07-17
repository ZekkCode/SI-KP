<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaPanduanController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Check if user already has a pendaftaran (for CTA button state)
        $hasPendaftaran = $user->pendaftaransMahasiswa()->exists();

        return Inertia::render('Mahasiswa/Panduan', [
            'hasPendaftaran' => $hasPendaftaran,
        ]);
    }
}
