<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kredensial Akun Pembimbing Lapangan SI-KP</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; line-height: 1.6; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0f766e, #0d9488); padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; letter-spacing: -0.025em; }
        .header p { margin: 0; font-size: 12px; opacity: 0.95; text-transform: uppercase; letter-spacing: 0.05em; }
        .content { padding: 32px 28px; }
        .greeting { font-size: 16px; font-weight: 700; margin-bottom: 14px; color: #0f172a; }
        .info-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px 20px; margin: 20px 0; font-size: 13.5px; color: #166534; }
        .info-card ul { margin: 8px 0 0 0; padding-left: 20px; }
        .info-card li { margin-bottom: 4px; }
        .credential-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin: 24px 0; }
        .credential-item { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
        .credential-item:last-child { margin-bottom: 0; }
        .label { font-weight: 600; color: #64748b; }
        .value { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 700; color: #0f172a; }
        .alert-box { background: #eff6ff; border-left: 4px solid #0d9488; padding: 14px; border-radius: 6px; font-size: 13px; color: #1e3a8a; margin-top: 20px; }
        .button { display: inline-block; background: #0d9488; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 22px; text-align: center; }
        .footer { text-align: center; padding: 20px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SI-KP TEKNIK INFORMATIKA</h1>
            <p>Universitas Trunojoyo Madura</p>
        </div>
        <div class="content">
            <div class="greeting">Yth. Bapak/Ibu {{ $nama }},</div>
            <p style="font-size: 14px; margin: 0 0 16px 0;">
                Terima kasih atas kesediaan {{ $namaInstansi }} menerima mahasiswa kami dalam pelaksanaan Kerja Praktik.
                Akun Pembimbing Lapangan Anda di Sistem Informasi Kerja Praktik (SI-KP) telah aktif.
            </p>

            <div class="info-card">
                <strong>Data Mahasiswa Bimbingan:</strong>
                <ul>
                    <li>Nama: <strong>{{ $namaMahasiswa }}</strong></li>
                    <li>NIM: <strong>{{ $nimMahasiswa }}</strong></li>
                    <li>Instansi: <strong>{{ $namaInstansi }}</strong></li>
                    @if($periodeKP)
                    <li>Periode: <strong>{{ $periodeKP }}</strong></li>
                    @endif
                </ul>
            </div>

            <p style="font-size: 14px; margin: 0 0 12px 0;">
                Gunakan kredensial berikut untuk masuk ke portal Pembimbing Lapangan:
            </p>

            <div class="credential-box">
                <div class="credential-item">
                    <span class="label">Alamat Email / Akun:</span>
                    <span class="value">{{ $email }}</span>
                </div>
                <div class="credential-item">
                    <span class="label">Password Sementara:</span>
                    <span class="value" style="color: #0d9488;">{{ $tempPassword }}</span>
                </div>
                <div class="credential-item">
                    <span class="label">Peran:</span>
                    <span class="value">Pembimbing Lapangan</span>
                </div>
            </div>

            <div class="alert-box">
                <strong>Catatan Keamanan:</strong> Demi keamanan akun, Anda akan diminta untuk mengganti password sementara saat pertama kali masuk ke sistem.
            </div>

            <div style="text-align: center;">
                <a href="{{ url('/login?role=instansi') }}" class="button">Masuk ke Portal Pembimbing Lapangan</a>
            </div>

            <p style="font-size: 12.5px; color: #64748b; margin-top: 24px;">
                Melalui portal ini, Anda dapat memantau proposal, memvalidasi logbook aktivitas harian mahasiswa, serta memberikan penilaian akhir kerja praktik.
            </p>
        </div>
        <div class="footer">
            &copy; 2026 Program Studi Teknik Informatika, Fakultas Teknik, Universitas Trunojoyo Madura.<br>
            Jl. Raya Telang, PO.Box 2 Kamal, Bangkalan, Madura. Email otomatis sistem.
        </div>
    </div>
</body>
</html>
