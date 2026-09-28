<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SuratPengantar extends Model
{
    use HasFactory;

    protected $table = 'surat_pengantars';

    protected $fillable = [
        'pendaftaran_id',
        'nama_instansi',
        'alamat_instansi',
        'tanggal_mulai',
        'tanggal_selesai',
        'file_scan',
        'status',
        'confirmation_token',
        'confirmation_status',
        'confirmed_at',
        'pl_nama',
        'pl_email',
        'pl_telepon',
        'catatan_instansi',
        'nomor_surat',
        'tanggal_terbit',
        'tanggal_berlaku',
        'path_file',
        'ditandatangani_oleh',
        'nip_penandatangan',
        'verification_id',
        'generated_by',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
            'tanggal_terbit' => 'date',
            'tanggal_berlaku' => 'date',
            'confirmed_at' => 'datetime',
        ];
    }

    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
