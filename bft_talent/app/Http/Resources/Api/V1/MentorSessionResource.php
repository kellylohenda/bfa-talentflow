<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MentorSessionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'session_code' => $this->session_code,
            'scheduled_at' => $this->scheduled_at?->toIso8601String(),
            'duracao_min' => $this->duracao_min,
            'status' => $this->status,
            'formato' => $this->formato,
            'notas' => $this->notas,
            'accoes' => $this->accoes,
            'talent_id' => $this->talent_id,
            'mentor' => UserResource::make($this->whenLoaded('mentor')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
