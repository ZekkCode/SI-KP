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

        // 2. Ambil daftar mahasiswa bimbingan (baik via dosen_pembimbing_id maupun dosen_wali_id)
        // Tanpa filter status agresif agar pendaftaran baru langsung terpantau
        $bimbinganList = Pendaftaran::with([
                'mahasiswa.programStudi',
                'instansi',
                'suratPengantar',
                'proposals' => function ($q) {
                    $q->latest();
                },
            ])
            ->where(function ($query) use ($dosenId) {
                $query->where('dosen_pembimbing_id', $dosenId)
                      ->orWhereHas('mahasiswa', fn($mq) => $mq->where('dosen_wali_id', $dosenId));
            })
            ->latest()
            ->get();

        // 3. Identifikasi mahasiswa baru (status awal atau pendaftaran 14 hari terakhir)
        $statusBaru = ['diajukan', 'verifikasi_tu', 'perlu_perbaikan', 'disetujui_tu', 'surat_terbit', 'diterima_instansi'];
        $mahasiswaBaru = $bimbinganList->filter(function ($p) use ($statusBaru) {
            return in_array($p->status, $statusBaru) || $p->created_at->diffInDays(now()) <= 14;
        })->values();

        // 4. Hitung statistik
        $totalBimbingan = $bimbinganList->count();

        // Menunggu Review Proposal: Ada proposal yang statusnya 'diajukan'
        $pendingReview = $bimbinganList->filter(function ($pendaftaran) {
            $proposal = $pendaftaran->proposals->first();
            return $proposal && $proposal->status === 'diajukan';
        })->count();

        // Pelaksanaan KP: Status pendaftaran 'aktif'
        $pelaksanaanKp = $bimbinganList->where('status', 'aktif')->count();
        $selesaiKp = $bimbinganList->where('status', 'selesai')->count();

        return Inertia::render('Dosen/Dashboard', [
            'kuota' => [
                'max' => $kuotaMax,
                'terpakai' => $totalBimbingan,
                'sisa' => max(0, $kuotaMax - $totalBimbingan),
            ],
            'stats' => [
                'totalBimbingan' => $totalBimbingan,
                'pendingReview' => $pendingReview,
                'pelaksanaanKp' => $pelaksanaanKp,
                'selesaiKp' => $selesaiKp,
                'mahasiswaBaruCount' => $mahasiswaBaru->count(),
            ],
            'mahasiswaBaru' => $mahasiswaBaru,
            'bimbinganList' => $bimbinganList,
        ]);
    }
}
