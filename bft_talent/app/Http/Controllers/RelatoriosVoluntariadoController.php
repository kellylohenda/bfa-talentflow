<?php

namespace App\Http\Controllers;

use App\Models\HoursEntry;
use App\Models\Talent;
use App\Models\Volunteer;
use Inertia\Inertia;
use Inertia\Response;

class RelatoriosVoluntariadoController extends Controller
{
    public function index(): Response
    {
        $totalHoras = (float) HoursEntry::sum('hours');
        $totalVoluntarios = Volunteer::count();
        $mediaHorasMes = $totalVoluntarios > 0 ? round($totalHoras / $totalVoluntarios, 1) : 0;
        $totalTalentos = Talent::count();
        $taxaParticipacao = $totalTalentos > 0 ? min(round(($totalVoluntarios / $totalTalentos) * 100, 1), 100) : 0;

        return Inertia::render('relatorios-voluntariado/index', [
            'data' => [
                'totalVoluntarios' => $totalVoluntarios,
                'totalHoras' => $totalHoras,
                'mediaHorasMes' => $mediaHorasMes,
                'taxaParticipacao' => $taxaParticipacao,
                'actividadesRealizadas' => 0,
                'impactoEstimado' => '—',
            ],
            'porArea' => [],
            'historico' => [],
        ]);
    }
}
