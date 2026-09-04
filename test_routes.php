<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$roles = [
    'mahasiswa' => [
        'email' => 'budi.santoso@student.utn.ac.id',
        'routes' => [
            '/mahasiswa/dashboard',
            '/mahasiswa/pendaftaran',
            '/mahasiswa/status-pengajuan',
            '/mahasiswa/proposal',
            '/mahasiswa/surat-pengantar',
            '/mahasiswa/surat-balasan',
            '/mahasiswa/berita-acara',
            '/mahasiswa/penilaian-akhir',
        ],
    ],
    'dosen' => [
        'email' => 'dosen1@utn.ac.id',
        'routes' => [
            '/dosen/dashboard',
            '/dosen/review-proposal',
            '/dosen/logbook',
            '/dosen/grading',
        ],
    ],
    'tu' => [
        'email' => 'tu1@utn.ac.id',
        'routes' => [
            '/tu/dashboard',
            '/tu/verifikasi',
            '/tu/generate-surat',
            '/tu/mahasiswa',
            '/tu/validasi-berita',
            '/tu/surat-balasan',
        ],
    ],
    'prodi' => [
        'email' => 'prodi1@utn.ac.id',
        'routes' => [
            '/prodi/dashboard',
            '/prodi/lecturers',
            '/prodi/plotting',
            '/prodi/quota',
            '/prodi/verification',
            '/prodi/mahasiswa',
            '/prodi/reports',
            '/prodi/periode',
        ],
    ],
    'instansi' => [
        'email' => 'instansi1@company.com',
        'routes' => [
            '/instansi/dashboard',
            '/instansi/review',
            '/instansi/evaluation',
            '/instansi/logbook',
            '/instansi/certificates',
            '/instansi/settings',
        ],
    ],
];

$passed = 0;
$failed = 0;

foreach ($roles as $role => $data) {
    $user = App\Models\User::where('email', $data['email'])->first();
    if (!$user) {
        echo "❌ USER NOT FOUND: {$data['email']}\n";
        $failed++;
        continue;
    }

    echo "=== ROLE: strtoupper({$role}) ({$user->name}) ===\n";

    foreach ($data['routes'] as $path) {
        $request = Illuminate\Http\Request::create($path, 'GET');
        $request->setUserResolver(fn() => $user);
        
        // Login as user in Auth guard
        Illuminate\Support\Facades\Auth::setUser($user);

        try {
            $response = $kernel->handle($request);
            $status = $response->getStatusCode();
            if ($status === 200) {
                echo "  ✅ GET {$path} -> Status 200 OK\n";
                $passed++;
            } else {
                echo "  ❌ GET {$path} -> Status {$status}\n";
                $failed++;
            }
        } catch (\Throwable $e) {
            echo "  ❌ GET {$path} -> EXCEPTION: {$e->getMessage()}\n";
            $failed++;
        }
    }
}

echo "\n----------------------------------------\n";
echo "SUMMARY: {$passed} PASSED, {$failed} FAILED\n";

// Cleanup test file
