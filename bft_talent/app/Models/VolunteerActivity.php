<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VolunteerActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_code', 'nome', 'tipo', 'coordenador_user_id',
        'data', 'hora_inicio', 'hora_fim', 'local',
        'vagas_total', 'inscritos_count', 'status', 'descricao',
    ];

    protected function casts(): array
    {
        return ['data' => 'date'];
    }

    public function coordenador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'coordenador_user_id');
    }

    public function inscricoes(): HasMany
    {
        return $this->hasMany(VolunteerActivityInscricao::class, 'activity_id');
    }

    public function hoursEntries(): HasMany
    {
        return $this->hasMany(HoursEntry::class, 'activity_id');
    }
}
