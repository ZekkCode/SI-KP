<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_pengantars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftaran_id')->constrained('pendaftarans')->cascadeOnDelete();
            $table->string('nomor_surat')->unique();
            $table->date('tanggal_terbit');
            $table->date('tanggal_berlaku')->nullable();
            $table->string('path_file')->nullable();
            $table->string('ditandatangani_oleh')->nullable();
            $table->string('nip_penandatangan')->nullable();
            $table->string('verification_id')->nullable();
            $table->foreignId('generated_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_pengantars');
    }
};
