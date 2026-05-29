<?php

namespace App\Models;

use App\Enums\WorkflowStatus;
use App\Enums\WorkflowType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Workflow extends Model
{
    use HasFactory;
    use LogsActivity;
    use SoftDeletes;

    protected static $logAttributes = ['workflow_code', 'talent_id', 'type', 'amount', 'urgency', 'status', 'current_step', 'total_steps'];

    protected static $logOnlyDirty = true;

    protected $fillable = [
        'workflow_code', 'talent_id', 'type', 'amount',
        'urgency', 'status', 'current_step', 'total_steps', 'descricao',
    ];

    protected function casts(): array
    {
        return [
            'type' => WorkflowType::class,
            'status' => WorkflowStatus::class,
            'amount' => 'decimal:2',
        ];
    }

    public function talent(): BelongsTo
    {
        return $this->belongsTo(Talent::class);
    }

    public function steps(): HasMany
    {
        return $this->hasMany(WorkflowStep::class)->orderBy('step_number');
    }

    public function currentStepModel(): HasOne
    {
        return $this->hasOne(WorkflowStep::class)
            ->where('step_number', $this->current_step);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}
