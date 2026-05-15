<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RotationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rotation_code' => $this->rotation_code,
            'talent_id' => $this->talent_id,
            'supervisor' => $this->supervisor,
            'status' => $this->status,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'objectivos' => $this->objectivos,
            'avaliacao_final' => $this->avaliacao_final,
            'department' => DepartmentResource::make($this->whenLoaded('department')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
