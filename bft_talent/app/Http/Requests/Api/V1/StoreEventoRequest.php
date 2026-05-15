<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\EventoTipo;
use App\Enums\Formato;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isStaff();
    }

    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'max:255'],
            'tipo' => ['required', Rule::enum(EventoTipo::class)],
            'data_inicio' => ['required', 'date'],
            'data_fim' => ['nullable', 'date', 'after_or_equal:data_inicio'],
            'local' => ['nullable', 'string', 'max:255'],
            'formato' => ['nullable', Rule::enum(Formato::class)],
            'vagas' => ['nullable', 'integer', 'min:1'],
            'descricao' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.required' => 'O título é obrigatório.',
            'tipo.required' => 'O tipo de evento é obrigatório.',
            'tipo.enum' => 'Tipo de evento inválido.',
            'data_inicio.required' => 'A data de início é obrigatória.',
            'data_fim.after_or_equal' => 'A data de fim deve ser igual ou posterior à data de início.',
            'formato.enum' => 'Formato inválido.',
        ];
    }
}
