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

        $pendaftaran = Pendaftaran::findOrFail($request->pendaftaran_id);
        $pendaftaran->pembimbing_lapangan_id = $request->pembimbing_lapangan_id;
        $pendaftaran->save();

        return back()->with('success', "Berhasil menetapkan Pembimbing Lapangan.");
    }
}
