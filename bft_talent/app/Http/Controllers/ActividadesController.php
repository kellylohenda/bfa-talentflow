<?php

namespace App\Http\Controllers;

use App\Models\VolunteerActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActividadesController extends Controller
{
    public function index(Request $request): Response
    {
        $actividades = VolunteerActivity::query()
            ->with(['coordenador'])
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('nome', 'like', "%{$s}%");
            }))
            ->latest()
            ->get();

        return Inertia::render('actividades/index', [
            'actividades' => $actividades,
            'filters' => $request->only(['search']),
        ]);
    }
}
