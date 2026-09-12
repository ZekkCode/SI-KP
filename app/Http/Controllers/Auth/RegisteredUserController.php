<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\MasterMahasiswa;
use App\Models\PermohonanAkun;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Check NIM against Master Mahasiswa and current registration state.
     */
    public function checkNim(Request $request): JsonResponse
    {
        $request->validate([
            'nim' => ['required', 'string'],
        ]);

        $nim = trim($request->nim);

        // 1. Cek apakah NIM terdaftar di data master mahasiswa
        $master = MasterMahasiswa::where('nim', $nim)->first();
        if (! $master) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'NIM ini tidak ditemukan dalam data master mahasiswa. Silakan hubungi Tata Usaha.',
            ], 404);
        }

        // 2. Cek apakah NIM sudah memiliki akun di tabel users
        $existingUser = User::where('nim', $nim)->orWhere('email', $master->email)->first();
        if ($existingUser) {
            return response()->json([
                'status' => 'already_has_account',
                'message' => 'NIM ini sudah memiliki akun.',
            ], 422);
        }

        // 3. Cek apakah ada permohonan dengan status menunggu_verifikasi
        $pendingRequest = PermohonanAkun::where('nim', $nim)
            ->where('status', 'menunggu_verifikasi')
            ->first();

        if ($pendingRequest) {
            return response()->json([
                'status' => 'pending_verification',
                'message' => 'Permohonan pembuatan akun Anda sedang menunggu verifikasi Tata Usaha.',
            ], 422);
        }

        // 4. Data valid dan siap diajukan
        return response()->json([
            'status' => 'ready',
            'data' => [
                'nim' => $master->nim,
                'nama' => $master->nama,
                'email' => $master->email,
                'program_studi' => $master->program_studi,
                'angkatan' => $master->angkatan,
                'nip_dosen_wali' => $master->nip_dosen_wali,
                'dosen_wali_nama' => $master->dosenWali?->name,
            ],
        ]);
    }

    /**
     * Cancel a pending registration application so the student can re-register.
     */
    public function cancelApplication(Request $request): JsonResponse
    {
        $request->validate([
            'nim' => ['required', 'string'],
        ]);

        $nim = trim($request->nim);

        PermohonanAkun::where('nim', $nim)
            ->where('status', 'menunggu_verifikasi')
            ->delete();

        return response()->json([
            'status' => 'cancelled',
            'message' => 'Permohonan berhasil dibatalkan. Anda dapat memeriksa NIM dan mengajukan ulang pendaftaran.',
        ]);
    }

    /**
     * Handle an incoming account application request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nim' => ['required', 'string'],
        ]);

        $nim = trim($request->nim);

        // 1. Verifikasi dari data master
        $master = MasterMahasiswa::where('nim', $nim)->first();
        if (! $master) {
            throw ValidationException::withMessages([
                'nim' => 'NIM ini tidak ditemukan dalam data master mahasiswa.',
            ]);
        }

        // 2. Verifikasi apakah sudah ada akun
        $existingUser = User::where('nim', $nim)->orWhere('email', $master->email)->first();
        if ($existingUser) {
            throw ValidationException::withMessages([
                'nim' => 'NIM ini sudah memiliki akun.',
            ]);
        }

        // 3. Verifikasi apakah ada permohonan pending
        $pendingRequest = PermohonanAkun::where('nim', $nim)
            ->where('status', 'menunggu_verifikasi')
            ->first();

        if ($pendingRequest) {
            throw ValidationException::withMessages([
                'nim' => 'Permohonan pembuatan akun Anda sedang menunggu verifikasi Tata Usaha.',
            ]);
        }

        // 4. Buat permohonan baru
        PermohonanAkun::create([
            'nim' => $master->nim,
            'nama' => $master->nama,
            'email' => $master->email,
            'program_studi' => $master->program_studi,
            'angkatan' => $master->angkatan,
            'nip_dosen_wali' => $master->nip_dosen_wali,
            'status' => 'menunggu_verifikasi',
        ]);

        return redirect()->route('login', ['role' => 'mahasiswa'])->with('status', 'Permohonan akun Anda berhasil diajukan dan sedang menunggu verifikasi Tata Usaha (TU). Kredensial sementara akan dikirimkan ke email resmi Anda setelah disetujui.');
    }
}
