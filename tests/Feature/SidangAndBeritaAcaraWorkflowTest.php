<?php

namespace Tests\Feature;

use App\Models\DokumenAkhir;
use App\Models\Logbook;
use App\Models\NilaiAkhir;
use App\Models\Pendaftaran;
use App\Models\Sidang;
use App\Models\User;
use App\Services\SidangEligibilityService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SidangAndBeritaAcaraWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected User $mahasiswa;
    protected User $dosen;
    protected User $prodi;
    protected Pendaftaran $pendaftaran;

    protected function setUp(): void
    {
        parent::setUp();

        $this->mahasiswa = User::factory()->create([
            'role' => 'mahasiswa',
            'name' => 'Nabiilah Rizqi Amalia',
            'nim' => '230411100092',
        ]);

        $this->dosen = User::factory()->create([
            'role' => 'dosen',
            'name' => 'Rika Yunitarini, S.T., M.T.',
            'nip' => '198001012005012001',
        ]);

        $this->prodi = User::factory()->create([
            'role' => 'prodi',
            'name' => 'Koordinator KP',
        ]);

        $instansi = \App\Models\Instansi::create([
            'nama' => 'PT Petrokimia Gresik',
            'kota' => 'Gresik',
            'alamat' => 'Jl. Jend. A. Yani, Gresik',
        ]);

        $this->pendaftaran = Pendaftaran::create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'dosen_pembimbing_id' => $this->dosen->id,
            'instansi_id' => $instansi->id,
            'status' => 'aktif',
        ]);
    }

    /**
     * Test 1: Mahasiswa memenuhi syarat sidang (Logbook & Laporan selesai),
     * walaupun Nilai Evaluasi PL belum masuk.
     */
    public function test_student_eligible_for_sidang_without_pl_grade(): void
    {
        Logbook::create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'tanggal' => now(),
            'deskripsi' => 'Aktivitas KP Hari 1',
            'status_dosen' => 'disetujui',
        ]);

        DokumenAkhir::create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'jenis' => 'laporan_akhir',
            'nama_file' => 'Laporan_Akhir_KP.pdf',
            'path' => 'dokumen/laporan_akhir.pdf',
        ]);

        $eligibilityService = app(SidangEligibilityService::class);
        $eligibility = $eligibilityService->checkEligibility($this->pendaftaran);

        $this->assertTrue($eligibility['eligible'], 'Mahasiswa harus eligible mendaftar sidang.');
        $this->assertEmpty($eligibility['missing'], 'Missing requirements harus kosong.');

        // Status nilai instansi ditandai optional
        $reqNilai = collect($eligibility['requirements'])->firstWhere('key', 'nilai_instansi');
        $this->assertNotNull($reqNilai);
        $this->assertTrue($reqNilai['is_optional']);
    }

    /**
     * Test 2: Mahasiswa mengajukan sidang via POST /mahasiswa/sidang
     */
    public function test_student_can_submit_sidang_request(): void
    {
        Logbook::create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'tanggal' => now(),
            'deskripsi' => 'Aktivitas KP Hari 1',
            'status_dosen' => 'disetujui',
        ]);

        DokumenAkhir::create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'jenis' => 'laporan_akhir',
            'nama_file' => 'Laporan_Akhir_KP.pdf',
            'path' => 'dokumen/laporan_akhir.pdf',
        ]);

        $response = $this->actingAs($this->mahasiswa)->post(route('mahasiswa.sidang.store'), [
            'catatan' => 'Mohon dijadwalkan pada hari Kamis jika memungkinkan.',
        ]);

        $response->assertRedirect(route('mahasiswa.sidang'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('sidangs', [
            'pendaftaran_id' => $this->pendaftaran->id,
            'status' => 'diajukan',
            'catatan' => 'Mohon dijadwalkan pada hari Kamis jika memungkinkan.',
        ]);
    }

    /**
     * Test 3: Koordinator KP menetapkan hari, waktu, dan ruangan sidang,
     * lalu mahasiswa menerima data rincian hari & waktu.
     */
    public function test_coordinator_schedules_sidang_and_student_sees_schedule(): void
    {
        Logbook::create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'tanggal' => now(),
            'deskripsi' => 'Aktivitas KP Hari 1',
            'status_dosen' => 'disetujui',
        ]);

        DokumenAkhir::create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'jenis' => 'laporan_akhir',
            'nama_file' => 'Laporan_Akhir_KP.pdf',
            'path' => 'dokumen/laporan_akhir.pdf',
        ]);

        $sidang = Sidang::create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'status' => 'diajukan',
            'dosen_penguji_id' => $this->dosen->id,
        ]);

        $targetDate = Carbon::parse('2026-10-24 09:30:00');

        // Koordinator menetapkan jadwal
        $response = $this->actingAs($this->prodi)->post(route('prodi.sidang.jadwalkan', $sidang->id), [
            'tanggal' => $targetDate->format('Y-m-d'),
            'jam' => $targetDate->format('H:i'),
            'ruangan' => 'Ruang Sidang Jurusan TI',
            'catatan' => 'Hadir 15 menit sebelum dimulai berpakaian kemeja putih dan jas almamater.',
        ]);

        $response->assertSessionHas('success');

        $sidang->refresh();
        $this->assertEquals('dijadwalkan', $sidang->status);
        $this->assertEquals('Ruang Sidang Jurusan TI', $sidang->ruangan);

        // Mahasiswa melihat rincian di controller /mahasiswa/sidang
        $mahasiswaResponse = $this->actingAs($this->mahasiswa)->get(route('mahasiswa.sidang'));
        $mahasiswaResponse->assertOk();
        $mahasiswaResponse->assertInertia(fn ($page) => $page
            ->component('Mahasiswa/Sidang')
            ->where('sidang.status', 'dijadwalkan')
            ->where('sidang.ruangan', 'Ruang Sidang Jurusan TI')
            ->has('sidang.hari')
            ->has('sidang.jam')
            ->has('sidang.tanggal_formatted')
        );
    }

    /**
     * Test 4: Berita Acara otomatis aktif dan dapat dicetak langsung setelah Dosen Pembimbing selesai menilai
     */
    public function test_berita_acara_activates_after_dosen_grades(): void
    {
        Logbook::create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'tanggal' => now(),
            'deskripsi' => 'Aktivitas KP Hari 1',
            'status_dosen' => 'disetujui',
        ]);

        DokumenAkhir::create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'jenis' => 'laporan_akhir',
            'nama_file' => 'Laporan_Akhir_KP.pdf',
            'path' => 'dokumen/laporan_akhir.pdf',
        ]);

        $sidang = Sidang::create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'status' => 'selesai',
            'dosen_penguji_id' => $this->dosen->id,
        ]);

        $this->pendaftaran->update(['status' => 'selesai']);

        // Sebelum Dosen menilai
        $responseBefore = $this->actingAs($this->mahasiswa)->get(route('mahasiswa.berita-acara'));
        $responseBefore->assertOk();
        $responseBefore->assertInertia(fn ($page) => $page
            ->component('Mahasiswa/BeritaAcara')
            ->where('dosenSudahMenilai', false)
        );

        // Dosen menginput nilai akhir
        NilaiAkhir::create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'nilai_pembimbing' => 88.5,
            'nilai_instansi' => 85.0,
            'nilai_total' => 86.75,
            'nilai_huruf' => 'A',
            'status' => 'lulus',
        ]);

        // Setelah Dosen menilai: berita acara otomatis aktif
        $responseAfter = $this->actingAs($this->mahasiswa)->get(route('mahasiswa.berita-acara'));
        $responseAfter->assertOk();
        $responseAfter->assertInertia(fn ($page) => $page
            ->component('Mahasiswa/BeritaAcara')
            ->where('dosenSudahMenilai', true)
        );

        // Mahasiswa dapat mencetak/mengunduh Form KP-5
        $cetakResponse = $this->actingAs($this->mahasiswa)->get(route('mahasiswa.berita-acara.cetak', $this->pendaftaran->id));
        $cetakResponse->assertOk();
        $cetakResponse->assertViewIs('cetak.berita-acara');
        $cetakResponse->assertSee('BERITA ACARA');
        $cetakResponse->assertSee('Nabiilah Rizqi Amalia');
        $cetakResponse->assertSee('PT Petrokimia Gresik');
    }
}
