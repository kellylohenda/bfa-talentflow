<?php

namespace App\Models;

use App\Enums\EventoStatus;
use App\Enums\EventoTipo;
use App\Enums\Formato;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Evento extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_code', 'titulo', 'tipo', 'data_inicio', 'data_fim',
        'local', 'formato', 'vagas', 'status', 'descricao',
    ];

    protected function casts(): array
    {
        return [
            'tipo' => EventoTipo::class,
            'formato' => Formato::class,
            'status' => EventoStatus::class,
            'data_inicio' => 'datetime',
            'data_fim' => 'datetime',
        ];
    }

    public function inscricoes(): HasMany
    {
        return $this->hasMany(EventoInscricao::class);
    }

    public function sessoesBolseiro(): HasMany
    {
        return $this->hasMany(SessaoBolseiro::class);
    }
}
