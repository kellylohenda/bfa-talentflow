<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreVolunteerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isRh();
    }

    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:volunteers,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'area_actuacao' => ['nullable', 'string', 'max:60'],
            'mentor_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'data_inicio' => ['nullable', 'date'],
            'motivacao' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'O nome é obrigatório.',
            'email.required' => 'O e-mail é obrigatório.',
            'email.unique' => 'Este e-mail já está registado como voluntário.',
        ];
    }
}
