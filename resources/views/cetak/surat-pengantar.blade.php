<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="{{ asset('assets/img/utm.png') }}">
    <title>Cetak Surat Pengantar</title>
    <style>
        @media print {
            @page { margin: 0; }
            body { margin: 1.5cm; -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body onload="window.print()">
    <div>
        <table align="center" style="padding-left: 0%;padding-right: 0%;max-width:max-content;">
            <tr>
                <!-- Ganti asset path jika perlu, sesuaikan letak utm.png -->
                <td><img src="{{ asset('assets/img/utm.png') }}" style="width: 100%; max-width: 130px; height: auto;"></td>
                <td style="width: 25px;"></td>
                <td style="text-align: center;">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, <br> DAN TEKNOLOGI <br> UNIVERSITAS TRUNOJOYO MADURA <br> <b>FAKULTAS TEKNIK</b> <br> Jl. Raya Telang, PO.Box. 2 Kamal, Bangkalan - Madura <br> Telp : (031) 3011146, Fax. (031) 3011506 <br> Laman : www.trunojoyo.ac.id </td>
                <td style="width: 25px;"></td>
            </tr>
            <tr>
                <td colspan="4"><hr size="3px" color="black"></td>
            </tr>
        </table>
        <table align="center" style="padding-left: 0%;padding-right: 0%;max-width:max-content;">
            <tr>
                <td>Nomor</td>
                <td>:</td>
                <td>B/3284/UN46.3.4/KP.01.06/{{ date('Y') }}</td>
                <td style="width: 150px;"></td>
                <td style="width: 130px; text-align: center;">{{ \Carbon\Carbon::parse($data->created_at ?? now())->translatedFormat('d F Y') }}</td>
                <td style="width: 15px;"></td>
            </tr>
            <tr>
                <td>Perihal</td>
                <td>:</td>
                <td>Permohonan Izin Kerja Praktek</td>
                <td style="width: 150px;"></td>
            </tr>
            <tr style="height: 40px;">
                <td><p></p></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td colspan="6">Yth. Kepala {{ $nama_instansi }}</td>
            </tr>
            <tr>
                <td style="width: 100px;" colspan="4">{{ $alamat_instansi }}</td>
            </tr>
            <tr style="height: 60px;">
                <td><p></p></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td colspan="6" style="width: 160px; text-align: justify;">Dalam rangka memperkenalkan mahasiswa pada dunia kerja sesuai bidang masing-masing  dan untuk memenuhi syarat sebelum mahasiswa mengerjakan Tugas Akhir/Skripsi, maka sesuai ketentuan kurikulum mahasiswa diwajibkan melaksanakan kerja Praktek.</td>
            </tr>
            <tr>
                <td><p></p></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td colspan="6" style="width: 160px;  text-align: justify;">Guna memperlancar kegiatan Kerja Praktek tersebut, kami mohon perkenan Bapak/Ibu untuk memberikan izin kepada mahasiswa kami untuk dapat melaksanakan kegiatan Kerja Praktek pada {{ $nama_instansi }} tersebut sejak tanggal {{ \Carbon\Carbon::parse($tanggal_mulai)->translatedFormat('d F Y') }} s.d. {{ \Carbon\Carbon::parse($tanggal_selesai)->translatedFormat('d F Y') }}.</td>
            </tr>
            <tr>
                <td><p></p></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td colspan="6">Adapun mahasiswa tersebut adalah :</td>
            </tr>
            <tr style="height: 15px;">
                <td></td>
            </tr>
        </table>
        <table border="1" align="center" style="border-collapse: collapse;">
            <tr>
                <th>No.</th>
                <th style="width: 170px;">Nama</th>
                <th style="width: 170px;">NPM</th>
                <th style="width: 170px;">Program Studi</th>
            </tr>
            <tr>
                <td align="center">1.</td>
                <td>{{ $data->mahasiswa->name ?? 'Nama Mahasiswa' }}</td>
                <td align="center">{{ $data->mahasiswa->nim ?? 'NIM' }}</td>
                <td align="center">Teknik Informatika</td>
            </tr>
        </table>
        <table align="center">
            <tr>
                <td><p></p></td>
            </tr>
            <tr>
                <td style="width: 590px;">Demikian, atas perhatian dan bantuannya kami ucapkan terima kasih.</td>
            </tr>
            <tr style="height: 60px;">
                <td></td>
            </tr>
        </table>
        <table align="center">
            <tr>
                <td style="width: 370px;"></td>
                <td>Dekan</td>
                <td style="width: 32px;"></td>
            </tr>
            <tr style="height: 100px;">
            </tr>
            <tr>
                <td></td>
                <td>Ari Basuki</td>
            </tr>
            <tr>
                <td></td>
                <td>NIP. 197801202003121002</td>
            </tr>
        </table>
    </div>
</body>
</html>
