<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\PaymentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isRh();
    }

    public function rules(): array
    {
        return [
            'talent_id' => ['required', 'integer', 'exists:talents,id'],
            'type' => ['required', Rule::enum(PaymentType::class)],
            'period' => ['required', 'regex:/^\d{4}-(0[1-9]|1[0-2])$/'],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:9999999.99'],
            'currency' => ['nullable', 'string', 'size:3'],
            'method' => ['nullable', 'string', 'in:transferencia,cheque,numerario'],
            'observacoes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'talent_id.required' => 'O talento é obrigatório.',
            'talent_id.exists' => 'O talento seleccionado não existe.',
            'type.required' => 'O tipo de pagamento é obrigatório.',
            'type.enum' => 'Tipo de pagamento inválido.',
            'period.required' => 'O período é obrigatório.',
            'period.regex' => 'O período deve ter o formato YYYY-MM (ex: 2025-01).',
            'amount.required' => 'O valor é obrigatório.',
            'amount.min' => 'O valor deve ser positivo.',
        ];
    }
}
