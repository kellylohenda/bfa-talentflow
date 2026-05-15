<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Payment;
use App\Models\Talent;
use App\Models\Volunteer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        abort_unless($request->user()->canViewAnalytics(), 403, 'Acesso negado.');

        return response()->json([
            'talentos' => [
                'total' => Talent::count(),
                'activos' => Talent::where('status', 'activo')->count(),
                'bolseiros' => Talent::where('kind', 'bolseiro')->count(),
                'estagiarios' => Talent::where('kind', 'estagiario')->count(),
            ],
            'candidaturas' => [
                'total' => Application::count(),
                'em_analise' => Application::where('stage', 'analise')->count(),
                'convertidas' => Application::where('stage', 'convertido')->count(),
            ],
            'pagamentos' => [
                'pendentes' => Payment::where('status', 'pendente')->count(),
                'total_pago_mes' => Payment::where('status', 'pago')
                    ->whereMonth('paid_at', now()->month)
                    ->sum('amount'),
            ],
            'voluntarios' => [
                'total' => Volunteer::count(),
                'activos' => Volunteer::where('status', 'activo')->count(),
            ],
        ]);
    }

    public function geografia(Request $request): JsonResponse
    {
        abort_unless($request->user()->canViewAnalytics(), 403, 'Acesso negado.');

        $geo = Talent::query()
            ->join('universities', 'talents.university_id', '=', 'universities.id')
            ->selectRaw('universities.city, universities.country, count(*) as total')
            ->groupBy('universities.city', 'universities.country')
            ->orderByDesc('total')
            ->get();

        return response()->json($geo);
    }

    public function sucessao(Request $request): JsonResponse
    {
        abort_unless($request->user()->canViewAnalytics(), 403, 'Acesso negado.');

        // Nine-Box: performance (perf) vs risk_score
        $talents = Talent::query()
            ->whereNotNull('perf')
            ->whereNotNull('risk_score')
            ->with(['program', 'department'])
            ->get(['id', 'name', 'perf', 'risk_score', 'program_id', 'department_id']);

        return response()->json($talents);
    }
}
