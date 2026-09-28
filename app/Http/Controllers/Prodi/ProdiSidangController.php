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
            return [
                'id' => $s->id,
                'status' => $s->status,
                'tanggal_sidang' => $s->tanggal_sidang?->format('Y-m-d H:i'),
                'tanggal_formatted' => $s->tanggal_sidang?->translatedFormat('d M Y, H:i') . ' WIB',
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
        $dosenPengujiId = $pendaftaran->dosen_pembimbing_id;

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
            Notifikasi::create([
                'user_id' => $dosenPengujiId,
                'judul' => 'Jadwal Pengujian Sidang KP',
                'pesan' => "Anda ditugaskan menguji sidang KP mahasiswa {$pendaftaran->mahasiswa->name} pada {$tanggalSidang->translatedFormat('d F Y pukul H:i')} WIB di {$request->ruangan}.",
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
        $sidang = Sidang::with('pendaftaran')->findOrFail($id);
        $sidang->update(['status' => 'selesai']);

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
     * Halaman Arsip Nilai KP per periode (Req 9).
     */
    public function arsipNilai(Request $request): Response
    {
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

        $records = $query->latest()->get()->map(function ($na) {
            $p = $na->pendaftaran;
            return [
                'id' => $na->id,
                'pendaftaran_id' => $p?->id,
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

        $totalEvaluated = $records->count();
        $lulusCount = $records->where('status', 'lulus')->count();
        $avgScore = $totalEvaluated > 0 
            ? round($records->where('nilai_total', '!=', '-')->avg('nilai_total'), 1) 
            : 0;

        $stats = [
            'total' => $totalEvaluated,
            'lulus' => $lulusCount,
            'tidak_lulus' => $records->where('status', 'tidak_lulus')->count(),
            'proses' => $records->where('status', 'proses')->count(),
            'rata_rata' => $avgScore,
        ];

        return Inertia::render('Prodi/ArsipNilai', [
            'arsip' => $records,
            'stats' => $stats,
            'filters' => [
                'status_lulus' => $request->status_lulus ?? 'all',
                'nilai_huruf' => $request->nilai_huruf ?? 'all',
                'search' => $request->search ?? '',
            ]
        ]);
    }
}
