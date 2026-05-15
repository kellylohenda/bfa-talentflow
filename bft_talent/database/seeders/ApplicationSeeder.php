<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Program;
use App\Models\University;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $programs = Program::pluck('id', 'code');

        // Abbreviation → full name mapping used in data.ts
        $uniMap = [
            'UAN' => 'Universidade Agostinho Neto',
            'UCAN' => 'Universidade Católica de Angola',
            'Lusíada' => 'Universidade Lusíada de Angola',
            'Nova SBE' => 'Nova SBE',
            'Porto' => 'Universidade do Porto',
            'HEC Paris' => 'HEC Paris',
            'Coimbra' => 'Universidade de Coimbra',
            'ISCTE-IUL' => 'ISCTE-IUL',
            'LSE' => 'LSE',
        ];
        $universities = University::pluck('id', 'name');

        // stage mapping: data.ts → ApplicationStage enum
        $stageMap = [
            'triagem' => 'analise',
            'entrevista1' => 'entrevista',
            'entrevista2' => 'entrevista',
            'avaliacao' => 'avaliacao',
            'aprovacao' => 'oferta',
            'oferta' => 'oferta',
            'rejeitado' => 'rejeitado',
        ];

        $applications = [
            ['ref' => 'A-2451', 'name' => 'Tomás Quissanga',  'email' => 'tomas.quissanga@email.ao',  'program' => 'fbfa', 'tipo' => 'estagiario', 'stage' => 'triagem',     'score' => 78,  'uni' => 'UAN'],
            ['ref' => 'A-2452', 'name' => 'Kissila Mbumba',   'email' => 'kissila.mbumba@email.ao',   'program' => 'fbfa', 'tipo' => 'estagiario', 'stage' => 'triagem',     'score' => 84,  'uni' => 'UCAN'],
            ['ref' => 'A-2453', 'name' => 'Nelson Cassule',   'email' => 'nelson.cassule@email.ao',   'program' => 'bif',  'tipo' => 'bolseiro',   'stage' => 'entrevista1', 'score' => 81,  'uni' => 'Nova SBE'],
            ['ref' => 'A-2454', 'name' => 'Inês Caholo',      'email' => 'ines.caholo@email.ao',      'program' => 'fbfa', 'tipo' => 'estagiario', 'stage' => 'entrevista1', 'score' => 88,  'uni' => 'UAN'],
            ['ref' => 'A-2455', 'name' => 'Pedro Bastos',     'email' => 'pedro.bastos@email.ao',     'program' => 'fbfa', 'tipo' => 'estagiario', 'stage' => 'entrevista2', 'score' => 91,  'uni' => 'UCAN'],
            ['ref' => 'A-2456', 'name' => 'Eunice Bula',      'email' => 'eunice.bula@email.ao',      'program' => 'bnac', 'tipo' => 'bolseiro',   'stage' => 'avaliacao',   'score' => 86,  'uni' => 'Lusíada'],
            ['ref' => 'A-2457', 'name' => 'Vitor Sambongo',   'email' => 'vitor.sambongo@email.ao',   'program' => 'fbfa', 'tipo' => 'estagiario', 'stage' => 'avaliacao',   'score' => 89,  'uni' => 'UCAN'],
            ['ref' => 'A-2458', 'name' => 'Cláudia Ngongo',   'email' => 'claudia.ngongo@email.ao',   'program' => 'mest', 'tipo' => 'bolseiro',   'stage' => 'aprovacao',   'score' => 93,  'uni' => 'Porto'],
            ['ref' => 'A-2459', 'name' => 'Rui Manjate',      'email' => 'rui.manjate@email.ao',      'program' => 'bif',  'tipo' => 'bolseiro',   'stage' => 'aprovacao',   'score' => 90,  'uni' => 'HEC Paris'],
            ['ref' => 'A-2460', 'name' => 'Liliana Bange',    'email' => 'liliana.bange@email.ao',    'program' => 'fbfa', 'tipo' => 'estagiario', 'stage' => 'oferta',      'score' => 92,  'uni' => 'UAN'],
            ['ref' => 'A-2461', 'name' => 'Fábio Quitumba',   'email' => 'fabio.quitumba@email.ao',   'program' => 'fbfa', 'tipo' => 'estagiario', 'stage' => 'oferta',      'score' => 87,  'uni' => 'UCAN'],
            ['ref' => 'A-2462', 'name' => 'Marta Ngonga',     'email' => 'marta.ngonga@email.ao',     'program' => 'bnac', 'tipo' => 'bolseiro',   'stage' => 'rejeitado',   'score' => 54,  'uni' => 'Lusíada'],
        ];

        foreach ($applications as $a) {
            $uniName = $uniMap[$a['uni']] ?? null;
            Application::firstOrCreate(
                ['application_ref' => $a['ref']],
                [
                    'name' => $a['name'],
                    'email' => $a['email'],
                    'program_id' => $programs[$a['program']] ?? null,
                    'university_id' => $uniName ? ($universities[$uniName] ?? null) : null,
                    'tipo' => $a['tipo'],
                    'stage' => $stageMap[$a['stage']],
                    'score' => $a['score'],
                ],
            );
        }
    }
}
