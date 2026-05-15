<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class MarcarPagoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isRh();
    }

    public function rules(): array
    {
        return [
            'method' => ['required', 'string', 'in:transferencia,cheque,numerario'],
            'observacoes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'method.required' => 'O método de pagamento é obrigatório.',
            'method.in' => 'Método inválido. Use: transferencia, cheque ou numerario.',
        ];
    }
}
