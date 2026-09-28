<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use App\Models\Logbook;
use App\Models\Notifikasi;
use App\Models\Pendaftaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class InstansiLogbookController extends Controller
{
    /**
     * Helper to resolve instansi and PL for current user.
     */
    protected function getInstansiAndPL(): array
    {
        $user = Auth::user();
        $pl = $user->pembimbingLapangan;
        $instansi = $user->instansi ?? $pl?->instansi;

        return [$user, $pl, $instansi];
    }

    /**
     * Menampilkan daftar entri logbook khusus untuk instansi (pembimbing lapangan).
     */
    public function index(): Response
    {
        [$user, $pl, $instansi] = $this->getInstansiAndPL();

        if (!$pl && !$instansi) {
            return Inertia::render('Instansi/Logbook', [
                'logbooks' => [],
                'error' => 'Profil pembimbing lapangan atau instansi belum terhubung ke sistem.',
            ]);
        }

        $plId = $pl?->id;
        $instansiId = $instansi?->id;

        $logbooks = Logbook::with(['pendaftaran.mahasiswa.programStudi'])
            ->whereHas('pendaftaran', function ($query) use ($plId, $instansiId) {
                $query->where(function ($sub) use ($plId, $instansiId) {
                    if ($plId) {
                        $sub->where('pembimbing_lapangan_id', $plId);
                    }
                    if ($instansiId) {
                        $sub->orWhere('instansi_id', $instansiId);
                    }
                });
            })
            ->orderBy('tanggal', 'desc')
            ->get();

        return Inertia::render('Instansi/Logbook', [
            'logbooks' => $logbooks,
        ]);
    }

    /**
     * Tampilkan halaman validasi spesifik
     */
    public function edit($id)
    {
        [$user, $pl, $instansi] = $this->getInstansiAndPL();

        if (!$pl && !$instansi) {
            return redirect()->route('instansi.logbook')->with('error', 'Akses ditolak.');
        }

        $plId = $pl?->id;
        $instansiId = $instansi?->id;

        $logbook = Logbook::with(['pendaftaran.mahasiswa.programStudi'])
            ->whereHas('pendaftaran', function ($query) use ($plId, $instansiId) {
                $query->where(function ($sub) use ($plId, $instansiId) {
                    if ($plId) {
                        $sub->where('pembimbing_lapangan_id', $plId);
                    }
                    if ($instansiId) {
                        $sub->orWhere('instansi_id', $instansiId);
                    }
                });
            })
            ->findOrFail($id);

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
            ],
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

        [$user, $pl, $instansi] = $this->getInstansiAndPL();

        if (!$pl && !$instansi) {
            return back()->with('error', 'Akses ditolak: Akun belum dikaitkan dengan Pembimbing Lapangan.');
        }

        $plId = $pl?->id;
        $instansiId = $instansi?->id;

        $logbook = Logbook::with('pendaftaran.mahasiswa')
            ->whereHas('pendaftaran', function ($query) use ($plId, $instansiId) {
                $query->where(function ($sub) use ($plId, $instansiId) {
                    if ($plId) {
                        $sub->where('pembimbing_lapangan_id', $plId);
                    }
                    if ($instansiId) {
                        $sub->orWhere('instansi_id', $instansiId);
                    }
                });
            })
            ->findOrFail($id);

        $logbook->update([
            'status_instansi' => $request->status_instansi,
            'catatan_instansi' => $request->catatan_instansi,
        ]);

        // Notifikasi ke mahasiswa
        if ($logbook->pendaftaran?->mahasiswa_id) {
            Notifikasi::create([
                'user_id' => $logbook->pendaftaran->mahasiswa_id,
                'judul' => 'Logbook: ' . ($request->status_instansi === 'disetujui' ? 'DISETUJUI MITRA' : 'PERLU REVISI MITRA'),
                'pesan' => "Pembimbing Lapangan telah memvalidasi kegiatan tanggal " . $logbook->tanggal->format('d/m/Y') . ($request->catatan_instansi ? ": {$request->catatan_instansi}" : "."),
                'tipe' => $request->status_instansi === 'disetujui' ? 'sukses' : 'peringatan',
                'priority' => 'high',
                'link' => '/mahasiswa/logbook',
            ]);
        }

        $message = $request->status_instansi === 'disetujui'
            ? 'Kegiatan harian berhasil disetujui.'
            : 'Kegiatan harian dikembalikan untuk revisi.';

        return redirect()->route('instansi.logbook')->with('success', $message);
    }
}
