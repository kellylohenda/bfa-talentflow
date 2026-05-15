<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\ProgramBenefit;
use Illuminate\Database\Seeder;

class ProgramBenefitSeeder extends Seeder
{
    public function run(): void
    {
        $benefits = [
            'fbfa' => ['Subsídio mensal · Kz 380.000', 'Formação certificada (CFA, IFB)', 'Mentor sénior dedicado', 'Garantia de contrato · 87% admitidos'],
            'bif' => ['Propina + alojamento + subsistência', 'Universidades top: Nova SBE, HEC, LSE', 'Cláusula de retorno · 5 anos no BFA', 'Visitas trimestrais a Luanda'],
            'bnac' => ['Propina + subsídio mensal · Kz 220.000', 'UAN, UCAN, ULA e parceiras provinciais', 'Estágio anual obrigatório no BFA', 'Acompanhamento académico contínuo'],
            'mest' => ['Propina + subsídio de vida', 'Mestrados estratégicos patrocinados', 'Projeto de investigação aplicada', 'Integração directa na Direcção'],
            'lid' => ['MBA executivo patrocinado', 'Job-shadowing com Direcção', 'Projecto estratégico real', 'Promoção garantida no fim'],
        ];

        foreach ($benefits as $code => $items) {
            $program = Program::where('code', $code)->first();
            if (! $program) {
                continue;
            }

            foreach ($items as $i => $text) {
                ProgramBenefit::create([
                    'program_id' => $program->id,
                    'text' => $text,
                    'sort_order' => $i + 1,
                ]);
            }
        }
    }
}
