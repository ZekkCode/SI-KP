<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Berkas KP-6b - Penilaian Kerja Praktik</title>
    <style>
        body { 
            font-family: 'Times New Roman', Times, serif; 
            font-size: 10.5pt;
            line-height: 1.35; 
            color: black; 
            background-color: white;
            margin: 0;
            padding: 0;
        }
        .cetak-container { 
            width: 100%; 
            max-width: 21cm;
            margin: 0 auto; 
            padding: 1.2cm 1.8cm; 
            box-sizing: border-box;
        }

        /* Header Form KP-6b */
        .kop-header-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid black;
            margin-bottom: 16px;
        }
        .kop-header-table td {
            border: 1px solid black;
            padding: 6px 10px;
            vertical-align: middle;
        }
        .kop-logo {
            width: 85px;
            text-align: center;
        }
        .kop-logo img {
            width: 70px;
            height: auto;
        }
        .kop-title {
            text-align: center;
        }
        .kop-title h1 {
            margin: 0;
            font-size: 15pt;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .kop-title h2 {
            margin: 3px 0 0 0;
            font-size: 16pt;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .kop-berkas {
            width: 110px;
            text-align: center;
        }
        .kop-berkas .label {
            font-size: 10pt;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .kop-berkas .kode {
            font-size: 19pt;
            font-weight: bold;
            line-height: 1.1;
        }

        /* Info Mahasiswa */
        .info-mahasiswa {
            margin-bottom: 12px;
        }
        .info-mahasiswa table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-mahasiswa td {
            padding: 2px 0;
            vertical-align: top;
        }
        .info-mahasiswa td:first-child {
            width: 140px;
        }
        .info-mahasiswa td:nth-child(2) {
            width: 15px;
            text-align: center;
        }

        .section-label {
            margin: 10px 0 6px 0;
            font-weight: normal;
            font-size: 10.5pt;
        }

        /* Tabel Penilaian KP-6b */
        .tabel-kp6b {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
        }
        .tabel-kp6b th, .tabel-kp6b td {
            border: 1px solid black;
            padding: 5px 8px;
        }
        .tabel-kp6b th {
            text-align: center;
            font-weight: bold;
            background-color: #f2f2f2;
        }
        .tabel-kp6b .section-title {
            font-weight: bold;
            background-color: #fafafa;
        }
        .tabel-kp6b td.center {
            text-align: center;
        }
        .tabel-kp6b td.bold {
            font-weight: bold;
        }

        /* Tabel Tanda Tangan */
        .tabel-ttd-container {
            width: 100%;
            margin-top: 12px;
            margin-bottom: 12px;
            page-break-inside: avoid;
        }
        .tabel-ttd {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid black;
        }
        .tabel-ttd th, .tabel-ttd td {
            border: 1px solid black;
            padding: 5px 8px;
            vertical-align: middle;
        }
        .tabel-ttd th {
            background-color: #d9d9d9;
            text-align: center;
            font-weight: bold;
        }
        .tabel-ttd td.label-col {
            width: 28%;
            font-weight: normal;
        }
        .tabel-ttd td.ttd-space {
            height: 55px;
            vertical-align: bottom;
            text-align: center;
        }

        /* Footnotes */
        .footnotes {
            margin-top: 10px;
            font-size: 9pt;
            line-height: 1.35;
            page-break-inside: avoid;
        }
        .footnotes p {
            margin: 2px 0;
        }
        .footnotes .scale-table {
            width: 100%;
            margin-top: 3px;
            border-collapse: collapse;
        }
        .footnotes .scale-table td {
            padding: 1px 0;
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
                margin: 1.2cm 1.6cm;
            }
            .tabel-kp6b th, .tabel-ttd th {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body onload="window.print()">
    @php
        $rUjian = collect($rapor['rincian_ujian'])->keyBy('komponen');
        $rBimb = collect($rapor['rincian_bimbingan'])->keyBy('komponen');

        $valPerumusan = $rUjian->get('perumusan_masalah');
        $valManfaat = $rUjian->get('manfaat');
        $valTinjauan = $rUjian->get('tinjauan_pustaka');
        $valMetode = $rUjian->get('metode');
        $valPresentasi = $rUjian->get('presentasi');

        $valPermasalahan = $rBimb->get('permasalahan');
        $valLaporan = $rBimb->get('laporan');
        $valUjianKp = $rBimb->get('ujian_kp');
    @endphp

    <div class="cetak-container">
        
        <!-- Header Tabel Form KP-6b -->
        <table class="kop-header-table">
            <tr>
                <td class="kop-logo">
                    <img src="{{ asset('assets/img/utm.png') }}" alt="Logo UTM">
                </td>
                <td class="kop-title">
                    <h1>PENILAIAN</h1>
                    <h2>KERJA PRAKTIK (KP)</h2>
                </td>
                <td class="kop-berkas">
                    <div class="label">BERKAS</div>
                    <div class="kode">KP-6b</div>
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
            </table>
        </div>

        <!-- Tabel 1: Komponen Penilaian Ujian KP (Penguji) -->
        <div class="section-label">
            Komponen Penilaian Ujian KP : (Diisi oleh Dosen Penguji KP)
        </div>
        <table class="tabel-kp6b">
            <thead>
                <tr>
                    <th style="width: 5%;">No</th>
                    <th style="width: 25%;">Kriteria</th>
                    <th style="width: 40%;">Indikator Penilaian</th>
                    <th style="width: 10%;">Bobot<br>(%)</th>
                    <th style="width: 10%;">Nilai<br>(0 – 100)</th>
                    <th style="width: 10%;">Nilai Huruf<br>*)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="center">1</td>
                    <td class="bold">Perumusan Masalah</td>
                    <td>Ketajaman Perumusan Masalah, Tujuan Penelitian / KP, Kebaharuan dan Originalitas, Kesesuaian Judul dengan Isi</td>
                    <td class="center bold">15</td>
                    <td class="center">{{ $valPerumusan['nilai'] ?? '-' }}</td>
                    <td class="center bold">{{ $valPerumusan['huruf'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="center">2</td>
                    <td class="bold">Manfaat Hasil KP</td>
                    <td>Pengembangan Ipteks, Pembangunan dan atau Pengembangan Kelembagaan</td>
                    <td class="center bold">20</td>
                    <td class="center">{{ $valManfaat['nilai'] ?? '-' }}</td>
                    <td class="center bold">{{ $valManfaat['huruf'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="center">3</td>
                    <td class="bold">Tinjauan Pustaka</td>
                    <td>Relevansi dan Kemutakhiran, Kedalaman Tinjauan Pustaka</td>
                    <td class="center bold">15</td>
                    <td class="center">{{ $valTinjauan['nilai'] ?? '-' }}</td>
                    <td class="center bold">{{ $valTinjauan['huruf'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="center">4</td>
                    <td class="bold">Metode Penelitian</td>
                    <td>Ketepatan Desain, Ketepatan Instrumen, Ketepatan Analisis</td>
                    <td class="center bold">20</td>
                    <td class="center">{{ $valMetode['nilai'] ?? '-' }}</td>
                    <td class="center bold">{{ $valMetode['huruf'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="center">5</td>
                    <td class="bold">Presentasi &amp; Tanya Jawab</td>
                    <td>Presentasi / Argumentasi</td>
                    <td class="center bold">30</td>
                    <td class="center">{{ $valPresentasi['nilai'] ?? '-' }}</td>
                    <td class="center bold">{{ $valPresentasi['huruf'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td colspan="3" class="bold" style="text-align: right; padding-right: 15px;">Jumlah</td>
                    <td class="center bold">100</td>
                    <td class="center bold">{{ $rapor['nilai_ujian'] !== null ? number_format($rapor['nilai_ujian'], 2) : '-' }}</td>
                    <td class="center bold">{{ $rapor['nilai_huruf_ujian'] ?? '-' }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Tabel 2: Penilaian Lapangan & Bimbingan (Dosen Pembimbing) -->
        <div class="section-label">
            Penilaian Lapangan &amp; Bimbingan : (Dosen Pembimbing)
        </div>
        <table class="tabel-kp6b">
            <thead>
                <tr>
                    <th style="width: 50%;">Kriteria Penilaian</th>
                    <th style="width: 18%;">Bobot</th>
                    <th style="width: 16%;">Nilai<br>(0 – 100)</th>
                    <th style="width: 16%;">Nilai Huruf<br>**)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="4" class="section-title">Dari Dosen Pembimbing:</td>
                </tr>
                <tr>
                    <td>Permasalahan Masalah dan Solusi</td>
                    <td class="center bold">30%</td>
                    <td class="center">{{ $valPermasalahan['nilai'] ?? '-' }}</td>
                    <td class="center bold">{{ $valPermasalahan['huruf'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td>Laporan</td>
                    <td class="center bold">30%</td>
                    <td class="center">{{ $valLaporan['nilai'] ?? '-' }}</td>
                    <td class="center bold">{{ $valLaporan['huruf'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td>Ujian KP (Dari hasil ujian KP)</td>
                    <td class="center bold">40%</td>
                    <td class="center">{{ $valUjianKp['nilai'] ?? ($rapor['nilai_ujian'] !== null ? number_format($rapor['nilai_ujian'], 2) : '-') }}</td>
                    <td class="center bold">{{ $valUjianKp['huruf'] ?? ($rapor['nilai_huruf_ujian'] ?? '-') }}</td>
                </tr>
                <tr>
                    <td colspan="2" class="bold" style="text-align: right; padding-right: 15px;">TOTAL</td>
                    <td class="center bold">{{ $rapor['nilai_pembimbing'] !== null ? number_format($rapor['nilai_pembimbing'], 2) : '-' }}</td>
                    <td class="center bold">{{ $rapor['nilai_huruf_bimbingan'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td colspan="2" class="bold" style="text-align: right; padding-right: 15px;">NILAI HURUF ***)</td>
                    <td colspan="2" class="center bold" style="font-size: 13pt;">{{ $rapor['nilai_huruf_total'] ?? ($rapor['nilai_huruf_bimbingan'] ?? '-') }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Tabel Tanda Tangan Sesuai Form KP-6b -->
        <div class="tabel-ttd-container">
            <table class="tabel-ttd">
                <thead>
                    <tr>
                        <th style="width: 28%;"></th>
                        <th style="width: 36%;">Pembimbing</th>
                        <th style="width: 36%;">Penguji</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="label-col">Tanda Tangan/ Stempel</td>
                        <td class="ttd-space">
                            <br><br><br>
                        </td>
                        <td class="ttd-space">
                            <br><br><br>
                        </td>
                    </tr>
                    <tr>
                        <td class="label-col">Nama</td>
                        <td class="bold">{{ $rapor['dosen_pembimbing'] }}</td>
                        <td class="bold">................................................</td>
                    </tr>
                    <tr>
                        <td class="label-col">Jabatan /NIP</td>
                        <td>{{ $rapor['dosen_nip'] ?? '-' }}</td>
                        <td>NIP. ........................................</td>
                    </tr>
                    <tr>
                        <td class="label-col">Tanggal</td>
                        <td>{{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</td>
                        <td>{{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Footnotes Resmi Form KP-6b -->
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
