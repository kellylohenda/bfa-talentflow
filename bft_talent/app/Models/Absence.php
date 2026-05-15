<?php

namespace App\Models;

use App\Enums\AbsenceStatus;
use App\Enums\AbsenceTipo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absence extends Model
{
    use HasFactory;

    protected $fillable = [
        'absence_code', 'talent_id', 'program_id', 'approved_by_user_id',
        'tipo', 'date_start', 'date_end', 'dias', 'status', 'motivo',
    ];

    protected function casts(): array
    {
        return [
            'tipo' => AbsenceTipo::class,
            'status' => AbsenceStatus::class,
            'date_start' => 'date',
            'date_end' => 'date',
        ];
    }

    public function talent(): BelongsTo
    {
        return $this->belongsTo(Talent::class);
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by_user_id');
    }
}
