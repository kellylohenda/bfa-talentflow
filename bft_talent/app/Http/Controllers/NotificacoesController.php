<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificacoesController extends Controller
{
    public function index(Request $request): Response
    {
        $notificacoes = $request->user()->notifications()
            ->latest()
            ->paginate(25)
            ->withQueryString()
            ->through(function ($n) {
                $data = is_array($n->data) ? $n->data : [];

                return (object) [
                    'id' => $n->id,
                    'type' => $n->type,
                    'title' => $data['title'] ?? $n->type,
                    'message' => $data['message'] ?? '',
                    'read_at' => $n->read_at,
                    'created_at' => $n->created_at,
                ];
            });

        $naoLidasCount = $request->user()->notifications()->whereNull('read_at')->count();

        return Inertia::render('notificacoes/index', [
            'notificacoes' => $notificacoes,
            'naoLidasCount' => $naoLidasCount,
        ]);
    }

    public function markAsRead(Request $request, string $id): RedirectResponse
    {
        $request->user()->notifications()->where('id', $id)->firstOrFail()->update(['read_at' => now()]);

        return redirect()->back();
    }

    public function markAllAsRead(Request $request): RedirectResponse
    {
        $request->user()->notifications()->unread()->update(['read_at' => now()]);

        return redirect()->back();
    }
}
