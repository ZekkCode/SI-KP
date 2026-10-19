<?php

namespace App\Http\Controllers\TU;

use App\Http\Controllers\Controller;
use App\Models\PembimbingLapangan;
use App\Models\Pendaftaran;
use App\Models\SuratPengantar;
use Inertia\Inertia;

class TUDashboardController extends Controller
{
    /**
     * Menampilkan dasbor untuk role TU dengan statistik nyata dan data kredensial mitra.
     */
    public function index()
    {
        // 1. Mahasiswa KP Aktif (Pendaftaran status 'aktif')
        $mahasiswaAktif = Pendaftaran::where('status', 'aktif')->count();

        // 2. Antrean Surat Pengantar yang menunggu verifikasi di menu Generate Surat
        $antreanSuratPengantar = SuratPengantar::where('status', 'menunggu_verifikasi')->count();

        // 3. Statistik Pembimbing Lapangan Mitra
        $totalMitra = PembimbingLapangan::count();
        $mitraAktif = PembimbingLapangan::whereHas('user', fn($q) => $q->where('status_akun', 'aktif'))->count();
        $mitraPending = PembimbingLapangan::whereHas('user', fn($q) => $q->where('status_akun', 'pending'))->count();
        $mitraBelumKlaim = PembimbingLapangan::whereNull('user_id')->count();

        // 4. Data Pembimbing Lapangan Mitra untuk GUI Email Kredensial di Dashboard TU
        $mitraList = PembimbingLapangan::with([
            'user:id,name,email,role,status_akun,no_telepon,must_change_password',
            'instansi:id,nama,alamat,kota',
            'pendaftarans' => function ($q) {
                $q->with('mahasiswa:id,name,nim')->latest();
            },
        ])
        ->latest()
        ->take(6)
        ->get()
        ->map(function ($pl) {
            $pendaftaran = $pl->pendaftarans->first();
            $periodeKP = null;
            if ($pendaftaran && $pendaftaran->tanggal_mulai && $pendaftaran->tanggal_selesai) {
                $periodeKP = $pendaftaran->tanggal_mulai->translatedFormat('d M Y') . ' s.d ' . $pendaftaran->tanggal_selesai->translatedFormat('d M Y');
            }

            return [
                'id' => $pl->id,
                'nama' => $pl->nama,
                'instansi_id' => $pl->instansi_id,
                'user_id' => $pl->user_id,
                'created_at' => $pl->created_at?->translatedFormat('d M Y') ?? '-',
                'user' => $pl->user ? [
                    'id' => $pl->user->id,
                    'name' => $pl->user->name,
                    'email' => $pl->user->email,
                    'status_akun' => $pl->user->status_akun,
                    'no_telepon' => $pl->user->no_telepon,
                    'must_change_password' => (bool) $pl->user->must_change_password,
                ] : null,
                'instansi' => $pl->instansi ? [
                    'id' => $pl->instansi->id,
                    'nama' => $pl->instansi->nama,
                    'alamat' => $pl->instansi->alamat,
                    'kota' => $pl->instansi->kota,
                ] : null,
                'mahasiswa' => $pendaftaran && $pendaftaran->mahasiswa ? [
                    'id' => $pendaftaran->mahasiswa->id,
                    'name' => $pendaftaran->mahasiswa->name,
                    'nim' => $pendaftaran->mahasiswa->nim,
                ] : null,
                'periode_kp' => $periodeKP,
                'pendaftaran_status' => $pendaftaran?->status,
            ];
        });

        return Inertia::render('TU/Dashboard', [
            'stats' => [
                'mahasiswa_aktif' => $mahasiswaAktif,
                'antrean_surat' => $antreanSuratPengantar,
                'total_mitra' => $totalMitra,
                'mitra_aktif' => $mitraAktif,
                'mitra_pending' => $mitraPending,
                'mitra_belum_klaim' => $mitraBelumKlaim,
            ],
            'mitraList' => $mitraList,
        ]);
    }
}
