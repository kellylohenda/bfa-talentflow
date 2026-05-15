<?php

namespace App\Enums;

enum RotationStatus: string
{
    case Activa = 'activa';
    case Concluida = 'concluida';
    case Cancelada = 'cancelada';

    public function label(): string
    {
        return match ($this) {
            self::Activa => 'Activa',
            self::Concluida => 'Concluída',
            self::Cancelada => 'Cancelada',
        };
    }
}
