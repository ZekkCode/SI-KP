<?php

namespace Database\Factories;

use App\Models\BeritaAcara;
use App\Models\Pendaftaran;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BeritaAcara>
 */
class BeritaAcaraFactory extends Factory
{
    protected $model = BeritaAcara::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['menunggu', 'disetujui', 'revisi']);

        return [
            'pendaftaran_id' => Pendaftaran::factory(),
            'path_file' => 'berita_acara/' . $this->faker->uuid() . '.pdf',
            'catatan' => $this->faker->optional(0.5)->sentence(),
            'status' => $status,
            'catatan_revisi' => $status === 'revisi'
                ? $this->faker->randomElement([
                    'Cap perusahaan kurang jelas, harap scan ulang dengan resolusi lebih tinggi.',
                    'Tanda tangan pembimbing lapangan belum ada.',
                    'Tanggal pada berita acara tidak sesuai dengan periode KP.',
                    'Halaman kedua dokumen terpotong, mohon scan ulang.',
                ])
                : null,
            'divalidasi_oleh' => null,
            'divalidasi_pada' => $status !== 'menunggu'
                ? $this->faker->dateTimeBetween('-1 month', 'now')
                : null,
        ];
    }
}
