<?php

namespace App\Http\Controllers\TU;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\SuratPengantar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TUSuratPengantarController extends Controller
{
    public function index(Request $request): Response
    {
        $selectedId = $request->query('id');

        $query = Pendaftaran::whereHas('suratPengantar', function($q) {
                $q->whereIn('status', ['menunggu_verifikasi', 'terverifikasi', 'revisi']);
            })
            ->with([
                'mahasiswa.programStudi',
                'instansi',
                'dokumenPendaftarans',
                'suratPengantar'
            ]);

        $allRequests = $query->get()->map(function ($p) {
            $transkrip = $p->dokumenPendaftarans->where('jenis', 'transkrip')->first();
            return [
                'id' => $p->id,
                'mahasiswa' => [
                    'name' => $p->mahasiswa->name,
                    'nim' => $p->mahasiswa->nim,
                    'prodi' => $p->mahasiswa->programStudi?->nama ?? '-',
                    'semester' => $p->mahasiswa->semester ?? '-',
                    'sks' => ($p->mahasiswa->total_sks ?? 0) . ' SKS',
                    'ipk' => $p->mahasiswa->ipk ?? '-',
                ],
                'perusahaan' => $p->instansi->nama,
                'alamat' => $p->instansi->alamat,
                'tanggal_mulai' => $p->tanggal_mulai?->format('Y-m-d'),
                'tanggal_selesai' => $p->tanggal_selesai?->format('Y-m-d'),
                'periode' => $p->tanggal_mulai?->format('d M Y') . ' s.d ' . $p->tanggal_selesai?->format('d M Y'),
                'status' => $p->status,
                'catatan_tu' => $p->catatan_tu,
                'surat_pengantar' => $p->suratPengantar ? [
                    'id' => $p->suratPengantar->id,
                    'nomor_surat' => $p->suratPengantar->nomor_surat,
                    'tanggal_terbit' => $p->suratPengantar->tanggal_terbit?->format('d M Y'),
                    'file_scan' => $p->suratPengantar->file_scan,
                    'status' => $p->suratPengantar->status,
                ] : null,
                'docs' => $transkrip ? [
                    [
                        'name' => $transkrip->nama_file,
                        'date' => $transkrip->uploaded_at?->format('d M Y, H:i') . ' WIB',
                        'size' => number_format($transkrip->ukuran / (1024 * 1024), 1, '.', '') . ' MB',
                        'path' => $transkrip->path,
                    ]
                ] : [],
            ];
        });

        // Group by status
        $pengajuan = $allRequests
            ->filter(fn($r) => $r['surat_pengantar'] && $r['surat_pengantar']['status'] === 'menunggu_verifikasi')
            ->values()
            ->all();
        
        $setuju = $allRequests
            ->filter(fn($r) => $r['surat_pengantar'] && $r['surat_pengantar']['status'] === 'terverifikasi')
            ->values()
            ->all();
        
        $ditolak = $allRequests
            ->filter(fn($r) => $r['surat_pengantar'] && $r['surat_pengantar']['status'] === 'revisi')
            ->values()
            ->all();

        // Selected student detail
        $selectedStudent = null;
        if ($selectedId) {
            $selectedStudent = $allRequests->firstWhere('id', (int)$selectedId);
        }

        return Inertia::render('TU/GenerateSurat', [
            'pengajuan' => $pengajuan,
            'setuju' => $setuju,
            'ditolak' => $ditolak,
            'selectedStudent' => $selectedStudent,
            'selectedId' => $selectedId,
        ]);
    }

    public function approve(Request $request, $id): RedirectResponse
    {
        $pendaftaran = Pendaftaran::findOrFail($id);

        DB::transaction(function () use ($pendaftaran, $request) {
            $pendaftaran->update([
                'status' => 'surat_terbit',
                'diverifikasi_oleh' => $request->user()->id,
                'diverifikasi_pada' => now(),
                'catatan_tu' => null,
            ]);

            $pendaftaran->suratPengantar()->update([
                'status' => 'terverifikasi',
                // Optional: we can generate a nomor_surat automatically if we want, or leave it null since it's an offline signed document
                'nomor_surat' => $pendaftaran->suratPengantar->nomor_surat ?? uniqid('SP-'),
                'tanggal_terbit' => now(),
            ]);
        });

        return redirect()
            ->route('tu.generate', ['id' => $id])
            ->with('success', 'Surat pengantar resmi berhasil diterbitkan!');
    }

    public function reject(Request $request, $id): RedirectResponse
    {
        $pendaftaran = Pendaftaran::findOrFail($id);

        $validated = $request->validate([
            'catatan_tu' => ['required', 'string', 'max:1000'],
        ], [
            'catatan_tu.required' => 'Alasan pengembalian wajib diisi.',
        ]);

        $pendaftaran->update([
            'catatan_tu' => $validated['catatan_tu'],
        ]);
        
        $pendaftaran->suratPengantar()->update([
            'status' => 'revisi'
        ]);

        return redirect()
            ->route('tu.generate', ['id' => $id])
            ->with('success', 'Berkas pengajuan berhasil dikembalikan untuk perbaikan.');
    }
}
