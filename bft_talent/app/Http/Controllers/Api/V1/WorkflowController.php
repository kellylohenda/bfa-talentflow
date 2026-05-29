<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ApproveWorkflowRequest;
use App\Http\Requests\Api\V1\RejectWorkflowRequest;
use App\Http\Requests\Api\V1\StoreWorkflowRequest;
use App\Http\Resources\Api\V1\WorkflowResource;
use App\Models\Workflow;
use App\Models\WorkflowStep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class WorkflowController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Workflow::class);

        $workflows = Workflow::query()
            ->with(['talent', 'steps'])
            ->when($request->input('filter.status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('filter.talent_id'), fn ($q, $v) => $q->where('talent_id', $v))
            ->latest()
            ->paginate($request->integer('per_page', 25));

        return WorkflowResource::collection($workflows);
    }

    public function store(StoreWorkflowRequest $request): JsonResponse
    {
        $year = now()->format('Y');
        $seq = str_pad(Workflow::whereYear('created_at', $year)->count() + 1, 4, '0', STR_PAD_LEFT);

        $workflow = Workflow::create([
            ...$request->validated(),
            'workflow_code' => "WF-{$year}-{$seq}",
            'status' => 'pendente',
            'current_step' => 1,
            'total_steps' => 4,
        ]);

        foreach ([['step_number' => 1, 'approver_role' => 'rh'], ['step_number' => 2, 'approver_role' => 'rh'], ['step_number' => 3, 'approver_role' => 'mentor'], ['step_number' => 4, 'approver_role' => 'direcao']] as $step) {
            WorkflowStep::create(['workflow_id' => $workflow->id, ...$step]);
        }

        return WorkflowResource::make($workflow->load(['talent', 'steps']))->response()->setStatusCode(201);
    }

    public function show(Workflow $workflow): WorkflowResource
    {
        $this->authorize('view', $workflow);

        return WorkflowResource::make($workflow->load(['talent', 'steps.approver', 'payment']));
    }

    public function approve(ApproveWorkflowRequest $request, Workflow $workflow): WorkflowResource|JsonResponse
    {
        $this->authorize('approve', $workflow);

        $step = $workflow->steps()->where('step_number', $workflow->current_step)->first();

        if (! $step || $step->decision !== null) {
            return response()->json(['message' => 'Passo já processado ou não encontrado.'], 422);
        }

        $step->update([
            'decision' => 'aprovado',
            'approver_user_id' => $request->user()->id,
            'comentario' => $request->validated('comentario'),
            'decided_at' => now(),
        ]);

        if ($workflow->current_step >= $workflow->total_steps) {
            $workflow->update(['status' => 'aprovado']);
        } else {
            $workflow->increment('current_step');
            $workflow->update(['status' => 'em_aprovacao']);
        }

        // Notificar talento se tiver user associado
        if ($user = $workflow->talent?->user) {
            $user->notify(new \App\Notifications\WorkflowStatusChanged($workflow));
        }

        return WorkflowResource::make($workflow->fresh(['steps']));
    }

    public function reject(RejectWorkflowRequest $request, Workflow $workflow): WorkflowResource|JsonResponse
    {
        $this->authorize('reject', $workflow);

        $step = $workflow->steps()->where('step_number', $workflow->current_step)->first();

        if (! $step || $step->decision !== null) {
            return response()->json(['message' => 'Passo já processado ou não encontrado.'], 422);
        }

        $step->update([
            'decision' => 'rejeitado',
            'approver_user_id' => $request->user()->id,
            'comentario' => $request->validated('comentario'),
            'decided_at' => now(),
        ]);

        $workflow->update(['status' => 'rejeitado']);

        // Notificar talento se tiver user associado
        if ($user = $workflow->talent?->user) {
            $user->notify(new \App\Notifications\WorkflowStatusChanged($workflow));
        }

        return WorkflowResource::make($workflow->fresh(['steps']));
    }
}
