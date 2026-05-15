<?php

namespace App\Http\Controllers;

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
            ->withQueryString();

        $naoLidasCount = DatabaseNotification::whereNull('read_at')->count();

        return Inertia::render('notificacoes/index', [
            'notificacoes' => $notificacoes,
            'naoLidasCount' => $naoLidasCount,
        ]);
    }
}
