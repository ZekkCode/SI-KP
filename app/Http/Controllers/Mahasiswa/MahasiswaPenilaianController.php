<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MahasiswaPenilaianController extends Controller
{
    /**
     * Menampilkan hasil penilaian akhir kepada mahasiswa.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Ambil data pendaftaran terbaru yang statusnya bukan draf/ditolak sepenuhnya (opsional: ambil yang terakhir)
        $pendaftaran = Pendaftaran::with([
            'nilaiAkhir', 
            'nilais',
            'dosenPembimbing',
            'instansi'
        ])
        ->where('mahasiswa_id', $user->id)
        ->latest()
        ->first();

        if (!$pendaftaran) {
            return Inertia::render('Mahasiswa/Penilaian/Index', [
                'hasData' => false,
                'message' => 'Anda belum memiliki riwayat pendaftaran Kerja Praktik.'
            ]);
        }

        $nilaiAkhir = $pendaftaran->nilaiAkhir;
        $nilais = $pendaftaran->nilais;

        // Kelompokkan nilai per penilai (Dosen / Instansi)
        $komponenDosen = $nilais->where('tipe', 'pembimbing')->map(function($n) {
            return [
                'komponen' => $n->komponen,
                'bobot' => $n->bobot,
                'nilai' => $n->nilai
            ];
        })->values();

        $komponenInstansi = $nilais->where('tipe', 'instansi')->map(function($n) {
            return [
                'komponen' => $n->komponen,
                'bobot' => $n->bobot,
                'nilai' => $n->nilai
            ];
        })->values();

        $dataRapor = [
            'status_kp' => $pendaftaran->status,
            'dosen_pembimbing' => $pendaftaran->dosenPembimbing ? $pendaftaran->dosenPembimbing->name : '-',
            'instansi' => $pendaftaran->instansi ? $pendaftaran->instansi->nama : '-',
            
            // Rekap Agregat
            'agregat_dosen' => $nilaiAkhir ? $nilaiAkhir->nilai_pembimbing : null,
            'agregat_instansi' => $nilaiAkhir ? $nilaiAkhir->nilai_instansi : null,
            'agregat_ujian' => $nilaiAkhir ? $nilaiAkhir->nilai_ujian : null,
            
            // Total & Kelulusan
            'nilai_total' => $nilaiAkhir ? $nilaiAkhir->nilai_total : null,
            'nilai_huruf' => $nilaiAkhir ? $nilaiAkhir->nilai_huruf : '-',
            'status_lulus' => $nilaiAkhir ? $nilaiAkhir->status : 'proses',
            'catatan' => $nilaiAkhir ? $nilaiAkhir->catatan : null,
            
            // Detail
            'rincian_dosen' => $komponenDosen,
            'rincian_instansi' => $komponenInstansi,
        ];

        return Inertia::render('Mahasiswa/Penilaian/Index', [
            'hasData' => true,
            'rapor' => $dataRapor
        ]);
    }

    /**
     * Mencetak halaman nilai (Blade HTML).
     */
    public function cetak()
    {
        $user = Auth::user();
        
        $pendaftaran = Pendaftaran::with([
            'nilaiAkhir', 
            'nilais',
            'dosenPembimbing',
            'instansi',
            'mahasiswa'
        ])
        ->where('mahasiswa_id', $user->id)
        ->latest()
        ->first();

        if (!$pendaftaran) {
            return abort(404, 'Data tidak ditemukan.');
        }

        $nilaiAkhir = $pendaftaran->nilaiAkhir;
        $nilais = $pendaftaran->nilais;

        $komponenDosen = $nilais->where('tipe', 'pembimbing')->map(function($n) {
            return [
                'komponen' => $n->komponen,
                'bobot' => $n->bobot,
                'nilai' => $n->nilai
            ];
        })->values();

        $komponenInstansi = $nilais->where('tipe', 'instansi')->map(function($n) {
            return [
                'komponen' => $n->komponen,
                'bobot' => $n->bobot,
                'nilai' => $n->nilai
            ];
        })->values();

        $rapor = [
            'mahasiswa' => $pendaftaran->mahasiswa,
            'status_kp' => $pendaftaran->status,
            'dosen_pembimbing' => $pendaftaran->dosenPembimbing ? $pendaftaran->dosenPembimbing->name : '-',
            'instansi' => $pendaftaran->instansi ? $pendaftaran->instansi->nama : '-',
            'agregat_dosen' => $nilaiAkhir ? $nilaiAkhir->nilai_pembimbing : null,
            'agregat_instansi' => $nilaiAkhir ? $nilaiAkhir->nilai_instansi : null,
            'agregat_ujian' => $nilaiAkhir ? $nilaiAkhir->nilai_ujian : null,
            'nilai_total' => $nilaiAkhir ? $nilaiAkhir->nilai_total : null,
            'nilai_huruf' => $nilaiAkhir ? $nilaiAkhir->nilai_huruf : '-',
            'status_lulus' => $nilaiAkhir ? $nilaiAkhir->status : 'proses',
            'catatan' => $nilaiAkhir ? $nilaiAkhir->catatan : null,
            'rincian_dosen' => $komponenDosen,
            'rincian_instansi' => $komponenInstansi,
        ];

        return view('cetak.nilai-kp', compact('rapor'));
    }

    /**
     * Mencetak halaman nilai instansi khusus dari Pembimbing Lapangan.
     */
    public function cetakInstansi()
    {
        $user = Auth::user();
        
        $pendaftaran = Pendaftaran::with([
            'nilaiAkhir', 
            'nilais',
            'dosenPembimbing',
            'instansi',
            'pembimbingLapangan',
            'mahasiswa'
        ])
        ->where('mahasiswa_id', $user->id)
        ->latest()
        ->firstOrFail();

        $nilais = $pendaftaran->nilais;

        $komponenInstansi = $nilais->where('tipe', 'instansi')->map(function($n) {
            return [
                'komponen' => $n->komponen,
                'bobot' => $n->bobot,
                'nilai' => $n->nilai
            ];
        })->values();

        $rapor = [
            'mahasiswa' => $pendaftaran->mahasiswa,
            'instansi' => $pendaftaran->instansi ? $pendaftaran->instansi->nama : '-',
            'pembimbing_lapangan' => $pendaftaran->pembimbingLapangan ? $pendaftaran->pembimbingLapangan->nama : '-',
            'agregat_instansi' => $pendaftaran->nilaiAkhir ? $pendaftaran->nilaiAkhir->nilai_instansi : null,
            'rincian_instansi' => $komponenInstansi,
        ];

        return view('cetak.penilaian-instansi', compact('rapor'));
    }
}
