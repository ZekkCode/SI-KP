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
     * Menampilkan dasbor instansi dengan statistik riil dan pantauan pendaftaran baru.
     */
    public function index()
    {
        $user = Auth::user();
        $pl = $user->pembimbingLapangan;
        $instansi = $user->instansi ?? $pl?->instansi;

        if (!$pl && !$instansi) {
            return Inertia::render('Instansi/Dashboard', [
                'mahasiswaBimbingan' => [],
                'stats' => [
                    'totalMahasiswa' => 0,
                    'menungguKonfirmasi' => 0,
                    'aktifKp' => 0,
                    'selesai' => 0,
                ],
                'mahasiswaBaru' => [],
            ])->with('error', 'Profil instansi atau pembimbing lapangan belum terdaftar di sistem.');
        }

        $plId = $pl?->id;
        $instansiId = $instansi?->id;

        $pendaftarans = Pendaftaran::with([
                'mahasiswa.programStudi',
                'suratPengantar',
                'proposals' => fn($q) => $q->latest(),
            ])
            ->where(function ($q) use ($plId, $instansiId) {
                if ($plId) {
                    $q->where('pembimbing_lapangan_id', $plId);
                }
                if ($instansiId) {
                    $q->orWhere('instansi_id', $instansiId);
                }
            })
            ->latest()
            ->get();

        $totalMahasiswa = $pendaftarans->count();
        $menungguKonfirmasi = $pendaftarans->where('status', 'surat_terbit')->count();
        $aktifKp = $pendaftarans->whereIn('status', ['diterima_instansi', 'verifikasi_surat_balasan', 'plotting_dosen', 'aktif'])->count();
        $selesai = $pendaftarans->where('status', 'selesai')->count();

        // Mahasiswa baru: status surat_terbit (belum direspons) atau baru diterima
        $mahasiswaBaru = $pendaftarans->filter(function ($p) {
            return in_array($p->status, ['surat_terbit', 'diterima_instansi']) || $p->created_at->diffInDays(now()) <= 14;
        })->values();

        return Inertia::render('Instansi/Dashboard', [
            'stats' => [
                'totalMahasiswa' => $totalMahasiswa,
                'menungguKonfirmasi' => $menungguKonfirmasi,
                'aktifKp' => $aktifKp,
                'selesai' => $selesai,
            ],
            'mahasiswaBaru' => $mahasiswaBaru,
            'mahasiswaBimbingan' => $pendaftarans,
        ]);
    }
}
