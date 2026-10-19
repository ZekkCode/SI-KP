<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('mail:test {emails* : Alamat email penerima (bisa lebih dari satu)} {--template=credential : Template email (credential atau simple)}', function () {
    $emails = (array) $this->argument('emails');
    $template = (string) $this->option('template');

    $this->info("Menyiapkan pengujian pengiriman email ke " . count($emails) . " penerima...");
    $this->line("Mailer  : " . config('mail.default'));
    $this->line("Host    : " . config('mail.mailers.smtp.host') . ":" . config('mail.mailers.smtp.port'));
    $this->line("Pengirim: " . config('mail.from.address') . " (" . config('mail.from.name') . ")");
    $this->newLine();

    $successCount = 0;
    foreach ($emails as $email) {
        $email = trim($email);
        $this->output->write("Mengirim ke {$email}... ");

        try {
            if ($template === 'credential') {
                \Illuminate\Support\Facades\Mail::to($email)->send(new \App\Mail\KredensialPembimbingLapangan(
                    nama: 'Bapak/Ibu Pembimbing',
                    email: $email,
                    tempPassword: 'DemoPassword123!',
                    namaInstansi: 'PT Mitra Teknologi',
                    namaMahasiswa: 'Devano Prakoso',
                    nimMahasiswa: '210411100099',
                    periodeKP: '01 Juli 2026 s.d 31 Agustus 2026',
                    isReset: false
                ));
            } else {
                \Illuminate\Support\Facades\Mail::raw("Halo, ini pesan uji coba pengiriman email dari SI-KP Teknik Informatika UTM.\n\nSistem SMTP berhasil terhubung dan siap digunakan.", function ($m) use ($email) {
                    $m->to($email)->subject('Uji Coba Pengiriman Email SI-KP UTM');
                });
            }

            $this->info("[BERHASIL]");
            $successCount++;
        } catch (\Throwable $e) {
            $this->error("[GAGAL]");
            $this->warn("  Detail error: " . $e->getMessage());
        }
    }

    $this->newLine();
    $this->info("Pengujian selesai. {$successCount}/" . count($emails) . " email berhasil terkirim.");
})->purpose('Uji coba pengiriman email ke satu atau beberapa alamat penerima');

