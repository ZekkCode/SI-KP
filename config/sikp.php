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
        'nama' => env('DEKAN_NAMA', 'Prof. Dr. Ir. Dekan Teknik, M.T.'),
        'nip' => env('DEKAN_NIP', '197501012000031001'),
        'ttd_path' => env('DEKAN_TTD_PATH', null),
    ],

    'kaprodi' => [
        'nama' => env('KAPRODI_NAMA', 'Dr. Achmad Jauhari, S.T., M.Kom.'),
        'nip' => env('KAPRODI_NIP', '1970010120000001'),
        'ttd_path' => env('KAPRODI_TTD_PATH', null),
    ],
];
