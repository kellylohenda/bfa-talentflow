<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\AbsenceTipo;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAbsenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isStaff();
    }

    public function rules(): array
    {
        return [
            'talent_id' => ['required', 'integer', 'exists:talents,id'],
            'tipo' => ['required', Rule::enum(AbsenceTipo::class)],
            'date_start' => ['required', 'date'],
            'date_end' => ['required', 'date', 'after_or_equal:date_start'],
            'motivo' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'talent_id.required' => 'O talento é obrigatório.',
            'tipo.required' => 'O tipo de falta é obrigatório.',
            'tipo.enum' => 'Tipo de falta inválido.',
            'date_start.required' => 'A data de início é obrigatória.',
            'date_end.required' => 'A data de fim é obrigatória.',
            'date_end.after_or_equal' => 'A data de fim deve ser igual ou posterior à data de início.',
        ];
    }
}
