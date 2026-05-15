<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreHoursEntryRequest;
use App\Http\Resources\Api\V1\HoursEntryResource;
use App\Models\HoursEntry;
use App\Models\Volunteer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class HoursEntryController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $entries = HoursEntry::query()
            ->with(['activity', 'validadoPor'])
            ->when($user->isVoluntario(), fn ($q) => $q->where('volunteer_id', $user->volunteer_id))
            ->when($request->input('filter.volunteer_id'), fn ($q, $v) => $q->where('volunteer_id', $v))
            ->when($request->input('filter.validado'), fn ($q, $v) => $q->where('validado', (bool) $v))
            ->latest('data')
            ->paginate($request->integer('per_page', 25));

        return HoursEntryResource::collection($entries);
    }

    public function store(StoreHoursEntryRequest $request): JsonResponse
    {
        $year = now()->format('Y');
        $seq = str_pad(HoursEntry::whereYear('created_at', $year)->count() + 1, 5, '0', STR_PAD_LEFT);

        $entry = HoursEntry::create([
            ...$request->validated(),
            'hour_code' => "HRS-{$year}-{$seq}",
        ]);

        return HoursEntryResource::make($entry->load('activity'))->response()->setStatusCode(201);
    }

    public function show(HoursEntry $hoursEntry): HoursEntryResource
    {
        return HoursEntryResource::make($hoursEntry->load(['activity', 'validadoPor']));
    }

    public function validar(Request $request, HoursEntry $hoursEntry): HoursEntryResource|JsonResponse
    {
        abort_unless($request->user()->isRh() || $request->user()->isMentor(), 403, 'Acesso negado.');

        if ($hoursEntry->validado) {
            return response()->json(['message' => 'Registo já validado.'], 422);
        }

        $hoursEntry->update([
            'validado' => true,
            'validado_por_user_id' => $request->user()->id,
            'validado_at' => now(),
        ]);

        // Actualiza total_horas do voluntário
        $total = HoursEntry::where('volunteer_id', $hoursEntry->volunteer_id)
            ->where('validado', true)
            ->sum('horas');

        Volunteer::where('id', $hoursEntry->volunteer_id)->update(['total_horas' => $total]);

        return HoursEntryResource::make($hoursEntry->fresh(['activity', 'validadoPor']));
    }
}
