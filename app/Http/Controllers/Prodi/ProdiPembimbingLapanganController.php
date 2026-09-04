<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\PembimbingLapangan;
use App\Models\Instansi;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProdiPembimbingLapanganController extends Controller
{
    public function index(Request $request)
    {
        $pembimbings = PembimbingLapangan::with('instansi')->orderBy('nama', 'asc')->get();

        return Inertia::render('Prodi/PembimbingLapangan/Index', [
            'pembimbings' => $pembimbings
        ]);
    }

    public function create()
    {
        $instansis = Instansi::orderBy('nama', 'asc')->get();
        return Inertia::render('Prodi/PembimbingLapangan/Create', [
            'instansis' => $instansis
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'instansi_id' => 'required|exists:instansis,id',
            'nama' => 'required|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            PembimbingLapangan::create([
                'instansi_id' => $request->instansi_id,
                'nama' => $request->nama,
            ]);

            DB::commit();
            return redirect()->route('prodi.pembimbing-lapangan.index')->with('success', 'Data Pembimbing Lapangan berhasil ditambahkan ke whitelist.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menambahkan pembimbing lapangan: ' . $e->getMessage()]);
        }
    }

    public function edit($id)
    {
        $pembimbing = PembimbingLapangan::findOrFail($id);
        $instansis = Instansi::orderBy('nama', 'asc')->get();
        
        return Inertia::render('Prodi/PembimbingLapangan/Edit', [
            'pembimbing' => $pembimbing,
            'instansis' => $instansis
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'instansi_id' => 'required|exists:instansis,id',
            'nama' => 'required|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $pembimbing = PembimbingLapangan::findOrFail($id);
            $pembimbing->update([
                'instansi_id' => $request->instansi_id,
                'nama' => $request->nama,
            ]);

            DB::commit();
            return redirect()->route('prodi.pembimbing-lapangan.index')->with('success', 'Data Pembimbing Lapangan berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui pembimbing lapangan: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $pembimbing = PembimbingLapangan::findOrFail($id);
            
            if ($pembimbing->user_id) {
                return back()->withErrors(['error' => 'Gagal menghapus: Akun pembimbing lapangan ini sudah diklaim dan aktif digunakan.']);
            }
            
            $pembimbing->delete();

            DB::commit();
            return redirect()->route('prodi.pembimbing-lapangan.index')->with('success', 'Data Pembimbing Lapangan berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menghapus pembimbing lapangan: ' . $e->getMessage()]);
        }
    }
}
