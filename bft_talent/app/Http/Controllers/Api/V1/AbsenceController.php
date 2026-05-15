<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreAbsenceRequest;
use App\Http\Requests\Api\V1\UpdateAbsenceRequest;
use App\Http\Resources\Api\V1\AbsenceResource;
use App\Models\Absence;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AbsenceController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $absences = Absence::query()
            ->with(['approvedBy'])
            ->when($user->isParticipant(), fn ($q) => $q->where('talent_id', $user->talent_id))
            ->when($request->input('filter.status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('filter.talent_id'), fn ($q, $v) => $q->where('talent_id', $v))
            ->when($request->input('filter.tipo'), fn ($q, $v) => $q->where('tipo', $v))
            ->latest('date_start')
            ->paginate($request->integer('per_page', 25));

        return AbsenceResource::collection($absences);
    }

    public function store(StoreAbsenceRequest $request): JsonResponse
    {
        $data = $request->validated();
        $year = now()->format('Y');
        $seq = str_pad(Absence::whereYear('created_at', $year)->count() + 1, 4, '0', STR_PAD_LEFT);

        $start = Carbon::parse($data['date_start']);
        $end = Carbon::parse($data['date_end']);
        $dias = $start->diffInWeekdays($end) + 1;

        $absence = Absence::create([
            ...$data,
            'absence_code' => "FALT-{$year}-{$seq}",
            'dias' => $dias,
            'status' => 'pendente',
        ]);

        return AbsenceResource::make($absence)->response()->setStatusCode(201);
    }

    public function show(Absence $absence): AbsenceResource
    {
        return AbsenceResource::make($absence->load('approvedBy'));
    }

    public function update(UpdateAbsenceRequest $request, Absence $absence): AbsenceResource
    {
        $data = $request->validated();

        if (isset($data['status']) && in_array($data['status'], ['aprovada', 'rejeitada'])) {
            $data['approved_by_user_id'] = $request->user()->id;
        }

        $absence->update($data);

        return AbsenceResource::make($absence->fresh('approvedBy'));
    }

    public function destroy(Absence $absence): JsonResponse
    {
        abort_unless($request->user()->isRh(), 403, 'Acesso negado.');
        $absence->delete();

        return response()->json(null, 204);
    }
}
