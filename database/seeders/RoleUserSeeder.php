<?php

namespace Database\Seeders;

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
        $users = [
            [
                'name' => 'Mahasiswa User',
                'email' => 'mahasiswa@sikp.test',
                'password' => Hash::make('password'),
                'role' => 'mahasiswa',
                'nim' => '123456789',
            ],
            [
                'name' => 'Dr. Aris Sudarmaji',
                'email' => 'dosen@sikp.test',
                'password' => Hash::make('password'),
                'role' => 'dosen',
                'nip' => '0012038401',
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
