<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreEventoRequest;
use App\Http\Resources\Api\V1\EventoResource;
use App\Models\Evento;
use App\Models\EventoInscricao;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EventoController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $eventos = Evento::query()
            ->withCount('inscricoes')
            ->when($request->input('filter.status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('filter.tipo'), fn ($q, $v) => $q->where('tipo', $v))
            ->orderBy('data_inicio', 'desc')
            ->paginate($request->integer('per_page', 25));

        return EventoResource::collection($eventos);
    }

    public function store(StoreEventoRequest $request): JsonResponse
    {
        $year = now()->format('Y');
        $seq = str_pad(Evento::whereYear('created_at', $year)->count() + 1, 4, '0', STR_PAD_LEFT);

        $evento = Evento::create([
            ...$request->validated(),
            'event_code' => "EVT-{$year}-{$seq}",
            'status' => 'planeado',
        ]);

        return EventoResource::make($evento)->response()->setStatusCode(201);
    }

    public function show(Evento $evento): EventoResource
    {
        return EventoResource::make($evento->load('inscricoes'));
    }

    public function inscrever(Request $request, Evento $evento): JsonResponse
    {
        $user = $request->user();
        $talentId = $user->talent_id;
        $volunteerId = $user->volunteer_id;

        if (! $talentId && ! $volunteerId) {
            return response()->json(['message' => 'Utilizador sem perfil de talento ou voluntário.'], 422);
        }

        if ($evento->vagas) {
            $count = $evento->inscricoes()->count();
            if ($count >= $evento->vagas) {
                return response()->json(['message' => 'Evento sem vagas disponíveis.'], 422);
            }
        }

        $query = EventoInscricao::where('evento_id', $evento->id);

        if ($talentId) {
            $query->where('talent_id', $talentId);
        } else {
            $query->where('volunteer_id', $volunteerId);
        }

        if ($query->exists()) {
            return response()->json(['message' => 'Já se encontra inscrito neste evento.'], 422);
        }

        $inscricao = EventoInscricao::create([
            'evento_id' => $evento->id,
            'talent_id' => $talentId,
            'volunteer_id' => $volunteerId,
            'status' => 'inscrito',
        ]);

        return response()->json($inscricao, 201);
    }
}
