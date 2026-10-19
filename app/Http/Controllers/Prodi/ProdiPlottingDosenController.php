<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class ProdiPlottingDosenController extends Controller
{
    /**
     * Tampilkan antrean mahasiswa yang butuh pembimbing dan daftar dosen.
     */
    public function index()
    {
        // Ambil pendaftaran yang statusnya 'plotting_dosen' atau 'disetujui_tu' tapi belum punya dosen
        $mahasiswaQueue = Pendaftaran::with(['mahasiswa.programStudi', 'instansi', 'proposals'])
            ->whereNull('dosen_pembimbing_id')
            ->whereIn('status', ['plotting_dosen', 'disetujui_tu'])
            ->latest()
            ->get();

        // Ambil daftar dosen beserta kuota dan jumlah bimbingan aktif secara optimal (2 queries)
        $dosenList = User::where('role', 'dosen')
            ->with('kuotaDosens')
            ->withCount(['pendaftaransDosen as bimbingan_aktif' => function ($query) {
                $query->whereIn('status', ['aktif', 'selesai', 'diterima_instansi', 'verifikasi_surat_balasan', 'plotting_dosen']);
            }])
            ->orderBy('name')
            ->get()
            ->map(function ($dosen) {
                $kuota = $dosen->kuotaDosens->first();
                return [
                    'id' => $dosen->id,
                    'name' => $dosen->name,
                    'nip' => $dosen->nip,
                    'keahlian' => $kuota ? $kuota->keahlian : 'Umum',
                    'kuota_max' => $kuota ? $kuota->kuota_max : 10,
                    'bimbingan_aktif' => (int) $dosen->bimbingan_aktif,
                ];
            });

        $plottedHistory = Pendaftaran::with(['mahasiswa.dosenWali', 'dosenPembimbing'])
            ->whereNotNull('dosen_pembimbing_id')
            ->latest()
            ->get();

        return Inertia::render('Prodi/SupervisorPlotting', [
            'mahasiswaQueue' => $mahasiswaQueue,
            'dosenList' => $dosenList,
            'plottedHistory' => $plottedHistory
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'pendaftaran_id' => 'required|exists:pendaftarans,id',
            'dosen_pembimbing_id' => 'required|exists:users,id',
        ]);

        $pendaftaran = Pendaftaran::with('mahasiswa')->findOrFail($request->pendaftaran_id);
        $pendaftaran->dosen_pembimbing_id = $request->dosen_pembimbing_id;
        
        // Ubah status menjadi aktif jika sebelumnya masih dalam tahap plotting
        if ($pendaftaran->status === 'plotting_dosen' || $pendaftaran->status === 'verifikasi_surat_balasan') {
            $pendaftaran->status = 'aktif';
        }
        
        $pendaftaran->save();

        $dosen = User::find($request->dosen_pembimbing_id);

        if ($pendaftaran->mahasiswa) {
            \App\Models\Notifikasi::create([
                'user_id' => $pendaftaran->mahasiswa_id,
                'judul' => 'Dosen Pembimbing Ditetapkan',
                'pesan' => "Program Studi telah menetapkan {$dosen?->name} sebagai Dosen Pembimbing KP Anda.",
                'tipe' => 'sukses',
                'priority' => 'high',
                'link' => '/mahasiswa/dashboard',
            ]);
        }

        if ($dosen) {
            \App\Models\Notifikasi::create([
                'user_id' => $dosen->id,
                'judul' => 'Penugasan Bimbingan KP Baru',
                'pesan' => "Anda telah ditetapkan oleh Prodi sebagai Dosen Pembimbing KP untuk mahasiswa {$pendaftaran->mahasiswa?->name} ({$pendaftaran->mahasiswa?->nim}).",
                'tipe' => 'info',
                'priority' => 'high',
                'link' => '/dosen/dashboard',
            ]);
        }

        return back()->with('success', 'Dosen pembimbing berhasil ditetapkan dan status mahasiswa menjadi Aktif.');
    }
}
