<?php

namespace App\Http\Controllers;

use App\Models\Talent;
use Inertia\Inertia;
use Inertia\Response;

class SucessaoController extends Controller
{
    public function index(): Response
    {
        $talents = Talent::query()
            ->whereIn('status', ['activo', 'concluido'])
            ->latest()
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'status' => $t->status->value,
                'performance' => (float) ($t->perf ?? 50),
                'potencial' => 100 - (float) ($t->risk_score ?? 50),
            ]);

        $total = $talents->count();
        $altoPotencial = $talents->where('potencial', '>=', 66)->count();
        $altaPerformance = $talents->where('performance', '>=', 66)->count();
        $risco = $talents->where('potencial', '<', 33)->where('performance', '<', 33)->count();

        return Inertia::render('sucessao/index', [
            'data' => $talents,
            'resumo' => [
                'total' => $total,
                'altoPotencial' => $altoPotencial,
                'altaPerformance' => $altaPerformance,
                'risco' => $risco,
            ],
        ]);
    }
}
