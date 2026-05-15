<?php

namespace App\Http\Controllers\Voluntarios;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Volunteer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VoluntariosController extends Controller
{
    public function index(Request $request): Response
    {
        $volunteers = Volunteer::query()
            ->with(['mentor'])
            ->when($request->input('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('area'), fn ($q, $v) => $q->where('area_actuacao', 'like', "%{$v}%"))
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('nome', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('voluntarios/index', [
            'voluntarios' => $volunteers,
            'filters' => $request->only(['status', 'area', 'search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('gerir-voluntarios');

        return Inertia::render('voluntarios/create', [
            'mentors' => User::where('bfa_role', 'mentor')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('gerir-voluntarios');

        $validated = $request->validate([
            'nome' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:volunteers,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'area_actuacao' => ['required', 'string', 'max:255'],
            'mentor_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'data_inicio' => ['required', 'date'],
            'motivacao' => ['nullable', 'string', 'max:2000'],
        ]);

        $year = now()->format('Y');
        $seq = str_pad(Volunteer::whereYear('created_at', $year)->count() + 1, 4, '0', STR_PAD_LEFT);

        Volunteer::create([
            ...$validated,
            'volunteer_code' => "VOL-{$year}-{$seq}",
            'status' => 'activo',
        ]);

        return redirect()->route('voluntarios.index', $request->route('current_team'))
            ->with('success', 'Voluntário registado com sucesso.');
    }

    public function show(Request $request, Volunteer $voluntario): Response
    {
        return Inertia::render('voluntarios/show', [
            'voluntario' => $voluntario->load(['mentor', 'hoursEntries', 'eventoInscricoes']),
        ]);
    }

    public function destroy(Request $request, Volunteer $voluntario): RedirectResponse
    {
        $this->authorize('gerir-voluntarios');
        $voluntario->delete();

        return redirect()->route('voluntarios.index', $request->route('current_team'))
            ->with('success', 'Voluntário removido.');
    }
}
