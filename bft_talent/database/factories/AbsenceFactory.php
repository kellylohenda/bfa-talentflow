<?php

namespace Database\Factories;

use App\Enums\AbsenceStatus;
use App\Enums\AbsenceTipo;
use App\Models\Absence;
use App\Models\Program;
use App\Models\Talent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Absence>
 */
class AbsenceFactory extends Factory
{
    public function definition(): array
    {
        static $seq = 1;
        $year = now()->format('Y');
        $start = fake()->dateTimeBetween('-3 months', 'now');
        $end = (clone $start)->modify('+'.fake()->numberBetween(1, 5).' days');

        return [
            'absence_code' => "AUS-{$year}-".str_pad($seq++, 5, '0', STR_PAD_LEFT),
            'talent_id' => Talent::factory(),
            'program_id' => Program::factory(),
            'approved_by_user_id' => null,
            'tipo' => fake()->randomElement(AbsenceTipo::cases()),
            'date_start' => $start,
            'date_end' => $end,
            'dias' => 1,
            'status' => AbsenceStatus::Pendente,
            'motivo' => fake()->sentence(),
        ];
    }

    public function aprovada(): static
    {
        return $this->state(['status' => AbsenceStatus::Aprovada]);
    }
}
