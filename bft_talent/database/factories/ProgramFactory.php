<?php

namespace Database\Factories;

use App\Enums\ProgramCode;
use App\Models\Program;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Program>
 */
class ProgramFactory extends Factory
{
    public function definition(): array
    {
        $code = fake()->randomElement(ProgramCode::cases());

        return [
            'code' => $code->value,
            'name' => $code->label(),
            'descricao' => fake()->sentence(),
            'activo' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(['activo' => false]);
    }
}
