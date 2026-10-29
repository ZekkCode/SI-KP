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
                $query->whereIn('tipe', ['pembimbing', 'ujian_kp']);
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
                $isDinilai = $pendaftaran->nilais->count() > 0 || $pendaftaran->nilaiAkhir?->nilai_pembimbing !== null;

                $hurufDetail = null;
                if ($pendaftaran->nilaiAkhir?->catatan && preg_match('/\[Dosen_Huruf\]:\s*(\{.*\})/m', $pendaftaran->nilaiAkhir->catatan, $mH)) {
                    $hurufDetail = json_decode($mH[1], true);
                }

                return [
                    'id' => $pendaftaran->id,
                    'mahasiswa' => $pendaftaran->mahasiswa,
                    'status_kp' => $pendaftaran->status,
                    'is_dinilai' => $isDinilai,
                    'nilai_pembimbing' => $pendaftaran->nilaiAkhir ? $pendaftaran->nilaiAkhir->nilai_pembimbing : null,
                    'nilai_ujian' => $pendaftaran->nilaiAkhir ? $pendaftaran->nilaiAkhir->nilai_ujian : null,
                    'nilai_huruf' => $hurufDetail['total'] ?? $pendaftaran->nilaiAkhir?->nilai_huruf ?? null,
                    'komponen_nilai' => $isDinilai ? $pendaftaran->nilais->pluck('nilai', 'komponen') : null,
                    'komponen_huruf' => $hurufDetail,
                ];
            });

        return Inertia::render('Dosen/Penilaian/Index', [
            'pendaftarans' => $pendaftarans
        ]);
    }

    /**
     * Menampilkan form penilaian sesuai Form KP-6b.
     */
    public function create($id)
    {
        $dosenId = Auth::id();
        $pendaftaran = Pendaftaran::with(['mahasiswa', 'nilaiAkhir', 'nilais' => function ($query) {
            $query->whereIn('tipe', ['pembimbing', 'ujian_kp']);
        }])
        ->where(function ($q) use ($dosenId) {
            $q->where('dosen_pembimbing_id', $dosenId)
              ->orWhereHas('mahasiswa', fn($mq) => $mq->where('dosen_wali_id', $dosenId));
        })
        ->findOrFail($id);

        $isDinilai = $pendaftaran->nilais->count() > 0;
        $komponen = $isDinilai ? $pendaftaran->nilais->pluck('nilai', 'komponen')->toArray() : null;

        $catatanDosen = '';
        $hurufDetail = null;
        if ($pendaftaran->nilaiAkhir?->catatan) {
            if (preg_match('/\[Dosen_Huruf\]:\s*(\{.*\})/m', $pendaftaran->nilaiAkhir->catatan, $mH)) {
                $hurufDetail = json_decode($mH[1], true);
            }
            if (preg_match('/\[Dosen Pembimbing\]:\s*(.+)$/m', $pendaftaran->nilaiAkhir->catatan, $mC)) {
                $catatanDosen = trim($mC[1]);
            } elseif (!$hurufDetail && !str_contains($pendaftaran->nilaiAkhir->catatan, '[')) {
                $catatanDosen = $pendaftaran->nilaiAkhir->catatan;
            }
        }

        return Inertia::render('Dosen/Penilaian/Create', [
            'pendaftaran' => [
                'id' => $pendaftaran->id,
                'mahasiswa' => $pendaftaran->mahasiswa,
                'status_kp' => $pendaftaran->status,
                'catatan' => $catatanDosen,
                'nilai_pembimbing' => $pendaftaran->nilaiAkhir?->nilai_pembimbing,
                'nilai_ujian' => $pendaftaran->nilaiAkhir?->nilai_ujian,
                'nilai_huruf' => $hurufDetail['total'] ?? $pendaftaran->nilaiAkhir?->nilai_huruf,
            ],
            'nilai_sebelumnya' => $komponen,
            'huruf_sebelumnya' => $hurufDetail,
        ]);
    }

    /**
     * Menyimpan atau memperbarui nilai dari dosen sesuai Form KP-6b.
     */
    public function store(Request $request, $id): RedirectResponse
    {
        $request->validate([
            // Tabel 1: Komponen Penilaian Ujian KP (Penguji)
            'perumusan_masalah' => 'nullable|numeric|min:0|max:100',
            'manfaat' => 'nullable|numeric|min:0|max:100',
            'tinjauan_pustaka' => 'nullable|numeric|min:0|max:100',
            'metode' => 'nullable|numeric|min:0|max:100',
            'presentasi' => 'nullable|numeric|min:0|max:100',

            // Tabel 2: Penilaian Lapangan & Bimbingan (Pembimbing)
            'permasalahan' => 'nullable|numeric|min:0|max:100',
            'laporan' => 'nullable|numeric|min:0|max:100',
            'ujian_kp' => 'nullable|numeric|min:0|max:100',

            // Nilai Huruf
            'perumusan_masalah_huruf' => 'nullable|string',
            'manfaat_huruf' => 'nullable|string',
            'tinjauan_pustaka_huruf' => 'nullable|string',
            'metode_huruf' => 'nullable|string',
            'presentasi_huruf' => 'nullable|string',
            'nilai_ujian_huruf' => 'nullable|string',

            'permasalahan_huruf' => 'nullable|string',
            'laporan_huruf' => 'nullable|string',
            'ujian_kp_huruf' => 'nullable|string',
            'nilai_bimbingan_huruf' => 'nullable|string',
            'nilai_huruf' => 'nullable|string',

            // Fallback backward compatibility parameters
            'sistematika' => 'nullable|numeric|min:0|max:100',
            'kedalaman' => 'nullable|numeric|min:0|max:100',
            'penguasaan' => 'nullable|numeric|min:0|max:100',

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
            // Hapus nilai lama tipe pembimbing & ujian_kp untuk pendaftaran ini
            Nilai::where('pendaftaran_id', $pendaftaran->id)
                ->whereIn('tipe', ['pembimbing', 'ujian_kp'])
                ->delete();

            // Konversi nilai huruf sesuai standar UTM Form KP-6b
            $convertHuruf = function($score) {
                if ($score === null || $score === '' || is_nan((float)$score)) return '-';
                $val = (float)$score;
                if ($val > 80) return 'A';
                if ($val >= 75) return 'B+';
                if ($val >= 70) return 'B';
                if ($val >= 60) return 'C+';
                if ($val >= 55) return 'C';
                if ($val >= 50) return 'D+';
                if ($val >= 45) return 'D';
                return 'E';
            };

            $isFormKP6b = $request->filled('permasalahan')
                || $request->filled('perumusan_masalah')
                || $request->filled('manfaat')
                || $request->filled('tinjauan_pustaka')
                || $request->filled('metode')
                || $request->filled('presentasi')
                || $request->filled('laporan')
                || $request->filled('ujian_kp');

            if ($isFormKP6b) {
                // Tabel 1: Komponen Penilaian Ujian KP (Penguji)
                $valPerumusan = (float) ($request->perumusan_masalah ?? 0);
                $valManfaat = (float) ($request->manfaat ?? 0);
                $valTinjauan = (float) ($request->tinjauan_pustaka ?? 0);
                $valMetode = (float) ($request->metode ?? 0);
                $valPresentasi = (float) ($request->presentasi ?? 0);

                $komponenUjian = [
                    ['nama' => 'perumusan_masalah', 'label' => 'Perumusan Masalah', 'bobot' => 15, 'nilai' => $valPerumusan],
                    ['nama' => 'manfaat', 'label' => 'Manfaat Hasil KP', 'bobot' => 20, 'nilai' => $valManfaat],
                    ['nama' => 'tinjauan_pustaka', 'label' => 'Tinjauan Pustaka', 'bobot' => 15, 'nilai' => $valTinjauan],
                    ['nama' => 'metode', 'label' => 'Metode Penelitian', 'bobot' => 20, 'nilai' => $valMetode],
                    ['nama' => 'presentasi', 'label' => 'Presentasi & Tanya Jawab', 'bobot' => 30, 'nilai' => $valPresentasi],
                ];

                $totalNilaiUjian = 0;
                foreach ($komponenUjian as $k) {
                    Nilai::create([
                        'pendaftaran_id' => $pendaftaran->id,
                        'penilai_id' => $penilaiId,
                        'tipe' => 'ujian_kp',
                        'komponen' => $k['nama'],
                        'bobot' => $k['bobot'],
                        'nilai' => $k['nilai'],
                    ]);
                    $totalNilaiUjian += ($k['nilai'] * ($k['bobot'] / 100));
                }
                $totalNilaiUjian = round($totalNilaiUjian, 2);

                // Tabel 2: Penilaian Lapangan & Bimbingan (Pembimbing)
                $valPermasalahan = (float) ($request->permasalahan ?? 0);
                $valLaporan = (float) ($request->laporan ?? 0);
                $valUjianKp = $request->filled('ujian_kp') ? (float) $request->ujian_kp : $totalNilaiUjian;

                $komponenBimbingan = [
                    ['nama' => 'permasalahan', 'label' => 'Permasalahan Masalah dan Solusi', 'bobot' => 30, 'nilai' => $valPermasalahan],
                    ['nama' => 'laporan', 'label' => 'Laporan', 'bobot' => 30, 'nilai' => $valLaporan],
                    ['nama' => 'ujian_kp', 'label' => 'Ujian KP (Dari hasil ujian KP)', 'bobot' => 40, 'nilai' => $valUjianKp],
                ];

                $totalNilaiPembimbing = 0;
                foreach ($komponenBimbingan as $k) {
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
                $totalNilaiPembimbing = round($totalNilaiPembimbing, 2);

                $hurufUjian = $convertHuruf($totalNilaiUjian);
                $hurufPembimbing = $convertHuruf($totalNilaiPembimbing);
                $hurufTotal = $hurufPembimbing;

                $hurufDetailJson = json_encode([
                    'ujian' => [
                        'perumusan_masalah' => $convertHuruf($valPerumusan),
                        'manfaat' => $convertHuruf($valManfaat),
                        'tinjauan_pustaka' => $convertHuruf($valTinjauan),
                        'metode' => $convertHuruf($valMetode),
                        'presentasi' => $convertHuruf($valPresentasi),
                        'total' => $hurufUjian,
                    ],
                    'bimbingan' => [
                        'permasalahan' => $convertHuruf($valPermasalahan),
                        'laporan' => $convertHuruf($valLaporan),
                        'ujian_kp' => $convertHuruf($valUjianKp),
                        'total' => $hurufPembimbing,
                    ],
                    'total' => $hurufTotal,
                ]);

            } else {
                // Fallback untuk backward-compatibility testing (sistematika, kedalaman, penguasaan, presentasi)
                $valSistematika = $request->sistematika ?? 0;
                $valKedalaman = $request->kedalaman ?? 0;
                $valPenguasaan = $request->penguasaan ?? 0;
                $valPresentasi = $request->presentasi ?? 0;

                $komponen = [
                    ['nama' => 'sistematika', 'bobot' => 20, 'nilai' => $valSistematika],
                    ['nama' => 'kedalaman', 'bobot' => 30, 'nilai' => $valKedalaman],
                    ['nama' => 'penguasaan', 'bobot' => 30, 'nilai' => $valPenguasaan],
                    ['nama' => 'presentasi', 'bobot' => 20, 'nilai' => $valPresentasi],
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
                $totalNilaiPembimbing = round($totalNilaiPembimbing, 2);
                $totalNilaiUjian = null;
                $hurufTotal = $convertHuruf($totalNilaiPembimbing);
                $hurufDetailJson = null;
            }

            // Simpan/Update Nilai Akhir
            $nilaiAkhir = NilaiAkhir::firstOrNew(['pendaftaran_id' => $pendaftaran->id]);
            $nilaiAkhir->nilai_pembimbing = $totalNilaiPembimbing;
            if ($totalNilaiUjian !== null) {
                $nilaiAkhir->nilai_ujian = $totalNilaiUjian;
            }
            if ($hurufTotal) {
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

            // Simpan Catatan Dosen & Detail Huruf
            $catatanText = '';
            if ($request->filled('catatan')) {
                $catatanText = trim($request->catatan);
            }
            $existingCatatan = $nilaiAkhir->catatan ?? '';
            $cleaned = preg_replace('/\[Dosen_Huruf\]:\s*\{.*\}\r?\n?/m', '', $existingCatatan);
            $cleaned = preg_replace('/\[Dosen Pembimbing\]:\s*[^\r\n]+\r?\n?/m', '', $cleaned);
            $cleaned = trim($cleaned);

            $parts = [];
            if ($cleaned !== '') {
                $parts[] = $cleaned;
            }
            if ($hurufDetailJson) {
                $parts[] = "[Dosen_Huruf]: " . $hurufDetailJson;
            }
            if ($catatanText !== '') {
                $parts[] = "[Dosen Pembimbing]: " . $catatanText;
            }
            $nilaiAkhir->catatan = implode("\n", $parts);

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

            try {
                // Notifikasi ke mahasiswa
                $notifMhs = [
                    'user_id' => $pendaftaran->mahasiswa_id,
                    'judul' => 'Nilai Dosen Pembimbing Telah Diberikan',
                    'pesan' => 'Dosen Pembimbing telah menginputkan nilai evaluasi KP Anda (Nilai: ' . round($totalNilaiPembimbing, 1) . '). Tahap Berita Acara kini aktif dan menunggu validasi Koordinator Program Studi.',
                    'tipe' => 'sukses',
                    'link' => '/mahasiswa/berita-acara',
                ];
                if (\Illuminate\Support\Facades\Schema::hasColumn('notifikasis', 'priority')) {
                    $notifMhs['priority'] = 'high';
                }
                \App\Models\Notifikasi::create($notifMhs);

                // Notifikasi ke Koordinator Program Studi (Prodi)
                $prodiUsers = \App\Models\User::where('role', 'prodi')->get();
                foreach ($prodiUsers as $prodi) {
                    $notifProdi = [
                        'user_id' => $prodi->id,
                        'judul' => 'Berita Acara Siap Divalidasi',
                        'pesan' => "Dosen Pembimbing telah menilai mahasiswa {$pendaftaran->mahasiswa?->name} ({$pendaftaran->mahasiswa?->nim}). Berita Acara resmi (Form KP-5) siap divalidasi dan diterbitkan.",
                        'tipe' => 'info',
                        'link' => '/prodi/berita-acara',
                    ];
                    if (\Illuminate\Support\Facades\Schema::hasColumn('notifikasis', 'priority')) {
                        $notifProdi['priority'] = 'high';
                    }
                    \App\Models\Notifikasi::create($notifProdi);
                }
            } catch (\Throwable $notifEx) {
                \Log::warning('Notifikasi gagal dikirim pasca penilaian dosen: ' . $notifEx->getMessage());
            }

            DB::commit();
            return redirect()->route('dosen.penilaian.index')->with('success', 'Nilai berhasil disimpan.');
        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('DosenPenilaian error: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
            return back()->withErrors(['error' => 'Gagal menyimpan nilai: ' . $e->getMessage()]);
        }
    }

    /**
     * Mencetak Formulir Berkas KP-6b (Penilaian Ujian & Bimbingan Dosen).
     */
    public function cetak($id)
    {
        $dosenId = Auth::id();
        $pendaftaran = Pendaftaran::with([
            'mahasiswa',
            'nilaiAkhir',
            'nilais',
            'dosenPembimbing',
            'instansi'
        ])
        ->where(function ($q) use ($dosenId) {
            $q->where('dosen_pembimbing_id', $dosenId)
              ->orWhereHas('mahasiswa', fn($mq) => $mq->where('dosen_wali_id', $dosenId));
        })
        ->findOrFail($id);

        $dosbing = $pendaftaran->ensureDosenPembimbing();
        $nilaiAkhir = $pendaftaran->nilaiAkhir;
        $nilais = $pendaftaran->nilais;

        $hurufDetail = [];
        if ($nilaiAkhir?->catatan && preg_match('/\[Dosen_Huruf\]:\s*(\{.*\})/m', $nilaiAkhir->catatan, $mH)) {
            $hurufDetail = json_decode($mH[1], true) ?? [];
        }

        $rincianUjian = $nilais->where('tipe', 'ujian_kp')->map(function($n) use ($hurufDetail) {
            return [
                'komponen' => $n->komponen,
                'bobot' => $n->bobot,
                'nilai' => $n->nilai,
                'huruf' => $hurufDetail['ujian'][$n->komponen] ?? null,
            ];
        })->values();

        $rincianBimbingan = $nilais->where('tipe', 'pembimbing')->map(function($n) use ($hurufDetail) {
            return [
                'komponen' => $n->komponen,
                'bobot' => $n->bobot,
                'nilai' => $n->nilai,
                'huruf' => $hurufDetail['bimbingan'][$n->komponen] ?? null,
            ];
        })->values();

        $rapor = [
            'mahasiswa' => $pendaftaran->mahasiswa,
            'status_kp' => $pendaftaran->status,
            'dosen_pembimbing' => $dosbing?->name ?? ($pendaftaran->dosenPembimbing ? $pendaftaran->dosenPembimbing->name : '-'),
            'dosen_nip' => $dosbing?->nip ?? ($pendaftaran->dosenPembimbing ? $pendaftaran->dosenPembimbing->nip : '-'),
            'instansi' => $pendaftaran->instansi ? $pendaftaran->instansi->nama : '-',
            'nilai_ujian' => $nilaiAkhir ? $nilaiAkhir->nilai_ujian : null,
            'nilai_pembimbing' => $nilaiAkhir ? $nilaiAkhir->nilai_pembimbing : null,
            'nilai_huruf_ujian' => $hurufDetail['ujian']['total'] ?? null,
            'nilai_huruf_bimbingan' => $hurufDetail['bimbingan']['total'] ?? null,
            'nilai_huruf_total' => $hurufDetail['total'] ?? $nilaiAkhir?->nilai_huruf ?? null,
            'rincian_ujian' => $rincianUjian,
            'rincian_bimbingan' => $rincianBimbingan,
            'catatan' => $nilaiAkhir?->catatan,
        ];

        return view('cetak.penilaian-dosen', compact('rapor'));
    }
}

