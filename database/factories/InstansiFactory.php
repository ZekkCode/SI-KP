<?php

namespace Database\Factories;

use App\Models\Instansi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Instansi>
 */
class InstansiFactory extends Factory
{
    protected $model = Instansi::class;

    public function definition(): array
    {
        $prefixes = ['PT.', 'CV.', 'PT.', 'PT.'];
        $names = [
            'Teknologi Nusantara Sejahtera', 'Digital Inovasi Indonesia', 'Maju Bersama Jaya',
            'Solusi Data Nusantara', 'Global Informatika Mandiri', 'Karya Teknik Utama',
            'Inovasi AgriTech Nusantara', 'Cyber Security Indonesia', 'Cloud Nine Technology',
            'Aplikasi Pintar Bangsa', 'Telematika Sukses', 'Bina Karya Digital',
            'Nexus Software House', 'Prima Coding Studio', 'Alfa Data Konsultan',
            'Sentral Teknologi Asia', 'Gemilang IT Solutions', 'Sinergi Digital Pratama',
            'Maestro Inovasi Tech', 'Quantum Computing ID', 'Cakrawala Digital Nusantara',
            'Rajawali Informatika', 'Nusantara Cloud Services', 'Indomedia Kreatif',
            'Surya Data Teknologi', 'Berdikari Software', 'Kreatifitas Digital',
            'Andalan Tekno Mandiri', 'Mitra Solusi Teknologi', 'Elang Digital Utama',
        ];

        $cities = [
            'Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Utara', 'Bandung', 'Surabaya',
            'Yogyakarta', 'Semarang', 'Malang', 'Medan', 'Makassar', 'Tangerang', 'Bekasi',
            'Depok', 'Bogor',
        ];

        $jabatan = ['Senior Engineer', 'HR Manager', 'CTO', 'Lead Developer', 'IT Manager', 'Supervisor', 'Direktur'];

        return [
            'user_id' => null,
            'nama' => $this->faker->randomElement($prefixes) . ' ' . $this->faker->unique()->randomElement($names),
            'alamat' => $this->faker->streetAddress() . "\n" . $this->faker->randomElement($cities),
            'kota' => $this->faker->randomElement($cities),
            'no_telepon' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->companyEmail(),
            'website' => $this->faker->optional(0.7)->url(),
            'nama_pj' => $this->faker->name(),
            'jabatan_pj' => $this->faker->randomElement($jabatan),
        ];
    }

    /**
     * Link instansi to a user account.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn () => [
            'user_id' => $user->id,
        ]);
    }
}
