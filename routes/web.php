<?php

use App\Http\Controllers\Mahasiswa\MahasiswaDashboardController;
use App\Http\Controllers\Mahasiswa\MahasiswaPendaftaranController;
use App\Http\Controllers\Mahasiswa\MahasiswaProfilController;
use App\Http\Controllers\Mahasiswa\MahasiswaProposalController;

use App\Http\Controllers\Mahasiswa\MahasiswaLogbookController;

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

// Halaman Panduan & Berkas Resmi KP
Route::get('/panduan', function () {
    return Inertia::render('Panduan');
})->name('panduan');

// Switch Language / Ganti Bahasa
Route::get('/locale/{locale}', function (string $locale) {
    if (in_array($locale, ['id', 'en'])) {
        session(['locale' => $locale]);
        app()->setLocale($locale);
        return back()->withCookie(cookie('locale', $locale, 60 * 24 * 365));
    }
    return back();
})->name('locale.switch');


// ============================================================
// MAHASISWA ROUTES
// ============================================================
Route::middleware(['auth', 'role:mahasiswa'])
    ->prefix('mahasiswa')
    ->name('mahasiswa.')
    ->group(function () {

        // Dashboard
        Route::get('/dashboard', [MahasiswaDashboardController::class, 'index'])
            ->name('dashboard');

        // Profil
        Route::put('/profil', [MahasiswaProfilController::class, 'update'])
            ->name('profil.update');

        // =========================
        // PENDAFTARAN
        // =========================
        Route::get('/pendaftaran', [MahasiswaPendaftaranController::class, 'index'])
            ->name('pendaftaran');

        Route::post('/pendaftaran', [MahasiswaPendaftaranController::class, 'store'])
            ->name('pendaftaran.store');

        Route::post('/pendaftaran/draft', [MahasiswaPendaftaranController::class, 'saveDraft'])
            ->name('pendaftaran.draft');

        Route::put('/pendaftaran/{pendaftaran}', [MahasiswaPendaftaranController::class, 'update'])
            ->name('pendaftaran.update');

        Route::delete('/pendaftaran/{pendaftaran}', [MahasiswaPendaftaranController::class, 'destroy'])
            ->name('pendaftaran.destroy');

        Route::post('/pendaftaran/{pendaftaran}/cancel', [MahasiswaPendaftaranController::class, 'cancel'])
            ->name('pendaftaran.cancel');

        Route::get('/pendaftaran/{pendaftaran}/download/{jenis}', [MahasiswaPendaftaranController::class, 'download'])
            ->name('pendaftaran.download');

        Route::get('/status-pengajuan', [MahasiswaPendaftaranController::class, 'statusPengajuan'])
            ->name('status-pengajuan');

        // =========================
        // SURAT PENGANTAR
        // =========================
        Route::get('/surat-pengantar', [App\Http\Controllers\Mahasiswa\MahasiswaSuratPengantarController::class, 'index'])
            ->name('surat-pengantar');

        Route::post('/surat-pengantar', [App\Http\Controllers\Mahasiswa\MahasiswaSuratPengantarController::class, 'store'])
            ->name('surat-pengantar.store');
        
        Route::get('/surat-pengantar/download',[App\Http\Controllers\Mahasiswa\MahasiswaSuratPengantarController::class,'download'])
            ->name('surat-pengantar.download');

        Route::post('/surat-pengantar/upload', [App\Http\Controllers\Mahasiswa\MahasiswaSuratPengantarController::class, 'upload'])
            ->name('surat-pengantar.upload');

        Route::get('/surat-pengantar/{id}/cetak', [App\Http\Controllers\Mahasiswa\MahasiswaSuratPengantarController::class, 'cetak'])
            ->name('surat-pengantar.cetak');
        // =========================
        // PROPOSAL
        // =========================
        Route::get('/proposal', [MahasiswaProposalController::class, 'index'])
            ->name('proposal');

        Route::post('/proposal', [MahasiswaProposalController::class, 'store'])
            ->name('proposal.store');

        Route::put('/proposal/{proposal}', [MahasiswaProposalController::class, 'update'])
            ->name('proposal.update');

        Route::delete('/proposal/{proposal}', [MahasiswaProposalController::class, 'destroy'])
            ->name('proposal.destroy');

        Route::get('/proposal/download/{proposal}', [MahasiswaProposalController::class, 'download'])
            ->name('proposal.download');

        Route::post('/proposal/note', [MahasiswaProposalController::class, 'sendNote'])
            ->name('proposal.note');

        // =========================
        // LOGBOOK
        // =========================
        Route::get('/logbook', [MahasiswaLogbookController::class, 'index'])
            ->name('logbook');

        Route::get('/logbook/create', [MahasiswaLogbookController::class, 'create'])
            ->name('logbook.create');

        Route::post('/logbook', [MahasiswaLogbookController::class, 'store'])
            ->name('logbook.store');

        Route::get('/logbook/{logbook}/edit', [MahasiswaLogbookController::class, 'edit'])
            ->name('logbook.edit');

        Route::put('/logbook/{logbook}', [MahasiswaLogbookController::class, 'update'])
            ->name('logbook.update');

        Route::delete('/logbook/{logbook}', [MahasiswaLogbookController::class, 'destroy'])
            ->name('logbook.destroy');

        // =========================
        // BERITA ACARA
        // =========================
        Route::get('/berita-acara',[App\Http\Controllers\Mahasiswa\MahasiswaBeritaAcaraController::class, 'index'])
            ->name('berita-acara');

        Route::post('/berita-acara',[App\Http\Controllers\Mahasiswa\MahasiswaBeritaAcaraController::class, 'store'])
            ->name('berita-acara.store');

        // =========================
        // DOKUMEN AKHIR
        // =========================
        Route::get('/dokumen-akhir', [App\Http\Controllers\Mahasiswa\MahasiswaDokumenAkhirController::class, 'index'])
            ->name('dokumen-akhir.index');
        Route::post('/dokumen-akhir', [App\Http\Controllers\Mahasiswa\MahasiswaDokumenAkhirController::class, 'store'])
            ->name('dokumen-akhir.store');

        // =========================
        // PENILAIAN
        // =========================
        Route::get('/penilaian', [App\Http\Controllers\Mahasiswa\MahasiswaPenilaianController::class, 'index'])
            ->name('penilaian.index');
        Route::get('/penilaian/cetak', [App\Http\Controllers\Mahasiswa\MahasiswaPenilaianController::class, 'cetak'])
            ->name('penilaian.cetak');
        Route::get('/penilaian/cetak-instansi', [App\Http\Controllers\Mahasiswa\MahasiswaPenilaianController::class, 'cetakInstansi'])
            ->name('penilaian.cetak-instansi');
    });

