<?php

namespace Database\Seeders;

use App\Models\MasterMahasiswa;
use Illuminate\Database\Seeder;

class MasterMahasiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $demoNim = (string) env('DEMO_MHS_NIM', '230411100092');
        $demoNama = env('DEMO_MHS_NAMA', 'Nabiilah Rizqi Amalia');

        $mahasiswas = [
            [
                'nim' => $demoNim,
                'nama' => $demoNama,
                'email' => "{$demoNim}@student.trunojoyo.ac.id",
                'program_studi' => 'Teknik Informatika',
                'angkatan' => '2023',
            ],
        ];


        foreach ($mahasiswas as $data) {
            MasterMahasiswa::updateOrCreate(
                ['nim' => $data['nim']],
                $data
            );
        }
    }
}
