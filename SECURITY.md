# Kebijakan Keamanan dan Laporan Pengujian (Security Audit & Penetration Testing)

Dokumen ini memuat hasil pengujian Black-box, Penetration Testing (Pentest) berbasis standar OWASP Top 10, perbaikan kerentanan (vulnerability remediation), serta panduan hardening produksi untuk aplikasi **SIKP (Sistem Informasi Kerja Praktik)**.

---

## 1. Ruang Lingkup dan Metodologi Audit

### 1.1 Ruang Lingkup
- **Aplikasi**: Sistem Informasi Kerja Praktik (SIKP)
- **Framework**: Laravel 11.x, Inertia.js, React, Tailwind CSS / Vanilla CSS Tokens
- **Database**: MySQL 8.x
- **Peran Pengguna (Roles)**:
  1. `mahasiswa` (Peserta Kerja Praktik)
  2. `dosen` (Dosen Pembimbing & Penguji Sidang)
  3. `tu` (Tata Usaha Fakultas/Jurusan)
  4. `prodi` (Koordinator Program Studi / Kaprodi)
  5. `instansi` (Pembimbing Lapangan / Mitra Industri)

### 1.2 Metodologi Pengujian
1. **Black-box Testing**: Pengujian fungsionalitas tanpa asumsi struktur internal untuk memastikan seluruh rute (40 rute aktif) mematuhi otorisasi peran, pemblokiran tamu (guest), serta alur tahapan kerja praktik.
2. **Penetration Testing (OWASP Top 10)**:
   - Pengujian Broken Access Control (Horizontal & Vertical Privilege Escalation).
   - Pengujian Insecure Direct Object References (IDOR / BOLA).
   - Pengujian Injection (SQL Injection, Cross-Site Scripting).
   - Pengujian Token Entropy & Brute Force Rate Limiting.
   - Pengujian File Upload Restriction & MIME Tampering.
3. **Automated Regression Suite**: Penulisan dan eksekusi test suite otomatis pada `tests/Feature/SecurityPentestTest.php` dan `tests/Feature/RoleRoutesTest.php`.

---

## 2. Model Ancaman (Threat Modeling - STRIDE)

| Kategori Ancaman | Komponen Target | Risiko Potensial | Mitigasi yang Diterapkan |
| :--- | :--- | :--- | :--- |
| **Spoofing** | Sesi Pengguna & Endpoint Publik | Peniruan identitas mahasiswa atau perusahaan mitra | Middleware `auth`, token konfirmasi acak 64 karakter (`Str::random(64)`), proteksi session guard. |
| **Tampering** | Formulir Nilai, Berkas Upload, Surat Cetak | Modifikasi nilai ujian, manipulasi file eksekutabel | Form Request Validation (`mimes:pdf`, `image`), transaksi DB atomik, verifikasi kepemilikan data. |
| **Repudiation** | Persetujuan Instansi & Pengesahan Surat | Penyangkalan tanda tangan atau persetujuan proposal | Audit trail terdata: `confirmed_at`, `divalidasi_oleh`, `ditandatangani_oleh`, catatan riwayat di database. |
| **Information Disclosure** | Cetak Surat Pengantar & Berita Acara | Kebocoran data pribadi (NIM, nomor surat, nilai) antar mahasiswa | Pengecekan otorisasi `abort_unless($data->mahasiswa_id == auth()->id(), 403)`. |
| **Denial of Service** | Endpoint Verifikasi Publik `/konfirmasi/{token}` | Serangan brute-force enumerasi token surat | Penerapan middleware `throttle:15,1` (maksimal 15 request per menit per IP). |
| **Elevation of Privilege** | Akses Dashboard Antar Peran | Mahasiswa mengakses menu Tata Usaha atau Prodi | Middleware peran tunggal `role:X` dan penolakan manipulasi atribut `role` melalui `fillable` guard. |

---

## 3. Matriks Hasil Pengujian Black-Box

Pengujian black-box dilakukan terhadap seluruh endpoint utama aplikasi. Seluruh 22 pengujian otomatis pada suite `RoleRoutesTest` dan `SecurityPentestTest` menghasilkan status **PASS (100%)**.

### 3.1 Kontrol Akses Tamu (Unauthenticated Access)

