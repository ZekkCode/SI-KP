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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('status_akun', ['pending', 'aktif', 'ditolak'])
                  ->default('pending')
                  ->after('role');
            
            // Make nim unique if possible, we might need to alter it
            $table->string('nim')->unique()->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('status_akun');
            $table->dropUnique(['nim']);
        });
    }
};
