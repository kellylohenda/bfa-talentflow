<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
});

test('dashboard route exists and returns redirect for guests', function () {
    $response = $this->get(route('dashboard'));

    $response->assertStatus(302);
    $response->assertRedirect(route('login'));
});

test('dashboard returns 200 for authenticated user', function () {
    $user = User::where('email', 'rh@bfa.ao')->first();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertStatus(200);
});

test('all dashboard routes return 302 for guests', function () {
    $routes = [
        'dashboard',
        'talentos.index',
        'candidaturas.index',
        'pagamentos.index',
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
        $response = $this->get(route($route));
        expect($response->status())->toBe(302, "Route {$route} should return 302 for guest");
    }
});
