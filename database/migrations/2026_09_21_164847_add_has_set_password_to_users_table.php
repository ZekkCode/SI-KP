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
            $table->boolean('has_set_password')->default(true)->after('must_change_password');
        });

        // Pengguna yang mendaftar via Google OAuth awalnya belum mengatur kata sandi lokal sendiri
        DB::table('users')
            ->whereNotNull('google_id')
            ->update(['has_set_password' => false]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('has_set_password');
        });
    }
};
