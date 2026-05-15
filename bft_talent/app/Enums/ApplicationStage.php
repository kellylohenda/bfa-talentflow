<?php

namespace App\Enums;

enum ApplicationStage: string
{
    case Analise = 'analise';
    case Entrevista = 'entrevista';
    case Avaliacao = 'avaliacao';
    case Oferta = 'oferta';
    case Convertido = 'convertido';
    case Rejeitado = 'rejeitado';

    public function label(): string
    {
        return match ($this) {
            self::Analise => 'Em Análise',
            self::Entrevista => 'Entrevista',
            self::Avaliacao => 'Avaliação',
            self::Oferta => 'Oferta',
            self::Convertido => 'Convertido',
            self::Rejeitado => 'Rejeitado',
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::Convertido, self::Rejeitado]);
    }
}
