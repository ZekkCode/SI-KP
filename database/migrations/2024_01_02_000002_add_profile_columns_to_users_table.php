<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('program_studi_id')->nullable()->after('nip')
                  ->constrained('program_studis')->nullOnDelete();
            $table->string('no_telepon')->nullable()->after('program_studi_id');
            $table->string('konsentrasi')->nullable()->after('no_telepon');
            $table->unsignedInteger('total_sks')->nullable()->after('konsentrasi');
            $table->string('semester')->nullable()->after('total_sks');
            $table->string('foto')->nullable()->after('semester');
            $table->year('angkatan')->nullable()->after('foto');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['program_studi_id']);
            $table->dropColumn([
                'program_studi_id', 'no_telepon', 'konsentrasi',
                'total_sks', 'semester', 'foto', 'angkatan',
            ]);
        });
    }
};
