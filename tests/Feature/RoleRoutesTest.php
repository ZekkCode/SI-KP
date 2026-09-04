<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class RoleRoutesTest extends TestCase
{
    public function test_all_role_routes_render_successfully(): void
    {
        $roles = [
            'mahasiswa' => [
                'email' => 'budi.santoso@student.utn.ac.id',
                'routes' => [
                    '/mahasiswa/dashboard',
                    '/mahasiswa/pendaftaran',
                    '/mahasiswa/status-pengajuan',
                    '/mahasiswa/proposal',
                    '/mahasiswa/surat-pengantar',
                    '/mahasiswa/surat-balasan',
                    '/mahasiswa/berita-acara',
                    '/mahasiswa/penilaian-akhir',
                ],
            ],
            'dosen' => [
                'email' => 'dosen1@utn.ac.id',
                'routes' => [
                    '/dosen/dashboard',
                    '/dosen/review-proposal',
                    '/dosen/logbook',
                    '/dosen/grading',
                ],
            ],
            'tu' => [
                'email' => 'tu1@utn.ac.id',
                'routes' => [
                    '/tu/dashboard',
                    '/tu/verifikasi',
                    '/tu/generate-surat',
                    '/tu/mahasiswa',
                    '/tu/validasi-berita',
                    '/tu/surat-balasan',
                ],
            ],
            'prodi' => [
                'email' => 'prodi1@utn.ac.id',
                'routes' => [
                    '/prodi/dashboard',
                    '/prodi/lecturers',
                    '/prodi/plotting',
                    '/prodi/quota',
                    '/prodi/verification',
                    '/prodi/mahasiswa',
                    '/prodi/reports',
                    '/prodi/periode',
                ],
            ],
            'instansi' => [
                'email' => 'instansi1@company.com',
                'routes' => [
                    '/instansi/dashboard',
                    '/instansi/review',
                    '/instansi/evaluation',
                    '/instansi/logbook',
                    '/instansi/certificates',
                    '/instansi/settings',
                ],
            ],
        ];

        foreach ($roles as $role => $data) {
            $user = User::where('email', $data['email'])->first();
            $this->assertNotNull($user, "User for role {$role} with email {$data['email']} not found.");

            foreach ($data['routes'] as $routePath) {
                $response = $this->actingAs($user)->get($routePath);
                $response->assertStatus(200);
            }
        }
    }
}
