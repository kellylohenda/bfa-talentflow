<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case Pendente = 'pendente';
    case Processado = 'processado';
    case Pago = 'pago';
    case Cancelado = 'cancelado';

    public function label(): string
    {
        return match ($this) {
            self::Pendente => 'Pendente',
            self::Processado => 'Processado',
            self::Pago => 'Pago',
            self::Cancelado => 'Cancelado',
        };
    }
}
