<?php

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
    Route::get('/dashboard', fn() => Inertia::render('Mahasiswa/Dashboard'))->name('dashboard');
    Route::get('/profil', fn() => Inertia::render('Mahasiswa/ProfilKP'))->name('profil');
    Route::get('/panduan', fn() => Inertia::render('Mahasiswa/Panduan'))->name('panduan');
    Route::get('/pendaftaran', fn() => Inertia::render('Mahasiswa/Pendaftaran'))->name('pendaftaran');
    Route::get('/status-pengajuan', fn() => Inertia::render('Mahasiswa/StatusPengajuan'))->name('status-pengajuan');
    Route::get('/surat-pengantar', fn() => Inertia::render('Mahasiswa/SuratPengantar'))->name('surat-pengantar');
    Route::get('/proposal', fn() => Inertia::render('Mahasiswa/Proposal'))->name('proposal');
    Route::get('/logbook', fn() => Inertia::render('Mahasiswa/LogbookHarian'))->name('logbook');
    Route::get('/berita-acara', fn() => Inertia::render('Mahasiswa/BeritaAcara'))->name('berita-acara');
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
    Route::get('/generate-surat', fn() => Inertia::render('TU/GenerateSurat'))->name('generate');
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
    Route::get('/reports', fn() => Inertia::render('Prodi/Reports'))->name('reports');
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
