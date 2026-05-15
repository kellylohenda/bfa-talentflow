<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'task_code' => $this->task_code,
            'title' => $this->title,
            'descricao' => $this->descricao,
            'status' => $this->status,
            'prioridade' => $this->prioridade,
            'due_date' => $this->due_date?->toDateString(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'talent_id' => $this->talent_id,
            'assigned_by' => UserResource::make($this->whenLoaded('assignedBy')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
