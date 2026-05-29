<?php

namespace App\Models;

use App\Enums\VolunteerStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Volunteer extends Model
{
    use HasFactory;
    use LogsActivity;
    use SoftDeletes;

    protected static $logAttributes = ['volunteer_code', 'nome', 'email', 'phone', 'status', 'area_actuacao', 'total_horas', 'mentor_user_id'];

    protected static $logOnlyDirty = true;

    protected $fillable = [
        'volunteer_code', 'nome', 'email', 'phone',
        'status', 'area_actuacao', 'total_horas',
        'mentor_user_id', 'data_inicio', 'motivacao',
    ];

    protected function casts(): array
    {
        return [
            'status' => VolunteerStatus::class,
            'data_inicio' => 'date',
            'total_horas' => 'decimal:2',
        ];
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_user_id');
    }

    public function activityInscricoes(): HasMany
    {
        return $this->hasMany(VolunteerActivityInscricao::class);
    }

    public function hoursEntries(): HasMany
    {
        return $this->hasMany(HoursEntry::class);
    }

    public function eventoInscricoes(): HasMany
    {
        return $this->hasMany(EventoInscricao::class);
    }

    public function documents(): MorphMany
    {
        return $this->morphMany(Document::class, 'owner');
    }
}
