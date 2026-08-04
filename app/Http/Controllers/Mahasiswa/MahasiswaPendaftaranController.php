<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mahasiswa\StorePendaftaranRequest;
use App\Models\DokumenPendaftaran;
use App\Models\Instansi;
use App\Models\Pendaftaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaPendaftaranController extends Controller
{
    /**
     * Show the pendaftaran form.
     * If user already has a pendaftaran, pre-fill the form.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Load existing pendaftaran with relations
        $pendaftaran = Pendaftaran::where('mahasiswa_id', $user->id)
            ->with(['instansi', 'dokumenPendaftarans'])
            ->latest()
            ->first();

        $pendaftaranData = null;
        if ($pendaftaran) {
            $dokumen = $pendaftaran->dokumenPendaftarans;
            $pendaftaranData = [
                'id' => $pendaftaran->id,
                'status' => $pendaftaran->status,
                'nama_instansi' => $pendaftaran->instansi?->nama ?? '',
                'alamat_instansi' => $pendaftaran->instansi?->alamat ?? '',
                'tanggal_mulai' => $pendaftaran->tanggal_mulai?->format('Y-m-d'),
                'tanggal_selesai' => $pendaftaran->tanggal_selesai?->format('Y-m-d'),
                'bidang_minat' => $pendaftaran->bidang_minat,
                'catatan_tu' => $pendaftaran->catatan_tu,
                'transkrip_uploaded' => $dokumen->where('jenis', 'transkrip')->isNotEmpty(),
                'transkrip_file_name' => $dokumen->where('jenis', 'transkrip')->first()?->nama_file,
            ];
        }

        return Inertia::render('Mahasiswa/Pendaftaran', [
            'pendaftaran' => $pendaftaranData,
        ]);
    }

    /**
     * Store a new pendaftaran (submit).
     */
    public function store(StorePendaftaranRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Check if user already has an active/non-draft pendaftaran
        $existingActive = Pendaftaran::where('mahasiswa_id', $user->id)
            ->whereNotIn('status', ['draft', 'selesai', 'ditolak_instansi'])
            ->exists();

        if ($existingActive) {
            return back()->with('error', 'Anda sudah memiliki pendaftaran yang sedang diproses.');
        }

        DB::transaction(function () use ($user, $validated) {
            // Update user profile fields
            $user->update([
                'name' => $validated['name'],
                'no_telepon' => $validated['no_telepon'],
                'email' => $validated['email'],
                'semester' => $validated['semester'],
                'total_sks' => $validated['total_sks'],
                'ipk' => $validated['ipk'],
            ]);

            // Find existing draft or create new pendaftaran (without instansi or duration)
            $pendaftaran = Pendaftaran::updateOrCreate(
                [
                    'mahasiswa_id' => $user->id,
                    'status' => 'draft',
                ],
                [
                    'instansi_id' => null,
                    'tanggal_mulai' => null,
                    'tanggal_selesai' => null,
                    'status' => 'diajukan',
                ]
            );

            // Upload transkrip file
            if (isset($validated['transkrip_file'])) {
                // Delete old Transkrip document if exists
                $oldTranskrip = $pendaftaran->dokumenPendaftarans()->where('jenis', 'transkrip')->first();
                if ($oldTranskrip) {
                    Storage::disk('public')->delete($oldTranskrip->path);
                    $oldTranskrip->delete();
                }

                $transkripPath = $validated['transkrip_file']->store('dokumen/pendaftaran', 'public');
                DokumenPendaftaran::create([
                    'pendaftaran_id' => $pendaftaran->id,
                    'jenis' => 'transkrip',
                    'nama_file' => $validated['transkrip_file']->getClientOriginalName(),
                    'path' => $transkripPath,
                    'ukuran' => $validated['transkrip_file']->getSize(),
                    'uploaded_at' => now(),
                ]);
            }
        });

        return redirect()
            ->route('mahasiswa.pendaftaran')
            ->with('success', 'Pendaftaran Kerja Praktik berhasil dikirim!');
    }

    /**
     * Save pendaftaran as draft.
     */
    public function saveDraft(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'nama_instansi' => ['nullable', 'string', 'max:255'],
            'alamat_instansi' => ['nullable', 'string', 'max:1000'],
            'tanggal_mulai' => ['nullable', 'date'],
            'tanggal_selesai' => ['nullable', 'date'],
            'krs_file' => ['nullable', 'file', 'mimes:pdf', 'max:2048'],
            'transkrip_file' => ['nullable', 'file', 'mimes:pdf', 'max:2048'],
        ]);

        DB::transaction(function () use ($user, $validated) {
            // Find or create instansi (if name provided)
            $instansiId = null;
            if (!empty($validated['nama_instansi'])) {
                $instansi = Instansi::firstOrCreate(
                    ['nama' => $validated['nama_instansi']],
                    [
                        'alamat' => $validated['alamat_instansi'] ?? '',
                        'kota' => '',
                    ]
                );
                $instansiId = $instansi->id;
            }

            if (!$instansiId) {
                // Create a placeholder instansi if none provided, to satisfy foreign key constraints
                $placeholderInstansi = Instansi::firstOrCreate(
                    ['nama' => '[Draft] Belum Ditentukan'],
                    [
                        'alamat' => '-',
                        'kota' => '-',
                    ]
                );
                $instansiId = $placeholderInstansi->id;
            }

            // Find existing draft or create new one
            $pendaftaran = Pendaftaran::updateOrCreate(
                [
                    'mahasiswa_id' => $user->id,
                    'status' => 'draft',
                ],
                [
                    'instansi_id' => $instansiId,
                    'tanggal_mulai' => $validated['tanggal_mulai'] ?? now(),
                    'tanggal_selesai' => $validated['tanggal_selesai'] ?? now()->addMonths(3),
                    'status' => 'draft',
                ]
            );

            // Upload KRS if provided
            if (isset($validated['krs_file'])) {
                // Delete old KRS document if exists
                $oldKrs = $pendaftaran->dokumenPendaftarans()->where('jenis', 'krs')->first();
                if ($oldKrs) {
                    Storage::disk('public')->delete($oldKrs->path);
                    $oldKrs->delete();
                }

                $krsPath = $validated['krs_file']->store('dokumen/pendaftaran', 'public');
                DokumenPendaftaran::create([
                    'pendaftaran_id' => $pendaftaran->id,
                    'jenis' => 'krs',
                    'nama_file' => $validated['krs_file']->getClientOriginalName(),
                    'path' => $krsPath,
                    'ukuran' => $validated['krs_file']->getSize(),
                    'uploaded_at' => now(),
                ]);
            }

            // Upload transkrip if provided
            if (isset($validated['transkrip_file'])) {
                $oldTranskrip = $pendaftaran->dokumenPendaftarans()->where('jenis', 'transkrip')->first();
                if ($oldTranskrip) {
                    Storage::disk('public')->delete($oldTranskrip->path);
                    $oldTranskrip->delete();
                }

                $transkripPath = $validated['transkrip_file']->store('dokumen/pendaftaran', 'public');
                DokumenPendaftaran::create([
                    'pendaftaran_id' => $pendaftaran->id,
                    'jenis' => 'transkrip',
                    'nama_file' => $validated['transkrip_file']->getClientOriginalName(),
                    'path' => $transkripPath,
                    'ukuran' => $validated['transkrip_file']->getSize(),
                    'uploaded_at' => now(),
                ]);
            }
        });

        return redirect()
            ->route('mahasiswa.pendaftaran')
            ->with('success', 'Draft pendaftaran berhasil disimpan.');
    }
    public function statusPengajuan(Request $request): Response
    {
        $pendaftaran = Pendaftaran::where(
            'mahasiswa_id',
            $request->user()->id
        )
        ->with([
            'instansi',
            'dosenPembimbing',
            'suratPengantar',
            'proposals'
        ])
        ->latest()
        ->first();

        return Inertia::render(
            'Mahasiswa/StatusPengajuan',
            [
                'pendaftaran' => $pendaftaran
            ]
        );
    }
    public function download(
        Pendaftaran $pendaftaran,
        string $jenis
    ): StreamedResponse {

        abort_unless(
            $pendaftaran->mahasiswa_id == auth()->id(),
            403
        );

        $dokumen = $pendaftaran
            ->dokumenPendaftarans()
            ->where('jenis',$jenis)
            ->firstOrFail();

        return Storage::disk('public')
            ->download(
                $dokumen->path,
                $dokumen->nama_file
            );
    }

    public function cancel(
        Pendaftaran $pendaftaran
    ): RedirectResponse{

        abort_unless(
            $pendaftaran->mahasiswa_id==auth()->id(),
            403
        );

        if(
            in_array(
                $pendaftaran->status,
                [
                    'aktif',
                    'selesai'
                ]
            )
        ){
            return back()->with(
                'error',
                'Pengajuan tidak dapat dibatalkan.'
            );
        }

        $pendaftaran->update([
            'status'=>'dibatalkan'
        ]);

        return back()->with(
            'success',
            'Pengajuan berhasil dibatalkan.'
        );

    }

    public function destroy(
        Pendaftaran $pendaftaran
    ): RedirectResponse{

        abort_unless(
            $pendaftaran->mahasiswa_id==auth()->id(),
            403
        );

        if(
            $pendaftaran->status!='draft'
        ){

            return back()->with(
                'error',
                'Hanya draft yang dapat dihapus.'
            );

        }

        foreach(
            $pendaftaran->dokumenPendaftarans
            as
            $dokumen
        ){

            Storage::disk('public')
                ->delete(
                    $dokumen->path
                );

            $dokumen->delete();

        }

        $pendaftaran->delete();

        return back()->with(
            'success',
            'Draft berhasil dihapus.'
        );

    }

    public function update(
        StorePendaftaranRequest $request,
        Pendaftaran $pendaftaran
    ): RedirectResponse{
    
        abort_unless(
            $pendaftaran->mahasiswa_id==auth()->id(),
            403
        );
    
        if(
            !$pendaftaran->canEdit()
        ){
    
            return back()->with(
                'error',
                'Pengajuan tidak dapat diedit.'
            );
    
        }
    
        $pendaftaran->update([
            'tanggal_mulai'=>$request->tanggal_mulai,
            'tanggal_selesai'=>$request->tanggal_selesai,
            'bidang_minat'=>$request->bidang_minat
        ]);
    
        return back()->with(
            'success',
            'Pengajuan berhasil diperbarui.'
        );
    
    }
}
