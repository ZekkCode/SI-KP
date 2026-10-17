<?php

namespace App\Http\Controllers\TU;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\SuratPengantar;
use App\Models\NilaiAkhir;
use Inertia\Inertia;

class TUDashboardController extends Controller
{
    /**
     * Menampilkan dasbor untuk role TU dengan statistik nyata.
     */
    public function index()
    {
        // 1. Mahasiswa KP Aktif (Pendaftaran status 'aktif')
        $mahasiswaAktif = Pendaftaran::where('status', 'aktif')->count();

        // 2. Antrean Surat Pengantar yang menunggu verifikasi di menu Generate Surat
        $antreanSuratPengantar = SuratPengantar::where('status', 'menunggu_verifikasi')->count();

        return Inertia::render('TU/Dashboard', [
            'stats' => [
                'mahasiswa_aktif' => $mahasiswaAktif,
                'antrean_surat' => $antreanSuratPengantar,
            ]
        ]);
    }
}
