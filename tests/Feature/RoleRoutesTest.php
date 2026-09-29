<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class RoleRoutesTest extends TestCase
{
    use \Illuminate\Foundation\Testing\DatabaseTransactions;

    public function test_all_role_routes_render_successfully(): void
    {
        $roleRoutes = [
            'mahasiswa' => [
                '/mahasiswa/dashboard',
                '/mahasiswa/pendaftaran',
                '/mahasiswa/status-pengajuan',
            ],
            'dosen' => [
                '/dosen/dashboard',
                '/dosen/monitoring',
                '/dosen/review-proposal',
                '/dosen/logbook',
                '/dosen/penilaian',
            ],
            'tu' => [
                '/tu/dashboard',
                '/tu/verifikasi-pendaftaran',
                '/tu/generate-surat',
                '/tu/mahasiswa',
                '/tu/surat-balasan',
                '/tu/persetujuan-akun',
                '/tu/master-mahasiswa',
                '/tu/pembimbing-lapangan',
            ],
            'prodi' => [
                '/prodi/dashboard',
                '/prodi/sidang',
                '/prodi/mitra-instansi',
                '/prodi/arsip-nilai',
                '/prodi/dosen',
                '/prodi/plotting',
                '/prodi/plotting-pl',
                '/prodi/mahasiswa',
                '/prodi/periode',
                '/prodi/berita-acara',
                '/prodi/instansi',
                '/prodi/pembimbing-lapangan',
            ],
            'instansi' => [
                '/instansi/dashboard',
                '/instansi/monitoring',
                '/instansi/pendaftaran',
                '/instansi/evaluation',
                '/instansi/logbook',
                '/instansi/certificates',
                '/instansi/settings',
            ],
        ];

        foreach ($roleRoutes as $role => $routes) {
            $user = User::where('role', $role)->first()
                ?? User::factory()->create(['role' => $role, 'status_akun' => 'aktif']);
            $this->assertNotNull($user, "User for role {$role} not found in database.");

            foreach ($routes as $routePath) {
                $response = $this->actingAs($user)->get($routePath);
                $this->assertEquals(
                    200,
                    $response->getStatusCode(),
                    "Failed loading route {$routePath} for role {$role}. Got status {$response->getStatusCode()}"
                );
            }
        }
    }
}
