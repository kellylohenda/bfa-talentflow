<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreMessageRequest;
use App\Http\Resources\Api\V1\MessageResource;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MessageController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $messages = Message::query()
            ->with(['from', 'to'])
            ->where('to_user_id', $request->user()->id)
            ->when($request->boolean('filter.nao_lidas'), fn ($q) => $q->whereNull('read_at'))
            ->latest()
            ->paginate($request->integer('per_page', 25));

        return MessageResource::collection($messages);
    }

    public function sent(Request $request): AnonymousResourceCollection
    {
        $messages = Message::query()
            ->with(['from', 'to'])
            ->where('from_user_id', $request->user()->id)
            ->latest()
            ->paginate($request->integer('per_page', 25));

        return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request): JsonResponse
    {
        $message = Message::create([
            ...$request->validated(),
            'from_user_id' => $request->user()->id,
        ]);

        if ($recipient = $message->to) {
            $recipient->notify(new \App\Notifications\NewMessageReceived($message));
        }

        return MessageResource::make($message->load(['from', 'to']))->response()->setStatusCode(201);
    }

    public function show(Request $request, Message $message): MessageResource
    {
        abort_unless(
            $message->to_user_id === $request->user()->id || $message->from_user_id === $request->user()->id,
            403,
            'Acesso negado.'
        );

        if ($message->to_user_id === $request->user()->id && ! $message->read_at) {
            $message->update(['read_at' => now()]);
        }

        return MessageResource::make($message->load(['from', 'to']));
    }

    public function destroy(Request $request, Message $message): JsonResponse
    {
        abort_unless($message->from_user_id === $request->user()->id, 403, 'Acesso negado.');
        $message->delete();

        return response()->json(null, 204);
    }
}
