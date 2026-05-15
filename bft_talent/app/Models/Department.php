<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'codigo', 'activo'];

    protected function casts(): array
    {
        return ['activo' => 'boolean'];
    }

    public function talents(): HasMany
    {
        return $this->hasMany(Talent::class);
    }

    public function rotations(): HasMany
    {
        return $this->hasMany(Rotation::class);
    }
}
