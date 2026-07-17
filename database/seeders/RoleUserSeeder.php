<?php

namespace Database\Seeders;

use App\Models\ProgramStudi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleUserSeeder extends Seeder
{
    /**
     * Seed the application's database with demo users for each role.
     */
    public function run(): void
    {
        // Ensure ProgramStudi exists (SikpSeeder runs first)
        $prodiId = ProgramStudi::first()?->id ?? 1;

        $users = [
            [
                'name' => 'Mahasiswa User',
                'email' => 'mahasiswa@sikp.test',
                'password' => Hash::make('password'),
                'role' => 'mahasiswa',
                'nim' => '123456789',
                'program_studi_id' => $prodiId,
                'no_telepon' => '081234567890',
                'konsentrasi' => 'Rekayasa Perangkat Lunak',
                'total_sks' => 120,
                'semester' => 'VII',
                'angkatan' => 2022,
            ],
            [
                'name' => 'Dr. Aris Sudarmaji',
                'email' => 'dosen@sikp.test',
                'password' => Hash::make('password'),
                'role' => 'dosen',
                'nip' => '0012038401',
                'program_studi_id' => $prodiId,
                'no_telepon' => '081298765432',
            ],
            [
                'name' => 'Staff Tata Usaha',
                'email' => 'tu@sikp.test',
                'password' => Hash::make('password'),
                'role' => 'tu',
                'nip' => '198501012010',
            ],
            [
                'name' => 'PT Pertamina (Persero)',
                'email' => 'instansi@sikp.test',
                'password' => Hash::make('password'),
                'role' => 'instansi',
            ],
            [
                'name' => 'Koordinator Prodi',
                'email' => 'prodi@sikp.test',
                'password' => Hash::make('password'),
                'role' => 'prodi',
                'nip' => '197801012005',
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        $this->command->info('✅ Demo users created for all 5 roles:');
        $this->command->table(
            ['Email', 'Role', 'Password'],
            collect($users)->map(fn ($u) => [$u['email'], $u['role'], 'password'])->toArray()
        );
    }
}
