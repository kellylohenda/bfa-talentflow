<?php

namespace App\Http\Controllers;

use App\Models\Rotation;
use App\Models\Talent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EstagiariosController extends Controller
{
    public function index(Request $request): Response
    {
        $talents = Talent::query()
            ->where('kind', 'estagiario')
            ->with(['program', 'university', 'department', 'mentor', 'rotations'])
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")->orWhere('talent_code', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        $rotations = Rotation::query()
            ->with(['talent', 'department'])
            ->latest()
            ->get();

        return Inertia::render('estagiarios/index', [
            'talents' => $talents,
            'rotations' => $rotations,
            'filters' => $request->only(['search']),
        ]);
    }
}
