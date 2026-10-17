<?php

namespace Tests\Feature;

use App\Mail\KredensialPembimbingLapangan;
use App\Models\Instansi;
use App\Models\NilaiAkhir;
use App\Models\Pendaftaran;
use App\Models\Proposal;
use App\Models\SuratPengantar;
use App\Models\User;
use App\Services\PembimbingLapanganService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class CodeQualityEdgeCasesTest extends TestCase
{
    use RefreshDatabase;

    protected User $mahasiswa;
    protected User $dosen;
    protected User $tu;
    protected User $prodi;
    protected User $instansiUser;
    protected Instansi $instansi;

    protected function setUp(): void
    {
        parent::setUp();

        $this->instansi = Instansi::create([
            'nama' => 'PT Pengujian Kualitas Sistem',
            'alamat' => 'Jl. Pengujian No. 99, Surabaya',
            'kota' => 'Surabaya',
        ]);

        $this->dosen = User::factory()->create([
            'role' => 'dosen',
            'status_akun' => 'aktif',
            'nip' => '198501012010121001',
        ]);

        $this->mahasiswa = User::factory()->create([
            'role' => 'mahasiswa',
            'status_akun' => 'aktif',
            'nim' => '230411100999',
            'dosen_wali_id' => $this->dosen->id,
        ]);

        $this->tu = User::factory()->create([
            'role' => 'tu',
            'status_akun' => 'aktif',
        ]);

        $this->prodi = User::factory()->create([
            'role' => 'prodi',
            'status_akun' => 'aktif',
        ]);

        $this->instansiUser = User::factory()->create([
            'role' => 'instansi',
            'status_akun' => 'aktif',
        ]);
        $this->instansiUser->pembimbingLapangan()->create([
            'instansi_id' => $this->instansi->id,
            'nama' => 'Pembimbing Lapangan Uji',
            'email' => $this->instansiUser->email,
        ]);
    }

    /**
     * 1. PembimbingLapanganService: Null nama_instansi pada surat_pengantars tidak menyebabkan TypeError.
     */
    public function test_pembimbing_lapangan_confirmation_handles_null_surat_nama_instansi(): void
    {
        Mail::fake();

        $pendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'instansi_id' => $this->instansi->id,
            'status' => 'surat_terbit',
        ]);

        // Surat pengantar sengaja dibuat dengan nama_instansi null untuk menguji fallback
        $surat = SuratPengantar::create([
            'pendaftaran_id' => $pendaftaran->id,
            'nama_instansi' => null,
            'alamat_instansi' => null,
            'status' => 'terverifikasi',
            'confirmation_token' => 'token-edge-case-12345',
            'confirmation_status' => 'pending',
        ]);

        $service = app(PembimbingLapanganService::class);
        $result = $service->konfirmasiPenerimaan($surat, [
            'keputusan' => 'terima',
            'pl_nama' => 'Ir. Gunawan',
            'pl_email' => 'gunawan@pengujian.test',
            'pl_telepon' => '081234567890',
        ]);

        $this->assertTrue($result['success']);
        $this->assertEquals('accepted', $result['decision']);

        Mail::assertSent(KredensialPembimbingLapangan::class, function ($mail) {
            return $mail->hasTo('gunawan@pengujian.test') &&
                   !empty($mail->namaInstansi);
        });
    }

    /**
     * 2. Dosen & Instansi Monitoring mengekspos proposal path_file & file_path dengan benar.
     */
    public function test_monitoring_proposal_path_file_is_populated(): void
    {
        $pendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'instansi_id' => $this->instansi->id,
            'dosen_pembimbing_id' => $this->dosen->id,
            'pembimbing_lapangan_id' => $this->instansiUser->pembimbingLapangan->id,
            'status' => 'aktif',
        ]);

        $proposal = Proposal::create([
            'pendaftaran_id' => $pendaftaran->id,
            'judul' => 'Sistem Rekomendasi Edge Case',
            'abstrak' => 'Abstrak pengujian',
            'path_file' => 'proposal/test_edge_case.pdf',
            'status' => 'disetujui',
        ]);

        // Dosen monitoring
        $responseDosen = $this->actingAs($this->dosen)->get('/dosen/monitoring');
        $responseDosen->assertOk();
        $responseDosen->assertInertia(fn ($page) => $page
            ->component('Dosen/Monitoring')
            ->has('mahasiswas.0.proposal', fn ($prop) => $prop
                ->where('file_path', 'proposal/test_edge_case.pdf')
                ->where('path_file', 'proposal/test_edge_case.pdf')
                ->etc()
            )
        );

        // Instansi monitoring
        $responseInstansi = $this->actingAs($this->instansiUser)->get('/instansi/monitoring');
        $responseInstansi->assertOk();
        $responseInstansi->assertInertia(fn ($page) => $page
            ->component('Instansi/Monitoring')
            ->has('mahasiswas.0.proposal', fn ($prop) => $prop
                ->where('file_path', 'proposal/test_edge_case.pdf')
                ->where('path_file', 'proposal/test_edge_case.pdf')
                ->etc()
            )
        );
    }

    /**
     * 3. TU Approve Surat Pengantar menangani pendaftaran yang belum memiliki relasi surat_pengantar.
     */
    public function test_tu_approve_surat_pengantar_creates_record_if_initially_missing(): void
    {
        $pendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'instansi_id' => $this->instansi->id,
            'status' => 'disetujui_tu',
        ]);

        $response = $this->actingAs($this->tu)->post("/tu/generate-surat/{$pendaftaran->id}/approve");
        $response->assertRedirect();

        $pendaftaran->refresh();
        $this->assertEquals('surat_terbit', $pendaftaran->status);
        $this->assertNotNull($pendaftaran->suratPengantar);
        $this->assertEquals('terverifikasi', $pendaftaran->suratPengantar->status);
        $this->assertNotEmpty($pendaftaran->suratPengantar->verification_id);
    }

    /**
     * 4. Multi-registration: MahasiswaProposalController mengikat proposal ke pendaftaran terbaru.
     */
    public function test_mahasiswa_proposal_attaches_to_latest_pendaftaran(): void
    {
        // Pendaftaran lama ditolak
        $oldPendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'instansi_id' => $this->instansi->id,
            'status' => 'ditolak_instansi',
            'created_at' => now()->subMonths(6),
        ]);

        // Pendaftaran baru aktif
        $activePendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'instansi_id' => $this->instansi->id,
            'status' => 'diterima_instansi',
            'created_at' => now(),
        ]);

        $response = $this->actingAs($this->mahasiswa)->post('/mahasiswa/proposal', [
            'judul' => 'Judul Proposal Pada Pendaftaran Aktif',
            'abstrak' => 'Abstrak proposal pada pendaftaran terbaru.',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('proposals', [
            'pendaftaran_id' => $activePendaftaran->id,
            'judul' => 'Judul Proposal Pada Pendaftaran Aktif',
        ]);

        $this->assertDatabaseMissing('proposals', [
            'pendaftaran_id' => $oldPendaftaran->id,
        ]);
    }

    /**
     * 5. Kalkulasi Nilai Akhir: Ketika Dosen dan Instansi memberi nilai, total & status lulus terhitung otomatis.
     */
    public function test_final_grade_automatically_computes_total_and_status(): void
    {
        $pendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'instansi_id' => $this->instansi->id,
            'dosen_pembimbing_id' => $this->dosen->id,
            'pembimbing_lapangan_id' => $this->instansiUser->pembimbingLapangan->id,
            'status' => 'aktif',
        ]);

        // 1. Instansi memberikan nilai (80)
        $this->actingAs($this->instansiUser)->post("/instansi/evaluation/{$pendaftaran->id}", [
            'kedisiplinan' => 80,
            'kerjasama' => 80,
            'kinerja' => 80,
            'catatan' => 'Baik',
        ]);

        // 2. Dosen memberikan nilai (90)
        $this->actingAs($this->dosen)->post("/dosen/penilaian/{$pendaftaran->id}", [
            'sistematika' => 90,
            'kedalaman' => 90,
            'penguasaan' => 90,
            'presentasi' => 90,
            'catatan' => 'Sangat memuaskan',
        ]);

        $nilaiAkhir = NilaiAkhir::where('pendaftaran_id', $pendaftaran->id)->first();
        $this->assertNotNull($nilaiAkhir);
        $this->assertNotNull($nilaiAkhir->nilai_total, 'Nilai total harus terhitung otomatis tanpa macet di null.');
        $this->assertEquals('A', $nilaiAkhir->nilai_huruf);
        $this->assertEquals('lulus', $nilaiAkhir->status);
    }

    /**
     * 6. Prodi Mahasiswa Index memuat pendaftaran setiap mahasiswa tanpa limit(1) global.
     */
    public function test_prodi_mahasiswa_index_loads_all_students_latest_pendaftaran(): void
    {
        $mhs2 = User::factory()->create([
            'role' => 'mahasiswa',
            'status_akun' => 'aktif',
            'nim' => '230411100998',
        ]);

        $p1 = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'status' => 'aktif',
        ]);

        $p2 = Pendaftaran::create([
            'mahasiswa_id' => $mhs2->id,
            'status' => 'aktif',
        ]);

        $response = $this->actingAs($this->prodi)->get('/prodi/mahasiswa');
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Prodi/Students')
            ->has('initialStudents', 2)
            ->where('initialStudents.0.status', 'Sedang KP')
            ->where('initialStudents.1.status', 'Sedang KP')
        );
    }
}
