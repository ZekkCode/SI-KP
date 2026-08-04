<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mahasiswa\StoreProposalRequest;
use App\Models\Pendaftaran;
use App\Models\Proposal;
use App\Models\ProposalFeedback;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Notifikasi;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaProposalController extends Controller
{
    /**
     * Show the proposal page with existing data.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get latest pendaftaran with dosen pembimbing
        $pendaftaran = Pendaftaran::where('mahasiswa_id', $user->id)
            ->with('dosenPembimbing')
            ->latest()
            ->first();

        // Get latest proposal for this pendaftaran
        $proposal = null;
        $feedbacks = [];
        $dosenPembimbing = null;

        if ($pendaftaran) {
            $dosenPembimbing = $pendaftaran->dosenPembimbing
                ? [
                    'name' => $pendaftaran->dosenPembimbing->name,
                    'nip' => $pendaftaran->dosenPembimbing->nip,
                    'initials' => $this->getInitials($pendaftaran->dosenPembimbing->name),
                ]
                : null;

            $proposalModel = Proposal::where('pendaftaran_id', $pendaftaran->id)
                ->latest()
                ->first();

            if ($proposalModel) {
                $proposal = [
                    'id' => $proposalModel->id,
                    'judul' => $proposalModel->judul,
                    'abstrak' => $proposalModel->abstrak,
                    'status' => $proposalModel->status,
                    'versi' => $proposalModel->versi,
                    'path_file' => $proposalModel->path_file,
                    'submitted_at' => $proposalModel->submitted_at?->format('d M Y, H:i'),
                ];

                // Get all feedbacks for this proposal with user info
                $feedbacks = ProposalFeedback::where('proposal_id', $proposalModel->id)
                    ->with('user')
                    ->orderByDesc('created_at')
                    ->get()
                    ->map(fn ($fb) => [
                        'id' => $fb->id,
                        'komentar' => $fb->komentar,
                        'status_setelah' => $fb->status_setelah,
                        'user_name' => $fb->user->name,
                        'user_role' => $fb->user->role,
                        'user_initials' => $this->getInitials($fb->user->name),
                        'created_at' => $fb->created_at->format('d M Y, H:i'),
                    ])
                    ->toArray();
            }
        }

        return Inertia::render('Mahasiswa/Proposal', [
            'proposal' => $proposal,
            'dosenPembimbing' => $dosenPembimbing,
            'feedbacks' => $feedbacks,
            'hasPendaftaran' => $pendaftaran !== null,
            'pendaftaranId' => $pendaftaran?->id,
        ]);
    }

    /**
     * Store/update a proposal.
     */
    public function store(StoreProposalRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $pendaftaran = Pendaftaran::where('mahasiswa_id', $user->id)
            ->latest()
            ->first();

        if (!$pendaftaran) {
            $pendaftaran = Pendaftaran::create([
                'mahasiswa_id' => $user->id,
                'status' => 'draft',
            ]);
        }

        DB::transaction(function () use ($pendaftaran, $validated, $user) {
            // Get existing proposal or create new
            $existingProposal = Proposal::where('pendaftaran_id', $pendaftaran->id)
                ->latest()
                ->first();

            $filePath = $existingProposal?->path_file;

            // Upload new file if provided
            if (isset($validated['file_proposal'])) {
                // Delete old file if exists
                if ($filePath) {
                    Storage::disk('public')->delete($filePath);
                }
                $filePath = $validated['file_proposal']->store('proposal', 'public');
            }

            if ($existingProposal) {
                // Update existing proposal (new version)
                $existingProposal->update([
                    'judul' => $validated['judul'],
                    'abstrak' => $validated['abstrak'] ?? $existingProposal->abstrak,
                    'path_file' => $filePath,
                    'versi' => $existingProposal->versi + 1,
                    'status' => 'diajukan',
                    'submitted_at' => now(),
                ]);
            } else {
                // Create new proposal
                Proposal::create([
                    'pendaftaran_id' => $pendaftaran->id,
                    'judul' => $validated['judul'],
                    'abstrak' => $validated['abstrak'],
                    'path_file' => $filePath,
                    'versi' => 1,
                    'status' => 'diajukan',
                    'submitted_at' => now(),
                ]);
            }
        });
        
        Notifikasi::create([
            'user_id' => $user->id,
            'judul' => 'Proposal KP',
            'pesan' => 'Proposal berhasil dikirim.',
            'tipe' => 'success',
            'is_read' => false,
        ]);

        return redirect()
            ->route('mahasiswa.proposal')
            ->with('success', 'Proposal berhasil dikirim untuk review!');
    }

    /**
     * Send a note/reply in the feedback thread.
     */
    public function sendNote(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'komentar' => ['required', 'string', 'max:2000'],
        ], [
            'komentar.required' => 'Catatan tidak boleh kosong.',
            'komentar.max' => 'Catatan maksimal 2000 karakter.',
        ]);

        // Get the latest proposal for this user
        $pendaftaran = Pendaftaran::where('mahasiswa_id', $user->id)
            ->latest()
            ->first();

        if (!$pendaftaran) {
            $pendaftaran = Pendaftaran::create([
                'mahasiswa_id' => $user->id,
                'status' => 'draft',
            ]);
        }

        $proposal = Proposal::where('pendaftaran_id', $pendaftaran->id)
            ->latest()
            ->first();

        if (!$proposal) {
            return back()->with('error', 'Proposal tidak ditemukan.');
        }

        ProposalFeedback::create([
            'proposal_id' => $proposal->id,
            'user_id' => $user->id,
            'komentar' => $validated['komentar'],
            'status_setelah' => null, // mahasiswa replies don't change status
        ]);

        return redirect()
            ->route('mahasiswa.proposal')
            ->with('success', 'Catatan berhasil dikirim.');
    }
    public function download(Proposal $proposal): StreamedResponse
    {
        abort_unless(
            $proposal->pendaftaran->mahasiswa_id == auth()->id(),
            403
        );

        if (!Storage::disk('public')->exists($proposal->path_file)) {
            abort(404);
        }

        return Storage::disk('public')->download(
            $proposal->path_file,
            basename($proposal->path_file)
        );
    }
    public function destroy(Proposal $proposal): RedirectResponse
    {
        abort_unless(
            $proposal->pendaftaran->mahasiswa_id == auth()->id(),
            403
        );

        if ($proposal->status == 'disetujui') {
            return back()->with(
                'error',
                'Proposal yang sudah disetujui tidak dapat dihapus.'
            );
        }

        Storage::disk('public')->delete($proposal->path_file);

        $proposal->delete();

        return back()->with(
            'success',
            'Proposal berhasil dihapus.'
        );
    }
    public function update(
        StoreProposalRequest $request,
        Proposal $proposal
    ): RedirectResponse {

        abort_unless(
            $proposal->pendaftaran->mahasiswa_id == auth()->id(),
            403
        );

        $validated = $request->validated();

        $file = $proposal->path_file;

        if ($request->hasFile('file_proposal')) {

            Storage::disk('public')->delete($file);

            $file = $request
                ->file('file_proposal')
                ->store('proposal','public');
        }

        $proposal->update([

            'judul'=>$validated['judul'],

            'abstrak'=>$validated['abstrak'],

            'path_file'=>$file,

            'versi'=>$proposal->versi+1,

            'status'=>'diajukan',

            'submitted_at'=>now()

        ]);

        Notifikasi::create([
            'user_id' => auth()->id(),
            'judul' => 'Proposal KP',
            'pesan' => 'Proposal berhasil diperbarui.',
            'tipe' => 'info',
            'is_read' => false,
        ]);

        return back()->with(
            'success',
            'Proposal berhasil diperbarui.'
        );

    }

    /**
     * Get initials from a full name.
     */
    private function getInitials(string $name): string
    {
        $words = explode(' ', $name);
        $initials = '';
        foreach (array_slice($words, 0, 2) as $word) {
            // Skip common titles
            $skip = ['Dr.', 'Prof.', 'Ir.', 'S.T.,', 'M.T.', 'M.Kom.', 'S.Kom.,', 'M.Cs.', 'S.Si.,', 'M.M.', 'M.Eng.'];
            if (!in_array($word, $skip) && strlen($word) > 0) {
                $initials .= strtoupper($word[0]);
            }
        }
        return $initials ?: 'U';
    }
}
