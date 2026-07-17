<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NilaiAkhir extends Model
{
    use HasFactory;

    protected $table = 'nilai_akhirs';

    protected $fillable = [
        'pendaftaran_id',
        'nilai_ujian',
        'nilai_pembimbing',
        'nilai_instansi',
        'nilai_total',
        'nilai_huruf',
        'status',
        'catatan',
    ];

    protected function casts(): array
    {
        return [
            'nilai_ujian' => 'decimal:2',
            'nilai_pembimbing' => 'decimal:2',
            'nilai_instansi' => 'decimal:2',
            'nilai_total' => 'decimal:2',
        ];
    }

    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(Pendaftaran::class);
    }
}
