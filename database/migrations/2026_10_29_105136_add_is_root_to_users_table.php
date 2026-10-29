<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Flag Root Admin: Tingkat otoritas tertinggi yang terlindungi oleh sistem
            $table->boolean('is_root')->default(false)->after('is_dekan');
        });

        // Pastikan ada akun Super User Root pertama jika belum ada
        $rootEmail = 'root@trunojoyo.ac.id';
        $existingRoot = DB::table('users')->where('email', $rootEmail)->first();

        if (!$existingRoot) {
            DB::table('users')->insert([
                'name' => 'Root Administrator',
                'email' => $rootEmail,
                'password' => Hash::make('password'),
                'role' => 'tu', // fallback kompatibilitas role lama
                'user_type' => 'staff',
                'roles_assignment' => json_encode(['superadmin']),
                'active_role' => 'superadmin',
                'is_dekan' => false,
                'is_root' => true,
                'status_akun' => 'aktif',
                'must_change_password' => true,
                'has_set_password' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            DB::table('users')->where('id', $existingRoot->id)->update([
                'is_root' => true,
                'user_type' => 'staff',
                'roles_assignment' => json_encode(array_unique(array_merge(
                    json_decode($existingRoot->roles_assignment ?? '[]', true) ?: [],
                    ['superadmin']
                ))),
                'active_role' => 'superadmin',
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_root');
        });
    }
};
