<?php

namespace App\Enums;

enum MentorSessionStatus: string
{
    case Agendada = 'agendada';
    case Realizada = 'realizada';
    case Cancelada = 'cancelada';

    public function label(): string
    {
        return match ($this) {
            self::Agendada => 'Agendada',
            self::Realizada => 'Realizada',
            self::Cancelada => 'Cancelada',
        };
    }
}
