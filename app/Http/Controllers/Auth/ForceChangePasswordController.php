<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ForceChangePasswordController extends Controller
{
    /**
     * Display the first-time password change view.
     */
    public function create(): Response|RedirectResponse
    {
        $user = Auth::user();

        // Jika user tidak wajib ganti password, kembalikan ke dashboard mereka
        if (! $user || ! $user->must_change_password) {
            return redirect($user ? $user->dashboardRoute() : '/login');
        }

        return Inertia::render('Auth/ForceChangePassword', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'nim' => $user->nim,
                'is_google' => !empty($user->google_id) && !$user->has_set_password,
            ],
        ]);
    }

    /**
     * Handle the password update request.
     *
     * @throws ValidationException
     */
    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if (! $user) {
            return redirect('/login');
        }

        $isGoogleWithoutKnownPassword = !empty($user->google_id) && !$user->has_set_password;

        $rules = [
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
        ];

        if (! $isGoogleWithoutKnownPassword) {
            $rules['current_password'] = ['required', 'string'];
        } else {
            $rules['current_password'] = ['nullable', 'string'];
        }

        $request->validate($rules, [
            'current_password.required' => 'Password lama/sementara wajib diisi.',
            'password.required' => 'Password baru wajib diisi.',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
        ]);

        // Verifikasi password lama / sementara jika bukan user Google SSO baru
        if (! $isGoogleWithoutKnownPassword) {
            if (! Hash::check($request->current_password, $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => 'Password sementara yang Anda masukkan salah.',
                ]);
            }
        }

        // Update password baru & hilangkan flag must_change_password
        $user->update([
            'password' => Hash::make($request->password),
            'must_change_password' => false,
            'has_set_password' => true,
        ]);

        // Hapus rekaman password sementara di permohonan karena mahasiswa sudah mengatur password pribadinya
        if ($user->nim) {
            \App\Models\PermohonanAkun::where('nim', $user->nim)->update([
                'password_sementara' => null,
            ]);
        }

        return redirect($user->dashboardRoute())->with('success', 'Password Anda berhasil diperbarui! Selamat datang di Sistem Informasi Kerja Praktik.');
    }
}
