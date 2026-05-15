<?php

namespace Database\Factories;

use App\Enums\RotationStatus;
use App\Models\Department;
use App\Models\Rotation;
use App\Models\Talent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Rotation>
 */
class RotationFactory extends Factory
{
    public function definition(): array
    {
        static $seq = 1;
        $year = now()->format('Y');

        return [
            'rotation_code' => "ROT-{$year}-".str_pad($seq++, 4, '0', STR_PAD_LEFT),
            'talent_id' => Talent::factory(),
            'department_id' => Department::factory(),
            'supervisor' => fake()->name(),
            'status' => RotationStatus::Activa,
            'start_date' => now()->subMonths(2),
            'end_date' => now()->addMonths(4),
            'objectivos' => fake()->sentence(),
            'avaliacao_final' => null,
        ];
    }

    public function concluida(): static
    {
        return $this->state([
            'status' => RotationStatus::Concluida,
            'avaliacao_final' => fake()->numberBetween(60, 100),
        ]);
    }
}
