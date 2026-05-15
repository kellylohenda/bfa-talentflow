<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SessaoBolseiro extends Model
{
    protected $table = 'sessoes_bolseiro';

    protected $fillable = [
        'talent_id', 'evento_id', 'titulo', 'data_hora',
        'formato', 'status', 'local', 'descricao', 'resultado',
    ];

    protected function casts(): array
    {
        return ['data_hora' => 'datetime'];
    }

    public function talent(): BelongsTo
    {
        return $this->belongsTo(Talent::class);
    }

    public function evento(): BelongsTo
    {
        return $this->belongsTo(Evento::class);
    }
}
