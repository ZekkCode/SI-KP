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
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->load('programStudi');

        // Get the latest pendaftaran with relations
        $pendaftaran = Pendaftaran::where('mahasiswa_id', $user->id)
            ->with(['instansi', 'dosenPembimbing', 'proposals', 'suratPengantar'])
            ->latest()
            ->first();

        // Determine current step for stepper (0-5)
        $currentStep = $this->determineStep($pendaftaran);

        // Status info for the status card
        $statusInfo = $this->getStatusInfo($pendaftaran);

        // Get recent notifications (latest 5)
        $notifications = Notifikasi::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'judul' => $n->judul,
                'pesan' => $n->pesan,
                'tipe' => $n->tipe,
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
            'progress' => $progress,
            'proposalCount' => $totalProposal,
            'proposalStatus' => $proposalStatus,
            'suratStatus' => $suratStatus,
            'beritaStatus' => $beritaStatus,
            'nilaiAkhir' => $nilaiAkhir,
            'unreadNotification' => $unreadNotification,
            ]);
        }

    /**
     * Determine the stepper step based on pendaftaran state.
     *
     * Steps: 0=Pendaftaran, 1=Verifikasi, 2=Surat Pengantar, 3=Proposal, 4=Pelaksanaan, 5=Laporan
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
            'surat_terbit' => 3,
            'diterima_instansi' => 3,
            'aktif' => 4,
            'selesai' => 5,
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
                'label' => 'Belum Mendaftar',
                'description' => 'Anda belum melakukan pendaftaran Kerja Praktik. Silakan mulai proses pendaftaran.',
            ];
        }

        return match ($pendaftaran->status) {
            'draft' => [
                'label' => 'Draft Pendaftaran',
                'description' => 'Pendaftaran Anda masih dalam bentuk draft. Lengkapi dan kirimkan untuk diproses.',
            ],
            'diajukan' => [
                'label' => 'Menunggu Verifikasi',
                'description' => 'Pendaftaran telah diajukan dan sedang menunggu verifikasi dari Tata Usaha.',
            ],
            'verifikasi_tu' => [
                'label' => 'Sedang Diverifikasi TU',
                'description' => 'Berkas pendaftaran sedang dalam proses verifikasi oleh Tata Usaha.',
            ],
            'perlu_perbaikan' => [
                'label' => 'Perlu Perbaikan',
                'description' => 'Berkas pendaftaran memerlukan perbaikan. Periksa catatan dari TU.',
            ],
            'disetujui_tu' => [
                'label' => 'Menunggu Surat Pengantar',
                'description' => 'Dokumen pendaftaran Anda telah disetujui. Menunggu penerbitan surat pengantar.',
            ],
            'surat_terbit' => [
                'label' => 'Surat Pengantar Terbit',
                'description' => 'Surat pengantar telah diterbitkan. Silakan unduh dan ajukan ke instansi tujuan.',
            ],
            'diterima_instansi' => [
                'label' => 'Diterima Instansi',
                'description' => 'Selamat! Anda telah diterima di instansi. Silakan upload proposal KP.',
            ],
            'aktif' => [
                'label' => 'Sedang Berlangsung',
                'description' => 'Kerja Praktik sedang berjalan. Jangan lupa mengisi logbook harian.',
            ],
            'selesai' => [
                'label' => 'Selesai',
                'description' => 'Kerja Praktik telah selesai. Periksa penilaian akhir Anda.',
            ],
            default => [
                'label' => 'Status Tidak Diketahui',
                'description' => 'Hubungi koordinator KP untuk informasi lebih lanjut.',
            ],
        };
    }
}
