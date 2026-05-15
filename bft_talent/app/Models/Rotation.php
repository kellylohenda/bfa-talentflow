<?php

namespace App\Models;

use App\Enums\RotationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rotation extends Model
{
    use HasFactory;

    protected $fillable = [
        'rotation_code', 'talent_id', 'department_id',
        'supervisor', 'status', 'start_date', 'end_date',
        'objectivos', 'avaliacao_final',
    ];

    protected function casts(): array
    {
        return [
            'status' => RotationStatus::class,
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function talent(): BelongsTo
    {
        return $this->belongsTo(Talent::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
