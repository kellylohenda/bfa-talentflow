<?php

namespace Database\Seeders;

use App\Models\Talent;
use App\Models\Workflow;
use Illuminate\Database\Seeder;

class WorkflowSeeder extends Seeder
{
    public function run(): void
    {
        $talents = Talent::pluck('id', 'talent_code');

        $workflows = [
            ['code' => 'WF-2451', 'talent' => 'T-1054', 'type' => 'pagamento', 'amount' => 3120000, 'step' => 3, 'total' => 4, 'status' => 'em_aprovacao', 'descricao' => 'Propina LSE — 2026 T2'],
            ['code' => 'WF-2452', 'talent' => 'T-1051', 'type' => 'pagamento', 'amount' => 2640000, 'step' => 2, 'total' => 4, 'status' => 'em_aprovacao', 'descricao' => 'Propina HEC Paris — 2026 T2'],
            ['code' => 'WF-2453', 'talent' => 'T-1046', 'type' => 'pagamento', 'amount' => 480000,  'step' => 4, 'total' => 4, 'status' => 'aprovado',     'descricao' => 'Alojamento Porto — Abril 2026'],
            ['code' => 'WF-2454', 'talent' => 'T-1042', 'type' => 'pagamento', 'amount' => 380000,  'step' => 2, 'total' => 4, 'status' => 'em_aprovacao', 'descricao' => 'Subsídio mensal — lote Abril 2026'],
            ['code' => 'WF-2455', 'talent' => 'T-1052', 'type' => 'pagamento', 'amount' => 200000,  'step' => 1, 'total' => 4, 'status' => 'pendente',     'descricao' => 'Subsídio revisão — Walter Tchitangueleca'],
            ['code' => 'WF-2456', 'talent' => 'T-1049', 'type' => 'pagamento', 'amount' => 1780000, 'step' => 1, 'total' => 4, 'status' => 'pendente',     'descricao' => 'Reprocessamento SWIFT — Nzinga Matondo'],
        ];

        foreach ($workflows as $w) {
            Workflow::firstOrCreate(
                ['workflow_code' => $w['code']],
                [
                    'talent_id' => $talents[$w['talent']] ?? null,
                    'type' => $w['type'],
                    'amount' => $w['amount'],
                    'status' => $w['status'],
                    'current_step' => $w['step'],
                    'total_steps' => $w['total'],
                    'descricao' => $w['descricao'],
                ],
            );
        }
    }
}
