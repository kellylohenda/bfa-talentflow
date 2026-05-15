<?php

namespace App\Policies;

use App\Enums\BfaRole;
use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(BfaRole::Rh, BfaRole::Direcao);
    }

    public function view(User $user, Application $application): bool
    {
        return $user->hasAnyRole(BfaRole::Rh, BfaRole::Direcao);
    }

    public function create(User $user): bool
    {
        return $user->isRh();
    }

    public function update(User $user, Application $application): bool
    {
        return $user->isRh();
    }

    public function avancar(User $user, Application $application): bool
    {
        return $user->isRh();
    }

    public function delete(User $user, Application $application): bool
    {
        return $user->isRh();
    }
}
