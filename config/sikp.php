<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Minimal SKS Kerja Praktik
    |--------------------------------------------------------------------------
    |
    | Batas minimal SKS kelulusan yang ditempuh mahasiswa untuk mengajukan KP.
    | Default sistem diubah dari 100 SKS menjadi 80 SKS.
    |
    */
    'min_sks' => (int) env('KP_MIN_SKS', 80),

    /*
    |--------------------------------------------------------------------------
    | Pejabat dan Tanda Tangan Digital
    |--------------------------------------------------------------------------
    |
    | Konfigurasi data Dekan dan Koordinator Program Studi untuk penerbitan
    | dokumen resmi, surat pengantar, dan berita acara.
    |
    */
    'dekan' => [
        'nama' => env('DEKAN_NAMA', 'Ari Basuki, S.T., M.T.'),
        'nip' => env('DEKAN_NIP', '197801202003121002'),
        'jabatan' => 'Dekan Fakultas Teknik',
        'ttd_path' => env('DEKAN_TTD_PATH', 'assets/img/ttd-dekan.png'),
    ],

    'kaprodi' => [
        'nama' => env('KAPRODI_NAMA', 'Dr. Achmad Jauhari, S.T., M.Kom.'),
        'nip' => env('KAPRODI_NIP', '1970010120000001'),
        'jabatan' => 'Koordinator Program Studi Teknik Informatika',
        'ttd_path' => env('KAPRODI_TTD_PATH', 'assets/img/ttd-kaprodi.png'),
    ],

    'koordinator_kp' => [
        'nama' => env('KOORDINATOR_KP_NAMA', 'Achmad Jauhari, S.T., M.Kom.'),
        'nip' => env('KOORDINATOR_KP_NIP', '1970010120000001'),
        'jabatan' => 'Koordinator Kerja Praktik',
        'ttd_path' => env('KOORDINATOR_KP_TTD_PATH', null),
    ],

    'demo_password' => env('INITIAL_DEMO_PASSWORD', 'password'),

    'demo_credentials' => [
        'mahasiswa' => [
            'identifier' => (string) env('DEMO_MHS_NIM', '230411100092'),
            'email' => env('DEMO_MHS_EMAIL', '230411100092@student.trunojoyo.ac.id'),
            'name' => env('DEMO_MHS_NAMA', env('DEMO_MHS_NAME', 'Nabiilah Rizqi Amalia')),
            'password' => env('DEMO_MHS_PASSWORD', env('INITIAL_DEMO_PASSWORD', 'password')),
        ],
        'dosen' => [
            'identifier' => (string) env('DEMO_DOSEN_NIP', '198002022001'),
            'email' => env('DEMO_DOSEN_EMAIL', 'rika@dosen.com'),
            'name' => env('DEMO_DOSEN_NAME', 'Rika Yunitarini, S.T., M.T.'),
            'password' => env('DEMO_DOSEN_PASSWORD', env('INITIAL_DEMO_PASSWORD', 'password')),
        ],
        'tu' => [
            'identifier' => env('ADMIN_TU_EMAIL', 'tu@admin.com'),
            'email' => env('ADMIN_TU_EMAIL', 'tu@admin.com'),
            'name' => env('ADMIN_TU_NAME', 'Admin TU'),
            'password' => env('ADMIN_TU_PASSWORD', env('INITIAL_DEMO_PASSWORD', 'password')),
        ],
        'prodi' => [
            'identifier' => env('KOORDINATOR_PRODI_EMAIL', 'prodi@admin.com'),
            'email' => env('KOORDINATOR_PRODI_EMAIL', 'prodi@admin.com'),
            'name' => env('KOORDINATOR_PRODI_NAME', 'Koordinator Prodi'),
            'password' => env('KOORDINATOR_PRODI_PASSWORD', env('INITIAL_DEMO_PASSWORD', 'password')),
        ],
        'instansi' => [
            'identifier' => env('DEMO_MITRA_EMAIL', 'mitra@demo.com'),
            'email' => env('DEMO_MITRA_EMAIL', 'mitra@demo.com'),
            'name' => env('DEMO_MITRA_NAME', 'Bambang Sudarmono, S.T.'),
            'password' => env('DEMO_MITRA_PASSWORD', env('INITIAL_DEMO_PASSWORD', 'password')),
        ],
    ],
];
