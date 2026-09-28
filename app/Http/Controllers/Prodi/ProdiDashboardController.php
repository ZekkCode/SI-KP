<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\Instansi;
use App\Models\Pendaftaran;
use App\Models\Sidang;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class ProdiDashboardController extends Controller
{
    /**
     * Menampilkan dasbor untuk role Prodi dengan statistik global dan pemantauan sidang.
     */
    public function index()
    {
        try {
            // 1. Total Mahasiswa
            $totalMahasiswa = User::where('role', 'mahasiswa')->count() ?? 0;

            // 2. Total Dosen Pembimbing Aktif
            $totalDosen = User::where('role', 'dosen')->count() ?? 0;

            // 3. Total Instansi Mitra
            $totalInstansi = Instansi::count() ?? 0;

            // 4. Mahasiswa Aktif KP
            $mahasiswaAktif = Pendaftaran::whereIn('status', ['aktif', 'disetujui_tu', 'seminar'])->count() ?? 0;

            // 5. Statistik Sidang (Req 9)
            $totalSidangPending = Sidang::where('status', 'diajukan')->count();
            $jadwalSidangMingguIni = Sidang::where('status', 'dijadwalkan')
                ->whereBetween('tanggal_sidang', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                ->count();
            $sidangSelesai = Sidang::where('status', 'selesai')->count();

            // 6. Sidang Mendatang (5 terdekat)
            $sidangMendatang = Sidang::with([
                'pendaftaran.mahasiswa',
                'pendaftaran.dosenPembimbing',
                'dosenPenguji'
            ])
            ->where('status', 'dijadwalkan')
            ->where('tanggal_sidang', '>=', now())
            ->orderBy('tanggal_sidang', 'asc')
            ->take(5)
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'tanggal_formatted' => $s->tanggal_sidang?->translatedFormat('d M Y, H:i') . ' WIB',
                'ruangan' => $s->ruangan,
                'mahasiswa' => $s->pendaftaran?->mahasiswa?->name,
                'nim' => $s->pendaftaran?->mahasiswa?->nim,
                'dosen' => $s->dosenPenguji?->name ?? $s->pendaftaran?->dosenPembimbing?->name,
            ]);

            return Inertia::render('Prodi/Dashboard', [
                'stats' => [
                    'total_mahasiswa' => $totalMahasiswa,
                    'total_dosen' => $totalDosen,
                    'total_instansi' => $totalInstansi,
                    'mahasiswa_aktif' => $mahasiswaAktif,
                    'total_sidang_pending' => $totalSidangPending,
                    'jadwal_sidang_minggu_ini' => $jadwalSidangMingguIni,
                    'sidang_selesai' => $sidangSelesai,
                ],
                'sidang_mendatang' => $sidangMendatang,
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Prodi/Dashboard', [
                'stats' => [
                    'total_mahasiswa' => 0,
                    'total_dosen' => 0,
                    'total_instansi' => 0,
                    'mahasiswa_aktif' => 0,
                    'total_sidang_pending' => 0,
                    'jadwal_sidang_minggu_ini' => 0,
                    'sidang_selesai' => 0,
                ],
                'sidang_mendatang' => [],
                'error' => 'Terjadi kesalahan sistem saat memuat data dashboard: ' . $e->getMessage()
            ]);
        }
    }
}
