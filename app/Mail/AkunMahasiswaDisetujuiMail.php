<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AkunMahasiswaDisetujuiMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $nama,
        public string $nim,
        public string $tempPassword
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Aktivasi Akun Mahasiswa SI-KP Teknik Informatika',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.akun-mahasiswa-disetujui',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
