<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\VolunteerActivity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VolunteerActivity>
 */
class VolunteerActivityFactory extends Factory
{
    public function definition(): array
    {
        static $seq = 1;
        $year = now()->format('Y');

        return [
            'activity_code' => "ACT-{$year}-".str_pad($seq++, 4, '0', STR_PAD_LEFT),
            'nome' => fake()->sentence(3),
            'tipo' => fake()->randomElement(['comunitario', 'ambiental', 'educacional', 'social']),
            'coordenador_user_id' => User::factory()->asRh(),
            'data' => fake()->dateTimeBetween('now', '+3 months'),
            'hora_inicio' => '09:00',
            'hora_fim' => '17:00',
            'local' => fake()->address(),
            'vagas_total' => fake()->numberBetween(10, 50),
            'inscritos_count' => 0,
            'status' => 'planeada',
            'descricao' => fake()->paragraph(),
        ];
    }
}