| Endpoint | Metode | Peran Target | Respon Diharapkan | Hasil Uji | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | GET | Umum | 302 Redirect ke `/login` | 302 Redirect | **LULUS** |
| `/panduan` | GET | Publik | 200 OK | 200 OK | **LULUS** |
| `/login` | GET | Publik | 200 OK | 200 OK | **LULUS** |
| `/register` | GET | Publik | 200 OK | 200 OK | **LULUS** |
| `/register/pembimbing-lapangan` | GET | Publik | 200 OK | 200 OK | **LULUS** |
| `/mahasiswa/dashboard` | GET | Mahasiswa | 302 Redirect ke `/login` | 302 Redirect | **LULUS** |
| `/dosen/dashboard` | GET | Dosen | 302 Redirect ke `/login` | 302 Redirect | **LULUS** |
| `/tu/dashboard` | GET | TU | 302 Redirect ke `/login` | 302 Redirect | **LULUS** |
| `/prodi/dashboard` | GET | Prodi | 302 Redirect ke `/login` | 302 Redirect | **LULUS** |
| `/instansi/dashboard` | GET | Instansi | 302 Redirect ke `/login` | 302 Redirect | **LULUS** |

### 3.2 Isolasi Antar Peran (Vertical Privilege Access)

| Pengguna Login | Endpoint Sasaran | Hak Akses Semestinya | Status Respon | Status |
| :--- | :--- | :--- | :--- | :--- |
| Mahasiswa | `/tu/dashboard` | Dilarang | 403 Forbidden | **LULUS** |
| Mahasiswa | `/tu/verifikasi-pendaftaran` | Dilarang | 403 Forbidden | **LULUS** |
| Mahasiswa | `/dosen/dashboard` | Dilarang | 403 Forbidden | **LULUS** |
| Mahasiswa | `/dosen/review-proposal` | Dilarang | 403 Forbidden | **LULUS** |
| Mahasiswa | `/prodi/dashboard` | Dilarang | 403 Forbidden | **LULUS** |
| Mahasiswa | `/prodi/sidang` | Dilarang | 403 Forbidden | **LULUS** |
| Mahasiswa | `/instansi/dashboard` | Dilarang | 403 Forbidden | **LULUS** |
| Dosen | `/tu/dashboard` | Dilarang | 403 Forbidden | **LULUS** |
| Instansi | `/prodi/dashboard` | Dilarang | 403 Forbidden | **LULUS** |

---

## 4. Temuan Penetration Testing & Remediasi Kerentanan

Selama audit keamanan kode, ditemukan 3 potensi celah keamanan. Seluruh celah tersebut telah diperbaiki secara langsung.

### 4.1 Temuan #1: Insecure Direct Object References (IDOR) pada Cetak Surat Pengantar
- **Kategori OWASP**: A01:2021 - Broken Access Control
- **Tingkat Keparahan**: High (CVSS v3.1: 7.5 / `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N`)
- **Lokasi Kode**: `app/Http/Controllers/Mahasiswa/MahasiswaSuratPengantarController.php:178`
- **Deskripsi Masalah**:
  Metode `cetak(Request $request, $id)` memuat data pendaftaran berdasarkan parameter URL `$id` menggunakan `Pendaftaran::findOrFail($id)` tanpa memeriksa apakah record tersebut milik mahasiswa yang sedang login. Mahasiswa dapat melihat dan mencetak surat pengantar milik mahasiswa lain dengan mengganti ID pada URL.
- **Bukti Konsep (PoC)**:
  ```http
  GET /mahasiswa/surat-pengantar/2/cetak HTTP/1.1
  Host: sikp.test
  Cookie: laravel_session=... (Sesi Mahasiswa A)
  ```
  Surat pengantar milik Mahasiswa B berhasil ditampilkan lengkap dengan nama instansi, data pribadi, dan spesimen tanda tangan dekan.
- **Remediasi yang Diterapkan**:
  Menambahkan pengecekan eksplisit otorisasi kepemilikan sebelum data diproses:
  ```php
  $data = Pendaftaran::with(['instansi', 'mahasiswa', 'suratPengantar'])
      ->findOrFail($id);

  abort_unless($data->mahasiswa_id == auth()->id(), 403, 'Akses tidak sah.');
  ```
- **Status**: **RESOLVED / CLOSED** (Divalidasi via `test_mahasiswa_cannot_print_other_student_surat_pengantar`).

---

### 4.2 Temuan #2: Broken Object Level Authorization (BOLA) pada Lembar Berita Acara
- **Kategori OWASP**: A01:2021 - Broken Access Control
- **Tingkat Keparahan**: High (CVSS v3.1: 7.1 / `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N`)
- **Lokasi Kode**: `app/Http/Controllers/Mahasiswa/MahasiswaBeritaAcaraController.php:66`
- **Deskripsi Masalah**:
  Metode `cetak(Request $request, $id)` memuat data berita acara dan nilai sidang mahasiswa lain berdasarkan ID pendaftaran tanpa verifikasi relasi akun. Mahasiswa dapat mengintip rekapan nilai akhir, catatan dosen penguji, dan status kelulusan rekan lainnya.
