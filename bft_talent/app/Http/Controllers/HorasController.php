<?php

namespace App\Http\Controllers;

use App\Models\HoursEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HorasController extends Controller
{
    public function index(Request $request): Response
    {
        $entries = HoursEntry::query()
            ->with(['volunteer'])
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('descricao', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('horas/index', [
            'entries' => $entries,
            'filters' => $request->only(['search']),
        ]);
    }
}
