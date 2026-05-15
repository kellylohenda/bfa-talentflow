<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HoursEntryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'hour_code' => $this->hour_code,
            'volunteer_id' => $this->volunteer_id,
            'data' => $this->data?->toDateString(),
            'horas' => $this->horas,
            'descricao' => $this->descricao,
            'validado' => $this->validado,
            'validado_at' => $this->validado_at?->toIso8601String(),
            'activity' => VolunteerActivityResource::make($this->whenLoaded('activity')),
            'validado_por' => UserResource::make($this->whenLoaded('validadoPor')),
        ];
    }
}
