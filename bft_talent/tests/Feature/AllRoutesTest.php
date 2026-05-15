<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
});

test('authenticated user can access all index routes', function () {
    $user = User::where('email', 'rh@bfa.ao')->first();

    $routes = [
        'dashboard',
        'talentos.index',
        'candidaturas.index',
        'pagamentos.index',
        'workflows.index',
        'voluntarios.index',
        'mensagens.index',
        'documentos.index',
        'eventos.index',
        'relatorios.index',
        'bolseiro.index',
        'mentor.index',
        'tarefas.index',
        'faltas.index',
        'estagiarios.index',
        'avaliacoes.index',
        'agenda.index',
        'actividades.index',
        'horas.index',
        'chat.index',
        'notificacoes.index',
        'geografia.index',
        'roi.index',
        'compliance.index',
        'retencao.index',
        'sucessao.index',
        'relatorios-voluntariado.index',
    ];

    foreach ($routes as $route) {
        $response = $this->actingAs($user)->get(route($route));
        expect($response->status())->toBe(200, "Route {$route} should return 200 for auth user, got {$response->status()}");
    }
});
