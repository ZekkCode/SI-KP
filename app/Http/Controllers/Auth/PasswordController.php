<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        $isGoogleWithoutPassword = !empty($user->google_id) && !$user->has_set_password;

        if ($isGoogleWithoutPassword) {
            $validated = $request->validate([
                'password' => ['required', Password::defaults(), 'confirmed'],
            ]);
        } else {
            $validated = $request->validate([
                'current_password' => ['required', 'current_password'],
                'password' => ['required', Password::defaults(), 'confirmed'],
            ]);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
            'has_set_password' => true,
        ]);

        return back()->with('status', 'password-updated');
    }
}
