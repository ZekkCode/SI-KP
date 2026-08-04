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

        // Fetch cover letter requests
        $query = Pendaftaran::where('status', 'verifikasi_tu')
            ->whereNotNull('instansi_id')
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
            ->filter(fn($r) => $r['status'] === 'verifikasi_tu')
            ->values()
            ->all();
        
        $setuju = $allRequests
            ->filter(fn($r) => $r['status'] === 'surat_terbit')
            ->values()
            ->all();
        
        $ditolak = $allRequests
            ->filter(fn($r) => $r['status'] === 'perlu_perbaikan')
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

        $validated = $request->validate([
            'nomor_surat' => ['required', 'string', 'max:255', 'unique:surat_pengantars,nomor_surat'],
        ], [
            'nomor_surat.required' => 'Nomor surat wajib diisi.',
            'nomor_surat.unique' => 'Nomor surat sudah terdaftar di sistem.',
        ]);

        DB::transaction(function () use ($pendaftaran, $validated, $request) {
            $pendaftaran->update([
                'status' => 'surat_terbit',
                'diverifikasi_oleh' => $request->user()->id,
                'diverifikasi_pada' => now(),
            ]);

            SuratPengantar::create([
                'pendaftaran_id' => $pendaftaran->id,
                'nomor_surat' => $validated['nomor_surat'],
                'tanggal_terbit' => now(),
                'tanggal_berlaku' => now()->addMonths(3),
                'ditandatangani_oleh' => 'Dr. Budi Santoso, M.Kom.',
                'nip_penandatangan' => '19800101 200501 1 001',
                'generated_by' => $request->user()->id,
                'verification_id' => uniqid('KP-'),
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
            'status' => 'perlu_perbaikan',
            'catatan_tu' => $validated['catatan_tu'],
        ]);

        return redirect()
            ->route('tu.generate', ['id' => $id])
            ->with('success', 'Berkas pengajuan berhasil dikembalikan untuk perbaikan.');
    }
}
