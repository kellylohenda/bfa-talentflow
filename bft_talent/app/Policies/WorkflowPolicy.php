<?php

namespace App\Policies;

use App\Enums\BfaRole;
use App\Models\User;
use App\Models\Workflow;

class WorkflowPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(BfaRole::Rh, BfaRole::Direcao, BfaRole::Mentor);
    }

    public function view(User $user, Workflow $workflow): bool
    {
        return $user->hasAnyRole(BfaRole::Rh, BfaRole::Direcao);
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
}
