<?php

namespace Database\Factories;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Models\Talent;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    public function definition(): array
    {
        static $seq = 1;
        $year = now()->format('Y');

        return [
            'task_code' => "TSK-{$year}-".str_pad($seq++, 5, '0', STR_PAD_LEFT),
            'talent_id' => Talent::factory(),
            'assigned_by_user_id' => User::factory()->asRh(),
            'title' => fake()->sentence(4),
            'descricao' => fake()->paragraph(),
            'status' => TaskStatus::Pendente,
            'prioridade' => TaskPriority::Media,
            'due_date' => now()->addWeeks(2),
            'completed_at' => null,
        ];
    }

    public function concluida(): static
    {
        return $this->state([
            'status' => TaskStatus::Concluida,
            'completed_at' => now()->subDays(1),
        ]);
    }

    public function urgente(): static
    {
        return $this->state(['prioridade' => TaskPriority::Alta]);
    }
}
