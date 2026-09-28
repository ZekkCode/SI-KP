<?php

namespace App\Http\Controllers\TU;

use App\Http\Controllers\Controller;
use App\Models\PembimbingLapangan;
use App\Models\User;
use App\Services\PembimbingLapanganService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TUPembimbingLapanganController extends Controller
{
    /**
     * Display a listing of Pembimbing Lapangan accounts.
     */
    public function index(Request $request): Response
    {
        $statusFilter = $request->query('status', 'all');
        $search = $request->query('search', '');

        $query = PembimbingLapangan::with([
            'user',
            'instansi',
            'pendaftarans.mahasiswa',
        ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('email', 'like', "%{$search}%")
                         ->orWhere('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('instansi', function ($iq) use ($search) {
                      $iq->where('nama', 'like', "%{$search}%");
                  });
            });
        }

        if ($statusFilter && $statusFilter !== 'all') {
            $query->whereHas('user', function ($uq) use ($statusFilter) {
                $uq->where('status_akun', $statusFilter);
            });
        }

        $pembimbingLapangans = $query->latest()->paginate(10)->withQueryString();

        // Calculate statistics
        $totalPl = PembimbingLapangan::count();
        $aktifPl = PembimbingLapangan::whereHas('user', fn($q) => $q->where('status_akun', 'aktif'))->count();
        $pendingPl = PembimbingLapangan::whereHas('user', fn($q) => $q->where('status_akun', 'pending'))->count();
        $nonaktifPl = PembimbingLapangan::whereHas('user', fn($q) => $q->where('status_akun', 'ditolak'))->count();
        $belumKlaim = PembimbingLapangan::whereNull('user_id')->count();

        return Inertia::render('TU/PembimbingLapangan/Index', [
            'pembimbingLapangans' => $pembimbingLapangans,
            'stats' => [
                'total' => $totalPl,
                'aktif' => $aktifPl,
                'pending' => $pendingPl,
                'nonaktif' => $nonaktifPl,
                'belum_klaim' => $belumKlaim,
            ],
            'filters' => [
                'status' => $statusFilter,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Activate a Pembimbing Lapangan user account.
     */
    public function activate(User $user): RedirectResponse
    {
        if ($user->role !== 'instansi') {
            return back()->with('error', 'Hanya akun pembimbing lapangan yang dapat diaktifkan melalui menu ini.');
        }

        $user->update(['status_akun' => 'aktif']);

        return back()->with('success', "Akun {$user->name} ({$user->email}) berhasil diaktifkan.");
    }

    /**
     * Deactivate a Pembimbing Lapangan user account.
     */
    public function deactivate(User $user): RedirectResponse
    {
        if ($user->role !== 'instansi') {
            return back()->with('error', 'Hanya akun pembimbing lapangan yang dapat dinonaktifkan.');
        }

        $user->update(['status_akun' => 'ditolak']);

        return back()->with('success', "Akun {$user->name} ({$user->email}) telah dinonaktifkan.");
    }

    /**
     * Reset password for Pembimbing Lapangan and send new credentials via email.
     */
    public function resetPassword(User $user, PembimbingLapanganService $service): RedirectResponse
    {
        if ($user->role !== 'instansi') {
            return back()->with('error', 'Hanya akun pembimbing lapangan yang dapat direset.');
        }

        $result = $service->resetPassword($user);

        if ($result['email_sent']) {
            return back()->with('success', "Kata sandi {$user->name} berhasil direset dan dikirimkan ke {$user->email}. Kata sandi baru: {$result['temp_password']}");
        }

        return back()->with('warning', "Kata sandi {$user->name} berhasil diperbarui menjadi '{$result['temp_password']}', namun email gagal terkirim ({$result['email_error']}). Silakan salin password ini dan serahkan ke pembimbing.");
    }

    /**
     * Resend credentials email to Pembimbing Lapangan.
     */
    public function resend(User $user, PembimbingLapanganService $service): RedirectResponse
    {
        return $this->resetPassword($user, $service);
    }
}
