<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PembimbingLapangan extends Model
{
    use HasFactory;

    protected $fillable = ['instansi_id', 'nama', 'user_id'];

    public function instansi()
    {
        return $this->belongsTo(Instansi::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pendaftarans()
    {
        return $this->hasMany(Pendaftaran::class, 'pembimbing_lapangan_id');
    }
}
