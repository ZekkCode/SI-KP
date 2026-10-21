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

        $dosbing = $pendaftaran->ensureDosenPembimbing();

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
            'dosen_pembimbing' => $dosbing?->name ?? ($pendaftaran->dosenPembimbing ? $pendaftaran->dosenPembimbing->name : '-'),
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

        $dosbing = $pendaftaran->ensureDosenPembimbing();

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
            'dosen_pembimbing' => $dosbing?->name ?? ($pendaftaran->dosenPembimbing ? $pendaftaran->dosenPembimbing->name : '-'),
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

        $hurufDetail = [];
        if ($pendaftaran->nilaiAkhir?->catatan && preg_match('/\[Instansi_Huruf\]:\s*(\{.*\})/m', $pendaftaran->nilaiAkhir->catatan, $mH)) {
            $hurufDetail = json_decode($mH[1], true) ?: [];
        }

        $convertHuruf = function($score) {
            if ($score === null || $score === '') return '-';
            if ($score > 80) return 'A';
            if ($score >= 75) return 'B+';
            if ($score >= 70) return 'B';
            if ($score >= 60) return 'C+';
            if ($score >= 55) return 'C';
            if ($score >= 50) return 'D+';
            if ($score >= 45) return 'D';
            return 'E';
        };

        $komponenInstansi = $nilais->where('tipe', 'instansi')->map(function($n) use ($hurufDetail, $convertHuruf) {
            $huruf = $hurufDetail[$n->komponen] ?? $convertHuruf($n->nilai);
            return [
                'komponen' => $n->komponen,
                'bobot' => $n->bobot,
                'nilai' => $n->nilai,
                'huruf' => $huruf,
            ];
        })->values();

        $agregat = $pendaftaran->nilaiAkhir ? $pendaftaran->nilaiAkhir->nilai_instansi : null;
        $hurufTotal = $hurufDetail['total'] ?? ($agregat !== null ? $convertHuruf($agregat) : '-');

        $rapor = [
            'mahasiswa' => $pendaftaran->mahasiswa,
            'instansi' => $pendaftaran->instansi ? $pendaftaran->instansi->nama : '-',
            'pembimbing_lapangan' => $pendaftaran->pembimbingLapangan ? $pendaftaran->pembimbingLapangan->nama : '-',
            'jabatan_pl' => $pendaftaran->pembimbingLapangan?->jabatan ?? 'Pembimbing Lapangan',
            'agregat_instansi' => $agregat,
            'nilai_huruf_instansi' => $hurufTotal,
            'rincian_instansi' => $komponenInstansi,
        ];

        return view('cetak.penilaian-instansi', compact('rapor'));
    }
}
