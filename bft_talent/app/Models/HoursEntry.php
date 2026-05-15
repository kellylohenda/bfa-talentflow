<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HoursEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'hour_code', 'volunteer_id', 'activity_id',
        'data', 'horas', 'descricao',
        'validado', 'validado_por_user_id', 'validado_at',
    ];

    protected $appends = [
        'date', 'hours', 'status',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'date',
            'horas' => 'decimal:2',
            'validado' => 'boolean',
            'validado_at' => 'datetime',
        ];
    }

    public function volunteer(): BelongsTo
    {
        return $this->belongsTo(Volunteer::class);
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(VolunteerActivity::class, 'activity_id');
    }

    public function validadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validado_por_user_id');
    }

    public function getDateAttribute(): ?string
    {
        return $this->data?->toDateString();
    }

    public function getHoursAttribute(): string
    {
        return $this->horas;
    }

    public function getStatusAttribute(): string
    {
        if ($this->validado === true) {
            return 'validado';
        }
        if ($this->validado === false) {
            return 'rejeitado';
        }

        return 'pendente';
    }
}
