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

        $bolseiro = Talent::where('user_id', $user->id)->first();

        $payments = $bolseiro?->payments()->latest()->get() ?? collect();
        $tasks = $bolseiro?->tasks()->latest()->get() ?? collect();
        $mentorSessions = $bolseiro?->mentorSessions()->latest()->get() ?? collect();

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
            'mentor' => $bolseiro?->mentor,
            'tarefas' => $tasks,
            'pagamentos' => $payments,
        ]);
    }
}
