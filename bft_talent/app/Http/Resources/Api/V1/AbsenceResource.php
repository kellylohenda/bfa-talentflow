<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AbsenceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'absence_code' => $this->absence_code,
            'tipo' => $this->tipo,
            'date_start' => $this->date_start?->toDateString(),
            'date_end' => $this->date_end?->toDateString(),
            'dias' => $this->dias,
            'status' => $this->status,
            'motivo' => $this->motivo,
            'talent_id' => $this->talent_id,
            'approved_by' => UserResource::make($this->whenLoaded('approvedBy')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
