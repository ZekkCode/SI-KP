<?php

namespace App\Http\Requests\Mahasiswa;

use Illuminate\Foundation\Http\FormRequest;

class StoreProposalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'mahasiswa';
    }

    public function rules(): array
    {
        return [
            'judul' => ['required', 'string', 'max:255'],
            'abstrak' => ['nullable', 'string', 'max:5000'],
            'file_proposal' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'judul.required' => 'Judul proposal wajib diisi.',
            'judul.max' => 'Judul proposal maksimal 255 karakter.',
            'abstrak.max' => 'Abstrak maksimal 5000 karakter.',
            'file_proposal.mimes' => 'File proposal harus berformat PDF.',
            'file_proposal.max' => 'Ukuran file proposal maksimal 5MB.',
        ];
    }
}
