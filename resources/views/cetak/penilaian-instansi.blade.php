<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Berkas KP-6a - Penilaian Kerja Praktik</title>
    <style>
        body { 
            font-family: 'Times New Roman', Times, serif; 
            font-size: 11pt;
            line-height: 1.4; 
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

        /* Header Form KP-6a */
        .kop-header-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid black;
            margin-bottom: 20px;
        }
        .kop-header-table td {
            border: 1px solid black;
            padding: 8px 12px;
            vertical-align: middle;
        }
        .kop-logo {
            width: 90px;
            text-align: center;
        }
        .kop-logo img {
            width: 75px;
            height: auto;
        }
        .kop-title {
            text-align: center;
        }
        .kop-title h2 {
            margin: 0;
            font-size: 13pt;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .kop-title h1 {
            margin: 4px 0 0 0;
            font-size: 15pt;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .kop-title p {
            margin: 2px 0 0 0;
            font-size: 11pt;
        }
        .kop-berkas {
            width: 120px;
            text-align: center;
        }
        .kop-berkas .label {
            font-size: 11pt;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .kop-berkas .kode {
            font-size: 20pt;
            font-weight: bold;
            line-height: 1.1;
        }

        /* Info Mahasiswa */
        .info-mahasiswa {
            margin-bottom: 16px;
        }
        .info-mahasiswa table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-mahasiswa td {
            padding: 3px 0;
            vertical-align: top;
        }
        .info-mahasiswa td:first-child {
            width: 170px;
        }
        .info-mahasiswa td:nth-child(2) {
            width: 15px;
            text-align: center;
        }

        .keterangan-pengisi {
            margin: 14px 0 10px 0;
            font-weight: normal;
        }

        /* Tabel Penilaian KP-6a */
        .tabel-kp6a {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .tabel-kp6a th, .tabel-kp6a td {
            border: 1px solid black;
            padding: 6px 10px;
        }
        .tabel-kp6a th {
            text-align: center;
            font-weight: bold;
            background-color: #f2f2f2;
        }
        .tabel-kp6a .section-title {
            font-weight: bold;
            background-color: #fafafa;
        }
        .tabel-kp6a td.center {
            text-align: center;
        }
        .tabel-kp6a td.bold {
            font-weight: bold;
        }

        /* Tabel Tanda Tangan */
        .tabel-ttd-container {
            width: 100%;
            margin-top: 15px;
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        .tabel-ttd {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid black;
        }
        .tabel-ttd th, .tabel-ttd td {
            border: 1px solid black;
            padding: 6px 10px;
            vertical-align: middle;
        }
        .tabel-ttd th {
            background-color: #d9d9d9;
            text-align: center;
            font-weight: bold;
        }
        .tabel-ttd td.label-col {
            width: 200px;
            font-weight: normal;
        }
        .tabel-ttd td.ttd-space {
            height: 70px;
            vertical-align: middle;
            text-align: center;
        }

        /* Footnotes */
        .footnotes {
            margin-top: 15px;
            font-size: 9.5pt;
            line-height: 1.45;
            page-break-inside: avoid;
        }
        .footnotes p {
            margin: 2px 0;
        }
        .footnotes .scale-table {
            width: 100%;
            margin-top: 4px;
            border-collapse: collapse;
        }
        .footnotes .scale-table td {
            padding: 2px 0;
            width: 33.33%;
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
                margin: 1.5cm 2cm;
            }
            .tabel-kp6a th, .tabel-ttd th {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body onload="window.print()">
    @php
        $rincianMap = collect($rapor['rincian_instansi'])->keyBy('komponen');
        $valTugas = $rincianMap->get('tugas') ?? $rincianMap->get('kinerja');
        $valSikap = $rincianMap->get('sikap') ?? $rincianMap->get('kerjasama');
        $valDisiplin = $rincianMap->get('kedisiplinan');
        $valLaporan = $rincianMap->get('laporan') ?? $rincianMap->get('kinerja');
    @endphp

    <div class="cetak-container">
        
        <!-- Header Tabel Form KP-6a -->
        <table class="kop-header-table">
            <tr>
                <td class="kop-logo">
                    <img src="{{ asset('assets/img/utm.png') }}" alt="Logo UTM">
                </td>
                <td class="kop-title">
                    <p style="margin: 0; font-size: 11pt; font-weight: bold;">PRODI TEKNIK INFORMATIKA</p>
                    <h1>PENILAIAN</h1>
                    <h2>KERJA PRAKTIK (KP)</h2>
                </td>
                <td class="kop-berkas">
                    <div class="label">BERKAS</div>
                    <div class="kode">KP-6a</div>
                </td>
            </tr>
        </table>

        <!-- Identitas Mahasiswa -->
        <div class="info-mahasiswa">
            <table>
                <tr>
                    <td>Nama Mahasiswa</td>
                    <td>:</td>
                    <td><strong>{{ $rapor['mahasiswa']->name }}</strong></td>
                </tr>
                <tr>
                    <td>NIM</td>
                    <td>:</td>
                    <td><strong>{{ $rapor['mahasiswa']->nim }}</strong></td>
                </tr>
                <tr>
                    <td>Instansi / Perusahaan</td>
                    <td>:</td>
                    <td>{{ $rapor['instansi'] }}</td>
                </tr>
            </table>

            <div class="keterangan-pengisi">
                Penilaian Lapangan &amp; Bimbingan : (Diisi oleh Pembimbing Lapangan)
            </div>
        </div>

        <!-- Tabel Penilaian KP-6a Resmi UTM -->
        <table class="tabel-kp6a">
            <thead>
                <tr>
                    <th style="width: 48%;">Kriteria Penilaian</th>
                    <th style="width: 16%;">Bobot</th>
                    <th style="width: 18%;">Nilai<br>(0 – 100)</th>
                    <th style="width: 18%;">Nilai Huruf **)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="4" class="section-title">Dari Perusahaan:</td>
                </tr>
                <tr>
                    <td>Kemampuan menyelesaikan tugas</td>
                    <td class="center bold">35%</td>
                    <td class="center">{{ $valTugas['nilai'] ?? '-' }}</td>
                    <td class="center bold">{{ $valTugas['huruf'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td>Tingkah laku/ sikap</td>
                    <td class="center bold">25%</td>
                    <td class="center">{{ $valSikap['nilai'] ?? '-' }}</td>
                    <td class="center bold">{{ $valSikap['huruf'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td>Kedisiplinan</td>
                    <td class="center bold">20%</td>
                    <td class="center">{{ $valDisiplin['nilai'] ?? '-' }}</td>
                    <td class="center bold">{{ $valDisiplin['huruf'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td>Laporan</td>
                    <td class="center bold">20%</td>
                    <td class="center">{{ $valLaporan['nilai'] ?? '-' }}</td>
                    <td class="center bold">{{ $valLaporan['huruf'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td colspan="2" class="bold" style="text-align: right; padding-right: 15px;">TOTAL</td>
                    <td class="center bold">{{ $rapor['agregat_instansi'] !== null ? number_format($rapor['agregat_instansi'], 2) : '-' }}</td>
                    <td class="center bold">{{ $rapor['nilai_huruf_instansi'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td colspan="2" class="bold" style="text-align: right; padding-right: 15px;">NILAI HURUF ***)</td>
                    <td colspan="2" class="center bold" style="font-size: 13pt;">{{ $rapor['nilai_huruf_instansi'] ?? '-' }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Tabel Tanda Tangan Pembimbing Lapangan Sesuai Form KP-6a -->
        <div class="tabel-ttd-container">
            <table class="tabel-ttd">
                <thead>
                    <tr>
                        <th style="width: 35%;"></th>
                        <th style="width: 65%;">Pembimbing Lapangan</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="label-col">Tanda Tangan / Stempel</td>
                        <td class="ttd-space">
                            <br><br><br>
                        </td>
                    </tr>
                    <tr>
                        <td class="label-col">Nama</td>
                        <td class="bold">{{ $rapor['pembimbing_lapangan'] }}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Jabatan / NIP</td>
                        <td>{{ $rapor['jabatan_pl'] ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Tanggal</td>
                        <td>{{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Footnotes Resmi Form KP-6a -->
        <div class="footnotes">
            <p><strong>*)</strong> Diisi oleh Dosen Penguji</p>
            <p><strong>**)</strong> Diisi oleh Pembimbing Lapangan &amp; Dosen Pembimbing</p>
            <p><strong>***)</strong></p>
            <table class="scale-table">
                <tr>
                    <td>A &nbsp;: ( 80 &lt; Nilai &le; 100 )</td>
                    <td>C+ : ( 60 &le; Nilai &lt; 70 )</td>
                    <td>D &nbsp;: ( 45 &le; Nilai &lt; 50 )</td>
                </tr>
                <tr>
                    <td>B+ : ( 75 &le; Nilai &lt; 80 )</td>
                    <td>C &nbsp;: ( 55 &le; Nilai &lt; 60 )</td>
                    <td>E &nbsp;: ( 0 &le; Nilai &lt; 45 )</td>
                </tr>
                <tr>
                    <td>B &nbsp;: ( 70 &le; Nilai &lt; 75 )</td>
                    <td>D+ : ( 50 &le; Nilai &lt; 55 )</td>
                    <td></td>
                </tr>
            </table>
        </div>

    </div>
</body>
</html>
