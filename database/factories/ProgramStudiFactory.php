<?php

namespace Database\Factories;

use App\Models\ProgramStudi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProgramStudi>
 */
class ProgramStudiFactory extends Factory
{
    protected $model = ProgramStudi::class;

    public function definition(): array
    {
        $prodiList = [
            ['nama' => 'Teknik Informatika', 'kode' => 'TI', 'fakultas' => 'Fakultas Ilmu Komputer'],
            ['nama' => 'Sistem Informasi', 'kode' => 'SI', 'fakultas' => 'Fakultas Ilmu Komputer'],
            ['nama' => 'Teknik Elektro', 'kode' => 'TE', 'fakultas' => 'Fakultas Teknik'],
            ['nama' => 'Teknik Industri', 'kode' => 'TIN', 'fakultas' => 'Fakultas Teknik'],
            ['nama' => 'Manajemen Informatika', 'kode' => 'MI', 'fakultas' => 'Fakultas Ilmu Komputer'],
        ];

        $pick = $this->faker->randomElement($prodiList);

        return [
            'nama' => $pick['nama'],
            'kode' => $pick['kode'] . $this->faker->unique()->numerify('##'),
            'fakultas' => $pick['fakultas'],
        ];
    }
}
