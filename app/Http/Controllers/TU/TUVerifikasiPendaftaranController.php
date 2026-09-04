<?php

namespace App\Http\Controllers\TU;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TUVerifikasiPendaftaranController extends Controller
{
    public function index(): Response
    {
        $pendaftarans = Pendaftaran::with([
            'mahasiswa',
            'instansi',
            'dokumenPendaftarans',
        ])
        // ->whereIn('status', ['diajukan', 'menunggu_verifikasi', 'pending'])
        ->where('status', '!=', 'draft') // Menangkap semua status kecuali draft
        ->latest()
        ->get();

        return Inertia::render('TU/VerifikasiPendaftaran/Index', [
            'pendaftarans' => $pendaftarans,
        ]);
    }

    public function approve(Pendaftaran $pendaftaran)
    {
        DB::beginTransaction();
        try {
            $mahasiswa = $pendaftaran->mahasiswa;
            $dosenWaliId = $mahasiswa?->dosen_wali_id;

            // Jika pendaftaran belum memiliki dosen pembimbing tetapi mahasiswa punya dosen wali, pasangkan otomatis
            $dosenPembimbingId = $pendaftaran->dosen_pembimbing_id ?: $dosenWaliId;

            // Jika sudah ada dosen pembimbing (dari dosen wali), status lanjut ke 'disetujui_tu', jika belum maka 'plotting_dosen'
            $status = $dosenPembimbingId ? 'disetujui_tu' : 'plotting_dosen';

            $pendaftaran->update([
                'status' => $status,
                'dosen_pembimbing_id' => $dosenPembimbingId,
                'diverifikasi_oleh' => auth()->id(),
                'diverifikasi_pada' => now(),
            ]);
            
            DB::commit();
            $pesan = $dosenPembimbingId 
                ? 'Pendaftaran berhasil disetujui. Dosen pembimbing otomatis ditetapkan sesuai Dosen Wali.'
                : 'Pendaftaran berhasil disetujui dan masuk antrean pembagian Dosbing.';

            return back()->with('success', $pesan);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memproses persetujuan: ' . $e->getMessage());
        }
    }

    public function reject(Request $request, Pendaftaran $pendaftaran)
    {
        $request->validate([
            'catatan_tu' => 'required' 
        ]);

        DB::beginTransaction();
        try {
            $pendaftaran->update([
                'status' => 'perlu_perbaikan',
                'catatan_tu' => $request->catatan_tu,
            ]);
            
            DB::commit();
            return back()->with(
                'success',
                'Pengajuan dikembalikan.'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memproses penolakan: ' . $e->getMessage());
        }
    }
}
