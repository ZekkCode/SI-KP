<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Auto-cleanup stale public/hot file if Vite dev server is offline
        if ($this->app->environment('local') && file_exists(public_path('hot'))) {
            $hotContent = trim((string) @file_get_contents(public_path('hot')));
            $parts = parse_url($hotContent);
            $host = $parts['host'] ?? '127.0.0.1';
            $port = (int) ($parts['port'] ?? 5173);

            $targetHost = ($host === '[::1]' || $host === '::1') ? '127.0.0.1' : $host;
            $fp = @fsockopen($targetHost, $port, $errno, $errstr, 0.1);
            if (! $fp && ($host === '[::1]' || $host === '::1')) {
                $fp = @fsockopen('::1', $port, $errno, $errstr, 0.1);
            }

            if ($fp) {
                fclose($fp);
            } else {
                // Vite dev server is offline, fallback safely to production build assets
                if (file_exists(public_path('build/manifest.json'))) {
                    @unlink(public_path('hot'));
                }
            }
        }
    }
}
