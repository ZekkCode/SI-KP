<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Logbook;
use App\Models\Pendaftaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaLogbookController extends Controller
{
    /**
     * Menampilkan daftar logbook mahasiswa.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $pendaftaran = Pendaftaran::where('mahasiswa_id', $user->id)
            ->with(['dosenPembimbing', 'pembimbingLapangan.instansi'])
            ->latest()
            ->first();

        $logbooks = [];
        $dosenPembimbing = null;

        if ($pendaftaran) {
            $dosenPembimbing = $pendaftaran->dosenPembimbing
                ? [
                    'name' => $pendaftaran->dosenPembimbing->name,
                    'nip' => $pendaftaran->dosenPembimbing->nip,
                ]
                : null;

            $logbooks = Logbook::where('pendaftaran_id', $pendaftaran->id)
                ->orderByDesc('tanggal')
                ->get()
                ->map(fn (Logbook $lb) => [
                    'id' => $lb->id,
                    'tanggal' => $lb->tanggal->format('Y-m-d'),
                    'jam_mulai' => $lb->jam_mulai,
                    'jam_selesai' => $lb->jam_selesai,
                    'deskripsi' => $lb->deskripsi,
                    'path_foto' => $lb->path_foto,
                    'status_dosen' => $lb->status_dosen,
                    'status_instansi' => $lb->status_instansi,
                    'catatan_dosen' => $lb->catatan_dosen,
                    'catatan_instansi' => $lb->catatan_instansi,
                    'created_at' => $lb->created_at->format('d M Y, H:i'),
                ])
                ->toArray();
        }

        return Inertia::render('Mahasiswa/Logbook', [
            'logbooks' => $logbooks,
            'dosenPembimbing' => $dosenPembimbing,
            'pembimbingLapangan' => $pendaftaran ? $pendaftaran->pembimbingLapangan : null,
            'hasPendaftaran' => $pendaftaran !== null,
            'pendaftaranId' => $pendaftaran?->id,
        ]);
    }

    /**
     * Menampilkan halaman tambah logbook.
     */
    public function create(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $user = $request->user();
        $pendaftaran = Pendaftaran::where('mahasiswa_id', $user->id)->latest()->first();

        if (!$pendaftaran) {
            return redirect()->route('mahasiswa.logbook')->with('error', 'Anda harus memiliki pendaftaran KP aktif.');
        }

        return Inertia::render('Mahasiswa/Logbook/Create');
    }

    /**
     * Menyimpan entri logbook baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'tanggal' => ['required', 'date'],
            'jam_mulai' => ['nullable', 'date_format:H:i'],
            'jam_selesai' => ['nullable', 'date_format:H:i', 'after:jam_mulai'],
            'deskripsi' => ['required', 'string', 'max:5000'],
            'foto' => ['nullable', 'image', 'max:2048'],
        ], [
            'tanggal.required' => 'Tanggal wajib diisi.',
            'deskripsi.required' => 'Deskripsi kegiatan wajib diisi.',
            'deskripsi.max' => 'Deskripsi maksimal 5000 karakter.',
            'jam_selesai.after' => 'Jam selesai harus setelah jam mulai.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.max' => 'Ukuran foto maksimal 2MB.',
        ]);

        $pendaftaran = Pendaftaran::where('mahasiswa_id', $user->id)
            ->latest()
            ->first();

        if (!$pendaftaran) {
            return back()->with('error', 'Pendaftaran KP tidak ditemukan.');
        }

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('logbook', 'public');
        }

        Logbook::create([
            'pendaftaran_id' => $pendaftaran->id,
            'tanggal' => $validated['tanggal'],
            'jam_mulai' => $validated['jam_mulai'] ?? null,
            'jam_selesai' => $validated['jam_selesai'] ?? null,
            'deskripsi' => $validated['deskripsi'],
            'path_foto' => $fotoPath,
            'status_dosen' => 'menunggu',
            'status_instansi' => 'menunggu',
        ]);

        return redirect()->route('mahasiswa.logbook')->with(
            'success',
            'Logbook berhasil ditambahkan.'
        );
    }

    /**
     * Menampilkan form edit logbook.
     */
    public function edit(Request $request, Logbook $logbook): Response|\Illuminate\Http\RedirectResponse
    {
        abort_unless(
            $logbook->pendaftaran->mahasiswa_id == $request->user()->id,
            403
        );

        if ($logbook->status_dosen === 'disetujui' || $logbook->status_instansi === 'disetujui') {
            return back()->with('error', 'Logbook yang sudah disetujui tidak dapat diedit.');
        }

        return Inertia::render('Mahasiswa/Logbook/Edit', [
            'logbook' => [
                'id' => $logbook->id,
                'tanggal' => $logbook->tanggal->format('Y-m-d'),
                'jam_mulai' => $logbook->jam_mulai,
                'jam_selesai' => $logbook->jam_selesai,
                'deskripsi' => $logbook->deskripsi,
                'path_foto' => $logbook->path_foto,
            ]
        ]);
    }

    /**
     * Mengupdate entri logbook yang sudah ada.
     * Hanya bisa diedit jika status masih 'menunggu' atau 'revisi'.
     */
    public function update(Request $request, Logbook $logbook): RedirectResponse
    {
        // Pastikan logbook milik mahasiswa yang sedang login
        abort_unless(
            $logbook->pendaftaran->mahasiswa_id == $request->user()->id,
            403
        );

        // Tidak boleh edit logbook yang sudah disetujui (oleh Dosen ATAU Instansi)
        if ($logbook->status_dosen === 'disetujui' || $logbook->status_instansi === 'disetujui') {
            return back()->with(
                'error',
                'Logbook yang sudah disetujui tidak dapat diedit.'
            );
        }

        $validated = $request->validate([
            'tanggal' => ['required', 'date'],
            'jam_mulai' => ['nullable', 'date_format:H:i'],
            'jam_selesai' => ['nullable', 'date_format:H:i', 'after:jam_mulai'],
            'deskripsi' => ['required', 'string', 'max:5000'],
            'foto' => ['nullable', 'image', 'max:2048'],
        ], [
            'tanggal.required' => 'Tanggal wajib diisi.',
            'deskripsi.required' => 'Deskripsi kegiatan wajib diisi.',
            'deskripsi.max' => 'Deskripsi maksimal 5000 karakter.',
            'jam_selesai.after' => 'Jam selesai harus setelah jam mulai.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.max' => 'Ukuran foto maksimal 2MB.',
        ]);

        $fotoPath = $logbook->path_foto;
        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada
            if ($fotoPath) {
                Storage::disk('public')->delete($fotoPath);
            }
            $fotoPath = $request->file('foto')->store('logbook', 'public');
        }

        $logbook->update([
            'tanggal' => $validated['tanggal'],
            'jam_mulai' => $validated['jam_mulai'] ?? null,
            'jam_selesai' => $validated['jam_selesai'] ?? null,
            'deskripsi' => $validated['deskripsi'],
            'path_foto' => $fotoPath,
            'status_dosen' => 'menunggu', // Reset ke menunggu setelah edit
            'status_instansi' => 'menunggu',
        ]);

        return back()->with(
            'success',
            'Logbook berhasil diperbarui.'
        );
    }

    /**
     * Menghapus entri logbook.
     * Hanya bisa dihapus jika status masih 'menunggu' atau 'revisi'.
     */
    public function destroy(Request $request, Logbook $logbook): RedirectResponse
    {
        abort_unless(
            $logbook->pendaftaran->mahasiswa_id == $request->user()->id,
            403
        );

        if ($logbook->status_dosen === 'disetujui' || $logbook->status_instansi === 'disetujui') {
            return back()->with(
                'error',
                'Logbook yang sudah disetujui tidak dapat dihapus.'
            );
        }

        if ($logbook->path_foto) {
            Storage::disk('public')->delete($logbook->path_foto);
        }

        $logbook->delete();

        return back()->with(
            'success',
            'Logbook berhasil dihapus.'
        );
    }
}
