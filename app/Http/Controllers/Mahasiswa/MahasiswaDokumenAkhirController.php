<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\DokumenAkhir;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

use App\Models\Notifikasi;

class MahasiswaDokumenAkhirController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $pendaftaran = Pendaftaran::where('mahasiswa_id', $user->id)
            ->whereNotIn('status', ['draft'])
            ->latest('id')
            ->first();

        $dokumen = [];
        if ($pendaftaran) {
            $pendaftaran->ensureDosenPembimbing();
            $dokumen = DokumenAkhir::where('pendaftaran_id', $pendaftaran->id)
                ->where('jenis', 'laporan_akhir')
                ->latest('uploaded_at')
                ->get();
        }

        return Inertia::render('Mahasiswa/DokumenAkhir/Index', [
            'dokumen' => $dokumen,
            'pendaftaran' => $pendaftaran,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $pendaftaran = Pendaftaran::where('mahasiswa_id', $user->id)
            ->whereNotIn('status', ['draft'])
            ->latest('id')
            ->first();

        if (!$pendaftaran) {
            return back()->with('error', 'Pendaftaran KP tidak ditemukan.');
        }

        $request->validate([
            'file' => 'required|file|mimes:pdf|max:5120', // Max 5MB
        ], [
            'file.required' => 'File laporan akhir wajib diunggah.',
            'file.mimes' => 'File laporan akhir harus berupa PDF.',
            'file.max' => 'Ukuran file maksimal 5MB.',
        ]);

        $file = $request->file('file');
        $filename = 'Laporan_Akhir_' . $user->nim . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('dokumen/laporan_akhir', $filename, 'public');

        DokumenAkhir::create([
            'pendaftaran_id' => $pendaftaran->id,
            'jenis' => 'laporan_akhir',
            'nama_file' => $file->getClientOriginalName(),
            'path' => $path,
            'uploaded_at' => now(),
        ]);

        Notifikasi::create([
            'user_id' => $user->id,
            'judul' => 'Laporan Akhir Berhasil Diunggah',
            'pesan' => 'Laporan akhir Kerja Praktik Anda telah berhasil diunggah.',
            'tipe' => 'sukses',
            'priority' => 'normal',
            'link' => '/mahasiswa/dokumen-akhir',
        ]);

        $dosbing = $pendaftaran->ensureDosenPembimbing();
        if ($dosbing) {
            Notifikasi::create([
                'user_id' => $dosbing->id,
                'judul' => 'Laporan Akhir KP Diunggah',
                'pesan' => "Mahasiswa bimbingan {$user->name} ({$user->nim}) telah mengunggah Laporan Akhir Kerja Praktik.",
                'tipe' => 'info',
                'priority' => 'high',
                'link' => '/dosen/monitoring',
            ]);
        }

        $prodiUsers = \App\Models\User::where('role', 'prodi')->get();
        foreach ($prodiUsers as $prodi) {
            Notifikasi::create([
                'user_id' => $prodi->id,
                'judul' => 'Laporan Akhir KP Diunggah',
                'pesan' => "Mahasiswa {$user->name} ({$user->nim}) telah mengunggah Laporan Akhir Kerja Praktik.",
                'tipe' => 'info',
                'priority' => 'normal',
                'link' => '/prodi/sidang',
            ]);
        }

        return back()->with('success', 'Laporan akhir berhasil diunggah.');
    }
}
