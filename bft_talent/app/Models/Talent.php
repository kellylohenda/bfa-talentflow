<?php

namespace App\Models;

use App\Enums\TalentKind;
use App\Enums\TalentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Talent extends Model
{
    use HasFactory, LogsActivity, SoftDeletes;

    protected static $logAttributes = ['name', 'email', 'kind', 'status', 'program_id', 'university_id', 'department_id', 'mentor_user_id', 'stipend', 'perf', 'risk_score'];

    protected static $logOnlyDirty = true;

    protected $table = 'talents';

    protected $fillable = [
        'talent_code', 'name', 'email', 'kind', 'status',
        'program_id', 'university_id', 'department_id',
        'mentor_user_id', 'application_id',
        'stipend', 'perf', 'risk_score',
        'start_date', 'end_date', 'observacoes',
    ];

    protected function casts(): array
    {
        return [
            'kind' => TalentKind::class,
            'status' => TalentStatus::class,
            'stipend' => 'decimal:2',
            'risk_score' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_user_id');
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function rotations(): HasMany
    {
        return $this->hasMany(Rotation::class);
    }

    public function activeRotation(): HasOne
    {
        return $this->hasOne(Rotation::class)->where('status', 'activa');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function absences(): HasMany
    {
        return $this->hasMany(Absence::class);
    }

    public function workflows(): HasMany
    {
        return $this->hasMany(Workflow::class);
    }

    public function mentorSessions(): HasMany
    {
        return $this->hasMany(MentorSession::class);
    }

    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class);
    }

    public function presencas(): HasMany
    {
        return $this->hasMany(Presenca::class);
    }

    public function sessoesBolseiro(): HasMany
    {
        return $this->hasMany(SessaoBolseiro::class);
    }

    public function eventoInscricoes(): HasMany
    {
        return $this->hasMany(EventoInscricao::class);
    }

    public function documents(): MorphMany
    {
        return $this->morphMany(Document::class, 'owner');
    }

    public function isEstagiario(): bool
    {
        return $this->kind === TalentKind::Estagiario;
    }
}
