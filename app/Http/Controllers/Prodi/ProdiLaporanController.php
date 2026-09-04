<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdiLaporanController extends Controller
{
    /**
     * Menampilkan laporan rekapitulasi kerja praktik.
     */
    public function index(Request $request)
    {
        $statusFilter = $request->query('status', 'selesai'); // Default ke selesai/lulus

        $query = Pendaftaran::with(['mahasiswa', 'instansi', 'dosenPembimbing', 'nilaiAkhir'])
            ->orderBy('created_at', 'desc');

        if ($statusFilter === 'selesai') {
            // Lulus atau Selesai
            $query->whereIn('status', ['lulus', 'selesai']);
        } elseif ($statusFilter === 'berjalan') {
            // Sedang aktif / diverifikasi
            $query->whereNotIn('status', ['lulus', 'selesai', 'menunggu', 'ditolak_tu', 'ditolak_prodi', 'dibatalkan']);
        }
        // Jika 'semua', tidak ada filter where.

        $laporan = $query->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'nama_mahasiswa' => $p->mahasiswa ? $p->mahasiswa->name : '-',
                'nim_mahasiswa' => $p->mahasiswa ? $p->mahasiswa->nim : '-',
                'nama_instansi' => $p->instansi ? $p->instansi->nama : 'Belum Ada',
                'nama_dosen' => $p->dosenPembimbing ? $p->dosenPembimbing->name : 'Belum Plotting',
                'status' => $p->status,
                'tanggal_mulai' => $p->tanggal_mulai ? $p->tanggal_mulai->format('Y-m-d') : null,
                'tanggal_selesai' => $p->tanggal_selesai ? $p->tanggal_selesai->format('Y-m-d') : null,
                'nilai_total' => $p->nilaiAkhir ? $p->nilaiAkhir->nilai_total : null,
                'nilai_huruf' => $p->nilaiAkhir ? $p->nilaiAkhir->nilai_huruf : '-',
                'status_kelulusan' => $p->nilaiAkhir ? $p->nilaiAkhir->status : 'Belum Dinilai',
            ];
        });

        return Inertia::render('Prodi/Reports', [
            'laporan' => $laporan,
            'filters' => [
                'status' => $statusFilter
            ]
        ]);
    }
}
