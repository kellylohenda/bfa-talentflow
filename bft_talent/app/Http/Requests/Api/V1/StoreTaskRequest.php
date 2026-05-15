<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\TaskPriority;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isStaff();
    }

    public function rules(): array
    {
        return [
            'talent_id' => ['nullable', 'integer', 'exists:talents,id'],
            'title' => ['required', 'string', 'max:255'],
            'descricao' => ['nullable', 'string', 'max:2000'],
            'prioridade' => ['nullable', Rule::enum(TaskPriority::class)],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'O título é obrigatório.',
            'prioridade.enum' => 'Prioridade inválida.',
            'due_date.after_or_equal' => 'A data limite não pode ser no passado.',
        ];
    }
}
