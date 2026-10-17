<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class KredensialPembimbingLapangan extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $nama,
        public string $email,
        public string $tempPassword,
        public ?string $namaInstansi = 'Instansi Mitra',
        public ?string $namaMahasiswa = 'Mahasiswa',
        public ?string $nimMahasiswa = '-',
        public ?string $periodeKP = null,
        public bool $isReset = false
    ) {
        $this->namaInstansi = $this->namaInstansi ?: 'Instansi Mitra';
        $this->namaMahasiswa = $this->namaMahasiswa ?: 'Mahasiswa';
        $this->nimMahasiswa = $this->nimMahasiswa ?: '-';
    }

    public function envelope(): Envelope
    {
        $subject = $this->isReset
            ? 'Reset Kredensial Akun Pembimbing Lapangan - SI-KP UTM'
            : 'Akun Pembimbing Lapangan SI-KP Teknik Informatika UTM';

        return new Envelope(
            subject: $subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.kredensial-pembimbing-lapangan',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
