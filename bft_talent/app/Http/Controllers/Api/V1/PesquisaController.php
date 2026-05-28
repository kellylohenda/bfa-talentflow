<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Evento;
use App\Models\Payment;
use App\Models\Talent;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PesquisaController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $query = $request->input('q', '');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $results = [];
        $user = $request->user();
        $role = $user->bfa_role ?? 'rh';

        // Pesquisar talentos (rh, direcao, mentor veem todos; participantes veem apenas a si)
        if (in_array($role, ['rh', 'direcao', 'mentor'])) {
            $talents = Talent::query()
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                        ->orWhere('talent_code', 'like', "%{$query}%")
                        ->orWhere('email', 'like', "%{$query}%");
                })
                ->with(['program', 'university'])
                ->limit(5)
                ->get();

            foreach ($talents as $t) {
                $results[] = [
                    'id' => $t->talent_code,
                    'label' => $t->name,
                    'sub' => $t->program->name ?? '—',
                    'icon' => 'users',
                    'href' => "/talentos/{$t->id}",
                    'category' => 'talentos',
                ];
            }
        } elseif ($user->talent_id) {
            // Participante: apenas o próprio talento
            $t = Talent::find($user->talent_id);
            if ($t && (
                str_contains(mb_strtolower($t->name), mb_strtolower($query)) ||
                str_contains($t->talent_code, $query)
            )) {
                $results[] = [
                    'id' => $t->talent_code,
                    'label' => $t->name,
                    'sub' => $t->program->name ?? '—',
                    'icon' => 'users',
                    'href' => '/bolseiro',
                    'category' => 'talentos',
                ];
            }
        }

        // Pesquisar candidaturas (apenas rh)
        if ($role === 'rh') {
            $applications = Application::query()
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                        ->orWhere('application_ref', 'like', "%{$query}%")
                        ->orWhere('email', 'like', "%{$query}%");
                })
                ->with('program')
                ->limit(3)
                ->get();

            foreach ($applications as $a) {
                $results[] = [
                    'id' => $a->application_ref,
                    'label' => $a->name,
                    'sub' => $a->program->name ?? '—',
                    'icon' => 'clipboard',
                    'href' => "/candidaturas/{$a->id}",
                    'category' => 'candidaturas',
                ];
            }
        }

        // Pesquisar pagamentos (rh, direcao)
        if (in_array($role, ['rh', 'direcao'])) {
            $payments = Payment::query()
                ->where(function ($q) use ($query) {
                    $q->where('payment_ref', 'like', "%{$query}%")
                        ->orWhere('type', 'like', "%{$query}%");
                })
                ->with('talent')
                ->limit(3)
                ->get();

            foreach ($payments as $p) {
                $results[] = [
                    'id' => $p->payment_ref,
                    'label' => $p->payment_ref,
                    'sub' => $p->talent->name ?? '—',
                    'icon' => 'credit-card',
                    'href' => "/pagamentos/{$p->id}",
                    'category' => 'pagamentos',
                ];
            }
        }

        // Pesquisar tarefas (todos os roles)
        $tasksQuery = Task::query()
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('task_code', 'like', "%{$query}%");
            })
            ->with('talent');

        // Filtrar por role
        if (in_array($role, ['bolseiro', 'estagiario'])) {
            $tasksQuery->where('talent_id', $user->talent_id);
        } elseif ($role === 'mentor') {
            $menteeIds = Talent::where('mentor_user_id', $user->id)->pluck('id');
            $tasksQuery->whereIn('talent_id', $menteeIds);
        }

        $tasks = $tasksQuery->limit(3)->get();

        foreach ($tasks as $t) {
            $results[] = [
                'id' => $t->task_code,
                'label' => $t->title,
                'sub' => $t->talent->name ?? '—',
                'icon' => 'check-square',
                'href' => "/tarefas/{$t->id}",
                'category' => 'tarefas',
            ];
        }

        // Pesquisar eventos/agenda
        $events = Evento::query()
            ->where(function ($q) use ($query) {
                $q->where('titulo', 'like', "%{$query}%")
                    ->orWhere('event_code', 'like', "%{$query}%");
            })
            ->limit(2)
            ->get();

        foreach ($events as $e) {
            $results[] = [
                'id' => $e->event_code,
                'label' => $e->titulo,
                'sub' => $e->local ?? '—',
                'icon' => 'calendar',
                'href' => '/agenda',
                'category' => 'eventos',
            ];
        }

        return response()->json(array_slice($results, 0, 10));
    }
}
