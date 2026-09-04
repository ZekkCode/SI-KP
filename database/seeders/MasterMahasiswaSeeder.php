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
        $mahasiswas = [
            [
                'nim' => '230411100092',
                'nama' => 'Nabiilah Rizqi Amalia',
                'email' => '230411100092@student.trunojoyo.ac.id',
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
