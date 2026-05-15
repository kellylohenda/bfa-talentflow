<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventoInscricao extends Model
{
    protected $table = 'evento_inscricoes';

    protected $fillable = [
        'evento_id', 'talent_id', 'volunteer_id', 'status', 'inscrito_at',
    ];

    protected function casts(): array
    {
        return ['inscrito_at' => 'datetime'];
    }

    public function evento(): BelongsTo
    {
        return $this->belongsTo(Evento::class);
    }

    public function talent(): BelongsTo
    {
        return $this->belongsTo(Talent::class);
    }

    public function volunteer(): BelongsTo
    {
        return $this->belongsTo(Volunteer::class);
    }
}
