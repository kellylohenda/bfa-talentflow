<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\TalentKind;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTalentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isRh();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'kind' => ['required', Rule::enum(TalentKind::class)],
            'program_id' => ['required', 'integer', 'exists:programs,id'],
            'university_id' => ['nullable', 'integer', 'exists:universities,id'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'mentor_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'application_id' => ['nullable', 'integer', 'exists:applications,id'],
            'stipend' => ['nullable', 'numeric', 'min:0', 'max:9999999.99'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'observacoes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome é obrigatório.',
            'kind.required' => 'O tipo de talento é obrigatório.',
            'kind.enum' => 'O tipo deve ser bolseiro ou estagiário.',
            'program_id.required' => 'O programa é obrigatório.',
            'program_id.exists' => 'O programa seleccionado não existe.',
            'end_date.after' => 'A data de fim deve ser posterior à data de início.',
        ];
    }
}
