<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        $programs = [
            ['code' => 'fbfa', 'name' => 'Futuro BFA (Trainee)', 'descricao' => 'Programa de estágio interno para jovens talentos.'],
            ['code' => 'bif', 'name' => 'Bolsa Internacional', 'descricao' => 'Apoio a estudantes em universidades internacionais.'],
            ['code' => 'bnac', 'name' => 'Bolsa Nacional', 'descricao' => 'Apoio a estudantes em universidades nacionais.'],
            ['code' => 'mest', 'name' => 'Mestrado Patrocinado', 'descricao' => 'Financiamento de mestrados estratégicos.'],
            ['code' => 'lid', 'name' => 'Liderança+', 'descricao' => 'Programa de desenvolvimento de liderança interna.'],
        ];

        foreach ($programs as $program) {
            Program::firstOrCreate(['code' => $program['code']], $program);
        }
    }
}
