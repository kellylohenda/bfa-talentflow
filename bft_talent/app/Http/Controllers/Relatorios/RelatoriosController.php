<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Payment;
use App\Models\Talent;
use App\Models\Volunteer;
use App\Models\Workflow;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

class RelatoriosController extends Controller
{
    public function index(): \Inertia\Response
    {
        $this->authorize('ver-analytics');

        return Inertia::render('relatorios/index', [
            'stats' => Inertia::defer(fn () => [
                'talentos' => [
                    'total' => Talent::count(),
                    'activos' => Talent::where('status', 'activo')->count(),
                    'bolseiros' => Talent::where('kind', 'bolseiro')->count(),
                    'estagiarios' => Talent::where('kind', 'estagiario')->count(),
                ],
                'candidaturas' => [
                    'total' => Application::count(),
                    'pendentes' => Application::where('status', 'pendente')->count(),
                    'aprovadas' => Application::where('status', 'aprovada')->count(),
                    'rejeitadas' => Application::where('status', 'rejeitada')->count(),
                ],
                'pagamentos' => [
                    'total' => Payment::count(),
                    'pendentes' => Payment::where('status', 'pendente')->count(),
                    'pagos' => Payment::where('status', 'pago')->count(),
                    'valor_total' => Payment::where('status', 'pago')->sum('amount'),
                ],
                'voluntarios' => [
                    'total' => Volunteer::count(),
                    'activos' => Volunteer::where('status', 'activo')->count(),
                ],
                'workflows' => [
                    'pendentes' => Workflow::where('status', 'pendente')->count(),
                    'em_aprovacao' => Workflow::where('status', 'em_aprovacao')->count(),
                ],
            ]),
        ]);
    }

    public function export(Request $request): Response
    {
        $this->authorize('ver-analytics');

        $type = $request->input('type', 'talentos');

        $filename = $type.'_'.now()->format('Y-m-d_His').'.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($type) {
            $file = fopen('php://output', 'w');

            match ($type) {
                'talentos' => $this->exportTalentos($file),
                'candidaturas' => $this->exportCandidaturas($file),
                'pagamentos' => $this->exportPagamentos($file),
                'voluntarios' => $this->exportVoluntarios($file),
                'workflows' => $this->exportWorkflows($file),
                default => $this->exportTalentos($file),
            };

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportTalentos($file): void
    {
        fputcsv($file, ['Código', 'Nome', 'Email', 'Tipo', 'Estado', 'Programa', 'Universidade', 'Estipêndio', 'Desempenho', 'Risco']);

        Talent::with(['program', 'university'])->chunk(200, function ($talents) use ($file) {
            foreach ($talents as $t) {
                fputcsv($file, [
                    $t->talent_code,
                    $t->name,
                    $t->email,
                    $t->kind,
                    $t->status,
                    $t->program?->name,
                    $t->university?->name,
                    $t->stipend,
                    $t->perf,
                    $t->risk_score,
                ]);
            }
        });
    }

    private function exportCandidaturas($file): void
    {
        fputcsv($file, ['Código', 'Nome', 'Email', 'Telefone', 'Programa', 'Universidade', 'Tipo', 'Fase', 'Pontuação']);

        Application::with(['program', 'university'])->chunk(200, function ($apps) use ($file) {
            foreach ($apps as $a) {
                fputcsv($file, [
                    $a->application_ref,
                    $a->name,
                    $a->email,
                    $a->phone,
                    $a->program?->name,
                    $a->university?->name,
                    $a->tipo,
                    $a->stage,
                    $a->score,
                ]);
            }
        });
    }

    private function exportPagamentos($file): void
    {
        fputcsv($file, ['Referência', 'Talento ID', 'Tipo', 'Período', 'Montante', 'Moeda', 'Estado', 'Método', 'Data Pagamento']);

        Payment::chunk(200, function ($payments) use ($file) {
            foreach ($payments as $p) {
                fputcsv($file, [
                    $p->payment_ref,
                    $p->talent_id,
                    $p->type,
                    $p->period,
                    $p->amount,
                    $p->currency,
                    $p->status,
                    $p->method,
                    $p->paid_at?->format('Y-m-d H:i:s'),
                ]);
            }
        });
    }

    private function exportVoluntarios($file): void
    {
        fputcsv($file, ['Código', 'Nome', 'Email', 'Telefone', 'Estado', 'Área', 'Total Horas']);

        Volunteer::chunk(200, function ($volunteers) use ($file) {
            foreach ($volunteers as $v) {
                fputcsv($file, [
                    $v->volunteer_code,
                    $v->nome,
                    $v->email,
                    $v->phone,
                    $v->status,
                    $v->area_actuacao,
                    $v->total_horas,
                ]);
            }
        });
    }

    private function exportWorkflows($file): void
    {
        fputcsv($file, ['Código', 'Talento ID', 'Tipo', 'Montante', 'Urgência', 'Estado', 'Passo Actual', 'Total Passos']);

        Workflow::chunk(200, function ($workflows) use ($file) {
            foreach ($workflows as $w) {
                fputcsv($file, [
                    $w->workflow_code,
                    $w->talent_id,
                    $w->type,
                    $w->amount,
                    $w->urgency,
                    $w->status,
                    $w->current_step,
                    $w->total_steps,
                ]);
            }
        });
    }
}
