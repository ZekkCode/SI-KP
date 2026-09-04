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
        Schema::create('master_mahasiswas', function (Blueprint $table) {
            $table->id();
            $table->string('nim')->unique()->index();
            $table->string('nama');
            $table->string('email')->unique();
            $table->string('program_studi')->default('Teknik Informatika');
            $table->string('angkatan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_mahasiswas');
    }
};
