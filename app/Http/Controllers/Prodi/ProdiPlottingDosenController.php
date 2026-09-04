<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class ProdiPlottingDosenController extends Controller
{
    /**
     * Tampilkan antrean mahasiswa yang butuh pembimbing dan daftar dosen.
     */
    public function index()
    {
        // Ambil pendaftaran yang statusnya 'plotting_dosen' atau 'disetujui_tu' tapi belum punya dosen
        $mahasiswaQueue = Pendaftaran::with(['mahasiswa.programStudi', 'instansi', 'proposals'])
            ->whereNull('dosen_pembimbing_id')
            ->whereIn('status', ['plotting_dosen', 'disetujui_tu'])
            ->latest()
            ->get();

        // Ambil daftar dosen beserta kuota dari tabel kuota_dosens
        // Kita juga butuh hitung berapa pendaftaran aktif yang sedang dibimbing dosen ini
        // Kita asumsikan pendaftaran dengan status >= 'aktif' dan != 'selesai' dihitung sebagai sedang bimbingan
        $dosenList = User::where('role', 'dosen')
            ->leftJoin('kuota_dosens', 'users.id', '=', 'kuota_dosens.dosen_id')
            ->select('users.id', 'users.name', 'users.nip', 'kuota_dosens.kuota_max', 'kuota_dosens.keahlian')
            ->withCount(['dibimbing as bimbingan_aktif' => function ($query) {
                $query->whereIn('status', ['aktif', 'diterima_instansi', 'verifikasi_surat_balasan']);
            }])
            ->get();

        // Jika relation dibimbing belum ada di User model, kita tambahkan mapping manual saja
        // untuk menghindari error pada withCount. Lebih aman hitung manual atau load.
        // Mari kita buat pendekatan aman: 
        
        $dosenListSafe = User::where('role', 'dosen')->get()->map(function ($dosen) {
            // Ambil kuota max jika ada (fallback 10)
            $kuota = \App\Models\KuotaDosen::where('dosen_id', $dosen->id)->first();
            
            // Hitung mahasiswa aktif
            $bimbinganAktif = Pendaftaran::where('dosen_pembimbing_id', $dosen->id)
                ->whereIn('status', ['aktif', 'selesai', 'diterima_instansi', 'verifikasi_surat_balasan', 'plotting_dosen']) // asumsikan
                ->count();
                
            return [
                'id' => $dosen->id,
                'name' => $dosen->name,
                'nip' => $dosen->nip,
                'keahlian' => $kuota ? $kuota->keahlian : 'Umum',
                'kuota_max' => $kuota ? $kuota->kuota_max : 10,
                'bimbingan_aktif' => $bimbinganAktif
            ];
        });

        $plottedHistory = Pendaftaran::with(['mahasiswa', 'dosenPembimbing'])
            ->whereNotNull('dosen_pembimbing_id')
            ->latest()
            ->get();

        return Inertia::render('Prodi/SupervisorPlotting', [
            'mahasiswaQueue' => $mahasiswaQueue,
            'dosenList' => $dosenListSafe,
            'plottedHistory' => $plottedHistory
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'pendaftaran_id' => 'required|exists:pendaftarans,id',
            'dosen_pembimbing_id' => 'required|exists:users,id',
        ]);

        $pendaftaran = Pendaftaran::findOrFail($request->pendaftaran_id);
        $pendaftaran->dosen_pembimbing_id = $request->dosen_pembimbing_id;
        
        // Ubah status menjadi aktif jika sebelumnya masih dalam tahap plotting
        if ($pendaftaran->status === 'plotting_dosen' || $pendaftaran->status === 'verifikasi_surat_balasan') {
            $pendaftaran->status = 'aktif';
        }
        
        $pendaftaran->save();
        return back()->with('success', 'Dosen pembimbing berhasil ditetapkan dan status mahasiswa menjadi Aktif.');
    }
}
