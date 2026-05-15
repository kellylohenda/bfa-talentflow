<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $messages = Message::query()
            ->where(function ($q) use ($user) {
                $q->where('from_user_id', $user->id)
                    ->orWhere('to_user_id', $user->id);
            })
            ->with(['fromUser', 'toUser'])
            ->latest()
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('chat/index', [
            'messages' => $messages,
        ]);
    }
}
