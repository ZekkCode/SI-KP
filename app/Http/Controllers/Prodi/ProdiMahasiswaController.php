<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class ProdiMahasiswaController extends Controller
{
    public function index()
    {
        $students = User::where('role', 'mahasiswa')
            ->with(['pendaftaransMahasiswa' => function ($q) {
                $q->latest()->limit(1);
            }])
            ->get()
            ->map(function ($mahasiswa) {
                $latestPendaftaran = $mahasiswa->pendaftaransMahasiswa->first();
                $statusTampil = 'Tidak KP / Belum KP';
                $statusAsli = 'belum_kp';
                
                if ($latestPendaftaran) {
                    if ($latestPendaftaran->status === 'selesai') {
                        $statusTampil = 'Selesai KP';
                        $statusAsli = 'selesai';
                    } elseif (in_array($latestPendaftaran->status, ['aktif', 'diterima_instansi', 'surat_terbit', 'diterima_prodi', 'diverifikasi', 'menunggu_verifikasi_prodi', 'plotting_dosen'])) {
                        $statusTampil = 'Sedang KP';
                        $statusAsli = 'sedang_kp';
                    }
                }
                
                return [
                    'nim' => $mahasiswa->nim ?? '-',
                    'mahasiswa' => [
                        'name' => $mahasiswa->name ?? 'Data Tidak Ditemukan'
                    ],
                    'semester' => $mahasiswa->semester ?? 'Ganjil/Genap',
                    'status' => $statusTampil,
                    'status_asli' => $statusAsli,
                ];
            });

        return Inertia::render('Prodi/Students', [
            'initialStudents' => $students
        ]);
    }
}
