<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        $programs = [
            ['code' => 'fbfa', 'name' => 'Futuro BFA (Trainee)', 'tag' => 'Trainee · 24 meses', 'descricao' => '24 meses · trainee · contrato no fim · sede Luanda'],
            ['code' => 'bif', 'name' => 'Bolsa Internacional', 'tag' => 'Bolsa · até 5 anos', 'descricao' => 'Mestrado em Portugal/Europa · cobertura integral · cláusula 5 anos'],
            ['code' => 'bnac', 'name' => 'Bolsa Nacional', 'tag' => 'Bolsa · até 4 anos', 'descricao' => 'Licenciatura em universidade angolana · subsídio + propinas'],
            ['code' => 'mest', 'name' => 'Mestrado Patrocinado', 'tag' => 'Bolsa · até 3 anos', 'descricao' => 'Financiamento de mestrados estratégicos.'],
            ['code' => 'lid', 'name' => 'Liderança+', 'tag' => 'Liderança · 18 meses', 'descricao' => 'Apenas colaboradores BFA · MBA executivo · 18 meses'],
        ];

        foreach ($programs as $program) {
            Program::firstOrCreate(['code' => $program['code']], $program);
        }
    }
}
