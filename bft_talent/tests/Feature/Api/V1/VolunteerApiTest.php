<?php

use App\Models\User;
use App\Models\Volunteer;

beforeEach(function () {
    $this->rh = User::factory()->asRh()->create();
    $this->mentor = User::factory()->asMentor()->create();
    $this->voluntario = User::factory()->asVoluntario()->create();
});

describe('index', function () {
    it('rh lista voluntários', function () {
        Volunteer::factory()->count(4)->create();

        $this->actingAs($this->rh)
            ->getJson('/api/v1/voluntarios')
            ->assertOk()
            ->assertJsonCount(4, 'data');
    });

    it('mentor lista voluntários', function () {
        Volunteer::factory()->count(2)->create();

        $this->actingAs($this->mentor)
            ->getJson('/api/v1/voluntarios')
            ->assertOk();
    });
});

describe('store', function () {
    it('rh cria voluntário', function () {
        $this->actingAs($this->rh)
            ->postJson('/api/v1/voluntarios', [
                'nome' => 'Ana Costa',
                'email' => 'ana@test.com',
                'phone' => '+244912000000',
                'area_actuacao' => 'Educação',
                'data_inicio' => now()->toDateString(),
                'motivacao' => 'Quero contribuir para a comunidade.',
            ])
            ->assertCreated()
            ->assertJsonPath('data.status', 'activo');
    });

    it('não-rh não pode criar voluntário', function () {
        $this->actingAs($this->mentor)
            ->postJson('/api/v1/voluntarios', [])
            ->assertForbidden();
    });
});

describe('show', function () {
    it('voluntário vê o próprio perfil', function () {
        $volunteer = Volunteer::factory()->create();
        $user = User::factory()->asVoluntario()->create(['volunteer_id' => $volunteer->id]);

        $this->actingAs($user)
            ->getJson("/api/v1/voluntarios/{$volunteer->id}")
            ->assertOk();
    });
});

describe('destroy', function () {
    it('rh apaga voluntário', function () {
        $volunteer = Volunteer::factory()->create();

        $this->actingAs($this->rh)
            ->deleteJson("/api/v1/voluntarios/{$volunteer->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('volunteers', ['id' => $volunteer->id]);
    });
});
