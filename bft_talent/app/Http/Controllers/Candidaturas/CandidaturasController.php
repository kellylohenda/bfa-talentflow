<?php

namespace App\Http\Controllers\Candidaturas;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Program;
use App\Models\University;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CandidaturasController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('ver-candidaturas');

        $candidaturas = Application::query()
            ->with(['program', 'university'])
            ->when($request->input('stage'), fn ($q, $v) => $q->where('stage', $v))
            ->when($request->input('tipo'), fn ($q, $v) => $q->where('tipo', $v))
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('candidaturas/index', [
            'candidaturas' => $candidaturas,
            'filters' => $request->only(['stage', 'tipo', 'search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('gerir-talentos');

        return Inertia::render('candidaturas/create', [
            'programs' => Program::orderBy('name')->get(['id', 'name', 'code']),
            'universities' => University::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('gerir-talentos');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:applications,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'program_id' => ['required', 'integer', 'exists:programs,id'],
            'university_id' => ['nullable', 'integer', 'exists:universities,id'],
            'tipo' => ['nullable', 'string', 'in:bolseiro,estagiario'],
            'observacoes' => ['nullable', 'string', 'max:2000'],
        ]);

        Application::create([...$validated, 'stage' => 'analise']);

        return redirect()->route('candidaturas.index', $request->route('current_team'))
            ->with('success', 'Candidatura criada com sucesso.');
    }

    public function show(Request $request, Application $candidatura): Response
    {
        $this->authorize('ver-candidaturas');

        return Inertia::render('candidaturas/show', [
            'candidatura' => $candidatura->load(['program', 'university', 'convertedTalent']),
        ]);
    }

    public function destroy(Request $request, Application $candidatura): RedirectResponse
    {
        $this->authorize('gerir-talentos');
        $candidatura->delete();

        return redirect()->route('candidaturas.index', $request->route('current_team'))
            ->with('success', 'Candidatura removida.');
    }
}
