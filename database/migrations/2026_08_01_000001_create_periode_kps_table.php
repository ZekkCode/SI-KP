<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periode_kps', function (Blueprint $table) {
            $table->id();
            $table->string('semester');
            $table->date('tanggal_pendaftaran');
            $table->date('tanggal_batas_pendaftaran');
            $table->date('tanggal_batas_pengajuan_surat');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('periode_kps');
    }
};
