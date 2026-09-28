<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DosenMonitoringController extends Controller
{
    /**
     * Menampilkan dashboard monitoring progres seluruh tahapan KP mahasiswa bimbingan.
     */
    public function index(Request $request): Response
    {
        $dosenId = Auth::id();

        $query = Pendaftaran::with([
            'mahasiswa',
            'instansi',
            'pembimbingLapangan',
            'suratPengantar',
            'proposals' => function ($q) {
                $q->latest();
            },
            'logbooks',
            'beritaAcara',
            'nilaiAkhir',
            'nilais' => function ($q) use ($dosenId) {
                $q->where('penilai_id', $dosenId)->where('tipe', 'pembimbing');
            }
        ])
        ->where(function ($q) use ($dosenId) {
            $q->where('dosen_pembimbing_id', $dosenId)
              ->orWhere('dosen_wali_id', $dosenId);
        });

        // Filter status jika ada
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search mahasiswa / instansi jika ada
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('mahasiswa', function ($mq) use ($search) {
                    $mq->where('name', 'like', "%{$search}%")
                      ->orWhere('nim', 'like', "%{$search}%");
                })->orWhereHas('instansi', function ($iq) use ($search) {
                    $iq->where('nama', 'like', "%{$search}%");
                });
            });
        }

        $pendaftarans = $query->latest()->get()->map(function ($p) {
            $latestProposal = $p->proposals->first();
            $logbookTotal = $p->logbooks->count();
            $logbookApprovedDosen = $p->logbooks->where('status_dosen', 'disetujui')->count();
            $logbookApprovedInstansi = $p->logbooks->where('status_instansi', 'disetujui')->count();
            $logbookPendingDosen = $p->logbooks->where('status_dosen', 'menunggu')->count();
            $hasNilaiDosen = $p->nilais->count() > 0;
            $hasNilaiInstansi = $p->nilaiAkhir && $p->nilaiAkhir->nilai_instansi !== null;

            // Hitung persentase progres (0 - 100%)
            $progress = 10; // Base: Pendaftaran dibuat

            if (in_array($p->status, ['diverifikasi_tu', 'disetujui_tu', 'aktif', 'seminar', 'laporan_revisi', 'laporan_selesai', 'selesai'])) {
                $progress = 25;
            }

            if ($p->suratPengantar) {
                $progress = max($progress, 35);
                if ($p->suratPengantar->confirmation_status === 'accepted') {
                    $progress = max($progress, 45);
                }
            }

            if ($latestProposal) {
                if ($latestProposal->status === 'disetujui') {
                    $progress = max($progress, 65);
                } elseif (in_array($latestProposal->status, ['diajukan', 'revisi'])) {
                    $progress = max($progress, 55);
                }
            }

            if ($logbookApprovedDosen >= 5 || $p->status === 'aktif') {
                $logbookProgressBonus = min(15, ($logbookApprovedDosen / 15) * 15);
                $progress = max($progress, 65 + (int)$logbookProgressBonus);
            }

            if ($hasNilaiDosen || $hasNilaiInstansi || $p->status === 'selesai') {
                $progress = max($progress, 90);
            }

            if ($p->status === 'selesai' && $hasNilaiDosen) {
                $progress = 100;
            }

            return [
                'id' => $p->id,
                'status' => $p->status,
                'tanggal_mulai' => $p->tanggal_mulai?->format('d M Y'),
                'tanggal_selesai' => $p->tanggal_selesai?->format('d M Y'),
                'mahasiswa' => [
                    'id' => $p->mahasiswa?->id,
                    'name' => $p->mahasiswa?->name ?? 'Mahasiswa',
                    'nim' => $p->mahasiswa?->nim ?? '-',
                    'email' => $p->mahasiswa?->email,
                    'avatar' => $p->mahasiswa?->avatar ?? $p->mahasiswa?->foto,
                ],
                'instansi' => [
                    'id' => $p->instansi?->id,
                    'nama' => $p->instansi?->nama ?? 'Belum ditentukan',
                    'kota' => $p->instansi?->kota,
                    'alamat' => $p->instansi?->alamat,
                ],
                'pembimbing_lapangan' => [
                    'nama' => $p->pembimbingLapangan?->nama ?? $p->suratPengantar?->pl_nama ?? 'Belum ada',
                    'email' => $p->pembimbingLapangan?->email ?? $p->suratPengantar?->pl_email,
                    'telepon' => $p->pembimbingLapangan?->no_hp ?? $p->suratPengantar?->pl_telepon,
                ],
                'surat_pengantar' => $p->suratPengantar ? [
                    'nomor_surat' => $p->suratPengantar->nomor_surat,
                    'confirmation_status' => $p->suratPengantar->confirmation_status,
                    'confirmed_at' => $p->suratPengantar->confirmed_at?->format('d M Y H:i'),
                ] : null,
                'proposal' => $latestProposal ? [
                    'id' => $latestProposal->id,
                    'judul' => $latestProposal->judul,
                    'status' => $latestProposal->status,
                    'file_path' => $latestProposal->file_path,
                ] : null,
                'logbook' => [
                    'total' => $logbookTotal,
                    'approved_dosen' => $logbookApprovedDosen,
                    'approved_instansi' => $logbookApprovedInstansi,
                    'pending_dosen' => $logbookPendingDosen,
                ],
                'penilaian' => [
                    'is_dinilai_dosen' => $hasNilaiDosen,
                    'nilai_pembimbing' => $p->nilaiAkhir?->nilai_pembimbing,
                    'is_dinilai_instansi' => $hasNilaiInstansi,
                    'nilai_instansi' => $p->nilaiAkhir?->nilai_instansi,
                    'nilai_total' => $p->nilaiAkhir?->nilai_total,
                    'nilai_huruf' => $p->nilaiAkhir?->nilai_huruf,
                ],
                'progress_percent' => $progress,
            ];
        });

        // Ringkasan statistik monitoring
        $stats = [
            'total' => $pendaftarans->count(),
            'aktif' => $pendaftarans->whereIn('status', ['aktif', 'disetujui_tu'])->count(),
            'proposal_pending' => $pendaftarans->filter(fn($p) => $p['proposal'] && in_array($p['proposal']['status'], ['diajukan', 'revisi']))->count(),
            'logbook_pending' => $pendaftarans->sum(fn($p) => $p['logbook']['pending_dosen']),
            'siap_dinilai' => $pendaftarans->filter(fn($p) => !$p['penilaian']['is_dinilai_dosen'] && in_array($p['status'], ['aktif', 'seminar', 'laporan_selesai', 'selesai']))->count(),
            'selesai' => $pendaftarans->where('status', 'selesai')->count(),
        ];

        return Inertia::render('Dosen/Monitoring', [
            'mahasiswas' => $pendaftarans,
            'stats' => $stats,
            'filters' => [
                'status' => $request->status ?? 'all',
                'search' => $request->search ?? '',
            ]
        ]);
    }
}
