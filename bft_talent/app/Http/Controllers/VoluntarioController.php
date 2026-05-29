<?php

namespace App\Http\Controllers;

use App\Models\HoursEntry;
use App\Models\Volunteer;
use App\Models\VolunteerActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoluntarioController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $volunteer = Volunteer::where('id', $user->volunteer_id)
            ->with(['mentor', 'hoursEntries.activity', 'activityInscricoes.activity'])
            ->first();

        if (! $volunteer) {
            abort(404, 'Perfil de voluntário não encontrado.');
        }

        $totalHoras = (float) $volunteer->total_horas;
        $level = match (true) {
            $totalHoras >= 400 => ['label' => 'Platina', 'color' => '#2563EB', 'bg' => '#EFF6FF', 'minH' => 400],
            $totalHoras >= 200 => ['label' => 'Ouro', 'color' => '#D97706', 'bg' => '#FEF9C3', 'minH' => 200],
            $totalHoras >= 100 => ['label' => 'Prata', 'color' => '#6B7280', 'bg' => '#F3F4F6', 'minH' => 100],
            $totalHoras >= 50 => ['label' => 'Bronze', 'color' => '#B45309', 'bg' => '#FEF3C7', 'minH' => 50],
            default => ['label' => 'Iniciante', 'color' => '#6B7280', 'bg' => '#F3F4F6', 'minH' => 0],
        };

        $allLevels = [
            ['label' => 'Iniciante', 'minH' => 0],
            ['label' => 'Bronze', 'minH' => 50],
            ['label' => 'Prata', 'minH' => 100],
            ['label' => 'Ouro', 'minH' => 200],
            ['label' => 'Platina', 'minH' => 400],
        ];

        $levelIndex = array_search($level['label'], array_column($allLevels, 'label'));
        $nextLevel = $allLevels[$levelIndex + 1] ?? null;

        $validH = $volunteer->hoursEntries->where('validado', true)->sum('horas');
        $pendingH = $volunteer->hoursEntries->whereNull('validado')->sum('horas');
        $activityCount = $volunteer->activityInscricoes->count();

        return Inertia::render('voluntario/index', [
            'voluntario' => [
                'id' => $volunteer->id,
                'nome' => $volunteer->nome,
                'email' => $volunteer->email,
                'phone' => $volunteer->phone,
                'area_actuacao' => $volunteer->area_actuacao,
                'total_horas' => $volunteer->total_horas,
                'data_inicio' => $volunteer->data_inicio?->format('d/m/Y'),
                'motivacao' => $volunteer->motivacao,
                'status' => $volunteer->status,
                'volunteer_code' => $volunteer->volunteer_code,
                'mentor' => $volunteer->mentor ? [
                    'name' => $volunteer->mentor->name,
                    'email' => $volunteer->mentor->email,
                ] : null,
            ],
            'hoursEntries' => $volunteer->hoursEntries
                ->sortByDesc('data')
                ->map(fn ($h) => [
                    'id' => $h->id,
                    'data' => $h->data?->format('d/m/Y'),
                    'horas' => $h->horas,
                    'actividade' => $h->activity?->nome ?? '—',
                    'validado' => $h->validado,
                    'validado_por' => $h->validadoPor?->name ?? null,
                ]),
            'activities' => VolunteerActivity::where('status', '!=', 'cancelada')
                ->orderBy('data')
                ->get()
                ->map(fn ($a) => [
                    'id' => $a->id,
                    'nome' => $a->nome,
                    'tipo' => $a->tipo,
                    'data' => $a->data?->format('d/m/Y'),
                    'hora_inicio' => $a->hora_inicio,
                    'hora_fim' => $a->hora_fim,
                    'local' => $a->local,
                    'vagas_total' => $a->vagas_total,
                    'inscritos_count' => $a->inscritos_count,
                    'status' => $a->status,
                    'descricao' => $a->descricao,
                ]),
            'inscricoes' => $volunteer->activityInscricoes
                ->map(fn ($i) => [
                    'activity_id' => $i->activity_id,
                    'actividade_nome' => $i->activity?->nome ?? '—',
                    'data' => $i->activity?->data?->format('d/m/Y'),
                    'presente' => $i->presente,
                    'horas_registadas' => $i->horas_registadas,
                ]),
            'level' => $level,
            'nextLevel' => $nextLevel ? [
                'label' => $nextLevel['label'],
                'minH' => $nextLevel['minH'],
                'hoursNeeded' => $nextLevel['minH'] - $totalHoras,
            ] : null,
            'stats' => [
                'totalHoras' => $totalHoras,
                'validH' => $validH,
                'pendingH' => $pendingH,
                'activityCount' => $activityCount,
            ],
        ]);
    }

    public function storeHoras(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'activity_id' => 'nullable|exists:volunteer_activities,id',
            'data' => 'required|date|before_or_equal:today',
            'horas' => 'required|numeric|min:0.5|max:24',
            'descricao' => 'nullable|string|max:500',
        ]);

        $year = now()->format('Y');
        $seq = str_pad(
            HoursEntry::whereYear('created_at', $year)->count() + 1,
            6, '0', STR_PAD_LEFT
        );

        HoursEntry::create([
            'hour_code' => "HRS-{$year}-{$seq}",
            'volunteer_id' => $user->volunteer_id,
            'activity_id' => $validated['activity_id'] ?? null,
            'data' => $validated['data'],
            'horas' => $validated['horas'],
            'descricao' => $validated['descricao'] ?? null,
            'validado' => null,
        ]);

        return redirect()->route('voluntario.index')
            ->with('success', 'Horas registadas com sucesso. Aguarda validação do mentor.');
    }
}
