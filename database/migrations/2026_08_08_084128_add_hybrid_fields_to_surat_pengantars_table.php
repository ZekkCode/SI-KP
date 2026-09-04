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
        Schema::table('surat_pengantars', function (Blueprint $table) {
            $table->string('nama_instansi')->after('pendaftaran_id')->nullable();
            $table->text('alamat_instansi')->after('nama_instansi')->nullable();
            $table->date('tanggal_mulai')->after('alamat_instansi')->nullable();
            $table->date('tanggal_selesai')->after('tanggal_mulai')->nullable();
            $table->string('file_scan')->after('tanggal_selesai')->nullable();
            $table->enum('status', ['draft', 'menunggu_verifikasi', 'terverifikasi', 'revisi'])->default('draft')->after('file_scan');
            
            // Make existing fields nullable
            $table->string('nomor_surat')->nullable()->change();
            $table->date('tanggal_terbit')->nullable()->change();
            $table->unsignedBigInteger('generated_by')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surat_pengantars', function (Blueprint $table) {
            $table->dropColumn(['nama_instansi', 'alamat_instansi', 'tanggal_mulai', 'tanggal_selesai', 'file_scan', 'status']);
            
            // Revert changes
            $table->string('nomor_surat')->nullable(false)->change();
            $table->date('tanggal_terbit')->nullable(false)->change();
            $table->unsignedBigInteger('generated_by')->nullable(false)->change();
        });
    }
};
