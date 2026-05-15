<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FaltasController extends Controller
{
    public function index(Request $request): Response
    {
        $absences = Absence::query()
            ->with(['talent'])
            ->when($request->input('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('motivo', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('faltas/index', [
            'absences' => $absences,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('faltas/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'talent_id' => ['required', 'integer', 'exists:talents,id'],
            'motivo' => ['required', 'string', 'max:500'],
            'data_inicio' => ['required', 'date'],
            'data_fim' => ['nullable', 'date', 'after_or_equal:data_inicio'],
            'tipo' => ['required', 'string', 'in:justificada,injustificada,licenca'],
        ]);

        Absence::create($validated);

        return redirect()->route('faltas.index', $request->route('current_team'))
            ->with('success', 'Falta registada com sucesso.');
    }

    public function show(Request $request, Absence $falta): Response
    {
        return Inertia::render('faltas/show', [
            'absence' => $falta->load(['talent']),
        ]);
    }

    public function update(Request $request, Absence $falta): RedirectResponse
    {
        $validated = $request->validate([
            'motivo' => ['sometimes', 'string', 'max:500'],
            'data_inicio' => ['sometimes', 'date'],
            'data_fim' => ['nullable', 'date', 'after_or_equal:data_inicio'],
            'tipo' => ['sometimes', 'string', 'in:justificada,injustificada,licenca'],
            'status' => ['sometimes', 'string', 'in:pendente,aprovado,rejeitado'],
            'aprovado_por' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        $falta->update($validated);

        return redirect()->route('faltas.index', $request->route('current_team'))
            ->with('success', 'Falta actualizada com sucesso.');
    }

    public function destroy(Request $request, Absence $falta): RedirectResponse
    {
        $falta->delete();

        return redirect()->route('faltas.index', $request->route('current_team'))
            ->with('success', 'Falta removida com sucesso.');
    }
}
