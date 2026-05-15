<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\DocumentCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // qualquer utilizador autenticado pode submeter documentos
    }

    public function rules(): array
    {
        return [
            'owner_type' => ['required', 'string', 'in:talent,application,volunteer,payment,workflow'],
            'owner_id' => ['required', 'integer'],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::enum(DocumentCategory::class)],
            'file' => ['required', 'file', 'max:10240', 'mimes:pdf,jpg,jpeg,png,doc,docx'],
        ];
    }

    public function messages(): array
    {
        return [
            'owner_type.required' => 'O tipo de entidade é obrigatório.',
            'owner_id.required' => 'O ID da entidade é obrigatório.',
            'name.required' => 'O nome do documento é obrigatório.',
            'category.required' => 'A categoria é obrigatória.',
            'category.enum' => 'Categoria inválida.',
            'file.required' => 'O ficheiro é obrigatório.',
            'file.max' => 'O ficheiro não pode exceder 10MB.',
            'file.mimes' => 'Formato inválido. Aceites: PDF, JPG, PNG, DOC, DOCX.',
        ];
    }
}
