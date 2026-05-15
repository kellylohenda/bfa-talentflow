<?php

namespace App\Enums;

enum BfaRole: string
{
    case Rh = 'rh';
    case Direcao = 'direcao';
    case Mentor = 'mentor';
    case Bolseiro = 'bolseiro';
    case Estagiario = 'estagiario';
    case Voluntario = 'voluntario';

    public function label(): string
    {
        return match ($this) {
            self::Rh => 'Recursos Humanos',
            self::Direcao => 'Direcção',
            self::Mentor => 'Mentor',
            self::Bolseiro => 'Bolseiro',
            self::Estagiario => 'Estagiário',
            self::Voluntario => 'Voluntário',
        };
    }

    /** Roles que gerem toda a plataforma (acesso de escrita alargado). */
    public function isStaff(): bool
    {
        return in_array($this, [self::Rh, self::Direcao, self::Mentor]);
    }

    /** Roles que são participantes (acesso ao próprio perfil). */
    public function isParticipant(): bool
    {
        return in_array($this, [self::Bolseiro, self::Estagiario, self::Voluntario]);
    }

    public function canApproveWorkflow(): bool
    {
        return in_array($this, [self::Rh, self::Direcao]);
    }

    public function canManageTalents(): bool
    {
        return in_array($this, [self::Rh, self::Mentor]);
    }

    public function canViewAnalytics(): bool
    {
        return in_array($this, [self::Rh, self::Direcao]);
    }
}
