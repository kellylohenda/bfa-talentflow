<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreHoursEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if ($user->isStaff()) {
            return true;
        }

        return $user->volunteer_id === $this->input('volunteer_id');
    }

    public function rules(): array
    {
        return [
            'volunteer_id' => ['required', 'integer', 'exists:volunteers,id'],
            'activity_id' => ['nullable', 'integer', 'exists:volunteer_activities,id'],
            'data' => ['required', 'date', 'before_or_equal:today'],
            'horas' => ['required', 'numeric', 'min:0.5', 'max:24'],
            'descricao' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'volunteer_id.required' => 'O voluntário é obrigatório.',
            'data.required' => 'A data é obrigatória.',
            'data.before_or_equal' => 'Não é possível registar horas no futuro.',
            'horas.required' => 'O número de horas é obrigatório.',
            'horas.min' => 'O mínimo são 0.5 horas (30 minutos).',
            'horas.max' => 'O máximo são 24 horas por dia.',
        ];
    }
}
