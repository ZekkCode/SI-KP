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
     * Menampilkan daftar mahasiswa yang telah dinilai Dosen Pembimbing untuk divalidasi Berita Acara.
     */
    public function index()
    {
        // Ambil mahasiswa yang dosen pembimbingnya sudah selesai menilai (nilai_pembimbing !== null) atau sudah memiliki berita acara
        $pendaftarans = Pendaftaran::with(['mahasiswa', 'instansi', 'nilaiAkhir', 'beritaAcara', 'dosenPembimbing'])
            ->where(function($query) {
                $query->whereHas('nilaiAkhir', function($q) {
                    $q->whereNotNull('nilai_pembimbing');
                })->orWhereHas('beritaAcara');
            })
            ->latest()
            ->get()
            ->map(function ($p) {
                $isApproved = $p->beritaAcara && $p->beritaAcara->status === 'disetujui';
                return [
                    'id' => $p->id,
                    'mahasiswa' => $p->mahasiswa,
                    'instansi' => $p->instansi,
                    'dosen_pembimbing' => $p->dosenPembimbing ? [
                        'name' => $p->dosenPembimbing->name,
                        'nip' => $p->dosenPembimbing->nip,
                    ] : null,
                    'nilai_pembimbing' => $p->nilaiAkhir?->nilai_pembimbing,
                    'nilai_instansi' => $p->nilaiAkhir?->nilai_instansi,
                    'nilai_total' => $p->nilaiAkhir?->nilai_total,
                    'nilai_huruf' => $p->nilaiAkhir?->nilai_huruf,
                    'berita_acara' => $p->beritaAcara,
                    'is_approved' => $isApproved,
                    'status_validasi' => $isApproved ? 'disetujui' : 'menunggu',
                    'url_file' => $p->beritaAcara && $p->beritaAcara->path_file && !str_starts_with($p->beritaAcara->path_file, 'generated/') 
                        ? asset('storage/' . $p->beritaAcara->path_file) 
                        : null,
                    'status_kp' => $p->status,
                ];
            });

        return Inertia::render('Prodi/BeritaAcara/Index', [
            'pendaftarans' => $pendaftarans
        ]);
    }

    /**
     * Pratinjau cetak Berita Acara resmi (Form KP-5) sesuai panduan KP.
     */
    public function preview($id)
    {
        $pendaftaran = Pendaftaran::with([
            'mahasiswa',
            'instansi',
            'dosenPembimbing',
            'sidang.dosenPenguji',
            'proposals',
            'nilaiAkhir',
            'beritaAcara',
        ])->findOrFail($id);

        return view('cetak.berita-acara', [
            'pendaftaran' => $pendaftaran,
            'tanggal_hari' => now()->translatedFormat('l, d F Y'),
        ]);
    }

    /**
     * Memproses penerbitan Berita Acara dengan catatan.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'catatan' => 'nullable|string'
        ]);

        $pendaftaran = Pendaftaran::findOrFail($id);

        DB::beginTransaction();
        try {
            // Update atau Create berita_acara dengan status disetujui
            $existingBa = BeritaAcara::where('pendaftaran_id', $pendaftaran->id)->first();
            $pathFile = $existingBa?->path_file ?: ('generated/berita_acara/ba_' . $pendaftaran->id . '.pdf');

            $beritaAcara = BeritaAcara::updateOrCreate(
                ['pendaftaran_id' => $pendaftaran->id],
                [
                    'path_file' => $pathFile,
                    'status' => 'disetujui',
                    'catatan' => $request->catatan ?: 'Telah divalidasi dan disetujui oleh Koordinator Program Studi (Auto-generate Form KP-5).',
                    'divalidasi_oleh' => Auth::id(),
                    'divalidasi_pada' => now(),
                ]
            );

            // Ubah status Pendaftaran menjadi selesai
            $pendaftaran->update([
                'status' => 'selesai'
            ]);

            \App\Models\Notifikasi::create([
                'user_id' => $pendaftaran->mahasiswa_id,
                'judul' => 'Berita Acara Resmi Disetujui Prodi',
                'pesan' => 'Berita Acara Kerja Praktik resmi Anda telah divalidasi dan disetujui oleh Program Studi. Seluruh alur KP Anda telah selesai.',
                'tipe' => 'sukses',
                'priority' => 'high',
                'link' => '/mahasiswa/berita-acara',
            ]);

            $dosbing = $pendaftaran->ensureDosenPembimbing();
            if ($dosbing) {
                \App\Models\Notifikasi::create([
                    'user_id' => $dosbing->id,
                    'judul' => 'Berita Acara Mahasiswa Bimbingan Disetujui',
                    'pesan' => "Berita Acara untuk mahasiswa bimbingan {$pendaftaran->mahasiswa?->name} ({$pendaftaran->mahasiswa?->nim}) telah disetujui Prodi.",
                    'tipe' => 'sukses',
                    'priority' => 'normal',
                    'link' => '/dosen/monitoring',
                ]);
            }

            DB::commit();
            return back()->with('success', 'Berita Acara berhasil divalidasi & diterbitkan, status KP telah selesai.');
        } catch (\Throwable $e) {
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
            $existingBa = BeritaAcara::where('pendaftaran_id', $pendaftaran->id)->first();
            $pathFile = $existingBa?->path_file ?: ('generated/berita_acara/ba_' . $pendaftaran->id . '.pdf');

            $beritaAcara = BeritaAcara::updateOrCreate(
                ['pendaftaran_id' => $pendaftaran->id],
                [
                    'path_file' => $pathFile,
                    'status' => 'disetujui',
                    'catatan' => 'Telah divalidasi dan disetujui oleh Koordinator Program Studi (Auto-generate Form KP-5).',
                    'divalidasi_oleh' => Auth::id(),
                    'divalidasi_pada' => now(),
                ]
            );

            $pendaftaran->update([
                'status' => 'selesai'
            ]);

            \App\Models\Notifikasi::create([
                'user_id' => $pendaftaran->mahasiswa_id,
                'judul' => 'Berita Acara Resmi Disetujui Prodi',
                'pesan' => 'Berita Acara Kerja Praktik resmi Anda telah divalidasi dan disetujui oleh Program Studi. Seluruh alur KP Anda telah selesai.',
                'tipe' => 'sukses',
                'priority' => 'high',
                'link' => '/mahasiswa/berita-acara',
            ]);

            $dosbing = $pendaftaran->ensureDosenPembimbing();
            if ($dosbing) {
                \App\Models\Notifikasi::create([
                    'user_id' => $dosbing->id,
                    'judul' => 'Berita Acara Mahasiswa Bimbingan Disetujui',
                    'pesan' => "Berita Acara untuk mahasiswa bimbingan {$pendaftaran->mahasiswa?->name} ({$pendaftaran->mahasiswa?->nim}) telah disetujui Prodi.",
                    'tipe' => 'sukses',
                    'priority' => 'normal',
                    'link' => '/dosen/monitoring',
                ]);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Berita Acara resmi (Form KP-5) berhasil divalidasi dan disetujui.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menyetujui berita acara: ' . $e->getMessage()]);
        }
    }
}
