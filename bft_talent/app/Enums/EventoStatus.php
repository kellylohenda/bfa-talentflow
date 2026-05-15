<?php

namespace App\Enums;

enum EventoStatus: string
{
    case Planeado = 'planeado';
    case Confirmado = 'confirmado';
    case Cancelado = 'cancelado';
    case Concluido = 'concluido';

    public function label(): string
    {
        return match ($this) {
            self::Planeado => 'Planeado',
            self::Confirmado => 'Confirmado',
            self::Cancelado => 'Cancelado',
            self::Concluido => 'Concluído',
        };
    }
}
