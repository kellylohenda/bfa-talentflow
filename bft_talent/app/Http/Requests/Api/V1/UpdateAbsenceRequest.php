<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\AbsenceStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAbsenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isStaff();
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', Rule::enum(AbsenceStatus::class)],
            'motivo' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.enum' => 'Estado inválido.',
        ];
    }
}
