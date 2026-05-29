<?php

namespace Database\Factories;

use App\Models\Workflow;
use App\Models\WorkflowStep;
use Illuminate\Database\Eloquent\Factories\Factory;

class WorkflowStepFactory extends Factory
{
    protected $model = WorkflowStep::class;

    public function definition(): array
    {
        return [
            'workflow_id' => Workflow::factory(),
            'step_number' => 1,
            'approver_role' => 'rh',
            'decision' => null,
            'comentario' => null,
            'decided_at' => null,
        ];
    }
}
