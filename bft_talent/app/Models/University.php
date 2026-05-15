<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class University extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'city', 'country', 'activa'];

    protected function casts(): array
    {
        return ['activa' => 'boolean'];
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
