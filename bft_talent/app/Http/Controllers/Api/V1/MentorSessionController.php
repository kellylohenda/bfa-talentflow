<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreMentorSessionRequest;
use App\Http\Resources\Api\V1\MentorSessionResource;
use App\Models\MentorSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MentorSessionController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $sessions = MentorSession::query()
            ->with(['mentor'])
            ->when($user->isMentor(), fn ($q) => $q->where('mentor_user_id', $user->id))
            ->when($user->isParticipant(), fn ($q) => $q->where('talent_id', $user->talent_id))
            ->when($request->input('filter.talent_id'), fn ($q, $v) => $q->where('talent_id', $v))
            ->when($request->input('filter.status'), fn ($q, $v) => $q->where('status', $v))
            ->orderByDesc('scheduled_at')
            ->paginate($request->integer('per_page', 25));

        return MentorSessionResource::collection($sessions);
    }

    public function store(StoreMentorSessionRequest $request): JsonResponse
    {
        $year = now()->format('Y');
        $seq = str_pad(MentorSession::whereYear('created_at', $year)->count() + 1, 4, '0', STR_PAD_LEFT);

        $session = MentorSession::create([
            ...$request->validated(),
            'session_code' => "SESS-{$year}-{$seq}",
            'mentor_user_id' => $request->user()->id,
            'status' => 'agendada',
        ]);

        return MentorSessionResource::make($session->load('mentor'))->response()->setStatusCode(201);
    }

    public function show(MentorSession $mentorSession): MentorSessionResource
    {
        return MentorSessionResource::make($mentorSession->load('mentor'));
    }

    public function realizou(Request $request, MentorSession $mentorSession): MentorSessionResource|JsonResponse
    {
        abort_unless($mentorSession->mentor_user_id === $request->user()->id || $request->user()->isRh(), 403, 'Acesso negado.');

        if ($mentorSession->status !== 'agendada') {
            return response()->json(['message' => 'Sessão já foi processada.'], 422);
        }

        $mentorSession->update([
            'status' => 'realizada',
            'notas' => $request->input('notas', $mentorSession->notas),
            'accoes' => $request->input('accoes', $mentorSession->accoes),
        ]);

        return MentorSessionResource::make($mentorSession->fresh('mentor'));
    }

    public function cancelar(Request $request, MentorSession $mentorSession): MentorSessionResource|JsonResponse
    {
        abort_unless($mentorSession->mentor_user_id === $request->user()->id || $request->user()->isRh(), 403, 'Acesso negado.');

        if ($mentorSession->status !== 'agendada') {
            return response()->json(['message' => 'Sessão já foi processada.'], 422);
        }

        $mentorSession->update(['status' => 'cancelada']);

        return MentorSessionResource::make($mentorSession->fresh('mentor'));
    }
}
