<?php

namespace App\Concerns;

use App\Enums\BfaRole;

trait HasBfaRole
{
    public function getBfaRole(): ?BfaRole
    {
        return $this->bfa_role;
    }

    public function hasRole(BfaRole $role): bool
    {
        return $this->bfa_role === $role;
    }

    public function hasAnyRole(BfaRole ...$roles): bool
    {
        return in_array($this->bfa_role, $roles);
    }

    public function isRh(): bool
    {
        return $this->bfa_role === BfaRole::Rh;
    }

    public function isDirecao(): bool
    {
        return $this->bfa_role === BfaRole::Direcao;
    }

    public function isMentor(): bool
    {
        return $this->bfa_role === BfaRole::Mentor;
    }

    public function isBolseiro(): bool
    {
        return $this->bfa_role === BfaRole::Bolseiro;
    }

    public function isEstagiario(): bool
    {
        return $this->bfa_role === BfaRole::Estagiario;
    }

    public function isVoluntario(): bool
    {
        return $this->bfa_role === BfaRole::Voluntario;
    }

    public function isStaff(): bool
    {
        return $this->bfa_role?->isStaff() ?? false;
    }

    public function canApproveWorkflow(): bool
    {
        return $this->bfa_role?->canApproveWorkflow() ?? false;
    }

    public function canManageTalents(): bool
    {
        return $this->bfa_role?->canManageTalents() ?? false;
    }

    public function canViewAnalytics(): bool
    {
        return $this->bfa_role?->canViewAnalytics() ?? false;
    }
}
