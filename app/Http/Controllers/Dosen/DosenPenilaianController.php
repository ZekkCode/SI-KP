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
            ->where(function ($q) use ($dosenId) {
                $q->where('dosen_pembimbing_id', $dosenId)
                  ->orWhereHas('mahasiswa', fn($mq) => $mq->where('dosen_wali_id', $dosenId));
            })
            ->whereNotIn('status', ['draft', 'ditolak', 'ditolak_instansi']) 
            ->latest()
            ->get()
            ->map(function ($pendaftaran) {
                if (!$pendaftaran->dosen_pembimbing_id) {
                    $pendaftaran->ensureDosenPembimbing();
                }
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
        ->where(function ($q) use ($dosenId) {
            $q->where('dosen_pembimbing_id', $dosenId)
              ->orWhereHas('mahasiswa', fn($mq) => $mq->where('dosen_wali_id', $dosenId));
        })
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

        $dosenId = Auth::id();
        $pendaftaran = Pendaftaran::where(function ($q) use ($dosenId) {
            $q->where('dosen_pembimbing_id', $dosenId)
              ->orWhereHas('mahasiswa', fn($mq) => $mq->where('dosen_wali_id', $dosenId));
        })->findOrFail($id);
        $pendaftaran->ensureDosenPembimbing();
        $penilaiId = $dosenId;

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
                $nilaiAkhir->catatan = $catatanLama . "[Dosen Pembimbing]: " . $request->catatan;
            }

            $nilaiAkhir->save();

            // Berita Acara aktif otomatis setelah dosen pembimbing selesai menilai
            \App\Models\BeritaAcara::firstOrCreate(
                ['pendaftaran_id' => $pendaftaran->id],
                [
                    'status' => 'menunggu',
                    'path_file' => 'generated/berita_acara/ba_' . $pendaftaran->id . '.pdf',
                ]
            );

            // Ubah status pendaftaran menjadi selesai jika belum
            if ($pendaftaran->status !== 'selesai') {
                $pendaftaran->update(['status' => 'selesai']);
            }

            // Notifikasi ke mahasiswa
            \App\Models\Notifikasi::create([
                'user_id' => $pendaftaran->mahasiswa_id,
                'judul' => 'Nilai Dosen Pembimbing Telah Diberikan',
                'pesan' => 'Dosen Pembimbing telah menginputkan nilai evaluasi KP Anda (Nilai: ' . round($totalNilaiPembimbing, 1) . '). Tahap Berita Acara kini aktif dan menunggu validasi Koordinator Program Studi.',
                'tipe' => 'sukses',
                'priority' => 'high',
                'link' => '/mahasiswa/berita-acara',
            ]);

            // Notifikasi ke Koordinator Program Studi (Prodi)
            $prodiUsers = \App\Models\User::where('role', 'prodi')->get();
            foreach ($prodiUsers as $prodi) {
                \App\Models\Notifikasi::create([
                    'user_id' => $prodi->id,
                    'judul' => 'Berita Acara Siap Divalidasi',
                    'pesan' => "Dosen Pembimbing telah menilai mahasiswa {$pendaftaran->mahasiswa?->name} ({$pendaftaran->mahasiswa?->nim}). Berita Acara resmi (Form KP-5) siap divalidasi dan diterbitkan.",
                    'tipe' => 'info',
                    'priority' => 'high',
                    'link' => '/prodi/berita-acara',
                ]);
            }

            DB::commit();
            return redirect()->route('dosen.penilaian.index')->with('success', 'Nilai berhasil disimpan.');
        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('DosenPenilaian error: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
            return back()->withErrors(['error' => 'Gagal menyimpan nilai: ' . $e->getMessage()]);
        }
    }
}
