<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'subject' => $this->subject,
            'body' => $this->body,
            'tipo' => $this->tipo,
            'read_at' => $this->read_at?->toIso8601String(),
            'from' => UserResource::make($this->whenLoaded('from')),
            'to' => UserResource::make($this->whenLoaded('to')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
