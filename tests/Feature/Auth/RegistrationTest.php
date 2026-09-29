<?php

namespace Tests\Feature\Auth;

use App\Models\MasterMahasiswa;
use App\Models\ProgramStudi;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use DatabaseTransactions;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_pl_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register/pembimbing-lapangan');

        $response->assertStatus(200);
    }

    public function test_check_nim_returns_expected_status(): void
    {
        $prodi = ProgramStudi::first() ?? ProgramStudi::create([
            'nama' => 'Teknik Informatika',
            'kode' => 'TI',
            'fakultas' => 'Fakultas Teknik',
        ]);

        $testNim = '990411100099';
        MasterMahasiswa::firstOrCreate(
            ['nim' => $testNim],
            [
                'nama' => 'Calon Peserta KP Test',
                'email' => 'calon.test@student.utn.ac.id',
                'program_studi' => 'Teknik Informatika',
                'program_studi_id' => $prodi->id,
                'angkatan' => 2022,
                'status_akademik' => 'aktif',
            ]
        );

        $response = $this->postJson('/register/check-nim', [
            'nim' => $testNim,
        ]);

        // Returns 200 ready, or 422 if already requested/has account
        $this->assertTrue(in_array($response->getStatusCode(), [200, 422]));
    }
}
