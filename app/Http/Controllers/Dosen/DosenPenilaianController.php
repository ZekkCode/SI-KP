<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Nilai;
use App\Models\NilaiAkhir;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class DosenPenilaianController extends Controller
{
    /**
     * Menampilkan daftar mahasiswa bimbingan beserta status nilai.
     */
    public function index()
    {
        $dosenId = Auth::id();

        // Ambil pendaftaran bimbingan beserta relasi nilai
        $pendaftarans = Pendaftaran::with(['mahasiswa', 'nilaiAkhir', 'nilais' => function ($query) use ($dosenId) {
                $query->where('penilai_id', $dosenId)->where('tipe', 'pembimbing');
            }])
            ->where('dosen_pembimbing_id', $dosenId)
            // Bisa difilter hanya yang statusnya aktif, selesai, dll.
            ->whereNotIn('status', ['draft', 'ditolak_instansi', 'verifikasi_tu']) 
            ->latest()
            ->get()
            ->map(function ($pendaftaran) {
                $isDinilai = $pendaftaran->nilais->count() > 0;
                return [
                    'id' => $pendaftaran->id,
                    'mahasiswa' => $pendaftaran->mahasiswa,
                    'status_kp' => $pendaftaran->status,
                    'is_dinilai' => $isDinilai,
                    'nilai_pembimbing' => $pendaftaran->nilaiAkhir ? $pendaftaran->nilaiAkhir->nilai_pembimbing : null,
                    'komponen_nilai' => $isDinilai ? $pendaftaran->nilais->pluck('nilai', 'komponen') : null,
                ];
            });

        return Inertia::render('Dosen/Penilaian/Index', [
            'pendaftarans' => $pendaftarans
        ]);
    }

    /**
     * Menampilkan form penilaian.
     */
    public function create($id)
    {
        $dosenId = Auth::id();
        $pendaftaran = Pendaftaran::with(['mahasiswa', 'nilaiAkhir', 'nilais' => function ($query) use ($dosenId) {
            $query->where('penilai_id', $dosenId)->where('tipe', 'pembimbing');
        }])
        ->where('dosen_pembimbing_id', $dosenId)
        ->findOrFail($id);

        $isDinilai = $pendaftaran->nilais->count() > 0;
        $komponen = $isDinilai ? $pendaftaran->nilais->pluck('nilai', 'komponen') : null;

        return Inertia::render('Dosen/Penilaian/Create', [
            'pendaftaran' => [
                'id' => $pendaftaran->id,
                'mahasiswa' => $pendaftaran->mahasiswa,
                'status_kp' => $pendaftaran->status,
                'catatan' => $pendaftaran->nilaiAkhir ? $pendaftaran->nilaiAkhir->catatan : '',
            ],
            'nilai_sebelumnya' => $komponen
        ]);
    }

    /**
     * Menyimpan atau memperbarui nilai dari dosen pembimbing.
     */
    public function store(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'sistematika' => 'required|numeric|min:0|max:100',
            'kedalaman' => 'required|numeric|min:0|max:100',
            'penguasaan' => 'required|numeric|min:0|max:100',
            'presentasi' => 'required|numeric|min:0|max:100',
            'catatan' => 'nullable|string'
        ]);

        $pendaftaran = Pendaftaran::where('dosen_pembimbing_id', Auth::id())->findOrFail($id);
        $penilaiId = Auth::id();

        DB::beginTransaction();
        try {
            // Hapus nilai lama jika ada
            Nilai::where('pendaftaran_id', $pendaftaran->id)
                ->where('penilai_id', $penilaiId)
                ->where('tipe', 'pembimbing')
                ->delete();

            // Simpan komponen nilai
            $komponen = [
                ['nama' => 'sistematika', 'bobot' => 20, 'nilai' => $request->sistematika],
                ['nama' => 'kedalaman', 'bobot' => 30, 'nilai' => $request->kedalaman],
                ['nama' => 'penguasaan', 'bobot' => 30, 'nilai' => $request->penguasaan],
                ['nama' => 'presentasi', 'bobot' => 20, 'nilai' => $request->presentasi],
            ];

            $totalNilaiPembimbing = 0;

            foreach ($komponen as $k) {
                Nilai::create([
                    'pendaftaran_id' => $pendaftaran->id,
                    'penilai_id' => $penilaiId,
                    'tipe' => 'pembimbing',
                    'komponen' => $k['nama'],
                    'bobot' => $k['bobot'],
                    'nilai' => $k['nilai'],
                ]);

                $totalNilaiPembimbing += ($k['nilai'] * ($k['bobot'] / 100));
            }

            // Simpan/Update Nilai Akhir
            $nilaiAkhir = NilaiAkhir::firstOrNew(['pendaftaran_id' => $pendaftaran->id]);
            $nilaiAkhir->nilai_pembimbing = $totalNilaiPembimbing;
            
            // Kalkulasi nilai_total jika nilai komponen lain sudah ada (opsional, disesuaikan)
            // Misalnya: nilai ujian (40%), pembimbing (30%), instansi (30%)
            $total = 0;
            $status = 'proses';
            
            if ($nilaiAkhir->nilai_ujian !== null && $nilaiAkhir->nilai_instansi !== null) {
                $total = ($nilaiAkhir->nilai_ujian * 0.4) + ($nilaiAkhir->nilai_pembimbing * 0.3) + ($nilaiAkhir->nilai_instansi * 0.3);
                $nilaiAkhir->nilai_total = $total;
                
                // Konversi Huruf
                if ($total >= 85) $nilaiAkhir->nilai_huruf = 'A';
                else if ($total >= 70) $nilaiAkhir->nilai_huruf = 'B';
                else if ($total >= 55) $nilaiAkhir->nilai_huruf = 'C';
                else if ($total >= 40) $nilaiAkhir->nilai_huruf = 'D';
                else $nilaiAkhir->nilai_huruf = 'E';

                $status = $total >= 55 ? 'lulus' : 'tidak_lulus';
                $nilaiAkhir->status = $status;
            }

            if ($request->filled('catatan')) {
                // Tambahkan atau gabungkan catatan
                $catatanLama = $nilaiAkhir->catatan ? $nilaiAkhir->catatan . "\n" : "";
                $nilaiAkhir->catatan = $catatanLama . "[Dosen Pembimbing]: " . $request->catatan;
            }

            $nilaiAkhir->save();

            // Ubah status pendaftaran menjadi selesai
            $pendaftaran->update(['status' => 'selesai']);

            DB::commit();
            return redirect()->route('dosen.penilaian.index')->with('success', 'Nilai berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan nilai: ' . $e->getMessage()]);
        }
    }
}
