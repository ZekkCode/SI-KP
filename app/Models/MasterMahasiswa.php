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
    ];

    /**
     * Relasi ke user dosen berdasarkan NIP dosen wali.
     */
    public function dosenWali(): BelongsTo
    {
        return $this->belongsTo(User::class, 'nip_dosen_wali', 'nip');
    }
}
