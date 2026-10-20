<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Support\Facades\Storage;
use App\Models\BeritaAcara;

class MahasiswaBeritaAcaraController extends Controller
{
    public function index(Request $request): Response
    {
        $pendaftaran = Pendaftaran::where(
            'mahasiswa_id',
            $request->user()->id
        )
        ->with([
            'beritaAcara',
            'instansi',
            'dosenPembimbing',
            'nilaiAkhir',
            'sidang.dosenPenguji',
            'proposals',
        ])
        ->latest('id')
        ->first();

        if ($pendaftaran && empty($pendaftaran->dosen_pembimbing_id)) {
            $pendaftaran->ensureDosenPembimbing();
            $pendaftaran->load('dosenPembimbing');
        }

        $dosenSudahMenilai = $pendaftaran?->nilaiAkhir?->nilai_pembimbing !== null;
        $isApproved = $pendaftaran?->beritaAcara && $pendaftaran->beritaAcara->status === 'disetujui';

        return Inertia::render(
            'Mahasiswa/BeritaAcara',
            [
                'pendaftaran' => $pendaftaran,
                'beritaAcara' => $pendaftaran?->beritaAcara,
                'status' => $pendaftaran?->status,
                'dosenSudahMenilai' => $dosenSudahMenilai,
                'isApproved' => $isApproved,
                'nilaiAkhir' => $pendaftaran?->nilaiAkhir,
            ]
        );
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'file_berita_acara' => 'required|mimes:pdf|max:5120',
        ]);

        $pendaftaran = Pendaftaran::where('mahasiswa_id', $request->user()->id)->latest('id')->firstOrFail();

        $beritaAcara = BeritaAcara::firstOrNew(['pendaftaran_id' => $pendaftaran->id]);

        if ($beritaAcara->path_file) {
            Storage::disk('public')->delete($beritaAcara->path_file);
        }

        $path = $request->file('file_berita_acara')->store('berita_acara', 'public');

        $beritaAcara->path_file = $path;
        $beritaAcara->status = 'menunggu'; // FIX: Sesuaikan dengan ENUM di tabel berita_acaras
        $beritaAcara->save();

        \App\Models\Notifikasi::create([
            'user_id' => $request->user()->id,
            'judul' => 'Berita Acara Berhasil Diunggah',
            'pesan' => 'File Berita Acara berhasil diunggah dan sedang menunggu validasi.',
            'tipe' => 'sukses',
            'priority' => 'normal',
            'link' => '/mahasiswa/berita-acara',
        ]);

        $dosbing = $pendaftaran->ensureDosenPembimbing();
        if ($dosbing) {
            \App\Models\Notifikasi::create([
                'user_id' => $dosbing->id,
                'judul' => 'Validasi Berita Acara KP',
                'pesan' => "Mahasiswa bimbingan {$request->user()->name} ({$request->user()->nim}) telah mengunggah Berita Acara untuk divalidasi.",
                'tipe' => 'info',
                'priority' => 'high',
                'link' => '/dosen/monitoring',
            ]);
        }

        $prodiUsers = \App\Models\User::where('role', 'prodi')->get();
        foreach ($prodiUsers as $prodi) {
            \App\Models\Notifikasi::create([
                'user_id' => $prodi->id,
                'judul' => 'Berita Acara Baru Diunggah',
                'pesan' => "Mahasiswa {$request->user()->name} ({$request->user()->nim}) telah mengunggah Berita Acara untuk divalidasi.",
                'tipe' => 'info',
                'priority' => 'high',
                'link' => '/prodi/berita-acara',
            ]);
        }

        return redirect()->back()->with('success', 'Berita Acara berhasil diunggah dan menunggu validasi.');
    }

    /**
     * Menampilkan lembar resmi Berita Acara Sidang KP untuk dicetak / simpan PDF.
     */
    public function cetak(Request $request, $id)
    {
        $pendaftaran = Pendaftaran::with([
            'mahasiswa',
            'instansi',
            'dosenPembimbing',
            'sidang.dosenPenguji',
            'proposals',
            'nilaiAkhir',
        ])->findOrFail($id);

        abort_unless($pendaftaran->mahasiswa_id == auth()->id(), 403, 'Akses tidak sah.');

        return view('cetak.berita-acara', [
            'pendaftaran' => $pendaftaran,
            'tanggal_hari' => now()->translatedFormat('l, d F Y'),
        ]);
    }
}