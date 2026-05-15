<?php

namespace App\Enums;

enum AbsenceStatus: string
{
    case Pendente = 'pendente';
    case Aprovada = 'aprovada';
    case Rejeitada = 'rejeitada';

    public function label(): string
    {
        return match ($this) {
            self::Pendente => 'Pendente',
            self::Aprovada => 'Aprovada',
            self::Rejeitada => 'Rejeitada',
        };
    }
}
