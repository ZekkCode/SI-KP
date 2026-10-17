<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Request $request): Response
    {
        $demoPassword = env('INITIAL_DEMO_PASSWORD', 'password');

        $demoCredentials = [
            'mahasiswa' => [
                'identifier' => (string) env('DEMO_MHS_NIM', '230411100092'),
                'email' => env('DEMO_MHS_EMAIL', '230411100092@student.trunojoyo.ac.id'),
                'name' => env('DEMO_MHS_NAMA', env('DEMO_MHS_NAME', 'Nabiilah Rizqi Amalia')),
                'password' => env('DEMO_MHS_PASSWORD', $demoPassword),
            ],
            'dosen' => [
                'identifier' => (string) env('DEMO_DOSEN_NIP', '198002022001'),
                'email' => env('DEMO_DOSEN_EMAIL', 'rika@dosen.com'),
                'name' => env('DEMO_DOSEN_NAME', 'Rika Yunitarini, S.T., M.T.'),
                'password' => env('DEMO_DOSEN_PASSWORD', $demoPassword),
            ],
            'tu' => [
                'identifier' => env('ADMIN_TU_EMAIL', 'tu@admin.com'),
                'email' => env('ADMIN_TU_EMAIL', 'tu@admin.com'),
                'name' => env('ADMIN_TU_NAME', 'Admin TU'),
                'password' => env('ADMIN_TU_PASSWORD', $demoPassword),
            ],
            'prodi' => [
                'identifier' => env('KOORDINATOR_PRODI_EMAIL', 'prodi@admin.com'),
                'email' => env('KOORDINATOR_PRODI_EMAIL', 'prodi@admin.com'),
                'name' => env('KOORDINATOR_PRODI_NAME', 'Koordinator Prodi'),
                'password' => env('KOORDINATOR_PRODI_PASSWORD', $demoPassword),
            ],
            'instansi' => [
                'identifier' => env('DEMO_MITRA_EMAIL', 'mitra@demo.com'),
                'email' => env('DEMO_MITRA_EMAIL', 'mitra@demo.com'),
                'name' => env('DEMO_MITRA_NAME', 'Bambang Sudarmono, S.T.'),
                'password' => env('DEMO_MITRA_PASSWORD', $demoPassword),
            ],
        ];

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'initialRole' => $request->query('role'),
            'demoCredentials' => $demoCredentials,
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        if ($user && $user->must_change_password) {
            return redirect()->route('password.force_change');
        }

        $dashboardRoute = $user->dashboardRoute();

        // Clear stale intended URL if it does not belong to the user's role prefix
        $intended = session()->get('url.intended');
        if ($intended) {
            $path = parse_url($intended, PHP_URL_PATH) ?? '';
            $rolePrefix = '/' . strtolower($user->role);
            if (!str_starts_with($path, $rolePrefix)) {
                session()->forget('url.intended');
            }
        }

        return redirect()->intended($dashboardRoute);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
