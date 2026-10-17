<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Logbook;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class DosenLogbookController extends Controller
{
    /**
     * Menampilkan daftar logbook mahasiswa bimbingan.
     */
    public function index()
    {
        $dosenId = Auth::id();

        // Ambil logbook yang berelasi dengan pendaftaran di mana dosen pembimbingnya adalah dosen yang login
        $logbooks = Logbook::with(['pendaftaran.mahasiswa'])
            ->whereHas('pendaftaran', function ($query) use ($dosenId) {
                $query->where('dosen_pembimbing_id', $dosenId);
            })
            ->orderByRaw("FIELD(status_dosen, 'menunggu') DESC") // Prioritaskan yang 'menunggu' di atas
            ->orderBy('tanggal', 'desc') // Lalu urutkan berdasarkan tanggal terbaru
            ->get();

        return Inertia::render('Dosen/Logbook', [
            'logbooks' => $logbooks
        ]);
    }

    /**
     * Menampilkan halaman review khusus logbook.
     */
    public function review($id)
    {
        $logbook = Logbook::with(['pendaftaran.mahasiswa'])
            ->whereHas('pendaftaran', function ($query) {
                $query->where('dosen_pembimbing_id', Auth::id());
            })->findOrFail($id);

        return Inertia::render('Dosen/Logbook/Review', [
            'logbook' => $logbook
        ]);
    }

    /**
     * Menyimpan hasil validasi logbook dari dosen.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'status_dosen' => 'required|in:menunggu,disetujui,revisi',
            'catatan_dosen' => 'nullable|string',
        ]);

        $logbook = Logbook::with('pendaftaran')->whereHas('pendaftaran', function ($query) {
            $query->where('dosen_pembimbing_id', Auth::id());
        })->findOrFail($id);

        $logbook->update([
            'status_dosen' => $request->status_dosen,
            'catatan_dosen' => $request->catatan_dosen,
            'divalidasi_oleh' => Auth::id(),
            'divalidasi_pada' => now(),
        ]);

        if ($logbook->pendaftaran?->mahasiswa_id) {
            $isApproved = $request->status_dosen === 'disetujui';
            \App\Models\Notifikasi::create([
                'user_id' => $logbook->pendaftaran->mahasiswa_id,
                'judul' => 'Logbook: ' . ($isApproved ? 'DISETUJUI DOSEN' : 'PERLU REVISI DOSEN'),
                'pesan' => "Dosen Pembimbing telah memvalidasi kegiatan tanggal " . $logbook->tanggal->format('d/m/Y') . ($request->catatan_dosen ? ": {$request->catatan_dosen}" : "."),
                'tipe' => $isApproved ? 'sukses' : 'peringatan',
                'priority' => 'high',
                'link' => '/mahasiswa/logbook',
            ]);
        }

        return back()->with('success', 'Validasi logbook berhasil disimpan.');
    }
}