// ============================================================
// DOSEN ROUTES
// ============================================================
Route::middleware(['auth', 'role:dosen'])->prefix('dosen')->name('dosen.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Dosen\DosenDashboardController::class, 'index'])->name('dashboard');
    Route::get('/review-proposal', [App\Http\Controllers\Dosen\DosenProposalController::class, 'index'])->name('review');
    Route::get('/review-proposal/{id}', [App\Http\Controllers\Dosen\DosenProposalController::class, 'review'])->name('review.show');
    Route::put('/review-proposal/{id}', [App\Http\Controllers\Dosen\DosenProposalController::class, 'update'])->name('review.update');
    Route::get('/logbook', [App\Http\Controllers\Dosen\DosenLogbookController::class, 'index'])->name('logbook');
    Route::get('/logbook/{id}/review', [App\Http\Controllers\Dosen\DosenLogbookController::class, 'review'])->name('logbook.review');
    Route::put('/logbook/{id}', [App\Http\Controllers\Dosen\DosenLogbookController::class, 'update'])->name('logbook.update');
    Route::get('/penilaian', [App\Http\Controllers\Dosen\DosenPenilaianController::class, 'index'])->name('penilaian.index');
    Route::get('/penilaian/{pendaftaran}/nilai', [App\Http\Controllers\Dosen\DosenPenilaianController::class, 'create'])->name('penilaian.create');
    Route::post('/penilaian/{pendaftaran}', [App\Http\Controllers\Dosen\DosenPenilaianController::class, 'store'])->name('penilaian.store');
});

