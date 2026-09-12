<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MasterMahasiswa extends Model
{
    use HasFactory;

    protected $fillable = [
        'nim',
        'nama',
        'email',
        'program_studi',
        'angkatan',
        'nip_dosen_wali',
        'sumber_data',
    ];

    /**
     * Relasi ke user dosen berdasarkan NIP dosen wali.
     */
    public function dosenWali(): BelongsTo
    {
        return $this->belongsTo(User::class, 'nip_dosen_wali', 'nip');
    }

    /**
     * The "booted" method of the model.
     * Secara otomatis menghapus permohonan akun dan akun user mahasiswa (beserta data KP-nya)
     * saat data master mahasiswa dihapus.
     */
    protected static function booted(): void
    {
        static::deleting(function (MasterMahasiswa $master) {
            // Hapus permohonan akun dengan NIM yang sama
            PermohonanAkun::where('nim', $master->nim)->delete();

            // Hapus akun user mahasiswa dengan NIM yang sama (dan seluruh data relasi KP-nya)
            User::where('nim', $master->nim)->where('role', 'mahasiswa')->each(function ($user) {
                $user->delete();
            });
        });
    }
}
