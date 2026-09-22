<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'max:128'],
            'role' => ['nullable', 'string', 'in:mahasiswa,dosen,prodi,tu,instansi'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $input = trim($this->input('email'));
        $isEmail = filter_var($input, FILTER_VALIDATE_EMAIL);

        $loginField = 'email';
        if (! $isEmail) {
            $foundUser = \App\Models\User::where('nip', $input)->orWhere('nim', $input)->first();
            if ($foundUser) {
                $loginField = ($foundUser->nip === $input) ? 'nip' : 'nim';
            } else {
                $loginField = (strlen($input) > 14) ? 'nip' : 'nim';
            }
        }

        $credentials = [$loginField => $input, 'password' => $this->string('password')];
        $authenticated = Auth::attempt($credentials, $this->boolean('remember'));

        // Fallback jika bukan email dan belum berhasil, coba field alternatif (nip atau nim)
        if (! $authenticated && ! $isEmail) {
            $altField = ($loginField === 'nim') ? 'nip' : 'nim';
            $authenticated = Auth::attempt([$altField => $input, 'password' => $this->string('password')], $this->boolean('remember'));
        }

        if (! $authenticated) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => 'Kredensial yang Anda masukkan tidak sesuai dengan data kami.',
            ]);
        }

        $user = Auth::user();

        if ($user && $user->status_akun === 'pending') {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => 'Akun Anda sedang menunggu verifikasi dari Tata Usaha (TU).',
            ]);
        }
        
        if ($user && $user->status_akun === 'ditolak') {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => 'Akun Anda telah ditolak oleh pihak program studi / TU.',
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
