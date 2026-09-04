<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class InstansiPendaftaranController extends Controller
{
    /**
     * Menampilkan daftar pendaftar mahasiswa ke instansi ini.
     */
    public function index()
    {
        $user = Auth::user();
        $instansi = $user->instansi;

        if (!$instansi) {
            return Inertia::render('Instansi/Pendaftaran', [
                'pendaftarans' => []
            ])->with('error', 'Profil instansi belum diatur.');
        }

        // Ambil pendaftaran yang memilih instansi ini, urutkan yang berstatus 'surat_terbit' di atas
        $pendaftarans = Pendaftaran::with(['mahasiswa', 'suratPengantar'])
            ->where('instansi_id', $instansi->id)
            ->whereIn('status', ['surat_terbit', 'diterima_instansi', 'ditolak_instansi', 'verifikasi_surat_balasan', 'plotting_dosen', 'aktif', 'selesai'])
            ->orderByRaw("FIELD(status, 'surat_terbit') DESC")
            ->latest()
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'mahasiswa' => $p->mahasiswa,
                    'surat_pengantar' => $p->suratPengantar,
                    'status' => $p->status,
                    'tanggal_pengajuan' => $p->created_at->format('Y-m-d')
                ];
            });

        return Inertia::render('Instansi/Pendaftaran', [
            'pendaftarans' => $pendaftarans
        ]);
    }

    /**
     * Menyimpan keputusan instansi (menerima / menolak pendaftar).
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:diterima_instansi,ditolak_instansi',
        ]);

        $user = Auth::user();
        $instansi = $user->instansi;

        if (!$instansi) {
            return back()->with('error', 'Profil instansi belum diatur.');
        }

        $pendaftaran = Pendaftaran::where('instansi_id', $instansi->id)->findOrFail($id);
        
        $pendaftaran->update([
            'status' => $request->status
        ]);

        $message = $request->status === 'diterima_instansi' 
            ? 'Pendaftaran mahasiswa berhasil diterima.' 
            : 'Pendaftaran mahasiswa ditolak.';

        return back()->with('success', $message);
    }
}
