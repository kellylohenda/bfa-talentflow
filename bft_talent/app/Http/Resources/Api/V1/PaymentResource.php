<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'payment_ref' => $this->payment_ref,
            'type' => $this->type,
            'period' => $this->period,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'method' => $this->method,
            'paid_at' => $this->paid_at?->toIso8601String(),
            'observacoes' => $this->observacoes,
            'talent' => TalentResource::make($this->whenLoaded('talent')),
            'workflow_id' => $this->workflow_id,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
