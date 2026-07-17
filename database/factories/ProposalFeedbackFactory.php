<?php

namespace Database\Factories;

use App\Models\Proposal;
use App\Models\ProposalFeedback;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProposalFeedback>
 */
class ProposalFeedbackFactory extends Factory
{
    protected $model = ProposalFeedback::class;

    public function definition(): array
    {
        $comments = [
            'Judul sudah cukup baik, namun perlu diperjelas scope-nya.',
            'Abstrak perlu ditambahkan metodologi yang digunakan.',
            'Saya setujui proposal ini. Silakan lanjutkan ke tahap implementasi.',
            'Tolong tambahkan referensi jurnal terbaru minimal 3 tahun terakhir.',
            'Rumusan masalah belum spesifik. Tolong revisi.',
            'Sistematika penulisan sudah bagus, perbaiki tata bahasa.',
            'Topik menarik, pastikan data yang digunakan valid.',
            'Perlu ditambahkan batasan masalah agar tidak terlalu luas.',
            'Revisi minor: perbaiki format penulisan daftar pustaka.',
            'Proposal sudah memenuhi standar. Approved.',
        ];

        return [
            'proposal_id' => Proposal::factory(),
            'user_id' => User::factory()->state(['role' => 'dosen']),
            'komentar' => $this->faker->randomElement($comments),
            'status_setelah' => $this->faker->optional(0.5)->randomElement(['revisi', 'disetujui']),
        ];
    }
}
