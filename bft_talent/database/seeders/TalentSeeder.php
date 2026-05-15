<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Program;
use App\Models\Talent;
use App\Models\University;
use App\Models\User;
use Illuminate\Database\Seeder;

class TalentSeeder extends Seeder
{
    public function run(): void
    {
        $programs = Program::pluck('id', 'code');
        $universities = University::pluck('id', 'name');
        $departments = Department::pluck('id', 'name');
        $mentors = User::whereIn('email', [
            'edmilson@bfa.ao', 'sofia@bfa.ao', 'patricia@bfa.ao',
            'jose@bfa.ao', 'domingos@bfa.ao', 'lina@bfa.ao',
        ])->pluck('id', 'name');

        // status mapping: data.ts → TalentStatus enum values
        $statusMap = [
            'active' => 'activo',
            'delayed' => 'activo',
            'risk' => 'activo',
            'onboarding' => 'activo',
            'pending' => 'activo',
            'completed' => 'concluido',
            'hired' => 'concluido',
        ];

        $talents = [
            ['code' => 'T-1042', 'name' => 'Lwini Capemba',         'program' => 'fbfa', 'kind' => 'estagiario', 'uni' => 'Universidade Agostinho Neto',    'dept' => 'Banca de Empresas', 'mentor' => 'Edmilson Cardoso', 'stipend' => 380000,  'start' => '2024-09-01', 'perf' => 92, 'risk' => 0.12, 'status' => 'active'],
            ['code' => 'T-1043', 'name' => 'Joaquim Tchindemba',    'program' => 'bif',  'kind' => 'bolseiro',   'uni' => 'Nova SBE',                       'dept' => null,                'mentor' => 'Sofia Mendes',     'stipend' => 1850000, 'start' => '2024-09-15', 'perf' => 88, 'risk' => 0.15, 'status' => 'active'],
            ['code' => 'T-1044', 'name' => 'Esperança Quimbamba',   'program' => 'bnac', 'kind' => 'bolseiro',   'uni' => 'Universidade Católica de Angola', 'dept' => null,                'mentor' => 'Domingos Vieira',  'stipend' => 220000,  'start' => '2023-10-02', 'perf' => 71, 'risk' => 0.42, 'status' => 'delayed'],
            ['code' => 'T-1045', 'name' => 'Yuran Bumba',           'program' => 'fbfa', 'kind' => 'estagiario', 'uni' => 'Universidade Agostinho Neto',    'dept' => 'TI / Sistemas',     'mentor' => 'Patrícia Lopes',   'stipend' => 420000,  'start' => '2023-09-01', 'perf' => 84, 'risk' => 0.20, 'status' => 'active'],
            ['code' => 'T-1046', 'name' => 'Domingas Kassinda',     'program' => 'mest', 'kind' => 'bolseiro',   'uni' => 'Universidade do Porto',          'dept' => null,                'mentor' => 'José Almeida',     'stipend' => 1620000, 'start' => '2025-09-12', 'perf' => 94, 'risk' => 0.08, 'status' => 'active'],
            ['code' => 'T-1047', 'name' => 'Adélio Sebastião',      'program' => 'bnac', 'kind' => 'bolseiro',   'uni' => 'Universidade Lusíada de Angola', 'dept' => null,                'mentor' => 'Lina Cazimba',     'stipend' => 240000,  'start' => '2022-09-20', 'perf' => 58, 'risk' => 0.78, 'status' => 'risk'],
            ['code' => 'T-1048', 'name' => 'Kiala Domingos',        'program' => 'lid',  'kind' => 'bolseiro',   'uni' => 'Universidade Agostinho Neto',    'dept' => 'Banca Privada',     'mentor' => 'Edmilson Cardoso', 'stipend' => 540000,  'start' => '2025-02-03', 'perf' => 96, 'risk' => 0.06, 'status' => 'active'],
            ['code' => 'T-1049', 'name' => 'Nzinga Matondo',        'program' => 'bif',  'kind' => 'bolseiro',   'uni' => 'ISCTE-IUL',                      'dept' => null,                'mentor' => 'Sofia Mendes',     'stipend' => 1780000, 'start' => '2024-09-10', 'perf' => 86, 'risk' => 0.18, 'status' => 'active'],
            ['code' => 'T-1050', 'name' => 'Fernando Ngoma',        'program' => 'fbfa', 'kind' => 'estagiario', 'uni' => 'Universidade Católica de Angola', 'dept' => 'Risco de Crédito', 'mentor' => 'Patrícia Lopes',  'stipend' => 380000,  'start' => '2026-03-01', 'perf' => 78, 'risk' => 0.22, 'status' => 'onboarding'],
            ['code' => 'T-1051', 'name' => 'Carla Bunga',           'program' => 'bif',  'kind' => 'bolseiro',   'uni' => 'HEC Paris',                      'dept' => null,                'mentor' => 'José Almeida',     'stipend' => 2640000, 'start' => '2025-09-20', 'perf' => 95, 'risk' => 0.10, 'status' => 'active'],
            ['code' => 'T-1052', 'name' => 'Walter Tchitangueleca', 'program' => 'bnac', 'kind' => 'bolseiro',   'uni' => 'Universidade Agostinho Neto',    'dept' => null,                'mentor' => 'Domingos Vieira',  'stipend' => 200000,  'start' => '2024-10-05', 'perf' => 64, 'risk' => 0.55, 'status' => 'delayed'],
            ['code' => 'T-1053', 'name' => 'Aida Bento',            'program' => 'fbfa', 'kind' => 'estagiario', 'uni' => 'Universidade Agostinho Neto',    'dept' => 'Marketing',         'mentor' => 'Lina Cazimba',     'stipend' => 420000,  'start' => '2023-09-01', 'perf' => 89, 'risk' => 0.14, 'status' => 'active'],
            ['code' => 'T-1054', 'name' => 'Heitor Quitumba',       'program' => 'mest', 'kind' => 'bolseiro',   'uni' => 'LSE',                            'dept' => null,                'mentor' => 'Sofia Mendes',     'stipend' => 3120000, 'start' => '2025-09-25', 'perf' => 91, 'risk' => 0.09, 'status' => 'active'],
            ['code' => 'T-1055', 'name' => 'Beatriz Sapalo',        'program' => 'bnac', 'kind' => 'bolseiro',   'uni' => 'Universidade Católica de Angola', 'dept' => null,               'mentor' => 'Domingos Vieira',  'stipend' => 0,       'start' => '2021-09-01', 'perf' => 82, 'risk' => 0.20, 'status' => 'completed', 'end' => '2026-03-30'],
            ['code' => 'T-1056', 'name' => 'Mateus Cabuenha',       'program' => 'fbfa', 'kind' => 'estagiario', 'uni' => 'Universidade Agostinho Neto',    'dept' => 'Auditoria Interna', 'mentor' => 'Patrícia Lopes',   'stipend' => 380000,  'start' => '2025-09-05', 'perf' => 81, 'risk' => 0.19, 'status' => 'active'],
            ['code' => 'T-1057', 'name' => 'Olívia Kambamba',       'program' => 'bif',  'kind' => 'bolseiro',   'uni' => 'Universidade de São Paulo',      'dept' => null,                'mentor' => 'José Almeida',     'stipend' => 1450000, 'start' => '2024-08-15', 'perf' => 87, 'risk' => 0.16, 'status' => 'active'],
            ['code' => 'T-1058', 'name' => 'Alberto Massano',       'program' => 'lid',  'kind' => 'bolseiro',   'uni' => 'Universidade Agostinho Neto',    'dept' => 'Banca de Empresas', 'mentor' => 'Edmilson Cardoso', 'stipend' => 0,       'start' => '2022-02-15', 'perf' => 94, 'risk' => 0.07, 'status' => 'hired',    'end' => '2026-04-15'],
            ['code' => 'T-1059', 'name' => 'Helga Pacavira',        'program' => 'bnac', 'kind' => 'bolseiro',   'uni' => 'Universidade Lusíada de Angola', 'dept' => null,                'mentor' => 'Lina Cazimba',     'stipend' => 220000,  'start' => '2023-10-15', 'perf' => 70, 'risk' => 0.40, 'status' => 'delayed'],
        ];

        foreach ($talents as $t) {
            Talent::firstOrCreate(
                ['talent_code' => $t['code']],
                [
                    'name' => $t['name'],
                    'kind' => $t['kind'],
                    'status' => $statusMap[$t['status']],
                    'program_id' => $programs[$t['program']] ?? null,
                    'university_id' => $universities[$t['uni']] ?? null,
                    'department_id' => $t['dept'] ? ($departments[$t['dept']] ?? null) : null,
                    'mentor_user_id' => $mentors[$t['mentor']] ?? null,
                    'stipend' => $t['stipend'],
                    'perf' => $t['perf'],
                    'risk_score' => $t['risk'],
                    'start_date' => $t['start'],
                    'end_date' => $t['end'] ?? null,
                ],
            );
        }
    }
}
