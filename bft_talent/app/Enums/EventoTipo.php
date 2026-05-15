<?php

namespace App\Enums;

enum EventoTipo: string
{
    case Formacao = 'formacao';
    case Palestra = 'palestra';
    case Workshop = 'workshop';
    case Networking = 'networking';
    case Outro = 'outro';

    public function label(): string
    {
        return match ($this) {
            self::Formacao => 'Formação',
            self::Palestra => 'Palestra',
            self::Workshop => 'Workshop',
            self::Networking => 'Networking',
            self::Outro => 'Outro',
        };
    }
}
