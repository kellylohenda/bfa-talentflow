<?php

namespace Database\Factories;

use App\Enums\TalentKind;
use App\Enums\TalentStatus;
use App\Models\Department;
use App\Models\Program;
use App\Models\Talent;
use App\Models\University;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Talent>
 */
class TalentFactory extends Factory
{
    public function definition(): array
    {
        static $seq = 1;
        $year = now()->format('Y');

        return [
            'talent_code' => "TAL-{$year}-".str_pad($seq++, 5, '0', STR_PAD_LEFT),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'kind' => TalentKind::Bolseiro,
            'status' => TalentStatus::Activo,
            'program_id' => Program::factory(),
            'university_id' => University::factory(),
            'department_id' => Department::factory(),
            'mentor_user_id' => null,
            'application_id' => null,
            'stipend' => fake()->randomFloat(2, 500, 3000),
            'perf' => null,
            'risk_score' => null,
            'start_date' => now()->subMonths(fake()->numberBetween(1, 12)),
            'end_date' => now()->addMonths(fake()->numberBetween(6, 24)),
            'observacoes' => null,
        ];
    }

    public function estagiario(): static
    {
        return $this->state(['kind' => TalentKind::Estagiario]);
    }

    public function inactivo(): static
    {
        return $this->state(['status' => TalentStatus::Concluido]);
    }
}
