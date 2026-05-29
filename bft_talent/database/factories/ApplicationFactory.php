<?php

namespace Database\Factories;

use App\Enums\ApplicationStage;
use App\Models\Application;
use App\Models\Program;
use App\Models\University;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Application>
 */
class ApplicationFactory extends Factory
{
    public function definition(): array
    {
        static $seq = 1;
        $year = now()->format('Y');

        return [
            'application_ref' => "APP-{$year}-".str_pad($seq++, 5, '0', STR_PAD_LEFT),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'program_id' => Program::factory(),
            'university_id' => University::factory(),
            'tipo' => fake()->randomElement(['bolseiro', 'estagiario']),
            'stage' => ApplicationStage::Analise,
            'score' => 0,
            'observacoes' => null,
            'converted_talent_id' => null,
        ];
    }

    public function convertida(): static
    {
        return $this->state(['stage' => ApplicationStage::Convertido]);
    }

    public function rejeitada(): static
    {
        return $this->state(['stage' => ApplicationStage::Rejeitado]);
    }
}
