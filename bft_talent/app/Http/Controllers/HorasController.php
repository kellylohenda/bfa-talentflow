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
        $horas = HoursEntry::query()
            ->with(['volunteer', 'activity'])
            ->when($request->input('search'), fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('descricao', 'like', "%{$s}%");
            }))
            ->when($request->input('status'), function ($q, $v) {
                if ($v === 'pendente') {
                    $q->whereNull('validado');
                } elseif ($v === 'validado') {
                    $q->where('validado', true);
                } elseif ($v === 'rejeitado') {
                    $q->where('validado', false);
                }
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('horas/index', [
            'horas' => $horas,
            'filters' => $request->only(['search', 'status']),
            'canValidate' => $request->user()?->can('gerir-talentos'),
        ]);
    }
}
