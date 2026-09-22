<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        // Eager-load programStudi for mahasiswa/dosen users
        if ($user && in_array($user->role, ['mahasiswa', 'dosen', 'prodi'])) {
            $user->load(['programStudi', 'notifikasis']);
        } else if ($user) {
            $user->load('notifikasis');
        }

        $locale = $request->session()->get('locale')
            ?? $request->cookie('locale')
            ?? config('app.locale', 'id');

        if (! in_array($locale, ['id', 'en'])) {
            $locale = 'id';
        }

        app()->setLocale($locale);


        $translations = trans('app', [], $locale);
        if (! is_array($translations)) {
            $translations = [];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'notifications' => $user ? $user->notifikasis()->latest()->take(5)->get() : [],
            ],
            'locale' => $locale,
            'translations' => $translations,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'campus' => [
                'name' => config('app.campus_name'),
                'address' => config('app.campus_address'),
                'phone' => config('app.campus_phone'),
                'email' => config('app.campus_email'),
            ],
        ];
    }

}
