<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\PembimbingLapangan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class ProdiPembagianPLController extends Controller
{
    public function index()
    {
        $mahasiswaList = Pendaftaran::with(['mahasiswa.programStudi', 'instansi', 'pembimbingLapangan'])
            ->whereIn('status', ['aktif', 'diterima_instansi', 'verifikasi_surat_balasan'])
            ->latest()
            ->get();

        $pembimbingLapangans = PembimbingLapangan::with('instansi')->get();

        return Inertia::render('Prodi/PembagianPL/Index', [
            'mahasiswaList' => $mahasiswaList,
            'pembimbingLapangans' => $pembimbingLapangans
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'pendaftaran_id' => 'required|exists:pendaftarans,id',
            'pembimbing_lapangan_id' => 'required|exists:pembimbing_lapangans,id',
        ]);

        $pendaftaran = Pendaftaran::with(['mahasiswa', 'instansi'])->findOrFail($request->pendaftaran_id);
        $pendaftaran->pembimbing_lapangan_id = $request->pembimbing_lapangan_id;
        $pendaftaran->save();

        $pl = PembimbingLapangan::with('user')->find($request->pembimbing_lapangan_id);
        $mhs = $pendaftaran->mahasiswa;
        $instansiNama = $pendaftaran->instansi?->nama ?? 'Instansi Mitra';

        // 1. Notifikasi ke Mahasiswa
        if ($mhs) {
            \App\Models\Notifikasi::create([
                'user_id' => $mhs->id,
                'judul' => 'Pembimbing Lapangan Ditetapkan',
                'pesan' => "Program Studi telah menetapkan {$pl?->nama} sebagai Pembimbing Lapangan Anda di {$instansiNama}.",
                'tipe' => 'sukses',
                'priority' => 'high',
                'link' => '/mahasiswa/dashboard',
            ]);
        }

        // 2. Notifikasi ke User Pembimbing Lapangan
        if ($pl?->user_id) {
            \App\Models\Notifikasi::create([
                'user_id' => $pl->user_id,
                'judul' => 'Penugasan Bimbingan Mahasiswa',
                'pesan' => "Anda telah ditugaskan sebagai Pembimbing Lapangan untuk mahasiswa {$mhs?->name} ({$mhs?->nim}).",
                'tipe' => 'info',
                'priority' => 'high',
                'link' => '/instansi/dashboard',
            ]);
        }

        // 3. Notifikasi ke Dosen Pembimbing
        $dosbing = $pendaftaran->ensureDosenPembimbing();
        if ($dosbing) {
            \App\Models\Notifikasi::create([
                'user_id' => $dosbing->id,
                'judul' => 'Pembimbing Lapangan Mahasiswa Terhubung',
                'pesan' => "Mahasiswa bimbingan {$mhs?->name} telah dipasangkan dengan Pembimbing Lapangan {$pl?->nama}.",
                'tipe' => 'info',
                'priority' => 'normal',
                'link' => '/dosen/monitoring',
            ]);
        }

        return back()->with('success', "Berhasil menetapkan Pembimbing Lapangan.");
    }
}
