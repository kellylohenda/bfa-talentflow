<?php

namespace App\Models;

use App\Enums\DocumentCategory;
use App\Enums\DocumentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'document_code', 'owner_type', 'owner_id',
        'uploaded_by_user_id', 'reviewed_by_user_id',
        'name', 'category', 'version', 'mime_type',
        'size_bytes', 'storage_path', 'status', 'observacoes',
    ];

    protected function casts(): array
    {
        return [
            'category' => DocumentCategory::class,
            'status' => DocumentStatus::class,
        ];
    }

    public function owner(): MorphTo
    {
        return $this->morphTo();
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by_user_id');
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by_user_id');
    }
}
