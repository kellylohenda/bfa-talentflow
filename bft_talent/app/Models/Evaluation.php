<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'talent_id', 'program_id', 'evaluator_user_id',
        'period', 'tipo', 'score', 'classificacao',
        'pontos_fortes', 'areas_melhoria', 'comentarios',
    ];

    protected $appends = [
        'feedback', 'criterio', 'periodo',
    ];

    public function talent(): BelongsTo
    {
        return $this->belongsTo(Talent::class);
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function evaluator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'evaluator_user_id');
    }

    public function target(): BelongsTo
    {
        return $this->belongsTo(Talent::class, 'talent_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'evaluator_user_id');
    }

    public function getFeedbackAttribute(): ?string
    {
        return $this->comentarios;
    }

    public function getCriterioAttribute(): string
    {
        return $this->tipo;
    }

    public function getPeriodoAttribute(): string
    {
        return $this->period;
    }
}
