<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * Checks if the authenticated user has the required role.
     * Usage in routes: middleware('role:mahasiswa')
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'Akses ditolak. Anda belum login.');
        }

        if (strtolower($role) === 'superadmin' || strtolower($role) === 'admin') {
            if (!$user->isSuperAdmin()) {
                abort(403, 'Akses ditolak. Anda tidak memiliki izin Super Administrator.');
            }
            return $next($request);
        }

        if (!$user->hasRole($role)) {
            abort(403, 'Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini.');
        }

        return $next($request);
    }
}
