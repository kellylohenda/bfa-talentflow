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
use Symfony\Component\HttpFoundation\StreamedResponse;

class TalentController extends Controller
{
    public function exportCSV(): StreamedResponse
    {
        $this->authorize('viewAny', Talent::class);

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=talentos_' . now()->format('YmdHis') . '.csv',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Código', 'Nome', 'Email', 'Tipo', 'Status', 'Programa', 'Início']);

            Talent::with('program')->chunk(100, function ($talents) use ($file) {
                foreach ($talents as $talent) {
                    fputcsv($file, [
                        $talent->id,
                        $talent->talent_code,
                        $talent->name,
                        $talent->email,
                        $talent->kind->value,
                        $talent->status->value,
                        $talent->program?->name,
                        $talent->start_date?->format('d/m/Y'),
                    ]);
                }
            });

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Talent::class);

        $talents = Talent::query()
            ->with(['program', 'university', 'department', 'mentor'])
            ->when($request->user()->isMentor(), fn ($q) => $q->where('mentor_user_id', $request->user()->id))
            ->when($request->input('filter.kind'), fn ($q, $v) => $q->where('kind', $v))
            ->when($request->input('filter.status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('filter.program_id'), fn ($q, $v) => $q->where('program_id', $v))
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

    public function show(Request $request, Talent $talento): TalentResource
    {
        $this->authorize('view', $talento);

        $includes = array_filter(explode(',', $request->input('include', '')));
        $allowed = ['program', 'university', 'department', 'mentor', 'rotations', 'payments', 'tasks', 'absences', 'evaluations'];
        $with = array_values(array_intersect($includes, $allowed)) ?: ['program', 'department', 'mentor'];

        return TalentResource::make($talento->load($with));
    }

    public function update(UpdateTalentRequest $request, Talent $talento): TalentResource
    {
        $this->authorize('update', $talento);

        $talento->update($request->validated());

        return TalentResource::make($talento->fresh(['program', 'department', 'mentor']));
    }

    public function destroy(Talent $talento): JsonResponse
    {
        $this->authorize('delete', $talento);
        $talento->delete();

        return response()->json(null, 204);
    }
}
