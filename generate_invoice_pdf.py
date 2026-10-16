import subprocess
import os
import pypdf

html_content = """<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Rincian Biaya & Patungan Pengerjaan SI-KP</title>
<style>
  @page {
    size: A4 portrait;
    margin: 8mm 12mm 8mm 12mm;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    color: #1f2937;
    background: #ffffff;
    font-size: 8pt;
    line-height: 1.3;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 8px;
    border-bottom: 2px solid #1e3a8a;
    margin-bottom: 8px;
  }
  .brand-title {
    font-size: 14pt;
    font-weight: 800;
    color: #1e3a8a;
    letter-spacing: -0.3px;
  }
  .brand-sub {
    font-size: 7.5pt;
    color: #4b5563;
    margin-top: 1px;
  }
  .header-meta {
    text-align: right;
    font-size: 7.5pt;
    color: #4b5563;
    line-height: 1.35;
  }
  .header-meta strong {
    color: #111827;
  }
  .meta-grid {
    display: flex;
    gap: 10px;
    margin-bottom: 8px;
  }
  .meta-card {
    flex: 1;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    padding: 6px 9px;
  }
  .meta-title {
    font-size: 7pt;
    font-weight: 700;
    text-transform: uppercase;
    color: #1e3a8a;
    margin-bottom: 2px;
  }
  .meta-desc {
    font-size: 7.5pt;
    color: #374151;
    line-height: 1.3;
  }
  .section-heading {
    font-size: 8.5pt;
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .section-heading::before {
    content: "";
    display: inline-block;
    width: 3px;
    height: 10px;
    background: #1e3a8a;
    border-radius: 1px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 7px;
    font-size: 7.2pt;
  }
  th {
    background: #f3f4f6;
    color: #1f2937;
    font-weight: 700;
    text-align: left;
    padding: 4px 6px;
    border: 1px solid #d1d5db;
    font-size: 7.2pt;
  }
  td {
    padding: 3.5px 6px;
    border: 1px solid #e5e7eb;
    vertical-align: top;
  }
  tr:nth-child(even) td {
    background: #fafafa;
  }
  .text-right { text-align: right; }
  .text-center { text-align: center; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }
  
  .badge-done {
    background: #dcfce7;
    color: #166534;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 2px;
    font-size: 6.5pt;
    display: inline-block;
  }
  .badge-sisa {
    background: #fef3c7;
    color: #92400e;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 2px;
    font-size: 6.5pt;
    display: inline-block;
  }
  .row-subtotal td {
    background: #f9fafb;
    font-weight: 700;
    color: #374151;
  }
  .row-dp td {
    background: #f0fdf4;
    color: #166534;
    font-weight: 700;
  }
  .row-total td {
    background: #eff6ff;
    color: #1e3a8a;
    font-weight: 800;
    font-size: 8pt;
    border-top: 1.5px solid #1e3a8a;
  }
  .summary-boxes {
    display: flex;
    gap: 8px;
    margin-bottom: 7px;
  }
  .summary-item {
    flex: 1;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    padding: 5px 8px;
    background: #ffffff;
    text-align: center;
  }
  .summary-item.active {
    background: #eff6ff;
    border-color: #1e3a8a;
  }
  .sum-lbl {
    font-size: 6.5pt;
    color: #6b7280;
    text-transform: uppercase;
    font-weight: 600;
  }
  .sum-val {
    font-size: 11pt;
    font-weight: 800;
    color: #1e3a8a;
    margin-top: 1px;
  }
  .footer-flex {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid #e5e7eb;
  }
  .notes {
    width: 65%;
    font-size: 6.8pt;
    color: #4b5563;
    line-height: 1.35;
  }
  .notes strong {
    color: #111827;
  }
  .sign {
    width: 30%;
    text-align: right;
    font-size: 7.2pt;
    color: #374151;
  }
  .sign-name {
    margin-top: 25px;
    font-weight: 700;
    color: #111827;
    text-decoration: underline;
  }
</style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div>
      <div class="brand-title">ZEKKSTORE</div>
      <div class="brand-sub">Jasa Pembuatan & Pengembangan Sistem Informasi</div>
    </div>
    <div class="header-meta">
      <strong>Rincian Biaya & Patungan Pengerjaan</strong><br>
      Tanggal: 4 Oktober 2026 &nbsp;|&nbsp; Ref: KP-UTM/2026-10
    </div>
  </div>

  <!-- META INFO -->
  <div class="meta-grid">
    <div class="meta-card">
      <div class="meta-title">Data Pemesan / Klien:</div>
      <div class="meta-desc">
        <strong>Mas Devano & Rekan (Kelompok 4 Orang)</strong><br>
        S1 Teknik Informatika &bull; Universitas Trunojoyo Madura
      </div>
    </div>
    <div class="meta-card">
      <div class="meta-title">Keterangan Sistem:</div>
      <div class="meta-desc">
        <strong>Sistem Informasi Kerja Praktik (SI-KP) Multi-User</strong><br>
        Laravel 11, React TypeScript, Inertia.js, MySQL
      </div>
    </div>
  </div>

  <!-- TABEL 1: DAFTAR FITUR -->
  <div class="section-heading">1. Rincian Pekerjaan & Fitur Sistem</div>
  <table>
    <thead>
      <tr>
        <th style="width: 20px;" class="text-center">No</th>
        <th style="width: 125px;">Item / Modul</th>
        <th>Deskripsi Pengerjaan</th>
        <th style="width: 65px;" class="text-center">Status</th>
        <th style="width: 85px;" class="text-right">Biaya (Rp)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center font-bold">0</td>
        <td class="font-semibold">Revisi Tampilan & SSO</td>
        <td>Perapian tampilan warna UTM, penyesuaian tata letak menu, logo, dan integrasi login SSO.</td>
        <td class="text-center"><span class="badge-done">Lunas (Devano)</span></td>
        <td class="text-right font-semibold">80.000</td>
      </tr>
      <tr>
        <td class="text-center font-bold">1</td>
        <td class="font-semibold">Pendaftaran & Dosen Otomatis</td>
        <td>Dosen wali otomatis jadi pembimbing KP, penyesuaian syarat lulus 80 SKS, dan perapian notifikasi.</td>
        <td class="text-center"><span class="badge-done">Selesai</span></td>
        <td class="text-right font-semibold">45.000</td>
      </tr>
      <tr>
        <td class="text-center font-bold">2</td>
        <td class="font-semibold">Respon Instansi & Akun PL</td>
        <td>Halaman konfirmasi tempat KP (/konfirmasi/{token}), otomatis buat akun Pembimbing Lapangan dan kirim ke email.</td>
        <td class="text-center"><span class="badge-done">Selesai</span></td>
        <td class="text-right font-semibold">85.000</td>
      </tr>
      <tr>
        <td class="text-center font-bold">3</td>
        <td class="font-semibold">Surat Pengantar & QR Code</td>
        <td>Cetak PDF surat pengantar bertanda tangan Dekan & barcode verifikasi untuk validasi keaslian berkas.</td>
        <td class="text-center"><span class="badge-done">Selesai</span></td>
        <td class="text-right font-semibold">50.000</td>
      </tr>
      <tr>
        <td class="text-center font-bold">4</td>
        <td class="font-semibold">Logbook & Nilai Lapangan</td>
        <td>Upload logbook harian mahasiswa + foto kegiatan, acc oleh PL, dan input nilai Form KP-6a (PL) & KP-6b (Dosen).</td>
        <td class="text-center"><span class="badge-done">Selesai</span></td>
        <td class="text-right font-semibold">75.000</td>
      </tr>
      <tr>
        <td class="text-center font-bold">5</td>
        <td class="font-semibold">Pengajuan Sidang & Form Nilai</td>
        <td>Menu daftar sidang mahasiswa, cek syarat berkas, plotting jadwal/ruangan oleh prodi, dan form berita acara KP-5.</td>
        <td class="text-center"><span class="badge-done">Selesai</span></td>
        <td class="text-right font-semibold">65.000</td>
      </tr>
      <tr>
        <td class="text-center font-bold">6</td>
        <td class="font-semibold">Alur Berurutan (Stepper)</td>
        <td>Kunci akses menu agar mahasiswa menyelesaikan tahapan secara urut dan tidak bisa lompat sebelum acc.</td>
        <td class="text-center"><span class="badge-done">Selesai</span></td>
        <td class="text-right font-semibold">40.000</td>
      </tr>
      <tr>
        <td class="text-center font-bold">7</td>
        <td class="font-semibold">Kelengkapan 21 Form Panduan</td>
        <td>Integrasi 21 template format resmi panduan KP (Form KP-1 s/d KP-8, lembar konsultasi, dll) siap unduh.</td>
        <td class="text-center"><span class="badge-done">Selesai</span></td>
        <td class="text-right font-semibold">60.000</td>
      </tr>
      <tr class="row-subtotal">
        <td colspan="4" class="text-right">Total Keseluruhan Proyek:</td>
        <td class="text-right">Rp 500.000</td>
      </tr>
      <tr class="row-dp">
        <td colspan="4" class="text-right">Sudah Dibayarkan di Awal (Mas Devano):</td>
        <td class="text-right">- Rp 80.000</td>
      </tr>
      <tr class="row-total">
        <td colspan="4" class="text-right">Sisa Tagihan Kelompok:</td>
        <td class="text-right">Rp 420.000</td>
      </tr>
    </tbody>
  </table>

  <!-- TABEL 2: PATUNGAN 4 ORANG -->
  <div class="section-heading">2. Rincian Pembagian Patungan (4 Orang)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 20px;" class="text-center">No</th>
        <th style="width: 95px;">Nama</th>
        <th>Keterangan Porsi</th>
        <th style="width: 75px;" class="text-right">Porsi Normal</th>
        <th style="width: 75px;" class="text-right">Sudah Bayar</th>
        <th style="width: 75px;" class="text-right">Sisa Bayar</th>
        <th style="width: 60px;" class="text-center">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center font-bold">1</td>
        <td class="font-semibold">Mas Devano</td>
        <td>Tanggungan 125k dipotong pembayaran awal revisi tampilan & SSO (80k)</td>
        <td class="text-right">Rp 125.000</td>
        <td class="text-right font-semibold" style="color: #166534;">- Rp 80.000</td>
        <td class="text-right font-bold" style="color: #1e3a8a;">Rp 45.000</td>
        <td class="text-center"><span class="badge-sisa">Sisa 45k</span></td>
      </tr>
      <tr>
        <td class="text-center font-bold">2</td>
        <td class="font-semibold">Anggota 2</td>
        <td>Tanggungan patungan sistem lengkap (fitur bimbingan, sidang & dokumen)</td>
        <td class="text-right">Rp 125.000</td>
        <td class="text-right" style="color: #9ca3af;">Rp 0</td>
        <td class="text-right font-bold" style="color: #1e3a8a;">Rp 125.000</td>
        <td class="text-center"><span class="badge-sisa">Belum</span></td>
      </tr>
      <tr>
        <td class="text-center font-bold">3</td>
        <td class="font-semibold">Anggota 3</td>
        <td>Tanggungan patungan sistem lengkap (fitur bimbingan, sidang & dokumen)</td>
        <td class="text-right">Rp 125.000</td>
        <td class="text-right" style="color: #9ca3af;">Rp 0</td>
        <td class="text-right font-bold" style="color: #1e3a8a;">Rp 125.000</td>
        <td class="text-center"><span class="badge-sisa">Belum</span></td>
      </tr>
      <tr>
        <td class="text-center font-bold">4</td>
        <td class="font-semibold">Anggota 4</td>
        <td>Tanggungan patungan sistem lengkap (fitur bimbingan, sidang & dokumen)</td>
        <td class="text-right">Rp 125.000</td>
        <td class="text-right" style="color: #9ca3af;">Rp 0</td>
        <td class="text-right font-bold" style="color: #1e3a8a;">Rp 125.000</td>
        <td class="text-center"><span class="badge-sisa">Belum</span></td>
      </tr>
      <tr class="row-total">
        <td colspan="3" class="text-right">Total Pelunasan Kelompok:</td>
        <td class="text-right">Rp 500.000</td>
        <td class="text-right">- Rp 80.000</td>
        <td class="text-right">Rp 420.000</td>
        <td class="text-center">Pending</td>
      </tr>
    </tbody>
  </table>

  <!-- RINGKASAN ANGKA -->
  <div class="summary-boxes">
    <div class="summary-item">
      <div class="sum-lbl">Total Biaya</div>
      <div class="sum-val" style="color: #374151;">Rp 500.000</div>
    </div>
    <div class="summary-item">
      <div class="sum-lbl">Sudah Masuk (Devano)</div>
      <div class="sum-val" style="color: #166534;">Rp 80.000</div>
    </div>
    <div class="summary-item active">
      <div class="sum-lbl">Sisa Pelunasan</div>
      <div class="sum-val">Rp 420.000</div>
    </div>
    <div class="summary-item">
      <div class="sum-lbl">Porsi per Orang</div>
      <div class="sum-val" style="color: #2563eb;">Rp 125.000</div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer-flex">
    <div class="notes">
      <strong>Catatan Pengerjaan:</strong><br>
      &bull; Termasuk bantuan teknis jika ada kendala saat instalasi atau uji coba presentasi.<br>
      &bull; Diberikan garansi revisi minor jika terdapat masukan dari dosen pembimbing/penguji.<br>
      &bull; Penyerahan file source code dan database diberikan setelah pelunasan selesai.
    </div>
    <div class="sign">
      Bangkalan, 4 Oktober 2026<br>
      Pengembang,<br>
      <div class="sign-name">ZekkStore</div>
    </div>
  </div>

</body>
</html>
"""

html_file = os.path.abspath("test_invoice.html")
with open(html_file, "w", encoding="utf-8") as f:
    f.write(html_content)

target_pdf_1 = os.path.abspath(r"d:\freelance-zekkstore\2026\joki-dokumen\mas devano kp\Rincian_Biaya_Pengembangan_SI_KP.pdf")
target_pdf_2 = os.path.abspath(r"d:\freelance-zekkstore\2026\joki-dokumen\mas devano kp\KP-PRODI\KP-PRODI\public\dokumen\Rincian_Biaya_Pengembangan_SI_KP.pdf")

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    f"--print-to-pdf={target_pdf_1}",
    "--no-pdf-header-footer",
    html_file
]

subprocess.run(cmd, capture_output=True, text=True)

import shutil
if os.path.exists(target_pdf_1):
    shutil.copyfile(target_pdf_1, target_pdf_2)
    reader = pypdf.PdfReader(target_pdf_1)
    print(f"Success! Page count: {len(reader.pages)}, file size: {os.path.getsize(target_pdf_1)} bytes")
else:
    print("Failed")

if os.path.exists(html_file):
    os.remove(html_file)
