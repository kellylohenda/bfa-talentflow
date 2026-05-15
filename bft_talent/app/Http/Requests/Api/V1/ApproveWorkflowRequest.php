<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class ApproveWorkflowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->canApproveWorkflow();
    }

    public function rules(): array
    {
        return [
            'comentario' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
