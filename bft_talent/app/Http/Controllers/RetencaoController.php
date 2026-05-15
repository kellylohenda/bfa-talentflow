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

        $mesAtual = now()->startOfMonth();
        $entradasMes = Talent::where('created_at', '>=', $mesAtual)->count();
        $saidasMes = Talent::whereIn('status', ['cancelado', 'suspenso', 'concluido'])
            ->where('updated_at', '>=', $mesAtual)
            ->count();

        $tempoMedio = Talent::where('status', 'concluido')
            ->selectRaw('avg(julianday(updated_at) - julianday(created_at)) as dias')
            ->value('dias');

        $historico = Talent::query()
            ->selectRaw("strftime('%Y-%m', created_at) as mes, count(*) as entradas")
            ->groupBy('mes')
            ->orderBy('mes')
            ->get()
            ->map(fn ($r) => [
                'mes' => $r->mes,
                'entradas' => $r->entradas,
            ]);

        return Inertia::render('retencao/index', [
            'data' => [
                'taxaRetencaoGeral' => $taxaRetencao,
                'totalActivos' => $activos,
                'totalSaidas' => $totalSaidas,
                'saidasMes' => $saidasMes,
                'entradasMes' => $entradasMes,
                'tempoMedioPermanencia' => round($tempoMedio ?? 0),
            ],
            'historico' => $historico,
            'causasSaida' => [],
        ]);
    }
}
