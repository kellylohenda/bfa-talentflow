<?php

namespace App\Http\Controllers;

use App\Models\Talent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EstagiariosController extends Controller
{
    public function index(Request $request): Response
    {
        $estagiarios = Talent::query()
            ->where('kind', 'estagiario')
            ->with(['program', 'university', 'department', 'mentor', 'rotations'])
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")->orWhere('talent_code', 'like', "%{$s}%");
            }))
            ->when($request->input('status'), fn ($q, $v) => $q->where('status', $v))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('estagiarios/index', [
            'estagiarios' => $estagiarios,
            'filters' => $request->only(['search', 'status']),
        ]);
    }
}
