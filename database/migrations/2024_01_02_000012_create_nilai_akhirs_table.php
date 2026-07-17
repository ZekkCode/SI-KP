<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nilai_akhirs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftaran_id')->unique()->constrained('pendaftarans')->cascadeOnDelete();
            $table->decimal('nilai_ujian', 5, 2)->nullable();
            $table->decimal('nilai_pembimbing', 5, 2)->nullable();
            $table->decimal('nilai_instansi', 5, 2)->nullable();
            $table->decimal('nilai_total', 5, 2)->nullable();
            $table->string('nilai_huruf', 2)->nullable();
            $table->enum('status', ['proses', 'lulus', 'tidak_lulus'])->default('proses');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nilai_akhirs');
    }
};
