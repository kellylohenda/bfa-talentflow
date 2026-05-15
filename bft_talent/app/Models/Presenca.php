<?php

namespace App\Models;

use App\Enums\PresencaStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Presenca extends Model
{
    protected $fillable = [
        'talent_id', 'department_id', 'data', 'status',
        'hora_entrada', 'hora_saida', 'observacoes',
    ];

    protected function casts(): array
    {
        return [
            'status' => PresencaStatus::class,
            'data' => 'date',
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
