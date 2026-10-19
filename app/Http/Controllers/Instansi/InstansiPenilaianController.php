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
        $instansi = $user->instansi ?? $user->pembimbingLapangan?->instansi;

        if (!$instansi) {
            return Inertia::render('Instansi/Evaluation', [
                'pendaftarans' => []
            ])->with('error', 'Profil instansi atau pembimbing lapangan belum diatur.');
        }

        $pl = $user->pembimbingLapangan;

        // Ambil pendaftaran yang ada di instansi ini atau bimbingan PL ini (semua status aktif, bimbingan, atau selesai)
        $pendaftarans = Pendaftaran::with(['mahasiswa', 'nilaiAkhir', 'nilais' => function ($query) use ($user) {
                $query->where('penilai_id', $user->id)->where('tipe', 'instansi');
            }])
            ->where(function ($q) use ($instansi, $pl) {
                if ($instansi) {
                    $q->where('instansi_id', $instansi->id);
                }
                if ($pl) {
                    $q->orWhere('pembimbing_lapangan_id', $pl->id);
                }
            })
            ->whereNotIn('status', ['draft', 'ditolak', 'ditolak_instansi']) 
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
        $instansi = $user->instansi ?? $user->pembimbingLapangan?->instansi;
        $pl = $user->pembimbingLapangan;

        if (!$instansi && !$pl) {
            return back()->with('error', 'Profil instansi atau pembimbing lapangan belum diatur.');
        }

        $pendaftaran = Pendaftaran::where(function ($q) use ($instansi, $pl) {
            if ($instansi) {
                $q->where('instansi_id', $instansi->id);
            }
            if ($pl) {
                $q->orWhere('pembimbing_lapangan_id', $pl->id);
            }
        })->findOrFail($id);
        $penilaiId = $user->id;

        DB::beginTransaction();
        try {
            // Hapus nilai lama tipe instansi jika ada
            Nilai::where('pendaftaran_id', $pendaftaran->id)
                ->where('penilai_id', $penilaiId)
                ->where('tipe', 'instansi')
                ->delete();

            // Simpan komponen nilai (Kedisiplinan 30%, Kerjasama 30%, Kinerja Praktis 40%)
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
            
            // Kalkulasi nilai_total jika komponen nilai sudah lengkap
            $np = $nilaiAkhir->nilai_pembimbing;
            $ni = $nilaiAkhir->nilai_instansi;
            $nu = $nilaiAkhir->nilai_ujian;

            if ($np !== null && $ni !== null) {
                if ($nu !== null) {
                    $total = ($nu * 0.4) + ($np * 0.3) + ($ni * 0.3);
                } else {
                    $total = ($np * 0.6) + ($ni * 0.4);
                }
                $nilaiAkhir->nilai_total = round($total, 2);

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
                $catatanLama = $nilaiAkhir->catatan ? $nilaiAkhir->catatan . "\n" : "";
                $nilaiAkhir->catatan = $catatanLama . "[Instansi]: " . $request->catatan;
            }

            $nilaiAkhir->save();

            // Notifikasi ke mahasiswa
            \App\Models\Notifikasi::create([
                'user_id' => $pendaftaran->mahasiswa_id,
                'judul' => 'Nilai Instansi Telah Diberikan',
                'pesan' => 'Pembimbing Lapangan / Instansi ' . ($instansi->nama ?? '') . ' telah memberikan nilai evaluasi magang Anda (Nilai: ' . round($totalNilaiInstansi, 1) . ').',
                'tipe' => 'info',
                'priority' => 'high',
                'link' => '/mahasiswa/penilaian',
            ]);

            $dosbing = $pendaftaran->ensureDosenPembimbing();
            if ($dosbing) {
                \App\Models\Notifikasi::create([
                    'user_id' => $dosbing->id,
                    'judul' => 'Nilai Mitra Instansi Telah Masuk',
                    'pesan' => "Mitra Instansi telah memberikan nilai evaluasi untuk mahasiswa {$pendaftaran->mahasiswa?->name} ({$pendaftaran->mahasiswa?->nim}).",
                    'tipe' => 'info',
                    'priority' => 'high',
                    'link' => '/dosen/penilaian',
                ]);
            }

            DB::commit();
            return back()->with('success', 'Nilai berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan nilai: ' . $e->getMessage()]);
        }
    }
}
