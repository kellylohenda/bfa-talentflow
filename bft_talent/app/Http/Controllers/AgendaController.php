<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AgendaController extends Controller
{
    public function index(Request $request): Response
    {
        $eventos = Evento::query()
            ->with(['inscricoes'])
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('titulo', 'like', "%{$s}%");
            }))
            ->latest()
            ->get();

        return Inertia::render('agenda/index', [
            'eventos' => $eventos,
            'filters' => $request->only(['search']),
            'mesAtual' => now()->format('Y-m-d'),
        ]);
    }
}
