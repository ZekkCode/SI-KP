<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeriodeKp extends Model
{
    use HasFactory;

    protected $fillable = [
        'semester',
        'tanggal_pendaftaran',
        'tanggal_batas_pendaftaran',
        'tanggal_batas_pengajuan_surat',
    ];

    protected $casts = [
        'tanggal_pendaftaran' => 'date',
        'tanggal_batas_pendaftaran' => 'date',
        'tanggal_batas_pengajuan_surat' => 'date',
    ];
}
