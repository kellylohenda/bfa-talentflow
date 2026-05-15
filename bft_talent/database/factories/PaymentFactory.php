<?php

namespace Database\Factories;

use App\Enums\PaymentStatus;
use App\Enums\PaymentType;
use App\Models\Payment;
use App\Models\Talent;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        static $seq = 1;
        $year = now()->format('Y');
        $talentId = null;
        $period = now()->subMonths(fake()->numberBetween(0, 6))->format('Y-m');
        $type = fake()->randomElement(PaymentType::cases())->value;

        return [
            'payment_ref' => "PAG-{$year}-".str_pad($seq++, 5, '0', STR_PAD_LEFT),
            'idempotency_key' => Str::uuid()->toString(),
            'talent_id' => Talent::factory(),
            'workflow_id' => null,
            'type' => $type,
            'period' => $period,
            'amount' => fake()->randomFloat(2, 200, 5000),
            'currency' => 'AOA',
            'status' => PaymentStatus::Pendente,
            'method' => 'transferencia',
            'paid_at' => null,
            'observacoes' => null,
        ];
    }

    public function pago(): static
    {
        return $this->state([
            'status' => PaymentStatus::Pago,
            'paid_at' => now()->subDays(fake()->numberBetween(1, 30)),
        ]);
    }
}
