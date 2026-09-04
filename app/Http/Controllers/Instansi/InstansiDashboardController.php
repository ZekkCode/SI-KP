<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InstansiDashboardController extends Controller
{
    /**
     * Menampilkan dasbor instansi dengan statistik riil.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Ambil relasi Pembimbing Lapangan
        $pl = $user->pembimbingLapangan;

        // Jika belum ada PL, mungkin bisa return error atau data kosong (meski harusnya selalu ada jika di-whitelist)
        if (!$pl) {
            return Inertia::render('Instansi/Dashboard', [
                'mahasiswaBimbingan' => []
            ])->with('error', 'Data Pembimbing Lapangan tidak ditemukan.');
        }

        // Ambil daftar mahasiswa bimbingan
        $mahasiswaBimbingan = Pendaftaran::with(['mahasiswa'])
            ->where('pembimbing_lapangan_id', $pl->id)
            ->get();

        return Inertia::render('Instansi/Dashboard', [
            'mahasiswaBimbingan' => $mahasiswaBimbingan
        ]);
    }
}
