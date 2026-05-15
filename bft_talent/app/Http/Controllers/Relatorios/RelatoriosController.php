<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Payment;
use App\Models\Talent;
use App\Models\Volunteer;
use App\Models\Workflow;
use Inertia\Inertia;
use Inertia\Response;

class RelatoriosController extends Controller
{
    public function index(): Response
    {
        $this->authorize('ver-analytics');

        return Inertia::render('relatorios/index', [
            'stats' => Inertia::defer(fn () => [
                'talentos' => [
                    'total' => Talent::count(),
                    'activos' => Talent::where('status', 'activo')->count(),
                    'bolseiros' => Talent::where('kind', 'bolseiro')->count(),
                    'estagiarios' => Talent::where('kind', 'estagiario')->count(),
                ],
                'candidaturas' => [
                    'total' => Application::count(),
                    'pendentes' => Application::where('status', 'pendente')->count(),
                    'aprovadas' => Application::where('status', 'aprovada')->count(),
                    'rejeitadas' => Application::where('status', 'rejeitada')->count(),
                ],
                'pagamentos' => [
                    'total' => Payment::count(),
                    'pendentes' => Payment::where('status', 'pendente')->count(),
                    'pagos' => Payment::where('status', 'pago')->count(),
                    'valor_total' => Payment::where('status', 'pago')->sum('amount'),
                ],
                'voluntarios' => [
                    'total' => Volunteer::count(),
                    'activos' => Volunteer::where('status', 'activo')->count(),
                ],
                'workflows' => [
                    'pendentes' => Workflow::where('status', 'pendente')->count(),
                    'em_aprovacao' => Workflow::where('status', 'em_aprovacao')->count(),
                ],
            ]),
        ]);
    }
}
