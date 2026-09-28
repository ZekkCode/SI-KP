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
        'ttd_path' => env('DEKAN_TTD_PATH', 'assets/img/ttd-dekan.png'),
    ],

    'kaprodi' => [
        'nama' => env('KAPRODI_NAMA', 'Dr. Achmad Jauhari, S.T., M.Kom.'),
        'nip' => env('KAPRODI_NIP', '1970010120000001'),
        'ttd_path' => env('KAPRODI_TTD_PATH', null),
    ],
];
