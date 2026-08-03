<?php

namespace App\Http\Controllers\TU;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TUMahasiswaController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = User::where('role', 'mahasiswa')
            ->with(['programStudi', 'pendaftaransMahasiswa' => function ($q) {
                $q->latest();
            }]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%");
            });
        }

        $students = $query->orderBy('name')->get()->map(function ($student) {
            $latestPendaftaran = $student->pendaftaransMahasiswa->first();
            return [
                'id' => $student->id,
                'name' => $student->name,
                'nim' => $student->nim,
                'program_studi' => $student->programStudi?->nama ?? '-',
                'semester' => $student->semester ?? '-',
                'ipk' => $student->ipk ?? '-',
                'status_pendaftaran' => $latestPendaftaran?->status ?? 'Belum Mendaftar',
            ];
        });

        return Inertia::render('TU/DaftarMahasiswa', [
            'students' => $students,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
