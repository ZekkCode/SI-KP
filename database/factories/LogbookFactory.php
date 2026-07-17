<?php

namespace Database\Factories;

use App\Models\Logbook;
use App\Models\Pendaftaran;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Logbook>
 */
class LogbookFactory extends Factory
{
    protected $model = Logbook::class;

    public function definition(): array
    {
        $activities = [
            'Setup environment development dan konfigurasi project',
            'Meeting dengan tim untuk pembagian tugas sprint',
            'Implementasi fitur autentikasi dan otorisasi user',
            'Desain database schema dan ERD untuk modul baru',
            'Code review bersama senior developer',
            'Debugging dan fixing bug pada modul reporting',
            'Membuat unit test untuk API endpoint',
            'Integrasi API pihak ketiga untuk payment gateway',
            'Optimasi query database untuk mempercepat loading',
            'Deployment aplikasi ke staging server',
            'Mengikuti daily standup meeting',
            'Mempelajari arsitektur microservices perusahaan',
            'Menulis dokumentasi teknis untuk API endpoint',
            'Melakukan load testing menggunakan JMeter',
            'Refactoring kode legacy untuk clean architecture',
            'Presentasi progress mingguan ke supervisor',
            'Setup monitoring dan alerting menggunakan Grafana',
            'Implementasi caching dengan Redis untuk optimasi performa',
            'Kolaborasi dengan tim QA untuk testing integrasi',
            'Evaluasi dan review arsitektur sistem',
        ];

        $status = $this->faker->randomElement(['menunggu', 'disetujui', 'revisi']);
        $dosenNotes = [
            'Bagus, terus tingkatkan!',
            'Perlu lebih detail dalam deskripsi pekerjaan.',
            'Approved. Keep up the good work!',
            null,
        ];

        return [
            'pendaftaran_id' => Pendaftaran::factory(),
            'tanggal' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'jam_mulai' => $this->faker->time('H:i', '09:00'),
            'jam_selesai' => $this->faker->time('H:i', '17:00'),
            'deskripsi' => $this->faker->randomElement($activities),
            'path_foto' => $this->faker->optional(0.4)->passthrough('logbook/foto/' . $this->faker->uuid() . '.jpg'),
            'status' => $status,
            'catatan_dosen' => $status !== 'menunggu'
                ? $this->faker->randomElement($dosenNotes)
                : null,
            'divalidasi_oleh' => null,
            'divalidasi_pada' => $status !== 'menunggu'
                ? $this->faker->dateTimeBetween('-2 months', 'now')
                : null,
        ];
    }
}
