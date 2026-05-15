<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_code' => $this->event_code,
            'titulo' => $this->titulo,
            'tipo' => $this->tipo,
            'data_inicio' => $this->data_inicio?->toIso8601String(),
            'data_fim' => $this->data_fim?->toIso8601String(),
            'local' => $this->local,
            'formato' => $this->formato,
            'vagas' => $this->vagas,
            'status' => $this->status,
            'descricao' => $this->descricao,
            'inscricoes_count' => $this->whenLoaded('inscricoes', fn () => $this->inscricoes->count()),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
