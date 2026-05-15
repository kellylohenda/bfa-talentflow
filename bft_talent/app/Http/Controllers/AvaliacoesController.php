<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AvaliacoesController extends Controller
{
    public function index(Request $request): Response
    {
        $evaluations = Evaluation::query()
            ->with(['talent'])
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('nota', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('avaliacoes/index', [
            'evaluations' => $evaluations,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'talent_id' => ['required', 'integer', 'exists:talents,id'],
            'nota' => ['required', 'numeric', 'min:0', 'max:100'],
            'comentario' => ['nullable', 'string', 'max:2000'],
            'tipo' => ['required', 'string', 'in:desempenho,tecnica,comportamental'],
        ]);

        Evaluation::create($validated);

        return redirect()->route('avaliacoes.index', $request->route('current_team'))
            ->with('success', 'Avaliação registada com sucesso.');
    }
}
