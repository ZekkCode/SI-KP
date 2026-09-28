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
        Schema::create('sidangs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftaran_id')->constrained('pendaftarans')->cascadeOnDelete();
            $table->dateTime('tanggal_sidang')->nullable();
            $table->string('ruangan')->nullable();
            $table->enum('status', ['diajukan', 'dijadwalkan', 'selesai', 'dibatalkan'])->default('diajukan');
            $table->text('catatan')->nullable();
            $table->foreignId('dosen_penguji_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sidangs');
    }
};
