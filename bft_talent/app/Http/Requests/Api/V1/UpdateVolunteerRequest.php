<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\VolunteerStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVolunteerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isRh();
    }

    public function rules(): array
    {
        return [
            'nome' => ['sometimes', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'area_actuacao' => ['nullable', 'string', 'max:60'],
            'status' => ['sometimes', Rule::enum(VolunteerStatus::class)],
            'mentor_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'motivacao' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.enum' => 'Estado inválido.',
        ];
    }
}
