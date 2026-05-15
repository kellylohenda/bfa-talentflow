<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\PresencaStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePresencaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isStaff();
    }

    public function rules(): array
    {
        return [
            'talent_id' => ['required', 'integer', 'exists:talents,id'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'data' => ['required', 'date'],
            'status' => ['required', Rule::enum(PresencaStatus::class)],
            'hora_entrada' => ['nullable', 'date_format:H:i'],
            'hora_saida' => ['nullable', 'date_format:H:i', 'after:hora_entrada'],
            'observacoes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'talent_id.required' => 'O talento é obrigatório.',
            'data.required' => 'A data é obrigatória.',
            'status.required' => 'O estado de presença é obrigatório.',
            'status.enum' => 'Estado de presença inválido.',
            'hora_entrada.date_format' => 'A hora de entrada deve estar no formato HH:MM.',
            'hora_saida.date_format' => 'A hora de saída deve estar no formato HH:MM.',
            'hora_saida.after' => 'A hora de saída deve ser posterior à hora de entrada.',
        ];
    }
}
