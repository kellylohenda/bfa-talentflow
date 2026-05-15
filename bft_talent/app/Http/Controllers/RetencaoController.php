<?php

namespace App\Http\Controllers;

use App\Models\Talent;
use Inertia\Inertia;
use Inertia\Response;

class RetencaoController extends Controller
{
    public function index(): Response
    {
        $total = Talent::count();
        $activos = Talent::where('status', 'activo')->count();
        $saidas = Talent::whereIn('status', ['cancelado', 'suspenso'])->count();
        $concluidos = Talent::where('status', 'concluido')->count();
        $totalSaidas = $saidas + $concluidos;
        $taxaRetencao = $total > 0 ? round(($activos / $total) * 100, 1) : 0;

        return Inertia::render('retencao/index', [
            'data' => [
                'taxaRetencaoGeral' => $taxaRetencao,
                'totalActivos' => $activos,
                'totalSaidas' => $totalSaidas,
                'saidasMes' => 0,
                'entradasMes' => 0,
                'tempoMedioPermanencia' => 0,
            ],
            'historico' => [],
            'causasSaida' => [],
        ]);
    }
}
