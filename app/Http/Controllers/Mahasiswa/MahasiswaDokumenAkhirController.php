<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\DokumenAkhir;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class MahasiswaDokumenAkhirController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $pendaftaran = Pendaftaran::where('mahasiswa_id', $user->id)
            ->whereIn('status', ['aktif', 'selesai'])
            ->latest()
            ->first();

        $dokumen = [];
        if ($pendaftaran) {
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
            ->whereIn('status', ['aktif', 'selesai'])
            ->latest()
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

        // Opsional: Jika ingin mereplace yang sudah ada, kita bisa menggunakan firstOrNew atau langsung insert baru
        // Kita menggunakan create agar menyimpan history (opsional) atau update_or_create.
        // Berdasarkan request, insert ke tabel. 
        DokumenAkhir::create([
            'pendaftaran_id' => $pendaftaran->id,
            'jenis' => 'laporan_akhir',
            'nama_file' => $file->getClientOriginalName(),
            'path' => $path,
            'uploaded_at' => now(),
        ]);

        return back()->with('success', 'Laporan akhir berhasil diunggah.');
    }
}
