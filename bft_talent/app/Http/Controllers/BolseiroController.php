<?php

namespace App\Http\Controllers;

use App\Models\Talent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BolseiroController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $bolseiro = Talent::where('user_id', $user->id)
            ->with([
                'program', 'university', 'department', 'mentor',
                'payments', 'tasks', 'absences', 'documents',
                'mentorSessions', 'presencas',
            ])
            ->first();

        $payments = $bolseiro?->payments ?? collect();
        $tasks = $bolseiro?->tasks ?? collect();
        $mentorSessions = $bolseiro?->mentorSessions ?? collect();
        $absences = $bolseiro?->absences ?? collect();
        $documents = $bolseiro?->documents ?? collect();
        $presencas = $bolseiro?->presencas ?? collect();

        $tarefasPendentes = $tasks->where('status', '!=', 'concluida')->count();
        $pagamentosPendentes = $payments->where('status', 'pendente')->count();
        $sessoesMes = $mentorSessions
            ->filter(fn ($s) => $s->scheduled_at?->isCurrentMonth())
            ->count();
        $desempenho = $bolseiro?->perf ?? 0;

        return Inertia::render('bolseiro/index', [
            'kpis' => [
                'tarefasPendentes' => $tarefasPendentes,
                'pagamentosPendentes' => $pagamentosPendentes,
                'sessoesMes' => $sessoesMes,
                'desempenho' => $desempenho,
            ],
            'bolseiro' => $bolseiro,
            'mentor' => $bolseiro?->mentor,
            'tarefas' => $tasks,
            'pagamentos' => $payments,
            'absences' => $absences,
            'documents' => $documents,
            'mentorSessions' => $mentorSessions,
            'presencas' => $presencas,
        ]);
    }
}
