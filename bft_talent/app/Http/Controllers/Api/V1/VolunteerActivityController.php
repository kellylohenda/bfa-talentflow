<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreVolunteerActivityRequest;
use App\Http\Resources\Api\V1\VolunteerActivityResource;
use App\Models\VolunteerActivity;
use App\Models\VolunteerActivityInscricao;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VolunteerActivityController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $activities = VolunteerActivity::query()
            ->with(['coordenador'])
            ->when($request->input('filter.status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('filter.tipo'), fn ($q, $v) => $q->where('tipo', $v))
            ->orderByDesc('data')
            ->paginate($request->integer('per_page', 25));

        return VolunteerActivityResource::collection($activities);
    }

    public function store(StoreVolunteerActivityRequest $request): JsonResponse
    {
        $year = now()->format('Y');
        $seq = str_pad(VolunteerActivity::whereYear('created_at', $year)->count() + 1, 4, '0', STR_PAD_LEFT);

        $activity = VolunteerActivity::create([
            ...$request->validated(),
            'activity_code' => "ACT-{$year}-{$seq}",
            'status' => 'planeada',
        ]);

        return VolunteerActivityResource::make($activity->load('coordenador'))->response()->setStatusCode(201);
    }

    public function show(VolunteerActivity $volunteerActivity): VolunteerActivityResource
    {
        return VolunteerActivityResource::make($volunteerActivity->load(['coordenador', 'inscricoes']));
    }

    public function inscrever(Request $request, VolunteerActivity $volunteerActivity): JsonResponse
    {
        $user = $request->user();

        if (! $user->volunteer_id) {
            return response()->json(['message' => 'Utilizador sem perfil de voluntário.'], 422);
        }

        if (in_array($volunteerActivity->status, ['cancelada', 'concluida'])) {
            return response()->json(['message' => 'Não é possível inscrever-se nesta actividade.'], 422);
        }

        if ($volunteerActivity->vagas_total && $volunteerActivity->inscritos_count >= $volunteerActivity->vagas_total) {
            return response()->json(['message' => 'Actividade sem vagas disponíveis.'], 422);
        }

        $exists = VolunteerActivityInscricao::where('activity_id', $volunteerActivity->id)
            ->where('volunteer_id', $user->volunteer_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Já se encontra inscrito nesta actividade.'], 422);
        }

        VolunteerActivityInscricao::create([
            'activity_id' => $volunteerActivity->id,
            'volunteer_id' => $user->volunteer_id,
        ]);

        $volunteerActivity->increment('inscritos_count');

        return response()->json(['message' => 'Inscrição realizada com sucesso.'], 201);
    }
}
