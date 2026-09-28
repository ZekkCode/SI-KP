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

        // Ambil proposal dari mahasiswa bimbingan dosen yang sedang login (baik via dosen_pembimbing_id maupun dosen_wali_id)
        $proposals = Proposal::with(['pendaftaran.mahasiswa.programStudi', 'feedbacks.user'])
            ->whereHas('pendaftaran', function ($query) use ($dosenId) {
                $query->where('dosen_pembimbing_id', $dosenId)
                    ->orWhereHas('mahasiswa', fn($mq) => $mq->where('dosen_wali_id', $dosenId));
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

        $proposal = Proposal::with(['pendaftaran.mahasiswa.programStudi', 'feedbacks.user'])
            ->whereHas('pendaftaran', function ($query) use ($dosenId) {
                $query->where('dosen_pembimbing_id', $dosenId)
                    ->orWhereHas('mahasiswa', fn($mq) => $mq->where('dosen_wali_id', $dosenId));
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

        $dosenId = Auth::id();
        $proposal = Proposal::with('pendaftaran')->whereHas('pendaftaran', function ($query) use ($dosenId) {
            $query->where('dosen_pembimbing_id', $dosenId)
                ->orWhereHas('mahasiswa', fn($mq) => $mq->where('dosen_wali_id', $dosenId));
        })->findOrFail($id);

        // 1. Update status proposal
        $proposal->update([
            'status' => $request->status,
            'reviewed_by' => $dosenId,
            'reviewed_at' => now(),
        ]);

        // 2. Simpan catatan ke proposal_feedbacks
        ProposalFeedback::create([
            'proposal_id' => $proposal->id,
            'user_id' => $dosenId,
            'komentar' => $request->catatan,
            'status_setelah' => $request->status,
        ]);

        // 3. Notifikasi ke Mahasiswa
        if ($proposal->pendaftaran?->mahasiswa_id) {
            \App\Models\Notifikasi::create([
                'user_id' => $proposal->pendaftaran->mahasiswa_id,
                'judul' => 'Proposal KP: ' . ($request->status === 'disetujui' ? 'DISETUJUI' : 'PERLU REVISI'),
                'pesan' => "Dosen Pembimbing telah mereview proposal Anda dengan catatan: {$request->catatan}",
                'tipe' => $request->status === 'disetujui' ? 'sukses' : 'peringatan',
                'priority' => 'high',
                'link' => '/mahasiswa/proposal',
            ]);
        }

        return back()->with('success', 'Review proposal berhasil disimpan.');
    }
}