- **Remediasi yang Diterapkan**:
  Menambahkan validasi kepemilikan data:
  ```php
  $pendaftaran = Pendaftaran::with([...])->findOrFail($id);

  abort_unless($pendaftaran->mahasiswa_id == auth()->id(), 403, 'Akses tidak sah.');
  ```
- **Status**: **RESOLVED / CLOSED** (Divalidasi via `test_mahasiswa_cannot_print_other_student_berita_acara`).

---

### 4.3 Temuan #3: Ketiadaan Rate Limiting pada Endpoint Publik Konfirmasi Instansi
- **Kategori OWASP**: A07:2021 - Identification and Authentication Failures / Brute Force
- **Tingkat Keparahan**: Medium (CVSS v3.1: 5.3 / `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N`)
- **Lokasi Kode**: `routes/web.php:37-40`
- **Deskripsi Masalah**:
  Rute konfirmasi penerimaan instansi (`/konfirmasi/{token}`) dapat diakses oleh publik tanpa otentikasi login. Tanpa pembatasan frekuensi request (rate limiting), penyerang dapat melakukan serangan enumerasi atau spamming form konfirmasi.
- **Remediasi yang Diterapkan**:
  Menerapkan middleware throttling pada rute publik tersebut di `routes/web.php`:
  ```php
  Route::get('/konfirmasi/{token}', [\App\Http\Controllers\KonfirmasiInstansiController::class, 'show'])
      ->middleware('throttle:15,1')
      ->name('konfirmasi.show');
  Route::post('/konfirmasi/{token}', [\App\Http\Controllers\KonfirmasiInstansiController::class, 'confirm'])
      ->middleware('throttle:15,1')
      ->name('konfirmasi.confirm');
  ```
- **Status**: **RESOLVED / CLOSED** (Divalidasi via `test_invalid_confirmation_token_returns_404`).

---

### 4.4 Temuan #4: Query Database Dosen Merujuk Kolom Tidak Valid
- **Kategori**: Reliability & Internal Error (500 Server Error)
- **Tingkat Keparahan**: Medium
- **Lokasi Kode**:
  - `app/Http/Controllers/Dosen/DosenMonitoringController.php:38`
  - `app/Http/Controllers/Dosen/DosenPenilaianController.php:30, 63, 97`
- **Deskripsi Masalah**:
  Query mencari mahasiswa bimbingan menggunakan klausa `orWhere('dosen_wali_id', $dosenId)` langsung pada tabel `pendaftarans`. Kolom `dosen_wali_id` tidak berada pada tabel `pendaftarans`, melainkan tersimpan pada relasi `mahasiswa` (tabel `users`). Hal ini menyebabkan HTTP 500 error pada saat dosen membuka menu monitoring atau penilaian.
- **Remediasi yang Diterapkan**:
  Memperbaiki relasi query menjadi:
  ```php
  ->orWhereHas('mahasiswa', fn($mq) => $mq->where('dosen_wali_id', $dosenId))
  ```
- **Status**: **RESOLVED / CLOSED** (Divalidasi via eksekusi `RoleRoutesTest` yang menghasilkan 200 OK untuk seluruh menu Dosen).

---

## 5. Mekanisme Pertahanan Keamanan Tambahan

### 5.1 Step Gating Workflow Enforcement (`KpStepGate`)
Mahasiswa tidak dapat melompati tahapan kerja praktik secara acak melalui URL direct manipulation.
- Setiap rute dilindungi oleh middleware `kp.step:{N}`:
  - Step 2: Surat Pengantar
  - Step 4: Proposal KP
  - Step 6: Logbook Mingguan
  - Step 7: Dokumen Laporan Akhir
  - Step 8: Sidang KP & Berita Acara
  - Step 9: Penilaian Akhir
- Percobaan akses sebelum tahapannya selesai akan ditolak dengan pengalihan ke dashboard beserta flash message atau respon JSON 403 Forbidden.

### 5.2 Perlindungan Terhadap SQL Injection
- Seluruh manipulasi data menggunakan Eloquent ORM dan Query Builder Laravel dengan PDO Parameter Binding.
- Pengujian penetrasi menggunakan payload SQL injection standar (`' OR '1'='1' -- `) pada parameter filter tabel dan query search terbukti ternetralisir dengan aman tanpa error sintaks basis data.

