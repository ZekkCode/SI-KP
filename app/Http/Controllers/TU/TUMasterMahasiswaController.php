<?php

namespace App\Http\Controllers\TU;

use App\Http\Controllers\Controller;
use App\Models\MasterMahasiswa;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Reader\XLSX\Reader as XLSXReader;
use OpenSpout\Writer\XLSX\Writer as XLSXWriter;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class TUMasterMahasiswaController extends Controller
{
    /**
     * Display a listing of master student records.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search', '');
        $angkatanFilter = $request->query('angkatan', 'all');

        $query = MasterMahasiswa::with('dosenWali:id,name,nip');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nim', 'like', "%{$search}%")
                  ->orWhere('nama', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($angkatanFilter && $angkatanFilter !== 'all') {
            $query->where('angkatan', $angkatanFilter);
        }

        $masterMahasiswas = $query->orderBy('angkatan', 'desc')->orderBy('nim', 'asc')->paginate(15)->withQueryString();

        // Get registered NIMs to highlight students who already have an account
        $registeredNims = User::whereNotNull('nim')->pluck('nim')->toArray();

        $angkatanList = MasterMahasiswa::select('angkatan')
            ->distinct()
            ->orderBy('angkatan', 'desc')
            ->pluck('angkatan')
            ->toArray();

        $stats = [
            'total' => MasterMahasiswa::count(),
            'registered' => MasterMahasiswa::whereIn('nim', $registeredNims)->count(),
            'angkatan_count' => count($angkatanList),
        ];

        return Inertia::render('TU/MasterMahasiswa/Index', [
            'masterMahasiswas' => $masterMahasiswas,
            'registeredNims' => $registeredNims,
            'angkatanList' => $angkatanList,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'angkatan' => $angkatanFilter,
            ],
        ]);
    }

    /**
     * Import master student data from an Excel (.xlsx / .xls) or CSV file.
     */
    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv,txt'],
        ], [
            'file.required' => 'File Excel (.xlsx) wajib diunggah.',
            'file.mimes' => 'Format file harus berupa file Excel (.xlsx / .xls) atau CSV.',
        ]);

        $file = $request->file('file');
        $extension = strtolower($file->getClientOriginalExtension());
        $path = $file->getRealPath();

        $imported = 0;
        $updated = 0;
        $skipped = 0;

        DB::beginTransaction();

        try {
            if (in_array($extension, ['xlsx', 'xls'])) {
                // Gunakan OpenSpout XLSX Reader
                $reader = new XLSXReader();
                $reader->open($path);

                $rowNum = 0;
                $colMap = [
                    'nim' => 0,
                    'nama' => 1,
                    'email' => 2,
                    'prodi' => 3,
                    'angkatan' => 4,
                ];

                foreach ($reader->getSheetIterator() as $sheet) {
                    foreach ($sheet->getRowIterator() as $row) {
                        $rowNum++;
                        $rawValues = $row->toArray();
                        $rowValues = array_map(function ($val) {
                            if ($val instanceof \DateTimeInterface) {
                                return $val->format('Y-m-d');
                            }
                            return trim((string) $val);
                        }, $rawValues);

                        // Skip baris kosong
                        if (empty(array_filter($rowValues))) {
                            continue;
                        }

                        // Deteksi kolom dinamis dari baris pertama (header)
                        if ($rowNum === 1) {
                            $isHeader = false;
                            foreach ($rowValues as $idx => $headerText) {
                                $clean = strtolower(trim((string) $headerText));
                                if ($clean === 'nim') {
                                    $colMap['nim'] = $idx;
                                    $isHeader = true;
                                } elseif (str_contains($clean, 'nama') || $clean === 'name') {
                                    $colMap['nama'] = $idx;
                                    $isHeader = true;
                                } elseif (str_contains($clean, 'email') || $clean === 'surel') {
                                    $colMap['email'] = $idx;
                                    $isHeader = true;
                                } elseif (str_contains($clean, 'prodi') || str_contains($clean, 'program_studi') || str_contains($clean, 'jurusan')) {
                                    $colMap['prodi'] = $idx;
                                    $isHeader = true;
                                } elseif (str_contains($clean, 'angkatan') || str_contains($clean, 'tahun')) {
                                    $colMap['angkatan'] = $idx;
                                    $isHeader = true;
                                } elseif (str_contains($clean, 'wali') || str_contains($clean, 'dosen')) {
                                    $colMap['nip_dosen_wali'] = $idx;
                                    $isHeader = true;
                                }
                            }
                            if ($isHeader) {
                                continue;
                            }
                        }

                        $nim = $rowValues[$colMap['nim']] ?? '';
                        $nama = $rowValues[$colMap['nama']] ?? '';
                        $email = $rowValues[$colMap['email']] ?? '';
                        $prodi = ! empty($rowValues[$colMap['prodi']] ?? '') ? $rowValues[$colMap['prodi']] : 'Teknik Informatika';
                        $angkatan = $rowValues[$colMap['angkatan']] ?? '';
                        $nipDosenWali = isset($colMap['nip_dosen_wali']) ? ($rowValues[$colMap['nip_dosen_wali']] ?? null) : null;
                        $cleanNipWali = ! empty($nipDosenWali) ? trim((string) $nipDosenWali) : null;

                        // Lewati jika masih baris teks header yang lolos
                        if (strtolower($nim) === 'nim' || strtolower($nim) === 'id') {
                            continue;
                        }

                        // Koreksi otomatis jika kolom pertama adalah nomor urut (1, 2, 3...)
                        if (is_numeric($nim) && strlen($nim) <= 4 && isset($rowValues[1]) && strlen($rowValues[1]) >= 8) {
                            $nim = $rowValues[1] ?? '';
                            $nama = $rowValues[2] ?? '';
                            $email = $rowValues[3] ?? '';
                            $prodi = ! empty($rowValues[4] ?? '') ? $rowValues[4] : 'Teknik Informatika';
                            $angkatan = $rowValues[5] ?? '';
                            $cleanNipWali = ! empty($rowValues[6] ?? '') ? trim((string) $rowValues[6]) : $cleanNipWali;
                        }

                        // Validasi minimal: NIM dan Nama harus ada
                        if (empty($nim) || empty($nama)) {
                            $skipped++;
                            continue;
                        }

                        if (empty($angkatan)) {
                            if (strlen($nim) >= 2 && is_numeric(substr($nim, 0, 2))) {
                                $angkatan = '20' . substr($nim, 0, 2);
                            } else {
                                $angkatan = date('Y');
                            }
                        }

                        if (empty($email)) {
                            $email = $nim . '@student.trunodjoyo.ac.id';
                        }

                        $existing = MasterMahasiswa::where('nim', $nim)->first();

                        if ($existing) {
                            $existing->update([
                                'nama' => $nama,
                                'email' => $email,
                                'program_studi' => $prodi,
                                'angkatan' => $angkatan,
                                'nip_dosen_wali' => $cleanNipWali,
                            ]);
                            $updated++;
                        } else {
                            MasterMahasiswa::create([
                                'nim' => $nim,
                                'nama' => $nama,
                                'email' => $email,
                                'program_studi' => $prodi,
                                'angkatan' => $angkatan,
                                'nip_dosen_wali' => $cleanNipWali,
                            ]);
                            $imported++;
                        }

                        // Hubungkan otomatis ke akun User jika user sudah terdaftar di sistem
                        if ($cleanNipWali) {
                            $dosenUser = User::where('nip', $cleanNipWali)->where('role', 'dosen')->first();
                            if ($dosenUser) {
                                User::where('nim', $nim)->update(['dosen_wali_id' => $dosenUser->id]);
                            }
                        }
                    }
                    // Hanya baca sheet pertama
                    break;
                }
                $reader->close();

            } else {
                // Fallback jika file CSV
                $handle = fopen($path, 'r');
                $firstLine = fgets($handle);
                rewind($handle);
                $delimiter = str_contains($firstLine, ';') ? ';' : ',';

                $rowNum = 0;
                $colMap = [
                    'nim' => 0,
                    'nama' => 1,
                    'email' => 2,
                    'prodi' => 3,
                    'angkatan' => 4,
                ];

                while (($row = fgetcsv($handle, 1000, $delimiter)) !== false) {
                    $rowNum++;
                    if (empty(array_filter($row))) {
                        continue;
                    }

                    if ($rowNum === 1) {
                        $isHeader = false;
                        foreach ($row as $idx => $headerText) {
                            $clean = strtolower(trim((string) $headerText));
                            if ($clean === 'nim') {
                                $colMap['nim'] = $idx;
                                $isHeader = true;
                            } elseif (str_contains($clean, 'nama') || $clean === 'name') {
                                $colMap['nama'] = $idx;
                                $isHeader = true;
                            } elseif (str_contains($clean, 'email') || $clean === 'surel') {
                                $colMap['email'] = $idx;
                                $isHeader = true;
                            } elseif (str_contains($clean, 'prodi') || str_contains($clean, 'program_studi') || str_contains($clean, 'jurusan')) {
                                $colMap['prodi'] = $idx;
                                $isHeader = true;
                            } elseif (str_contains($clean, 'angkatan') || str_contains($clean, 'tahun')) {
                                $colMap['angkatan'] = $idx;
                                $isHeader = true;
                            } elseif (str_contains($clean, 'wali') || str_contains($clean, 'dosen')) {
                                $colMap['nip_dosen_wali'] = $idx;
                                $isHeader = true;
                            }
                        }
                        if ($isHeader) {
                            continue;
                        }
                    }

                    $nim = isset($row[$colMap['nim']]) ? trim($row[$colMap['nim']]) : '';
                    $nama = isset($row[$colMap['nama']]) ? trim($row[$colMap['nama']]) : '';
                    $email = isset($row[$colMap['email']]) ? trim($row[$colMap['email']]) : '';
                    $prodi = isset($row[$colMap['prodi']]) && ! empty(trim($row[$colMap['prodi']])) ? trim($row[$colMap['prodi']]) : 'Teknik Informatika';
                    $angkatan = isset($row[$colMap['angkatan']]) ? trim($row[$colMap['angkatan']]) : '';
                    $nipDosenWali = isset($colMap['nip_dosen_wali']) ? trim($row[$colMap['nip_dosen_wali']] ?? '') : null;
                    $cleanNipWali = ! empty($nipDosenWali) ? $nipDosenWali : null;

                    if (strtolower($nim) === 'nim' || strtolower($nim) === 'id') {
                        continue;
                    }

                    if (is_numeric($nim) && strlen($nim) <= 4 && isset($row[1]) && strlen($row[1]) >= 8) {
                        $nim = trim($row[1] ?? '');
                        $nama = trim($row[2] ?? '');
                        $email = trim($row[3] ?? '');
                        $prodi = ! empty(trim($row[4] ?? '')) ? trim($row[4]) : 'Teknik Informatika';
                        $angkatan = trim($row[5] ?? '');
                        $cleanNipWali = ! empty(trim($row[6] ?? '')) ? trim($row[6]) : $cleanNipWali;
                    }

                    if (empty($nim) || empty($nama)) {
                        $skipped++;
                        continue;
                    }

                    if (empty($angkatan)) {
                        if (strlen($nim) >= 2 && is_numeric(substr($nim, 0, 2))) {
                            $angkatan = '20' . substr($nim, 0, 2);
                        } else {
                            $angkatan = date('Y');
                        }
                    }

                    if (empty($email)) {
                        $email = $nim . '@student.trunodjoyo.ac.id';
                    }

                    $existing = MasterMahasiswa::where('nim', $nim)->first();
                    if ($existing) {
                        $existing->update([
                            'nama' => $nama,
                            'email' => $email,
                            'program_studi' => $prodi,
                            'angkatan' => $angkatan,
                            'nip_dosen_wali' => $cleanNipWali,
                        ]);
                        $updated++;
                    } else {
                        MasterMahasiswa::create([
                            'nim' => $nim,
                            'nama' => $nama,
                            'email' => $email,
                            'program_studi' => $prodi,
                            'angkatan' => $angkatan,
                            'nip_dosen_wali' => $cleanNipWali,
                        ]);
                        $imported++;
                    }

                    // Hubungkan otomatis ke akun User jika user sudah terdaftar di sistem
                    if ($cleanNipWali) {
                        $dosenUser = User::where('nip', $cleanNipWali)->where('role', 'dosen')->first();
                        if ($dosenUser) {
                            User::where('nim', $nim)->update(['dosen_wali_id' => $dosenUser->id]);
                        }
                    }
                }
                fclose($handle);
            }

            DB::commit();

            return back()->with('success', "Import Excel berhasil! {$imported} data baru ditambahkan, {$updated} data diperbarui" . ($skipped > 0 ? ", {$skipped} baris dilewati (tidak valid)." : "."));
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', "Terjadi kesalahan saat membaca file Excel: " . $e->getMessage());
        }
    }

    /**
     * Download sample Excel (.xlsx) template for import.
     */
    public function downloadTemplate(): BinaryFileResponse
    {
        $tempPath = tempnam(sys_get_temp_dir(), 'template_excel_') . '.xlsx';

        $writer = new XLSXWriter();
        $writer->openToFile($tempPath);

        // Header (Termasuk NIP Dosen Wali)
        $writer->addRow(Row::fromValues(['nim', 'nama', 'email', 'program_studi', 'angkatan', 'nip_dosen_wali']));

        // Sample Data Rows
        $writer->addRow(Row::fromValues([
            '230411100092',
            'Nabiilah Rizqi Amalia',
            '230411100092@student.trunojoyo.ac.id',
            'Teknik Informatika',
            '2023',
            '198501012010121001',
        ]));

        $writer->close();

        return response()->download($tempPath, 'template_master_mahasiswa.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Update a single master student record.
     */
    public function update(Request $request, MasterMahasiswa $masterMahasiswa): RedirectResponse
    {
        $request->validate([
            'nim' => ['required', 'string', 'unique:master_mahasiswas,nim,' . $masterMahasiswa->id],
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:master_mahasiswas,email,' . $masterMahasiswa->id],
            'program_studi' => ['nullable', 'string', 'max:255'],
            'angkatan' => ['required', 'string', 'max:10'],
            'nip_dosen_wali' => ['nullable', 'string', 'max:50'],
        ]);

        $cleanNipWali = $request->nip_dosen_wali ? trim($request->nip_dosen_wali) : null;

        $masterMahasiswa->update([
            'nim' => trim($request->nim),
            'nama' => trim($request->nama),
            'email' => trim($request->email),
            'program_studi' => $request->program_studi ? trim($request->program_studi) : 'Teknik Informatika',
            'angkatan' => trim($request->angkatan),
            'nip_dosen_wali' => $cleanNipWali,
        ]);

        if ($cleanNipWali) {
            $dosenUser = User::where('nip', $cleanNipWali)->where('role', 'dosen')->first();
            if ($dosenUser) {
                User::where('nim', $masterMahasiswa->nim)->update(['dosen_wali_id' => $dosenUser->id]);
            }
        }

        return back()->with('success', "Data master mahasiswa {$masterMahasiswa->nim} berhasil diperbarui.");
    }

    /**
     * Delete a single master student record.
     */
    public function destroy(MasterMahasiswa $masterMahasiswa): RedirectResponse
    {
        $nim = $masterMahasiswa->nim;
        $nama = $masterMahasiswa->nama;
        $masterMahasiswa->delete();

        return back()->with('success', "Data master mahasiswa {$nama} ({$nim}) telah dihapus.");
    }

    /**
     * Truncate/clear all master data.
     */
    public function truncate(): RedirectResponse
    {
        MasterMahasiswa::truncate();

        return back()->with('success', "Seluruh Data Master Mahasiswa berhasil dikosongkan.");
    }
}
