<?php

namespace App\Enums;

enum WorkflowType: string
{
    case Pagamento = 'pagamento';
    case Contrato = 'contrato';
    case Renovacao = 'renovacao';
    case Rescisao = 'rescisao';
    case Outro = 'outro';

    public function label(): string
    {
        return match ($this) {
            self::Pagamento => 'Pagamento',
            self::Contrato => 'Contrato',
            self::Renovacao => 'Renovação',
            self::Rescisao => 'Rescisão',
            self::Outro => 'Outro',
        };
    }
}
