<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SikpSeeder::class,
            RoleUserSeeder::class,
        ]);

        \App\Models\PeriodeKp::create([
            'semester' => 'Gasal 2026/2027',
            'tanggal_pendaftaran' => '2026-07-26',
            'tanggal_batas_pendaftaran' => '2026-12-01',
            'tanggal_batas_pengajuan_surat' => '2026-12-01',
        ]);
    }
}
