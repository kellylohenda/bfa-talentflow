<?php

namespace App\Http\Controllers;

use App\Models\Talent;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TarefasController extends Controller
{
    public function index(Request $request): Response
    {
        $tasks = Task::query()
            ->with(['talent', 'assignedTo'])
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%");
            }))
            ->when($request->input('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('priority'), fn ($q, $v) => $q->where('prioridade', $v))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('tarefas/index', [
            'tarefas' => $tasks,
            'filters' => $request->only(['search', 'status', 'priority']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tarefas/create', [
            'talents' => Talent::orderBy('name')->get(['id', 'name']),
            'mentors' => User::whereIn('bfa_role', ['rh', 'direcao', 'mentor'])->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'talent_id' => ['nullable', 'integer', 'exists:talents,id'],
            'due_date' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'in:pendente,em_andamento,em_progresso,concluida,cancelada'],
        ]);

        $status = match ($validated['status'] ?? 'pendente') {
            'em_andamento' => 'em_progresso',
            default => $validated['status'] ?? 'pendente',
        };

        $priority = match ($request->input('priority')) {
            'media' => 'normal',
            default => $request->input('priority', 'normal'),
        };

        $seq = str_pad(Task::withTrashed()->count() + 1, 4, '0', STR_PAD_LEFT);
        $taskCode = 'TASK-'.$seq;

        Task::create([
            'task_code' => $taskCode,
            'title' => $validated['title'],
            'descricao' => $validated['description'] ?? null,
            'prioridade' => $priority,
            'talent_id' => $validated['talent_id'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'status' => $status,
            'assigned_by_user_id' => $request->input('assigned_to_id'),
        ]);

        return redirect()->route('tarefas.index', $request->route('current_team'))
            ->with('success', 'Tarefa criada com sucesso.');
    }

    public function show(Request $request, Task $tarefa): Response
    {
        return Inertia::render('tarefas/show', [
            'tarefa' => $tarefa->load(['talent', 'assignedTo']),
        ]);
    }

    public function edit(Request $request, Task $tarefa): Response
    {
        return Inertia::render('tarefas/edit', [
            'tarefa' => $tarefa->load(['talent', 'assignedTo']),
            'talents' => Talent::orderBy('name')->get(['id', 'name']),
            'mentors' => User::whereIn('bfa_role', ['rh', 'direcao', 'mentor'])->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Task $tarefa): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'talent_id' => ['nullable', 'integer', 'exists:talents,id'],
            'due_date' => ['nullable', 'date'],
            'status' => ['sometimes', 'string', 'in:pendente,em_andamento,em_progresso,concluida,cancelada'],
        ]);

        $data = [];
        if (isset($validated['title'])) {
            $data['title'] = $validated['title'];
        }
        if (array_key_exists('description', $validated)) {
            $data['descricao'] = $validated['description'];
        }
        if (array_key_exists('talent_id', $validated)) {
            $data['talent_id'] = $validated['talent_id'];
        }
        if (array_key_exists('due_date', $validated)) {
            $data['due_date'] = $validated['due_date'];
        }
        if (isset($validated['status'])) {
            $data['status'] = match ($validated['status']) {
                'em_andamento' => 'em_progresso',
                default => $validated['status'],
            };
        }
        if ($request->has('priority')) {
            $data['prioridade'] = match ($request->input('priority')) {
                'media' => 'normal',
                default => $request->input('priority'),
            };
        }
        if ($request->has('assigned_to_id')) {
            $data['assigned_by_user_id'] = $request->input('assigned_to_id');
        }

        $tarefa->update($data);

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
