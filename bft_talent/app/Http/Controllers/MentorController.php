<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\MentorSession;
use App\Models\Talent;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MentorController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $mentorId = $user->id;

        $mentees = Talent::query()
            ->where('mentor_user_id', $mentorId)
            ->with(['program', 'department'])
            ->latest()
            ->get();

        $talentIds = $mentees->pluck('id');

        $tarefasPendentes = Task::whereIn('talent_id', $talentIds)
            ->whereNotIn('status', ['concluida', 'cancelada'])
            ->count();

        $avaliacoesPendentes = Evaluation::whereIn('talent_id', $talentIds)
            ->whereNull('score')
            ->count();

        $sessoesMes = MentorSession::where('mentor_user_id', $mentorId)
            ->whereMonth('created_at', now()->month)
            ->count();

        $mentees->each(function ($talent) {
            $talent->tarefasPendentes = Task::where('talent_id', $talent->id)
                ->whereNotIn('status', ['concluida', 'cancelada'])
                ->count();

            $talent->avaliacaoMedia = Evaluation::where('talent_id', $talent->id)
                ->whereNotNull('score')
                ->avg('score');
        });

        return Inertia::render('mentor/index', [
            'mentees' => $mentees,
            'kpis' => [
                'totalMentees' => $mentees->count(),
                'tarefasPendentes' => $tarefasPendentes,
                'avaliacoesPendentes' => $avaliacoesPendentes,
                'sessoesMes' => $sessoesMes,
            ],
        ]);
    }
}
