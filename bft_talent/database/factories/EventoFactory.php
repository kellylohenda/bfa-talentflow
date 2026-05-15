<?php

namespace Database\Factories;

use App\Enums\EventoStatus;
use App\Enums\EventoTipo;
use App\Enums\Formato;
use App\Models\Evento;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Evento>
 */
class EventoFactory extends Factory
{
    public function definition(): array
    {
        static $seq = 1;
        $year = now()->format('Y');
        $start = now()->addDays(fake()->numberBetween(7, 60));

        return [
            'event_code' => "EVT-{$year}-".str_pad($seq++, 4, '0', STR_PAD_LEFT),
            'titulo' => fake()->sentence(3),
            'tipo' => fake()->randomElement(EventoTipo::cases()),
            'data_inicio' => $start,
            'data_fim' => (clone $start)->addHours(fake()->numberBetween(2, 8)),
            'local' => fake()->address(),
            'formato' => fake()->randomElement(Formato::cases()),
            'vagas' => fake()->optional()->numberBetween(10, 100),
            'status' => EventoStatus::Planeado,
            'descricao' => fake()->paragraph(),
        ];
    }

    public function concluido(): static
    {
        return $this->state([
            'status' => EventoStatus::Concluido,
            'data_inicio' => now()->subDays(fake()->numberBetween(1, 30)),
        ]);
    }
}
