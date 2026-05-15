<?php

namespace App\Policies;

use App\Enums\BfaRole;
use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(BfaRole::Rh, BfaRole::Direcao);
    }

    public function view(User $user, Payment $payment): bool
    {
        if ($user->hasAnyRole(BfaRole::Rh, BfaRole::Direcao)) {
            return true;
        }

        // Bolseiro/estagiário vê apenas os próprios pagamentos
        return $user->talent_id === $payment->talent_id;
    }

    public function create(User $user): bool
    {
        return $user->isRh();
    }

    public function update(User $user, Payment $payment): bool
    {
        // Só pode alterar pagamentos pendentes
        return $user->isRh() && $payment->status->value === 'pendente';
    }

    public function delete(User $user, Payment $payment): bool
    {
        return $user->isRh() && $payment->status->value === 'pendente';
    }
}
