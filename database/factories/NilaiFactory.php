<?php

namespace Database\Factories;

use App\Models\Nilai;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Nilai>
 */
class NilaiFactory extends Factory
{
    protected $model = Nilai::class;

    public function definition(): array
    {
        $tipe = $this->faker->randomElement(['ujian_kp', 'pembimbing', 'instansi']);

        $komponenMap = [
            'ujian_kp' => ['Presentasi', 'Penguasaan Materi', 'Laporan Akhir', 'Tanya Jawab'],
            'pembimbing' => ['Bimbingan Rutin', 'Kualitas Logbook', 'Keaktifan Konsultasi', 'Progres Kerja'],
            'instansi' => ['Kedisiplinan', 'Tanggung Jawab', 'Kerja Sama Tim', 'Pencapaian Target'],
        ];

        return [
            'pendaftaran_id' => Pendaftaran::factory(),
            'penilai_id' => User::factory()->state(['role' => $tipe === 'instansi' ? 'instansi' : 'dosen']),
            'tipe' => $tipe,
            'komponen' => $this->faker->randomElement($komponenMap[$tipe]),
            'bobot' => 25.00,
            'nilai' => $this->faker->randomFloat(2, 60, 100),
        ];
    }
}
