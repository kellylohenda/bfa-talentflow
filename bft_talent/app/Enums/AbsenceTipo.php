<?php

namespace App\Enums;

enum AbsenceTipo: string
{
    case Justificada = 'justificada';
    case Injustificada = 'injustificada';
    case Medica = 'medica';
    case Ferias = 'ferias';
    case Outro = 'outro';

    public function label(): string
    {
        return match ($this) {
            self::Justificada => 'Justificada',
            self::Injustificada => 'Injustificada',
            self::Medica => 'Médica',
            self::Ferias => 'Férias',
            self::Outro => 'Outro',
        };
    }
}
