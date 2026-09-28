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
        Schema::table('surat_pengantars', function (Blueprint $table) {
            $table->string('confirmation_token', 64)->nullable()->unique()->after('status');
            $table->enum('confirmation_status', ['pending', 'accepted', 'rejected'])->default('pending')->after('confirmation_token');
            $table->timestamp('confirmed_at')->nullable()->after('confirmation_status');
            $table->string('pl_nama')->nullable()->after('confirmed_at');
            $table->string('pl_email')->nullable()->after('pl_nama');
            $table->string('pl_telepon')->nullable()->after('pl_email');
            $table->text('catatan_instansi')->nullable()->after('pl_telepon');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surat_pengantars', function (Blueprint $table) {
            $table->dropColumn([
                'confirmation_token',
                'confirmation_status',
                'confirmed_at',
                'pl_nama',
                'pl_email',
                'pl_telepon',
                'catatan_instansi',
            ]);
        });
    }
};
