<?php

namespace Database\Factories;

use App\Models\Notifikasi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notifikasi>
 */
class NotifikasiFactory extends Factory
{
    protected $model = Notifikasi::class;

    public function definition(): array
    {
        $templates = [
            ['judul' => 'Pendaftaran KP Berhasil', 'pesan' => 'Pendaftaran kerja praktik Anda telah berhasil disubmit. Silakan tunggu verifikasi dari TU.', 'tipe' => 'sukses'],
            ['judul' => 'Verifikasi Berkas Diperlukan', 'pesan' => 'Ada berkas pendaftaran baru yang memerlukan verifikasi Anda.', 'tipe' => 'info'],
            ['judul' => 'Proposal Perlu Revisi', 'pesan' => 'Dosen pembimbing memberikan catatan revisi pada proposal Anda. Silakan cek dan perbaiki.', 'tipe' => 'peringatan'],
            ['judul' => 'Logbook Disetujui', 'pesan' => 'Logbook harian Anda telah disetujui oleh dosen pembimbing.', 'tipe' => 'sukses'],
            ['judul' => 'Surat Pengantar Terbit', 'pesan' => 'Surat pengantar KP Anda telah diterbitkan. Silakan unduh dari halaman status pengajuan.', 'tipe' => 'sukses'],
            ['judul' => 'Deadline Logbook', 'pesan' => 'Anda belum mengisi logbook harian minggu ini. Segera lengkapi untuk menghindari peringatan.', 'tipe' => 'peringatan'],
            ['judul' => 'Plotting Dosen Berhasil', 'pesan' => 'Dosen pembimbing telah ditetapkan untuk mahasiswa bimbingan Anda.', 'tipe' => 'info'],
            ['judul' => 'Nilai Akhir Tersedia', 'pesan' => 'Nilai akhir kerja praktik Anda telah dipublikasikan. Silakan cek halaman nilai.', 'tipe' => 'sukses'],
            ['judul' => 'Berita Acara Ditolak', 'pesan' => 'Berita acara yang Anda upload memerlukan perbaikan. Periksa catatan revisi.', 'tipe' => 'error'],
            ['judul' => 'Kuota Bimbingan Penuh', 'pesan' => 'Kuota bimbingan Anda telah mencapai batas maksimal untuk periode ini.', 'tipe' => 'peringatan'],
        ];

        $template = $this->faker->randomElement($templates);

        return [
            'user_id' => User::factory(),
            'judul' => $template['judul'],
            'pesan' => $template['pesan'],
            'tipe' => $template['tipe'],
            'is_read' => $this->faker->boolean(40),
            'link' => $this->faker->optional(0.6)->url(),
        ];
    }
}
