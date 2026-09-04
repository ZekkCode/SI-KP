<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\BeritaAcara;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class ProdiBeritaAcaraController extends Controller
{
    /**
     * Menampilkan daftar antrean pembuatan berita acara.
     */
    public function index()
    {
        // Ambil mahasiswa yang status kelulusannya "lulus"
        $pendaftarans = Pendaftaran::with(['mahasiswa', 'instansi', 'nilaiAkhir', 'beritaAcara'])
            ->whereHas('beritaAcara', function($q) {
                $q->whereNotNull('path_file')
                  ->where('status', 'menunggu');
            })
            ->latest()
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'mahasiswa' => $p->mahasiswa,
                    'instansi' => $p->instansi,
                    'nilai_total' => $p->nilaiAkhir?->nilai_total,
                    'nilai_huruf' => $p->nilaiAkhir?->nilai_huruf,
                    'berita_acara' => $p->beritaAcara,
                    'url_file' => $p->beritaAcara && $p->beritaAcara->path_file ? asset('storage/' . $p->beritaAcara->path_file) : null,
                    'status_kp' => $p->status,
                ];
            });

        return Inertia::render('Prodi/BeritaAcara/Index', [
            'pendaftarans' => $pendaftarans
        ]);
    }

    /**
     * Memproses penerbitan Berita Acara.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'catatan' => 'nullable|string'
        ]);

        $pendaftaran = Pendaftaran::whereHas('nilaiAkhir', function($q) {
            $q->where('status', 'lulus');
        })->findOrFail($id);

        DB::beginTransaction();
        try {
            // Update atau Create berita_acara dengan status disetujui
            $beritaAcara = BeritaAcara::updateOrCreate(
                ['pendaftaran_id' => $pendaftaran->id],
                [
                    'path_file' => 'generated/berita_acara/ba_' . $pendaftaran->id . '.pdf', // Dummy path untuk saat ini
                    'status' => 'disetujui',
                    'catatan' => $request->catatan,
                    'divalidasi_oleh' => Auth::id(),
                    'divalidasi_pada' => now(),
                ]
            );

            // Ubah status Pendaftaran menjadi selesai, menandakan alur magang telah tamat sepenuhnya.
            $pendaftaran->update([
                'status' => 'selesai'
            ]);

            DB::commit();
            return back()->with('success', 'Berita Acara berhasil diterbitkan dan status pendaftaran menjadi selesai.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memvalidasi berita acara: ' . $e->getMessage()]);
        }
    }

    /**
     * Menyetujui Berita Acara secara langsung
     */
    public function approve($id): RedirectResponse
    {
        $pendaftaran = Pendaftaran::findOrFail($id);

        DB::beginTransaction();
        try {
            $beritaAcara = BeritaAcara::updateOrCreate(
                ['pendaftaran_id' => $pendaftaran->id],
                [
                    'status' => 'disetujui',
                    'catatan' => 'Telah divalidasi dan disetujui oleh Prodi.',
                    'divalidasi_oleh' => Auth::id(),
                    'divalidasi_pada' => now(),
                ]
            );

            $pendaftaran->update([
                'status' => 'selesai'
            ]);

            DB::commit();
            return redirect()->back()->with('success', 'Berita Acara berhasil divalidasi dan disetujui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menyetujui berita acara: ' . $e->getMessage()]);
        }
    }
}
