<?php

namespace Database\Factories;

use App\Models\Evaluation;
use App\Models\Program;
use App\Models\Talent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Evaluation>
 */
class EvaluationFactory extends Factory
{
    public function definition(): array
    {
        $score = fake()->numberBetween(0, 100);
        $classificacao = match (true) {
            $score >= 90 => 'excelente',
            $score >= 75 => 'muito_bom',
            $score >= 60 => 'bom',
            $score >= 50 => 'suficiente',
            default => 'insuficiente',
        };

        return [
            'talent_id' => Talent::factory(),
            'program_id' => Program::factory(),
            'evaluator_user_id' => User::factory()->asMentor(),
            'period' => now()->subMonths(fake()->numberBetween(0, 6))->format('Y-m'),
            'tipo' => fake()->randomElement(['trimestral', 'semestral', 'final']),
            'score' => $score,
            'classificacao' => $classificacao,
            'pontos_fortes' => fake()->sentence(),
            'areas_melhoria' => fake()->sentence(),
            'comentarios' => fake()->paragraph(),
        ];
    }
}
