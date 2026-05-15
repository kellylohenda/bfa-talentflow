<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreVolunteerActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isRh();
    }

    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:255'],
            'tipo' => ['required', 'string', 'in:social,ambiental,educacao,saude,cultura,outro'],
            'coordenador_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'data' => ['required', 'date'],
            'hora_inicio' => ['nullable', 'date_format:H:i'],
            'hora_fim' => ['nullable', 'date_format:H:i', 'after:hora_inicio'],
            'local' => ['nullable', 'string', 'max:255'],
            'vagas_total' => ['nullable', 'integer', 'min:1'],
            'descricao' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'O nome é obrigatório.',
            'tipo.required' => 'O tipo é obrigatório.',
            'tipo.in' => 'Tipo inválido.',
            'data.required' => 'A data é obrigatória.',
        ];
    }
}
