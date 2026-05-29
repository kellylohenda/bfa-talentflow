<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Volunteer;
use App\Enums\BfaRole;

class VolunteerPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isStaff();
    }

    public function view(User $user, Volunteer $volunteer): bool
    {
        if ($user->isStaff()) {
            return true;
        }

        return $user->volunteer_id === $volunteer->id;
    }

    public function create(User $user): bool
    {
        return $user->isRh();
    }

    public function update(User $user, Volunteer $volunteer): bool
    {
        return $user->isRh();
    }

    public function delete(User $user, Volunteer $volunteer): bool
    {
        return $user->isRh();
    }
}
