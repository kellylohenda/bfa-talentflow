<?php

namespace App\Enums;

enum ProgramCode: string
{
    case Fbfa = 'fbfa';
    case Bif = 'bif';
    case Bnac = 'bnac';
    case Mest = 'mest';
    case Lid = 'lid';

    public function label(): string
    {
        return match ($this) {
            self::Fbfa => 'Futuro BFA (Trainee)',
            self::Bif => 'Bolsa Internacional',
            self::Bnac => 'Bolsa Nacional',
            self::Mest => 'Mestrado Patrocinado',
            self::Lid => 'Liderança+',
        };
    }

    public function defaultKind(): TalentKind
    {
        return match ($this) {
            self::Fbfa => TalentKind::Estagiario,
            default => TalentKind::Bolseiro,
        };
    }
}
