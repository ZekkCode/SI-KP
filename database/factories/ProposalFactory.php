<?php

namespace Database\Factories;

use App\Models\Pendaftaran;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Proposal>
 */
class ProposalFactory extends Factory
{
    protected $model = Proposal::class;

    public function definition(): array
    {
        $judulList = [
            'Pengembangan Sistem Informasi Manajemen Inventaris Berbasis Web',
            'Analisis Sentimen Pelanggan E-commerce Menggunakan NLP',
            'Rancang Bangun Aplikasi Mobile untuk Monitoring IoT',
            'Implementasi Machine Learning untuk Prediksi Harga Saham',
            'Perancangan Sistem Keamanan Jaringan Menggunakan IDS',
            'Pengembangan Dashboard Analitik Real-Time untuk Big Data',
            'Sistem Deteksi Penyakit Daun Jagung Menggunakan CNN',
            'Aplikasi Manajemen Proyek Agile Berbasis Cloud',
            'Optimasi Database dan Query Performance untuk Sistem ERP',
            'Pengembangan REST API Gateway untuk Microservices Architecture',
            'Implementasi CI/CD Pipeline untuk Automasi Deployment',
            'Analisis dan Visualisasi Data Penjualan Menggunakan Python',
            'Rancang Bangun Chatbot Customer Service Berbasis AI',
            'Perancangan UI/UX Aplikasi Fintech dengan Pendekatan Design Thinking',
            'Studi Implementasi Blockchain untuk Supply Chain Management',
            'Pengembangan Sistem Rekomendasi Produk Berbasis Collaborative Filtering',
            'Aplikasi Absensi Karyawan Berbasis Face Recognition',
            'Optimasi Algoritma Routing pada Jaringan SDN',
            'Pengembangan Prototipe Smart Home Menggunakan Arduino',
            'Implementasi Data Warehouse dan ETL pada Sistem Pelaporan',
            'Analisis Performa Kubernetes Cluster untuk Container Orchestration',
            'Pengembangan Progressive Web App untuk Layanan Kesehatan',
            'Sistem Monitoring Server dengan Grafana dan Prometheus',
            'Implementasi GraphQL API untuk Aplikasi Sosial Media',
            'Perancangan Arsitektur Serverless untuk Aplikasi Skala Besar',
            'Pengembangan Plugin WordPress untuk E-Learning',
            'Analisis Keamanan Aplikasi Web dengan Metode OWASP',
            'Implementasi Computer Vision untuk Sortir Produk Manufaktur',
            'Rancang Bangun Sistem Informasi Geografis Potensi Wisata',
            'Pengembangan Game Edukasi Matematika Berbasis Unity',
        ];

        $status = $this->faker->randomElement(['draft', 'diajukan', 'revisi', 'disetujui']);

        return [
            'pendaftaran_id' => Pendaftaran::factory(),
            'judul' => $this->faker->randomElement($judulList),
            'abstrak' => $this->faker->paragraphs(2, true),
            'path_file' => 'proposal/' . $this->faker->uuid() . '.pdf',
            'versi' => $this->faker->numberBetween(1, 3),
            'status' => $status,
            'submitted_at' => in_array($status, ['diajukan', 'revisi', 'disetujui'])
                ? $this->faker->dateTimeBetween('-2 months', 'now')
                : null,
            'reviewed_by' => null,
            'reviewed_at' => $status === 'disetujui'
                ? $this->faker->dateTimeBetween('-1 month', 'now')
                : null,
        ];
    }
}
