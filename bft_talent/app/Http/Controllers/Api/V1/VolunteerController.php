<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreVolunteerRequest;
use App\Http\Requests\Api\V1\UpdateVolunteerRequest;
use App\Http\Resources\Api\V1\VolunteerResource;
use App\Models\Volunteer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VolunteerController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Volunteer::class);
        $volunteers = Volunteer::query()
            ->with(['mentor'])
            ->when($request->input('filter.status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('filter.area'), fn ($q, $v) => $q->where('area_actuacao', 'like', "%{$v}%"))
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('nome', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate($request->integer('per_page', 25));

        return VolunteerResource::collection($volunteers);
    }

    public function store(StoreVolunteerRequest $request): JsonResponse
    {
        $year = now()->format('Y');
        $seq = str_pad(Volunteer::whereYear('created_at', $year)->count() + 1, 4, '0', STR_PAD_LEFT);

        $volunteer = Volunteer::create([
            ...$request->validated(),
            'volunteer_code' => "VOL-{$year}-{$seq}",
            'status' => 'activo',
        ]);

        return VolunteerResource::make($volunteer->load('mentor'))->response()->setStatusCode(201);
    }

    public function show(Request $request, Volunteer $volunteer): VolunteerResource
    {
        $this->authorize('view', $volunteer);
        $includes = array_filter(explode(',', $request->input('include', '')));
        $allowed = ['mentor', 'activityInscricoes', 'hoursEntries', 'eventoInscricoes'];
        $with = array_values(array_intersect($includes, $allowed)) ?: ['mentor'];

        return VolunteerResource::make($volunteer->load($with));
    }

    public function update(UpdateVolunteerRequest $request, Volunteer $volunteer): VolunteerResource
    {
        $volunteer->update($request->validated());

        return VolunteerResource::make($volunteer->fresh('mentor'));
    }

    public function destroy(Volunteer $volunteer): JsonResponse
    {
        $this->authorize('gerir-voluntarios');
        $volunteer->delete();

        return response()->json(null, 204);
    }
}
