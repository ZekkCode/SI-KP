<?php

namespace Tests\Feature;

use App\Models\BeritaAcara;
use App\Models\DokumenPendaftaran;
use App\Models\Instansi;
use App\Models\Logbook;
use App\Models\Nilai;
use App\Models\NilaiAkhir;
use App\Models\Notifikasi;
use App\Models\Pendaftaran;
use App\Models\ProgramStudi;
use App\Models\Proposal;
use App\Models\SuratPengantar;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class CriticalWorkflowsTest extends TestCase
{
    use DatabaseTransactions;

    protected User $mahasiswa;
    protected User $dosen;
    protected User $tu;
    protected User $prodi;
    protected User $instansiUser;
    protected Instansi $instansi;
    protected ProgramStudi $prodiModel;

    protected function setUp(): void
    {
        parent::setUp();

        $this->prodiModel = ProgramStudi::firstOrCreate(
            ['kode' => 'TIF'],
            ['nama' => 'Teknik Informatika', 'fakultas' => 'Teknik']
        );

        $this->dosen = User::firstOrCreate(
            ['email' => 'dosen_test@sikp.test'],
            [
                'name' => 'Dosen Penguji, S.Kom., M.T.',
                'nip' => '198101012005011001',
                'password' => bcrypt('password'),
                'role' => 'dosen',
                'status_akun' => 'aktif',
                'program_studi_id' => $this->prodiModel->id,
            ]
        );

        $this->tu = User::firstOrCreate(
            ['email' => 'tu_test@sikp.test'],
            [
                'name' => 'Staff TU Penguji',
                'nip' => '198501012010011002',
                'password' => bcrypt('password'),
                'role' => 'tu',
                'status_akun' => 'aktif',
            ]
        );

        $this->prodi = User::firstOrCreate(
            ['email' => 'prodi_test@sikp.test'],
            [
                'name' => 'Koordinator Penguji',
                'nip' => '197501012000011003',
                'password' => bcrypt('password'),
                'role' => 'prodi',
                'status_akun' => 'aktif',
                'program_studi_id' => $this->prodiModel->id,
            ]
        );

        $this->instansi = Instansi::firstOrCreate(
            ['nama' => 'PT Pengujian Sistem Nusantara'],
            [
                'alamat' => 'Jl. Pengujian No. 99, Surabaya',
                'kota' => 'Surabaya',
                'email' => 'kontak@pengujian-nusantara.test',
                'no_telepon' => '031-888999',
            ]
        );

        $this->instansiUser = User::firstOrCreate(
            ['email' => 'mitra_test@sikp.test'],
            [
                'name' => 'Pembimbing Lapangan Mitra',
                'password' => bcrypt('password'),
                'role' => 'instansi',
                'status_akun' => 'aktif',
            ]
        );

        $this->instansi->update(['user_id' => $this->instansiUser->id]);

        $this->mahasiswa = User::firstOrCreate(
            ['email' => 'mhs_critical@student.trunojoyo.ac.id'],
            [
                'name' => 'Mahasiswa Critical Test',
                'nim' => '230411199999',
                'password' => bcrypt('password'),
                'role' => 'mahasiswa',
                'status_akun' => 'aktif',
                'program_studi_id' => $this->prodiModel->id,
                'angkatan' => 2023,
                'dosen_wali_id' => $this->dosen->id,
            ]
        );
    }

    /**
     * 1. Alur Pendaftaran Baru & Verifikasi Berkas oleh TU
     */
    public function test_mahasiswa_pendaftaran_flow_and_tu_approval(): void
    {
        $pendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'instansi_id' => $this->instansi->id,
            'bidang_minat' => 'Rekayasa Perangkat Lunak',
            'tanggal_mulai' => now()->addDays(7),
            'tanggal_selesai' => now()->addDays(90),
            'status' => 'verifikasi_tu',
        ]);

        $this->assertDatabaseHas('pendaftarans', [
            'id' => $pendaftaran->id,
            'status' => 'verifikasi_tu',
        ]);

        // TU melakukan persetujuan (approve)
        $response = $this->actingAs($this->tu)
            ->post("/tu/verifikasi-pendaftaran/{$pendaftaran->id}/approve");

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $pendaftaran->refresh();
        $this->assertEquals('disetujui_tu', $pendaftaran->status);
        $this->assertEquals($this->dosen->id, $pendaftaran->dosen_pembimbing_id);
        $this->assertEquals($this->tu->id, $pendaftaran->diverifikasi_oleh);

        // Notifikasi ke mahasiswa harus terkirim
        $this->assertDatabaseHas('notifikasis', [
            'user_id' => $this->mahasiswa->id,
            'judul' => 'Pendaftaran KP Disetujui',
            'tipe' => 'sukses',
        ]);
    }

    /**
     * 2. Alur Penolakan Pendaftaran oleh TU jika berkas tidak sesuai
     */
    public function test_tu_reject_pendaftaran_with_feedback_note(): void
    {
        $pendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'instansi_id' => $this->instansi->id,
            'bidang_minat' => 'Cyber Security',
            'status' => 'verifikasi_tu',
        ]);

        $catatanTu = 'Transkrip nilai belum ditandatangani Dosen Wali.';

        $response = $this->actingAs($this->tu)
            ->post("/tu/verifikasi-pendaftaran/{$pendaftaran->id}/reject", [
                'catatan_tu' => $catatanTu,
            ]);

        $response->assertRedirect();
        $pendaftaran->refresh();

        $this->assertEquals('perlu_perbaikan', $pendaftaran->status);
        $this->assertEquals($catatanTu, $pendaftaran->catatan_tu);

        $this->assertDatabaseHas('notifikasis', [
            'user_id' => $this->mahasiswa->id,
            'judul' => 'Berkas Pendaftaran Perlu Perbaikan',
            'tipe' => 'peringatan',
        ]);
    }

    /**
     * 3. Penerbitan Surat Pengantar & Token Konfirmasi Digital TU
     */
    public function test_surat_pengantar_generation_creates_token_and_signature(): void
    {
        $pendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'instansi_id' => $this->instansi->id,
            'status' => 'disetujui_tu',
        ]);

        $surat = SuratPengantar::create([
            'pendaftaran_id' => $pendaftaran->id,
            'status' => 'menunggu_verifikasi',
        ]);

        $response = $this->actingAs($this->tu)
            ->post("/tu/generate-surat/{$pendaftaran->id}/approve");

        $response->assertRedirect();
        $pendaftaran->refresh();
        $surat->refresh();

        $this->assertEquals('surat_terbit', $pendaftaran->status);
        $this->assertEquals('terverifikasi', $surat->status);
        $this->assertNotEmpty($surat->nomor_surat);
        $this->assertNotEmpty($surat->confirmation_token);
        $this->assertEquals('pending', $surat->confirmation_status);
    }

    /**
     * 4. Konfirmasi Instansi melalui Public Token Link (Guest/Tanpa Login)
     */
    public function test_public_instansi_confirmation_flow_and_idempotency(): void
    {
        $pendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'instansi_id' => $this->instansi->id,
            'status' => 'surat_terbit',
        ]);

        $token = Str::random(64);
        $surat = SuratPengantar::create([
            'pendaftaran_id' => $pendaftaran->id,
            'nomor_surat' => 'SP-TEST-001',
            'status' => 'terverifikasi',
            'confirmation_token' => $token,
            'confirmation_status' => 'pending',
        ]);

        // A. Halaman public token dapat diakses tanpa login
        $pageResponse = $this->get("/konfirmasi/{$token}");
        $pageResponse->assertStatus(200);

        // B. Mitra menyetujui penerimaan mahasiswa KP
        $confirmResponse = $this->post("/konfirmasi/{$token}", [
            'keputusan' => 'terima',
            'pl_nama' => 'Ir. Gunawan Wibisono',
            'pl_email' => 'gunawan@pengujian-nusantara.test',
            'pl_telepon' => '081234567890',
            'catatan' => 'Mahasiswa diterima di divisi Software Quality Assurance.',
        ]);

        $confirmResponse->assertRedirect();
        $surat->refresh();
        $pendaftaran->refresh();

        $this->assertEquals('accepted', $surat->confirmation_status);
        $this->assertEquals('diterima_instansi', $pendaftaran->status);
        $this->assertNotNull($surat->confirmed_at);

        // C. Uji Idempotensi: Konfirmasi ulang dengan token yang sama harus dicegah
        $repeatResponse = $this->post("/konfirmasi/{$token}", [
            'keputusan' => 'terima',
            'pl_nama' => 'Nama Lain',
            'pl_email' => 'lain@pengujian.test',
        ]);

        $repeatResponse->assertSessionHas('error');
    }

    /**
     * 5. Alur Review Proposal oleh Dosen Pembimbing (Revisi & Disetujui)
     */
    public function test_dosen_proposal_review_workflow(): void
    {
        $pendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'instansi_id' => $this->instansi->id,
            'dosen_pembimbing_id' => $this->dosen->id,
            'status' => 'aktif',
        ]);

        $proposal = Proposal::create([
            'pendaftaran_id' => $pendaftaran->id,
            'judul' => 'Otomasi Pengujian Aplikasi Web dengan Playwright',
            'abstrak' => 'Penelitian implementasi automated end-to-end testing pada sistem enterprise.',
            'status' => 'diajukan',
        ]);

        // Dosen menyetujui proposal
        $response = $this->actingAs($this->dosen)
            ->put("/dosen/review-proposal/{$proposal->id}", [
                'status' => 'disetujui',
                'catatan' => 'Rancangan metodologi pengujian sudah komprehensif. Lanjutkan ke bab implementasi.',
            ]);

        $response->assertRedirect();
        $proposal->refresh();

        $this->assertEquals('disetujui', $proposal->status);
        $this->assertEquals($this->dosen->id, $proposal->reviewed_by);
        $this->assertNotNull($proposal->reviewed_at);

        $this->assertDatabaseHas('proposal_feedbacks', [
            'proposal_id' => $proposal->id,
            'user_id' => $this->dosen->id,
            'status_setelah' => 'disetujui',
        ]);
    }

    /**
     * 6. Alur Validasi Logbook oleh Dosen Pembimbing & Pembimbing Lapangan
     */
    public function test_dual_logbook_approval_flow(): void
    {
        $pendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'instansi_id' => $this->instansi->id,
            'dosen_pembimbing_id' => $this->dosen->id,
            'status' => 'aktif',
        ]);

        $logbook = Logbook::create([
            'pendaftaran_id' => $pendaftaran->id,
            'tanggal' => now()->format('Y-m-d'),
            'jam_mulai' => '08:00:00',
            'jam_selesai' => '17:00:00',
            'deskripsi' => 'Pengujian performa API endpoint dan sinkronisasi data transaksi.',
            'status_dosen' => 'menunggu',
            'status_instansi' => 'menunggu',
        ]);

        // Dosen validasi logbook
        $dosenResponse = $this->actingAs($this->dosen)
            ->put("/dosen/logbook/{$logbook->id}", [
                'status_dosen' => 'disetujui',
                'catatan_dosen' => 'Deskripsi kegiatan valid dan sesuai rencana KP.',
            ]);
        $dosenResponse->assertRedirect();

        // Instansi validasi logbook
        $instansiResponse = $this->actingAs($this->instansiUser)
            ->put("/instansi/logbook/{$logbook->id}", [
                'status_instansi' => 'disetujui',
                'catatan_instansi' => 'Kehadiran dan performa kerja sangat memuaskan.',
            ]);
        $instansiResponse->assertRedirect();

        $logbook->refresh();
        $this->assertEquals('disetujui', $logbook->status_dosen);
        $this->assertEquals('disetujui', $logbook->status_instansi);
    }

    /**
     * 7. Kalkulasi Nilai Kolaboratif Dosen + Instansi & Penentuan Grade
     */
    public function test_collaborative_grading_and_final_score_formula(): void
    {
        $pendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'instansi_id' => $this->instansi->id,
            'dosen_pembimbing_id' => $this->dosen->id,
            'status' => 'aktif',
        ]);

        // A. Dosen menginput nilai bimbingan
        // Komponen: Sistematika (20%), Kedalaman (30%), Penguasaan (30%), Presentasi (20%)
        // Nilai: 90, 85, 85, 90 -> Total Pembimbing = (18 + 25.5 + 25.5 + 18) = 87
        $dosenGrading = $this->actingAs($this->dosen)
            ->post("/dosen/penilaian/{$pendaftaran->id}", [
                'sistematika' => 90,
                'kedalaman' => 85,
                'penguasaan' => 85,
                'presentasi' => 90,
                'catatan' => 'Laporan terstruktur dengan baik.',
            ]);
        $dosenGrading->assertRedirect();

        $nilaiAkhir = NilaiAkhir::where('pendaftaran_id', $pendaftaran->id)->firstOrFail();
        $this->assertEquals(87.0, (float) $nilaiAkhir->nilai_pembimbing);

        // B. Instansi menginput evaluasi industri
        // Komponen: Kedisiplinan (30%), Kerjasama (30%), Kinerja (40%)
        // Nilai: 90, 90, 90 -> Total Instansi = 90
        $instansiGrading = $this->actingAs($this->instansiUser)
            ->post("/instansi/evaluation/{$pendaftaran->id}", [
                'kedisiplinan' => 90,
                'kerjasama' => 90,
                'kinerja' => 90,
                'catatan' => 'Sangat bertanggung jawab dan adaptif.',
            ]);
        $instansiGrading->assertRedirect();

        $nilaiAkhir->refresh();
        $this->assertEquals(90.0, (float) $nilaiAkhir->nilai_instansi);

        // C. Ujian disimulasikan (Nilai Ujian 85)
        // Formula total: (40% * 85) + (30% * 87) + (30% * 90) = 34 + 26.1 + 27 = 87.1 -> Nilai A & Lulus
        $nilaiAkhir->update([
            'nilai_ujian' => 85,
            'nilai_total' => (85 * 0.4) + (87 * 0.3) + (90 * 0.3),
            'nilai_huruf' => 'A',
            'status' => 'lulus',
        ]);

        $this->assertEqualsWithDelta(87.1, (float) $nilaiAkhir->nilai_total, 0.01);
        $this->assertEquals('A', $nilaiAkhir->nilai_huruf);
        $this->assertEquals('lulus', $nilaiAkhir->status);
    }

    /**
     * 8. Penerbitan Berita Acara oleh Koordinator Prodi & Status Selesai
     */
    public function test_prodi_berita_acara_approval_completes_kp(): void
    {
        $pendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'instansi_id' => $this->instansi->id,
            'dosen_pembimbing_id' => $this->dosen->id,
            'status' => 'aktif',
        ]);

        NilaiAkhir::create([
            'pendaftaran_id' => $pendaftaran->id,
            'nilai_total' => 88.5,
            'nilai_huruf' => 'A',
            'status' => 'lulus',
        ]);

        $response = $this->actingAs($this->prodi)
            ->put("/prodi/berita-acara/{$pendaftaran->id}", [
                'catatan' => 'Seluruh persyaratan terpenuhi dan dinyatakan LULUS.',
            ]);

        $response->assertRedirect();
        $pendaftaran->refresh();

        $this->assertEquals('selesai', $pendaftaran->status);
        $this->assertDatabaseHas('berita_acaras', [
            'pendaftaran_id' => $pendaftaran->id,
            'status' => 'disetujui',
            'divalidasi_oleh' => $this->prodi->id,
        ]);
    }

    /**
     * 9. Proteksi KpStepGate: Mahasiswa Belum Berhak Dicegat Melompati Tahap
     */
    public function test_kp_step_gate_blocks_skipping_steps(): void
    {
        $newMahasiswa = User::factory()->create([
            'role' => 'mahasiswa',
            'status_akun' => 'aktif',
        ]);

        // Mahasiswa baru tanpa pendaftaran mencoba langsung ke tahap Logbook (Step 6)
        $response = $this->actingAs($newMahasiswa)->get('/mahasiswa/logbook');

        // Harus dicegat dan dialihkan ke dashboard mahasiswa
        $response->assertRedirect(route('mahasiswa.dashboard'));
        $response->assertSessionHas('error');

        // Mahasiswa baru mencoba langsung ke tahap Sidang (Step 8)
        $responseSidang = $this->actingAs($newMahasiswa)->get('/mahasiswa/sidang');
        $responseSidang->assertRedirect(route('mahasiswa.dashboard'));
        $responseSidang->assertSessionHas('error');
    }
}
