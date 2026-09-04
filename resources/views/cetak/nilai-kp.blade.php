<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Nilai Kerja Praktik</title>
    <style>
        body { 
            font-family: 'Times New Roman', Times, serif; 
            font-size: 12pt;
            line-height: 1.5; 
            color: black; 
            background-color: white;
            margin: 0;
            padding: 0;
        }
        .cetak-container { 
            width: 100%; 
            max-width: 21cm;
            margin: 0 auto; 
            padding: 2cm; 
            box-sizing: border-box;
        }
        .kop-surat {
            border-bottom: 3px solid black;
            margin-bottom: 20px;
            padding-bottom: 10px;
            display: table;
            width: 100%;
        }
        .kop-logo {
            display: table-cell;
            vertical-align: middle;
            width: 100px;
        }
        .kop-logo img {
            width: 90px;
            height: auto;
        }
        .kop-text {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
        }
        .kop-text h1 {
            margin: 0;
            font-size: 14pt;
            text-transform: uppercase;
        }
        .kop-text h2 {
            margin: 0;
            font-size: 16pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .kop-text p {
            margin: 0;
            font-size: 10pt;
        }
        .judul-surat {
            text-align: center;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 20px;
            font-size: 14pt;
            text-transform: uppercase;
        }
        .data-mahasiswa {
            margin-bottom: 20px;
        }
        .data-mahasiswa table {
            width: 100%;
        }
        .data-mahasiswa td {
            padding: 3px 0;
            vertical-align: top;
        }
        .data-mahasiswa td:first-child {
            width: 200px;
        }
        .data-mahasiswa td:nth-child(2) {
            width: 10px;
        }
        .tabel-nilai {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .tabel-nilai th, .tabel-nilai td {
            border: 1px solid black;
            padding: 8px;
        }
        .tabel-nilai th {
            text-align: center;
            background-color: #f2f2f2;
        }
        .tabel-nilai td.angka {
            text-align: center;
        }
        .tanda-tangan {
            width: 100%;
            margin-top: 50px;
            page-break-inside: avoid;
        }
        .tanda-tangan table {
            width: 100%;
        }
        .tanda-tangan td {
            width: 50%;
            text-align: center;
            vertical-align: bottom;
            height: 120px;
        }
        .nama-ttd {
            font-weight: bold;
            text-decoration: underline;
        }
        
        @media print {
            body { 
                background-color: white;
            }
            .cetak-container {
                padding: 0;
                margin: 0;
                max-width: none;
                width: 100%;
            }
            @page {
                size: A4;
                margin: 2cm;
            }
            .tabel-nilai th {
                background-color: #e0e0e0 !important; /* Force background color if supported */
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>
<body onload="window.print()">
    <div class="cetak-container">
        
        <div class="kop-surat">
            <div class="kop-logo">
                <img src="{{ asset('assets/img/utm.png') }}" alt="Logo UTM">
            </div>
            <div class="kop-text">
                <h1>KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI</h1>
                <h2>UNIVERSITAS TRUNOJOYO MADURA</h2>
                <h2>FAKULTAS TEKNIK</h2>
                <p>Jl. Raya Telang, PO. Box. 2 Kamal, Bangkalan - Madura</p>
                <p>Telp : (031) 3011146, Fax. (031) 3011506</p>
                <p>Laman : www.trunojoyo.ac.id</p>
            </div>
        </div>

        <div class="judul-surat">
            BERITA ACARA HASIL PENILAIAN KERJA PRAKTIK
        </div>

        <div class="data-mahasiswa">
            <p>Berdasarkan penilaian yang telah dilakukan oleh Dosen Pembimbing dan Pembimbing Instansi/Perusahaan, berikut adalah hasil akhir evaluasi Kerja Praktik untuk mahasiswa:</p>
            <table>
                <tr>
                    <td>Nama Mahasiswa</td>
                    <td>:</td>
                    <td>{{ $rapor['mahasiswa']->name }}</td>
                </tr>
                <tr>
                    <td>N.I.M</td>
                    <td>:</td>
                    <td>{{ $rapor['mahasiswa']->nim }}</td>
                </tr>
                <tr>
                    <td>Instansi/Perusahaan</td>
                    <td>:</td>
                    <td>{{ $rapor['instansi'] }}</td>
                </tr>
                <tr>
                    <td>Dosen Pembimbing</td>
                    <td>:</td>
                    <td>{{ $rapor['dosen_pembimbing'] }}</td>
                </tr>
            </table>
        </div>

        <table class="tabel-nilai">
            <thead>
                <tr>
                    <th rowspan="2">No</th>
                    <th rowspan="2">Komponen Penilaian</th>
                    <th colspan="2">Rincian Nilai</th>
                </tr>
                <tr>
                    <th>Agregat Instansi (30%)</th>
                    <th>Agregat Dosen (30%)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="angka">1</td>
                    <td>Sistematika Penulisan</td>
                    <td class="angka">-</td>
                    <td class="angka">{{ $rapor['rincian_dosen']->where('komponen', 'sistematika')->first()['nilai'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="angka">2</td>
                    <td>Kedalaman Materi</td>
                    <td class="angka">-</td>
                    <td class="angka">{{ $rapor['rincian_dosen']->where('komponen', 'kedalaman')->first()['nilai'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="angka">3</td>
                    <td>Penguasaan Materi</td>
                    <td class="angka">-</td>
                    <td class="angka">{{ $rapor['rincian_dosen']->where('komponen', 'penguasaan')->first()['nilai'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="angka">4</td>
                    <td>Presentasi</td>
                    <td class="angka">-</td>
                    <td class="angka">{{ $rapor['rincian_dosen']->where('komponen', 'presentasi')->first()['nilai'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right; font-weight: bold; padding-right: 10px;">Nilai Agregat</td>
                    <td class="angka" style="font-weight: bold;">{{ $rapor['agregat_instansi'] ?? '-' }}</td>
                    <td class="angka" style="font-weight: bold;">{{ $rapor['agregat_dosen'] ?? '-' }}</td>
                </tr>
            </tbody>
        </table>

        <div style="margin-bottom: 20px;">
            <p><strong>NILAI UJIAN KERJA PRAKTIK (40%):</strong> {{ $rapor['agregat_ujian'] ?? '-' }}</p>
            <p><strong>TOTAL NILAI AKHIR:</strong> {{ $rapor['nilai_total'] ?? '-' }}</p>
            <p><strong>NILAI HURUF (GRADE):</strong> {{ $rapor['nilai_huruf'] ?? '-' }}</p>
            <p><strong>STATUS:</strong> LULUS / TIDAK LULUS * (Coret yang tidak perlu)</p>
        </div>

        <div class="tanda-tangan">
            <table>
                <tr>
                    <td></td>
                    <td>
                        Bangkalan, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}<br>
                        Dosen Pembimbing,
                        <br><br><br><br><br><br>
                        <span class="nama-ttd">{{ $rapor['dosen_pembimbing'] }}</span><br>
                        NIP. ........................................
                    </td>
                </tr>
            </table>
        </div>

    </div>
</body>
</html>
