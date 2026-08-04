<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            ALTER TABLE pendaftarans
            MODIFY COLUMN status ENUM(
                'draft',
                'diajukan',
                'verifikasi_tu',
                'perlu_perbaikan',
                'disetujui_tu',
                'surat_terbit',
                'diterima_instansi',
                'ditolak_instansi',
                'verifikasi_surat_balasan',
                'plotting_dosen',
                'aktif',
                'selesai'
            ) NOT NULL DEFAULT 'draft'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("
            ALTER TABLE pendaftarans
            MODIFY COLUMN status ENUM(
                'draft',
                'diajukan',
                'verifikasi_tu',
                'perlu_perbaikan',
                'disetujui_tu',
                'surat_terbit',
                'diterima_instansi',
                'ditolak_instansi',
                'aktif',
                'selesai'
            ) NOT NULL DEFAULT 'draft'
        ");
    }
};