// ============================================================
// TU (TATA USAHA) ROUTES
// ============================================================
Route::middleware(['auth', 'role:tu'])->prefix('tu')->name('tu.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\TU\TUDashboardController::class, 'index'])->name('dashboard');
    Route::get('/verifikasi-pendaftaran', [\App\Http\Controllers\TU\TUVerifikasiPendaftaranController::class, 'index'])->name('verifikasi-pendaftaran');
    Route::post('/verifikasi-pendaftaran/{pendaftaran}/approve', [\App\Http\Controllers\TU\TUVerifikasiPendaftaranController::class, 'approve'])->name('verifikasi-pendaftaran.approve');
    Route::post('/verifikasi-pendaftaran/{pendaftaran}/reject', [\App\Http\Controllers\TU\TUVerifikasiPendaftaranController::class, 'reject'])->name('verifikasi-pendaftaran.reject');
    Route::get('/generate-surat', [App\Http\Controllers\TU\TUSuratPengantarController::class, 'index'])->name('generate');
    Route::post('/generate-surat/{id}/approve', [App\Http\Controllers\TU\TUSuratPengantarController::class, 'approve'])->name('generate.approve');
    Route::post('/generate-surat/{id}/reject', [App\Http\Controllers\TU\TUSuratPengantarController::class, 'reject'])->name('generate.reject');
    Route::get('/mahasiswa', [App\Http\Controllers\TU\TUMahasiswaController::class, 'index'])->name('mahasiswa');
    Route::put('/mahasiswa/{id}/verifikasi', [App\Http\Controllers\TU\TUMahasiswaController::class, 'verifyUser'])->name('mahasiswa.verifikasi');
    Route::get('/surat-balasan', [App\Http\Controllers\TU\TUSuratBalasanController::class, 'index'])->name('surat-balasan');
    Route::get('/surat-balasan/{pendaftaran}', [App\Http\Controllers\TU\TUSuratBalasanController::class, 'show'])->name('surat-balasan.show');
    Route::post('/surat-balasan/{pendaftaran}/approve', [App\Http\Controllers\TU\TUSuratBalasanController::class, 'approve'])->name('surat-balasan.approve');
    Route::post('/surat-balasan/{pendaftaran}/revisi', [App\Http\Controllers\TU\TUSuratBalasanController::class, 'revisi'])->name('surat-balasan.revisi');
    Route::get('/persetujuan-akun', [App\Http\Controllers\TU\TUPersetujuanAkunController::class, 'index'])->name('persetujuan-akun');
    Route::post('/persetujuan-akun/{permohonan}/approve', [App\Http\Controllers\TU\TUPersetujuanAkunController::class, 'approve'])->name('persetujuan-akun.approve');
    Route::post('/persetujuan-akun/{permohonan}/reject', [App\Http\Controllers\TU\TUPersetujuanAkunController::class, 'reject'])->name('persetujuan-akun.reject');
    Route::post('/persetujuan-akun/{permohonan}/resend-email', [App\Http\Controllers\TU\TUPersetujuanAkunController::class, 'resendEmail'])->name('persetujuan-akun.resend-email');
    Route::delete('/persetujuan-akun/{permohonan}', [App\Http\Controllers\TU\TUPersetujuanAkunController::class, 'destroy'])->name('persetujuan-akun.destroy');

    // Master Mahasiswa (Import & Kelola Data Master)
    Route::get('/master-mahasiswa', [\App\Http\Controllers\TU\TUMasterMahasiswaController::class, 'index'])->name('master-mahasiswa');
    Route::post('/master-mahasiswa', [\App\Http\Controllers\TU\TUMasterMahasiswaController::class, 'store'])->name('master-mahasiswa.store');
    Route::post('/master-mahasiswa/import', [\App\Http\Controllers\TU\TUMasterMahasiswaController::class, 'import'])->name('master-mahasiswa.import');
    Route::get('/master-mahasiswa/template', [\App\Http\Controllers\TU\TUMasterMahasiswaController::class, 'downloadTemplate'])->name('master-mahasiswa.template');
    Route::put('/master-mahasiswa/{masterMahasiswa}', [\App\Http\Controllers\TU\TUMasterMahasiswaController::class, 'update'])->name('master-mahasiswa.update');
    Route::delete('/master-mahasiswa/{masterMahasiswa}', [\App\Http\Controllers\TU\TUMasterMahasiswaController::class, 'destroy'])->name('master-mahasiswa.destroy');
    Route::delete('/master-mahasiswa-truncate', [\App\Http\Controllers\TU\TUMasterMahasiswaController::class, 'truncate'])->name('master-mahasiswa.truncate');
});

// ============================================================
// INSTANSI (EXTERNAL COMPANY) ROUTES
// ============================================================

