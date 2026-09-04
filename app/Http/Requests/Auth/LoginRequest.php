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
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
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
        $role = $this->filled('role') ? strtolower($this->string('role')) : null;

        $loginField = 'email';
        if (! $isEmail) {
            if ($role === 'dosen' || $role === 'tu' || $role === 'prodi') {
                $loginField = 'nip';
            } elseif ($role === 'mahasiswa') {
                $loginField = 'nim';
            } else {
                $foundUser = \App\Models\User::where('nip', $input)->orWhere('nim', $input)->first();
                $loginField = ($foundUser && $foundUser->nip === $input) ? 'nip' : 'nim';
            }
        }

        if (! Auth::attempt([$loginField => $input, 'password' => $this->string('password')], $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        $user = Auth::user();

        // Validasi kesesuaian role jika role dikirim dari pilihan form login
        if ($this->filled('role')) {
            $expectedRole = strtolower($this->string('role'));
            $actualRole = strtolower($user->role ?? '');

            if ($actualRole !== $expectedRole) {
                Auth::logout();
                $roleLabels = [
                    'mahasiswa' => 'Mahasiswa',
                    'dosen' => 'Dosen Pembimbing',
                    'prodi' => 'Koordinator Kerja Praktik (KP)',
                    'tu' => 'Tata Usaha (TU)',
                    'instansi' => 'Pembimbing Lapangan (Instansi)',
                ];

                $actualLabel = $roleLabels[$actualRole] ?? strtoupper($actualRole);
                $expectedLabel = $roleLabels[$expectedRole] ?? strtoupper($expectedRole);

                throw ValidationException::withMessages([
                    'email' => "Akun ini terdaftar sebagai {$actualLabel}, bukan {$expectedLabel}. Silakan masuk melalui menu kotak login {$actualLabel}.",
                ]);
            }
        }

        if ($user && $user->status_akun === 'pending') {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => 'Akun Anda sedang menunggu verifikasi dari Admin TU.',
            ]);
        }
        
        if ($user && $user->status_akun === 'ditolak') {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => 'Akun Anda telah ditolak oleh Admin TU.',
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
