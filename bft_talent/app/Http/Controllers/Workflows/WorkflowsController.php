<?php

namespace App\Http\Controllers\Workflows;

use App\Http\Controllers\Controller;
use App\Models\Talent;
use App\Models\Workflow;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkflowsController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Workflow::class);

        $workflows = Workflow::query()
            ->with(['talent'])
            ->when($request->input('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('type'), fn ($q, $v) => $q->where('type', $v))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('workflows/index', [
            'workflows' => $workflows,
            'filters' => $request->only(['status', 'type']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Workflow::class);

        return Inertia::render('workflows/create', [
            'talents' => Talent::orderBy('name')->get(['id', 'name', 'talent_code']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Workflow::class);

        $validated = $request->validate([
            'talent_id' => ['required', 'integer', 'exists:talents,id'],
            'type' => ['required', 'string', 'in:pagamento,contrato,renovacao,rescisao,outro'],
            'descricao' => ['nullable', 'string', 'max:2000'],
        ]);

        $year = now()->format('Y');
        $seq = str_pad(Workflow::whereYear('created_at', $year)->count() + 1, 4, '0', STR_PAD_LEFT);

        Workflow::create([
            ...$validated,
            'workflow_code' => "WF-{$year}-{$seq}",
            'status' => 'pendente',
            'current_step' => 1,
            'total_steps' => 4,
        ]);

        return redirect()->route('workflows.index', $request->route('current_team'))
            ->with('success', 'Workflow criado com sucesso.');
    }

    public function show(Request $request, Workflow $workflow): Response
    {
        $this->authorize('view', $workflow);

        return Inertia::render('workflows/show', [
            'workflow' => $workflow->load(['talent', 'steps.approver', 'payment']),
        ]);
    }
}
