<?php

namespace App\Models;

use App\Enums\ApplicationStage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Application extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'application_ref', 'name', 'email', 'phone',
        'program_id', 'university_id', 'tipo', 'stage',
        'score', 'observacoes', 'converted_talent_id',
    ];

    protected function casts(): array
    {
        return [
            'stage' => ApplicationStage::class,
            'score' => 'integer',
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

    public function convertedTalent(): BelongsTo
    {
        return $this->belongsTo(Talent::class, 'converted_talent_id');
    }
}
