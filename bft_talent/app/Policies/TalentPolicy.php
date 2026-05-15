<?php

namespace App\Policies;

use App\Enums\BfaRole;
use App\Models\Talent;
use App\Models\User;

class TalentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(BfaRole::Rh, BfaRole::Direcao, BfaRole::Mentor);
    }

    public function view(User $user, Talent $talent): bool
    {
        if ($user->hasAnyRole(BfaRole::Rh, BfaRole::Direcao)) {
            return true;
        }

        if ($user->isMentor()) {
            return $talent->mentor_user_id === $user->id;
        }

        // Bolseiro/estagiário vê apenas o próprio registo
        return $user->talent_id === $talent->id;
    }

    public function create(User $user): bool
    {
        return $user->isRh();
    }

    public function update(User $user, Talent $talent): bool
    {
        if ($user->isRh()) {
            return true;
        }

        if ($user->isMentor()) {
            return $talent->mentor_user_id === $user->id;
        }

        return false;
    }

    public function delete(User $user, Talent $talent): bool
    {
        return $user->isRh();
    }
}
