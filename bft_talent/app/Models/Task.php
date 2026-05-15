<?php

namespace App\Models;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'task_code', 'talent_id', 'assigned_by_user_id',
        'title', 'descricao', 'status', 'prioridade',
        'due_date', 'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => TaskStatus::class,
            'prioridade' => TaskPriority::class,
            'due_date' => 'date',
            'completed_at' => 'datetime',
        ];
    }

    protected $appends = ['description', 'priority'];

    protected function description(): Attribute
    {
        return Attribute::make(get: fn ($value, $attrs) => $attrs['descricao'] ?? null);
    }

    protected function priority(): Attribute
    {
        return Attribute::make(get: fn ($value, $attrs) => match ($attrs['prioridade'] ?? null) {
            'normal' => 'media',
            default => $attrs['prioridade'] ?? null,
        });
    }

    public function talent(): BelongsTo
    {
        return $this->belongsTo(Talent::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by_user_id');
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by_user_id');
    }
}
