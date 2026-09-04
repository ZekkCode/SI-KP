<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\Proposal;
use App\Models\ProposalFeedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class DosenProposalController extends Controller
{
    /**
     * Menampilkan daftar proposal mahasiswa bimbingan.
     */
    public function index()
    {
        $dosenId = Auth::id();

        // Ambil proposal dari mahasiswa bimbingan dosen yang sedang login.
        // Kita hanya mengambil proposal terbaru dari tiap pendaftaran atau semua proposal yang ada.
        $proposals = Proposal::with(['pendaftaran.mahasiswa'])
            ->whereHas('pendaftaran', function ($query) use ($dosenId) {
                $query->where('dosen_pembimbing_id', $dosenId);
            })
            ->orderByRaw("FIELD(status, 'diajukan') DESC") // Prioritaskan yang 'diajukan' di paling atas
            ->latest()
            ->get();

        return Inertia::render('Dosen/ReviewProposal', [
            'proposals' => $proposals
        ]);
    }

    /**
     * Menampilkan halaman review proposal khusus.
     */
    public function review($id)
    {
        $dosenId = Auth::id();

        $proposal = Proposal::with(['pendaftaran.mahasiswa'])
            ->whereHas('pendaftaran', function ($query) use ($dosenId) {
                $query->where('dosen_pembimbing_id', $dosenId);
            })
            ->findOrFail($id);

        return Inertia::render('Dosen/Proposal/Review', [
            'proposal' => $proposal
        ]);
    }

    /**
     * Menyimpan hasil review proposal dari dosen.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:disetujui,revisi',
            'catatan' => 'required|string',
        ]);

        $proposal = Proposal::whereHas('pendaftaran', function ($query) {
            $query->where('dosen_pembimbing_id', Auth::id());
        })->findOrFail($id);

        // 1. Update status proposal
        $proposal->update([
            'status' => $request->status,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        // 2. Simpan catatan ke proposal_feedbacks
        ProposalFeedback::create([
            'proposal_id' => $proposal->id,
            'user_id' => Auth::id(),
            'komentar' => $request->catatan,
            'status_setelah' => $request->status,
        ]);

        return back()->with('success', 'Review proposal berhasil disimpan.');
    }
}
