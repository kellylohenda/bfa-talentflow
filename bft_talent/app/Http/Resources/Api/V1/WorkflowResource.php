<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkflowResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'workflow_code' => $this->workflow_code,
            'type' => $this->type,
            'amount' => $this->amount,
            'urgency' => $this->urgency,
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'current_step' => $this->current_step,
            'total_steps' => $this->total_steps,
            'descricao' => $this->descricao,
            'talent' => TalentResource::make($this->whenLoaded('talent')),
            'steps' => WorkflowStepResource::collection($this->whenLoaded('steps')),
            'payment' => PaymentResource::make($this->whenLoaded('payment')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
