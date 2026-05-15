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
        $activities = VolunteerActivity::query()
            ->with(['volunteer'])
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('nome', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('actividades/index', [
            'activities' => $activities,
            'filters' => $request->only(['search']),
        ]);
    }
}
