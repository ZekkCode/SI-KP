<?php

namespace App\Http\Controllers;

use App\Models\SuratPengantar;
use App\Services\PembimbingLapanganService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KonfirmasiInstansiController extends Controller
{
    /**
     * Show the public confirmation page for an institution.
     */
    public function show(string $token): Response
    {
        $surat = SuratPengantar::where('confirmation_token', $token)
            ->with([
                'pendaftaran.mahasiswa.programStudi',
                'pendaftaran.instansi',
                'pendaftaran.dosenPembimbing',
            ])
            ->firstOrFail();

        $pendaftaran = $surat->pendaftaran;
        $mahasiswa = $pendaftaran?->mahasiswa;

        return Inertia::render('KonfirmasiInstansi', [
            'token' => $token,
            'surat' => [
                'id' => $surat->id,
                'nomor_surat' => $surat->nomor_surat ?? 'B/3284/UN46.3.4/KP.01.06/' . date('Y'),
                'tanggal_terbit' => $surat->tanggal_terbit?->translatedFormat('d F Y'),
                'confirmation_status' => $surat->confirmation_status,
                'confirmed_at' => $surat->confirmed_at?->translatedFormat('d F Y, H:i') . ' WIB',
                'pl_nama' => $surat->pl_nama,
                'pl_email' => $surat->pl_email,
                'pl_telepon' => $surat->pl_telepon,
                'catatan_instansi' => $surat->catatan_instansi,
            ],
            'instansi' => [
                'nama' => $surat->nama_instansi ?: ($pendaftaran?->instansi?->nama ?? 'Instansi Mitra'),
                'alamat' => $surat->alamat_instansi ?: ($pendaftaran?->instansi?->alamat ?? '-'),
            ],
            'mahasiswa' => [
                'nama' => $mahasiswa?->name ?? 'Mahasiswa',
                'nim' => $mahasiswa?->nim ?? '-',
                'prodi' => $mahasiswa?->programStudi?->nama ?? 'Teknik Informatika',
                'angkatan' => $mahasiswa?->angkatan ?? '-',
                'dosen_pembimbing' => $pendaftaran?->dosenPembimbing?->name ?? 'Belum ditentukan',
            ],
            'periode' => [
                'mulai' => $surat->tanggal_mulai?->translatedFormat('d F Y') ?? $pendaftaran?->tanggal_mulai?->translatedFormat('d F Y'),
                'selesai' => $surat->tanggal_selesai?->translatedFormat('d F Y') ?? $pendaftaran?->tanggal_selesai?->translatedFormat('d F Y'),
            ],
        ]);
    }

    /**
     * Process the institution's confirmation (accept or reject).
     */
    public function confirm(Request $request, string $token, PembimbingLapanganService $service): RedirectResponse
    {
        $surat = SuratPengantar::where('confirmation_token', $token)->firstOrFail();

        if ($surat->confirmation_status !== 'pending') {
            return back()->with('error', 'Konfirmasi surat pengantar ini sudah pernah diproses sebelumnya.');
        }

        $validated = $request->validate([
            'keputusan' => ['required', 'in:terima,tolak'],
            'pl_nama' => ['required_if:keputusan,terima', 'nullable', 'string', 'max:255'],
            'pl_email' => ['required_if:keputusan,terima', 'nullable', 'email', 'max:255'],
            'pl_telepon' => ['nullable', 'string', 'max:30'],
            'catatan' => [
                'nullable',
                'string',
                'max:1000',
                $request->keputusan === 'tolak' ? 'required' : 'nullable',
            ],
        ], [
            'keputusan.required' => 'Silakan pilih keputusan penerimaan.',
            'pl_nama.required_if' => 'Nama Pembimbing Lapangan wajib diisi jika permohonan diterima.',
            'pl_email.required_if' => 'Email Pembimbing Lapangan wajib diisi untuk pengiriman akun login.',
            'pl_email.email' => 'Format email Pembimbing Lapangan tidak valid.',
            'catatan.required' => 'Mohon sertakan alasan penolakan agar mahasiswa dapat mengetahuinya.',
        ]);

        $result = $service->konfirmasiPenerimaan($surat, $validated);

        if (!$result['success']) {
            return back()->with('error', $result['message']);
        }

        if ($result['decision'] === 'accepted') {
            $msg = 'Terima kasih! Konfirmasi penerimaan berhasil disimpan.';
            if (!empty($result['email_sent'])) {
                $msg .= ' Kredensial akun telah dikirim ke email pembimbing lapangan.';
            } elseif (!empty($result['temp_password'])) {
                $msg .= " Akun pembimbing lapangan berhasil dibuat dengan kata sandi sementara: {$result['temp_password']}";
            }
            return back()->with('success', $msg);
        }

        return back()->with('success', 'Konfirmasi penolakan permohonan Kerja Praktik telah tersimpan.');
    }
}
