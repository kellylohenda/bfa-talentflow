<?php

namespace Database\Factories;

use App\Enums\Formato;
use App\Enums\MentorSessionStatus;
use App\Models\MentorSession;
use App\Models\Talent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MentorSession>
 */
class MentorSessionFactory extends Factory
{
    public function definition(): array
    {
        static $seq = 1;
        $year = now()->format('Y');

        return [
            'session_code' => "SES-{$year}-".str_pad($seq++, 5, '0', STR_PAD_LEFT),
            'talent_id' => Talent::factory(),
            'mentor_user_id' => User::factory()->asMentor(),
            'scheduled_at' => now()->addDays(fake()->numberBetween(1, 14)),
            'duracao_min' => fake()->randomElement([30, 45, 60, 90]),
            'status' => MentorSessionStatus::Agendada,
            'formato' => fake()->randomElement(Formato::cases()),
            'notas' => null,
            'accoes' => null,
        ];
    }

    public function realizada(): static
    {
        return $this->state([
            'status' => MentorSessionStatus::Realizada,
            'scheduled_at' => now()->subDays(fake()->numberBetween(1, 30)),
            'notas' => fake()->paragraph(),
        ]);
    }
}
