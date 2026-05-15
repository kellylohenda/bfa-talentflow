<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VolunteerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'volunteer_code' => $this->volunteer_code,
            'nome' => $this->nome,
            'email' => $this->email,
            'phone' => $this->phone,
            'status' => $this->status,
            'area_actuacao' => $this->area_actuacao,
            'total_horas' => $this->total_horas,
            'data_inicio' => $this->data_inicio?->toDateString(),
            'motivacao' => $this->motivacao,
            'mentor' => UserResource::make($this->whenLoaded('mentor')),
            'hours_entries' => HoursEntryResource::collection($this->whenLoaded('hoursEntries')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
