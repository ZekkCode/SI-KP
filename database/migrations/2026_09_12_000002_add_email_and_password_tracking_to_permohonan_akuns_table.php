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
        Schema::table('permohonan_akuns', function (Blueprint $table) {
            $table->string('password_sementara')->nullable()->after('catatan_tu');
            $table->enum('status_email', ['belum_dikirim', 'terkirim', 'gagal'])->default('belum_dikirim')->after('password_sementara');
            $table->text('error_email')->nullable()->after('status_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permohonan_akuns', function (Blueprint $table) {
            $table->dropColumn(['password_sementara', 'status_email', 'error_email']);
        });
    }
};
