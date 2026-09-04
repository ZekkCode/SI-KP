<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\SuratBalasan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaSuratBalasanController extends Controller
{
    public function index(Request $request): Response
    {
        $pendaftaran = Pendaftaran::where(
            'mahasiswa_id',
            $request->user()->id
        )
        ->with(['suratBalasan', 'instansi'])
        ->latest()
        ->first();

        return Inertia::render('Mahasiswa/SuratBalasan/Index', [
            'pendaftaran' => $pendaftaran ? [
                'id' => $pendaftaran->id,
                'status' => $pendaftaran->status,
                'catatan_tu' => $pendaftaran->catatan_tu,
                'instansi' => $pendaftaran->instansi ? [
                    'nama' => $pendaftaran->instansi->nama,
                    'alamat' => $pendaftaran->instansi->alamat ?? null,
                ] : null,
                'surat_balasan' => $pendaftaran->suratBalasan ? [
                    'nomor_surat' => $pendaftaran->suratBalasan->nomor_surat,
                    'tanggal_surat' => $pendaftaran->suratBalasan->tanggal_surat?->format('Y-m-d'),
                    'path_file' => $pendaftaran->suratBalasan->path_file,
                ] : null,
            ] : null,
        ]);
    }

    public function show(Request $request): Response
    {
        $pendaftaran = Pendaftaran::where(
            'mahasiswa_id',
            $request->user()->id
        )
        ->with(['suratBalasan', 'instansi'])
        ->latest()
        ->first();

        return Inertia::render('Mahasiswa/SuratBalasan/Show', [
            'pendaftaran' => $pendaftaran ? [
                'id' => $pendaftaran->id,
                'status' => $pendaftaran->status,
                'tanggal_mulai' => $pendaftaran->tanggal_mulai?->format('Y-m-d'),
                'tanggal_selesai' => $pendaftaran->tanggal_selesai?->format('Y-m-d'),
                'instansi' => $pendaftaran->instansi ? [
                    'nama' => $pendaftaran->instansi->nama,
                    'alamat' => $pendaftaran->instansi->alamat ?? null,
                ] : null,
            ] : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor_surat' => 'required|string|max:255',
            'tanggal_surat' => 'required|date',
            'file' => 'required|mimes:pdf|max:2048',
        ]);

        $pendaftaran = Pendaftaran::where(
            'mahasiswa_id',
            $request->user()->id
        )->latest()->first();

        if (!$pendaftaran) {
            return back()->with('error', 'Pendaftaran tidak ditemukan.');
        }

        $path = $request->file('file')
            ->store('surat-balasan', 'public');

        SuratBalasan::updateOrCreate(
            [
                'pendaftaran_id' => $pendaftaran->id
            ],
            [
                'nomor_surat' => $validated['nomor_surat'],
                'tanggal_surat' => $validated['tanggal_surat'],
                'path_file' => $path,
            ]
        );

        $pendaftaran->update([
            'status' => 'verifikasi_surat_balasan'
        ]);

        return back()->with(
            'success',
            'Surat balasan berhasil diupload.'
        );
    }

    public function download(Request $request)
    {
        $pendaftaran = Pendaftaran::where(
            'mahasiswa_id',
            $request->user()->id
        )
        ->with('suratBalasan')
        ->latest()
        ->first();

        if (
            !$pendaftaran ||
            !$pendaftaran->suratBalasan
        ) {
            abort(404);
        }

        return Storage::disk('public')->download(
            $pendaftaran->suratBalasan->path_file
        );
    }
}