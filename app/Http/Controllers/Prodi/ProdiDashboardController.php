<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Instansi;
use Inertia\Inertia;

class ProdiDashboardController extends Controller
{
    /**
     * Menampilkan dasbor untuk role Prodi dengan statistik global.
     */
    public function index()
    {
        try {
            // 1. Total Mahasiswa (Role 'mahasiswa')
            $totalMahasiswa = User::where('role', 'mahasiswa')->count() ?? 0;

            // 2. Total Dosen Pembimbing Aktif (Role 'dosen')
            $totalDosen = User::where('role', 'dosen')->count() ?? 0;

            // 3. Total Instansi Mitra
            $totalInstansi = Instansi::count() ?? 0;

            return Inertia::render('Prodi/Dashboard', [
                'stats' => [
                    'total_mahasiswa' => $totalMahasiswa,
                    'total_dosen' => $totalDosen,
                    'total_instansi' => $totalInstansi,
                ]
            ]);
        } catch (\Exception $e) {
            // Pengamanan darurat jika terjadi kegagalan query/relasi
            return Inertia::render('Prodi/Dashboard', [
                'stats' => [
                    'total_mahasiswa' => 0,
                    'total_dosen' => 0,
                    'total_instansi' => 0,
                ],
                'error' => 'Terjadi kesalahan sistem saat memuat data dashboard: ' . $e->getMessage()
            ]);
        }
    }
}
