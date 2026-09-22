# Panduan Desain Frontend (FE) SI-KP: Standar Sivitas Sakera UTM
> **Referensi Resmi:** [https://sivitas.sakera.id/](https://sivitas.sakera.id/)  
> **Tujuan Dokumen:** Menjadi aturan baku bagi pengembang & AI assistant agar antarmuka aplikasi SI-KP memiliki identitas portal akademik resmi Universitas Trunojoyo Madura (UTM): bersih, proporsional, elegan dengan **border-radius halus & proporsional (subtle radius)**, dan **TIDAK bergaya "AI Slop"** (dilarang gradien liar, font raksasa, dark mode neon, maupun border-radius raksasa `rounded-3xl`).

---

## 1. Aturan Border Radius: Natural & Subtle (Proporsional)

> [!IMPORTANT]
> **Gunakan border-radius halus standar web institusi modern (6px – 12px).**  
> Jangan terlalu kotak kaku (0px / brutalist), dan **DILARANG KERAS** menggunakan lengkungan balon raksasa seperti `rounded-3xl` (24px) atau `rounded-full` pada kartu yang mencirikan AI slop.

### Skala Radius Standar yang Digunakan:
- **Card Konten & Kartu Peran:** `rounded-xl` (12px) &mdash; Terlihat rapi, modern, dan tidak terlalu kotak.
- **Card Container Login:** `rounded-xl` (12px) s/d `rounded-2xl` (16px).
- **Form Input & Button:** `rounded-lg` (8px) &mdash; Ukuran standar input industri akademik.
- **Icon Container:** `rounded-lg` (8px) s/d `rounded-xl` (12px).
- **Badge / Chip / Tag:** `rounded-md` (6px) atau `rounded` (4px).
- **Tombol Kecil / Toggle:** `rounded-md` (6px).

| Ukuran Elemen | Kelas Tailwind yang Diizinkan | ❌ DILARANG KERAS |
|---|---|---|
| Kartu (Cards) | `rounded-xl` (12px) atau `rounded-lg` (8px) | `rounded-3xl` (24px+), `rounded-full` |
| Form Input | `rounded-lg` (8px) | `rounded-none` (terlalu kaku) / `rounded-full` |
| Button Utama | `rounded-lg` (8px) | `rounded-full`, `rounded-3xl` |
| Icon Wrapper | `rounded-lg` (8px) atau `rounded-xl` (12px) | Lingkaran bola neon raksasa |
| Badge Status | `rounded-md` (6px) | `rounded-full` kapsul raksasa |

---

## 2. Prinsip Utama: Anti "AI Slop"

| Elemen | ❌ DILARANG (Ciri Khas AI Slop) | ✅ WAJIB (Standar Sivitas Sakera UTM) |
|---|---|---|
| **Border Radius** | Lengkungan balon raksasa `rounded-3xl` (24px), atau `rounded-full` pada semua kartu yang membuat UI tampak seperti mainan. | **Subtle & Natural Radius** (`rounded-xl` pada kartu, `rounded-lg` pada input & tombol). Proporsional dan enak dipandang. |
| **Latar Belakang** | Pitch-black (`bg-slate-950`), glowing radial mesh `blur-[140px]`, background dot/grid neon. | Latar belakang terang bersih (`bg-slate-50` / `bg-gray-100` / `bg-[#f9f9ff]`), border garis tipis, atau foto gedung kampus dengan overlay redup (*blend multiply*). |
| **Gradien** | Gradien teks `bg-clip-text text-transparent`, gradien tombol pelangi (emerald, purple, rose, amber). | Warna solid tegas (**Biru UTM `#00288e`** atau **Tailwind `blue-700`**). Hover state cukup transisi kecerahan standar (`hover:bg-blue-800`). |
| **Ukuran Font** | Judul berukuran raksasa `text-4xl` s/d `text-6xl` dengan tracking renggang berlebihan. | Proporsional portal akademik: Judul utama `text-xl` s/d `text-2xl` (maks `text-3xl`), teks body `text-sm` (14px), teks bantu `text-xs` (12px). |
| **Ukuran Icon** | Icon raksasa dalam boks bulat besar dengan gradien neon dan rotasi animasi liar. | Icon fungsional berukuran sedang (`w-5 h-5` atau `w-6 h-6`) dalam kontainer proporsional (`w-10 h-10` s/d `w-12 h-12`). |
| **Warna Role** | Tiap role diberi warna neon mencolok layaknya dashboard SaaS asing (hijau neon, ungu, pink). | Konsisten dengan identitas institusi UTM: dominan **Biru UTM (#00288e / #1d4ed8)** dengan aksen abu-abu netral (`text-gray-600`) dan badge status netral. |
| **Gimmick Visual** | Partikel, icon `Sparkles`, kartu tilt/3D hover yang berlebihan, glowing border `ring-blue-500/50`. | Garis border 1px halus (`border border-slate-200`), bayangan tipis (`shadow-sm`), transisi mikro standar (`hover:border-blue-500`). |

---

## 3. Palet Warna Resmi (UTM Academic Identity)

```css
/* Palet Utama */
--utm-primary: #00288e;        /* Biru Resmi UTM */
--utm-primary-hover: #001f70;  /* Hover state */
--utm-primary-light: #e8edff;  /* Background badge / active nav */
--utm-blue: #1d4ed8;           /* Tailwind Blue-700 untuk button aksen */
--utm-blue-hover: #1e40af;     /* Tailwind Blue-800 */

/* Netral & Permukaan */
--surface-bg: #f8fafc;         /* Background halaman (slate-50 / gray-50) */
--surface-card: #ffffff;       /* Background kartu */
--surface-border: #e2e8f0;     /* Border halus kartu / input (slate-200) */
--text-main: #0f172a;          /* Teks judul & label utama (slate-900) */
--text-muted: #64748b;         /* Teks deskripsi & placeholder (slate-500) */

/* Feedback */
--success: #15803d;            /* Green-700 */
--warning: #b45309;            /* Amber-700 */
--error: #b91c1c;              /* Red-700 */
```

---

## 4. Anatomi Halaman Login & Portal Akses

### A. Top Contact Bar (Informasi Kampus)
- Tinggi baris ringkas (`min-h-10` s/d `min-h-11`).
- Berisi info alamat: *"Jl. Raya Telang, PO BOX 2 Kamal, Bangkalan"*, No. Telp, Email kampus.
- Ukuran teks: `text-xs font-normal text-slate-600`.

### B. Navbar SIVITAS
- Background: `bg-white` dengan garis bawah tipis `border-b border-slate-200`.
- Logo ganda: **Logo UTM** + **Logo Prodi (Teknik Informatika)** berdampingan dengan tinggi `h-9` s/d `h-10`.
- Brand text:
  - Judul: **SIVITAS** / **SI-KP** (`text-xl font-bold text-[#00288e]`).
  - Subtitle: *Sistem Informasi Kerja Praktik* (`text-xs font-medium text-slate-500`).
- Tombol aksi kanan: Link "Home" atau "Panduan" dengan sudut `rounded-lg` (`text-sm font-medium px-4 py-2 bg-blue-700 text-white hover:bg-blue-800 rounded-lg`).

### C. Bagian "Pilih Akses Sistem" (Role Selection)
- Heading Section:
  - Kicker: `PORTAL AKSES` (`text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md`).
  - Title: `Pilih Akses Portal SI-KP` (`text-2xl sm:text-3xl font-bold text-slate-900`).
  - Subtitle: `Silakan pilih portal akses sesuai dengan peran Anda di lingkungan Teknik Informatika UTM` (`text-sm text-slate-500`).
- Kartu Role (`rounded-xl`):
  - Container: `bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-400 transition duration-200 flex flex-col justify-between`.
  - Icon Box: Ukuran `w-12 h-12 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl flex items-center justify-center mb-3`.
  - Title: `text-base font-bold text-slate-900`.
  - Badge Peran: `text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-md`.
  - Deskripsi: `text-xs text-slate-500 mt-1.5 leading-relaxed`.
  - Tombol aksi kartu: `text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 mt-4 pt-3 border-t border-slate-100`.

### D. Form Login (`rounded-2xl` / `rounded-xl`)
- Form berada di dalam kartu putih (`bg-white border border-slate-200 rounded-2xl shadow-md p-6 sm:p-8 max-w-md w-full`).
- Field input standar (`rounded-lg`):
  - Label: `text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 block`.
  - Input field: `w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition`.
  - Icon di dalam input: `w-4 h-4 text-slate-400 left-3`.
- Tombol Masuk: `w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-sm font-semibold rounded-lg shadow-xs transition`.

### E. Footer Institusi
- `© 2024 - 2026 SAKERA / SI-KP. All Rights Reserved.`
- `Teknik Informatika - Universitas Trunojoyo Madura`.
- Font `text-xs font-medium text-slate-500 border-t border-slate-200 bg-white py-4 px-4`.

---

## 5. Standar Kode Tailwind Komponen Baku

### 1. Card Biasa (Dashboard / Form / List)
```html
<div class="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
    <!-- Konten -->
</div>
```

### 2. Form Input
```html
<div>
    <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
        Nomor Induk Mahasiswa (NIM)
    </label>
    <div class="relative">
        <input 
            type="text" 
            class="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition" 
            placeholder="Contoh: 230411100092"
        />
    </div>
</div>
```

### 3. Tombol Utama (Primary Button)
```html
<button class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-sm font-semibold shadow-xs transition cursor-pointer">
    <span>Simpan Data</span>
</button>
```

### 4. Tombol Sekunder / Batal
```html
<button class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition cursor-pointer">
    <span>Batal</span>
</button>
```

### 5. Badge Status Akademik
```html
<!-- Sukses / Terverifikasi -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
    Disetujui
</span>

<!-- Proses / Menunggu -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
    Menunggu Verifikasi
</span>

<!-- Netral / Info -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
    S1 Informatika
</span>
```

### 6. Tabel Data Akademik
```html
<div class="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
    <table class="w-full text-left text-sm text-slate-700">
        <thead class="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <tr>
                <th class="px-4 py-3">No</th>
                <th class="px-4 py-3">NIM / Nama</th>
                <th class="px-4 py-3">Instansi KP</th>
                <th class="px-4 py-3">Status</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
            <tr class="hover:bg-slate-50/70">
                <td class="px-4 py-3">1</td>
                <td class="px-4 py-3 font-medium text-slate-900">230411100092 - Ahmad</td>
                <td class="px-4 py-3">PT Telkom Indonesia</td>
                <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Disetujui
                    </span>
                </td>
            </tr>
        </tbody>
    </table>
</div>
```

---

## 6. Checklist Validasi Kode FE

- [ ] **Border Radius Pas:** Kartu menggunakan `rounded-xl`, input dan tombol menggunakan `rounded-lg`, badge menggunakan `rounded-md`. Tidak ada `rounded-3xl` raksasa dan tidak kotak kaku 0px.
- [ ] Tidak ada latar gelap gulita (`bg-slate-950` / `bg-black`).
- [ ] Tidak ada efek `blur-[100px]` ke atas yang meniru aurora / neon mesh.
- [ ] Tidak ada teks ber-gradien (`bg-gradient-to-r text-transparent bg-clip-text`).
- [ ] Tidak ada tombol warna pelangi neon di halaman yang sama (merah muda, ungu, oranye neon).
- [ ] Memiliki header institusi resmi UTM yang jelas dan berwibawa.
- [ ] Tampilan konsisten antara halaman Login, Portal, dan Dashboard internal.
