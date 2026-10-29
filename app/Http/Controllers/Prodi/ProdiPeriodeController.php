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
    /**
     * Tampilkan daftar dan form konfigurasi periode KP.
     */
    public function index(Request $request): Response
    {
        $selectedId = $request->query('id');
        $now = now()->startOfDay();

        $periodes = PeriodeKp::orderByDesc('tanggal_pendaftaran')
            ->orderByDesc('id')
            ->get()
            ->map(function ($p) use ($now) {
                $tglMulai = $p->tanggal_pendaftaran ? $p->tanggal_pendaftaran->startOfDay() : null;
                $tglBatas = $p->tanggal_batas_pendaftaran ? $p->tanggal_batas_pendaftaran->endOfDay() : null;

                $status = 'selesai';
                if ($tglMulai && $now->lt($tglMulai)) {
                    $status = 'mendatang';
                } elseif ($tglMulai && $tglBatas && $now->betweenIncluded($tglMulai, $tglBatas)) {
                    $status = 'aktif';
                }

                return [
                    'id' => $p->id,
                    'semester' => $p->semester,
                    'status' => $status,
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
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Simpan periode KP baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'semester' => ['required', 'string', 'max:255'],
            'tanggal_pendaftaran' => ['required', 'date'],
            'tanggal_batas_pendaftaran' => ['required', 'date', 'after_or_equal:tanggal_pendaftaran'],
            'tanggal_batas_pengajuan_surat' => ['required', 'date', 'after_or_equal:tanggal_pendaftaran'],
        ], [
            'semester.required' => 'Semester wajib dipilih atau diisi.',
            'tanggal_pendaftaran.required' => 'Tanggal pembukaan pendaftaran wajib diisi.',
            'tanggal_pendaftaran.date' => 'Format tanggal pembukaan pendaftaran tidak valid.',
            'tanggal_batas_pendaftaran.required' => 'Tanggal batas akhir pendaftaran wajib diisi.',
            'tanggal_batas_pendaftaran.date' => 'Format tanggal batas pendaftaran tidak valid.',
            'tanggal_batas_pendaftaran.after_or_equal' => 'Tanggal batas pendaftaran tidak boleh sebelum tanggal pembukaan pendaftaran.',
            'tanggal_batas_pengajuan_surat.required' => 'Tanggal batas pengajuan surat wajib diisi.',
            'tanggal_batas_pengajuan_surat.date' => 'Format tanggal batas pengajuan surat tidak valid.',
            'tanggal_batas_pengajuan_surat.after_or_equal' => 'Tanggal batas pengajuan surat tidak boleh sebelum tanggal pembukaan pendaftaran.',
        ]);

        PeriodeKp::create($validated);

        return redirect()
            ->route('prodi.periode')
            ->with('success', "Periode pendaftaran KP '{$validated['semester']}' berhasil disimpan!");
    }

    /**
     * Perbarui data periode KP yang sudah ada.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $periode = PeriodeKp::findOrFail($id);

        $validated = $request->validate([
            'semester' => ['required', 'string', 'max:255'],
            'tanggal_pendaftaran' => ['required', 'date'],
            'tanggal_batas_pendaftaran' => ['required', 'date', 'after_or_equal:tanggal_pendaftaran'],
            'tanggal_batas_pengajuan_surat' => ['required', 'date', 'after_or_equal:tanggal_pendaftaran'],
        ], [
            'semester.required' => 'Semester wajib dipilih atau diisi.',
            'tanggal_pendaftaran.required' => 'Tanggal pembukaan pendaftaran wajib diisi.',
            'tanggal_pendaftaran.date' => 'Format tanggal pembukaan pendaftaran tidak valid.',
            'tanggal_batas_pendaftaran.required' => 'Tanggal batas akhir pendaftaran wajib diisi.',
            'tanggal_batas_pendaftaran.date' => 'Format tanggal batas pendaftaran tidak valid.',
            'tanggal_batas_pendaftaran.after_or_equal' => 'Tanggal batas pendaftaran tidak boleh sebelum tanggal pembukaan pendaftaran.',
            'tanggal_batas_pengajuan_surat.required' => 'Tanggal batas pengajuan surat wajib diisi.',
            'tanggal_batas_pengajuan_surat.date' => 'Format tanggal batas pengajuan surat tidak valid.',
            'tanggal_batas_pengajuan_surat.after_or_equal' => 'Tanggal batas pengajuan surat tidak boleh sebelum tanggal pembukaan pendaftaran.',
        ]);

        $periode->update($validated);

        return redirect()
            ->route('prodi.periode')
            ->with('success', "Periode pendaftaran KP '{$periode->semester}' berhasil diperbarui!");
    }

    /**
     * Hapus periode KP.
     */
    public function destroy($id): RedirectResponse
    {
        $periode = PeriodeKp::findOrFail($id);
        $semester = $periode->semester;
        $periode->delete();

        return redirect()
            ->route('prodi.periode')
            ->with('success', "Periode pendaftaran KP '{$semester}' berhasil dihapus!");
    }
}
