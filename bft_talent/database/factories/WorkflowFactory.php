<?php

namespace Database\Factories;

use App\Enums\WorkflowStatus;
use App\Enums\WorkflowType;
use App\Models\Talent;
use App\Models\Workflow;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Workflow>
 */
class WorkflowFactory extends Factory
{
    public function definition(): array
    {
        static $seq = 1;
        $year = now()->format('Y');

        return [
            'workflow_code' => "WFL-{$year}-".str_pad($seq++, 5, '0', STR_PAD_LEFT),
            'talent_id' => Talent::factory(),
            'type' => fake()->randomElement(WorkflowType::cases()),
            'amount' => fake()->optional()->randomFloat(2, 200, 5000),
            'urgency' => fake()->randomElement(['normal', 'urgente']),
            'status' => WorkflowStatus::Pendente,
            'current_step' => 1,
            'total_steps' => 3,
            'descricao' => fake()->sentence(),
        ];
    }

    public function aprovado(): static
    {
        return $this->state(['status' => WorkflowStatus::Aprovado]);
    }

    public function emAprovacao(): static
    {
        return $this->state(['status' => WorkflowStatus::EmAprovacao]);
    }
}
