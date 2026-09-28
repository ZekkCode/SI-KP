<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Pendaftaran;
use App\Models\Sidang;
use App\Models\User;
use App\Services\SidangEligibilityService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaSidangController extends Controller
{
    protected SidangEligibilityService $eligibilityService;

    public function __construct(SidangEligibilityService $eligibilityService)
    {
        $this->eligibilityService = $eligibilityService;
    }

    /**
     * Menampilkan status dan form pendaftaran sidang KP mahasiswa.
     */
    public function index(): Response|RedirectResponse
    {
        $mahasiswaId = Auth::id();

        // Cari pendaftaran aktif mahasiswa
        $pendaftaran = Pendaftaran::with([
            'mahasiswa',
            'instansi',
            'dosenPembimbing',
            'sidang.dosenPenguji',
            'dokumenAkhirs',
            'nilaiAkhir',
            'nilais',
            'logbooks',
        ])
        ->where('mahasiswa_id', $mahasiswaId)
        ->latest()
        ->first();

        if (!$pendaftaran) {
            return redirect()->route('mahasiswa.pendaftaran')
                ->with('error', 'Anda belum memiliki pendaftaran Kerja Praktik aktif.');
        }

        // Periksa kelayakan sidang via Service
        $eligibility = $this->eligibilityService->checkEligibility($pendaftaran);

        return Inertia::render('Mahasiswa/Sidang', [
            'pendaftaran' => [
                'id' => $pendaftaran->id,
                'status' => $pendaftaran->status,
                'instansi' => $pendaftaran->instansi ? [
                    'nama' => $pendaftaran->instansi->nama,
                    'kota' => $pendaftaran->instansi->kota,
                ] : null,
                'dosen_pembimbing' => $pendaftaran->dosenPembimbing ? [
                    'name' => $pendaftaran->dosenPembimbing->name,
                    'nip' => $pendaftaran->dosenPembimbing->nip,
                ] : null,
            ],
            'sidang' => $pendaftaran->sidang ? [
                'id' => $pendaftaran->sidang->id,
                'status' => $pendaftaran->sidang->status,
                'tanggal_sidang' => $pendaftaran->sidang->tanggal_sidang?->format('Y-m-d H:i:s'),
                'tanggal_formatted' => $pendaftaran->sidang->tanggal_sidang?->translatedFormat('l, d F Y - H:i') . ' WIB',
                'ruangan' => $pendaftaran->sidang->ruangan,
                'catatan' => $pendaftaran->sidang->catatan,
                'created_at' => $pendaftaran->sidang->created_at?->format('d M Y H:i'),
                'dosen_penguji' => $pendaftaran->sidang->dosenPenguji ? [
                    'name' => $pendaftaran->sidang->dosenPenguji->name,
                    'nip' => $pendaftaran->sidang->dosenPenguji->nip,
                ] : null,
            ] : null,
            'eligibility' => $eligibility,
        ]);
    }

    /**
     * Memproses pengajuan sidang KP oleh mahasiswa.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'catatan' => 'nullable|string|max:500',
        ]);

        $mahasiswaId = Auth::id();
        $pendaftaran = Pendaftaran::where('mahasiswa_id', $mahasiswaId)
            ->latest()
            ->firstOrFail();

        // 1. Cek apakah sudah ada pengajuan yang aktif
        if ($pendaftaran->sidang && in_array($pendaftaran->sidang->status, ['diajukan', 'dijadwalkan'])) {
            return back()->with('error', 'Anda telah memiliki pengajuan sidang yang sedang diproses atau dijadwalkan.');
        }

        // 2. Validasi ketat kelayakan sidang
        $eligibility = $this->eligibilityService->checkEligibility($pendaftaran);

        if (!$eligibility['eligible']) {
            return back()->withErrors([
                'error' => 'Syarat pengajuan sidang belum terpenuhi: ' . implode(' ', $eligibility['missing']),
            ]);
        }

        // 3. Simpan atau perbarui pengajuan Sidang
        $sidang = Sidang::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran->id],
            [
                'status' => 'diajukan',
                'catatan' => $request->catatan,
                'tanggal_sidang' => null,
                'ruangan' => null,
                'dosen_penguji_id' => $pendaftaran->dosen_pembimbing_id, // Default dosen penguji adalah dosen pembimbing
            ]
        );

        // Update status pendaftaran menjadi 'seminar'
        $pendaftaran->update(['status' => 'seminar']);

        // 4. Kirim notifikasi
        // Ke Mahasiswa
        Notifikasi::create([
            'user_id' => $mahasiswaId,
            'judul' => 'Pengajuan Sidang Berhasil Dikirim',
            'pesan' => 'Pengajuan jadwal sidang Kerja Praktik Anda telah berhasil dikirim ke Program Studi. Mohon menunggu penetapan jadwal.',
            'tipe' => 'info',
            'link' => '/mahasiswa/sidang',
        ]);

        // Ke Dosen Pembimbing
        if ($pendaftaran->dosen_pembimbing_id) {
            Notifikasi::create([
                'user_id' => $pendaftaran->dosen_pembimbing_id,
                'judul' => 'Mahasiswa Bimbingan Mengajukan Sidang',
                'pesan' => "Mahasiswa {$pendaftaran->mahasiswa->name} ({$pendaftaran->mahasiswa->nim}) telah melengkapi syarat dan mengajukan sidang KP.",
                'tipe' => 'info',
                'link' => '/dosen/monitoring',
            ]);
        }

        // Ke Admin / Koordinator Prodi
        $prodiUsers = User::where('role', 'prodi')->get();
        foreach ($prodiUsers as $prodi) {
            Notifikasi::create([
                'user_id' => $prodi->id,
                'judul' => 'Pengajuan Sidang KP Baru',
                'pesan' => "Mahasiswa {$pendaftaran->mahasiswa->name} ({$pendaftaran->mahasiswa->nim}) mengajukan sidang KP. Silakan jadwalkan tanggal dan ruangan.",
                'tipe' => 'info',
                'link' => '/prodi/sidang',
            ]);
        }

        return redirect()->route('mahasiswa.sidang')
            ->with('success', 'Pengajuan sidang berhasil dikirim. Jadwal akan ditetapkan oleh Koordinator Prodi.');
    }
}
