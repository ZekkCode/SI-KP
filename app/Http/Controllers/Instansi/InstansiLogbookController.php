<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use App\Models\Logbook;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class InstansiLogbookController extends Controller
{
    /**
     * Menampilkan daftar entri logbook khusus untuk instansi (pembimbing lapangan).
     */
    public function index()
    {
        $user = auth()->user()->load('pembimbingLapangan');
        
        if (!$user->pembimbingLapangan) {
            return Inertia::render('Instansi/Monitoring/Index', ['logbooks' => []]);
        }

        $logbooks = \App\Models\Logbook::with(['pendaftaran.mahasiswa'])
            ->whereHas('pendaftaran', function ($query) use ($user) {
                $query->where('pembimbing_lapangan_id', $user->pembimbingLapangan->id);
            })
            ->orderBy('tanggal', 'desc')
            ->get();

        return Inertia::render('Instansi/Monitoring/Index', ['logbooks' => $logbooks]);
    }

    /**
     * Tampilkan halaman validasi spesifik
     */
    public function edit($id)
    {
        $user = Auth::user();
        $pembimbing = $user->pembimbingLapangan;

        if (!$pembimbing) {
            return redirect()->route('instansi.logbook')->with('error', 'Akses ditolak.');
        }

        $logbook = Logbook::with(['pendaftaran.mahasiswa'])->whereHas('pendaftaran', function ($query) use ($pembimbing) {
            $query->where('pembimbing_lapangan_id', $pembimbing->id);
        })->findOrFail($id);

        return Inertia::render('Instansi/Monitoring/Edit', [
            'logbook' => [
                'id' => $logbook->id,
                'mahasiswa' => $logbook->pendaftaran->mahasiswa,
                'tanggal' => $logbook->tanggal->format('Y-m-d'),
                'jam_mulai' => $logbook->jam_mulai,
                'jam_selesai' => $logbook->jam_selesai,
                'deskripsi' => $logbook->deskripsi,
                'path_foto' => $logbook->path_foto,
                'status_instansi' => $logbook->status_instansi,
                'catatan_instansi' => $logbook->catatan_instansi,
            ]
        ]);
    }

    /**
     * Memproses validasi logbook dari pembimbing lapangan.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'status_instansi' => 'required|in:disetujui,revisi',
            'catatan_instansi' => 'nullable|string',
        ]);

        $user = Auth::user();
        $pembimbing = $user->pembimbingLapangan;

        if (!$pembimbing) {
            return back()->with('error', 'Akses ditolak: Akun belum dikaitkan dengan Pembimbing Lapangan.');
        }

        $logbook = Logbook::whereHas('pendaftaran', function ($query) use ($pembimbing) {
            $query->where('pembimbing_lapangan_id', $pembimbing->id);
        })->findOrFail($id);

        $logbook->update([
            'status_instansi' => $request->status_instansi,
            'catatan_instansi' => $request->catatan_instansi,
        ]);

        $message = $request->status_instansi === 'disetujui'
            ? 'Kegiatan harian berhasil disetujui.'
            : 'Kegiatan harian dikembalikan untuk revisi.';

        return redirect()->route('instansi.logbook')->with('success', $message);
    }
}
