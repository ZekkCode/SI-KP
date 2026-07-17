<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KuotaDosen extends Model
{
    use HasFactory;

    protected $table = 'kuota_dosens';

    protected $fillable = [
        'dosen_id',
        'periode',
        'kuota_max',
        'keahlian',
    ];

    public function dosen(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dosen_id');
    }
}
