<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreRotationRequest;
use App\Http\Requests\Api\V1\UpdateRotationRequest;
use App\Http\Resources\Api\V1\RotationResource;
use App\Models\Rotation;
use App\Models\Talent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RotationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Talent::class);

        $rotations = Rotation::query()
            ->with(['talent', 'department'])
            ->when($request->input('filter.talent_id'), fn ($q, $v) => $q->where('talent_id', $v))
            ->when($request->input('filter.status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('filter.department_id'), fn ($q, $v) => $q->where('department_id', $v))
            ->latest('start_date')
            ->paginate($request->integer('per_page', 25));

        return RotationResource::collection($rotations);
    }

    public function store(StoreRotationRequest $request): JsonResponse
    {
        // Apenas 1 rotação activa por talento
        $activeExists = Rotation::where('talent_id', $request->validated('talent_id'))
            ->where('status', 'activa')
            ->exists();

        if ($activeExists) {
            return response()->json(['message' => 'Talento já possui uma rotação activa.'], 422);
        }

        $year = now()->format('Y');
        $seq = str_pad(Rotation::whereYear('created_at', $year)->count() + 1, 4, '0', STR_PAD_LEFT);

        $rotation = Rotation::create([
            ...$request->validated(),
            'rotation_code' => "ROT-{$year}-{$seq}",
            'status' => 'activa',
        ]);

        return RotationResource::make($rotation->load(['talent', 'department']))->response()->setStatusCode(201);
    }

    public function show(Rotation $rotation): RotationResource
    {
        return RotationResource::make($rotation->load(['talent', 'department']));
    }

    public function update(UpdateRotationRequest $request, Rotation $rotation): RotationResource
    {
        $rotation->update($request->validated());

        return RotationResource::make($rotation->fresh(['talent', 'department']));
    }

    public function destroy(Rotation $rotation): JsonResponse
    {
        abort_unless($rotation->status === 'activa', 422, 'Só é possível eliminar rotações activas.');
        $rotation->delete();

        return response()->json(null, 204);
    }
}
