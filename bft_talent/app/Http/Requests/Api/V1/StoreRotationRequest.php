<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreRotationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->canManageTalents();
    }

    public function rules(): array
    {
        return [
            'talent_id' => ['required', 'integer', 'exists:talents,id'],
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'supervisor' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'objectivos' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'talent_id.required' => 'O talento é obrigatório.',
            'department_id.required' => 'O departamento é obrigatório.',
            'start_date.required' => 'A data de início é obrigatória.',
            'end_date.after' => 'A data de fim deve ser posterior à data de início.',
        ];
    }
}
