<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kuota_dosens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dosen_id')->constrained('users')->cascadeOnDelete();
            $table->string('periode');
            $table->unsignedInteger('kuota_max')->default(10);
            $table->string('keahlian')->nullable();
            $table->timestamps();

            $table->unique(['dosen_id', 'periode']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kuota_dosens');
    }
};
