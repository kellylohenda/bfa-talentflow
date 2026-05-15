<?php

namespace App\Enums;

enum TalentStatus: string
{
    case Activo = 'activo';
    case Concluido = 'concluido';
    case Suspenso = 'suspenso';
    case Cancelado = 'cancelado';

    public function label(): string
    {
        return match ($this) {
            self::Activo => 'Activo',
            self::Concluido => 'Concluído',
            self::Suspenso => 'Suspenso',
            self::Cancelado => 'Cancelado',
        };
    }

    public function isActive(): bool
    {
        return $this === self::Activo;
    }
}
