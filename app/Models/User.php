<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'google_id',
        'google_token',
        'password',
        'role',
        'status_akun',
        'nim',
        'nip',
        'program_studi_id',
        'no_telepon',
        'konsentrasi',
        'total_sks',
        'semester',
        'ipk',
        'foto',
        'avatar',
        'angkatan',
        'bidang_keahlian',
        'must_change_password',
        'dosen_wali_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'bidang_keahlian' => 'array',
            'must_change_password' => 'boolean',
        ];
    }

    /**
     * Get the dashboard route for this user's role.
     */
    public function dashboardRoute(): string
    {
        return match (strtolower($this->role)) {
            'mahasiswa' => '/mahasiswa/dashboard',
            'dosen' => '/dosen/dashboard',
            'tu' => '/tu/dashboard',
            'instansi' => '/instansi/dashboard',
            'prodi' => '/prodi/dashboard',
            default => '/login',
        };
    }

    // ─── Relations ──────────────────────────────────────────────

    public function programStudi(): BelongsTo
    {
        return $this->belongsTo(ProgramStudi::class);
    }

    /**
     * Instansi profile (only for role: instansi).
     */
    public function instansi(): HasOne
    {
        return $this->hasOne(Instansi::class);
    }

    public function pembimbingLapangan(): HasOne
    {
        return $this->hasOne(PembimbingLapangan::class, 'user_id');
    }

    /**
     * KP registrations as mahasiswa.
     */
    public function pendaftaransMahasiswa(): HasMany
    {
        return $this->hasMany(Pendaftaran::class, 'mahasiswa_id');
    }

    /**
     * KP registrations as dosen pembimbing.
     */
    public function pendaftaransDosen(): HasMany
    {
        return $this->hasMany(Pendaftaran::class, 'dosen_pembimbing_id');
    }

    /**
     * Kuota bimbingan (only for role: dosen).
     */
    public function kuotaDosens(): HasMany
    {
        return $this->hasMany(KuotaDosen::class, 'dosen_id');
    }

    /**
     * Logbooks validated by this user (dosen).
     */
    public function validatedLogbooks(): HasMany
    {
        return $this->hasMany(Logbook::class, 'divalidasi_oleh');
    }

    /**
     * Proposals reviewed by this user (dosen).
     */
    public function reviewedProposals(): HasMany
    {
        return $this->hasMany(Proposal::class, 'reviewed_by');
    }

    /**
     * Notifications for this user.
     */
    public function notifikasis(): HasMany
    {
        return $this->hasMany(Notifikasi::class);
    }
    /**
     * Relasi untuk Dosen Pembimbing
     * Menghubungkan Dosen (User) dengan mahasiswa bimbingannya di tabel pendaftarans
     */
    public function dibimbing()
    {
        // Sesuaikan 'App\Models\Pendaftaran' jika nama/path model pendaftaran Anda berbeda
        return $this->hasMany(\App\Models\Pendaftaran::class, 'dosen_pembimbing_id');
    }

    /**
     * Relasi untuk Mahasiswa ke Dosen Wali-nya (DPA).
     */
    public function dosenWali(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dosen_wali_id');
    }

    /**
     * Relasi untuk Dosen ke daftar Mahasiswa perwaliannya.
     */
    public function mahasiswaWali(): HasMany
    {
        return $this->hasMany(User::class, 'dosen_wali_id');
    }
}
