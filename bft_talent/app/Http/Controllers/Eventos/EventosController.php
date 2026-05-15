<?php

namespace App\Http\Controllers\Eventos;

use App\Http\Controllers\Controller;
use App\Models\Evento;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventosController extends Controller
{
    public function index(Request $request): Response
    {
        $eventos = Evento::query()
            ->when($request->input('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('tipo'), fn ($q, $v) => $q->where('tipo', $v))
            ->when($request->input('search'), fn ($q, $s) => $q->where('titulo', 'like', "%{$s}%"))
            ->orderBy('data_inicio', 'desc')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('eventos/index', [
            'eventos' => $eventos,
            'filters' => $request->only(['status', 'tipo', 'search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('gerir-talentos');

        return Inertia::render('eventos/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('gerir-talentos');

        $validated = $request->validate([
            'titulo' => ['required', 'string', 'max:255'],
            'tipo' => ['required', 'string', 'in:formacao,palestra,workshop,networking,outro'],
            'formato' => ['required', 'string', 'in:presencial,online,hibrido'],
            'descricao' => ['nullable', 'string'],
            'data_inicio' => ['required', 'date'],
            'data_fim' => ['nullable', 'date', 'after:data_inicio'],
            'local' => ['nullable', 'string', 'max:255'],
            'vagas' => ['nullable', 'integer', 'min:1'],
        ]);

        Evento::create([...$validated, 'status' => 'planeado']);

        return redirect()->route('eventos.index', $request->route('current_team'))
            ->with('success', 'Evento criado com sucesso.');
    }

    public function show(Request $request, Evento $evento): Response
    {
        return Inertia::render('eventos/show', [
            'evento' => $evento->load('inscricoes'),
        ]);
    }
}
