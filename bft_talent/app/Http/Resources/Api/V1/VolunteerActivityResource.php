<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VolunteerActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'activity_code' => $this->activity_code,
            'nome' => $this->nome,
            'tipo' => $this->tipo,
            'data' => $this->data?->toDateString(),
            'hora_inicio' => $this->hora_inicio,
            'hora_fim' => $this->hora_fim,
            'local' => $this->local,
            'vagas_total' => $this->vagas_total,
            'inscritos_count' => $this->inscritos_count,
            'status' => $this->status,
            'descricao' => $this->descricao,
            'coordenador' => UserResource::make($this->whenLoaded('coordenador')),
        ];
    }
}
