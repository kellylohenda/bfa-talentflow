<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkflowStepResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'step_number' => $this->step_number,
            'approver_role' => $this->approver_role,
            'decision' => $this->decision,
            'comentario' => $this->comentario,
            'decided_at' => $this->decided_at?->toIso8601String(),
            'approver' => UserResource::make($this->whenLoaded('approver')),
        ];
    }
}
