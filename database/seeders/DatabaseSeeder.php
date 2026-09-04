<?php

namespace Database\Seeders;

use App\Models\ProgramStudi;
use App\Models\User;
use App\Models\PeriodeKp;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Setup Program Studi (Khusus Teknik Informatika)
        $prodi = ProgramStudi::create([
            'nama' => 'Teknik Informatika',
            'kode' => 'TI',
            'fakultas' => 'Fakultas Teknik'
        ]);

        $prodiId = $prodi->id;

        // 2. Setup Periode KP
        PeriodeKp::create([
            'semester' => 'Gasal 2026/2027',
            'tanggal_pendaftaran' => '2026-07-26',
            'tanggal_batas_pendaftaran' => '2026-12-01',
            'tanggal_batas_pengajuan_surat' => '2026-12-01',
        ]);

        // 3. Setup Hardcoded Users
        $password = Hash::make('password');

        // Admin TU
        User::create([
            'name' => 'Admin TU',
            'email' => 'tu@admin.com',
            'password' => $password,
            'role' => 'tu',
            'status_akun' => 'aktif',
            'nip' => '198501012010',
        ]);

        // Koordinator Prodi
        User::create([
            'name' => 'Koordinator Prodi',
            'email' => 'prodi@admin.com',
            'password' => $password,
            'role' => 'prodi',
            'status_akun' => 'aktif',
            'nip' => '197001012000',
            'program_studi_id' => $prodiId,
        ]);

        // Dosen Pembimbing 1
        User::create([
            'name' => 'Rika Yunitarini',
            'email' => 'rika@dosen.com',
            'password' => $password,
            'role' => 'dosen',
            'status_akun' => 'aktif',
            'nip' => '198002022001',
            'program_studi_id' => $prodiId,
        ]);

        // Dosen Pembimbing 2
        User::create([
            'name' => 'Fifin',
            'email' => 'fifin@dosen.com',
            'password' => $password,
            'role' => 'dosen',
            'status_akun' => 'aktif',
            'nip' => '198203032002',
            'program_studi_id' => $prodiId,
        ]);

        // Mahasiswa Dummy
        User::create([
            'name' => 'Damara Ayu',
            'email' => 'mahasiswa@mhs.com',
            'password' => $password,
            'role' => 'mahasiswa',
            'status_akun' => 'aktif',
            'nim' => '220411100080',
            'program_studi_id' => $prodiId,
        ]);

        $this->command->info('✅ Database berhasil di-seed!');
        $this->command->info('- Program Studi Khusus Teknik Informatika (Created)');
        $this->command->info('- Akun Admin TU, Koordinator Prodi, 2 Dosen, dan 1 Mahasiswa (Aktif)');
    }
}