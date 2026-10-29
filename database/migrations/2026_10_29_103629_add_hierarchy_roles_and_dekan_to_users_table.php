<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Hierarki 1: Jenis akun utama (mahasiswa, dosen, staff, instansi)
            $table->enum('user_type', ['mahasiswa', 'dosen', 'staff', 'instansi'])
                  ->default('mahasiswa')
                  ->after('email');

            // Hierarki 2: Tugas / peran fungsional aktif (multi-role berupa array JSON)
            // Contoh untuk dosen: ["dosen_pembimbing", "koor_prodi"]
            // Contoh untuk staff: ["tu"]
            $table->json('roles_assignment')->nullable()->after('user_type');

            // Peran yang sedang aktif digunakan saat login / switch role
            $table->string('active_role', 50)->nullable()->after('roles_assignment');

            // Penanda Dekan: Hanya boleh ada 1 dekan pada sistem
            $table->boolean('is_dekan')->default(false)->after('active_role');
        });

        // Migrasi data role lama ke struktur hierarki baru
        $users = DB::table('users')->get();
        foreach ($users as $user) {
            $oldRole = strtolower($user->role ?? 'mahasiswa');
            $userType = 'mahasiswa';
            $roles = [];
            $activeRole = $oldRole;

            switch ($oldRole) {
                case 'dosen':
                    $userType = 'dosen';
                    $roles = ['dosen_pembimbing'];
                    $activeRole = 'dosen';
                    break;
                case 'prodi':
                    $userType = 'dosen';
                    $roles = ['dosen_pembimbing', 'koor_prodi'];
                    $activeRole = 'prodi';
                    break;
                case 'tu':
                    $userType = 'staff';
                    $roles = ['tu'];
                    $activeRole = 'tu';
                    break;
                case 'instansi':
                    $userType = 'instansi';
                    $roles = ['instansi'];
                    $activeRole = 'instansi';
                    break;
                case 'mahasiswa':
                default:
                    $userType = 'mahasiswa';
                    $roles = ['mahasiswa'];
                    $activeRole = 'mahasiswa';
                    break;
            }

            DB::table('users')->where('id', $user->id)->update([
                'user_type' => $userType,
                'roles_assignment' => json_encode($roles),
                'active_role' => $activeRole,
                'is_dekan' => false,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['user_type', 'roles_assignment', 'active_role', 'is_dekan']);
        });
    }
};
