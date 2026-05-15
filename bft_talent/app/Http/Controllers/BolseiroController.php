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

        $talents = Talent::query()
            ->whereIn('kind', ['bolseiro'])
            ->with(['program', 'university', 'department', 'mentor'])
            ->latest()
            ->paginate(25)
            ->withQueryString();

        $bolseiro = Talent::where('user_id', $user->id)->first();

        $payments = $bolseiro?->payments()->latest()->get() ?? collect();
        $tasks = $bolseiro?->tasks()->latest()->get() ?? collect();
        $mentorSessions = $bolseiro?->mentorSessions()->latest()->get() ?? collect();

        return Inertia::render('bolseiro/index', [
            'talents' => $talents,
            'bolseiro' => $bolseiro,
            'payments' => $payments,
            'tasks' => $tasks,
            'mentorSessions' => $mentorSessions,
        ]);
    }
}
