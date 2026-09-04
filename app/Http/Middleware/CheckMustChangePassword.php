<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckMustChangePassword
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && $user->must_change_password) {
            // Rute yang diizinkan saat wajib ganti password
            $allowedRoutes = [
                'password.force_change',
                'password.force_change.update',
                'logout',
            ];

            if (! in_array($request->route()?->getName(), $allowedRoutes)) {
                return redirect()->route('password.force_change');
            }
        }

        return $next($request);
    }
}
