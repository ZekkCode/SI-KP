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
        Schema::table('master_mahasiswas', function (Blueprint $table) {
            // Kolom sumber_data untuk menandai asal data: 'manual' atau 'import_excel'
            $table->string('sumber_data')->default('manual')->after('angkatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('master_mahasiswas', function (Blueprint $table) {
            $table->dropColumn('sumber_data');
        });
    }
};
