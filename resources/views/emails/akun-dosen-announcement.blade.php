<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pemberitahuan Akun Dosen Pembimbing SI-KP</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; line-height: 1.6; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #065f46, #059669); padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; letter-spacing: -0.025em; }
        .header p { margin: 0; font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.05em; }
        .content { padding: 32px 28px; }
        .greeting { font-size: 16px; font-weight: 700; margin-bottom: 14px; color: #0f172a; }
        .announcement-text { font-size: 14px; color: #334155; margin-bottom: 20px; line-height: 1.7; }
        .credential-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 22px; margin: 24px 0; }
        .credential-box h3 { margin: 0 0 14px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #059669; font-weight: 700; }
        .credential-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 14px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 10px; }
        .credential-item:last-child { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
        .label { font-weight: 600; color: #64748b; }
        .value { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 700; color: #0f172a; }
        .alert-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 14px; border-radius: 6px; font-size: 13px; color: #92400e; margin: 22px 0; line-height: 1.6; }
        .button-wrapper { text-align: center; margin: 28px 0 16px 0; }
        .button { display: inline-block; background: #059669; color: #ffffff !important; text-decoration: none; padding: 13px 30px; border-radius: 10px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(5,150,105,0.25); }
        .footer { text-align: center; padding: 20px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; background: #fcfcfc; }
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
            <p class="announcement-text">
                Bersama ini kami sampaikan bahwa akun Anda pada <strong>Sistem Informasi Kerja Praktik (SI-KP) Teknik Informatika UTM</strong> telah berhasil diaktifkan oleh Koordinator Kerja Praktik.
            </p>
            <p class="announcement-text">
                Akun ini digunakan untuk memonitor progres kerja praktik mahasiswa bimbingan, meninjau logbook harian, serta memberikan penilaian seminar Kerja Praktik.
            </p>

            <div class="credential-box">
                <h3>Informasi Kredensial Masuk</h3>
                <div class="credential-item">
                    <span class="label">Portal Akses:</span>
                    <span class="value" style="color: #059669;">Portal Dosen Pembimbing</span>
                </div>
                <div class="credential-item">
                    <span class="label">Username (NIP):</span>
                    <span class="value">{{ $nip }}</span>
                </div>
                <div class="credential-item">
                    <span class="label">Email Terdaftar:</span>
                    <span class="value">{{ $email }}</span>
                </div>
                <div class="credential-item">
                    <span class="label">Password Sementara:</span>
                    <span class="value" style="color: #059669; font-size: 16px; letter-spacing: 0.05em;">{{ $tempPassword }}</span>
                </div>
            </div>

            <div class="alert-box">
                <strong>Pemberitahuan Keamanan:</strong><br>
                Demi menjaga privasi dan keamanan akun Anda, sistem akan secara otomatis mewajibkan Bapak/Ibu untuk <strong>mengganti password baru</strong> pada saat pertama kali login ke dalam sistem.
            </div>

            <div class="button-wrapper">
                <a href="{{ url('/login?role=dosen') }}" class="button">
                    Masuk ke Portal Dosen SI-KP &rarr;
                </a>
            </div>

            <p style="font-size: 12px; color: #64748b; margin-top: 24px; text-align: center;">
                Jika tombol di atas tidak dapat diklik, salin dan buka tautan berikut pada peramban web Anda:<br>
                <a href="{{ url('/login?role=dosen') }}" style="color: #059669; word-break: break-all;">{{ url('/login?role=dosen') }}</a>
            </p>
        </div>
        <div class="footer">
            &copy; 2026 Program Studi Teknik Informatika, Fakultas Teknik, Universitas Trunojoyo Madura.<br>
            Pesan ini dikirimkan secara otomatis oleh Sistem Informasi Kerja Praktik.
        </div>
    </div>
</body>
</html>
