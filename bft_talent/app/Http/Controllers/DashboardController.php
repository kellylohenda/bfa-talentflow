<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Evento;
use App\Models\Payment;
use App\Models\Talent;
use App\Models\Volunteer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();
        $role = $user->bfaRole;

        if ($role?->isBolseiro() || $role?->isEstagiario()) {
            return redirect()->route('bolseiro.index');
        }
        if ($role?->isVoluntario()) {
            return redirect()->route('voluntario.index');
        }

        abort_unless($role?->isStaff(), 403);

        $totalTalents = Talent::count();
        $activeTalents = Talent::where('status', 'activo')->count();
        $totalApplications = Application::count();
        $totalPayments = Payment::count();
        $totalVolunteers = Volunteer::count();
        $totalEvents = Evento::count();

        $talentsByProgram = Talent::selectRaw('program_id, count(*) as total')
            ->groupBy('program_id')
            ->with('program')
            ->get()
            ->map(fn ($t) => [
                'program' => $t->program?->name ?? 'N/A',
                'total' => $t->total,
            ]);

        $talentsByStatus = Talent::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn ($t) => [$t->status->value => $t->total]);

        $recentApplications = Application::with('program')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'name' => $a->name,
                'stage' => $a->stage,
                'program' => $a->program?->name,
                'created_at' => $a->created_at->diffForHumans(),
            ]);

        $recentPayments = Payment::with('talent')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'talent' => $p->talent?->name,
                'amount' => $p->amount,
                'status' => $p->status,
                'created_at' => $p->created_at->diffForHumans(),
            ]);

        $topTalents = Talent::where('status', 'activo')
            ->orderByDesc('perf')
            ->take(5)
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'program' => $t->program?->name,
                'perf' => $t->perf,
                'status' => $t->status,
                'risk_score' => $t->risk_score,
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'totalTalents' => $totalTalents,
                'activeTalents' => $activeTalents,
                'totalApplications' => $totalApplications,
                'totalPayments' => $totalPayments,
                'totalVolunteers' => $totalVolunteers,
                'totalEvents' => $totalEvents,
            ],
            'talentsByProgram' => $talentsByProgram,
            'talentsByStatus' => $talentsByStatus,
            'recentApplications' => $recentApplications,
            'recentPayments' => $recentPayments,
            'topTalents' => $topTalents,
            'userRole' => $role,
        ]);
    }
}
