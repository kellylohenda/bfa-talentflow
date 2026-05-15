<?php

use App\Models\Talent;
use App\Models\User;
use App\Models\Volunteer;

it('me/show retorna perfil autenticado', function () {
    $user = User::factory()->asRh()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/me')
        ->assertOk()
        ->assertJsonPath('id', $user->id)
        ->assertJsonPath('email', $user->email);
});

it('me/bolseiro retorna perfil de talento do utilizador', function () {
    $talent = Talent::factory()->create();
    $user = User::factory()->asBolseiro()->create(['talent_id' => $talent->id]);

    $this->actingAs($user)
        ->getJson('/api/v1/me/bolseiro')
        ->assertOk()
        ->assertJsonPath('id', $talent->id);
});

it('me/bolseiro retorna 404 quando sem perfil de talento', function () {
    $user = User::factory()->asRh()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/me/bolseiro')
        ->assertNotFound();
});

it('me/voluntario retorna perfil de voluntário do utilizador', function () {
    $volunteer = Volunteer::factory()->create();
    $user = User::factory()->asVoluntario()->create(['volunteer_id' => $volunteer->id]);

    $this->actingAs($user)
        ->getJson('/api/v1/me/voluntario')
        ->assertOk()
        ->assertJsonPath('id', $volunteer->id);
});

it('requer autenticação', function () {
    $this->getJson('/api/v1/me')->assertUnauthorized();
});
