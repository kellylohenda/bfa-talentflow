<?php

namespace App\Enums;

enum VolunteerStatus: string
{
    case Activo = 'activo';
    case Inactivo = 'inactivo';
    case Suspenso = 'suspenso';

    public function label(): string
    {
        return match ($this) {
            self::Activo => 'Activo',
            self::Inactivo => 'Inactivo',
            self::Suspenso => 'Suspenso',
        };
    }
}
