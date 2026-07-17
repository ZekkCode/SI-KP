<?php

namespace Database\Factories;

use App\Models\DokumenPendaftaran;
use App\Models\Pendaftaran;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DokumenPendaftaran>
 */
class DokumenPendaftaranFactory extends Factory
{
    protected $model = DokumenPendaftaran::class;

    public function definition(): array
    {
        $jenis = $this->faker->randomElement(['krs', 'transkrip', 'acceptance_letter', 'lainnya']);

        $namaMap = [
            'krs' => 'Kartu_Rencana_Studi_Semester_Berjalan.pdf',
            'transkrip' => 'Transkrip_Nilai_Akademik_Terakhir.pdf',
            'acceptance_letter' => 'Surat_Penerimaan_Instansi.pdf',
            'lainnya' => 'Dokumen_Pendukung_' . $this->faker->numerify('###') . '.pdf',
        ];

        return [
            'pendaftaran_id' => Pendaftaran::factory(),
            'jenis' => $jenis,
            'nama_file' => $namaMap[$jenis],
            'path' => 'dokumen/pendaftaran/' . $this->faker->uuid() . '.pdf',
            'ukuran' => $this->faker->numberBetween(100_000, 5_000_000),
            'uploaded_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }
}
