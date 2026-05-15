<?php

namespace Database\Factories;

use App\Enums\VolunteerStatus;
use App\Models\Volunteer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Volunteer>
 */
class VolunteerFactory extends Factory
{
    public function definition(): array
    {
        static $seq = 1;
        $year = now()->format('Y');

        return [
            'volunteer_code' => "VOL-{$year}-".str_pad($seq++, 4, '0', STR_PAD_LEFT),
            'nome' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'status' => VolunteerStatus::Activo,
            'area_actuacao' => fake()->randomElement(['Educação', 'Saúde', 'Ambiente', 'Tecnologia']),
            'total_horas' => 0,
            'mentor_user_id' => null,
            'data_inicio' => fake()->dateTimeBetween('-2 years', 'now'),
            'motivacao' => fake()->sentence(),
        ];
    }

    public function inactivo(): static
    {
        return $this->state(['status' => VolunteerStatus::Inactivo]);
    }
}
