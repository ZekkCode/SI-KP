<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperUserRootSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Membuat atau memperbarui akun Super User Root (Tingkat otoritas tertinggi).
     */
    public function run(): void
    {
        $name = env('ROOT_NAME', 'Root Administrator');
        $email = env('ROOT_EMAIL', 'root@trunojoyo.ac.id');
        $password = env('ROOT_PASSWORD', 'password');

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'user_type' => 'staff',
                'role' => 'tu', // kompatibilitas role lama
                'roles_assignment' => ['superadmin'],
                'active_role' => 'superadmin',
                'is_dekan' => false,
                'is_root' => true,
                'status_akun' => 'aktif',
                'must_change_password' => false,
                'has_set_password' => true,
            ]
        );

        if ($this->command) {
            $this->command->info('Super User Root berhasil disemai / diperbarui.');
            $this->command->table(
                ['Nama', 'Email', 'Password', 'Status Root', 'Peran'],
                [
                    [$user->name, $user->email, $password, 'Ya (is_root: true)', 'superadmin']
                ]
            );
        }
    }
}
