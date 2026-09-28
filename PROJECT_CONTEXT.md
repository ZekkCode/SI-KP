# PROJECT CONTEXT & SYSTEM AUDIT (SI-KP UTM)
> **Aplikasi:** SI-KP Sivitas Sakera &mdash; Teknik Informatika UTM  
> **Status:** Active Development | **Update Terakhir:** 19 September 2026

---

## ⚡ QUICK RULES & SOP
1. **Baca Sebelum Ubah:** Cek [Environment](#1-environment-terkini) & [Audit Keamanan](#5-ringkasan-audit-kode-keamanan--performa).
2. **Frontend UI:** Wajib ikuti [`SIVITAS_DESIGN_GUIDELINES.md`](./SIVITAS_DESIGN_GUIDELINES.md) (Warna `#00288e`, radius `rounded-lg`/`rounded-xl`, anti-slop).
3. **Catat Perubahan:** Tambahkan log ringkas di [Changelog](#7-session-changelog) setiap selesai sesi.

---

## 1. ENVIRONMENT TERKINI

| Item | Konfigurasi | Status / Tindakan |
|---|---|---|
| **OS** | Windows 11 x64 (PowerShell) | Aktif |
| **Suite** | Laragon (`E:\laragon\`) | Apache, MySQL, Mailpit |
| **PHP** | PHP 8.5.10 (vs17-x86 ZTS) | `E:\laragon\bin\php\php-8.5.10-Win32-vs17-x86\php.exe` |
| **System PATH** | `E:\laragon\bin\php\php-8.5.10-Win32-vs17-x86` | Restart terminal jika masih baca 8.3 |
| **Tuning php.ini** | `upload_max_filesize=1024M`, `post_max_size=1024M` | Fix overflow 2G di PHP 32-bit |
| **Ext Wajib** | `pdo_mysql`, `zip`, `dom`, `gd`, `intl`, `mbstring` | `ext-zip` aktif untuk OpenSpout |
| **Database** | MySQL 8.0 (Port 3306) | DB: `kp_prodi` |
| **Node.js / Bundler** | Node.js 20+ / Vite 6 | Aktif |

---

## 2. TECH STACK

- **Backend:** Laravel 13.23.0 | Breeze (Session Auth) | Socialite (Google Login) | Sanctum | OpenSpout 5.11 | Ziggy 2.0
- **Frontend:** React 19 | TypeScript 5.8 | Inertia.js 2.0 | Tailwind CSS v4 (`@tailwindcss/vite`) | Lucide Icons | Motion | PDF.js

---

## 3. ALUR KERJA PRAKTIK & MATRIKS PERAN

```mermaid
graph LR
    Reg[1. Registrasi & Whitelist] --> Surat[2. Surat Pengantar]
    Surat --> Balas[3. Surat Balasan Mitra]
    Balas --> Plot[4. Plotting Pembimbing]
    Plot --> Prop[5. Proposal & Bimbingan]
    Prop --> Log[6. Logbook & Magang]
    Log --> Uji[7. Berita Acara / Seminar]
    Uji --> Nilai[8. Penilaian & Dokumen Akhir]
```

### Matriks Tanggung Jawab Peran

| Fitur / Tahapan | Mahasiswa | Dosen | TU | Prodi | Instansi |
|---|:---:|:---:|:---:|:---:|:---:|
| **Akun & Master NIM** | Daftar / Login | - | Validasi & Import | - | - |
| **Surat Pengantar** | Ajukan | - | Verifikasi & Cetak | - | - |
| **Surat Balasan** | Upload Berkas | - | Verifikasi Mitra | - | - |
| **Plotting Dosen & PL** | - | - | - | Kelola & Tetapkan | - |
| **Proposal KP** | Draft & Revisi | Review & ACC | - | Monitoring | - |
| **Logbook Harian** | Input Kegiatan | Validasi | - | - | Verifikasi Lapangan |
| **Berita Acara** | Ajukan Jadwal | Uji / ACC | - | Validasi & Jadwal | - |
| **Penilaian KP** | Lihat Nilai | Input Nilai (60%) | Arsip | Rekapitulasi | Input Nilai (40%) |
| **Laporan Akhir** | Upload Final | ACC Laporan | Verifikasi Berkas | Validasi Yudisium | Terbitkan Sertifikat |

---

## 4. DATABASE & RELASI INTI

| Tabel | Model | Fungsi | Relasi Kunci |
|---|---|---|---|
| `users` | `User` | User multi-role & autentikasi | `belongsTo(ProgramStudi)`, `hasMany(Pendaftaran)` |
| `master_mahasiswas`| `MasterMahasiswa` | Whitelist NIM resmi prodi TI | `belongsTo(User as dosenWali)` |
| `permohonan_akuns` | `PermohonanAkun` | Antrean verifikasi akun baru | Diperiksa oleh TU |
| `pendaftarans` | `Pendaftaran` | **Entitas Induk** siklus KP | Relasi ke Proposal, Logbook, Nilai, Surat |
| `surat_pengantars` | `SuratPengantar` | Pengajuan surat pengantar mitra | `belongsTo(Pendaftaran)` |
| `surat_balasans` | `SuratBalasan` | Bukti penerimaan/penolakan mitra | `belongsTo(Pendaftaran)` |
| `proposals` | `Proposal` | File, versi revisi, dan status | `hasMany(ProposalFeedback)` |
| `logbooks` | `Logbook` | Presensi & catatan kerja harian | Verifikasi ganda: Dosen & Instansi |
| `berita_acaras` | `BeritaAcara` | Pengajuan ujian & seminar KP | `belongsTo(Pendaftaran)` |
| `nilais` | `Nilai` | Komponen nilai terpisah | `belongsTo(User as penilai)` |
| `nilai_akhirs` | `NilaiAkhir` | Nilai akhir (Instansi 40% + Dosen 60%) | `belongsTo(Pendaftaran)` |
| `dokumen_akhirs` | `DokumenAkhir` | Laporan final & sertifikat | `belongsTo(Pendaftaran)` |

---

## 5. RINGKASAN AUDIT KODE (KEAMANAN & PERFORMA)

| Area | Temuan / Risiko | Tingkat | Tindakan Diperlukan |
|---|---|:---:|---|
| **Otorisasi (IDOR)** | Cetak surat & nilai belum sepenuhnya divalidasi kepemilikan user (`pendaftaran->mahasiswa_id == auth()->id()`). | 🔴 Tinggi | Terapkan Laravel Policy di route cetak/download. |
| **Destructive Action** | Endpoint `DELETE /tu/master-mahasiswa-truncate` bisa dipicu tanpa konfirmasi ulang password. | 🔴 Tinggi | Tambahkan prompt password TU sebelum truncate. |
| **File Storage** | Upload proposal & berkas akhir perlu validasi MIME ketat & nama file teracak. | 🟡 Sedang | Validasi `mimes:pdf`, generate hash name, simpan di disk privat. |
| **Query N+1 / Cache** | `HandleInertiaRequests.php` load notifikasi 2x (`load('notifikasis')` + query limit 5). | 🟡 Sedang | Hapus pemanggilan `load()` redundan; gunakan query limit 5 saja. |
| **Database Indexing** | Kolom `status` pada `pendaftarans` & `proposals` sering difilter tapi belum terindeks. | 🟡 Sedang | Buat migrasi index: `(mahasiswa_id, status)`. |
| **Memory Leak (RAM)** | `User::pluck('nim')` memuat seluruh array NIM ke RAM di `TUMasterMahasiswaController`. | 🟢 Rendah | Ganti dengan `whereExists` query. |
| **Code Cleanup** | File artefak sisa dev di root: `test_routes.php`, `refactor.py`, `temp_php84/`. | 🟢 Rendah | Hapus / pindahkan ke folder arsip. |

---

## 6. ROADMAP PENGEMBANGAN

### Fase 1: Keamanan & Stabilitas Query (Prioritas Utama)
- [ ] Buat Policy otorisasi berkas download & cetak (Anti-IDOR).
- [ ] Tambah modal konfirmasi password pada truncate master data.
- [ ] Optimasi query notifikasi di `HandleInertiaRequests.php`.
- [ ] Hapus artefak temporary di root direktori.

### Fase 2: Fitur & Otomasi
- [ ] Export rekap nilai seluruh angkatan ke Excel (OpenSpout).
- [ ] QR Code verifikasi pada lembar cetak Surat Pengantar & Berita Acara.
- [ ] Notifikasi email otomatis untuk status revisi proposal & approval surat.

### Fase 3: Responsivitas & UX
- [ ] Card view mobile untuk tabel data pendaftaran & logbook.
- [ ] Simpan state filter angkatan & pencarian di query URL.

---

## 7. SESSION CHANGELOG

### [SESI 1] - 2026-09-19 - Migrasi PHP 8.5 & Setup Master Context
- **Kendala:** `php artisan serve` gagal karena `openspout/openspout ^5.11` butuh PHP >= 8.4 (lokal masih PHP 8.3.28).
- **Aksi:**
  1. Pasang runtime **PHP 8.5.10** (`php-8.5.10-Win32-vs17-x86`) di Laragon.
  2. Perbaiki `php.ini` (`upload_max_filesize` & `post_max_size` = `1024M`).
  3. Sinkronkan Windows System PATH ke PHP 8.5.10.
  4. Pulihkan [composer.json](./composer.json) ke `"openspout/openspout": "^5.11"`.
  5. Verifikasi: `php artisan about` berjalan normal (Laravel 13.23.0 aktif).
  6. Buat file context memory & audit [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) dengan standar UX writing ringkas.
- **Status:** Selesai | Server siap dijalankan.

### [SESI 2] - 2026-09-19 - Standardisasi UX Writing & SIVITAS Design Guidelines Frontend (Semua Modul)
- **Tujuan:** Menerapkan pedoman desain SIVITAS ([SIVITAS_DESIGN_GUIDELINES.md](./SIVITAS_DESIGN_GUIDELINES.md)) dan UX Writing ringkas, aksi-sentris, dan formal di seluruh modul antarmuka web (Mahasiswa, Dosen, TU, Prodi, Instansi, Profile).
- **Aksi & Perubahan:**
  1. **Aturan Geometri & Radius Token:**
     - Menghapus semua penggunaan `rounded-full` pada kartu kontainer, tombol aksi, dan badge status.
     - Standar Token: Kartu kontainer (`rounded-xl`), Tombol aksi & Input form (`rounded-lg`), Badge status & Chips (`rounded-md text-xs font-semibold px-2.5 py-1` disertai mini dot/icon), Avatar profil (`rounded-md` atau `rounded-xl`).
  2. **UX Writing & Eliminasi 'Over-Penjelasan':**
     - Menghapus paragraf ceramah/teori berbelit-belit (misal teks panjang di `TU/Dashboard`, `Prodi/Dashboard`, `Prodi/SupervisorPlotting`).
     - Mengganti dengan microcopy lugas, informatif, dan terstruktur serta menambahkan pintasan menu "Aksi Cepat Layanan" pada Dashboard TU dan "Prioritas Penugasan" pada Dashboard Prodi.
     - Memperbaiki peringatan kasar (`* nb : ...`) menjadi komponen alert formal berikon (`AlertCircle`).
  3. **Perbaikan Grid & Konsistensi Tabel:**
     - Memperbaiki `colSpan` pada empty state tabel (misal `colSpan={6}` di `TU/DaftarMahasiswa` dan `colSpan={5}` di `Prodi/Students`).
     - Menambahkan ikon kontekstual Lucide pada setiap CTA button dan badge status.
  4. **Cakupan File yang Direfaktor:**
     - **Mahasiswa:** `Dashboard`, `Pendaftaran`, `Proposal`, `SuratPengantar`, `SuratBalasan`, `Logbook`, `StatusPengajuan`, `BeritaAcara`, `DokumenAkhir/Index`, `Penilaian/Index`, `Logbook/Create`, `Logbook/Edit`.
     - **Dosen:** `Dashboard`, `ReviewProposal`, `Proposal/Review`, `Logbook`, `Logbook/Review`, `Penilaian/Index`, `Penilaian/Create`.
     - **TU:** `Dashboard`, `DaftarMahasiswa`, `GenerateSurat`, `SuratBalasan/Index`, `SuratBalasan/Show`, `VerifikasiPendaftaran/Index`.
     - **Prodi:** `Dashboard`, `SupervisorPlotting`, `Students`, `StudentVerification`, `BeritaAcara/Index`.
     - **Instansi:** `Dashboard`, `Evaluation`, `Pendaftaran`.
     - **Profile:** `Profile/Edit`.
- **Status:** Selesai | Seluruh halaman frontend terstandarisasi.

### [SESI 3] - 2026-09-20 - Responsivitas Mobile Header (Icon-Only), Grid 2-Kolom/Baris & UX Writing
- **Tujuan:** Menghapus logo SI, membuat lebar header sepenuhnya fluid/responsif dengan tombol icon-only di layar sempit (<sm) untuk mengeliminasi horizontal scrollbar, merestrukturisasi 5 kartu peran menjadi grid 2-kolom/baris ringkas agar tidak perlu scroll vertikal panjang, serta memadatkan UX writing.
- **Aksi & Perubahan:**
  1. **Header Fluid & Tombol Icon-Only:**
     - Menghapus `shrink-0` statis pada brand link dan menambahkan `min-w-0 flex-1 truncate` agar teks prodi lentur menyesuaikan lebar layar.
     - Tombol navigasi kanan ("Panduan" & "Sivitas Sakera") otomatis menjadi **Icon-Only** pada layar sempit/mobile (`<sm`), sehingga menghemat ruang horizontal (~70px total) dan menghilangkan horizontal scrollbar secara total.
     - Mengubah root wrapper dengan `w-full overflow-x-hidden`.
  2. **Layout Kartu 2-Kolom / Baris (Non-Scroll):**
     - Mengganti layout kartu 1-kolom yang memanjang vertikal menjadi grid 2-kolom di mobile (`grid-cols-2`) dan 2-baris di desktop (`md:grid-cols-6`):
       - Baris 1: Mahasiswa (`col-span-1 md:col-span-2`) | Dosen Pembimbing (`col-span-1 md:col-span-2`) | Koordinator KP (`md:col-span-2`)
       - Baris 2: Tata Usaha (`col-span-1 md:col-start-2 md:col-span-2`) | Pembimbing Lapangan (`col-span-2 md:col-span-2`)
     - Layout ini membuat seluruh kartu peran dapat langsung dilihat tanpa scroll berkepanjangan.
  3. **UX Writing & Hierarki Visual:**
     - Deskripsi kartu diringkas dan padat aksi (action-oriented):
       - Mahasiswa: *Daftar KP, logbook harian, & ujian seminar.*
       - Dosen Pembimbing: *Bimbingan, pantau logbook, & evaluasi nilai.*
       - Koordinator KP: *Plotting dosen, verifikasi, & berita acara.*
       - Tata Usaha (TU): *Surat pengantar, berkas balasan, & arsip.*
       - Pembimbing Lapangan: *Bimbingan industri & evaluasi nilai magang.*
     - Memadatkan padding kartu (`p-3 sm:p-4`) dan ukuran ikon (`w-8 h-8 sm:w-9 sm:h-9`).
- **Status:** Selesai | Terverifikasi visual sempurna pada viewport 501x650px tanpa horizontal/vertical scrollbar berlebih.

### 4. Implementasi Hierarki 3-Step Alur Login & 6-Grid Program Studi (View 1 -> View 2 -> View 3)
- **Problem Statement:** 
  - Alur login harus terstruktur secara bertahap: Pengguna memilih Program Studi terlebih dahulu, kemudian masuk ke Halaman Pilih Peran yang menampilkan informasi prodi aktif, lalu masuk ke Form Login terdedikasi.
  - Membutuhkan penambahan varian prodi dummy lain di Fakultas Teknik selain TIF & SI dengan UX writing yang tajam serta tampilan grid yang rapi.
- **Implementasi:**
  1. **View 1 (Pilih Program Studi - Grid 6 Prodi Fakultas Teknik):**
     - Kartu prodi didesain minimalis dan terfokus: logo terletak tepat di tengah (`items-center justify-center text-center`), tanpa badge singkatan maupun deskripsi paragraf panjang, hanya logo dan nama prodi.
     - Menyediakan 6 Program Studi dalam grid responsif 3-kolom desktop (`sm:grid-cols-3`), 2-kolom mobile (`grid-cols-2`):
       1. **Teknik Informatika** — Logo Tekfor
       2. **Sistem Informasi** — Logo SI
       3. **Teknik Elektro** — Logo UTM
       4. **Teknik Industri** — Logo UTM
       5. **Teknik Mekatronika** — Logo UTM
       6. **Teknik Mesin** — Logo UTM
  2. **View 2 (Pilih Peran dengan Konteks Informasi Prodi):**
     - Menampilkan tombol navigasi kembali `[← Ganti Prodi]`.
     - Menampilkan badge prodi aktif dengan logo: `Program Studi: S1 [Nama Prodi]`.
     - Navbar dan footer otomatis menyesuaikan identitas prodi yang dipilih.
     - 5 kartu peran berbadge kontekstual (`S1 TIF` / `S1 TE`, `Dosen TIF` / `Dosen TE`, dsb.).
  3. **View 3 (Form Login Terdedikasi):**
     - Menampilkan tombol navigasi kembali `[← Ganti Peran]`.
     - Menampilkan metadata aktif: `Prodi: [KODE] • Peran: [ROLE]`.
     - Form input terdedikasi sesuai peran (NIM untuk Mahasiswa, NIP/Email untuk Dosen, Email untuk TU/Koordinator/PL) lengkap dengan quick-role switcher.
- **Status:** Selesai | Terverifikasi visual penuh via Browser Subagent pada semua resolusi.

### 4. Penerapan Skill `stop-slop`, Peningkatan Desain SIVITAS & Keamanan
- **Instalasi Skill `stop-slop`:**
  - Telah di-clone dari repository [hardikpandya/stop-slop](https://github.com/hardikpandya/stop-slop.git) dan diaktifkan di `.agents/skills/stop-slop` dan global config.
  - Berisi pedoman eliminasi pola kalimat AI klise, penulisan aktif, padat, lugas, dan bebas jargon.
- **Harmonisasi Desain SIVITAS SAKERA (Eliminasi AI Slop):**
  - Menghapus semua sisa desain AI slop: background hitam `bg-slate-950`, glowing radial mesh `blur-[140px]`, kurva balon `rounded-3xl`, dan gradien tombol.
  - Memutakhirkan `GuestLayout.tsx` dengan shell institusi resmi: top contact bar Kampus UTM Kamal, navbar institusi (Logo UTM + Tekfor), canvas `bg-slate-50`, card `rounded-xl`, dan footer SIVITAS SAKERA.
  - Mengoreksi seluruh typo penamaan institusi: *"Universitas Trunodjoyo Madura"* -> *"Universitas Trunojoyo Madura"*.
  - Menstandarisasi halaman `Register.tsx`, `RegisterPL.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx`, `ConfirmPassword.tsx`, `VerifyEmail.tsx`, dan `ForceChangePassword.tsx`.
- **Penguatan Keamanan (Security Hardening):**
  - Menambahkan pembatasan panjang maksimum (`max:255` untuk email/username, `max:128` untuk password, `max:30` untuk NIM) pada `LoginRequest`, `RegisteredUserController`, dan `PembimbingLapanganAuthController` untuk mitigasi DoS.
  - Melengkapi atribut `autoComplete` W3C standar (`name`, `email`, `current-password`, `new-password`).
- **Login Universal (Unified Login) & Google OAuth:**
  - Menambahkan tombol **Masuk dengan Akun Google** (`/auth/google`) menggunakan Laravel Socialite.
  - Menghapus layar *"Pilih Peran"* dan tombol *"PILIH PERAN LAIN"*; dari pemilihan prodi (atau akses langsung) langsung ke form login tunggal.
  - Form menerima **NIM / NIP / Alamat Email** secara otomatis tanpa membatasi peran saat login.
  - Melokalkan pesan error autentikasi ke bahasa Indonesia (*"Kredensial yang Anda masukkan tidak sesuai dengan data kami"*).
- **Verifikasi:**
  - Build `npm run build` sukses 100% tanpa error.
  - Verifikasi visual via Browser Subagent mengonfirmasi alur login tunggal bersih, tombol Google aktif, dan bebas elemen pilih peran.

### [SESI 5] - 2026-09-24 - Audit & Restrukturisasi Panduan Instalasi README.md
- **Tujuan:** Mengaudit dan memperbarui dokumentasi inisialisasi pada `README.md` menjadi panduan instalasi yang presisi, bertahap, dan komprehensif bagi developer/pengguna baru.
- **Aksi & Perubahan:**
  1. Menyesuaikan spesifikasi tech stack (PHP 8.3+, disarankan PHP 8.4+, OpenSpout 5.11, Tailwind v4).
  2. Merinci prasyarat sistem & ekstensi PHP wajib (`pdo_mysql`, `zip` untuk seeder OpenSpout, `fileinfo`, `mbstring`, `gd`, `intl`, `dom`).
  3. Menambahkan langkah kritis pembuatan symlink publik yang sebelumnya terlewat (`php artisan storage:link`).
  4. Menjelaskan detail proses `php artisan migrate --seed` yang membaca otomatis `master_dosen.xlsx` & `master_mahasiswa.xlsx`.
  5. Menambahkan panduan konfigurasi basis data MySQL & Google OAuth.
  6. Menyediakan opsi server development (2 terminal terpisah atau single command `composer run dev`).
  7. Memutakhirkan tabel akun demo bawaan berbasis universal login (NIM/NIP/Email) dan 5 skenario peran.
  8. Menambahkan bab Troubleshooting (solusi ZipArchive missing, file 404, migrasi DB, queue email, dan memory limit).
- **Status:** Selesai | README.md siap dan terverifikasi.

### [SESI 6] - 2026-09-24 - Audit & Eliminasi Simbol Panah Mentah (AI Slop) Frontend
- **Tujuan:** Menghapus seluruh simbol panah mentah (`&rarr;`, `&larr;`, `→`, `->`) yang bertebaran di teks tombol dan tautan antarmuka frontend karena mengindikasikan gaya penulisan AI slop.
- **Aksi & Perubahan:**
  1. `resources/js/Pages/Mahasiswa/StatusPengajuan.tsx`: Mengubah tombol `<span>Mulai Pendaftaran &rarr;</span>` menjadi `<span>Mulai Pendaftaran</span>` (sesuai tangkapan layar user).
  2. `resources/js/Pages/Mahasiswa/Proposal.tsx`: Mengubah tautan `Lihat Berkas Dokumen &rarr;` menjadi `Lihat Berkas Dokumen`.
  3. `resources/js/Pages/Auth/Register.tsx`: Mengubah tautan `Masuk ke Akun Anda →` menjadi `Masuk ke Akun Anda`.
  4. `resources/js/Components/PdfViewerModal.tsx`: Mengubah teks panduan keyboard dari `Gunakan panah &larr; / &rarr;...` menjadi `Gunakan tombol panah kiri / kanan keyboard...`.
  5. `resources/views/emails/akun-dosen-announcement.blade.php`: Mengubah tombol `Masuk ke Portal Dosen SI-KP &rarr;` menjadi `Masuk ke Portal Dosen SI-KP`.
- **Verifikasi:**
  - Script pemindaian komprehensif mengonfirmasi nol entitas panah mentah di seluruh `resources/js` dan `resources/views`.
  - Kompilasi produksi `npm run build` sukses 100% tanpa error (selesai dalam 14.16s).
- **Status:** Selesai | Seluruh antarmuka bersih dari simbol panah mentah.

### [SESI 7] - 2026-09-24 - Penerapan Total Skill /stop-slop & Eliminasi Zero-Emoji pada Seluruh Dashboard Peran
- **Tujuan:** Menerapkan skill `/stop-slop` secara menyeluruh pada dashboard semua peran (`Mahasiswa`, `Dosen`, `Tata Usaha`, `Program Studi`, `Instansi`), meniadakan seluruh karakter emoji (`⚠️`, `✓`, `📢`, `✏️`, `📊`), serta membuang pola kalimat AI klise, fake versioning, watermark dekoratif raksasa, dan visual mesh glow AI slop.
- **Aksi & Perubahan:**
  1. **Dashboard Mahasiswa (`resources/js/Pages/Mahasiswa/Dashboard.tsx`):**
     - Menghapus efek visual AI mesh glowing radial blur (`blur-3xl`).
     - Mengeliminasi paragraf ceramah pembuka panjang ("Sistem Informasi Kerja Praktik memfasilitasi...").
     - Mengganti badge versi artifisial ("Revisi 2024.1") menjadi "Alur Pelaksanaan".
     - Memadatkan copy panduan SOP dan dokumen unduhan menjadi instruksi institusional yang lugas.
  2. **Dashboard Dosen (`resources/js/Pages/Dosen/Dashboard.tsx`):**
     - Menghilangkan ikon `ArrowRight` di tombol `Review`.
     - Mengubah copy kuota menjadi padat: `Sisa kuota: {kuota.sisa} mahasiswa.`
     - Memperbaiki microcopy card evaluasi dan empty state tanpa nada bertele-tele.
  3. **Dashboard Tata Usaha (`resources/js/Pages/TU/Dashboard.tsx`):**
     - Menstandarisasi judul menjadi `Dashboard Tata Usaha`.
     - Mengubah judul bagian layanan menjadi `Layanan Administrasi Tata Usaha`.
     - Memperjelas deskripsi aksi cepat layanan penerbitan surat pengantar dan verifikasi berkas.
  4. **Dashboard Program Studi (`resources/js/Pages/Prodi/Dashboard.tsx`):**
     - Menstandarisasi judul menjadi `Dashboard Program Studi`.
     - Menghapus watermark ikon segitiga peringatan miring berukuran 120px (`AlertTriangle size={120} className="rotate-12"`) pada kartu prioritas penugasan.
     - Menghapus animasi hover artifisial (`group-hover:translate-x-1`) pada menu pengelolaan prodi.
     - Menyusun teks instruksi plotting dosen yang ringkas dan institusional.
  5. **Dashboard Instansi (`resources/js/Pages/Instansi/Dashboard.tsx`):**
     - Menstandarisasi judul menjadi `Dashboard Pembimbing Lapangan`.
     - Mengeliminasi basa-basi salam pembuka AI ("Selamat datang kembali, ... Berikut adalah daftar mahasiswa bimbingan Anda.") menjadi deskripsi status kerja langsung: "Daftar mahasiswa bimbingan aktif di instansi mitra."
     - Merapikan header aksi tabel menjadi ringkas: `Aksi`.
  6. **Pembersihan Zero-Emoji Seluruh Frontend:**
     - `resources/js/Layouts/MahasiswaLayout.tsx`: Mengganti karakter silang mentah `✕` dengan ikon Lucide `<X className="w-5 h-5" />`.
     - `resources/js/Layouts/ProdiLayout.tsx`: Mengganti karakter silang mentah `✕` dengan ikon Lucide `<X className="w-5 h-5" />`.
     - `resources/js/Pages/Mahasiswa/Pendaftaran.tsx`: Menghapus emoji `⚠️` dan `✓` pada indikator validasi syarat SKS.
     - `resources/js/Pages/Prodi/Dosen/Index.tsx`: Menghapus emoji pengeras suara `📢` pada kotak informasi impor data dosen dan menata kalimatnya secara formal.
     - `resources/js/Pages/TU/MasterMahasiswa/Index.tsx`: Menghapus emoji pensil `✏️` dan grafik `📊` pada filter sumber data, serta emoji `⚠️` pada modal konfirmasi penghapusan data master.
  7. **Standarisasi Bahasa Sistem (`lang/id/app.php` & `lang/en/app.php`):**
     - Mengharmonisasi string dashboard dan instruksi sistem agar seragam dan bebas slop.
- **Verifikasi:**
  - Script audit Python berbasis regex unicode mengonfirmasi: **ZERO EMOJIS FOUND IN RESOURCES!**
  - Script audit panah mengonfirmasi: **0 panah mentah tersisa.**
  - Kompilasi produksi `npm run build` sukses 100% tanpa error TypeScript maupun bundling (selesai dalam 26.64s).
- **Status:** Selesai | Seluruh dashboard peran dan frontend terbebas dari AI slop dan emoji.


