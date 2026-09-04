<?php

namespace App\Http\Controllers\TU;

use App\Http\Controllers\Controller;
use App\Mail\AkunMahasiswaDisetujuiMail;
use App\Models\PermohonanAkun;
use App\Models\ProgramStudi;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TUPersetujuanAkunController extends Controller
{
    /**
     * Display a list of student account registration requests.
     */
    public function index(Request $request): Response
    {
        $statusFilter = $request->query('status', 'menunggu_verifikasi');
        $search = $request->query('search', '');

        $query = PermohonanAkun::with('verifikator:id,name');

        if ($statusFilter && $statusFilter !== 'all') {
            $query->where('status', $statusFilter);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nim', 'like', "%{$search}%")
                  ->orWhere('nama', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $permohonans = $query->latest()->paginate(10)->withQueryString();

        $counts = [
            'total' => PermohonanAkun::count(),
            'menunggu_verifikasi' => PermohonanAkun::where('status', 'menunggu_verifikasi')->count(),
            'disetujui' => PermohonanAkun::where('status', 'disetujui')->count(),
            'ditolak' => PermohonanAkun::where('status', 'ditolak')->count(),
        ];

        return Inertia::render('TU/PersetujuanAkun/Index', [
            'permohonans' => $permohonans,
            'counts' => $counts,
            'filters' => [
                'status' => $statusFilter,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Approve a student registration request, generate temp password, create user, and send email.
     */
    public function approve(PermohonanAkun $permohonan): RedirectResponse
    {
        if ($permohonan->status !== 'menunggu_verifikasi') {
            return back()->with('error', 'Permohonan ini tidak dalam status menunggu verifikasi.');
        }

        // Cek apakah akun dengan NIM atau email ini sudah dibuat sebelumnya
        $existingUser = User::where('nim', $permohonan->nim)->orWhere('email', $permohonan->email)->first();
        if ($existingUser) {
            $permohonan->update([
                'status' => 'disetujui',
                'diverifikasi_oleh' => Auth::id(),
                'diverifikasi_pada' => now(),
            ]);
            return back()->with('error', "User dengan NIM {$permohonan->nim} sudah terdaftar di sistem.");
        }

        // Cari program studi ID Teknik Informatika jika ada
        $prodi = ProgramStudi::where('nama', 'like', '%Informatika%')->first();
        $prodiId = $prodi ? $prodi->id : null;

        // Generate password sementara acak 8 karakter
        $tempPassword = Str::random(8);

        // Cari Dosen Wali jika nip_dosen_wali ada
        $dosenWali = null;
        if (! empty($permohonan->nip_dosen_wali)) {
            $dosenWali = User::where('nip', $permohonan->nip_dosen_wali)->where('role', 'dosen')->first();
        }

        // Buat akun user baru
        $user = User::create([
            'name' => $permohonan->nama,
            'email' => $permohonan->email,
            'password' => Hash::make($tempPassword),
            'role' => 'mahasiswa',
            'status_akun' => 'aktif',
            'nim' => $permohonan->nim,
            'angkatan' => $permohonan->angkatan,
            'program_studi_id' => $prodiId,
            'must_change_password' => true,
            'dosen_wali_id' => $dosenWali?->id,
        ]);

        // Update status permohonan menjadi disetujui
        $permohonan->update([
            'status' => 'disetujui',
            'diverifikasi_oleh' => Auth::id(),
            'diverifikasi_pada' => now(),
        ]);

        Log::info("KREDENSIAL MAHASISWA DIBUAT - NIM: {$permohonan->nim} | Email: {$permohonan->email} | Password Sementara: {$tempPassword}");

        // Kirim email kredensial ke email resmi mahasiswa
        try {
            Mail::to($permohonan->email)->send(new AkunMahasiswaDisetujuiMail(
                nama: $permohonan->nama,
                nim: $permohonan->nim,
                tempPassword: $tempPassword
            ));
            Log::info("Email aktivasi berhasil dikirim ke {$permohonan->email}");
        } catch (\Throwable $e) {
            Log::error("Gagal mengirim email kredensial mahasiswa: {$e->getMessage()}");
        }

        return back()->with('success', "Permohonan akun {$permohonan->nama} ({$permohonan->nim}) berhasil disetujui! Password sementara: {$tempPassword} (Kredensial dikirimkan ke {$permohonan->email})");
    }

    /**
     * Reject a student registration request with an optional reason.
     */
    public function reject(Request $request, PermohonanAkun $permohonan): RedirectResponse
    {
        if ($permohonan->status !== 'menunggu_verifikasi') {
            return back()->with('error', 'Permohonan ini tidak dalam status menunggu verifikasi.');
        }

        $request->validate([
            'catatan_tu' => ['nullable', 'string', 'max:500'],
        ]);

        $permohonan->update([
            'status' => 'ditolak',
            'catatan_tu' => $request->catatan_tu,
            'diverifikasi_oleh' => Auth::id(),
            'diverifikasi_pada' => now(),
        ]);

        return back()->with('success', "Permohonan akun {$permohonan->nama} ({$permohonan->nim}) telah ditolak.");
    }
}
