<?php

use App\Http\Controllers\Mahasiswa\MahasiswaDashboardController;
use App\Http\Controllers\Mahasiswa\MahasiswaPendaftaranController;
use App\Http\Controllers\Mahasiswa\MahasiswaProfilController;
use App\Http\Controllers\Mahasiswa\MahasiswaProposalController;

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes - Sistem Informasi Kerja Praktik (SIKP)
|--------------------------------------------------------------------------
*/

// Root redirect to login or dashboard
Route::get('/', function (Illuminate\Http\Request $request) {
    if ($user = $request->user()) {
        return redirect($user->dashboardRoute());
    }
    return redirect()->route('login');
});

// ============================================================
// MAHASISWA ROUTES
// ============================================================
Route::middleware(['auth', 'role:mahasiswa'])->prefix('mahasiswa')->name('mahasiswa.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [MahasiswaDashboardController::class, 'index'])->name('dashboard');

    // Profil
    Route::put('/profil', [MahasiswaProfilController::class, 'update'])->name('profil.update');


    // Pendaftaran
    Route::get('/pendaftaran', [MahasiswaPendaftaranController::class, 'index'])->name('pendaftaran');
    Route::post('/pendaftaran', [MahasiswaPendaftaranController::class, 'store'])->name('pendaftaran.store');
    Route::post('/pendaftaran/draft', [MahasiswaPendaftaranController::class, 'saveDraft'])->name('pendaftaran.draft');

    // Status Pengajuan
    Route::get('/status-pengajuan', fn() => Inertia::render('Mahasiswa/StatusPengajuan'))->name('status-pengajuan');

    // Surat Pengantar
    Route::get('/surat-pengantar', [App\Http\Controllers\Mahasiswa\MahasiswaSuratPengantarController::class, 'index'])->name('surat-pengantar');
    Route::post('/surat-pengantar', [App\Http\Controllers\Mahasiswa\MahasiswaSuratPengantarController::class, 'store'])->name('surat-pengantar.store');

    // Proposal
    Route::get('/proposal', [MahasiswaProposalController::class, 'index'])->name('proposal');
    Route::post('/proposal', [MahasiswaProposalController::class, 'store'])->name('proposal.store');
    Route::post('/proposal/note', [MahasiswaProposalController::class, 'sendNote'])->name('proposal.note');



    // Berita Acara
    Route::get('/berita-acara', fn() => Inertia::render('Mahasiswa/BeritaAcara'))->name('berita-acara');

    // Penilaian Akhir
    Route::get('/penilaian-akhir', fn() => Inertia::render('Mahasiswa/PenilaianAkhir'))->name('penilaian-akhir');
});

// ============================================================
// DOSEN ROUTES
// ============================================================
Route::middleware(['auth', 'role:dosen'])->prefix('dosen')->name('dosen.')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dosen/Dashboard'))->name('dashboard');
    Route::get('/review-proposal', fn() => Inertia::render('Dosen/ReviewProposal'))->name('review');
    Route::get('/logbook', fn() => Inertia::render('Dosen/Logbook'))->name('logbook');
    Route::get('/grading', fn() => Inertia::render('Dosen/Grading'))->name('grading');
});

// ============================================================
// TU (TATA USAHA) ROUTES
// ============================================================
Route::middleware(['auth', 'role:tu'])->prefix('tu')->name('tu.')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('TU/Dashboard'))->name('dashboard');
    Route::get('/verifikasi', fn() => Inertia::render('TU/Verifikasi'))->name('verifikasi');
    Route::get('/generate-surat', [App\Http\Controllers\TU\TUSuratPengantarController::class, 'index'])->name('generate');
    Route::post('/generate-surat/{id}/approve', [App\Http\Controllers\TU\TUSuratPengantarController::class, 'approve'])->name('generate.approve');
    Route::post('/generate-surat/{id}/reject', [App\Http\Controllers\TU\TUSuratPengantarController::class, 'reject'])->name('generate.reject');
    Route::get('/mahasiswa', [App\Http\Controllers\TU\TUMahasiswaController::class, 'index'])->name('mahasiswa');
    Route::get('/validasi-berita', fn() => Inertia::render('TU/ValidasiBerita'))->name('validasi');
});

// ============================================================
// INSTANSI (EXTERNAL COMPANY) ROUTES
// ============================================================
Route::prefix('instansi')->name('instansi.')->group(function () {
    Route::get('/registration', fn() => Inertia::render('Instansi/Registration'))->name('registration');
});

Route::middleware(['auth', 'role:instansi'])->prefix('instansi')->name('instansi.')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Instansi/Dashboard'))->name('dashboard');
    Route::get('/review', fn() => Inertia::render('Instansi/ReviewApplication'))->name('review');
    Route::get('/evaluation', fn() => Inertia::render('Instansi/Evaluation'))->name('evaluation');
    Route::get('/logbook', fn() => Inertia::render('Instansi/Logbook'))->name('logbook');
    Route::get('/certificates', fn() => Inertia::render('Instansi/Certificates'))->name('certificates');
    Route::get('/settings', fn() => Inertia::render('Instansi/Settings'))->name('settings');
});

// ============================================================
// PRODI (PROGRAM STUDI / COORDINATOR) ROUTES
// ============================================================
Route::middleware(['auth', 'role:prodi'])->prefix('prodi')->name('prodi.')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Prodi/Dashboard'))->name('dashboard');
    Route::get('/lecturers', fn() => Inertia::render('Prodi/LecturerDatabase'))->name('lecturers');
    Route::get('/plotting', fn() => Inertia::render('Prodi/SupervisorPlotting'))->name('plotting');
    Route::get('/quota', fn() => Inertia::render('Prodi/QuotaManagement'))->name('quota');
    Route::get('/verification', fn() => Inertia::render('Prodi/StudentVerification'))->name('verification');
    Route::get('/mahasiswa', fn() => Inertia::render('Prodi/Students'))->name('mahasiswa');
    Route::get('/reports', fn() => Inertia::render('Prodi/Reports'))->name('reports');
    Route::get('/periode', [App\Http\Controllers\Prodi\ProdiPeriodeController::class, 'index'])->name('periode');
    Route::post('/periode', [App\Http\Controllers\Prodi\ProdiPeriodeController::class, 'store'])->name('periode.store');
    Route::post('/periode/{id}', [App\Http\Controllers\Prodi\ProdiPeriodeController::class, 'update'])->name('periode.update');
});

// ============================================================
// PROFILE ROUTES (shared, from Breeze)
// ============================================================
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
