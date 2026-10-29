<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\BeritaAcara;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProdiBeritaAcaraController extends Controller
{
    /**
     * Menentukan label Semester (Ganjil/Genap per Tahun Akademik) dari data Pendaftaran.
     * Mengutamakan informasi semester dari data mahasiswa ($p->mahasiswa->semester).
     */
    private function resolveSemesterLabel($p, $periodes = null): string
    {
        $mhs = $p?->mahasiswa;

        // 1. Ambil langsung dari data user/mahasiswa jika tersedia
        if (!empty($mhs?->semester)) {
            $userSem = trim($mhs->semester);
            $userSem = preg_replace('/^Gasal/i', 'Ganjil', $userSem);
            $userSem = preg_replace('/^Semester\s+/i', '', $userSem);

            if (is_numeric($userSem)) {
                $semNum = (int) $userSem;
                $isGanjil = ($semNum % 2) !== 0;
                $refDate = $p?->tanggal_mulai ?? $p?->created_at ?? now();
                $year = (int) Carbon::parse($refDate)->format('Y');
                $academicYear = $isGanjil ? $year . '/' . ($year + 1) : ($year - 1) . '/' . $year;
                return ($isGanjil ? 'Ganjil ' : 'Genap ') . $academicYear;
            }

            return $userSem;
        }

        // 2. Fallback periode KP
        $refDate = $p?->tanggal_mulai ?? $p?->created_at ?? now();
        $carbonDate = Carbon::parse($refDate);

        if ($periodes) {
            foreach ($periodes as $periode) {
                if ($periode->tanggal_pendaftaran && $periode->tanggal_batas_pendaftaran) {
                    if ($carbonDate->betweenIncluded($periode->tanggal_pendaftaran, $periode->tanggal_batas_pendaftaran->copy()->addMonths(6))) {
                        return preg_replace('/^Gasal/i', 'Ganjil', trim($periode->semester));
                    }
                }
            }
        }

        // 3. Fallback kalender akademik standar
        $year = (int) $carbonDate->format('Y');
        $month = (int) $carbonDate->format('n');

        if ($month >= 8) {
            return 'Ganjil ' . $year . '/' . ($year + 1);
        } elseif ($month === 1) {
            return 'Ganjil ' . ($year - 1) . '/' . $year;
        } else {
            return 'Genap ' . ($year - 1) . '/' . $year;
        }
    }

    /**
     * Menampilkan daftar mahasiswa yang telah dinilai Dosen Pembimbing untuk divalidasi Berita Acara.
     */
    public function index(Request $request)
    {
        $periodes = \App\Models\PeriodeKp::orderByDesc('created_at')->get();

        // Ambil mahasiswa yang dosen pembimbingnya sudah selesai menilai (nilai_pembimbing !== null) atau sudah memiliki berita acara
        $pendaftaransAll = Pendaftaran::with(['mahasiswa', 'instansi', 'nilaiAkhir', 'beritaAcara', 'dosenPembimbing'])
            ->where(function($query) {
                $query->whereHas('nilaiAkhir', function($q) {
                    $q->whereNotNull('nilai_pembimbing');
                })->orWhereHas('beritaAcara');
            })
            ->latest()
            ->get()
            ->map(function ($p) use ($periodes) {
                $isApproved = $p->beritaAcara && $p->beritaAcara->status === 'disetujui';
                $semesterLabel = $this->resolveSemesterLabel($p, $periodes);

                return [
                    'id' => $p->id,
                    'semester' => $semesterLabel,
                    'mahasiswa' => $p->mahasiswa,
                    'instansi' => $p->instansi,
                    'dosen_pembimbing' => $p->dosenPembimbing ? [
                        'name' => $p->dosenPembimbing->name,
                        'nip' => $p->dosenPembimbing->nip,
                    ] : null,
                    'nilai_pembimbing' => $p->nilaiAkhir?->nilai_pembimbing,
                    'nilai_instansi' => $p->nilaiAkhir?->nilai_instansi,
                    'nilai_total' => $p->nilaiAkhir?->nilai_total,
                    'nilai_huruf' => $p->nilaiAkhir?->nilai_huruf,
                    'berita_acara' => $p->beritaAcara,
                    'is_approved' => $isApproved,
                    'status_validasi' => $isApproved ? 'disetujui' : 'menunggu',
                    'url_file' => $p->beritaAcara && $p->beritaAcara->path_file && !str_starts_with($p->beritaAcara->path_file, 'generated/') 
                        ? asset('storage/' . $p->beritaAcara->path_file) 
                        : null,
                    'status_kp' => $p->status,
                ];
            });

        // Opsi Semester
        $defaultSemesters = [
            'Ganjil 2024/2025',
            'Genap 2024/2025',
            'Ganjil 2025/2026',
            'Genap 2025/2026',
            'Ganjil 2026/2027',
            'Genap 2026/2027',
        ];
        $periodeSemesters = $periodes->map(fn($pr) => preg_replace('/^Gasal/i', 'Ganjil', trim($pr->semester)))->toArray();
        $dataSemesters = $pendaftaransAll->pluck('semester')->unique()->toArray();

        $semesterOptions = collect(array_merge($defaultSemesters, $periodeSemesters, $dataSemesters))
            ->filter()
            ->unique()
            ->sortByDesc(function ($s) {
                if (preg_match('/(Ganjil|Genap)\s+(\d{4})\/(\d{4})/i', $s, $m)) {
                    $typeOrder = strtolower($m[1]) === 'genap' ? '2' : '1';
                    return $m[2] . '-' . $typeOrder;
                }
                return $s;
            })
            ->values()
            ->toArray();

        $selectedSemester = $request->input('semester', 'all');
        $filteredPendaftarans = ($selectedSemester !== 'all' && $selectedSemester !== '')
            ? $pendaftaransAll->where('semester', $selectedSemester)->values()
            : $pendaftaransAll->values();

        return Inertia::render('Prodi/BeritaAcara/Index', [
            'pendaftarans' => $filteredPendaftarans,
            'semester_options' => $semesterOptions,
            'filters' => [
                'semester' => $selectedSemester ?: 'all',
            ],
        ]);
    }

    /**
     * Cetak Laporan Rekapitulasi Berita Acara Terpenuhi / Disetujui per Semester.
     */
    public function cetakRekap(Request $request)
    {
        $periodes = \App\Models\PeriodeKp::orderByDesc('created_at')->get();

        $query = Pendaftaran::with([
            'mahasiswa',
            'instansi',
            'dosenPembimbing',
            'sidang.dosenPenguji',
            'proposals',
            'nilaiAkhir',
            'beritaAcara'
        ])
        ->where(function($q) {
            $q->whereHas('beritaAcara', function($sub) {
                $sub->where('status', 'disetujui');
            })->orWhere('status', 'selesai');
        });

        $selectedSemester = $request->input('semester', 'all');

        $items = $query->latest()->get()->map(function ($p) use ($periodes) {
            return [
                'pendaftaran' => $p,
                'semester' => $this->resolveSemesterLabel($p, $periodes),
            ];
        });

        if ($selectedSemester !== 'all' && $selectedSemester !== '') {
            $items = $items->where('semester', $selectedSemester)->values();
        }

        return view('cetak.rekap-berita-acara-semester', [
            'items' => $items,
            'selected_semester' => $selectedSemester,
            'tanggal_cetak' => now()->translatedFormat('d F Y'),
        ]);
    }

    /**
     * Pratinjau cetak Berita Acara resmi (Form KP-5) sesuai panduan KP.
     */
    public function preview($id)
    {
        $pendaftaran = Pendaftaran::with([
            'mahasiswa',
            'instansi',
            'dosenPembimbing',
            'sidang.dosenPenguji',
            'proposals',
            'nilaiAkhir',
            'beritaAcara',
        ])->findOrFail($id);

        return view('cetak.berita-acara', [
            'pendaftaran' => $pendaftaran,
            'tanggal_hari' => now()->translatedFormat('l, d F Y'),
        ]);
    }

    /**
     * Memproses penerbitan Berita Acara dengan catatan.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'catatan' => 'nullable|string'
        ]);

        $pendaftaran = Pendaftaran::findOrFail($id);

        DB::beginTransaction();
        try {
            // Update atau Create berita_acara dengan status disetujui
            $existingBa = BeritaAcara::where('pendaftaran_id', $pendaftaran->id)->first();
            $pathFile = $existingBa?->path_file ?: ('generated/berita_acara/ba_' . $pendaftaran->id . '.pdf');

            $beritaAcara = BeritaAcara::updateOrCreate(
                ['pendaftaran_id' => $pendaftaran->id],
                [
                    'path_file' => $pathFile,
                    'status' => 'disetujui',
                    'catatan' => $request->catatan ?: 'Telah divalidasi dan disetujui oleh Koordinator Program Studi (Auto-generate Form KP-5).',
                    'divalidasi_oleh' => Auth::id(),
                    'divalidasi_pada' => now(),
                ]
            );

            // Ubah status Pendaftaran menjadi selesai
            $pendaftaran->update([
                'status' => 'selesai'
            ]);

            \App\Models\Notifikasi::create([
                'user_id' => $pendaftaran->mahasiswa_id,
                'judul' => 'Berita Acara Resmi Disetujui Prodi',
                'pesan' => 'Berita Acara Kerja Praktik resmi Anda telah divalidasi dan disetujui oleh Program Studi. Seluruh alur KP Anda telah selesai.',
                'tipe' => 'sukses',
                'priority' => 'high',
                'link' => '/mahasiswa/berita-acara',
            ]);

            $dosbing = $pendaftaran->ensureDosenPembimbing();
            if ($dosbing) {
                \App\Models\Notifikasi::create([
                    'user_id' => $dosbing->id,
                    'judul' => 'Berita Acara Mahasiswa Bimbingan Disetujui',
                    'pesan' => "Berita Acara untuk mahasiswa bimbingan {$pendaftaran->mahasiswa?->name} ({$pendaftaran->mahasiswa?->nim}) telah disetujui Prodi.",
                    'tipe' => 'sukses',
                    'priority' => 'normal',
                    'link' => '/dosen/monitoring',
                ]);
            }

            DB::commit();
            return back()->with('success', 'Berita Acara berhasil divalidasi & diterbitkan, status KP telah selesai.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memvalidasi berita acara: ' . $e->getMessage()]);
        }
    }

    /**
     * Menyetujui Berita Acara secara langsung
     */
    public function approve($id): RedirectResponse
    {
        $pendaftaran = Pendaftaran::findOrFail($id);

        DB::beginTransaction();
        try {
            $existingBa = BeritaAcara::where('pendaftaran_id', $pendaftaran->id)->first();
            $pathFile = $existingBa?->path_file ?: ('generated/berita_acara/ba_' . $pendaftaran->id . '.pdf');

            $beritaAcara = BeritaAcara::updateOrCreate(
                ['pendaftaran_id' => $pendaftaran->id],
                [
                    'path_file' => $pathFile,
                    'status' => 'disetujui',
                    'catatan' => 'Telah divalidasi dan disetujui oleh Koordinator Program Studi (Auto-generate Form KP-5).',
                    'divalidasi_oleh' => Auth::id(),
                    'divalidasi_pada' => now(),
                ]
            );

            $pendaftaran->update([
                'status' => 'selesai'
            ]);

            \App\Models\Notifikasi::create([
                'user_id' => $pendaftaran->mahasiswa_id,
                'judul' => 'Berita Acara Resmi Disetujui Prodi',
                'pesan' => 'Berita Acara Kerja Praktik resmi Anda telah divalidasi dan disetujui oleh Program Studi. Seluruh alur KP Anda telah selesai.',
                'tipe' => 'sukses',
                'priority' => 'high',
                'link' => '/mahasiswa/berita-acara',
            ]);

            $dosbing = $pendaftaran->ensureDosenPembimbing();
            if ($dosbing) {
                \App\Models\Notifikasi::create([
                    'user_id' => $dosbing->id,
                    'judul' => 'Berita Acara Mahasiswa Bimbingan Disetujui',
                    'pesan' => "Berita Acara untuk mahasiswa bimbingan {$pendaftaran->mahasiswa?->name} ({$pendaftaran->mahasiswa?->nim}) telah disetujui Prodi.",
                    'tipe' => 'sukses',
                    'priority' => 'normal',
                    'link' => '/dosen/monitoring',
                ]);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Berita Acara resmi (Form KP-5) berhasil divalidasi dan disetujui.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menyetujui berita acara: ' . $e->getMessage()]);
        }
    }
}
