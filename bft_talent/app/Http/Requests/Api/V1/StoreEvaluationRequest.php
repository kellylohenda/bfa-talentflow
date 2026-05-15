<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreEvaluationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->canManageTalents();
    }

    public function rules(): array
    {
        return [
            'talent_id' => ['required', 'integer', 'exists:talents,id'],
            'program_id' => ['required', 'integer', 'exists:programs,id'],
            'period' => ['required', 'string', 'max:10'],
            'tipo' => ['nullable', 'string', 'in:mensal,trimestral,semestral,anual'],
            'score' => ['required', 'integer', 'min:0', 'max:100'],
            'pontos_fortes' => ['nullable', 'string', 'max:2000'],
            'areas_melhoria' => ['nullable', 'string', 'max:2000'],
            'comentarios' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'talent_id.required' => 'O talento é obrigatório.',
            'program_id.required' => 'O programa é obrigatório.',
            'period.required' => 'O período é obrigatório.',
            'score.required' => 'A pontuação é obrigatória.',
            'score.min' => 'A pontuação não pode ser negativa.',
            'score.max' => 'A pontuação máxima é 100.',
        ];
    }
}