Route::middleware(['auth', 'role:instansi'])->prefix('instansi')->name('instansi.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Instansi\InstansiDashboardController::class, 'index'])->name('dashboard');
    Route::get('/pendaftaran', [App\Http\Controllers\Instansi\InstansiPendaftaranController::class, 'index'])->name('pendaftaran');
    Route::put('/pendaftaran/{id}', [App\Http\Controllers\Instansi\InstansiPendaftaranController::class, 'update'])->name('pendaftaran.update');
    Route::get('/evaluation', [App\Http\Controllers\Instansi\InstansiPenilaianController::class, 'index'])->name('evaluation');
    Route::post('/evaluation/{id}', [App\Http\Controllers\Instansi\InstansiPenilaianController::class, 'store'])->name('evaluation.store');
    Route::get('/logbook', [App\Http\Controllers\Instansi\InstansiLogbookController::class, 'index'])->name('logbook');
    Route::get('/logbook/{id}/edit', [App\Http\Controllers\Instansi\InstansiLogbookController::class, 'edit'])->name('logbook.edit');
    Route::put('/logbook/{id}', [App\Http\Controllers\Instansi\InstansiLogbookController::class, 'update'])->name('logbook.update');
    Route::get('/certificates', fn() => Inertia::render('Instansi/Certificates'))->name('certificates');
    Route::get('/settings', fn() => Inertia::render('Instansi/Settings'))->name('settings');
});

// ============================================================
// PRODI (PROGRAM STUDI / COORDINATOR) ROUTES
// ============================================================
Route::middleware(['auth', 'role:prodi'])->prefix('prodi')->name('prodi.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Prodi\ProdiDashboardController::class, 'index'])->name('dashboard');
    Route::get('/dosen', [App\Http\Controllers\Prodi\ProdiDosenController::class, 'index'])->name('dosen.index');
    Route::get('/dosen/template', [App\Http\Controllers\Prodi\ProdiDosenController::class, 'downloadTemplate'])->name('dosen.template');
    Route::post('/dosen/import', [App\Http\Controllers\Prodi\ProdiDosenController::class, 'import'])->name('dosen.import');
    Route::post('/dosen/{dosen}/kirim-kredensial', [App\Http\Controllers\Prodi\ProdiDosenController::class, 'kirimKredensial'])->name('dosen.kirim-kredensial');
    Route::get('/dosen/create', [App\Http\Controllers\Prodi\ProdiDosenController::class, 'create'])->name('dosen.create');
    Route::post('/dosen', [App\Http\Controllers\Prodi\ProdiDosenController::class, 'store'])->name('dosen.store');
    Route::get('/dosen/{id}/edit', [App\Http\Controllers\Prodi\ProdiDosenController::class, 'edit'])->name('dosen.edit');
    Route::put('/dosen/{id}', [App\Http\Controllers\Prodi\ProdiDosenController::class, 'update'])->name('dosen.update');
    Route::delete('/dosen/{id}', [App\Http\Controllers\Prodi\ProdiDosenController::class, 'destroy'])->name('dosen.destroy');

    Route::get('/plotting', [App\Http\Controllers\Prodi\ProdiPlottingDosenController::class, 'index'])->name('plotting');
    Route::post('/plotting', [App\Http\Controllers\Prodi\ProdiPlottingDosenController::class, 'store'])->name('plotting.store');
    
    Route::get('/plotting-pl', [App\Http\Controllers\Prodi\ProdiPembagianPLController::class, 'index'])->name('plotting-pl');
    Route::post('/plotting-pl', [App\Http\Controllers\Prodi\ProdiPembagianPLController::class, 'store'])->name('plotting-pl.store');

    Route::get('/mahasiswa', [\App\Http\Controllers\Prodi\ProdiMahasiswaController::class, 'index'])->name('mahasiswa');
    
    Route::get('/periode', [App\Http\Controllers\Prodi\ProdiPeriodeController::class, 'index'])->name('periode');
    Route::post('/periode', [App\Http\Controllers\Prodi\ProdiPeriodeController::class, 'store'])->name('periode.store');
    Route::post('/periode/{id}', [App\Http\Controllers\Prodi\ProdiPeriodeController::class, 'update'])->name('periode.update');
    
    // Berita Acara
    Route::get('/berita-acara', [App\Http\Controllers\Prodi\ProdiBeritaAcaraController::class, 'index'])->name('berita-acara.index');
    Route::put('/berita-acara/{id}', [App\Http\Controllers\Prodi\ProdiBeritaAcaraController::class, 'update'])->name('berita-acara.update');
    Route::post('/berita-acara/{id}/approve', [App\Http\Controllers\Prodi\ProdiBeritaAcaraController::class, 'approve'])->name('berita-acara.approve');
    
    // Daftar Instansi
    Route::resource('instansi', App\Http\Controllers\Prodi\ProdiInstansiController::class)->except(['show']);

    // Pembimbing Lapangan
    Route::resource('pembimbing-lapangan', App\Http\Controllers\Prodi\ProdiPembimbingLapanganController::class)->except(['show']);
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
