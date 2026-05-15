<?php

namespace App\Enums;

enum TalentKind: string
{
    case Bolseiro = 'bolseiro';
    case Estagiario = 'estagiario';

    public function label(): string
    {
        return match ($this) {
            self::Bolseiro => 'Bolseiro',
            self::Estagiario => 'Estagiário',
        };
    }
}
