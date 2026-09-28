<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sidang extends Model
{
    use HasFactory;

    protected $table = 'sidangs';

    protected $fillable = [
        'pendaftaran_id',
        'tanggal_sidang',
        'ruangan',
        'status',
        'catatan',
        'dosen_penguji_id',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_sidang' => 'datetime',
        ];
    }

    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    public function dosenPenguji(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dosen_penguji_id');
    }
}
