<?php

namespace App\Enums;

enum PaymentType: string
{
    case Bolsa = 'bolsa';
    case SubsidioAlimentacao = 'subsidio_alimentacao';
    case AjudaCusto = 'ajuda_custo';
    case Outro = 'outro';

    public function label(): string
    {
        return match ($this) {
            self::Bolsa => 'Bolsa',
            self::SubsidioAlimentacao => 'Subsídio de Alimentação',
            self::AjudaCusto => 'Ajuda de Custo',
            self::Outro => 'Outro',
        };
    }
}
