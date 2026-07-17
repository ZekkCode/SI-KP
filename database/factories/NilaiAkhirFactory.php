<?php

namespace Database\Factories;

use App\Models\NilaiAkhir;
use App\Models\Pendaftaran;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NilaiAkhir>
 */
class NilaiAkhirFactory extends Factory
{
    protected $model = NilaiAkhir::class;

    public function definition(): array
    {
        $nilaiUjian = $this->faker->randomFloat(2, 60, 100);
        $nilaiPembimbing = $this->faker->randomFloat(2, 60, 100);
        $nilaiInstansi = $this->faker->randomFloat(2, 60, 100);
        $total = round(($nilaiUjian * 0.4) + ($nilaiPembimbing * 0.3) + ($nilaiInstansi * 0.3), 2);

        $huruf = match (true) {
            $total >= 85 => 'A',
            $total >= 80 => 'B+',
            $total >= 75 => 'B',
            $total >= 70 => 'C+',
            $total >= 65 => 'C',
            $total >= 50 => 'D',
            default => 'E',
        };

        $status = $total >= 65 ? 'lulus' : ($total >= 50 ? 'tidak_lulus' : 'proses');

        return [
            'pendaftaran_id' => Pendaftaran::factory(),
            'nilai_ujian' => $nilaiUjian,
            'nilai_pembimbing' => $nilaiPembimbing,
            'nilai_instansi' => $nilaiInstansi,
            'nilai_total' => $total,
            'nilai_huruf' => $huruf,
            'status' => $status,
            'catatan' => $this->faker->optional(0.3)->sentence(),
        ];
    }
}
