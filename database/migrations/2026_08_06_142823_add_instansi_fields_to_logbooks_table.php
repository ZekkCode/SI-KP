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
        Schema::table('logbooks', function (Blueprint $table) {
            $table->enum('status_instansi', ['menunggu', 'disetujui', 'revisi'])->default('menunggu')->after('status');
            $table->text('catatan_instansi')->nullable()->after('catatan_dosen');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('logbooks', function (Blueprint $table) {
            $table->dropColumn(['status_instansi', 'catatan_instansi']);
        });
    }
};
