<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'application_ref' => $this->application_ref,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'tipo' => $this->tipo,
            'stage' => $this->stage?->value,
            'stage_label' => $this->stage?->label(),
            'score' => $this->score,
            'observacoes' => $this->observacoes,
            'program' => ProgramResource::make($this->whenLoaded('program')),
            'university' => UniversityResource::make($this->whenLoaded('university')),
            'converted_talent_id' => $this->converted_talent_id,
            'converted_talent' => TalentResource::make($this->whenLoaded('convertedTalent')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
