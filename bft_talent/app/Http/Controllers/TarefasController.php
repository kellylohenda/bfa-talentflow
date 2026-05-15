<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TarefasController extends Controller
{
    public function index(Request $request): Response
    {
        $tasks = Task::query()
            ->with(['talent'])
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%");
            }))
            ->when($request->input('status'), fn ($q, $v) => $q->where('status', $v))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('tarefas/index', [
            'tasks' => $tasks,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tarefas/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'talent_id' => ['nullable', 'integer', 'exists:talents,id'],
            'due_date' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'in:pendente,em_andamento,concluida'],
        ]);

        Task::create($validated);

        return redirect()->route('tarefas.index', $request->route('current_team'))
            ->with('success', 'Tarefa criada com sucesso.');
    }

    public function show(Request $request, Task $tarefa): Response
    {
        return Inertia::render('tarefas/show', [
            'tarefa' => $tarefa->load(['talent']),
        ]);
    }

    public function edit(Request $request, Task $tarefa): Response
    {
        return Inertia::render('tarefas/edit', [
            'tarefa' => $tarefa->load(['talent']),
        ]);
    }

    public function update(Request $request, Task $tarefa): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'talent_id' => ['nullable', 'integer', 'exists:talents,id'],
            'due_date' => ['nullable', 'date'],
            'status' => ['sometimes', 'string', 'in:pendente,em_andamento,concluida'],
        ]);

        $tarefa->update($validated);

        return redirect()->route('tarefas.index', $request->route('current_team'))
            ->with('success', 'Tarefa actualizada com sucesso.');
    }

    public function destroy(Request $request, Task $tarefa): RedirectResponse
    {
        $tarefa->delete();

        return redirect()->route('tarefas.index', $request->route('current_team'))
            ->with('success', 'Tarefa removida com sucesso.');
    }
}
