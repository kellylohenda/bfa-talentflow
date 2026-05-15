<?php

namespace App\Enums;

enum PresencaStatus: string
{
    case Presente = 'presente';
    case Ausente = 'ausente';
    case Justificado = 'justificado';
    case Ferias = 'ferias';

    public function label(): string
    {
        return match ($this) {
            self::Presente => 'Presente',
            self::Ausente => 'Ausente',
            self::Justificado => 'Justificado',
            self::Ferias => 'Férias',
        };
    }
}
