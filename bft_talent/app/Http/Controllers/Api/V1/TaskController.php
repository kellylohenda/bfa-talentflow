<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreTaskRequest;
use App\Http\Requests\Api\V1\UpdateTaskRequest;
use App\Http\Resources\Api\V1\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TaskController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $tasks = Task::query()
            ->with(['assignedBy'])
            ->when($user->isStaff(), fn ($q) => $q)
            ->when($user->isParticipant(), fn ($q) => $q->where('talent_id', $user->talent_id))
            ->when($request->input('filter.status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('filter.talent_id'), fn ($q, $v) => $q->where('talent_id', $v))
            ->when($request->input('filter.prioridade'), fn ($q, $v) => $q->where('prioridade', $v))
            ->latest()
            ->paginate($request->integer('per_page', 25));

        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $year = now()->format('Y');
        $seq = str_pad(Task::whereYear('created_at', $year)->count() + 1, 4, '0', STR_PAD_LEFT);

        $task = Task::create([
            ...$request->validated(),
            'task_code' => "TASK-{$year}-{$seq}",
            'assigned_by_user_id' => $request->user()->id,
            'status' => 'pendente',
        ]);

        return TaskResource::make($task->load('assignedBy'))->response()->setStatusCode(201);
    }

    public function show(Task $task): TaskResource
    {
        return TaskResource::make($task->load('assignedBy'));
    }

    public function update(UpdateTaskRequest $request, Task $task): TaskResource
    {
        $data = $request->validated();

        if (isset($data['status']) && $data['status'] === 'concluida' && ! $task->completed_at) {
            $data['completed_at'] = now();
        }

        $task->update($data);

        return TaskResource::make($task->fresh('assignedBy'));
    }

    public function destroy(Task $task): JsonResponse
    {
        abort_unless(request()->user()->isStaff(), 403, 'Acesso negado.');
        $task->delete();

        return response()->json(null, 204);
    }
}
