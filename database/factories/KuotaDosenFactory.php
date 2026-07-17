<?php

namespace Database\Factories;

use App\Models\KuotaDosen;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\KuotaDosen>
 */
class KuotaDosenFactory extends Factory
{
    protected $model = KuotaDosen::class;

    public function definition(): array
    {
        $keahlianList = [
            'Artificial Intelligence', 'Machine Learning', 'Computer Vision',
            'Software Engineering', 'Data Mining', 'Cloud Computing',
            'Cyber Security', 'IoT', 'Database Systems',
            'Mobile Development', 'Web Development', 'Network Engineering',
            'Natural Language Processing', 'Robotics', 'Big Data Analytics',
        ];

        return [
            'dosen_id' => User::factory()->state(['role' => 'dosen']),
            'periode' => $this->faker->randomElement(['2023/2024', '2024/2025', '2025/2026']),
            'kuota_max' => $this->faker->randomElement([8, 10, 12, 15]),
            'keahlian' => $this->faker->randomElement($keahlianList),
        ];
    }
}
