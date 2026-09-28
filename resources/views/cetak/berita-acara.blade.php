<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Berita Acara Sidang Kerja Praktik</title>
    <style>
        body { 
            font-family: 'Times New Roman', Times, serif; 
            font-size: 12pt;
            line-height: 1.45; 
            color: black; 
            background-color: white;
            margin: 0;
            padding: 0;
        }
        .cetak-container { 
            width: 100%; 
            max-width: 21cm;
            margin: 0 auto; 
            padding: 1.5cm 2cm; 
            box-sizing: border-box;
        }
        .kop-surat {
            border-bottom: 3px double black;
            margin-bottom: 20px;
            padding-bottom: 8px;
            display: table;
            width: 100%;
        }
        .kop-logo {
            display: table-cell;
            vertical-align: middle;
            width: 85px;
        }
        .kop-logo img {
            width: 80px;
            height: auto;
        }
        .kop-text {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
        }
        .kop-text h1 {
            margin: 0;
            font-size: 12pt;
            font-weight: normal;
            text-transform: uppercase;
        }
        .kop-text h2 {
            margin: 2px 0;
            font-size: 13pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .kop-text h3 {
            margin: 2px 0;
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .kop-text p {
            margin: 0;
            font-size: 9pt;
            font-style: italic;
        }
        .judul-surat {
            text-align: center;
            font-weight: bold;
            text-decoration: underline;
            margin-top: 15px;
            margin-bottom: 4px;
            font-size: 13pt;
            text-transform: uppercase;
        }
        .nomor-surat {
            text-align: center;
            font-size: 11pt;
            margin-bottom: 20px;
        }
        .tabel-data {
            width: 100%;
            margin-bottom: 15px;
            border-collapse: collapse;
        }
        .tabel-data td {
            padding: 4px 0;
            vertical-align: top;
            font-size: 11pt;
        }
        .tabel-data td:first-child {
            width: 200px;
        }
        .tabel-data td:nth-child(2) {
            width: 15px;
            text-align: center;
        }
        .tabel-ttd {
            width: 100%;
            margin-top: 25px;
            border-collapse: collapse;
        }
        .tabel-ttd td {
            vertical-align: top;
            font-size: 11pt;
        }
        @media print {
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="no-print" style="background: #f1f5f9; padding: 12px; text-align: center; border-bottom: 1px solid #cbd5e1;">
        <button onclick="window.print()" style="background: #00288e; color: white; padding: 8px 20px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px;">
            Cetak / Simpan PDF
        </button>
    </div>

    @php
        $sigService = app(\App\Services\DigitalSignatureService::class);
        $kaprodiSig = $sigService->getSignatureBlock('kaprodi');
        $dekanSig = $sigService->getSignatureBlock('dekan');
        $docId = $pendaftaran->sidang?->id ? "BA-KP-" . date('Y') . "-" . str_pad($pendaftaran->sidang->id, 4, '0', STR_PAD_LEFT) : "BA-KP-" . date('Ymd');
    @endphp

    <div class="cetak-container">
        <!-- KOP SURAT RESMI UTM -->
        <div class="kop-surat">
            <div class="kop-logo">
                <img src="{{ asset('assets/img/logo-utm.png') }}" alt="Logo UTM" onerror="this.src='https://upload.wikimedia.org/wikipedia/id/0/07/Logo_Universitas_Trunojoyo_Madura.png'">
            </div>
            <div class="kop-text">
                <h1>KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</h1>
                <h2>UNIVERSITAS TRUNOJOYO MADURA</h2>
                <h3>FAKULTAS TEKNIK</h3>
                <p>Jl. Raya Telang PO BOX 2 Kamal, Bangkalan - Madura | Telp: (031) 3011147 | Fax: (031) 3011506</p>
                <p>Laman: www.trunojoyo.ac.id | Surel: ft@trunojoyo.ac.id</p>
            </div>
        </div>

        <div class="judul-surat">BERITA ACARA SEMINAR KERJA PRAKTIK</div>
        <div class="nomor-surat">Nomor: {{ $docId }}</div>

        <p style="text-align: justify; font-size: 11pt; margin-bottom: 15px;">
            Pada hari ini <strong>{{ $tanggal_hari ?? now()->translatedFormat('l, d F Y') }}</strong>, telah diselenggarakan Seminar/Sidang Kerja Praktik bagi mahasiswa Program Studi Teknik Informatika Fakultas Teknik Universitas Trunojoyo Madura:
        </p>

        <!-- DATA MAHASISWA & KP -->
        <table class="tabel-data">
            <tr>
                <td>Nama Mahasiswa</td>
                <td>:</td>
                <td><strong>{{ $pendaftaran->mahasiswa->name ?? '-' }}</strong></td>
            </tr>
            <tr>
                <td>NIM</td>
                <td>:</td>
                <td><strong>{{ $pendaftaran->mahasiswa->nim ?? '-' }}</strong></td>
            </tr>
            <tr>
                <td>Program Studi</td>
                <td>:</td>
                <td>Teknik Informatika</td>
            </tr>
            <tr>
                <td>Tempat / Perusahaan KP</td>
                <td>:</td>
                <td>{{ $pendaftaran->instansi->nama ?? '-' }} ({{ $pendaftaran->instansi->kota ?? '' }})</td>
            </tr>
            <tr>
                <td>Periode Pelaksanaan</td>
                <td>:</td>
                <td>
                    {{ $pendaftaran->tanggal_mulai ? $pendaftaran->tanggal_mulai->translatedFormat('d F Y') : '-' }} s.d. 
                    {{ $pendaftaran->tanggal_selesai ? $pendaftaran->tanggal_selesai->translatedFormat('d F Y') : '-' }}
                </td>
            </tr>
            <tr>
                <td>Judul Laporan Kerja Praktik</td>
                <td>:</td>
                <td><em>{{ $pendaftaran->proposals->first()?->judul ?? 'Laporan Pelaksanaan Kerja Praktik' }}</em></td>
            </tr>
            <tr>
                <td>Dosen Pembimbing & Penguji</td>
                <td>:</td>
                <td>{{ $pendaftaran->dosenPembimbing->name ?? '-' }} (NIP. {{ $pendaftaran->dosenPembimbing->nip ?? '-' }})</td>
            </tr>
            <tr>
                <td>Waktu & Ruangan Sidang</td>
                <td>:</td>
                <td>
                    {{ $pendaftaran->sidang?->tanggal_sidang ? $pendaftaran->sidang->tanggal_sidang->translatedFormat('d F Y, H:i') . ' WIB' : now()->translatedFormat('d F Y') }} 
                    | Ruang: {{ $pendaftaran->sidang?->ruangan ?? 'Ruang Sidang Jurusan TI' }}
                </td>
            </tr>
        </table>

        <!-- HASIL SEMINAR -->
        <div style="margin-top: 15px; margin-bottom: 15px; font-size: 11pt; line-height: 1.5;">
            <p>Berdasarkan hasil presentasi, penguasaan materi, dan evaluasi laporan Kerja Praktik, mahasiswa tersebut dinyatakan:</p>
            <div style="border: 1.5px solid black; padding: 10px 15px; text-align: center; margin: 10px 0; font-weight: bold; font-size: 13pt; text-transform: uppercase;">
                @if($pendaftaran->nilaiAkhir && $pendaftaran->nilaiAkhir->status === 'lulus')
                    LULUS (NILAI AKHIR: {{ $pendaftaran->nilaiAkhir->nilai_total }} / {{ $pendaftaran->nilaiAkhir->nilai_huruf }})
                @elseif($pendaftaran->nilaiAkhir && $pendaftaran->nilaiAkhir->status === 'tidak_lulus')
                    TIDAK LULUS
                @else
                    LULUS DENGAN PERBAIKAN
                @endif
            </div>
            <p style="font-size: 10pt; font-style: italic;">
                Demikian Berita Acara ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.
            </p>
        </div>

        <!-- TANDA TANGAN DIGITAL DUA PIHAK -->
        <table class="tabel-ttd">
            <tr>
                <td style="width: 50%; text-align: left;">
                    Mengetahui,<br>
                    {{ $kaprodiSig['jabatan'] }},
                </td>
                <td style="width: 50%; text-align: left; padding-left: 20px;">
                    Bangkalan, {{ now()->translatedFormat('d F Y') }}<br>
                    Dosen Pembimbing / Penguji,
                </td>
            </tr>
            <tr>
                <td style="height: 70px; vertical-align: middle;">
                    @if($kaprodiSig['ttd_exists'])
                        <img src="{{ asset($kaprodiSig['ttd_path']) }}" alt="TTD Kaprodi" style="max-height: 65px;">
                    @else
                        <div style="font-family: Arial, sans-serif; font-size: 9.5px; color: #0f766e; border: 1px dashed #0d9488; padding: 5px 8px; border-radius: 4px; display: inline-block; background-color: #f0fdfa;">
                            <b>Ditandatangani secara Digital</b><br>
                            Koordinator Program Studi TI<br>
                            <span style="font-size: 8px;">Hash: {{ $kaprodiSig['security_hash'] }}</span>
                        </div>
                    @endif
                </td>
                <td style="height: 70px; vertical-align: middle; padding-left: 20px;">
                    <div style="font-family: Arial, sans-serif; font-size: 9.5px; color: #1e3a8a; border: 1px dashed #2563eb; padding: 5px 8px; border-radius: 4px; display: inline-block; background-color: #eff6ff;">
                        <b>Tervalidasi Digital</b><br>
                        Dosen Penguji Kerja Praktik<br>
                        <span style="font-size: 8px;">Tgl: {{ now()->format('d/m/Y') }}</span>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="text-align: left;">
                    <strong>{{ $kaprodiSig['nama'] }}</strong><br>
                    NIP. {{ $kaprodiSig['nip'] }}
                </td>
                <td style="text-align: left; padding-left: 20px;">
                    <strong>{{ $pendaftaran->dosenPembimbing->name ?? '-' }}</strong><br>
                    NIP. {{ $pendaftaran->dosenPembimbing->nip ?? '-' }}
                </td>
            </tr>
        </table>

        <!-- FOOTER VERIFIKASI -->
        <div style="margin-top: 25px; border-top: 1px dashed #cbd5e1; padding-top: 8px; font-size: 9px; color: #64748b; display: flex; justify-content: space-between;">
            <div>
                Dokumen resmi Berita Acara Kerja Praktik diterbitkan oleh Sistem Informasi Kerja Praktik (SI-KP).
            </div>
            <div>
                Security Hash: <strong>{{ $kaprodiSig['security_hash'] }}</strong>
            </div>
        </div>
    </div>
</body>
</html>
