<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isRh();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:applications,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'program_id' => ['required', 'integer', 'exists:programs,id'],
            'university_id' => ['nullable', 'integer', 'exists:universities,id'],
            'tipo' => ['nullable', 'string', 'in:bolseiro,estagiario'],
            'observacoes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome é obrigatório.',
            'email.required' => 'O e-mail é obrigatório.',
            'email.email' => 'O e-mail deve ser um endereço válido.',
            'program_id.required' => 'O programa é obrigatório.',
            'program_id.exists' => 'O programa seleccionado não existe.',
            'university_id.exists' => 'A universidade seleccionada não existe.',
        ];
    }
}
