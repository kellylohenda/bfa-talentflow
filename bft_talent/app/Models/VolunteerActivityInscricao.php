<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VolunteerActivityInscricao extends Model
{
    protected $table = 'volunteer_activity_inscricoes';

    protected $fillable = [
        'activity_id', 'volunteer_id', 'inscrito_at',
        'presente', 'horas_registadas',
    ];

    protected function casts(): array
    {
        return [
            'inscrito_at' => 'datetime',
            'presente' => 'boolean',
            'horas_registadas' => 'decimal:2',
        ];
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(VolunteerActivity::class);
    }

    public function volunteer(): BelongsTo
    {
        return $this->belongsTo(Volunteer::class);
    }
}
