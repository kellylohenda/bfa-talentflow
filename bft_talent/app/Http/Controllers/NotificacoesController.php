<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;
use Inertia\Response;

class NotificacoesController extends Controller
{
    public function index(): Response
    {
        $notificacoes = DatabaseNotification::query()
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

        $naoLidasCount = DatabaseNotification::whereNull('read_at')->count();

        return Inertia::render('notificacoes/index', [
            'notificacoes' => $notificacoes,
            'naoLidasCount' => $naoLidasCount,
        ]);
    }

    public function markAsRead(Request $request, string $id): RedirectResponse
    {
        DatabaseNotification::where('id', $id)->update(['read_at' => now()]);

        return redirect()->back();
    }

    public function markAllAsRead(Request $request): RedirectResponse
    {
        DatabaseNotification::whereNull('read_at')->update(['read_at' => now()]);

        return redirect()->back();
    }
}
