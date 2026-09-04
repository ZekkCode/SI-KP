<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aktivasi Akun Mahasiswa SI-KP</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; line-height: 1.6; }
        .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; letter-spacing: -0.025em; }
        .header p { margin: 0; font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.05em; }
        .content { padding: 32px 28px; }
        .greeting { font-size: 15px; font-weight: 600; margin-bottom: 16px; color: #0f172a; }
        .credential-box { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin: 24px 0; }
        .credential-item { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
        .credential-item:last-child { margin-bottom: 0; }
        .label { font-weight: 600; color: #64748b; }
        .value { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 700; color: #0f172a; }
        .alert-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px; border-radius: 6px; font-size: 13px; color: #1e40af; margin-top: 20px; }
        .button { display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 20px; text-align: center; }
        .footer { text-align: center; padding: 20px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SI-KP TEKNIK INFORMATIKA</h1>
            <p>Universitas Trunodjoyo Madura</p>
        </div>
        <div class="content">
            <div class="greeting">Halo, {{ $nama }}!</div>
            <p style="font-size: 14px; margin: 0 0 16px 0;">
                Permohonan pembuatan akun Sistem Informasi Kerja Praktik (SI-KP) Anda telah <strong>disetujui oleh Tata Usaha</strong>. Berikut adalah data kredensial akun Anda:
            </p>

            <div class="credential-box">
                <div class="credential-item">
                    <span class="label">Username (NIM):</span>
                    <span class="value">{{ $nim }}</span>
                </div>
                <div class="credential-item">
                    <span class="label">Password Sementara:</span>
                    <span class="value" style="color: #2563eb;">{{ $tempPassword }}</span>
                </div>
            </div>

            <div class="alert-box">
                <strong>Penting:</strong> Demi keamanan akun Anda, sistem mewajibkan Anda untuk <strong>mengganti password baru</strong> saat pertama kali login.
            </div>

            <div style="text-align: center;">
                <a href="{{ url('/login?role=mahasiswa') }}" class="button" style="color: #ffffff;">Masuk ke Portal Mahasiswa</a>
            </div>
        </div>
        <div class="footer">
            &copy; 2026 Teknik Informatika, Fakultas Teknik, Universitas Trunodjoyo Madura.<br>
            Email ini dibuat secara otomatis oleh sistem, mohon jangan membalas email ini.
        </div>
    </div>
</body>
</html>
