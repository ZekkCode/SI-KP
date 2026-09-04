<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE logbooks CHANGE status status_dosen ENUM('menunggu', 'disetujui', 'revisi') DEFAULT 'menunggu'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE logbooks CHANGE status_dosen status ENUM('menunggu', 'disetujui', 'revisi') DEFAULT 'menunggu'");
    }
};
