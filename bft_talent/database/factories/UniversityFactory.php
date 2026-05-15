<?php

namespace Database\Factories;

use App\Models\University;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<University>
 */
class UniversityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company().' Universidade',
            'city' => fake()->city(),
            'country' => fake()->randomElement(['Angola', 'Portugal', 'Brasil']),
            'activa' => true,
        ];
    }
}
