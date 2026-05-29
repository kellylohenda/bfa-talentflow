<?php

namespace Database\Factories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Department>
 */
class DepartmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $seq = 1;

        return [
            'name' => fake()->unique()->company() . ' ' . $seq,
            'codigo' => 'DEP-'.str_pad($seq++, 3, '0', STR_PAD_LEFT),
            'activo' => true,
        ];
    }
}
