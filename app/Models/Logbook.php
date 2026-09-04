<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Logbook extends Model
{
    use HasFactory;

    protected $fillable = [
        'pendaftaran_id',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
        'deskripsi',
        'path_foto',
        'status_dosen',
        'status_instansi',
        'catatan_dosen',
        'catatan_instansi',
        'divalidasi_oleh',
        'divalidasi_pada',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
            'divalidasi_pada' => 'datetime',
        ];
    }

    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    public function validator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'divalidasi_oleh');
    }
}
