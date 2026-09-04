<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Instansi;
use App\Models\Pendaftaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaSuratPengantarController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->load('programStudi');
        
        $pendaftaran = Pendaftaran::where('mahasiswa_id', $user->id)
            ->with(['instansi', 'dosenPembimbing', 'suratPengantar'])
            ->latest()
            ->first();

        $pendaftaranData = null;
        if ($pendaftaran) {
            $pendaftaranData = [
                'id' => $pendaftaran->id,
                'status' => $pendaftaran->status,
                'catatan_tu' => $pendaftaran->catatan_tu,
                'nama_instansi' => $pendaftaran->suratPengantar?->nama_instansi ?? $pendaftaran->instansi?->nama ?? '',
                'alamat_instansi' => $pendaftaran->suratPengantar?->alamat_instansi ?? $pendaftaran->instansi?->alamat ?? '',
                'tanggal_mulai' => $pendaftaran->suratPengantar?->tanggal_mulai?->format('Y-m-d') ?? $pendaftaran->tanggal_mulai?->format('Y-m-d'),
                'tanggal_selesai' => $pendaftaran->suratPengantar?->tanggal_selesai?->format('Y-m-d') ?? $pendaftaran->tanggal_selesai?->format('Y-m-d'),
                'surat_pengantar' => $pendaftaran->suratPengantar ? [
                    'id' => $pendaftaran->suratPengantar->id,
                    'nomor_surat' => $pendaftaran->suratPengantar->nomor_surat,
                    'tanggal_terbit' => $pendaftaran->suratPengantar->tanggal_terbit?->format('d M Y'),
                    'path_file' => $pendaftaran->suratPengantar->path_file,
                    'file_scan' => $pendaftaran->suratPengantar->file_scan,
                    'status' => $pendaftaran->suratPengantar->status,
                ] : null,
            ];
        }

        return Inertia::render('Mahasiswa/SuratPengantar', [
            'nim' => $user->nim ?? '-',
            'name' => $user->name,
            'jurusan' => $user->programStudi?->nama ?? '-',
            'dosenPembimbing' => $pendaftaran?->dosenPembimbing?->name ?? null,
            'pendaftaran' => $pendaftaranData,
            'hasSurat' => $pendaftaran?->suratPengantar != null,
            'statusKP' => $pendaftaran?->status,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        
        $pendaftaran = Pendaftaran::where('mahasiswa_id', $user->id)
            ->with([
                'instansi',
                'suratPengantar'
            ])
            ->latest()
            ->first();

        if (!$pendaftaran) {
            $pendaftaran = Pendaftaran::create([
                'mahasiswa_id' => $user->id,
                'status' => 'draft',
            ]);
        }

        $validated = $request->validate([
            'nama_instansi' => ['required', 'string', 'max:255'],
            'alamat_instansi' => ['required', 'string'],
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
        ], [
            'nama_instansi.required' => 'Nama instansi/perusahaan wajib diisi.',
            'alamat_instansi.required' => 'Alamat instansi/perusahaan wajib diisi.',
            'tanggal_mulai.required' => 'Tanggal mulai wajib diisi.',
            'tanggal_selesai.required' => 'Tanggal selesai wajib diisi.',
            'tanggal_selesai.after_or_equal' => 'Tanggal selesai harus setelah atau sama dengan tanggal mulai.',
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($pendaftaran, $validated) {
            $instansi = Instansi::updateOrCreate(
                [
                    'nama' => $validated['nama_instansi']
                ],
                [
                    'alamat' => $validated['alamat_instansi'],
                    'kota' => '-'
                ]
            );

            // Update pendaftaran details (for backward compatibility if needed)
            $pendaftaran->update([
                'instansi_id' => $instansi->id,
                'tanggal_mulai' => $validated['tanggal_mulai'],
                'tanggal_selesai' => $validated['tanggal_selesai'],
            ]);

            $pendaftaran->suratPengantar()->updateOrCreate(
                ['pendaftaran_id' => $pendaftaran->id],
                [
                    'nama_instansi' => $validated['nama_instansi'],
                    'alamat_instansi' => $validated['alamat_instansi'],
                    'tanggal_mulai' => $validated['tanggal_mulai'],
                    'tanggal_selesai' => $validated['tanggal_selesai'],
                    'status' => 'draft',
                ]
            );
        });

        return back()->with('success', 'Data draf surat pengantar berhasil disimpan! Silakan cetak draf untuk meminta tanda tangan basah.');
    }

    public function upload(Request $request): RedirectResponse
    {
        $request->validate([
            'file_scan' => ['required', 'file', 'mimes:pdf', 'max:5120']
        ]);
        
        $pendaftaran = Pendaftaran::where('mahasiswa_id', $request->user()->id)->latest()->firstOrFail();
        $surat = $pendaftaran->suratPengantar;
        
        if (!$surat || !in_array($surat->status, ['draft', 'revisi'])) {
            return back()->with('error', 'Tidak dapat mengunggah file. Surat pengantar belum di-draft atau sudah diproses.');
        }

        $path = $request->file('file_scan')->store('surat_pengantar/scans', 'public');

        $surat->update([
            'file_scan' => $path,
            'status' => 'menunggu_verifikasi'
        ]);

        return back()->with('success', 'File scan berhasil diunggah dan sedang diverifikasi TU.');
    }
    public function download(Request $request): StreamedResponse
    {
        $pendaftaran = Pendaftaran::where(
            'mahasiswa_id',
            $request->user()->id
        )
        ->with([
            'instansi',
            'suratPengantar'
        ])
        ->latest()
        ->first();

        if (
            !$pendaftaran ||
            !$pendaftaran->suratPengantar
        ) {
            abort(404, 'Surat pengantar belum tersedia.');
        }

        $surat = $pendaftaran->suratPengantar;

        if (!Storage::disk('public')->exists($surat->path_file)) {
            abort(404, 'File surat tidak ditemukan.');
        }

        return Storage::disk('public')->download(
            $surat->path_file,
            basename($surat->path_file)
        );
    }


    public function cetak(Request $request, $id)
    {
        $data = Pendaftaran::with(['instansi', 'mahasiswa', 'suratPengantar'])
            ->findOrFail($id);

        $surat = $data->suratPengantar;
        if (!$surat) {
            abort(404, 'Data surat belum ada.');
        }

        $nama_instansi = $surat->nama_instansi;
        $alamat_instansi = $surat->alamat_instansi;
        $tanggal_mulai = $surat->tanggal_mulai;
        $tanggal_selesai = $surat->tanggal_selesai;

        return view('cetak.surat-pengantar', compact('data', 'nama_instansi', 'alamat_instansi', 'tanggal_mulai', 'tanggal_selesai'));
    }
}
