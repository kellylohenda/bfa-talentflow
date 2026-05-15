<?php

namespace Database\Seeders;

use App\Enums\BfaRole;
use App\Enums\TeamRole;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BfaTeamSeeder extends Seeder
{
    public function run(): void
    {
        $team = Team::firstOrCreate(
            ['slug' => 'bfa'],
            ['name' => 'BFA Talentos', 'is_personal' => false],
        );

        $mentors = [
            ['name' => 'Edmilson Cardoso', 'email' => 'edmilson@bfa.ao'],
            ['name' => 'Sofia Mendes',     'email' => 'sofia@bfa.ao'],
            ['name' => 'Patrícia Lopes',   'email' => 'patricia@bfa.ao'],
            ['name' => 'José Almeida',     'email' => 'jose@bfa.ao'],
            ['name' => 'Domingos Vieira',  'email' => 'domingos@bfa.ao'],
            ['name' => 'Lina Cazimba',     'email' => 'lina@bfa.ao'],
        ];

        foreach ($mentors as $mentorData) {
            $user = User::firstOrCreate(
                ['email' => $mentorData['email']],
                [
                    'name' => $mentorData['name'],
                    'password' => Hash::make('password'),
                    'bfa_role' => BfaRole::Mentor,
                ],
            );

            $team->members()->syncWithoutDetaching([
                $user->id => ['role' => TeamRole::Member->value],
            ]);

            if (is_null($user->current_team_id)) {
                $user->update(['current_team_id' => $team->id]);
            }
        }

        // Attach all existing BFA-domain users to the team
        $staffEmails = ['rh@bfa.ao', 'direcao@bfa.ao', 'mentor@bfa.ao', 'bolseiro@bfa.ao', 'estagiario@bfa.ao', 'voluntario@bfa.ao'];
        User::whereIn('email', $staffEmails)->each(function (User $user) use ($team) {
            $role = match ($user->bfa_role) {
                BfaRole::Rh, BfaRole::Direcao => TeamRole::Admin,
                default => TeamRole::Member,
            };

            $team->members()->syncWithoutDetaching([
                $user->id => ['role' => $role->value],
            ]);

            if (is_null($user->current_team_id)) {
                $user->update(['current_team_id' => $team->id]);
            }
        });
    }
}
