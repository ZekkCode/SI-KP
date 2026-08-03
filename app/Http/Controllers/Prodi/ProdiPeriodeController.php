<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\PeriodeKp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProdiPeriodeController extends Controller
{
    public function index(Request $request): Response
    {
        $selectedId = $request->query('id');
        $periodes = PeriodeKp::orderByDesc('created_at')->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'semester' => $p->semester,
                'tanggal_pendaftaran' => $p->tanggal_pendaftaran?->format('Y-m-d'),
                'tanggal_batas_pendaftaran' => $p->tanggal_batas_pendaftaran?->format('Y-m-d'),
                'tanggal_batas_pengajuan_surat' => $p->tanggal_batas_pengajuan_surat?->format('Y-m-d'),
                'tanggal_pendaftaran_formatted' => $p->tanggal_pendaftaran?->translatedFormat('d F Y') ?? $p->tanggal_pendaftaran?->format('d M Y'),
                'tanggal_batas_pendaftaran_formatted' => $p->tanggal_batas_pendaftaran?->translatedFormat('d F Y') ?? $p->tanggal_batas_pendaftaran?->format('d M Y'),
                'tanggal_batas_pengajuan_surat_formatted' => $p->tanggal_batas_pengajuan_surat?->translatedFormat('d F Y') ?? $p->tanggal_batas_pengajuan_surat?->format('d M Y'),
            ];
        });

        $selectedPeriode = null;
        if ($selectedId) {
            $p = PeriodeKp::find($selectedId);
            if ($p) {
                $selectedPeriode = [
                    'id' => $p->id,
                    'semester' => $p->semester,
                    'tanggal_pendaftaran' => $p->tanggal_pendaftaran?->format('Y-m-d'),
                    'tanggal_batas_pendaftaran' => $p->tanggal_batas_pendaftaran?->format('Y-m-d'),
                    'tanggal_batas_pengajuan_surat' => $p->tanggal_batas_pengajuan_surat?->format('Y-m-d'),
                ];
            }
        }

        return Inertia::render('Prodi/PeriodeKP', [
            'periodes' => $periodes,
            'selectedPeriode' => $selectedPeriode,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'semester' => ['required', 'string', 'max:255'],
            'tanggal_pendaftaran' => ['required', 'date'],
            'tanggal_batas_pendaftaran' => ['required', 'date', 'after_or_equal:tanggal_pendaftaran'],
            'tanggal_batas_pengajuan_surat' => ['required', 'date', 'after_or_equal:tanggal_pendaftaran'],
        ], [
            'semester.required' => 'Semester wajib diisi.',
            'tanggal_pendaftaran.required' => 'Tanggal pendaftaran wajib diisi.',
            'tanggal_batas_pendaftaran.required' => 'Tanggal batas pendaftaran wajib diisi.',
            'tanggal_batas_pendaftaran.after_or_equal' => 'Tanggal batas pendaftaran harus setelah atau sama dengan tanggal pendaftaran.',
            'tanggal_batas_pengajuan_surat.required' => 'Tanggal batas pengajuan surat wajib diisi.',
            'tanggal_batas_pengajuan_surat.after_or_equal' => 'Tanggal batas pengajuan surat harus setelah atau sama dengan tanggal pendaftaran.',
        ]);

        PeriodeKp::create($validated);

        return redirect()
            ->route('prodi.periode')
            ->with('success', 'Periode pendaftaran KP berhasil ditambahkan!');
    }

    public function update(Request $request, $id): RedirectResponse
    {
        $periode = PeriodeKp::findOrFail($id);

        $validated = $request->validate([
            'semester' => ['required', 'string', 'max:255'],
            'tanggal_pendaftaran' => ['required', 'date'],
            'tanggal_batas_pendaftaran' => ['required', 'date', 'after_or_equal:tanggal_pendaftaran'],
            'tanggal_batas_pengajuan_surat' => ['required', 'date', 'after_or_equal:tanggal_pendaftaran'],
        ], [
            'semester.required' => 'Semester wajib diisi.',
            'tanggal_pendaftaran.required' => 'Tanggal pendaftaran wajib diisi.',
            'tanggal_batas_pendaftaran.required' => 'Tanggal batas pendaftaran wajib diisi.',
            'tanggal_batas_pendaftaran.after_or_equal' => 'Tanggal batas pendaftaran harus setelah atau sama dengan tanggal pendaftaran.',
            'tanggal_batas_pengajuan_surat.required' => 'Tanggal batas pengajuan surat wajib diisi.',
            'tanggal_batas_pengajuan_surat.after_or_equal' => 'Tanggal batas pengajuan surat harus setelah atau sama dengan tanggal pendaftaran.',
        ]);

        $periode->update($validated);

        return redirect()
            ->route('prodi.periode')
            ->with('success', 'Periode pendaftaran KP berhasil diperbarui!');
    }
}
