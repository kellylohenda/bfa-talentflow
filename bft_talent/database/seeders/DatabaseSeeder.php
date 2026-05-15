<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ProgramSeeder::class,
            StageSeeder::class,
            BfaUserSeeder::class,
            UniversitySeeder::class,
            DepartmentSeeder::class,
            BfaTeamSeeder::class,
            TalentSeeder::class,
            ApplicationSeeder::class,
            PaymentSeeder::class,
            VolunteerSeeder::class,
            EventoSeeder::class,
            WorkflowSeeder::class,
        ]);
    }
}
