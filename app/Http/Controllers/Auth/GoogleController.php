<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')
            ->with(['prompt' => 'select_account'])
            ->redirect();
    }

    /**
     * Obtain the user information from Google and log them in.
     */
    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            // Cari user berdasarkan google_id atau email
            $user = User::where('google_id', $googleUser->id)
                ->orWhere('email', $googleUser->email)
                ->first();

            if (!$user) {
                return redirect()->route('login')->withErrors([
                    'email' => 'Email Google Anda (' . $googleUser->email . ') tidak terdaftar di sistem. Silakan daftarkan akun Anda terlebih dahulu.',
                ]);
            }

            // Jika google_id belum di-link, hubungkan sekarang
            if (empty($user->google_id)) {
                $user->update([
                    'google_id' => $googleUser->id,
                    'google_token' => $googleUser->token,
                ]);
            } else {
                // Update token google terbaru
                $user->update([
                    'google_token' => $googleUser->token,
                ]);
            }

            // Validasi status_akun
            if ($user->status_akun !== 'aktif') {
                $message = $user->status_akun === 'pending' 
                    ? 'Akun Anda sedang menunggu verifikasi dari Admin TU sebelum dapat login.' 
                    : 'Akun Anda ditolak oleh Admin TU. Silakan hubungi program studi.';

                return redirect()->route('login')->with('status', $message);
            }

            // Login user
            Auth::login($user, true);
            request()->session()->regenerate();

            // Redirect ke dashboard masing-masing role
            return redirect()->intended($user->dashboardRoute());

        } catch (Exception $e) {
            logger()->error('Google Login Error: ' . $e->getMessage(), ['exception' => $e]);
            return redirect()->route('login')->withErrors([
                'email' => 'Terjadi kesalahan saat masuk menggunakan Google. Detail: ' . $e->getMessage(),
            ]);
        }
    }
}
