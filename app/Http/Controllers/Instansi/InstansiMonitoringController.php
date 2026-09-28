<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class InstansiMonitoringController extends Controller
{
    /**
     * Menampilkan dashboard monitoring progres mahasiswa KP dari perspektif Instansi / Pembimbing Lapangan.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $instansi = $user->instansi ?? $user->pembimbingLapangan?->instansi;

        if (!$instansi) {
            return Inertia::render('Instansi/Monitoring', [
                'mahasiswas' => [],
                'stats' => [
                    'total' => 0,
                    'aktif' => 0,
                    'logbook_pending' => 0,
                    'belum_dinilai' => 0,
                    'selesai' => 0,
                ],
                'filters' => [
                    'status' => 'all',
                    'search' => '',
                ],
                'error' => 'Profil instansi atau pembimbing lapangan belum diatur.'
            ]);
        }

        $query = Pendaftaran::with([
            'mahasiswa',
            'dosenPembimbing',
            'suratPengantar',
            'proposals' => function ($q) {
                $q->latest();
            },
            'logbooks',
            'nilaiAkhir',
            'nilais' => function ($q) use ($user) {
                $q->where('penilai_id', $user->id)->where('tipe', 'instansi');
            }
        ])
        ->where('instansi_id', $instansi->id);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('mahasiswa', function ($mq) use ($search) {
                $mq->where('name', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%");
            });
        }

        $pendaftarans = $query->latest()->get()->map(function ($p) use ($user) {
            $latestProposal = $p->proposals->first();
            $logbookTotal = $p->logbooks->count();
            $logbookApprovedInstansi = $p->logbooks->where('status_instansi', 'disetujui')->count();
            $logbookPendingInstansi = $p->logbooks->where('status_instansi', 'menunggu')->count();
            $hasNilaiInstansi = $p->nilais->count() > 0 || ($p->nilaiAkhir && $p->nilaiAkhir->nilai_instansi !== null);

            // Hitung persentase progres (0 - 100%)
            $progress = 15;

            if (in_array($p->status, ['disetujui_tu', 'aktif', 'seminar', 'laporan_revisi', 'laporan_selesai', 'selesai'])) {
                $progress = 30;
            }

            if ($p->suratPengantar && $p->suratPengantar->confirmation_status === 'accepted') {
                $progress = max($progress, 45);
            }

            if ($latestProposal) {
                $progress = max($progress, 55);
            }

            if ($logbookApprovedInstansi >= 5 || $p->status === 'aktif') {
                $bonus = min(25, ($logbookApprovedInstansi / 15) * 25);
                $progress = max($progress, 55 + (int)$bonus);
            }

            if ($hasNilaiInstansi) {
                $progress = max($progress, 90);
            }

            if ($p->status === 'selesai' && $hasNilaiInstansi) {
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
                    'telepon' => $p->mahasiswa?->no_hp ?? $p->mahasiswa?->telepon,
                    'avatar' => $p->mahasiswa?->avatar ?? $p->mahasiswa?->foto,
                ],
                'dosen_pembimbing' => [
                    'name' => $p->dosenPembimbing?->name ?? 'Belum ditentukan',
                    'email' => $p->dosenPembimbing?->email,
                    'telepon' => $p->dosenPembimbing?->no_hp ?? $p->dosenPembimbing?->telepon,
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
                    'approved_instansi' => $logbookApprovedInstansi,
                    'pending_instansi' => $logbookPendingInstansi,
                ],
                'penilaian' => [
                    'is_dinilai_instansi' => $hasNilaiInstansi,
                    'nilai_instansi' => $p->nilaiAkhir?->nilai_instansi,
                ],
                'progress_percent' => $progress,
            ];
        });

        $stats = [
            'total' => $pendaftarans->count(),
            'aktif' => $pendaftarans->whereIn('status', ['aktif', 'disetujui_tu'])->count(),
            'logbook_pending' => $pendaftarans->sum(fn($p) => $p['logbook']['pending_instansi']),
            'belum_dinilai' => $pendaftarans->filter(fn($p) => !$p['penilaian']['is_dinilai_instansi'] && in_array($p['status'], ['aktif', 'seminar', 'laporan_selesai', 'selesai']))->count(),
            'selesai' => $pendaftarans->where('status', 'selesai')->count(),
        ];

        return Inertia::render('Instansi/Monitoring', [
            'mahasiswas' => $pendaftarans,
            'stats' => $stats,
            'filters' => [
                'status' => $request->status ?? 'all',
                'search' => $request->search ?? '',
            ]
        ]);
    }
}
