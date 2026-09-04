<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use App\Models\Nilai;
use App\Models\NilaiAkhir;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class InstansiPenilaianController extends Controller
{
    /**
     * Menampilkan daftar mahasiswa bimbingan di instansi tersebut.
     */
    public function index()
    {
        $user = Auth::user();
        $instansi = $user->instansi;

        if (!$instansi) {
            return Inertia::render('Instansi/Evaluation', [
                'pendaftarans' => []
            ])->with('error', 'Profil instansi belum diatur.');
        }

        // Ambil pendaftaran yang aktif atau selesai di instansi ini
        $pendaftarans = Pendaftaran::with(['mahasiswa', 'nilaiAkhir', 'nilais' => function ($query) use ($user) {
                $query->where('penilai_id', $user->id)->where('tipe', 'instansi');
            }])
            ->where('instansi_id', $instansi->id)
            ->whereIn('status', ['aktif', 'selesai']) 
            ->latest()
            ->get()
            ->map(function ($pendaftaran) {
                $isDinilai = $pendaftaran->nilais->count() > 0;
                return [
                    'id' => $pendaftaran->id,
                    'mahasiswa' => $pendaftaran->mahasiswa,
                    'status_kp' => $pendaftaran->status,
                    'is_dinilai' => $isDinilai,
                    'nilai_instansi' => $pendaftaran->nilaiAkhir ? $pendaftaran->nilaiAkhir->nilai_instansi : null,
                    'komponen_nilai' => $isDinilai ? $pendaftaran->nilais->pluck('nilai', 'komponen') : null,
                ];
            });

        return Inertia::render('Instansi/Evaluation', [
            'pendaftarans' => $pendaftarans
        ]);
    }

    /**
     * Menyimpan nilai evaluasi dari Instansi.
     */
    public function store(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'kedisiplinan' => 'required|numeric|min:0|max:100',
            'kerjasama' => 'required|numeric|min:0|max:100',
            'kinerja' => 'required|numeric|min:0|max:100',
            'catatan' => 'nullable|string'
        ]);

        $user = Auth::user();
        $instansi = $user->instansi;

        if (!$instansi) {
            return back()->with('error', 'Profil instansi belum diatur.');
        }

        $pendaftaran = Pendaftaran::where('instansi_id', $instansi->id)->findOrFail($id);
        $penilaiId = $user->id;

        DB::beginTransaction();
        try {
            // Hapus nilai lama tipe instansi jika ada
            Nilai::where('pendaftaran_id', $pendaftaran->id)
                ->where('penilai_id', $penilaiId)
                ->where('tipe', 'instansi')
                ->delete();

            // Simpan komponen nilai (contoh bobot merata atau disesuaikan)
            // Kedisiplinan 30%, Kerjasama 30%, Kinerja Praktis 40%
            $komponen = [
                ['nama' => 'kedisiplinan', 'bobot' => 30, 'nilai' => $request->kedisiplinan],
                ['nama' => 'kerjasama', 'bobot' => 30, 'nilai' => $request->kerjasama],
                ['nama' => 'kinerja', 'bobot' => 40, 'nilai' => $request->kinerja],
            ];

            $totalNilaiInstansi = 0;

            foreach ($komponen as $k) {
                Nilai::create([
                    'pendaftaran_id' => $pendaftaran->id,
                    'penilai_id' => $penilaiId,
                    'tipe' => 'instansi',
                    'komponen' => $k['nama'],
                    'bobot' => $k['bobot'],
                    'nilai' => $k['nilai'],
                ]);

                $totalNilaiInstansi += ($k['nilai'] * ($k['bobot'] / 100));
            }

            // Simpan/Update Nilai Akhir
            $nilaiAkhir = NilaiAkhir::firstOrNew(['pendaftaran_id' => $pendaftaran->id]);
            $nilaiAkhir->nilai_instansi = $totalNilaiInstansi;
            
            // Kalkulasi nilai_total jika nilai komponen lain sudah ada (nilai_pembimbing)
            // Misalnya: nilai ujian (40%), pembimbing (30%), instansi (30%)
            $total = 0;
            $status = 'proses';
            
            if ($nilaiAkhir->nilai_ujian !== null && $nilaiAkhir->nilai_pembimbing !== null) {
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
                $nilaiAkhir->catatan = $catatanLama . "[Instansi]: " . $request->catatan;
            }

            $nilaiAkhir->save();

            DB::commit();
            return back()->with('success', 'Nilai berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan nilai: ' . $e->getMessage()]);
        }
    }
}
