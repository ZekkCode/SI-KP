<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\Instansi;
use App\Models\NilaiAkhir;
use App\Models\Notifikasi;
use App\Models\Pendaftaran;
use App\Models\Sidang;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProdiSidangController extends Controller
{
    /**
     * Menampilkan daftar seluruh pengajuan dan jadwal sidang KP.
     */
    public function index(Request $request): Response
    {
        $query = Sidang::with([
            'pendaftaran.mahasiswa',
            'pendaftaran.instansi',
            'pendaftaran.dosenPembimbing',
            'dosenPenguji',
        ]);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('pendaftaran', function ($pq) use ($search) {
                $pq->whereHas('mahasiswa', function ($mq) use ($search) {
                    $mq->where('name', 'like', "%{$search}%")
                      ->orWhere('nim', 'like', "%{$search}%");
                })->orWhereHas('instansi', function ($iq) use ($search) {
                    $iq->where('nama', 'like', "%{$search}%");
                });
            });
        }

        $sidangs = $query->latest()->get()->map(function ($s) {
            $p = $s->pendaftaran;
            if ($p && !$p->dosen_pembimbing_id) {
                $p->ensureDosenPembimbing();
                $p->load('dosenPembimbing');
            }
            return [
                'id' => $s->id,
                'status' => $s->status,
                'tanggal_sidang' => $s->tanggal_sidang?->format('Y-m-d H:i'),
                'tanggal_formatted' => $s->tanggal_sidang ? $s->tanggal_sidang->translatedFormat('d M Y, H:i') . ' WIB' : null,
                'ruangan' => $s->ruangan,
                'catatan' => $s->catatan,
                'created_at' => $s->created_at?->format('d M Y H:i'),
                'mahasiswa' => [
                    'id' => $p?->mahasiswa?->id,
                    'name' => $p?->mahasiswa?->name ?? 'Mahasiswa',
                    'nim' => $p?->mahasiswa?->nim ?? '-',
                    'avatar' => $p?->mahasiswa?->avatar ?? $p?->mahasiswa?->foto,
                ],
                'instansi' => [
                    'nama' => $p?->instansi?->nama ?? 'Instansi',
                    'kota' => $p?->instansi?->kota,
                ],
                'dosen_pembimbing' => [
                    'id' => $p?->dosenPembimbing?->id,
                    'name' => $p?->dosenPembimbing?->name ?? 'Belum ditentukan',
                    'nip' => $p?->dosenPembimbing?->nip,
                ],
                'dosen_penguji' => [
                    'id' => $s->dosenPenguji?->id ?? $p?->dosenPembimbing?->id,
                    'name' => $s->dosenPenguji?->name ?? $p?->dosenPembimbing?->name ?? 'Dosen Pembimbing',
                    'nip' => $s->dosenPenguji?->nip ?? $p?->dosenPembimbing?->nip,
                ],
            ];
        });

        $stats = [
            'total' => Sidang::count(),
            'diajukan' => Sidang::where('status', 'diajukan')->count(),
            'dijadwalkan' => Sidang::where('status', 'dijadwalkan')->count(),
            'selesai' => Sidang::where('status', 'selesai')->count(),
        ];

        return Inertia::render('Prodi/Sidang', [
            'sidangs' => $sidangs,
            'stats' => $stats,
            'filters' => [
                'status' => $request->status ?? 'all',
                'search' => $request->search ?? '',
            ]
        ]);
    }

    /**
     * Menetapkan jadwal sidang (tanggal, waktu, ruangan, dan dosen penguji = dosen pembimbing).
     */
    public function jadwalkan(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'tanggal' => 'required|date',
            'jam' => 'required|string',
            'ruangan' => 'required|string|max:100',
            'catatan' => 'nullable|string|max:500',
        ]);

        $sidang = Sidang::with(['pendaftaran.mahasiswa', 'pendaftaran.dosenPembimbing'])->findOrFail($id);
        $pendaftaran = $sidang->pendaftaran;

        // Gabungkan tanggal dan jam
        $tanggalSidang = Carbon::parse($request->tanggal . ' ' . $request->jam);

        // Dosen Penguji = Dosen Pembimbing (sesuai ketentuan user)
        $dosbing = $pendaftaran->ensureDosenPembimbing();
        $dosenPengujiId = $dosbing?->id ?? $pendaftaran->dosen_pembimbing_id;

        $sidang->update([
            'tanggal_sidang' => $tanggalSidang,
            'ruangan' => $request->ruangan,
            'catatan' => $request->catatan,
            'status' => 'dijadwalkan',
            'dosen_penguji_id' => $dosenPengujiId,
        ]);

        // Kirim Notifikasi ke Mahasiswa
        if ($pendaftaran->mahasiswa_id) {
            Notifikasi::create([
                'user_id' => $pendaftaran->mahasiswa_id,
                'judul' => 'Jadwal Sidang KP Ditetapkan',
                'pesan' => "Sidang Kerja Praktik Anda dijadwalkan pada {$tanggalSidang->translatedFormat('l, d F Y pukul H:i')} WIB di Ruangan {$request->ruangan}.",
                'tipe' => 'info',
                'link' => '/mahasiswa/sidang',
            ]);
        }

        // Kirim Notifikasi ke Dosen Penguji / Pembimbing
        if ($dosenPengujiId) {
            $namaMhs = $pendaftaran->mahasiswa?->name ?? 'Mahasiswa';
            Notifikasi::create([
                'user_id' => $dosenPengujiId,
                'judul' => 'Jadwal Pengujian Sidang KP',
                'pesan' => "Anda ditugaskan menguji sidang KP mahasiswa {$namaMhs} pada {$tanggalSidang->translatedFormat('d F Y pukul H:i')} WIB di {$request->ruangan}.",
                'tipe' => 'info',
                'link' => '/dosen/monitoring',
            ]);
        }

        return back()->with('success', 'Jadwal sidang berhasil ditetapkan. Notifikasi telah dikirim ke mahasiswa dan dosen penguji.');
    }

    /**
     * Tandai sidang telah selesai dilaksanakan.
     */
    public function selesai($id): RedirectResponse
    {
        $sidang = Sidang::with(['pendaftaran.mahasiswa', 'pendaftaran.dosenPembimbing'])->findOrFail($id);
        $sidang->update(['status' => 'selesai']);

        $pendaftaran = $sidang->pendaftaran;
        if ($pendaftaran?->mahasiswa_id) {
            Notifikasi::create([
                'user_id' => $pendaftaran->mahasiswa_id,
                'judul' => 'Sidang KP Selesai Dilaksanakan',
                'pesan' => 'Pelaksanaan sidang Kerja Praktik Anda telah selesai. Silakan pantau penginputan nilai akhir dan penerbitan Berita Acara.',
                'tipe' => 'sukses',
                'priority' => 'high',
                'link' => '/mahasiswa/penilaian',
            ]);
        }

        $dosbing = $pendaftaran?->ensureDosenPembimbing();
        if ($dosbing) {
            $mhsNama = $pendaftaran->mahasiswa?->name ?? 'Mahasiswa';
            Notifikasi::create([
                'user_id' => $dosbing->id,
                'judul' => 'Sidang Mahasiswa Selesai - Masukkan Nilai',
                'pesan' => "Sidang KP mahasiswa {$mhsNama} telah selesai. Silakan masukkan nilai evaluasi pembimbing.",
                'tipe' => 'info',
                'priority' => 'high',
                'link' => '/dosen/penilaian',
            ]);
        }

        return back()->with('success', 'Status sidang berhasil diperbarui menjadi Selesai.');
    }

    /**
     * Halaman Rekap Mitra & Instansi Kerjasama KP (Req 9).
     */
    public function mitraInstansi(Request $request): Response
    {
        $query = Instansi::withCount(['pendaftarans as total_mahasiswa'])
            ->with(['pembimbingLapangans']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('nama', 'like', "%{$search}%")
                  ->orWhere('kota', 'like', "%{$search}%");
        }

        $mitras = $query->orderBy('nama', 'asc')->get()->map(function ($m) {
            // Hitung mahasiswa aktif saat ini di instansi
            $aktifCount = Pendaftaran::where('instansi_id', $m->id)
                ->whereIn('status', ['aktif', 'disetujui_tu', 'seminar'])
                ->count();

            $selesaiCount = Pendaftaran::where('instansi_id', $m->id)
                ->where('status', 'selesai')
                ->count();

            return [
                'id' => $m->id,
                'nama' => $m->nama,
                'alamat' => $m->alamat,
                'kota' => $m->kota,
                'email' => $m->email,
                'telepon' => $m->telepon,
                'total_mahasiswa' => $m->total_mahasiswa,
                'mahasiswa_aktif' => $aktifCount,
                'mahasiswa_selesai' => $selesaiCount,
                'pembimbing_lapangans' => $m->pembimbingLapangans->map(fn($pl) => [
                    'id' => $pl->id,
                    'nama' => $pl->nama,
                    'email' => $pl->email,
                    'jabatan' => $pl->jabatan,
                ]),
            ];
        });

        $stats = [
            'total_instansi' => $mitras->count(),
            'total_mahasiswa_magang' => $mitras->sum('total_mahasiswa'),
            'total_aktif_saat_ini' => $mitras->sum('mahasiswa_aktif'),
        ];

        return Inertia::render('Prodi/MitraInstansi', [
            'mitras' => $mitras,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search ?? '',
            ]
        ]);
    }

    /**
     * Menentukan label Semester (Ganjil/Genap per Tahun Akademik) dari data NilaiAkhir/Pendaftaran.
     * Mengutamakan informasi semester dari profil mahasiswa ($user->semester).
     */
    private function resolveSemesterLabel($na, $periodes = null): string
    {
        $p = $na->pendaftaran;
        $mhs = $p?->mahasiswa;

        // 1. Ambil langsung dari data user/mahasiswa jika tersedia
        if (!empty($mhs?->semester)) {
            $userSem = trim($mhs->semester);
            // Normalisasi ejaan Gasal -> Ganjil
            $userSem = preg_replace('/^Gasal/i', 'Ganjil', $userSem);
            // Hilangkan kata "Semester " di awal jika ada agar seragam ("Ganjil 2025/2026")
            $userSem = preg_replace('/^Semester\s+/i', '', $userSem);
            
            // Jika formatnya angka semester (misal "6" atau "7"), konversikan ke Ganjil/Genap + Tahun Akademik
            if (is_numeric($userSem)) {
                $semNum = (int) $userSem;
                $isGanjil = ($semNum % 2) !== 0;
                $refDate = $p?->tanggal_mulai ?? $p?->created_at ?? $na->created_at ?? now();
                $year = (int) Carbon::parse($refDate)->format('Y');
                $academicYear = $isGanjil ? $year . '/' . ($year + 1) : ($year - 1) . '/' . $year;
                return ($isGanjil ? 'Ganjil ' : 'Genap ') . $academicYear;
            }

            return $userSem;
        }

        // 2. Fallback jika semester user kosong: cek periode KP
        $refDate = $p?->tanggal_mulai ?? $p?->created_at ?? $na->created_at ?? now();
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
     * Mengambil data dan statistik Arsip Nilai berdasarkan filter.
     */
    private function buildArsipNilaiData(Request $request): array
    {
        $periodes = \App\Models\PeriodeKp::orderByDesc('created_at')->get();

        $query = NilaiAkhir::with([
            'pendaftaran.mahasiswa',
            'pendaftaran.instansi',
            'pendaftaran.dosenPembimbing',
            'pendaftaran.nilais',
        ]);

        if ($request->filled('status_lulus') && $request->status_lulus !== 'all') {
            $query->where('status', $request->status_lulus);
        }

        if ($request->filled('nilai_huruf') && $request->nilai_huruf !== 'all') {
            $query->where('nilai_huruf', $request->nilai_huruf);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('pendaftaran', function ($pq) use ($search) {
                $pq->whereHas('mahasiswa', function ($mq) use ($search) {
                    $mq->where('name', 'like', "%{$search}%")
                      ->orWhere('nim', 'like', "%{$search}%");
                })->orWhereHas('instansi', function ($iq) use ($search) {
                    $iq->where('nama', 'like', "%{$search}%");
                });
            });
        }

        $allMapped = $query->latest()->get()->map(function ($na) use ($periodes) {
            $p = $na->pendaftaran;
            $semesterLabel = $this->resolveSemesterLabel($na, $periodes);

            return [
                'id' => $na->id,
                'pendaftaran_id' => $p?->id,
                'semester' => $semesterLabel,
                'mahasiswa' => [
                    'name' => $p?->mahasiswa?->name ?? 'Mahasiswa',
                    'nim' => $p?->mahasiswa?->nim ?? '-',
                ],
                'instansi' => [
                    'nama' => $p?->instansi?->nama ?? '-',
                    'kota' => $p?->instansi?->kota,
                ],
                'dosen_pembimbing' => [
                    'name' => $p?->dosenPembimbing?->name ?? '-',
                ],
                'nilai_pembimbing' => $na->nilai_pembimbing !== null ? round($na->nilai_pembimbing, 1) : '-',
                'nilai_instansi' => $na->nilai_instansi !== null ? round($na->nilai_instansi, 1) : '-',
                'nilai_ujian' => $na->nilai_ujian !== null ? round($na->nilai_ujian, 1) : '-',
                'nilai_total' => $na->nilai_total !== null ? round($na->nilai_total, 1) : '-',
                'nilai_huruf' => $na->nilai_huruf ?? '-',
                'status' => $na->status ?? 'proses',
                'catatan' => $na->catatan,
                'created_at' => $na->updated_at?->format('d M Y'),
            ];
        });

        // Kumpulkan opsi semester (dari data, tabel PeriodeKp, dan tahun akademik standar)
        $defaultSemesters = [
            'Ganjil 2024/2025',
            'Genap 2024/2025',
            'Ganjil 2025/2026',
            'Genap 2025/2026',
            'Ganjil 2026/2027',
            'Genap 2026/2027',
        ];
        $periodeSemesters = $periodes->map(fn($pr) => preg_replace('/^Gasal/i', 'Ganjil', trim($pr->semester)))->toArray();
        $dataSemesters = $allMapped->pluck('semester')->unique()->toArray();

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

        // Rekap ringkasan per semester (sebelum difilter berdasarkan 1 semester tertentu)
        $rekapSemester = $allMapped->groupBy('semester')->map(function ($items, $sem) {
            $scored = $items->where('nilai_total', '!=', '-');
            return [
                'semester' => $sem,
                'total' => $items->count(),
                'lulus' => $items->where('status', 'lulus')->count(),
                'tidak_lulus' => $items->where('status', 'tidak_lulus')->count(),
                'proses' => $items->where('status', 'proses')->count(),
                'rata_rata' => $scored->count() > 0 ? round($scored->avg('nilai_total'), 1) : 0,
            ];
        })->values()->toArray();

        // Filter berdasarkan semester jika dipilih
        $selectedSemester = $request->input('semester', 'all');
        $records = $selectedSemester !== 'all' && $selectedSemester !== ''
            ? $allMapped->where('semester', $selectedSemester)->values()
            : $allMapped->values();

        $totalEvaluated = $records->count();
        $lulusCount = $records->where('status', 'lulus')->count();
        $scoredRecords = $records->where('nilai_total', '!=', '-');
        $avgScore = $scoredRecords->count() > 0
            ? round($scoredRecords->avg('nilai_total'), 1)
            : 0;

        $distribusiHuruf = [
            'A' => $records->where('nilai_huruf', 'A')->count(),
            'B+' => $records->where('nilai_huruf', 'B+')->count(),
            'B' => $records->where('nilai_huruf', 'B')->count(),
            'C+' => $records->where('nilai_huruf', 'C+')->count(),
            'C' => $records->where('nilai_huruf', 'C')->count(),
            'D+' => $records->where('nilai_huruf', 'D+')->count(),
            'D' => $records->where('nilai_huruf', 'D')->count(),
            'E' => $records->where('nilai_huruf', 'E')->count(),
        ];

        $stats = [
            'total' => $totalEvaluated,
            'lulus' => $lulusCount,
            'tidak_lulus' => $records->where('status', 'tidak_lulus')->count(),
            'proses' => $records->where('status', 'proses')->count(),
            'rata_rata' => $avgScore,
            'distribusi_huruf' => $distribusiHuruf,
        ];

        return [
            'arsip' => $records,
            'stats' => $stats,
            'semester_options' => $semesterOptions,
            'rekap_semester' => $rekapSemester,
            'filters' => [
                'semester' => $selectedSemester ?: 'all',
                'status_lulus' => $request->status_lulus ?? 'all',
                'nilai_huruf' => $request->nilai_huruf ?? 'all',
                'search' => $request->search ?? '',
            ],
        ];
    }

    /**
     * Halaman Arsip Nilai KP per periode (Req 9).
     */
    public function arsipNilai(Request $request): Response
    {
        $data = $this->buildArsipNilaiData($request);
        return Inertia::render('Prodi/ArsipNilai', $data);
    }

    /**
     * Cetak Laporan Rekapitulasi KP per Semester (Ganjil/Genap per Tahun Akademik).
     */
    public function cetakArsipNilai(Request $request)
    {
        $data = $this->buildArsipNilaiData($request);

        return view('cetak.rekap-nilai-semester', [
            'arsip' => $data['arsip'],
            'stats' => $data['stats'],
            'filters' => $data['filters'],
            'tanggal_cetak' => now()->translatedFormat('d F Y'),
        ]);
    }
}
