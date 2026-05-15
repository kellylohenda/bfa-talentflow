<?php

namespace App\Models;

use App\Enums\Formato;
use App\Enums\MentorSessionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MentorSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_code', 'talent_id', 'mentor_user_id',
        'scheduled_at', 'duracao_min', 'status', 'formato',
        'notas', 'accoes',
    ];

    protected function casts(): array
    {
        return [
            'status' => MentorSessionStatus::class,
            'formato' => Formato::class,
            'scheduled_at' => 'datetime',
        ];
    }

    public function talent(): BelongsTo
    {
        return $this->belongsTo(Talent::class);
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_user_id');
    }
}
