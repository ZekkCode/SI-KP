<?php

namespace App\Services;

use App\Models\Pendaftaran;

class SidangEligibilityService
{
    /**
     * Memeriksa kelayakan pendaftaran untuk mengajukan sidang Kerja Praktik.
     * 
     * Syarat:
     * 1. Semua logbook di-approve dosen (status_dosen = 'disetujui' dan ada minimal 1 entri logbook)
     * 2. Laporan akhir sudah diupload (dokumen_akhirs ada record atau berita acara terlampir)
     * 3. Nilai dari PL / Instansi sudah masuk (nilais dengan tipe = 'instansi' atau nilai_instansi pada nilaiAkhir)
     */
    public function checkEligibility(Pendaftaran $pendaftaran): array
    {
        $missing = [];
        $requirements = [];

        // 1. Syarat Logbook
        $totalLogbooks = $pendaftaran->logbooks()->count();
        $approvedLogbooks = $pendaftaran->logbooks()->where('status_dosen', 'disetujui')->count();
        $unapprovedLogbooks = $pendaftaran->logbooks()->where('status_dosen', '!=', 'disetujui')->count();

        $logbookMet = ($totalLogbooks > 0) && ($unapprovedLogbooks === 0);

        if (!$logbookMet) {
            if ($totalLogbooks === 0) {
                $missing[] = 'Mahasiswa belum mengisi logbook kegiatan magang.';
                $logbookDetail = 'Belum ada logbook yang diisi oleh mahasiswa.';
            } else {
                $missing[] = "Masih ada {$unapprovedLogbooks} entri logbook yang belum disetujui oleh Dosen Pembimbing.";
                $logbookDetail = "{$approvedLogbooks} dari {$totalLogbooks} logbook disetujui ({$unapprovedLogbooks} belum divalidasi).";
            }
        } else {
            $logbookDetail = "Seluruh entri logbook ({$totalLogbooks} kegiatan) telah divalidasi oleh Dosen Pembimbing.";
        }

        $requirements[] = [
            'key' => 'logbook',
            'title' => 'Validasi Logbook Harian',
            'description' => 'Seluruh logbook aktivitas KP wajib telah divalidasi dan disetujui oleh Dosen Pembimbing.',
            'is_met' => $logbookMet,
            'details' => $logbookDetail,
        ];

        // 2. Syarat Laporan Akhir
        $hasDokumenAkhir = $pendaftaran->dokumenAkhirs()->exists();
        $hasBeritaAcara = $pendaftaran->beritaAcara()->exists();
        $laporanMet = $hasDokumenAkhir || $hasBeritaAcara;

        if (!$laporanMet) {
            $missing[] = 'Mahasiswa belum mengunggah dokumen laporan akhir KP.';
            $laporanDetail = 'Dokumen naskah laporan akhir KP belum diunggah.';
        } else {
            $laporanDetail = 'Dokumen naskah laporan akhir telah berhasil diunggah.';
        }

        $requirements[] = [
            'key' => 'laporan_akhir',
            'title' => 'Unggah Laporan Akhir KP',
            'description' => 'Mahasiswa telah mengunggah berkas laporan akhir KP / dokumen pertanggungjawaban magang.',
            'is_met' => $laporanMet,
            'details' => $laporanDetail,
        ];

        // 3. Syarat Nilai dari Pembimbing Lapangan / Instansi
        $hasNilaiInstansi = $pendaftaran->nilais()->where('tipe', 'instansi')->exists() 
            || ($pendaftaran->nilaiAkhir && $pendaftaran->nilaiAkhir->nilai_instansi !== null);

        if (!$hasNilaiInstansi) {
            $missing[] = 'Pembimbing Lapangan / Instansi belum memberikan nilai evaluasi magang.';
            $nilaiDetail = 'Nilai evaluasi dari Pembimbing Lapangan belum masuk ke sistem.';
        } else {
            $nilaiValue = $pendaftaran->nilaiAkhir?->nilai_instansi;
            $nilaiDetail = 'Nilai evaluasi dari Pembimbing Lapangan telah terisi' . ($nilaiValue !== null ? " (Nilai: {$nilaiValue})." : '.');
        }

        $requirements[] = [
            'key' => 'nilai_instansi',
            'title' => 'Nilai Evaluasi Industri (PL)',
            'description' => 'Pembimbing Lapangan telah menginput form penilaian kinerja dan kedisiplinan mahasiswa.',
            'is_met' => $hasNilaiInstansi,
            'details' => $nilaiDetail,
        ];

        $isEligible = $logbookMet && $laporanMet && $hasNilaiInstansi;

        return [
            'eligible' => $isEligible,
            'missing' => $missing,
            'requirements' => $requirements,
        ];
    }
}
