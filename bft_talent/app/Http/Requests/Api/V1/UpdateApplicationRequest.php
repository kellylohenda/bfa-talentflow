<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isRh();
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'university_id' => ['nullable', 'integer', 'exists:universities,id'],
            'score' => ['nullable', 'integer', 'min:0', 'max:100'],
            'observacoes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.email' => 'O e-mail deve ser um endereço válido.',
            'score.min' => 'A pontuação não pode ser negativa.',
            'score.max' => 'A pontuação máxima é 100.',
        ];
    }
}
