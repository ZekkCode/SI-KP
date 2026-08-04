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
                'nama_instansi' => $pendaftaran->instansi?->nama ?? '',
                'alamat_instansi' => $pendaftaran->instansi?->alamat ?? '',
                'tanggal_mulai' => $pendaftaran->tanggal_mulai?->format('Y-m-d'),
                'tanggal_selesai' => $pendaftaran->tanggal_selesai?->format('Y-m-d'),
                'surat_pengantar' => $pendaftaran->suratPengantar ? [
                    'id' => $pendaftaran->suratPengantar->id,
                    'nomor_surat' => $pendaftaran->suratPengantar->nomor_surat,
                    'tanggal_terbit' => $pendaftaran->suratPengantar->tanggal_terbit?->format('d M Y'),
                    'path_file' => $pendaftaran->suratPengantar->path_file,
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
            ->with('suratPengantar')
            ->latest()
            ->first();
        if (
            $pendaftaran &&
            $pendaftaran->suratPengantar
        ) {
            return back()->with(
                'error',
                'Surat pengantar sudah diterbitkan.'
            );
        }    

        if (!$pendaftaran) {
            $pendaftaran = Pendaftaran::create([
                'mahasiswa_id' => $user->id,
                'status' => 'draft',
            ]);
        }

        if (
            in_array(
                $pendaftaran->status,
                ['aktif', 'selesai']
            )
        ) {
            return back()->with(
                'error',
                'Data tidak dapat diubah karena Kerja Praktik sudah berjalan.'
            );
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
            $instansi = Instansi::firstOrCreate(
                ['nama' => $validated['nama_instansi']],
                [
                    'alamat' => $validated['alamat_instansi'],
                    'kota' => '-',
                ]
            );

            // Update pendaftaran details
            $pendaftaran->update([
                'instansi_id' => $instansi->id,
                'tanggal_mulai' => $validated['tanggal_mulai'],
                'tanggal_selesai' => $validated['tanggal_selesai'],
                'status' => 'verifikasi_tu',
            ]);
        });

        return back()->with('success', 'Pengajuan Surat Pengantar berhasil dikirim!');
    }
    public function download(Request $request): StreamedResponse
    {
        $pendaftaran = Pendaftaran::where(
            'mahasiswa_id',
            $request->user()->id
        )
        ->with('suratPengantar')
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


}
