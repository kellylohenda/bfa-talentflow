<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    protected $fillable = ['code', 'name', 'tag', 'descricao', 'activo'];

    protected function casts(): array
    {
        return ['activo' => 'boolean'];
    }

    public function talents(): HasMany
    {
        return $this->hasMany(Talent::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function benefits(): HasMany
    {
        return $this->hasMany(ProgramBenefit::class)->orderBy('sort_order');
    }
}
