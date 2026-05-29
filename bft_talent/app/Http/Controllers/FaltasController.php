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
            ->when($request->input('type'), fn ($q, $v) => $q->where('tipo', $v))
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('motivo', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('faltas/index', [
            'faltas' => $absences,
            'filters' => $request->only(['status', 'search', 'type']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('faltas/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $role = $request->user()->bfa_role;
        abort_unless($role?->isStaff(), 403);

        $validated = $request->validate([
            'talent_id' => ['required', 'integer', 'exists:talents,id'],
            'motivo' => ['required', 'string', 'max:500'],
            'data_inicio' => ['required', 'date'],
            'data_fim' => ['nullable', 'date', 'after_or_equal:data_inicio'],
            'tipo' => ['required', 'string', 'in:justificada,injustificada,licenca'],
        ]);

        Absence::create([
            'talent_id' => $validated['talent_id'],
            'motivo' => $validated['motivo'],
            'date_start' => $validated['data_inicio'],
            'date_end' => $validated['data_fim'] ?? null,
            'tipo' => $validated['tipo'],
            'status' => 'pendente',
        ]);

        return redirect()->route('faltas.index', $request->route('current_team'))
            ->with('success', 'Falta registada com sucesso.');
    }

    public function show(Request $request, Absence $falta): Response
    {
        return Inertia::render('faltas/show', [
            'falta' => $falta->load(['talent']),
        ]);
    }

    public function update(Request $request, Absence $falta): RedirectResponse
    {
        $role = $request->user()->bfa_role;
        abort_unless($role?->isStaff(), 403);

        $validated = $request->validate([
            'motivo' => ['sometimes', 'string', 'max:500'],
            'data_inicio' => ['sometimes', 'date'],
            'data_fim' => ['nullable', 'date', 'after_or_equal:data_inicio'],
            'tipo' => ['sometimes', 'string', 'in:justificada,injustificada,licenca'],
            'status' => ['sometimes', 'string', 'in:pendente,aprovado,rejeitado'],
            'aprovado_por' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        $updateData = [];
        if (isset($validated['motivo'])) {
            $updateData['motivo'] = $validated['motivo'];
        }
        if (isset($validated['data_inicio'])) {
            $updateData['date_start'] = $validated['data_inicio'];
        }
        if (array_key_exists('data_fim', $validated)) {
            $updateData['date_end'] = $validated['data_fim'];
        }
        if (isset($validated['tipo'])) {
            $updateData['tipo'] = $validated['tipo'];
        }
        if (isset($validated['status'])) {
            $updateData['status'] = $validated['status'];
        }
        if (isset($validated['aprovado_por'])) {
            $updateData['approved_by_user_id'] = $validated['aprovado_por'];
        }

        $falta->update($updateData);

        return redirect()->route('faltas.index', $request->route('current_team'))
            ->with('success', 'Falta actualizada com sucesso.');
    }

    public function destroy(Request $request, Absence $falta): RedirectResponse
    {
        $role = $request->user()->bfa_role;
        abort_unless($role?->isStaff(), 403);

        $falta->delete();

        return redirect()->route('faltas.index', $request->route('current_team'))
            ->with('success', 'Falta removida com sucesso.');
    }
}
