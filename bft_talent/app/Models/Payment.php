<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use App\Enums\PaymentType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Payment extends Model
{
    use HasFactory;
    use LogsActivity;
    use SoftDeletes;

    protected static $logAttributes = ['payment_ref', 'talent_id', 'type', 'amount', 'currency', 'status', 'method', 'paid_at'];

    protected static $logOnlyDirty = true;

    protected $fillable = [
        'payment_ref', 'idempotency_key', 'talent_id', 'workflow_id',
        'type', 'period', 'amount', 'currency',
        'status', 'method', 'paid_at', 'observacoes',
    ];

    protected function casts(): array
    {
        return [
            'type' => PaymentType::class,
            'status' => PaymentStatus::class,
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function talent(): BelongsTo
    {
        return $this->belongsTo(Talent::class);
    }

    public function workflow(): BelongsTo
    {
        return $this->belongsTo(Workflow::class);
    }

    public function documents(): MorphMany
    {
        return $this->morphMany(Document::class, 'owner');
    }
}
