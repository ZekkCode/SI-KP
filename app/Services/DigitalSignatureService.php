<?php

namespace App\Services;

use Illuminate\Support\Str;

class DigitalSignatureService
{
    /**
     * Menghasilkan kode unik verifikasi dokumen digital.
     * Format: SIKP-{PREFIX}-{TIMESTAMP}-{RANDOM}
     */
    public function generateVerificationId(string $prefix = 'SP'): string
    {
        $dateCode = date('ymd');
        $random = strtoupper(Str::random(6));
        return "SIKP-{$prefix}-{$dateCode}-{$random}";
    }

    /**
     * Mengambil data profil pejabat penandatangan dari konfigurasi sistem.
     * 
     * @param string $role dekan|kaprodi|koordinator_kp
     */
    public function getOfficial(string $role = 'dekan'): array
    {
        $config = config("sikp.{$role}", []);

        return [
            'nama' => $config['nama'] ?? 'Ari Basuki, S.T., M.T.',
            'nip' => $config['nip'] ?? '197801202003121002',
            'jabatan' => $config['jabatan'] ?? 'Dekan Fakultas Teknik',
            'ttd_path' => $config['ttd_path'] ?? null,
            'ttd_exists' => !empty($config['ttd_path']) && file_exists(public_path($config['ttd_path'])),
            'ttd_url' => !empty($config['ttd_path']) ? asset($config['ttd_path']) : null,
        ];
    }

    /**
     * Mendapatkan URL verifikasi publik untuk kode verifikasi dokumen.
     */
    public function getVerificationUrl(string $verificationId, string $type = 'surat-pengantar'): string
    {
        return url("/verifikasi/{$type}/{$verificationId}");
    }

    /**
     * Format data blok tanda tangan digital untuk disematkan pada template PDF/Cetak.
     */
    public function getSignatureBlock(string $role = 'dekan', ?string $verificationId = null): array
    {
        $official = $this->getOfficial($role);
        $vId = $verificationId ?: $this->generateVerificationId(strtoupper(substr($role, 0, 3)));
        $verificationUrl = $this->getVerificationUrl($vId, $role);

        return [
            'nama' => $official['nama'],
            'nip' => $official['nip'],
            'jabatan' => $official['jabatan'],
            'ttd_path' => $official['ttd_path'],
            'ttd_exists' => $official['ttd_exists'],
            'ttd_url' => $official['ttd_url'],
            'verification_id' => $vId,
            'verification_url' => $verificationUrl,
            'certified_at' => now()->translatedFormat('d F Y H:i:s') . ' WIB',
            'security_hash' => strtoupper(substr(hash('sha256', $vId . $official['nip']), 0, 16)),
        ];
    }
}
