<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Logbook;
use App\Models\Notifikasi;
use App\Models\Proposal;
use App\Models\BeritaAcara;
use App\Models\SuratPengantar;
use App\Models\NilaiAkhir;
use Carbon\Carbon;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use App\Services\KpProgressService;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaDashboardController extends Controller
{
    public function __construct(
        protected KpProgressService $progressService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user()->load('programStudi');
        $kpProgress = $this->progressService->getProgress($user->id);

        // Get the latest pendaftaran with relations
        $pendaftaran = Pendaftaran::where('mahasiswa_id', $user->id)
            ->with(['instansi', 'dosenPembimbing', 'pembimbingLapangan', 'proposals', 'suratPengantar'])
            ->latest()
            ->first();

        // Determine current step for stepper (0-5)
        $currentStep = $this->determineStep($pendaftaran);

        // Status info for the status card
        $statusInfo = $this->getStatusInfo($pendaftaran);

        // Get recent notifications (latest 10)
        $notifications = Notifikasi::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'judul' => $n->judul,
                'pesan' => $n->pesan,
                'tipe' => $n->tipe,
                'priority' => $n->priority ?? 'normal',
                'is_read' => $n->is_read,
                'created_at' => $n->created_at->diffForHumans(),
            ]);

        // Logbook progress (count filled / 40 target days)
        $logbookCount = 0;
        $logbookTarget = 40;
        // Proposal
        $totalProposal = 0;
        $proposalStatus = '-';

        // Surat
        $suratStatus = 'Belum Terbit';

        // Berita Acara
        $beritaStatus = 'Belum Ada';

        // Nilai
        $nilaiAkhir = null;

        // Progress
        $progress = 0;

        // Notifikasi
        $unreadNotification = Notifikasi::where('user_id', $user->id)
        ->where('is_read', false)
        ->count();
        if ($pendaftaran) {

            $logbookCount = Logbook::where(
                'pendaftaran_id',
                $pendaftaran->id
            )->count();

            $totalProposal = Proposal::where(
                'pendaftaran_id',
                $pendaftaran->id
            )->count();

            $proposal = Proposal::where(
                'pendaftaran_id',
                $pendaftaran->id
            )->latest()->first();

            if ($proposal) {
                $proposalStatus = $proposal->status;
            }

            $surat = SuratPengantar::where(
                'pendaftaran_id',
                $pendaftaran->id
            )->first();

            if ($surat) {
                $suratStatus = $surat->status;
            }

            $berita = BeritaAcara::where(
                'pendaftaran_id',
                $pendaftaran->id
            )->first();

            if ($berita) {
                $beritaStatus = 'Sudah Upload';
            }

            $nilai = NilaiAkhir::where(
                'pendaftaran_id',
                $pendaftaran->id
            )->first();

            if ($nilai) {
                $nilaiAkhir = $nilai->nilai_akhir;
            }

            $progress = min(
                round(($logbookCount / $logbookTarget) * 100),
                100
            );
        }

        return Inertia::render('Mahasiswa/Dashboard', [
            'userName' => $user->name,
            'userProdi' => $user->programStudi?->nama ?? '-',
            'userAngkatan' => $user->angkatan ?? '-',
            'userKonsentrasi' => $user->konsentrasi ?? '-',
            'statusInfo' => $statusInfo,
            'currentStep' => $currentStep,
            'notifications' => $notifications,
            'logbookCount' => $logbookCount,
            'logbookTarget' => $logbookTarget,
            'hasPendaftaran' => $pendaftaran !== null,
            'dosenPembimbing' => $pendaftaran?->dosenPembimbing?->name,
            'instansi' => $pendaftaran?->instansi?->nama,
            'pembimbingLapangan' => $pendaftaran?->pembimbingLapangan?->nama,
            'progress' => $progress,
            'proposalCount' => $totalProposal,
            'proposalStatus' => $proposalStatus,
            'suratStatus' => $suratStatus,
            'beritaStatus' => $beritaStatus,
            'nilaiAkhir' => $nilaiAkhir,
            'unreadNotification' => $unreadNotification,
            'kp_progress' => $kpProgress,
        ]);
    }

    /**
     * Determine the stepper step based on pendaftaran state.
     */
    private function determineStep(?Pendaftaran $pendaftaran): int
    {
        if (!$pendaftaran) {
            return 0;
        }

        return match ($pendaftaran->status) {
            'draft' => 0,
            'diajukan', 'verifikasi_tu', 'perlu_perbaikan' => 1,
            'disetujui_tu' => 2,
            'surat_terbit', 'konfirmasi_instansi' => 3,
            'diterima_instansi' => 4,
            'aktif' => 5,
            'seminar', 'sidang_requested', 'sidang_dijadwalkan' => 8,
            'selesai' => 9,
            default => 0,
        };
    }

    /**
     * Get human-readable status info for the status card.
     */
    private function getStatusInfo(?Pendaftaran $pendaftaran): array
    {
        if (!$pendaftaran) {
            return [
                'label' => __('app.status.none.label'),
                'description' => __('app.status.none.description'),
            ];
        }

        return match ($pendaftaran->status) {
            'draft' => [
                'label' => __('app.status.draft.label'),
                'description' => __('app.status.draft.description'),
            ],
            'diajukan' => [
                'label' => __('app.status.diajukan.label'),
                'description' => __('app.status.diajukan.description'),
            ],
            'verifikasi_tu' => [
                'label' => __('app.status.verifikasi_tu.label'),
                'description' => __('app.status.verifikasi_tu.description'),
            ],
            'perlu_perbaikan' => [
                'label' => __('app.status.perlu_perbaikan.label'),
                'description' => __('app.status.perlu_perbaikan.description'),
            ],
            'disetujui_tu' => [
                'label' => __('app.status.disetujui_tu.label'),
                'description' => __('app.status.disetujui_tu.description'),
            ],
            'surat_terbit' => [
                'label' => __('app.status.surat_terbit.label'),
                'description' => __('app.status.surat_terbit.description'),
            ],
            'konfirmasi_instansi' => [
                'label' => 'Menunggu Konfirmasi Mitra',
                'description' => 'Surat Pengantar terbit, menunggu konfirmasi penerimaan dari pihak instansi/PL.',
            ],
            'diterima_instansi' => [
                'label' => __('app.status.diterima_instansi.label'),
                'description' => __('app.status.diterima_instansi.description'),
            ],
            'aktif' => [
                'label' => __('app.status.aktif.label'),
                'description' => __('app.status.aktif.description'),
            ],
            'seminar' => [
                'label' => 'Pelaksanaan Sidang KP',
                'description' => 'Kerja Praktik telah selesai dan mahasiswa dalam proses pengajuan/pelaksanaan sidang.',
            ],
            'sidang_requested' => [
                'label' => 'Pengajuan Sidang Diajukan',
                'description' => 'Pengajuan sidang telah terkirim dan menunggu verifikasi serta penetapan jadwal oleh Prodi.',
            ],
            'sidang_dijadwalkan' => [
                'label' => 'Jadwal Sidang Ditetapkan',
                'description' => 'Jadwal dan penguji sidang telah ditetapkan. Silakan persiapkan berkas dan presentasi.',
            ],
            'selesai' => [
                'label' => __('app.status.selesai.label'),
                'description' => __('app.status.selesai.description'),
            ],
            default => [
                'label' => __('app.status.default.label'),
                'description' => __('app.status.default.description'),
            ],
        };
    }
}
