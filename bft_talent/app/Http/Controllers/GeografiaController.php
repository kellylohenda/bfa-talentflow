<?php

namespace App\Http\Controllers;

use App\Models\Talent;
use Inertia\Inertia;
use Inertia\Response;

class GeografiaController extends Controller
{
    public function index(): Response
    {
        $geoData = Talent::query()
            ->selectRaw('COALESCE(department_id, 0) as department_id, count(*) as total')
            ->groupBy('department_id')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($t) => [
                'provincia' => $t->department?->name ?? 'Sem informação',
                'total' => $t->total,
                'activos' => Talent::where('department_id', $t->department_id)->where('status', 'activo')->count(),
                'universidades' => Talent::where('department_id', $t->department_id)->whereNotNull('university_id')->distinct('university_id')->count('university_id'),
            ]);

        return Inertia::render('geografia/index', [
            'data' => $geoData,
            'resumo' => [
                'totalProvincias' => $geoData->count(),
                'totalTalentos' => $geoData->sum('total'),
                'totalUniversidades' => $geoData->sum('universidades'),
            ],
        ]);
    }
}
