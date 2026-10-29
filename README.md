# SI-KP (Sistem Informasi Kerja Praktik)

Sistem informasi pengelolaan Kerja Praktik (KP) Program Studi Teknik Informatika, Fakultas Teknik, Universitas Trunojoyo Madura.

## Tech Stack

- **Backend:** Laravel 12/13, PHP 8.4+, OpenSpout
- **Frontend:** React 19, TypeScript, Inertia.js v2, Tailwind CSS v4
- **Database:** MySQL / MariaDB

---

## Instalasi

### 1. Prasyarat
- PHP >= 8.3 (rekomendasi PHP 8.4+)
- Ekstensi PHP: `pdo_mysql`, `zip`, `fileinfo`, `mbstring`, `gd`, `intl`
- Composer 2
- Node.js >= 18 & npm
- MySQL / MariaDB

### 2. Setup Proyek

```bash
# Clone repository
git clone https://github.com/ZekkCode/SI-KP.git
cd SI-KP

# Install dependensi
composer install
npm install

# Setup environment
cp .env.example .env
# Windows PowerShell: Copy-Item .env.example .env

# Generate application key
php artisan key:generate
```

Konfigurasi database dan akun Root Administrator di `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=si-kp
DB_USERNAME=root
DB_PASSWORD=

# (Opsional) Akun Super User Root Administrator
ROOT_NAME="Root Administrator"
ROOT_EMAIL="root@trunojoyo.ac.id"
ROOT_PASSWORD="password"
```

Buat database di MySQL:
```sql
CREATE DATABASE `si-kp`;
```

### 3. Migrasi, Seeder, dan Storage Link

```bash
# Migrasi tabel dan import master dosen & mahasiswa dari Excel (termasuk Super User Root)
php artisan migrate --seed

# Atau jika ingin membuat/memperbarui akun Root Administrator secara mandiri:
php artisan db:seed --class=SuperUserRootSeeder

# Buat symlink storage untuk akses file upload
php artisan storage:link
```

### 4. Menjalankan Aplikasi

Jalankan backend dan frontend:

```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

Atau jalankan bersamaan:
```bash
composer run dev
```

Buka `http://localhost:8000`.

---

## Akun Demo

Password demo bawaan: `password` (dapat diubah via `.env`)

| Peran | Akun Login (NIM / NIP / Email) | Password | Keterangan & Skenario Uji |
|---|---|---|---|
| **Root Administrator** | `root@trunojoyo.ac.id` | `password` | **Otoritas Tertinggi (Super User Root):** Pusat kendali sistem, manajemen seluruh akun dosen & staff (satu tabel terpadu & satu import Excel), penetapan Dekan Fakultas, penugasan peran, dan login troubleshooting (*Login As / Impersonate*) |
| **Mahasiswa (KP Aktif)** | `230411100092`<br>`230411100092@student.trunojoyo.ac.id` | `password` | Status KP aktif di PT Petrokimia Gresik, logbook terisi |
| **Mahasiswa (Verifikasi TU)** | `230411100080`<br>`230411100080@student.trunojoyo.ac.id` | `password` | Masuk ke antrean verifikasi pendaftaran berkas TU |
| **Mahasiswa (Google SSO)** | `240411100144`<br>`240411100144@student.trunojoyo.ac.id` | `password` | Akun mahasiswa pengujian OAuth Google Workspace UTM |
| **Dosen Pembimbing 1** | `198002022001`<br>`rika@dosen.com` | `password` | Dosen pembimbing utama (Review proposal, logbook, & nilai) |
| **Dosen Pembimbing 2** | `198203032002`<br>`fifin@dosen.com` | `password` | Dosen pembimbing alternatif |
| **Tata Usaha (TU)** | `198501012010`<br>`tu@admin.com` | `password` | Verifikasi berkas, penerbitan surat pengantar & balasan |
| **Koordinator KP** | `197001012000`<br>`prodi@admin.com` | `password` | Plotting pembimbing/PL, kuota, sidang, dan berita acara |
| **Pembimbing Lapangan** | `mitra@demo.com` | `password` | Pembimbing industri mitra (PT Petrokimia Gresik) |

Form login menerima **Email**, **NIM**, maupun **NIP**, dan sudah dilengkapi tombol **"Isi Otomatis"** untuk setiap peran.

> **Catatan Root Administrator:**
> Akun Root Administrator (`root@trunojoyo.ac.id`) dapat langsung mengakses Dashboard Admin di `/admin/dashboard` untuk mengelola data terpadu Dosen & Staff, import data satu file Excel, penetapan tugas/peran (TU, Koordinator KP, Dekan), serta fitur *Login As (Impersonate)* untuk kebutuhan verifikasi dan pemecahan kendala pengguna.

---

## Troubleshooting

- **`Class "ZipArchive" not found`:** Aktifkan `extension=zip` di `php.ini`. OpenSpout membutuhkan ekstensi ini untuk membaca `master_dosen.xlsx` dan `master_mahasiswa.xlsx`.
- **Berkas unggahan 404:** Jalankan `php artisan storage:link`.
- **Unggah berkas gagal:** Naikkan `upload_max_filesize` dan `post_max_size` di `php.ini` (minimal `64M`).
- **Google SSO:** Isi `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` di `.env` untuk mengaktifkan login Google.

---

## Tangkapan Layar

<p align="center">
  <img src="docs/screenshots/dashboard-mahasiswa.png" width="48%" />
  <img src="docs/screenshots/halaman-panduan.png" width="48%" />
</p>
<p align="center">
  <img src="docs/screenshots/login-portal-tour.png" width="48%" />
  <img src="docs/screenshots/google-sso-tour.png" width="48%" />
</p>

---

## Lisensi

[MIT](LICENSE)
