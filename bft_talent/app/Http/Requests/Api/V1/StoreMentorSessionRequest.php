<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\Formato;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMentorSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isMentor() || $this->user()->isRh();
    }

    public function rules(): array
    {
        return [
            'talent_id' => ['required', 'integer', 'exists:talents,id'],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'duracao_min' => ['nullable', 'integer', 'min:15', 'max:480'],
            'formato' => ['nullable', Rule::enum(Formato::class)],
            'notas' => ['nullable', 'string', 'max:2000'],
            'accoes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'talent_id.required' => 'O talento é obrigatório.',
            'scheduled_at.required' => 'A data/hora é obrigatória.',
            'scheduled_at.after' => 'A sessão deve ser agendada para o futuro.',
            'duracao_min.min' => 'A duração mínima é 15 minutos.',
            'formato.enum' => 'Formato inválido.',
        ];
    }
}
