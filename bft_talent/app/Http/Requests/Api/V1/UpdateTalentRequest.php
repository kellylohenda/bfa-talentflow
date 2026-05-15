<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\TalentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTalentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->canManageTalents();
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'mentor_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'stipend' => ['nullable', 'numeric', 'min:0', 'max:9999999.99'],
            'status' => ['sometimes', Rule::enum(TalentStatus::class)],
            'perf' => ['nullable', 'integer', 'min:0', 'max:100'],
            'risk_score' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'end_date' => ['nullable', 'date'],
            'observacoes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.enum' => 'Estado inválido.',
            'perf.max' => 'A performance máxima é 100.',
        ];
    }
}
