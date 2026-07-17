<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProgramStudi extends Model
{
    use HasFactory;

    protected $table = 'program_studis';

    protected $fillable = [
        'nama',
        'kode',
        'fakultas',
    ];

    /**
     * Users belonging to this program studi.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'program_studi_id');
    }
}
