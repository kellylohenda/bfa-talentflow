<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EvaluationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'period' => $this->period,
            'tipo' => $this->tipo,
            'score' => $this->score,
            'classificacao' => $this->classificacao,
            'pontos_fortes' => $this->pontos_fortes,
            'areas_melhoria' => $this->areas_melhoria,
            'comentarios' => $this->comentarios,
            'talent_id' => $this->talent_id,
            'program' => ProgramResource::make($this->whenLoaded('program')),
            'evaluator' => UserResource::make($this->whenLoaded('evaluator')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
