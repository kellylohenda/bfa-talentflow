<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'to_user_id' => ['required', 'integer', 'exists:users,id', 'different:'.$this->user()->id],
            'subject' => ['nullable', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'to_user_id.required' => 'O destinatário é obrigatório.',
            'to_user_id.exists' => 'Destinatário não encontrado.',
            'to_user_id.different' => 'Não pode enviar mensagem para si mesmo.',
            'body.required' => 'O conteúdo da mensagem é obrigatório.',
            'body.max' => 'A mensagem não pode exceder 5000 caracteres.',
        ];
    }
}
