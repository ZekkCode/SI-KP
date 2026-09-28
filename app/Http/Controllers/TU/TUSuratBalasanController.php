<?php

namespace App\Http\Controllers\TU;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class TUSuratBalasanController extends Controller
{
    /**
     * Menampilkan daftar mahasiswa yang menunggu surat balasan.
     */
    public function index(): Response
    {
        $pendaftarans = Pendaftaran::with([
                'mahasiswa',
                'instansi',
                'suratPengantar'
            ])
            ->whereIn('status', [
                'surat_terbit',
                'diterima_instansi',
                'ditolak_instansi'
            ])
            ->latest()
            ->get();

        return Inertia::render('TU/SuratBalasan/Index', [
            'pendaftarans' => $pendaftarans,
        ]);
    }

    /**
     * Detail surat balasan.
     */
    public function show(Pendaftaran $pendaftaran): Response
    {
        $pendaftaran->load([
            'mahasiswa',
            'instansi',
            'suratPengantar',
        ]);

        return Inertia::render('TU/SuratBalasan/Show', [
            'pendaftaran' => $pendaftaran,
        ]);
    }

    /**
     * Approve surat balasan dari instansi.
     */
    public function approve(Pendaftaran $pendaftaran): RedirectResponse
    {
        $mahasiswa = $pendaftaran->mahasiswa;
        $dosenWaliId = $mahasiswa?->dosen_wali_id;

        if (! $dosenWaliId && $mahasiswa?->nim) {
            $nipWali = \App\Models\MasterMahasiswa::where('nim', $mahasiswa->nim)->value('nip_dosen_wali');
            if ($nipWali) {
                $dosen = \App\Models\User::where('nip', $nipWali)->where('role', 'dosen')->first();
                if ($dosen) {
                    $mahasiswa->update(['dosen_wali_id' => $dosen->id]);
                    $dosenWaliId = $dosen->id;
                }
            }
        }

        $dosenPembimbingId = $pendaftaran->dosen_pembimbing_id ?: $dosenWaliId;

        $pendaftaran->update([
            'status' => 'diterima_instansi',
            'dosen_pembimbing_id' => $dosenPembimbingId,
        ]);

        if ($mahasiswa) {
            \App\Models\Notifikasi::create([
                'user_id' => $mahasiswa->id,
                'judul' => 'Surat Balasan Diverifikasi',
                'pesan' => 'Surat balasan dari instansi telah diverifikasi oleh TU. Silakan unggah proposal KP Anda.',
                'tipe' => 'sukses',
                'priority' => 'high',
                'link' => '/mahasiswa/proposal',
            ]);
        }

        return back()->with(
            'success',
            'Surat balasan berhasil diverifikasi.'
        );
    }

    /**
     * Minta revisi kepada mahasiswa.
     */
    public function revisi(
        Request $request,
        Pendaftaran $pendaftaran
    ): RedirectResponse {

        $request->validate([
            'catatan_tu' => [
                'required',
                'string',
                'max:1000'
            ],
        ]);

        $pendaftaran->update([
            'status' => 'perlu_perbaikan',
            'catatan_tu' => $request->catatan_tu,
        ]);

        if ($mahasiswa = $pendaftaran->mahasiswa) {
            \App\Models\Notifikasi::create([
                'user_id' => $mahasiswa->id,
                'judul' => 'Surat Balasan Perlu Perbaikan',
                'pesan' => 'Berkas surat balasan memerlukan perbaikan: ' . $request->catatan_tu,
                'tipe' => 'peringatan',
                'priority' => 'high',
                'link' => '/mahasiswa/surat-balasan',
            ]);
        }

        return back()->with(
            'success',
            'Permintaan revisi berhasil dikirim.'
        );
    }
}