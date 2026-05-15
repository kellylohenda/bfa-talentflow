<?php

namespace Database\Seeders;

use App\Models\ProcessStep;
use Illuminate\Database\Seeder;

class ProcessStepSeeder extends Seeder
{
    public function run(): void
    {
        $steps = [
            ['period' => '01 · ATÉ 30 JUN', 'title' => 'Candidatura online', 'description' => 'Preenche o formulário, anexa o CV e o histórico académico. Demora cerca de 15 minutos.', 'sort_order' => 1],
            ['period' => '02 · JUL', 'title' => 'Avaliação técnica', 'description' => 'Provas online de raciocínio quantitativo, lógica e inglês. Resultado em 7 dias.', 'sort_order' => 2],
            ['period' => '03 · AGO', 'title' => 'Assessment Day', 'description' => 'Dia presencial na sede do BFA com dinâmicas de grupo, business case e entrevistas.', 'sort_order' => 3],
            ['period' => '04 · SET', 'title' => 'Resultado & Onboarding', 'description' => 'Comunicação formal, assinatura de contrato e arranque do programa em Outubro.', 'sort_order' => 4],
        ];

        foreach ($steps as $step) {
            ProcessStep::create($step);
        }
    }
}
