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
        return [
            'nama_instansi' => ['required', 'string', 'max:255'],
            'alamat_instansi' => ['required', 'string', 'max:1000'],
            'tanggal_mulai' => ['required', 'date', 'after_or_equal:2020-01-01'],
            'tanggal_selesai' => ['required', 'date', 'after:tanggal_mulai'],
            'krs_file' => ['required', 'file', 'mimes:pdf', 'max:2048'],
            'transkrip_file' => ['required', 'file', 'mimes:pdf', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama_instansi.required' => 'Nama instansi wajib diisi.',
            'alamat_instansi.required' => 'Alamat instansi wajib diisi.',
            'tanggal_mulai.required' => 'Tanggal mulai wajib diisi.',
            'tanggal_mulai.after_or_equal' => 'Tanggal mulai tidak boleh di masa lalu.',
            'tanggal_selesai.required' => 'Tanggal selesai wajib diisi.',
            'tanggal_selesai.after' => 'Tanggal selesai harus setelah tanggal mulai.',
            'krs_file.required' => 'File KRS wajib diunggah.',
            'krs_file.mimes' => 'File KRS harus berformat PDF.',
            'krs_file.max' => 'Ukuran file KRS maksimal 2MB.',
            'transkrip_file.required' => 'File transkrip wajib diunggah.',
            'transkrip_file.mimes' => 'File transkrip harus berformat PDF.',
            'transkrip_file.max' => 'Ukuran file transkrip maksimal 2MB.',
        ];
    }
}
