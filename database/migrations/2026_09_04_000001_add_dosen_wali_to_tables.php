<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tambah nip_dosen_wali di master_mahasiswas
        Schema::table('master_mahasiswas', function (Blueprint $table) {
            $table->string('nip_dosen_wali')->nullable()->after('angkatan');
        });

        // 2. Tambah nip_dosen_wali di permohonan_akuns
        Schema::table('permohonan_akuns', function (Blueprint $table) {
            $table->string('nip_dosen_wali')->nullable()->after('angkatan');
        });

        // 3. Tambah dosen_wali_id di users (merujuk ke dosen pembimbing akademik)
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('dosen_wali_id')->nullable()->after('nip')->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('dosen_wali_id');
        });

        Schema::table('permohonan_akuns', function (Blueprint $table) {
            $table->dropColumn('nip_dosen_wali');
        });

        Schema::table('master_mahasiswas', function (Blueprint $table) {
            $table->dropColumn('nip_dosen_wali');
        });
    }
};
