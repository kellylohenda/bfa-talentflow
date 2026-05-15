<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\Talent;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AvaliacoesController extends Controller
{
    public function index(Request $request): Response
    {
        $avaliacoes = Evaluation::query()
            ->with(['target', 'reviewer'])
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('score', 'like', "%{$s}%");
            }))
            ->when($request->input('criterio'), fn ($q, $v) => $q->where('tipo', $v))
            ->when($request->input('periodo'), fn ($q, $v) => $q->where('period', $v))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('avaliacoes/index', [
            'avaliacoes' => $avaliacoes,
            'filters' => $request->only(['search', 'criterio', 'periodo']),
            'talents' => Talent::select('id', 'name')->where('status', 'activo')->get(),
            'mentors' => User::select('id', 'name', 'email')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'target_id' => ['required', 'integer', 'exists:talents,id'],
            'reviewer_id' => ['required', 'integer', 'exists:users,id'],
            'score' => ['required', 'numeric', 'min:0', 'max:100'],
            'feedback' => ['nullable', 'string', 'max:2000'],
            'criterio' => ['required', 'string', 'in:desempenho,competencia,comportamento,lideranca'],
            'periodo' => ['nullable', 'string', 'max:50'],
        ]);

        Evaluation::create([
            'talent_id' => $validated['target_id'],
            'evaluator_user_id' => $validated['reviewer_id'],
            'score' => $validated['score'],
            'comentarios' => $validated['feedback'],
            'tipo' => $validated['criterio'],
            'period' => $validated['periodo'],
        ]);

        return redirect()->route('avaliacoes.index', $request->route('current_team'))
            ->with('success', 'Avaliação registada com sucesso.');
    }
}
