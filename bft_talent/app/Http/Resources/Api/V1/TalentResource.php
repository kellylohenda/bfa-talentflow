<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TalentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'talent_code' => $this->talent_code,
            'name' => $this->name,
            'email' => $this->email,
            'kind' => $this->kind?->value,
            'kind_label' => $this->kind?->label(),
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'stipend' => $this->stipend,
            'perf' => $this->perf,
            'risk_score' => $this->risk_score,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'observacoes' => $this->observacoes,
            'program' => ProgramResource::make($this->whenLoaded('program')),
            'university' => UniversityResource::make($this->whenLoaded('university')),
            'department' => DepartmentResource::make($this->whenLoaded('department')),
            'mentor' => UserResource::make($this->whenLoaded('mentor')),
            'rotations' => RotationResource::collection($this->whenLoaded('rotations')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'tasks' => TaskResource::collection($this->whenLoaded('tasks')),
            'absences' => AbsenceResource::collection($this->whenLoaded('absences')),
            'evaluations' => EvaluationResource::collection($this->whenLoaded('evaluations')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
