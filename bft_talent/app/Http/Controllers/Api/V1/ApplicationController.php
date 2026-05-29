<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreApplicationRequest;
use App\Http\Requests\Api\V1\UpdateApplicationRequest;
use App\Http\Resources\Api\V1\ApplicationResource;
use App\Models\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApplicationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Application::class);

        $applications = Application::query()
            ->with(['program', 'university'])
            ->when($request->input('filter.stage'), fn ($q, $v) => $q->where('stage', $v))
            ->when($request->input('filter.program_id'), fn ($q, $v) => $q->where('program_id', $v))
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate($request->integer('per_page', 25));

        return ApplicationResource::collection($applications);
    }

    public function store(StoreApplicationRequest $request): JsonResponse
    {
        $year = now()->format('Y');
        $seq = str_pad(Application::whereYear('created_at', $year)->count() + 1, 4, '0', STR_PAD_LEFT);

        $application = Application::create([
            ...$request->validated(),
            'application_ref' => "CAND-{$year}-{$seq}",
            'stage' => 'analise',
        ]);

        return ApplicationResource::make($application->load(['program', 'university']))->response()->setStatusCode(201);
    }

    public function show(Application $candidatura): ApplicationResource
    {
        $this->authorize('view', $candidatura);

        return ApplicationResource::make($candidatura->load(['program', 'university', 'convertedTalent']));
    }

    public function update(UpdateApplicationRequest $request, Application $candidatura): ApplicationResource
    {
        $this->authorize('update', $candidatura);
        $candidatura->update($request->validated());

        return ApplicationResource::make($candidatura->fresh(['program', 'university']));
    }

    public function avancar(Request $request, Application $application): ApplicationResource|JsonResponse
    {
        $this->authorize('avancar', $application);

        $stages = ['analise', 'entrevista', 'avaliacao', 'oferta'];
        $currentIndex = array_search($application->stage->value, $stages);

        if ($currentIndex === false || $application->stage->isTerminal()) {
            return response()->json(['message' => 'Candidatura não pode ser avançada.'], 422);
        }

        $nextStage = $stages[$currentIndex + 1] ?? null;

        if (! $nextStage) {
            return response()->json(['message' => 'Candidatura já se encontra na fase final.'], 422);
        }

        $application->update(['stage' => $nextStage]);

        return ApplicationResource::make($application->fresh(['program']));
    }

    public function rejeitar(Request $request, Application $application): ApplicationResource|JsonResponse
    {
        $this->authorize('update', $application);

        if ($application->stage->isTerminal()) {
            return response()->json(['message' => 'Candidatura já está em estado terminal.'], 422);
        }

        $application->update([
            'stage' => 'rejeitado',
            'observacoes' => $request->input('motivo'),
        ]);

        return ApplicationResource::make($application->fresh());
    }

    public function destroy(Application $candidatura): JsonResponse
    {
        $this->authorize('delete', $candidatura);
        $candidatura->delete();

        return response()->json(null, 204);
    }
}
