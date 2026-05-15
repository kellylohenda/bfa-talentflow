<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $fillable = ['code', 'label', 'sort', 'is_terminal'];

    protected function casts(): array
    {
        return ['is_terminal' => 'boolean'];
    }
}
