<?php

namespace Database\Seeders;

use App\Enums\BfaRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BfaUserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Maria Santos (RH)',
                'email' => 'rh@bfa.ao',
                'password' => Hash::make('password'),
                'bfa_role' => BfaRole::Rh,
            ],
            [
                'name' => 'João Direcção',
                'email' => 'direcao@bfa.ao',
                'password' => Hash::make('password'),
                'bfa_role' => BfaRole::Direcao,
            ],
            [
                'name' => 'Ana Mentor',
                'email' => 'mentor@bfa.ao',
                'password' => Hash::make('password'),
                'bfa_role' => BfaRole::Mentor,
            ],
            [
                'name' => 'Carlos Bolseiro',
                'email' => 'bolseiro@bfa.ao',
                'password' => Hash::make('password'),
                'bfa_role' => BfaRole::Bolseiro,
            ],
            [
                'name' => 'Sofia Estagiária',
                'email' => 'estagiario@bfa.ao',
                'password' => Hash::make('password'),
                'bfa_role' => BfaRole::Estagiario,
            ],
            [
                'name' => 'Paulo Voluntário',
                'email' => 'voluntario@bfa.ao',
                'password' => Hash::make('password'),
                'bfa_role' => BfaRole::Voluntario,
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData,
            );
        }
    }
}
