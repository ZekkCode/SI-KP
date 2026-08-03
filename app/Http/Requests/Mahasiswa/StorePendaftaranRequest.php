<?php

namespace App\Http\Requests\Mahasiswa;

use Illuminate\Foundation\Http\FormRequest;

class StorePendaftaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'mahasiswa';
    }

    public function rules(): array
    {
        $user = $this->user();
        $pendaftaran = \App\Models\Pendaftaran::where('mahasiswa_id', $user->id)
            ->with('dokumenPendaftarans')
            ->latest()
            ->first();

        $transkripUploaded = $pendaftaran && $pendaftaran->dokumenPendaftarans->where('jenis', 'transkrip')->isNotEmpty();

        return [
            'name' => ['required', 'string', 'max:255'],
            'no_telepon' => ['required', 'string', 'max:20'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'semester' => ['required', 'string', 'max:50'],
            'total_sks' => ['required', 'integer', 'min:100'],
            'ipk' => ['required', 'numeric', 'between:0.00,4.00'],
            'transkrip_file' => [$transkripUploaded ? 'nullable' : 'required', 'file', 'mimes:pdf', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'no_telepon.required' => 'Nomor WhatsApp wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan oleh pengguna lain.',
            'semester.required' => 'Semester wajib diisi.',
            'total_sks.required' => 'Total SKS wajib diisi.',
            'total_sks.integer' => 'Total SKS harus berupa angka.',
            'total_sks.min' => 'Total SKS minimal adalah 100 SKS untuk mendaftar.',
            'ipk.required' => 'IPK wajib diisi.',
            'ipk.numeric' => 'IPK harus berupa angka.',
            'ipk.between' => 'IPK harus bernilai antara 0.00 dan 4.00.',
            'transkrip_file.required' => 'File transkrip wajib diunggah.',
            'transkrip_file.mimes' => 'File transkrip harus berformat PDF.',
            'transkrip_file.max' => 'Ukuran file transkrip maksimal 2MB.',
        ];
    }
}
