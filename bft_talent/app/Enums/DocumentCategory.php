<?php

namespace App\Enums;

enum DocumentCategory: string
{
    case Bi = 'bi';
    case Passaporte = 'passaporte';
    case Cv = 'cv';
    case Diploma = 'diploma';
    case Comprovativo = 'comprovativo';
    case Contrato = 'contrato';
    case Outro = 'outro';

    public function label(): string
    {
        return match ($this) {
            self::Bi => 'Bilhete de Identidade',
            self::Passaporte => 'Passaporte',
            self::Cv => 'Curriculum Vitae',
            self::Diploma => 'Diploma / Certificado',
            self::Comprovativo => 'Comprovativo',
            self::Contrato => 'Contrato',
            self::Outro => 'Outro',
        };
    }
}
