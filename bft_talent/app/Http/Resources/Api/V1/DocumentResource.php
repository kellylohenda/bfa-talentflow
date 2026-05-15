<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'document_code' => $this->document_code,
            'name' => $this->name,
            'category' => $this->category,
            'version' => $this->version,
            'mime_type' => $this->mime_type,
            'size_bytes' => $this->size_bytes,
            'status' => $this->status,
            'observacoes' => $this->observacoes,
            'owner_type' => $this->owner_type,
            'owner_id' => $this->owner_id,
            'uploaded_by' => UserResource::make($this->whenLoaded('uploadedBy')),
            'reviewed_by' => UserResource::make($this->whenLoaded('reviewedBy')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
