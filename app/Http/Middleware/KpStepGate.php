<?php

namespace App\Http\Middleware;

use App\Services\KpProgressService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class KpStepGate
{
    public function __construct(
        protected KpProgressService $progressService
    ) {}

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  int|string  $requiredStep
     */
    public function handle(Request $request, Closure $next, int|string $requiredStep): Response
    {
        $user = $request->user();

        // Gating hanya berlaku untuk role mahasiswa
        if (!$user || $user->role !== 'mahasiswa') {
            return $next($request);
        }

        $step = (int) $requiredStep;

        if (!$this->progressService->canAccessStep($user->id, $step)) {
            $progress = $this->progressService->getProgress($user->id);
            $currentStepInfo = $progress['current_step_info'] ?? null;
            $currentTitle = $currentStepInfo['title'] ?? "Tahap {$progress['current_step']}";

            $message = "Tahap ke-{$step} belum dapat diakses. Anda saat ini masih berada pada Tahap {$progress['current_step']} ({$currentTitle}). Silakan selesaikan tahapan tersebut terlebih dahulu.";

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => $message,
                    'current_step' => $progress['current_step'],
                    'max_unlocked_step' => $progress['max_unlocked_step'],
                ], 403);
            }

            return redirect()->route('mahasiswa.dashboard')->with('error', $message);
        }

        return $next($request);
    }
}
