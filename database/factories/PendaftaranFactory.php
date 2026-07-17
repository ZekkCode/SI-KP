<?php

namespace Database\Factories;

use App\Models\Instansi;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pendaftaran>
 */
class PendaftaranFactory extends Factory
{
    protected $model = Pendaftaran::class;

    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-6 months', '+1 month');
        $endDate = (clone $startDate)->modify('+' . $this->faker->randomElement([2, 3]) . ' months');

        $bidangMinat = [
            'Software Engineering', 'Backend Development', 'Frontend Development',
            'Data Science', 'Machine Learning', 'Cloud Infrastructure',
            'Mobile Development', 'DevOps', 'Cyber Security',
            'UI/UX Design', 'Artificial Intelligence', 'IoT',
        ];

        return [
            'mahasiswa_id' => User::factory()->state(['role' => 'mahasiswa']),
            'instansi_id' => Instansi::factory(),
            'dosen_pembimbing_id' => null,
            'tanggal_mulai' => $startDate,
            'tanggal_selesai' => $endDate,
            'status' => $this->faker->randomElement([
                'draft', 'diajukan', 'verifikasi_tu', 'disetujui_tu',
                'surat_terbit', 'diterima_instansi', 'aktif', 'selesai',
            ]),
            'bidang_minat' => $this->faker->randomElement($bidangMinat),
            'catatan_tu' => $this->faker->optional(0.3)->sentence(),
            'diverifikasi_oleh' => null,
            'diverifikasi_pada' => null,
        ];
    }
}
