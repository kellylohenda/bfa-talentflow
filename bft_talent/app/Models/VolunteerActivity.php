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

    protected $appends = [
        'title', 'description', 'area', 'date', 'vagas', 'total_horas',
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

    public function getTitleAttribute(): string
    {
        return $this->nome;
    }

    public function getDescriptionAttribute(): ?string
    {
        return $this->descricao;
    }

    public function getAreaAttribute(): string
    {
        return $this->tipo;
    }

    public function getDateAttribute(): ?string
    {
        return $this->data?->toDateString();
    }

    public function getVagasAttribute(): ?int
    {
        return $this->vagas_total;
    }

    public function getTotalHorasAttribute(): float
    {
        return (float) $this->hoursEntries()->sum('horas');
    }
}
