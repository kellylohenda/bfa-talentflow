<?php

namespace App\Http\Controllers\Talentos;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Program;
use App\Models\Talent;
use App\Models\University;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TalentosController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Talent::class);

        $talents = Talent::query()
            ->with(['program', 'university', 'department', 'mentor'])
            ->when($request->input('kind'), fn ($q, $v) => $q->where('kind', $v))
            ->when($request->input('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")->orWhere('talent_code', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('talentos/index', [
            'talents' => $talents,
            'filters' => $request->only(['kind', 'status', 'search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Talent::class);

        return Inertia::render('talentos/create', [
            'programs' => Program::orderBy('name')->get(['id', 'name', 'code']),
            'universities' => University::orderBy('name')->get(['id', 'name']),
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'mentors' => User::where('bfa_role', 'mentor')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Talent::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'kind' => ['required', 'string', 'in:bolseiro,estagiario'],
            'program_id' => ['required', 'integer', 'exists:programs,id'],
            'university_id' => ['nullable', 'integer', 'exists:universities,id'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'mentor_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'stipend' => ['nullable', 'numeric', 'min:0'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'observacoes' => ['nullable', 'string', 'max:2000'],
        ]);

        $year = now()->format('Y');
        $prefix = strtoupper(substr($validated['kind'], 0, 3));
        $seq = str_pad(Talent::whereYear('created_at', $year)->count() + 1, 4, '0', STR_PAD_LEFT);

        Talent::create([
            ...$validated,
            'talent_code' => "{$prefix}-{$year}-{$seq}",
            'status' => 'activo',
        ]);

        return redirect()->route('talentos.index', $request->route('current_team'))
            ->with('success', 'Talento criado com sucesso.');
    }

    public function show(Request $request, $id): Response
    {
        // Fetch manually to ensure we get a fresh instance
        $talent = Talent::with([
            'program', 'university', 'department', 'mentor',
            'rotations', 'payments', 'tasks', 'absences', 'evaluations', 'documents',
        ])->find($id);

        if (! $talent) {
            abort(404);
        }

        $this->authorize('view', $talent);

        return Inertia::render('talentos/show', [
            'talent' => $talent->toArray(),
            'programs' => Program::orderBy('name')->get(['id', 'name', 'code']),
            'universities' => University::orderBy('name')->get(['id', 'name']),
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'mentors' => User::where('bfa_role', 'mentor')->orderBy('name')->get(['id', 'name']),
            'canEdit' => $request->user()->can('update', $talent),
        ]);
    }

    public function edit(Request $request, Talent $talent): Response
    {
        $this->authorize('update', $talent);

        return Inertia::render('talentos/edit', [
            'talent' => $talent->load(['program', 'university', 'department', 'mentor']),
            'programs' => Program::orderBy('name')->get(['id', 'name', 'code']),
            'universities' => University::orderBy('name')->get(['id', 'name']),
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'mentors' => User::where('bfa_role', 'mentor')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Talent $talent): RedirectResponse
    {
        $this->authorize('update', $talent);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'program_id' => ['sometimes', 'exists:programs,id'],
            'university_id' => ['sometimes', 'exists:universities,id'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'mentor_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'stipend' => ['nullable', 'numeric', 'min:0'],
            'status' => ['sometimes', 'string', 'in:activo,suspenso,concluido,cancelado'],
            'perf' => ['nullable', 'integer', 'min:0', 'max:100'],
            'risk_score' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'end_date' => ['nullable', 'date'],
            'observacoes' => ['nullable', 'string', 'max:2000'],
        ]);

        $talent->update($validated);

        return redirect()->route('talentos.show', [$request->route('current_team'), $talent])
            ->with('success', 'Talento actualizado com sucesso.');
    }

    public function destroy(Request $request, Talent $talent): RedirectResponse
    {
        $this->authorize('delete', $talent);
        $talent->delete();

        return redirect()->route('talentos.index', $request->route('current_team'))
            ->with('success', 'Talento removido com sucesso.');
    }
}
