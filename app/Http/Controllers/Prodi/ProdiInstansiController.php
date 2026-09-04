<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\Instansi;
use App\Models\PembimbingLapangan;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProdiInstansiController extends Controller
{
    public function index(Request $request)
    {
        $instansis = Instansi::orderBy('nama', 'asc')->get();
        $pembimbings = PembimbingLapangan::with('instansi')->orderBy('nama', 'asc')->get();

        return Inertia::render('Prodi/Instansi/Index', [
            'instansis'   => $instansis,
            'pembimbings' => $pembimbings,
        ]);
    }

    public function create()
    {
        return Inertia::render('Prodi/Instansi/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            Instansi::create([
                'nama' => $request->nama,
                'alamat' => $request->alamat,
            ]);

            DB::commit();
            return redirect()->route('prodi.instansi.index')->with('success', 'Data Instansi berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menambahkan instansi: ' . $e->getMessage()]);
        }
    }

    public function edit($id)
    {
        $instansi = Instansi::findOrFail($id);
        return Inertia::render('Prodi/Instansi/Edit', [
            'instansi' => $instansi
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $instansi = Instansi::findOrFail($id);
            $instansi->update([
                'nama' => $request->nama,
                'alamat' => $request->alamat,
            ]);

            DB::commit();
            return redirect()->route('prodi.instansi.index')->with('success', 'Data Instansi berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui instansi: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $instansi = Instansi::findOrFail($id);
            $instansi->delete();

            DB::commit();
            return redirect()->route('prodi.instansi.index')->with('success', 'Data Instansi berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menghapus instansi: ' . $e->getMessage()]);
        }
    }
}
