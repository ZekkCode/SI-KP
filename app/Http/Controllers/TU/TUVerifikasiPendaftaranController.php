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
            'mahasiswa',
            'instansi',
            'dokumenPendaftarans',
        ])
        // ->whereIn('status', ['diajukan', 'menunggu_verifikasi', 'pending'])
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
            $dosenWaliId = $mahasiswa?->dosen_wali_id;

            // Jika dosen_wali_id belum terhubung pada akun user, cari dari data master mahasiswa
            if (! $dosenWaliId && $mahasiswa?->nim) {
                $nipWali = \App\Models\MasterMahasiswa::where('nim', $mahasiswa->nim)->value('nip_dosen_wali');
                if ($nipWali) {
                    $dosen = \App\Models\User::where('nip', $nipWali)->where('role', 'dosen')->first();
                    if ($dosen) {
                        $mahasiswa->update(['dosen_wali_id' => $dosen->id]);
                        $dosenWaliId = $dosen->id;
                    }
                }
            }

            // Dosen pembimbing otomatis ditetapkan dari Dosen Wali tanpa perlu plotting manual
            $dosenPembimbingId = $pendaftaran->dosen_pembimbing_id ?: $dosenWaliId;

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
                $pendaftaran->load('dosenPembimbing');
                $dosenName = $pendaftaran->dosenPembimbing?->name ?? 'Dosen Wali';
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
}
