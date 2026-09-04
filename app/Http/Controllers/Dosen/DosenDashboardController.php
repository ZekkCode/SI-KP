<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\KuotaDosen;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DosenDashboardController extends Controller
{
    /**
     * Menampilkan dasbor dosen pembimbing.
     */
    public function index(Request $request)
    {
        $dosenId = Auth::id();

        // 1. Ambil data kuota dosen
        $kuota = KuotaDosen::where('dosen_id', $dosenId)->first();
        $kuotaMax = $kuota ? $kuota->kuota_max : 10;

        // 2. Ambil daftar mahasiswa bimbingan (semua pendaftaran yang diplot ke dosen ini)
        $bimbinganList = Pendaftaran::with(['mahasiswa', 'instansi', 'proposals' => function($q) {
                // Ambil proposal terbaru
                $q->latest()->limit(1);
            }])
            ->where('dosen_pembimbing_id', $dosenId)
            ->whereNotIn('status', ['draft', 'diajukan', 'verifikasi_tu', 'perlu_perbaikan', 'disetujui_tu', 'ditolak_instansi']) // Hanya yang sudah di-plotting atau setelahnya
            ->latest()
            ->get();

        // 3. Hitung statistik
        // Mahasiswa aktif: status aktif, selesai, diterima_instansi, verifikasi_surat_balasan, dll (pada dasarnya semua bimbingan list kecuali yang mungkin gagal/batal)
        // Kita hitung semua yang ada di $bimbinganList sebagai bimbingan aktif karena mereka sudah di-plotting.
        $totalBimbingan = $bimbinganList->count();

        // Menunggu Review Proposal: Ada proposal yang statusnya 'diajukan'
        $pendingReview = $bimbinganList->filter(function ($pendaftaran) {
            $proposal = $pendaftaran->proposals->first();
            return $proposal && $proposal->status === 'diajukan';
        })->count();

        // Pelaksanaan KP: Status pendaftaran 'aktif'
        $pelaksanaanKp = $bimbinganList->where('status', 'aktif')->count();

        return Inertia::render('Dosen/Dashboard', [
            'kuota' => [
                'max' => $kuotaMax,
                'terpakai' => $totalBimbingan,
                'sisa' => max(0, $kuotaMax - $totalBimbingan)
            ],
            'stats' => [
                'totalBimbingan' => $totalBimbingan,
                'pendingReview' => $pendingReview,
                'pelaksanaanKp' => $pelaksanaanKp
            ],
            'bimbinganList' => $bimbinganList
        ]);
    }
}
