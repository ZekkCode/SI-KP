<?php

namespace App\Services;

use App\Models\Pendaftaran;
use App\Models\User;

class KpProgressService
{
    /**
     * Hitung progres tahapan KP mahasiswa (Step 1 s.d. 9).
     *
     * @param int $mahasiswaId
     * @return array
     */
    public function getProgress(int $mahasiswaId): array
    {
        $pendaftaran = Pendaftaran::with([
            'suratPengantar',
            'proposals' => fn($q) => $q->latest(),
            'logbooks',
            'dokumenAkhirs',
            'beritaAcara',
            'sidang',
            'nilaiAkhir',
            'nilais',
        ])
        ->where('mahasiswa_id', $mahasiswaId)
        ->latest()
        ->first();

        // Evaluasi penyelesaian tiap step
        // Step 1: Pendaftaran (status >= diajukan)
        $step1Done = $pendaftaran && !in_array($pendaftaran->status, ['draft']);

        // Step 2: Surat Pengantar (surat_pengantars ada record dan minimal terverifikasi / tanggal_terbit ada)
        $surat = $pendaftaran?->suratPengantar;
        $step2Done = $surat && (
            in_array($surat->status, ['terverifikasi']) ||
            !empty($surat->nomor_surat) ||
            !empty($surat->tanggal_terbit) ||
            in_array($pendaftaran->status, ['surat_terbit', 'konfirmasi_instansi', 'diterima_instansi', 'aktif', 'seminar', 'selesai'])
        );

        // Step 3: Konfirmasi Instansi (confirmation_status = 'accepted' atau status pendaftaran diterima/aktif)
        $step3Done = $surat && (
            $surat->confirmation_status === 'accepted' ||
            in_array($pendaftaran->status, ['diterima_instansi', 'aktif', 'seminar', 'selesai'])
        );

        // Step 4: Proposal (proposals ada record dengan status disetujui)
        $approvedProposal = $pendaftaran?->proposals->where('status', 'disetujui')->first();
        $step4Done = (bool) $approvedProposal;

        // Step 5: Pelaksanaan KP (Status = aktif atau lebih lanjut)
        $step5Done = $pendaftaran && in_array($pendaftaran->status, [
            'aktif', 'seminar', 'sidang_requested', 'sidang_dijadwalkan', 'selesai'
        ]);

        // Step 6: Logbook (Minimal 5 entri logbook atau minimal 1 entri disetujui dosen)
        $totalLogbooks = $pendaftaran?->logbooks->count() ?? 0;
        $approvedLogbooks = $pendaftaran?->logbooks->where('status_dosen', 'disetujui')->count() ?? 0;
        $step6Done = ($totalLogbooks >= 5) || ($approvedLogbooks >= 1 && $step5Done);

        // Step 7: Laporan Akhir (dokumen_akhirs ada record atau beritaAcara ada record)
        $hasDokumenAkhir = ($pendaftaran?->dokumenAkhirs->count() ?? 0) > 0;
        $hasBeritaAcara = (bool) $pendaftaran?->beritaAcara;
        $step7Done = $hasDokumenAkhir || $hasBeritaAcara;

        // Step 8: Sidang (sidangs ada record dengan status selesai)
        $sidang = $pendaftaran?->sidang;
        $step8Done = $sidang && ($sidang->status === 'selesai' || in_array($pendaftaran->status, ['selesai']));

        // Step 9: Penilaian (nilai_akhirs ada record atau status = selesai)
        $step9Done = $pendaftaran && (
            ($pendaftaran->nilaiAkhir && $pendaftaran->nilaiAkhir->nilai_total !== null) ||
            $pendaftaran->status === 'selesai'
        );

        // Tentukan batas akses terbuka (Step Gating)
        $maxUnlocked = 1;
        if ($step1Done) $maxUnlocked = 2;
        if ($step2Done) $maxUnlocked = 3;
        if ($step3Done) $maxUnlocked = 4;
        if ($step4Done) $maxUnlocked = 5;
        if ($step5Done) $maxUnlocked = 6;
        if ($step6Done) $maxUnlocked = 7;
        if ($step7Done) $maxUnlocked = 8;
        if ($step8Done) $maxUnlocked = 9;

        // Tentukan current_step (step aktif yang sedang berlangsung / pertama yang belum selesai)
        $currentStep = 1;
        if ($step1Done) $currentStep = 2;
        if ($step2Done) $currentStep = 3;
        if ($step3Done) $currentStep = 4;
        if ($step4Done) $currentStep = 5;
        if ($step5Done) $currentStep = 6;
        if ($step6Done) $currentStep = 7;
        if ($step7Done) $currentStep = 8;
        if ($step8Done) $currentStep = 9;
        if ($step9Done) $currentStep = 9;

        $completedStepsCount = collect([
            $step1Done, $step2Done, $step3Done, $step4Done,
            $step5Done, $step6Done, $step7Done, $step8Done, $step9Done
        ])->filter()->count();

        $progressPercent = (int) round(($completedStepsCount / 9) * 100);

        $stepsDefinition = [
            [
                'step' => 1,
                'title' => 'Pendaftaran KP',
                'label' => 'Pendaftaran',
                'description' => 'Mengisi formulir pendaftaran tempat magang dan berkas persyaratan',
                'route' => '/mahasiswa/pendaftaran',
                'is_completed' => $step1Done,
                'is_current' => $currentStep === 1,
                'is_locked' => false, // Step 1 selalu terbuka
                'status_badge' => $step1Done ? 'Selesai' : 'Perlu Diisi',
            ],
            [
                'step' => 2,
                'title' => 'Surat Pengantar',
                'label' => 'Surat Pengantar',
                'description' => 'Penerbitan surat pengantar resmi bertanda tangan digital Dekan oleh TU',
                'route' => '/mahasiswa/surat-pengantar',
                'is_completed' => $step2Done,
                'is_current' => $currentStep === 2,
                'is_locked' => 2 > $maxUnlocked,
                'status_badge' => $step2Done ? 'Terbit' : (2 <= $maxUnlocked ? 'Menunggu TU' : 'Terkunci'),
            ],
            [
                'step' => 3,
                'title' => 'Konfirmasi Instansi',
                'label' => 'Konfirmasi PL',
                'description' => 'Pihak instansi menyatakan persetujuan penerimaan magang via tautan verifikasi',
                'route' => '/mahasiswa/status-pengajuan',
                'is_completed' => $step3Done,
                'is_current' => $currentStep === 3,
                'is_locked' => 3 > $maxUnlocked,
                'status_badge' => $step3Done ? 'Diterima' : (3 <= $maxUnlocked ? 'Menunggu Mitra' : 'Terkunci'),
            ],
            [
                'step' => 4,
                'title' => 'Proposal KP',
                'label' => 'Proposal',
                'description' => 'Unggah naskah proposal KP dan review oleh Dosen Pembimbing & Pembimbing Lapangan',
                'route' => '/mahasiswa/proposal',
                'is_completed' => $step4Done,
                'is_current' => $currentStep === 4,
                'is_locked' => 4 > $maxUnlocked,
                'status_badge' => $step4Done ? 'Disetujui' : (4 <= $maxUnlocked ? 'Perlu Review' : 'Terkunci'),
            ],
            [
                'step' => 5,
                'title' => 'Pelaksanaan KP',
                'label' => 'Pelaksanaan',
                'description' => 'Melaksanakan kerja praktik di instansi mitra sesuai jadwal yang ditetapkan',
                'route' => '/mahasiswa/status-pengajuan',
                'is_completed' => $step5Done,
                'is_current' => $currentStep === 5,
                'is_locked' => 5 > $maxUnlocked,
                'status_badge' => $step5Done ? 'Aktif' : (5 <= $maxUnlocked ? 'Siap Dimulai' : 'Terkunci'),
            ],
            [
                'step' => 6,
                'title' => 'Logbook Harian',
                'label' => 'Logbook',
                'description' => 'Mengisi catatan aktivitas dan dokumentasi kegiatan harian secara berkala',
                'route' => '/mahasiswa/logbook',
                'is_completed' => $step6Done,
                'is_current' => $currentStep === 6,
                'is_locked' => 6 > $maxUnlocked,
                'status_badge' => $step6Done ? "Lengkap ({$totalLogbooks})" : (6 <= $maxUnlocked ? "{$totalLogbooks} Entri" : 'Terkunci'),
            ],
            [
                'step' => 7,
                'title' => 'Laporan Akhir',
                'label' => 'Laporan Akhir',
                'description' => 'Mengunggah naskah laporan akhir Kerja Praktik yang telah disetujui',
                'route' => '/mahasiswa/dokumen-akhir',
                'is_completed' => $step7Done,
                'is_current' => $currentStep === 7,
                'is_locked' => 7 > $maxUnlocked,
                'status_badge' => $step7Done ? 'Terunggah' : (7 <= $maxUnlocked ? 'Wajib Unggah' : 'Terkunci'),
            ],
            [
                'step' => 8,
                'title' => 'Sidang KP',
                'label' => 'Sidang KP',
                'description' => 'Pendaftaran, penetapan jadwal sidang oleh Prodi, dan pelaksanaan presentasi pengujian',
                'route' => '/mahasiswa/sidang',
                'is_completed' => $step8Done,
                'is_current' => $currentStep === 8,
                'is_locked' => 8 > $maxUnlocked,
                'status_badge' => $step8Done ? 'Selesai' : (8 <= $maxUnlocked ? ($sidang ? $sidang->status : 'Buka Pendaftaran') : 'Terkunci'),
            ],
            [
                'step' => 9,
                'title' => 'Penilaian & Kelulusan',
                'label' => 'Nilai Akhir',
                'description' => 'Input nilai evaluasi industri, nilai dosen pembimbing, dan penerbitan nilai akhir',
                'route' => '/mahasiswa/penilaian',
                'is_completed' => $step9Done,
                'is_current' => $currentStep === 9,
                'is_locked' => 9 > $maxUnlocked,
                'status_badge' => $step9Done ? 'Lulus' : (9 <= $maxUnlocked ? 'Proses Penilaian' : 'Terkunci'),
            ],
        ];

        return [
            'pendaftaran_id' => $pendaftaran?->id,
            'current_step' => $currentStep,
            'max_unlocked_step' => $maxUnlocked,
            'progress_percent' => $progressPercent,
            'completed_steps_count' => $completedStepsCount,
            'current_step_info' => $stepsDefinition[$currentStep - 1] ?? $stepsDefinition[0],
            'steps' => $stepsDefinition,
        ];
    }

    /**
     * Memeriksa apakah mahasiswa memiliki hak akses ke step tertentu.
     */
    public function canAccessStep(int $mahasiswaId, int $requiredStep): bool
    {
        $progress = $this->getProgress($mahasiswaId);
        return $requiredStep <= $progress['max_unlocked_step'];
    }
}
