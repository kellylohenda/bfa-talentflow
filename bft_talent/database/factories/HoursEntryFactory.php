<?php

namespace Database\Factories;

use App\Models\HoursEntry;
use App\Models\Volunteer;
use App\Models\VolunteerActivity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HoursEntry>
 */
class HoursEntryFactory extends Factory
{
    public function definition(): array
    {
        static $seq = 1;
        $year = now()->format('Y');

        return [
            'hour_code' => "HRS-{$year}-".str_pad($seq++, 5, '0', STR_PAD_LEFT),
            'volunteer_id' => Volunteer::factory(),
            'activity_id' => VolunteerActivity::factory(),
            'data' => fake()->dateTimeBetween('-6 months', 'now'),
            'horas' => fake()->randomFloat(2, 1, 8),
            'descricao' => fake()->sentence(),
            'validado' => false,
            'validado_por_user_id' => null,
            'validado_at' => null,
        ];
    }

    public function validado(): static
    {
        return $this->state([
            'validado' => true,
            'validado_at' => now()->subDays(1),
        ]);
    }
}