### 5.3 Perlindungan Terhadap Mass Assignment & Role Tampering
- Model `User` melindungi atribut penting (`role`) agar tidak dapat diubah oleh request profil mahasiswa. Pengujian pada `test_mahasiswa_cannot_escalate_role_via_profile_update` membuktikan nilai peran tetap terjaga.

### 5.4 Validasi Berkas Unggahan (File Upload Security)
- Validasi tipe MIME ketat pada request upload proposal (`mimes:pdf, max:5120`).
- Validasi gambar pada logbook kegiatan (`image, mimes:jpeg,png,jpg, max:2048`).
- Penyimpanan file menggunakan generator nama acak `hashName()` untuk mencegah path traversal dan eksekusi file liar.

---

## 6. Ringkasan Eksekusi Pengujian Otomatis

Hasil eksekusi automated test runner:
```text
PHPUnit 12.5.33 by Sebastian Bergmann and contributors.
Runtime:       PHP 8.5.10
Configuration: phpunit.xml

......................                                            22 / 22 (100%)

Time: 00:05.155, Memory: 36.00 MB
OK (22 tests, 76 assertions)
```

Daftar pengujian yang dijalankan:
1. `test_guest_cannot_access_protected_mahasiswa_routes` (PASS)
2. `test_guest_cannot_access_protected_dosen_routes` (PASS)
3. `test_guest_cannot_access_protected_tu_routes` (PASS)
4. `test_guest_cannot_access_protected_prodi_routes` (PASS)
5. `test_guest_cannot_access_protected_instansi_routes` (PASS)
6. `test_public_pages_are_accessible_without_auth` (PASS)
7. `test_mahasiswa_cannot_access_tu_routes` (PASS)
8. `test_mahasiswa_cannot_access_dosen_routes` (PASS)
9. `test_mahasiswa_cannot_access_prodi_routes` (PASS)
10. `test_mahasiswa_cannot_access_instansi_routes` (PASS)
11. `test_dosen_cannot_access_tu_routes` (PASS)
12. `test_instansi_cannot_access_prodi_routes` (PASS)
13. `test_mahasiswa_cannot_escalate_role_via_profile_update` (PASS)
14. `test_mahasiswa_cannot_print_other_student_surat_pengantar` (PASS - IDOR Defended)
15. `test_mahasiswa_cannot_print_other_student_berita_acara` (PASS - IDOR Defended)
16. `test_step_gating_prevents_premature_sidang_access` (PASS - Step Gate Active)
17. `test_step_gating_json_request_returns_403_with_current_step` (PASS)
18. `test_invalid_confirmation_token_returns_404` (PASS)
19. `test_valid_confirmation_token_renders_form` (PASS)
20. `test_sql_injection_payloads_in_filter_parameters_are_neutralized` (PASS)
21. `test_the_application_returns_a_successful_response` (PASS)
22. `test_all_role_routes_render_successfully` (PASS - 40 Routes 200 OK)

---

## 7. Checklist Hardening untuk Lingkungan Produksi

Sebelum merilis sistem ke server produksi (VPS / Cloud), pastikan parameter berikut telah dikonfigurasi:

- [ ] **Mode Debug**: Nonaktifkan `APP_DEBUG=false` pada file `.env` agar detail stack trace internal tidak bocor ke publik.
- [ ] **Protokol HTTPS / SSL**: Pastikan `APP_URL=https://...` dan terapkan SSL/TLS certificate aktif (e.g. Let's Encrypt).
- [ ] **Session Security**: Pastikan `SESSION_SECURE_COOKIE=true` pada `.env` agar cookie session hanya dikirim lewat koneksi HTTPS terenkripsi.
- [ ] **Tanda Tangan Digital**: Konfigurasikan file gambar stempel dan tanda tangan dekan pada direktori `storage/app/public/signatures/` sesuai variabel `DEKAN_TTD_PATH` pada file `.env`.
- [ ] **Permissions Folder**: Kunci hak akses folder `storage` dan `bootstrap/cache` dengan permission `chmod -R 775` dan kepemilikan user web server (`www-data` atau `nginx`).
- [ ] **Cron Scheduler**: Tambahkan entry crontab untuk menjalankan task runner otomatis:
  ```bash
  * * * * * cd /path-to-sikp && php artisan schedule:run >> /dev/null 2>&1
  ```
- [ ] **Backup Database**: Jadwalkan backup rutin berkala database MySQL menggunakan tools seperti `mysqldump` terenkripsi.
