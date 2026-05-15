<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreEvaluationRequest;
use App\Http\Resources\Api\V1\EvaluationResource;
use App\Models\Evaluation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EvaluationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $evaluations = Evaluation::query()
            ->with(['program', 'evaluator'])
            ->when($user->isParticipant(), fn ($q) => $q->where('talent_id', $user->talent_id))
            ->when($user->isMentor(), fn ($q) => $q->whereHas('talent', fn ($t) => $t->where('mentor_user_id', $user->id)))
            ->when($request->input('filter.talent_id'), fn ($q, $v) => $q->where('talent_id', $v))
            ->when($request->input('filter.period'), fn ($q, $v) => $q->where('period', $v))
            ->latest()
            ->paginate($request->integer('per_page', 25));

        return EvaluationResource::collection($evaluations);
    }

    public function store(StoreEvaluationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $score = $data['score'];

        $classificacao = match (true) {
            $score >= 90 => 'excelente',
            $score >= 75 => 'muito_bom',
            $score >= 60 => 'bom',
            $score >= 40 => 'satisfatorio',
            default => 'insatisfatorio',
        };

        $evaluation = Evaluation::create([
            ...$data,
            'evaluator_user_id' => $request->user()->id,
            'classificacao' => $classificacao,
        ]);

        return EvaluationResource::make($evaluation->load(['program', 'evaluator']))->response()->setStatusCode(201);
    }

    public function show(Evaluation $evaluation): EvaluationResource
    {
        return EvaluationResource::make($evaluation->load(['program', 'evaluator']));
    }
}
