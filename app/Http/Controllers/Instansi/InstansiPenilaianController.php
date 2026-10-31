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
        $pl = $user->pembimbingLapangan;

        if (!$instansi && !$pl) {
            return Inertia::render('Instansi/Evaluation', [
                'pendaftarans' => [],
                'error' => 'Profil instansi atau pembimbing lapangan belum diatur.'
            ]);
        }

        // Ambil pendaftaran yang ada di instansi ini atau bimbingan PL ini (semua status aktif, bimbingan, atau selesai)
        $pendaftarans = Pendaftaran::with(['mahasiswa', 'nilaiAkhir', 'nilais' => function ($query) {
                $query->where('tipe', 'instansi');
            }])
            ->where(function ($q) use ($instansi, $pl, $user) {
                if ($instansi) {
                    $q->where('instansi_id', $instansi->id);
                }
                if ($pl) {
                    $q->orWhere('pembimbing_lapangan_id', $pl->id);
                }
                $q->orWhereHas('pembimbingLapangan', function($sub) use ($user) {
                    $sub->where('user_id', $user->id);
                });
            })
            ->whereNotIn('status', ['draft', 'ditolak', 'ditolak_instansi']) 
            ->latest()
            ->get()
            ->map(function ($pendaftaran) {
                $isDinilai = $pendaftaran->nilais->count() > 0 || $pendaftaran->nilaiAkhir?->nilai_instansi !== null;
                
                $catatanInstansi = null;
                $hurufDetail = null;
                if ($pendaftaran->nilaiAkhir?->catatan) {
                    if (preg_match('/\[Instansi_Huruf\]:\s*(\{.*\})/m', $pendaftaran->nilaiAkhir->catatan, $mH)) {
                        $hurufDetail = json_decode($mH[1], true);
                    }
                    if (preg_match('/\[Instansi\]:\s*(.+)$/m', $pendaftaran->nilaiAkhir->catatan, $matches)) {
                        $catatanInstansi = trim($matches[1]);
                    } elseif (!$hurufDetail) {
                        $catatanInstansi = $pendaftaran->nilaiAkhir->catatan;
                    }
                }

                $komponenMap = $isDinilai ? $pendaftaran->nilais->pluck('nilai', 'komponen')->toArray() : null;

                return [
                    'id' => $pendaftaran->id,
                    'mahasiswa' => $pendaftaran->mahasiswa,
                    'status_kp' => $pendaftaran->status,
                    'is_dinilai' => $isDinilai,
                    'nilai_instansi' => $pendaftaran->nilaiAkhir ? $pendaftaran->nilaiAkhir->nilai_instansi : null,
                    'nilai_huruf' => $hurufDetail['total'] ?? $pendaftaran->nilaiAkhir?->nilai_huruf ?? null,
                    'komponen_nilai' => $komponenMap,
                    'komponen_huruf' => $hurufDetail,
                    'catatan' => $catatanInstansi,
                ];
            });

        return Inertia::render('Instansi/Evaluation', [
            'pendaftarans' => $pendaftarans
        ]);
    }

    /**
     * Menyimpan nilai evaluasi dari Instansi sesuai Form KP-6a.
     */
    public function store(Request $request, $id): RedirectResponse
    {
        // Mendukung input Form KP-6a resmi (tugas 35%, sikap 25%, kedisiplinan 20%, laporan 20%)
        // serta fallback untuk kompatibilitas data lama
        $request->validate([
            'tugas' => 'nullable|numeric|min:0|max:100',
            'sikap' => 'nullable|numeric|min:0|max:100',
            'kedisiplinan' => 'required|numeric|min:0|max:100',
            'laporan' => 'nullable|numeric|min:0|max:100',
            'kerjasama' => 'nullable|numeric|min:0|max:100',
            'kinerja' => 'nullable|numeric|min:0|max:100',
            'tugas_huruf' => 'nullable|string',
            'sikap_huruf' => 'nullable|string',
            'kedisiplinan_huruf' => 'nullable|string',
            'laporan_huruf' => 'nullable|string',
            'nilai_huruf' => 'nullable|string',
            'catatan' => 'nullable|string'
        ]);

        $user = Auth::user();
        $pl = $user->pembimbingLapangan;
        $instansi = $user->instansi ?? $pl?->instansi;

        // Cari pendaftaran berdasarkan id
        $pendaftaran = Pendaftaran::with(['mahasiswa', 'instansi', 'dosenPembimbing'])->findOrFail($id);

        if ($instansi && !$pendaftaran->instansi_id) {
            $pendaftaran->update(['instansi_id' => $instansi->id]);
        }
        if ($pl && !$pendaftaran->pembimbing_lapangan_id) {
            $pendaftaran->update(['pembimbing_lapangan_id' => $pl->id]);
        }

        if (!$instansi && $pendaftaran->instansi) {
            $instansi = $pendaftaran->instansi;
        }

        $penilaiId = $user->id;

        DB::beginTransaction();
        try {
            // Hapus nilai lama tipe instansi jika ada
            Nilai::where('pendaftaran_id', $pendaftaran->id)
                ->where('tipe', 'instansi')
                ->delete();

            // Normalisasi nilai 4 Kriteria Form KP-6a resmi:
            // 1. Kemampuan menyelesaikan tugas: 35%
            // 2. Tingkah laku/ sikap: 25%
            // 3. Kedisiplinan: 20%
            // 4. Laporan: 20%
            $valTugas = $request->tugas ?? $request->kinerja ?? 0;
            $valSikap = $request->sikap ?? $request->kerjasama ?? 0;
            $valDisiplin = $request->kedisiplinan ?? 0;
            $valLaporan = $request->laporan ?? $request->kinerja ?? 0;

            $komponen = [
                ['nama' => 'tugas', 'label' => 'Kemampuan menyelesaikan tugas', 'bobot' => 35, 'nilai' => $valTugas],
                ['nama' => 'sikap', 'label' => 'Tingkah laku/ sikap', 'bobot' => 25, 'nilai' => $valSikap],
                ['nama' => 'kedisiplinan', 'label' => 'Kedisiplinan', 'bobot' => 20, 'nilai' => $valDisiplin],
                ['nama' => 'laporan', 'label' => 'Laporan', 'bobot' => 20, 'nilai' => $valLaporan],
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

            $totalNilaiInstansi = round($totalNilaiInstansi, 2);

            // Konversi nilai huruf otomatis sesuai skala UTM Form KP-6a (Image 2)
            $convertHuruf = function($score) {
                if ($score > 80) return 'A';
                if ($score >= 75) return 'B+';
                if ($score >= 70) return 'B';
                if ($score >= 60) return 'C+';
                if ($score >= 55) return 'C';
                if ($score >= 50) return 'D+';
                if ($score >= 45) return 'D';
                return 'E';
            };

            $hurufTotal = $convertHuruf($totalNilaiInstansi);

            // Simpan/Update Nilai Akhir
            $nilaiAkhir = NilaiAkhir::firstOrNew(['pendaftaran_id' => $pendaftaran->id]);
            $nilaiAkhir->nilai_instansi = $totalNilaiInstansi;
            if (!$nilaiAkhir->nilai_huruf || $nilaiAkhir->nilai_pembimbing === null) {
                $nilaiAkhir->nilai_huruf = $hurufTotal;
            }
            
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
                $nilaiAkhir->nilai_huruf = $convertHuruf($total);
                $nilaiAkhir->status = $total >= 55 ? 'lulus' : 'tidak_lulus';
            }

            // Simpan detail huruf per komponen dan catatan
            $hurufDetailJson = json_encode([
                'tugas' => $convertHuruf($valTugas),
                'sikap' => $convertHuruf($valSikap),
                'kedisiplinan' => $convertHuruf($valDisiplin),
                'laporan' => $convertHuruf($valLaporan),
                'total' => $hurufTotal,
            ]);

            $catatanText = '';
            if ($request->filled('catatan')) {
                $catatanText = trim($request->catatan);
            }

            $catatanLama = $nilaiAkhir->catatan ? preg_replace('/\[Instansi\]:[^\n]+(\n)?/', '', $nilaiAkhir->catatan) : '';
            $catatanLama = preg_replace('/\[Instansi_Huruf\]:[^\n]+(\n)?/', '', (string)$catatanLama);
            $catatanLama = trim((string)$catatanLama);

            $nilaiAkhir->catatan = ($catatanLama !== '' ? $catatanLama . "\n" : '') .
                "[Instansi_Huruf]: " . $hurufDetailJson . "\n" .
                ($catatanText !== '' ? "[Instansi]: " . $catatanText : '');

            $nilaiAkhir->save();

            try {
                $namaInstansi = $instansi?->nama ?? $pendaftaran->instansi?->nama ?? $pl?->nama ?? 'Mitra Instansi';

                // Notifikasi ke mahasiswa
                $notifMahasiswa = [
                    'user_id' => $pendaftaran->mahasiswa_id,
                    'judul' => 'Nilai Instansi Telah Diberikan',
                    'pesan' => 'Pembimbing Lapangan / ' . $namaInstansi . ' telah memberikan nilai evaluasi magang Anda (Nilai: ' . round($totalNilaiInstansi, 1) . ').',
                    'tipe' => 'info',
                    'link' => '/mahasiswa/penilaian',
                ];
                if (\Illuminate\Support\Facades\Schema::hasColumn('notifikasis', 'priority')) {
                    $notifMahasiswa['priority'] = 'high';
                }
                \App\Models\Notifikasi::create($notifMahasiswa);

                $dosbing = $pendaftaran->ensureDosenPembimbing();
                if ($dosbing) {
                    $notifDosbing = [
                        'user_id' => $dosbing->id,
                        'judul' => 'Nilai Mitra Instansi Telah Masuk',
                        'pesan' => "Mitra Instansi ({$namaInstansi}) telah memberikan nilai evaluasi untuk mahasiswa {$pendaftaran->mahasiswa?->name} ({$pendaftaran->mahasiswa?->nim}).",
                        'tipe' => 'info',
                        'link' => '/dosen/penilaian',
                    ];
                    if (\Illuminate\Support\Facades\Schema::hasColumn('notifikasis', 'priority')) {
                        $notifDosbing['priority'] = 'high';
                    }
                    \App\Models\Notifikasi::create($notifDosbing);
                }
            } catch (\Throwable $notifEx) {
                \Log::warning('Notifikasi gagal dikirim saat penilaian instansi: ' . $notifEx->getMessage());
            }

            DB::commit();
            return redirect()->route('instansi.evaluation')->with('success', "Nilai evaluasi mahasiswa {$pendaftaran->mahasiswa?->name} berhasil disimpan.");
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menyimpan nilai: ' . $e->getMessage())
                         ->withErrors(['error' => 'Gagal menyimpan nilai: ' . $e->getMessage()]);
        }
    }
}
