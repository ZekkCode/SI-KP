<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermohonanAkun extends Model
{
    use HasFactory;

    protected $fillable = [
        'nim',
        'nama',
        'email',
        'program_studi',
        'angkatan',
        'nip_dosen_wali',
        'status',
        'catatan_tu',
        'diverifikasi_oleh',
        'diverifikasi_pada',
    ];

    protected function casts(): array
    {
        return [
            'diverifikasi_pada' => 'datetime',
        ];
    }

    public function verifikator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diverifikasi_oleh');
    }

    public function dosenWali(): BelongsTo
    {
        return $this->belongsTo(User::class, 'nip_dosen_wali', 'nip');
    }
}
