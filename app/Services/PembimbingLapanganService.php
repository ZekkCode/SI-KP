<?php

namespace App\Services;

use App\Mail\KredensialPembimbingLapangan;
use App\Models\Notifikasi;
use App\Models\PembimbingLapangan;
use App\Models\Pendaftaran;
use App\Models\SuratPengantar;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PembimbingLapanganService
{
    /**
     * Handle public confirmation of acceptance or rejection from the institution.
     */
    public function konfirmasiPenerimaan(SuratPengantar $surat, array $data): array
    {
        if ($surat->confirmation_status !== 'pending') {
            return [
                'success' => false,
                'message' => 'Surat pengantar ini sudah dikonfirmasi sebelumnya pada ' .
                    $surat->confirmed_at?->translatedFormat('d F Y H:i') . ' WIB.',
            ];
        }

        $pendaftaran = $surat->pendaftaran()->with(['mahasiswa', 'instansi'])->firstOrFail();
        $isAccepted = ($data['keputusan'] ?? '') === 'terima';

        return DB::transaction(function () use ($surat, $pendaftaran, $data, $isAccepted) {
            if ($isAccepted) {
                $email = strtolower(trim($data['pl_email']));
                $namaPL = trim($data['pl_nama']);
                $telepon = trim($data['pl_telepon'] ?? '');
                $catatan = trim($data['catatan'] ?? '');

                // 1. Find or create User for Pembimbing Lapangan
                $user = User::where('email', $email)->first();
                $tempPassword = null;
                $isNewAccount = false;

                if (!$user) {
                    $isNewAccount = true;
                    $tempPassword = Str::random(10);
                    $user = User::create([
                        'name' => $namaPL,
                        'email' => $email,
                        'password' => Hash::make($tempPassword),
                        'role' => 'instansi',
                        'status_akun' => 'aktif',
                        'no_telepon' => $telepon ?: null,
                        'must_change_password' => true,
                        'has_set_password' => false,
                    ]);
                } else {
                    // Update user info if role is instansi
                    if ($user->role === 'instansi') {
                        $user->update([
                            'name' => $namaPL,
                            'no_telepon' => $telepon ?: $user->no_telepon,
                            'status_akun' => 'aktif',
                        ]);
                    }
                }

                // 2. Link or create PembimbingLapangan record
                $instansiId = $pendaftaran->instansi_id ?? $surat->pendaftaran->instansi_id;
                $pembimbingLapangan = PembimbingLapangan::firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'instansi_id' => $instansiId,
                        'nama' => $namaPL,
                    ]
                );

                if ($pembimbingLapangan->nama !== $namaPL || ($instansiId && !$pembimbingLapangan->instansi_id)) {
                    $pembimbingLapangan->update([
                        'nama' => $namaPL,
                        'instansi_id' => $instansiId ?: $pembimbingLapangan->instansi_id,
                    ]);
                }

                // 3. Update Pendaftaran
                $pendaftaran->update([
                    'status' => 'diterima_instansi',
                    'pembimbing_lapangan_id' => $pembimbingLapangan->id,
                ]);

                // 4. Update SuratPengantar
                $surat->update([
                    'confirmation_status' => 'accepted',
                    'confirmed_at' => now(),
                    'pl_nama' => $namaPL,
                    'pl_email' => $email,
                    'pl_telepon' => $telepon ?: null,
                    'catatan_instansi' => $catatan ?: null,
                ]);

                // 5. Send credential email to PL (if new account or requested)
                $emailSent = false;
                $emailError = null;

                if ($isNewAccount && $tempPassword) {
                    $periodeKP = null;
                    if ($pendaftaran->tanggal_mulai && $pendaftaran->tanggal_selesai) {
                        $periodeKP = $pendaftaran->tanggal_mulai->translatedFormat('d M Y') . ' s.d ' .
                            $pendaftaran->tanggal_selesai->translatedFormat('d M Y');
                    }

                    try {
                        Mail::to($email)->send(new KredensialPembimbingLapangan(
                            nama: $namaPL,
                            email: $email,
                            tempPassword: $tempPassword,
                            namaInstansi: $surat->nama_instansi,
                            namaMahasiswa: $pendaftaran->mahasiswa->name ?? 'Mahasiswa',
                            nimMahasiswa: $pendaftaran->mahasiswa->nim ?? '-',
                            periodeKP: $periodeKP,
                            isReset: false
                        ));
                        $emailSent = true;
                        Log::info("Kredensial PL berhasil dikirim ke {$email} untuk pendaftaran #{$pendaftaran->id}");
                    } catch (\Throwable $e) {
                        $emailError = $e->getMessage();
                        Log::error("Gagal mengirim kredensial PL ke {$email}: " . $e->getMessage());
                    }
                }

                // 6. Notify Mahasiswa (high priority)
                Notifikasi::create([
                    'user_id' => $pendaftaran->mahasiswa_id,
                    'judul' => 'Konfirmasi Instansi: DITERIMA',
                    'pesan' => "{$surat->nama_instansi} telah mengonfirmasi penerimaan Kerja Praktik Anda. Pembimbing Lapangan yang ditunjuk: {$namaPL}.",
                    'tipe' => 'sukses',
                    'priority' => 'high',
                    'link' => '/mahasiswa/status-pengajuan',
                ]);

                return [
                    'success' => true,
                    'decision' => 'accepted',
                    'message' => 'Konfirmasi penerimaan berhasil disimpan. Akun pembimbing lapangan telah dibuatkan dan siap digunakan.',
                    'email_sent' => $emailSent,
                    'email_error' => $emailError,
                    'is_new_account' => $isNewAccount,
                    'temp_password' => $tempPassword,
                ];
            } else {
                // Instansi REJECTED
                $alasan = trim($data['catatan'] ?? 'Instansi belum dapat menerima pelaksanaan Kerja Praktik.');

                $surat->update([
                    'confirmation_status' => 'rejected',
                    'confirmed_at' => now(),
                    'catatan_instansi' => $alasan,
                ]);

                $pendaftaran->update([
                    'status' => 'ditolak_instansi',
                    'catatan_tu' => "Ditolak oleh instansi: {$alasan}",
                ]);

                // Notify Mahasiswa
                Notifikasi::create([
                    'user_id' => $pendaftaran->mahasiswa_id,
                    'judul' => 'Konfirmasi Instansi: DITOLAK',
                    'pesan' => "{$surat->nama_instansi} belum dapat menerima permohonan KP Anda. Alasan: {$alasan}. Silakan konsultasikan dengan Koordinator KP / TU untuk tindak lanjut.",
                    'tipe' => 'peringatan',
                    'priority' => 'high',
                    'link' => '/mahasiswa/status-pengajuan',
                ]);

                return [
                    'success' => true,
                    'decision' => 'rejected',
                    'message' => 'Konfirmasi penolakan telah tercatat pada sistem. Terima kasih atas konfirmasi Anda.',
                ];
            }
        });
    }

    /**
     * Reset password for an existing Pembimbing Lapangan user and send email.
     */
    public function resetPassword(User $user): array
    {
        if ($user->role !== 'instansi') {
            throw new \InvalidArgumentException('Hanya akun pembimbing lapangan yang dapat direset melalui fitur ini.');
        }

        $newPassword = Str::random(10);
        $user->update([
            'password' => Hash::make($newPassword),
            'must_change_password' => true,
            'has_set_password' => false,
        ]);

        $pl = $user->pembimbingLapangan()->with('instansi')->first();
        $pendaftaran = Pendaftaran::where('pembimbing_lapangan_id', $pl?->id)
            ->with(['mahasiswa'])
            ->latest()
            ->first();

        $namaInstansi = $pl?->instansi?->nama ?? 'Instansi Mitra';
        $namaMahasiswa = $pendaftaran?->mahasiswa?->name ?? 'Mahasiswa Kerja Praktik';
        $nimMahasiswa = $pendaftaran?->mahasiswa?->nim ?? '-';

        $emailSent = false;
        $emailError = null;

        try {
            Mail::to($user->email)->send(new KredensialPembimbingLapangan(
                nama: $user->name,
                email: $user->email,
                tempPassword: $newPassword,
                namaInstansi: $namaInstansi,
                namaMahasiswa: $namaMahasiswa,
                nimMahasiswa: $nimMahasiswa,
                isReset: true
            ));
            $emailSent = true;
        } catch (\Throwable $e) {
            $emailError = $e->getMessage();
            Log::error("Gagal mengirim reset password PL ke {$user->email}: " . $e->getMessage());
        }

        return [
            'temp_password' => $newPassword,
            'email_sent' => $emailSent,
            'email_error' => $emailError,
        ];
    }
}
