<?php

namespace Database\Factories;

use App\Models\DokumenAkhir;
use App\Models\Pendaftaran;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DokumenAkhir>
 */
class DokumenAkhirFactory extends Factory
{
    protected $model = DokumenAkhir::class;

    public function definition(): array
    {
        $jenis = $this->faker->randomElement(['laporan_akhir', 'lpj', 'sertifikat_nilai', 'transkrip_kp']);

        $namaMap = [
            'laporan_akhir' => 'Laporan_Akhir_KP_' . $this->faker->numerify('###') . '.pdf',
            'lpj' => 'LPJ_Kerja_Praktik_' . $this->faker->numerify('###') . '.pdf',
            'sertifikat_nilai' => 'Sertifikat_Nilai_KP_' . $this->faker->numerify('###') . '.pdf',
            'transkrip_kp' => 'Transkrip_KP_' . $this->faker->numerify('###') . '.pdf',
        ];

        return [
            'pendaftaran_id' => Pendaftaran::factory(),
            'jenis' => $jenis,
            'nama_file' => $namaMap[$jenis],
            'path' => 'dokumen/akhir/' . $this->faker->uuid() . '.pdf',
            'uploaded_at' => $this->faker->dateTimeBetween('-2 months', 'now'),
        ];
    }
}
