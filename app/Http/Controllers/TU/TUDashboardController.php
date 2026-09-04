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

        // 2. Antrean Surat Pengantar
        // Bisa dihitung dari Pendaftaran yang statusnya 'diverifikasi' (siap dibuat suratnya)
        // atau yang berstatus 'diterima_prodi' tergantung workflow. Asumsikan 'diverifikasi'.
        $antreanSuratPengantar = Pendaftaran::where('status', 'diverifikasi')
            ->doesntHave('suratPengantar')
            ->count();
            
        // Atau jika surat pengantar sudah di-generate tapi menunggu persetujuan
        $suratMenunggu = SuratPengantar::whereNull('path_file')->count(); // atau kondisi lainnya

        return Inertia::render('TU/Dashboard', [
            'stats' => [
                'mahasiswa_aktif' => $mahasiswaAktif,
                'antrean_surat' => $antreanSuratPengantar + $suratMenunggu,
            ]
        ]);
    }
}
