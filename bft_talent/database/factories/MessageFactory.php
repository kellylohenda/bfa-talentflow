<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Message>
 */
class MessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'from_user_id' => User::factory(),
            'to_user_id' => User::factory(),
            'subject' => fake()->sentence(4),
            'body' => fake()->paragraphs(2, true),
            'tipo' => fake()->randomElement(['geral', 'notificacao', 'alerta']),
            'read_at' => null,
        ];
    }

    public function lida(): static
    {
        return $this->state(['read_at' => now()->subHour()]);
    }
}
