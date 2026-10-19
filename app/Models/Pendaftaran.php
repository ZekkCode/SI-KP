<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pendaftaran extends Model
{
    use HasFactory;

    protected $fillable = [
        'mahasiswa_id',
        'instansi_id',
        'dosen_pembimbing_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'status',
        'bidang_minat',
        'catatan_tu',
        'diverifikasi_oleh',
        'diverifikasi_pada',
        'pembimbing_lapangan_id',
    ];

    /**
     * Memastikan pendaftaran memiliki dosen pembimbing.
     * Jika belum diplot, otomatis sinkronisasi dari dosen wali mahasiswa atau master data dosen.
     */
    public function ensureDosenPembimbing(): ?User
    {
        if ($this->dosen_pembimbing_id) {
            if ($this->relationLoaded('dosenPembimbing') && $this->dosenPembimbing) {
                return $this->dosenPembimbing;
            }
            $dosen = User::find($this->dosen_pembimbing_id);
            if ($dosen) {
                $this->setRelation('dosenPembimbing', $dosen);
                return $dosen;
            }
        }

        $dosenId = null;
        $mahasiswa = $this->relationLoaded('mahasiswa') ? $this->mahasiswa : User::find($this->mahasiswa_id);

        if ($mahasiswa) {
            $dosenId = $mahasiswa->dosen_wali_id;
            if (!$dosenId && $mahasiswa->nim) {
                $master = MasterMahasiswa::where('nim', $mahasiswa->nim)->first();
                if ($master && $master->nip_dosen_wali) {
                    $dosenWali = User::where('nip', $master->nip_dosen_wali)->where('role', 'dosen')->first();
                    if ($dosenWali) {
                        $dosenId = $dosenWali->id;
                        $mahasiswa->update(['dosen_wali_id' => $dosenId]);
                    }
                }
            }
        }

        if (!$dosenId) {
            $defaultDosen = User::where('role', 'dosen')->where('status_akun', 'aktif')->first();
            $dosenId = $defaultDosen?->id;
        }

        if ($dosenId) {
            $this->dosen_pembimbing_id = $dosenId;
            $this->saveQuietly();
            $dosen = User::find($dosenId);
            $this->setRelation('dosenPembimbing', $dosen);
            return $dosen;
        }

        return null;
    }

    protected static function booted(): void
    {
        static::creating(function (Pendaftaran $pendaftaran) {
            if (empty($pendaftaran->dosen_pembimbing_id) && !empty($pendaftaran->mahasiswa_id)) {
                $mahasiswa = User::find($pendaftaran->mahasiswa_id);
                if ($mahasiswa && $mahasiswa->dosen_wali_id) {
                    $pendaftaran->dosen_pembimbing_id = $mahasiswa->dosen_wali_id;
                } elseif ($mahasiswa && $mahasiswa->nim) {
                    $master = MasterMahasiswa::where('nim', $mahasiswa->nim)->first();
                    if ($master && $master->nip_dosen_wali) {
                        $dosenWali = User::where('nip', $master->nip_dosen_wali)->where('role', 'dosen')->first();
                        if ($dosenWali) {
                            $pendaftaran->dosen_pembimbing_id = $dosenWali->id;
                        }
                    }
                }
            }
        });
    }

    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
            'diverifikasi_pada' => 'datetime',
        ];
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mahasiswa_id');
    }

    public function instansi(): BelongsTo
    {
        return $this->belongsTo(Instansi::class);
    }

    public function dosenPembimbing(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dosen_pembimbing_id');
    }

    public function verifikator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diverifikasi_oleh');
    }

    public function dokumenPendaftarans(): HasMany
    {
        return $this->hasMany(DokumenPendaftaran::class);
    }

    public function suratPengantar(): HasOne
    {
        return $this->hasOne(SuratPengantar::class);
    }

    public function suratBalasan(): HasOne
    {
        return $this->hasOne(SuratBalasan::class);
    }

    public function proposals(): HasMany
    {
        return $this->hasMany(Proposal::class);
    }

    public function logbooks(): HasMany
    {
        return $this->hasMany(Logbook::class, 'pendaftaran_id');
    }

    public function beritaAcara(): HasOne
    {
        return $this->hasOne(BeritaAcara::class);
    }

    public function nilais(): HasMany
    {
        return $this->hasMany(Nilai::class);
    }

    public function nilaiAkhir(): HasOne
    {
        return $this->hasOne(NilaiAkhir::class);
    }

    public function dokumenAkhirs(): HasMany
    {
        return $this->hasMany(DokumenAkhir::class);
    }

    public function pembimbingLapangan(): BelongsTo
    {
        return $this->belongsTo(PembimbingLapangan::class, 'pembimbing_lapangan_id');
    }

    public function sidang(): HasOne
    {
        return $this->hasOne(Sidang::class);
    }
}
