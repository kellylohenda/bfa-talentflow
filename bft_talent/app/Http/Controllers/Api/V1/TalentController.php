<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreTalentRequest;
use App\Http\Requests\Api\V1\UpdateTalentRequest;
use App\Http\Resources\Api\V1\TalentResource;
use App\Models\Talent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TalentController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Talent::class);

        $talents = Talent::query()
            ->with(['program', 'university', 'department', 'mentor'])
            ->when($request->input('filter.kind'), fn ($q, $v) => $q->where('kind', $v))
            ->when($request->input('filter.status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('filter.program_id'), fn ($q, $v) => $q->where('program_id', $v))
            ->when($request->input('filter.mentor'), fn ($q, $v) => match ($v) {
                'me' => $q->where('mentor_user_id', $request->user()->id),
                default => $q->where('mentor_user_id', $v),
            })
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")->orWhere('talent_code', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate($request->integer('per_page', 25));

        return TalentResource::collection($talents);
    }

    public function store(StoreTalentRequest $request): JsonResponse
    {
        $year = now()->format('Y');
        $kind = $request->validated('kind');
        $prefix = strtoupper(substr($kind, 0, 3));
        $seq = str_pad(Talent::whereYear('created_at', $year)->count() + 1, 4, '0', STR_PAD_LEFT);

        $talent = Talent::create([
            ...$request->validated(),
            'talent_code' => "{$prefix}-{$year}-{$seq}",
            'status' => 'activo',
        ]);

        return TalentResource::make($talent->load(['program', 'university', 'department', 'mentor']))->response()->setStatusCode(201);
    }

    public function show(Request $request, Talent $talent): TalentResource
    {
        $this->authorize('view', $talent);

        $includes = array_filter(explode(',', $request->input('include', '')));
        $allowed = ['program', 'university', 'department', 'mentor', 'rotations', 'payments', 'tasks', 'absences', 'evaluations'];
        $with = array_values(array_intersect($includes, $allowed)) ?: ['program', 'department', 'mentor'];

        return TalentResource::make($talent->load($with));
    }

    public function update(UpdateTalentRequest $request, Talent $talent): TalentResource
    {
        $this->authorize('update', $talent);

        $talent->update($request->validated());

        return TalentResource::make($talent->fresh(['program', 'department', 'mentor']));
    }

    public function destroy(Talent $talent): JsonResponse
    {
        $this->authorize('delete', $talent);
        $talent->delete();

        return response()->json(null, 204);
    }
}
