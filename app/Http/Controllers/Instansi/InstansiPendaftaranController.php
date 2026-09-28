<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Pendaftaran;
use App\Models\Proposal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InstansiPendaftaranController extends Controller
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
     * Menampilkan daftar pendaftar mahasiswa ke instansi ini.
     */
    public function index(): Response
    {
        [$user, $pl, $instansi] = $this->getInstansiAndPL();

        if (!$instansi && !$pl) {
            return Inertia::render('Instansi/Pendaftaran', [
                'pendaftarans' => [],
                'error' => 'Profil instansi atau pembimbing lapangan belum terhubung ke sistem.',
            ]);
        }

        $instansiId = $instansi?->id;
        $plId = $pl?->id;

        // Ambil pendaftaran yang memilih instansi ini atau dibimbing oleh PL ini
        $pendaftarans = Pendaftaran::with([
                'mahasiswa.programStudi',
                'suratPengantar',
                'proposals' => fn($q) => $q->latest(),
            ])
            ->where(function ($q) use ($instansiId, $plId) {
                if ($plId) {
                    $q->where('pembimbing_lapangan_id', $plId);
                }
                if ($instansiId) {
                    $q->orWhere('instansi_id', $instansiId);
                }
            })
            ->whereIn('status', [
                'surat_terbit',
                'diterima_instansi',
                'ditolak_instansi',
                'verifikasi_surat_balasan',
                'plotting_dosen',
                'aktif',
                'selesai',
            ])
            ->orderByRaw("FIELD(status, 'surat_terbit', 'diterima_instansi') DESC")
            ->latest()
            ->get()
            ->map(function ($p) {
                $latestProposal = $p->proposals->first();

                return [
                    'id' => $p->id,
                    'mahasiswa' => [
                        'id' => $p->mahasiswa->id,
                        'name' => $p->mahasiswa->name,
                        'nim' => $p->mahasiswa->nim,
                        'program_studi' => $p->mahasiswa->programStudi ? [
                            'nama' => $p->mahasiswa->programStudi->nama,
                        ] : null,
                        'no_telepon' => $p->mahasiswa->no_telepon,
                        'email' => $p->mahasiswa->email,
                    ],
                    'surat_pengantar' => $p->suratPengantar ? [
                        'id' => $p->suratPengantar->id,
                        'nomor_surat' => $p->suratPengantar->nomor_surat,
                        'path_file' => $p->suratPengantar->path_file,
                        'tanggal_terbit' => $p->suratPengantar->tanggal_terbit?->format('d M Y'),
                    ] : null,
                    'proposal' => $latestProposal ? [
                        'id' => $latestProposal->id,
                        'judul' => $latestProposal->judul,
                        'abstrak' => $latestProposal->abstrak,
                        'status' => $latestProposal->status,
                        'versi' => $latestProposal->versi,
                        'path_file' => $latestProposal->path_file,
                        'submitted_at' => $latestProposal->submitted_at?->format('d M Y, H:i'),
                    ] : null,
                    'status' => $p->status,
                    'tanggal_pengajuan' => $p->created_at->format('d M Y'),
                    'tanggal_mulai' => $p->tanggal_mulai?->format('d M Y'),
                    'tanggal_selesai' => $p->tanggal_selesai?->format('d M Y'),
                ];
            });

        return Inertia::render('Instansi/Pendaftaran', [
            'pendaftarans' => $pendaftarans,
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

        [$user, $pl, $instansi] = $this->getInstansiAndPL();

        if (!$instansi && !$pl) {
            return back()->with('error', 'Profil instansi atau pembimbing lapangan belum terhubung.');
        }

        $instansiId = $instansi?->id;
        $plId = $pl?->id;

        $pendaftaran = Pendaftaran::where(function ($q) use ($instansiId, $plId) {
            if ($plId) {
                $q->where('pembimbing_lapangan_id', $plId);
            }
            if ($instansiId) {
                $q->orWhere('instansi_id', $instansiId);
            }
        })->findOrFail($id);

        $updateData = ['status' => $request->status];
        if ($request->status === 'diterima_instansi' && $pl && !$pendaftaran->pembimbing_lapangan_id) {
            $updateData['pembimbing_lapangan_id'] = $pl->id;
        }

        $pendaftaran->update($updateData);

        // Notifikasi ke Mahasiswa
        $namaInstansi = $instansi?->nama ?? 'Instansi Mitra';
        Notifikasi::create([
            'user_id' => $pendaftaran->mahasiswa_id,
            'judul' => $request->status === 'diterima_instansi'
                ? 'Pendaftaran Diterima Instansi'
                : 'Pendaftaran Ditolak Instansi',
            'pesan' => $request->status === 'diterima_instansi'
                ? "{$namaInstansi} telah menerima pendaftaran Kerja Praktik Anda. Silakan persiapkan proposal dan dokumen balasan."
                : "{$namaInstansi} belum dapat menerima pendaftaran Kerja Praktik Anda.",
            'tipe' => $request->status === 'diterima_instansi' ? 'sukses' : 'peringatan',
            'priority' => 'high',
            'link' => '/mahasiswa/status-pengajuan',
        ]);

        $message = $request->status === 'diterima_instansi'
            ? 'Pendaftaran mahasiswa berhasil diterima.'
            : 'Pendaftaran mahasiswa ditolak.';

        return back()->with('success', $message);
    }

    /**
     * Download proposal file for Instansi / Pembimbing Lapangan.
     */
    public function downloadProposal($id): StreamedResponse
    {
        [$user, $pl, $instansi] = $this->getInstansiAndPL();

        $proposal = Proposal::with('pendaftaran')->findOrFail($id);
        $pendaftaran = $proposal->pendaftaran;

        $isAuthorized = false;
        if ($pl && $pendaftaran->pembimbing_lapangan_id === $pl->id) {
            $isAuthorized = true;
        }
        if ($instansi && $pendaftaran->instansi_id === $instansi->id) {
            $isAuthorized = true;
        }

        abort_unless($isAuthorized, 403, 'Anda tidak memiliki hak akses untuk mengunduh proposal ini.');

        if (!Storage::disk('public')->exists($proposal->path_file)) {
            abort(404, 'File proposal tidak ditemukan di penyimpanan server.');
        }

        return Storage::disk('public')->download(
            $proposal->path_file,
            basename($proposal->path_file)
        );
    }
}
