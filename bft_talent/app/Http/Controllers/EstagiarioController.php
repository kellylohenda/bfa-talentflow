<?php

namespace App\Http\Controllers;

use App\Models\Talent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EstagiarioController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $talent = Talent::where('id', $user->talent_id)
            ->where('kind', 'estagiario')
            ->with([
                'program', 'university', 'department', 'mentor',
                'rotations.department', 'payments', 'tasks', 'evaluations',
                'absences', 'mentorSessions',
            ])
            ->first();

        if (! $talent) {
            abort(404, 'Perfil de estagiário não encontrado.');
        }

        // Stats
        $activeRotation = $talent->rotations->where('status', 'activa')->first();
        $pendingTasks = $talent->tasks->where('status', 'pendente')->count();
        $overdueTasks = $talent->tasks->where('status', 'pendente')
            ->where('due_date', '<', now())->count();
        $lastPayment = $talent->payments->sortByDesc('paid_at')->first();
        $totalPayments = $talent->payments->where('status', 'pago')->sum('amount');

        return Inertia::render('estagiario/index', [
            'talent' => [
                'id' => $talent->id,
                'name' => $talent->name,
                'talent_code' => $talent->talent_code,
                'email' => $talent->email,
                'kind' => $talent->kind,
                'status' => $talent->status,
                'perf' => $talent->perf,
                'risk_score' => $talent->risk_score,
                'start_date' => $talent->start_date?->format('d/m/Y'),
                'stipend' => $talent->stipend,
                'observacoes' => $talent->observacoes,
                'program' => $talent->program ? [
                    'name' => $talent->program->name,
                    'code' => $talent->program->code,
                    'descricao' => $talent->program->descricao,
                ] : null,
                'university' => $talent->university ? [
                    'name' => $talent->university->name,
                    'city' => $talent->university->city,
                ] : null,
                'department' => $talent->department ? [
                    'name' => $talent->department->name,
                ] : null,
                'mentor' => $talent->mentor ? [
                    'name' => $talent->mentor->name,
                    'email' => $talent->mentor->email,
                ] : null,
            ],
            'rotations' => $talent->rotations
                ->sortByDesc('start_date')
                ->map(fn ($r) => [
                    'id' => $r->id,
                    'department' => $r->department?->name ?? '—',
                    'supervisor' => $r->supervisor ?? '—',
                    'start_date' => $r->start_date?->format('d/m/Y'),
                    'end_date' => $r->end_date?->format('d/m/Y'),
                    'status' => $r->status,
                    'objectivos' => $r->objectivos,
                    'avaliacao_final' => $r->avaliacao_final,
                ]),
            'payments' => $talent->payments
                ->sortByDesc('paid_at')
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'payment_ref' => $p->payment_ref,
                    'type' => $p->type,
                    'period' => $p->period,
                    'amount' => $p->amount,
                    'currency' => $p->currency,
                    'status' => $p->status,
                    'paid_at' => $p->paid_at?->format('d/m/Y'),
                ]),
            'tasks' => $talent->tasks
                ->sortByDesc('created_at')
                ->map(fn ($t) => [
                    'id' => $t->id,
                    'task_code' => $t->task_code,
                    'title' => $t->title,
                    'descricao' => $t->descricao,
                    'status' => $t->status,
                    'prioridade' => $t->prioridade,
                    'due_date' => $t->due_date?->format('d/m/Y'),
                ]),
            'evaluations' => $talent->evaluations
                ->sortByDesc('period')
                ->map(fn ($e) => [
                    'id' => $e->id,
                    'period' => $e->period,
                    'tipo' => $e->tipo,
                    'score' => $e->score,
                    'classificacao' => $e->classificacao,
                    'comentarios' => $e->comentarios,
                ]),
            'stats' => [
                'lastPayment' => $lastPayment ? [
                    'amount' => $lastPayment->amount,
                    'period' => $lastPayment->period,
                ] : null,
                'totalPayments' => $totalPayments,
                'pendingTasks' => $pendingTasks,
                'overdueTasks' => $overdueTasks,
                'activeRotation' => $activeRotation ? [
                    'department' => $activeRotation->department?->name ?? '—',
                    'supervisor' => $activeRotation->supervisor ?? '—',
                    'start_date' => $activeRotation->start_date?->format('d/m/Y'),
                ] : null,
                'rotationCount' => $talent->rotations->count(),
            ],
        ]);
    }
}
