<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProcessStep extends Model
{
    protected $fillable = ['period', 'title', 'description', 'sort_order', 'active'];

    protected function casts(): array
    {
        return ['active' => 'boolean'];
    }
}
