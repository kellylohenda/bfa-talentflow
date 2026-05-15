<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class RejectWorkflowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->canApproveWorkflow();
    }

    public function rules(): array
    {
        return [
            'comentario' => ['required', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'comentario.required' => 'O motivo de rejeição é obrigatório.',
        ];
    }
}
