<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PresencaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'talent_id' => $this->talent_id,
            'data' => $this->data?->toDateString(),
            'status' => $this->status,
            'hora_entrada' => $this->hora_entrada,
            'hora_saida' => $this->hora_saida,
            'observacoes' => $this->observacoes,
            'department' => DepartmentResource::make($this->whenLoaded('department')),
        ];
    }
}
