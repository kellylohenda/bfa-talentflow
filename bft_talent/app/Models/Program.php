<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name', 'descricao', 'activo'];

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
}
