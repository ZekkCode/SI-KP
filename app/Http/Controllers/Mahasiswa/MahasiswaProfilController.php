<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaProfilController extends Controller
{
    /**
     * Display the mahasiswa profile form.
     */
    public function index(Request $request): Response
    {
        // ProgramStudi relationship is eager loaded in HandleInertiaRequests middleware
        return Inertia::render('Mahasiswa/ProfilKP');
    }

    /**
     * Update the mahasiswa profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'no_telepon' => ['required', 'string', 'max:20'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email,'.$request->user()->id],
            'konsentrasi' => ['required', 'string', 'max:100'],
            'total_sks' => ['required', 'integer', 'min:0'],
        ]);

        $request->user()->fill($validated);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return redirect()->route('mahasiswa.pendaftaran')->with('success', 'Profil Kerja Praktik berhasil diperbarui!');
    }
}
