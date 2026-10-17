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
        $demoCredentials = config('sikp.demo_credentials');

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
