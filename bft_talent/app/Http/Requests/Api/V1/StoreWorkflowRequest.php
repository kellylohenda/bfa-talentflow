<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\WorkflowType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWorkflowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isRh();
    }

    public function rules(): array
    {
        return [
            'talent_id' => ['required', 'integer', 'exists:talents,id'],
            'type' => ['required', Rule::enum(WorkflowType::class)],
            'amount' => ['nullable', 'numeric', 'min:0', 'max:9999999.99'],
            'urgency' => ['nullable', 'string', 'in:normal,urgente'],
            'descricao' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'talent_id.required' => 'O talento é obrigatório.',
            'talent_id.exists' => 'O talento seleccionado não existe.',
            'type.required' => 'O tipo de workflow é obrigatório.',
            'type.enum' => 'Tipo de workflow inválido.',
        ];
    }
}
