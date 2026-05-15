<?php

namespace App\Enums;

enum WorkflowStatus: string
{
    case Pendente = 'pendente';
    case EmAprovacao = 'em_aprovacao';
    case Aprovado = 'aprovado';
    case Rejeitado = 'rejeitado';
    case Cancelado = 'cancelado';

    public function label(): string
    {
        return match ($this) {
            self::Pendente => 'Pendente',
            self::EmAprovacao => 'Em Aprovação',
            self::Aprovado => 'Aprovado',
            self::Rejeitado => 'Rejeitado',
            self::Cancelado => 'Cancelado',
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::Aprovado, self::Rejeitado, self::Cancelado]);
    }
}
