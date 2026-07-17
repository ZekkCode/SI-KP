<?php

namespace Database\Factories;

use App\Models\Pendaftaran;
use App\Models\SuratPengantar;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SuratPengantar>
 */
class SuratPengantarFactory extends Factory
{
    protected $model = SuratPengantar::class;

    public function definition(): array
    {
        $tanggalTerbit = $this->faker->dateTimeBetween('-3 months', 'now');

        return [
            'pendaftaran_id' => Pendaftaran::factory(),
            'nomor_surat' => $this->faker->unique()->numerify('####') . '/UN.XX/AK.KP/' . now()->year,
            'tanggal_terbit' => $tanggalTerbit,
            'tanggal_berlaku' => (clone $tanggalTerbit)->modify('+6 months'),
            'path_file' => 'surat/pengantar/' . $this->faker->uuid() . '.pdf',
            'ditandatangani_oleh' => 'Dr. ' . $this->faker->name() . ', M.Kom.',
            'nip_penandatangan' => $this->faker->numerify('19########') . ' ' . $this->faker->numerify('200501') . ' 1 ' . $this->faker->numerify('0##'),
            'verification_id' => strtoupper($this->faker->bothify('??##-??##-####')),
            'generated_by' => User::factory()->state(['role' => 'tu']),
        ];
    }
}
