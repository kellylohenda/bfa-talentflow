<?php

namespace App\Http\Controllers;

use App\Models\Talent;
use Inertia\Inertia;
use Inertia\Response;

class RoiController extends Controller
{
    public function index(): Response
    {
        $totalInvestido = (float) Talent::sum('stipend');
        $retornoEstimado = $totalInvestido * 2.5;
        $roi = $totalInvestido > 0 ? round(($retornoEstimado - $totalInvestido) / $totalInvestido * 100, 1) : 0;
        $talentosActivos = Talent::where('status', 'activo')->count();
        $total = Talent::count();
        $custoPorTalento = $total > 0 ? round($totalInvestido / $total, 2) : 0;
        $produtividadeMedia = (float) Talent::avg('perf');
        $taxaRetencao = $total > 0 ? round(($talentosActivos / $total) * 100, 1) : 0;

        $historico = Talent::query()
            ->selectRaw("strftime('%Y', created_at) as ano, sum(stipend) as investido, count(*) as talentos")
            ->groupBy('ano')
            ->orderBy('ano')
            ->get()
            ->map(fn ($r) => [
                'periodo' => $r->ano,
                'investimento' => (float) $r->investido,
                'retorno' => (float) $r->investido * 2.5,
                'talentos' => $r->talentos,
            ]);

        return Inertia::render('roi/index', [
            'data' => [
                'totalInvestido' => $totalInvestido,
                'retornoEstimado' => $retornoEstimado,
                'roi' => $roi,
                'custoPorTalento' => $custoPorTalento,
                'produtividadeMedia' => round($produtividadeMedia, 1),
                'taxaRetencao' => $taxaRetencao,
            ],
            'historico' => $historico,
        ]);
    }
}
