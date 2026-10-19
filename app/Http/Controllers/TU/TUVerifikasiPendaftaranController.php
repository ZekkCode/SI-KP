<?php

namespace App\Http\Controllers\TU;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TUVerifikasiPendaftaranController extends Controller
{
    public function index(): Response
    {
        $pendaftarans = Pendaftaran::with([
            'mahasiswa.programStudi',
            'mahasiswa.dosenWali',
            'dosenPembimbing',
            'instansi',
            'dokumenPendaftarans',
        ])
        ->where('status', '!=', 'draft') // Menangkap semua status kecuali draft
        ->latest()
        ->get();

        return Inertia::render('TU/VerifikasiPendaftaran/Index', [
            'pendaftarans' => $pendaftarans,
        ]);
    }

    public function approve(Pendaftaran $pendaftaran)
    {
        DB::beginTransaction();
        try {
            $mahasiswa = $pendaftaran->mahasiswa;
            $dosbing = $pendaftaran->ensureDosenPembimbing();
            $dosenPembimbingId = $dosbing?->id;

            // Jika ada dosen pembimbing (dari dosen wali), langsung ke 'disetujui_tu', fallback 'plotting_dosen' jika belum ada
            $status = $dosenPembimbingId ? 'disetujui_tu' : 'plotting_dosen';

            $pendaftaran->update([
                'status' => $status,
                'dosen_pembimbing_id' => $dosenPembimbingId,
                'diverifikasi_oleh' => auth()->id(),
                'diverifikasi_pada' => now(),
            ]);

            // Kirim notifikasi prioritas tinggi kepada mahasiswa
            if ($mahasiswa) {
                $dosenName = $dosbing?->name ?? 'Dosen Pembimbing';
                \App\Models\Notifikasi::create([
                    'user_id' => $mahasiswa->id,
                    'judul' => 'Pendaftaran KP Disetujui',
                    'pesan' => $dosenPembimbingId 
                        ? "Pendaftaran Kerja Praktik Anda telah disetujui TU. Dosen pembimbing otomatis ditetapkan: {$dosenName}."
                        : 'Pendaftaran Kerja Praktik Anda telah disetujui TU dan dalam antrean pembagian dosen pembimbing.',
                    'tipe' => 'sukses',
                    'priority' => 'high',
                    'link' => '/mahasiswa/status-pengajuan',
                ]);
            }

            // Kirim notifikasi ke dosen pembimbing
            if ($dosbing) {
                \App\Models\Notifikasi::create([
                    'user_id' => $dosbing->id,
                    'judul' => 'Mahasiswa Bimbingan Baru Disetujui',
                    'pesan' => "Mahasiswa {$mahasiswa?->name} ({$mahasiswa?->nim}) telah disetujui TU dan Anda ditetapkan sebagai Dosen Pembimbing KP.",
                    'tipe' => 'info',
                    'priority' => 'high',
                    'link' => '/dosen/dashboard',
                ]);
            }
            
            DB::commit();
            $pesan = $dosenPembimbingId 
                ? 'Pendaftaran berhasil disetujui. Dosen pembimbing otomatis ditetapkan sesuai Dosen Wali.'
                : 'Pendaftaran berhasil disetujui dan masuk antrean pembagian Dosbing.';

            return back()->with('success', $pesan);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memproses persetujuan: ' . $e->getMessage());
        }
    }

    public function reject(Request $request, Pendaftaran $pendaftaran)
    {
        $request->validate([
            'catatan_tu' => 'required' 
        ]);

        DB::beginTransaction();
        try {
            $pendaftaran->update([
                'status' => 'perlu_perbaikan',
                'catatan_tu' => $request->catatan_tu,
            ]);

            // Kirim notifikasi prioritas tinggi revisi kepada mahasiswa
            if ($mahasiswa = $pendaftaran->mahasiswa) {
                \App\Models\Notifikasi::create([
                    'user_id' => $mahasiswa->id,
                    'judul' => 'Berkas Pendaftaran Perlu Perbaikan',
                    'pesan' => 'Pendaftaran Kerja Praktik memerlukan perbaikan: ' . $request->catatan_tu,
                    'tipe' => 'peringatan',
                    'priority' => 'high',
                    'link' => '/mahasiswa/pendaftaran',
                ]);
            }
            
            DB::commit();
            return back()->with(
                'success',
                'Pengajuan dikembalikan.'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memproses penolakan: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Pendaftaran $pendaftaran)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:diajukan,disetujui_tu,perlu_perbaikan,ditolak',
            'catatan_tu' => 'nullable|string|max:1000',
            'total_sks' => 'nullable|numeric|min:0|max:200',
            'ipk' => 'nullable|numeric|between:0.00,4.00',
        ]);

        DB::beginTransaction();
        try {
            $mahasiswa = $pendaftaran->mahasiswa;
            if ($mahasiswa) {
                $userUpdates = [];
                if (isset($validated['total_sks'])) {
                    $userUpdates['total_sks'] = (int) $validated['total_sks'];
                }
                if (isset($validated['ipk'])) {
                    $userUpdates['ipk'] = $validated['ipk'];
                }
                if (!empty($userUpdates)) {
                    $mahasiswa->update($userUpdates);
                }
            }

            $pendaftaranUpdates = [
                'status' => $validated['status'],
                'catatan_tu' => $validated['catatan_tu'] ?? null,
            ];

            if ($validated['status'] === 'disetujui_tu') {
                $pendaftaranUpdates['diverifikasi_oleh'] = auth()->id();
                $pendaftaranUpdates['diverifikasi_pada'] = now();

                $dosbing = $pendaftaran->ensureDosenPembimbing();
                if ($dosbing) {
                    $pendaftaranUpdates['dosen_pembimbing_id'] = $dosbing->id;
                }
            }

            $pendaftaran->update($pendaftaranUpdates);

            if ($mahasiswa) {
                $statusText = match ($validated['status']) {
                    'disetujui_tu' => 'disetujui oleh Tata Usaha',
                    'perlu_perbaikan' => 'memerlukan perbaikan berkas',
                    'ditolak' => 'ditolak oleh Tata Usaha',
                    default => 'telah diperbarui oleh Tata Usaha',
                };
                \App\Models\Notifikasi::create([
                    'user_id' => $mahasiswa->id,
                    'judul' => 'Pembaruan Status Pendaftaran KP',
                    'pesan' => "Pendaftaran KP Anda {$statusText}." . (!empty($validated['catatan_tu']) ? " Catatan: {$validated['catatan_tu']}" : ''),
                    'tipe' => $validated['status'] === 'disetujui_tu' ? 'sukses' : 'peringatan',
                    'priority' => 'high',
                    'link' => '/mahasiswa/status-pengajuan',
                ]);
            }

            DB::commit();
            return back()->with('success', 'Data pendaftaran mahasiswa berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memperbarui data: ' . $e->getMessage());
        }
    }
}
