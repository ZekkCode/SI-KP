<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Rekapitulasi Nilai KP - {{ $filters['semester'] !== 'all' ? 'Semester ' . $filters['semester'] : 'Semua Semester' }}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 1.5cm;
        }
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
            background-color: #fff;
            margin: 0;
            padding: 0;
        }
        .cetak-container {
            width: 100%;
            max-width: 27.7cm;
            margin: 0 auto;
            padding: 1cm 1.5cm;
            box-sizing: border-box;
        }
        .kop-surat {
            border-bottom: 3px double #000;
            margin-bottom: 16px;
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
            width: 75px;
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
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .kop-text h3 {
            margin: 2px 0;
            font-size: 13pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .kop-text p {
            margin: 0;
            font-size: 9pt;
            font-style: italic;
        }
        .judul-laporan {
            text-align: center;
            margin-top: 12px;
            margin-bottom: 16px;
        }
        .judul-laporan h4 {
            margin: 0;
            font-size: 13pt;
            font-weight: bold;
            text-decoration: underline;
            text-transform: uppercase;
        }
        .judul-laporan p {
            margin: 4px 0 0;
            font-size: 11pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .ringkasan-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
            font-size: 10pt;
        }
        .ringkasan-grid td, .ringkasan-grid th {
            border: 1px solid #000;
            padding: 6px 10px;
        }
        .ringkasan-grid th {
            background-color: #f1f5f9;
            text-align: left;
            font-weight: bold;
        }
        .tabel-rekap {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 10pt;
        }
        .tabel-rekap th, .tabel-rekap td {
            border: 1px solid #000;
            padding: 6px 8px;
            vertical-align: middle;
        }
        .tabel-rekap th {
            background-color: #e2e8f0;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            font-size: 9.5pt;
        }
        .text-center {
            text-align: center;
        }
        .font-bold {
            font-weight: bold;
        }
        .tabel-ttd {
            width: 100%;
            margin-top: 24px;
            border-collapse: collapse;
            page-break-inside: avoid;
        }
        .tabel-ttd td {
            vertical-align: top;
            font-size: 11pt;
        }
        @media print {
            .no-print {
                display: none !important;
            }
            .cetak-container {
                padding: 0;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="no-print" style="background: #f1f5f9; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #cbd5e1; font-family: Arial, sans-serif;">
        <div style="font-size: 13px; color: #334155;">
            <strong>Laporan Rekapitulasi KP per Semester</strong> — Periode: <strong>{{ $filters['semester'] !== 'all' ? 'Semester ' . $filters['semester'] : 'Semua Semester' }}</strong>
        </div>
        <div style="display: flex; gap: 10px;">
            <button onclick="window.print()" style="background: #00288e; color: white; padding: 8px 18px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px;">
                Cetak / Simpan PDF
            </button>
            <button onclick="window.close()" style="background: #e2e8f0; color: #1e293b; padding: 8px 14px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px;">
                Tutup
            </button>
        </div>
    </div>

    @php
        $sigService = app(\App\Services\DigitalSignatureService::class);
        $kaprodiSig = $sigService->getSignatureBlock('kaprodi');
        $dist = $stats['distribusi_huruf'] ?? [];
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
                <h3>FAKULTAS TEKNIK — PROGRAM STUDI TEKNIK INFORMATIKA</h3>
                <p>Jl. Raya Telang PO BOX 2 Kamal, Bangkalan - Madura | Telp: (031) 3011147 | Fax: (031) 3011506</p>
                <p>Laman: www.trunojoyo.ac.id | Surel: informatika@trunojoyo.ac.id</p>
            </div>
        </div>

        <div class="judul-laporan">
            <h4>LAPORAN REKAPITULASI NILAI AKHIR KERJA PRAKTIK (KP)</h4>
            <p>
                @if($filters['semester'] !== 'all')
                    SEMESTER {{ strtoupper($filters['semester']) }}
                @else
                    SELURUH PERIODE SEMESTER AKADEMIK
                @endif
            </p>
        </div>

        <!-- TABEL RINGKASAN STATISTIK -->
        <table class="ringkasan-grid">
            <tr>
                <th style="width: 18%;">Periode Akademik</th>
                <td style="width: 32%;"><strong>{{ $filters['semester'] !== 'all' ? 'Semester ' . $filters['semester'] : 'Semua Semester' }}</strong></td>
                <th style="width: 18%;">Rata-rata Nilai Akhir</th>
                <td style="width: 32%;"><strong>{{ $stats['rata_rata'] }}</strong></td>
            </tr>
            <tr>
                <th>Total Mahasiswa</th>
                <td><strong>{{ $stats['total'] }}</strong> Mahasiswa (Lulus: <strong>{{ $stats['lulus'] }}</strong> | Tidak Lulus: <strong>{{ $stats['tidak_lulus'] }}</strong> | Proses: <strong>{{ $stats['proses'] }}</strong>)</td>
                <th>Distribusi Huruf Mutu</th>
                <td>
                    A: <strong>{{ $dist['A'] ?? 0 }}</strong> |
                    B+: <strong>{{ $dist['B+'] ?? 0 }}</strong> |
                    B: <strong>{{ $dist['B'] ?? 0 }}</strong> |
                    C+: <strong>{{ $dist['C+'] ?? 0 }}</strong> |
                    C: <strong>{{ $dist['C'] ?? 0 }}</strong> |
                    D+: <strong>{{ $dist['D+'] ?? 0 }}</strong> |
                    D: <strong>{{ $dist['D'] ?? 0 }}</strong> |
                    E: <strong>{{ $dist['E'] ?? 0 }}</strong>
                </td>
            </tr>
        </table>

        <!-- TABEL DATA REKAPITULASI -->
        <table class="tabel-rekap">
            <thead>
                <tr>
                    <th style="width: 30px;">No</th>
                    <th style="width: 95px;">NIM</th>
                    <th>Nama Mahasiswa</th>
                    <th style="width: 110px;">Semester</th>
                    <th>Instansi / Mitra KP</th>
                    <th>Dosen Pembimbing</th>
                    <th style="width: 65px;">Dosbing (30%)</th>
                    <th style="width: 65px;">Industri (30%)</th>
                    <th style="width: 65px;">Ujian (40%)</th>
                    <th style="width: 65px;">Nilai Akhir</th>
                    <th style="width: 45px;">Huruf</th>
                    <th style="width: 85px;">Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse($arsip as $index => $item)
                    <tr>
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td class="text-center font-bold">{{ $item['mahasiswa']['nim'] }}</td>
                        <td>{{ $item['mahasiswa']['name'] }}</td>
                        <td class="text-center">{{ $item['semester'] }}</td>
                        <td>
                            {{ $item['instansi']['nama'] }}
                            @if(!empty($item['instansi']['kota']))
                                <br><small style="color: #475569;">({{ $item['instansi']['kota'] }})</small>
                            @endif
                        </td>
                        <td>{{ $item['dosen_pembimbing']['name'] }}</td>
                        <td class="text-center">{{ $item['nilai_pembimbing'] }}</td>
                        <td class="text-center">{{ $item['nilai_instansi'] }}</td>
                        <td class="text-center">{{ $item['nilai_ujian'] }}</td>
                        <td class="text-center font-bold">{{ $item['nilai_total'] }}</td>
                        <td class="text-center font-bold">{{ $item['nilai_huruf'] }}</td>
                        <td class="text-center">
                            @if($item['status'] === 'lulus')
                                LULUS
                            @elseif($item['status'] === 'tidak_lulus')
                                TIDAK LULUS
                            @else
                                PROSES
                            @endif
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="12" class="text-center" style="padding: 18px;">
                            Tidak terdapat data rekapitulasi nilai Kerja Praktik pada periode semester ini.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <!-- TANDA TANGAN KOORDINATOR PROGRAM STUDI -->
        <table class="tabel-ttd">
            <tr>
                <td style="width: 65%;"></td>
                <td style="width: 35%; text-align: left;">
                    Bangkalan, {{ $tanggal_cetak }}<br>
                    {{ $kaprodiSig['jabatan'] ?? 'Koordinator Program Studi Teknik Informatika' }},
                </td>
            </tr>
            <tr>
                <td></td>
                <td style="height: 68px; vertical-align: middle;">
                    @if(!empty($kaprodiSig['ttd_exists']))
                        <img src="{{ asset($kaprodiSig['ttd_path']) }}" alt="TTD Kaprodi" style="max-height: 62px;">
                    @else
                        <div style="font-family: Arial, sans-serif; font-size: 9px; color: #0f766e; border: 1px dashed #0d9488; padding: 5px 8px; border-radius: 4px; display: inline-block; background-color: #f0fdfa;">
                            <b>Ditandatangani secara Digital</b><br>
                            Koordinator Program Studi TI<br>
                            <span style="font-size: 8px;">Hash: {{ $kaprodiSig['security_hash'] ?? '-' }}</span>
                        </div>
                    @endif
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <strong>{{ $kaprodiSig['nama'] ?? '-' }}</strong><br>
                    NIP. {{ $kaprodiSig['nip'] ?? '-' }}
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
