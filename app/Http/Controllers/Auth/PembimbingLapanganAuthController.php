<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Instansi;
use App\Models\PembimbingLapangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PembimbingLapanganAuthController extends Controller
{
    public function create()
    {
        $instansis = Instansi::orderBy('nama', 'asc')->get();
        return Inertia::render('Auth/RegisterPL', [
            'instansis' => $instansis
        ]);
    }
    public function register(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'instansi_id' => 'required|exists:instansis,id',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|max:128|confirmed',
        ]);

        DB::beginTransaction();
        try {
            // 1. Validasi Whitelist
            $whitelist = PembimbingLapangan::where('nama', $request->nama)
                ->where('instansi_id', $request->instansi_id)
                ->whereNull('user_id') // Pastikan belum diklaim
                ->first();

            if (!$whitelist) {
                throw ValidationException::withMessages([
                    'nama' => 'Data Pembimbing Lapangan tidak terdaftar oleh Prodi atau akun telah diklaim.'
                ]);
            }

            // 2. Buat Akun
            $user = User::create([
                'name' => $request->nama,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'instansi', // Role untuk entitas eksternal
                'status_akun' => 'aktif', // Wajib diset langsung aktif karena sudah di-whitelist
            ]);

            // 3. Kaitkan Whitelist
            $whitelist->update(['user_id' => $user->id]);

            DB::commit();
            return redirect()->route('login')->with('status', 'Akun berhasil dibuat dan sudah aktif. Silakan login.');
        } catch (\Exception $e) {
            DB::rollBack();
            if ($e instanceof ValidationException) {
                throw $e;
            }
            return back()->withErrors(['error' => 'Terjadi kesalahan saat registrasi: ' . $e->getMessage()]);
        }
    }
}
