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
        'user_type',
        'roles_assignment',
        'active_role',
        'is_dekan',
        'is_root',
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
        'has_set_password',
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

    protected $appends = [
        'is_superadmin',
    ];

    public function getIsSuperadminAttribute(): bool
    {
        return $this->isSuperAdmin();
    }

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
            'user_type' => 'string',
            'roles_assignment' => 'array',
            'is_dekan' => 'boolean',
            'is_root' => 'boolean',
            'bidang_keahlian' => 'array',
            'must_change_password' => 'boolean',
            'has_set_password' => 'boolean',
        ];
    }

    /**
     * Get the dashboard route for this user's role.
     */
    public function dashboardRoute(): string
    {
        if ($this->isSuperAdmin() && (strtolower($this->active_role ?? '') === 'superadmin' || strtolower($this->role ?? '') === 'superadmin' || $this->is_root)) {
            return '/admin/dashboard';
        }

        return match (strtolower($this->active_role ?: ($this->role ?? ''))) {
            'superadmin', 'admin' => '/admin/dashboard',
            'mahasiswa' => '/mahasiswa/dashboard',
            'dosen' => '/dosen/dashboard',
            'tu' => '/tu/dashboard',
            'instansi' => '/instansi/dashboard',
            'prodi' => '/prodi/dashboard',
            default => '/login',
        };
    }

    public function hasRole(string $role): bool
    {
        $roleLower = strtolower($role);
        // Cek kolom legacy role atau active_role
        if (strtolower($this->role ?? '') === $roleLower || strtolower($this->active_role ?? '') === $roleLower) {
            return true;
        }

        // Cek dalam assignment array roles_assignment
        $assigned = is_array($this->roles_assignment) ? $this->roles_assignment : [];
        $assigned = array_map('strtolower', $assigned);

        if (in_array($roleLower, $assigned)) {
            return true;
        }

        // Mapping alias fungsional
        if ($roleLower === 'prodi' && in_array('koor_prodi', $assigned)) {
            return true;
        }
        if ($roleLower === 'dosen' && (in_array('dosen_pembimbing', $assigned) || $this->user_type === 'dosen')) {
            return true;
        }

        return false;
    }

    /**
     * Memeriksa apakah user sudah memiliki penugasan tipe akun atau peran.
     */
    public function hasAssignedRole(): bool
    {
        if (!empty($this->user_type)) {
            return true;
        }

        if (!empty($this->role)) {
            return true;
        }

        if (is_array($this->roles_assignment) && count($this->roles_assignment) > 0) {
            return true;
        }

        return false;
    }

    /**
     * Helper untuk menetapkan Dekan (hanya boleh ada 1 dekan dalam sistem).
     */
    public function assignAsDekan(): void
    {
        // Reset dekan lama
        static::where('is_dekan', true)->where('id', '!=', $this->id)->update(['is_dekan' => false]);
        $this->update(['is_dekan' => true]);
    }

    /**
     * Mendapatkan dosen yang saat ini menjabat sebagai Dekan.
     */
    public static function getDekan(): ?self
    {
        return static::where('is_dekan', true)->first();
    }

    public function isMahasiswa(): bool
    {
        return $this->hasRole('mahasiswa');
    }

    public function isDosen(): bool
    {
        return $this->hasRole('dosen');
    }

    public function isTu(): bool
    {
        return $this->hasRole('tu');
    }

    public function isProdi(): bool
    {
        return $this->hasRole('prodi');
    }

    public function isInstansi(): bool
    {
        return $this->hasRole('instansi');
    }

    public function isSuperAdmin(): bool
    {
        return $this->is_root || $this->hasRole('superadmin');
    }

    public function isRoot(): bool
    {
        return (bool) $this->is_root;
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
     * Latest KP registration as mahasiswa.
     */
    public function latestPendaftaranMahasiswa(): HasOne
    {
        return $this->hasOne(Pendaftaran::class, 'mahasiswa_id')->latestOfMany('id');
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
