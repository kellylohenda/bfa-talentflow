<?php

namespace App\Http\Controllers;

use App\Models\HoursEntry;
use App\Models\Talent;
use App\Models\Volunteer;
use App\Models\VolunteerActivity;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RelatoriosVoluntariadoController extends Controller
{
    public function index(): Response
    {
        $totalHoras = (float) HoursEntry::sum('horas');
        $totalVoluntarios = Volunteer::count();
        $mediaHorasMes = $totalVoluntarios > 0 ? round($totalHoras / $totalVoluntarios, 1) : 0;
        $totalTalentos = Talent::count();
        $taxaParticipacao = $totalTalentos > 0 ? min(round(($totalVoluntarios / $totalTalentos) * 100, 1), 100) : 0;

        $actividadesRealizadas = VolunteerActivity::count();
        $impactoEstimado = $totalHoras > 0 ? round($totalHoras * 1500, 0).' Kz' : '—';

        $porArea = DB::table('hours_entries as he')
            ->join('volunteer_activities as va', 'he.activity_id', '=', 'va.id')
            ->selectRaw('va.tipo, sum(he.horas) as total_horas, count(distinct he.volunteer_id) as voluntarios')
            ->groupBy('va.tipo')
            ->get()
            ->map(fn ($r) => [
                'area' => $r->tipo,
                'horas' => (float) $r->total_horas,
                'voluntarios' => $r->voluntarios,
            ]);

        $historico = DB::table('hours_entries')
            ->selectRaw("strftime('%Y-%m', data) as mes, sum(horas) as total_horas")
            ->groupBy('mes')
            ->orderBy('mes')
            ->get()
            ->map(fn ($r) => [
                'mes' => $r->mes,
                'horas' => (float) $r->total_horas,
            ]);

        return Inertia::render('relatorios-voluntariado/index', [
            'data' => [
                'totalVoluntarios' => $totalVoluntarios,
                'totalHoras' => $totalHoras,
                'mediaHorasMes' => $mediaHorasMes,
                'taxaParticipacao' => $taxaParticipacao,
                'actividadesRealizadas' => $actividadesRealizadas,
                'impactoEstimado' => $impactoEstimado,
            ],
            'porArea' => $porArea,
            'historico' => $historico,
        ]);
    }
}
