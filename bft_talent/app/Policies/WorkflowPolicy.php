<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Workflow;
use App\Enums\BfaRole;

class WorkflowPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(BfaRole::Rh, BfaRole::Direcao);
    }

    public function view(User $user, Workflow $workflow): bool
    {
        return $user->hasAnyRole(BfaRole::Rh, BfaRole::Direcao) 
            || ($user->isMentor() && $workflow->talent?->mentor_user_id === $user->id);
    }

    public function create(User $user): bool
    {
        return $user->isRh();
    }

    public function approve(User $user, Workflow $workflow): bool
    {
        return $user->canApproveWorkflow();
    }

    public function reject(User $user, Workflow $workflow): bool
    {
        return $user->canApproveWorkflow();
    }

    public function delete(User $user, Workflow $workflow): bool
    {
        return $user->isRh();
    }
}
