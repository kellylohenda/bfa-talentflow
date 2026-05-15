<?php

namespace App\Enums;

enum TaskStatus: string
{
    case Pendente = 'pendente';
    case EmProgresso = 'em_progresso';
    case Concluida = 'concluida';
    case Cancelada = 'cancelada';

    public function label(): string
    {
        return match ($this) {
            self::Pendente => 'Pendente',
            self::EmProgresso => 'Em Progresso',
            self::Concluida => 'Concluída',
            self::Cancelada => 'Cancelada',
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::Concluida, self::Cancelada]);
    }
}
