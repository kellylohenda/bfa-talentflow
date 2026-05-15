<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\RotationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRotationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->canManageTalents();
    }

    public function rules(): array
    {
        return [
            'department_id' => ['sometimes', 'integer', 'exists:departments,id'],
            'supervisor' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', Rule::enum(RotationStatus::class)],
            'end_date' => ['nullable', 'date'],
            'objectivos' => ['nullable', 'string', 'max:2000'],
            'avaliacao_final' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.enum' => 'Estado inválido.',
        ];
    }
}
