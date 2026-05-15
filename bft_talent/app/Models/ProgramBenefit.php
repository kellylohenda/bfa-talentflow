<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramBenefit extends Model
{
    protected $fillable = ['program_id', 'text', 'sort_order'];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }
}
